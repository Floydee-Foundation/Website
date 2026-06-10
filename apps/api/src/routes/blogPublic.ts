import { Router } from "express";
import { connectMongo } from "../config/mongo.js";
import { BlogCategoryModel, BlogPostModel } from "../models/blog.js";
import { getString, isMongoReady, isProgramAssociation, toSlug } from "../utils/blog.js";
import type { BlogCategory, BlogContentBlock, BlogPost } from "@floydee/shared";

export const blogPublicRouter = Router();

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
    categorySlugs: post.categorySlugs ?? [],
    createdAt: post.createdAt?.toISOString?.(),
    excerpt: post.excerpt ?? "",
    heroImage: post.heroImage?.url ? post.heroImage : undefined,
    id: String(post._id),
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

  const categories = await BlogCategoryModel.find({ status: "active" }).sort({ name: 1 }).lean();
  response.json({ categories: categories.map(serializeCategory), ok: true });
});

blogPublicRouter.get("/api/blog-posts", async (request, response) => {
  if (!(await ensureMongoReady())) {
    response.status(503).json({ ok: false, posts: [], message: storageUnavailableMessage() });
    return;
  }

  const filter: Record<string, unknown> = { status: "published" };
  const categorySlug = toSlug(request.query.categorySlug);
  const programSlug = getString(request.query.programSlug);
  const tag = getString(request.query.tag);

  if (categorySlug) filter.categorySlugs = categorySlug;
  if (isProgramAssociation(programSlug)) filter.programAssociation = programSlug;
  if (tag) filter.tags = tag;

  const posts = await BlogPostModel.find(filter).sort({ publishedAt: -1, updatedAt: -1 }).lean();
  response.json({ ok: true, posts: posts.map(serializePost) });
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

  response.json({ ok: true, post: serializePost(post) });
});
