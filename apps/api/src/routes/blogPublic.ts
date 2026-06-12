import { Router, type Response } from "express";
import { connectMongo } from "../config/mongo.js";
import { BlogCategoryModel, BlogPostModel } from "../models/blog.js";
import { getString, isBlogCategoryKind, isBlogChannel, isMongoReady, isProgramAssociation, toSlug } from "../utils/blog.js";
import type { BlogCategory, BlogContentBlock, BlogPost } from "@floydee/shared";

export const blogPublicRouter = Router();
const publicCacheHeader = "public, s-maxage=60, stale-while-revalidate=86400, stale-if-error=604800";

function sendSuccess(response: Response, payload: unknown) {
  response.set("Cache-Control", publicCacheHeader);
  response.json(payload);
}

function storageUnavailableMessage() {
  return "Blog storage is temporarily unavailable. Please retry in a moment.";
}

async function ensureMongoReady() {
  try {
    await connectMongo();
    return isMongoReady();
  } catch {
    return false;
  }
}

function serializeCategory(category: any): BlogCategory {
  return {
    createdAt: category.createdAt?.toISOString?.(),
    description: category.description || undefined,
    id: String(category._id),
    kind: category.kind ?? "general",
    name: category.name,
    programAssociation: category.programAssociation,
    slug: category.slug,
    status: category.status,
    updatedAt: category.updatedAt?.toISOString?.()
  };
}

function serializePost(post: any): BlogPost {
  return {
    author: post.author || undefined,
    blocks: (post.blocks ?? []) as BlogContentBlock[],
    categoryKind: post.categoryKind ?? "general",
    categorySlug: post.categoryKind && post.categoryKind !== "general" ? post.categorySlug || undefined : undefined,
    categorySlugs: post.categorySlugs ?? [],
    channels: post.channels?.filter(isBlogChannel) ?? [],
    createdAt: post.createdAt?.toISOString?.(),
    eventDate: post.eventDate?.toISOString?.().slice(0, 10),
    excerpt: post.excerpt ?? "",
    featured: post.featured === true || undefined,
    heroImage: post.heroImage?.url ? post.heroImage : undefined,
    id: String(post._id),
    location: post.location || undefined,
    programAssociation: post.programAssociation ?? "general",
    publishedAt: post.publishedAt?.toISOString?.(),
    seo: {
      description: post.seo?.description || undefined,
      keywords: post.seo?.keywords ?? [],
      title: post.seo?.title || undefined
    },
    slug: post.slug,
    status: post.status,
    tags: post.tags ?? [],
    title: post.title ?? "",
    updatedAt: post.updatedAt?.toISOString?.()
  };
}

blogPublicRouter.get("/api/blog-categories", async (_request, response) => {
  if (!(await ensureMongoReady())) {
    response.status(503).json({ categories: [], ok: false, message: storageUnavailableMessage() });
    return;
  }

  const categories = await BlogCategoryModel.find({ kind: { $in: ["workshop", "campaign"] }, status: "active" }).sort({ programAssociation: 1, kind: 1, name: 1 }).lean();
  sendSuccess(response, { categories: categories.map(serializeCategory), ok: true });
});

blogPublicRouter.get("/api/blog-posts", async (request, response) => {
  if (!(await ensureMongoReady())) {
    response.status(503).json({ ok: false, posts: [], message: storageUnavailableMessage() });
    return;
  }

  const filter: Record<string, unknown> = { status: "published" };
  const categoryKind = getString(request.query.categoryKind);
  const categorySlug = toSlug(request.query.categorySlug);
  const channel = getString(request.query.channel);
  const eventYear = Number.parseInt(getString(request.query.eventYear), 10);
  const excludeSlug = toSlug(request.query.excludeSlug);
  const featured = getString(request.query.featured);
  const programSlug = getString(request.query.programSlug);
  const location = getString(request.query.location);
  const q = getString(request.query.q);
  const sort = getString(request.query.sort) === "oldest" ? "oldest" : "latest";
  const tag = getString(request.query.tag);
  const requestedPage = Number.parseInt(getString(request.query.page), 10);
  const requestedPageSize = Number.parseInt(getString(request.query.pageSize), 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize = Number.isFinite(requestedPageSize) ? Math.min(Math.max(requestedPageSize, 1), 24) : 9;

  if (isBlogCategoryKind(categoryKind)) filter.categoryKind = categoryKind;
  if (categorySlug) filter.categorySlug = categorySlug;
  if (isBlogChannel(channel)) filter.channels = channel;
  if (excludeSlug) filter.slug = { $ne: excludeSlug };
  if (featured === "true") filter.featured = true;
  if (isProgramAssociation(programSlug)) filter.programAssociation = programSlug;
  if (tag) filter.tags = tag;
  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const search = new RegExp(escaped, "i");
    filter.$or = [{ title: search }, { excerpt: search }, { author: search }, { tags: search }];
  }

  const facetFilter = { ...filter };
  if (location) filter.location = location;
  if (Number.isFinite(eventYear) && eventYear >= 1900 && eventYear <= 2200) {
    filter.eventDate = {
      $gte: new Date(`${eventYear}-01-01T00:00:00.000Z`),
      $lt: new Date(`${eventYear + 1}-01-01T00:00:00.000Z`)
    };
  }

  const [locations, eventYears] = await Promise.all([
    BlogPostModel.distinct("location", { ...facetFilter, location: { $nin: [null, ""] } }),
    BlogPostModel.aggregate<{ _id: number }>([
      { $match: { ...facetFilter, eventDate: { $type: "date" } } },
      { $group: { _id: { $year: "$eventDate" } } },
      { $sort: { _id: -1 } }
    ])
  ]);
  const total = await BlogPostModel.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const sortOrder = sort === "oldest" ? 1 : -1;
  const posts = await BlogPostModel.find(filter)
    .sort({ publishedAt: sortOrder, updatedAt: sortOrder })
    .skip((safePage - 1) * pageSize)
    .limit(pageSize)
    .lean();

  sendSuccess(response, {
    ok: true,
    page: safePage,
    pageSize,
    posts: posts.map(serializePost),
    facets: {
      eventYears: eventYears.map((item) => item._id),
      locations: locations.filter(Boolean).sort((a, b) => a.localeCompare(b))
    },
    total,
    totalPages
  });
});

blogPublicRouter.get("/api/blog-posts/:slug", async (request, response) => {
  if (!(await ensureMongoReady())) {
    response.status(503).json({ ok: false, message: storageUnavailableMessage() });
    return;
  }

  const post = await BlogPostModel.findOne({ slug: toSlug(request.params.slug), status: "published" }).lean();
  if (!post) {
    response.status(404).json({ ok: false, message: "Blog post not found." });
    return;
  }

  sendSuccess(response, { ok: true, post: serializePost(post) });
});
