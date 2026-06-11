import { Router, type NextFunction, type Request, type Response } from "express";
import { env } from "../config/env.js";
import { connectMongo } from "../config/mongo.js";
import { BlogCategoryModel, BlogPostModel, type BlogPostDocument } from "../models/blog.js";
import {
  getString,
  getStringList,
  isGoogleDriveUrl,
  isBlogStatus,
  isMongoReady,
  isProgramAssociation,
  isValidHttpUrl,
  isYoutubeUrl,
  sanitizeBlocks,
  sanitizeImageMedia,
  signAdminToken,
  toSlug,
  verifyAdminToken
} from "../utils/blog.js";
import type { BlogCategory, BlogContentBlock, BlogImageMedia, BlogPost, BlogProgramAssociation, BlogStatus } from "@floydee/shared";

export const blogAdminRouter = Router();

function sendDatabaseUnavailable(response: Response) {
  response.status(503).json({
    ok: false,
    message: env.mongoUri
      ? "Blog storage is temporarily unavailable. Please retry in a moment."
      : "Blog storage is not configured. Set MONGODB_URI and restart the API."
  });
}

async function requireMongo(_request: Request, response: Response, next: NextFunction) {
  try {
    await connectMongo();
  } catch {
    sendDatabaseUnavailable(response);
    return;
  }

  if (!isMongoReady()) {
    sendDatabaseUnavailable(response);
    return;
  }

  next();
}

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const secret = env.blogAdminSessionSecret;
  const token = getString(request.headers.authorization).replace(/^Bearer\s+/i, "");

  if (!secret || !token || !verifyAdminToken(token, secret)) {
    response.status(401).json({
      ok: false,
      message: "Admin session required."
    });
    return;
  }

  next();
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
    featured: post.featured === true || undefined,
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

async function getActiveCategorySlugs(slugs: string[]) {
  if (!slugs.length) return [];
  const categories = await BlogCategoryModel.find({ slug: { $in: slugs }, status: "active" }).lean();
  return categories.map((category) => category.slug);
}

async function inferProgramAssociation(slugs: string[], fallback: BlogProgramAssociation) {
  const categories = await BlogCategoryModel.find({ slug: { $in: slugs }, status: "active" }).lean();
  return categories.find((category) => category.programAssociation !== "general")?.programAssociation ?? fallback;
}

function validateMedia(media: BlogImageMedia | undefined, errors: string[], label: string) {
  if (media?.url && !isValidHttpUrl(media.url)) errors.push(`${label} must be a valid http or https URL.`);
  if (media?.url && isGoogleDriveUrl(media.url) && !media.publicAccessConfirmed) {
    errors.push(`${label} from Google Drive requires confirmation that anyone on the internet with the link can view.`);
  }
}

function validateBlocks(blocks: BlogContentBlock[], errors: string[]) {
  blocks.forEach((block) => {
    if (block.type === "image") validateMedia(block.media, errors, "Image block URL");
    if (block.type === "youtube" && !isYoutubeUrl(block.url) && !isGoogleDriveUrl(block.url)) {
      errors.push("Video block URL must be a valid YouTube or Google Drive link.");
    }
    if (block.type === "youtube" && isGoogleDriveUrl(block.url) && !block.publicAccessConfirmed) {
      errors.push("Google Drive video requires confirmation that anyone on the internet with the link can view.");
    }
  });
}

async function buildPostPayload(body: Record<string, unknown>, existingStatus: BlogStatus = "draft") {
  const title = getString(body.title);
  const status = isBlogStatus(body.status) ? body.status : existingStatus;
  const categorySlugs = getStringList(body.categorySlugs).map(toSlug).filter(Boolean);
  const activeCategorySlugs = await getActiveCategorySlugs(categorySlugs);
  const fallbackProgram = isProgramAssociation(body.programAssociation) ? body.programAssociation : "general";
  const heroImage = sanitizeImageMedia(body.heroImage);
  const blocks = sanitizeBlocks(body.blocks);
  const seo = body.seo && typeof body.seo === "object" ? body.seo as Record<string, unknown> : {};
  const publishedAt = body.publishedAt instanceof Date
    ? body.publishedAt
    : body.publishedAt
      ? new Date(getString(body.publishedAt))
      : undefined;
  const errors: string[] = [];

  validateMedia(heroImage, errors, "Hero image URL");
  validateBlocks(blocks, errors);

  const payload = {
    author: getString(body.author),
    blocks,
    categorySlugs: activeCategorySlugs,
    excerpt: getString(body.excerpt),
    featured: body.featured === true,
    heroImage,
    programAssociation: await inferProgramAssociation(activeCategorySlugs, fallbackProgram),
    publishedAt,
    seo: {
      description: getString(seo.description),
      keywords: getStringList(seo.keywords),
      title: getString(seo.title)
    },
    slug: toSlug(body.slug) || toSlug(title),
    status,
    tags: getStringList(body.tags),
    title
  };

  if (!payload.slug) errors.push("Slug is required.");
  if (payload.publishedAt && Number.isNaN(payload.publishedAt.getTime())) errors.push("Publish date is invalid.");

  if (status === "published") {
    if (!payload.title) errors.push("Title is required before publishing.");
    if (!payload.excerpt) errors.push("Excerpt is required before publishing.");
    if (!payload.categorySlugs.length) errors.push("At least one active category is required before publishing.");
    if (!payload.blocks.length) errors.push("At least one content block is required before publishing.");
    payload.publishedAt ??= new Date();
  }

  return { errors, payload };
}

blogAdminRouter.post("/api/admin/session", (request, response) => {
  const configuredPasscode = env.blogAdminPasscode;
  const sessionSecret = env.blogAdminSessionSecret;
  const passcode = getString(request.body.passcode);

  if (!configuredPasscode || !sessionSecret) {
    response.status(503).json({
      ok: false,
      message: "Blog admin passcode is not configured."
    });
    return;
  }

  if (passcode !== configuredPasscode) {
    response.status(401).json({
      ok: false,
      message: "The admin passcode is not correct."
    });
    return;
  }

  response.json({
    ok: true,
    token: signAdminToken(sessionSecret)
  });
});

blogAdminRouter.get("/api/admin/blog-categories", requireAdmin, requireMongo, async (_request, response) => {
  const categories = await BlogCategoryModel.find().sort({ status: 1, name: 1 }).lean();
  response.json({ categories: categories.map(serializeCategory), ok: true });
});

blogAdminRouter.post("/api/admin/blog-categories", requireAdmin, requireMongo, async (request, response) => {
  const name = getString(request.body.name);
  const slug = toSlug(request.body.slug) || toSlug(name);
  const programAssociation = isProgramAssociation(request.body.programAssociation) ? request.body.programAssociation : "general";

  if (!name || !slug) {
    response.status(400).json({ ok: false, message: "Category name and slug are required." });
    return;
  }

  try {
    const category = await BlogCategoryModel.create({
      description: getString(request.body.description),
      name,
      programAssociation,
      slug,
      status: request.body.status === "archived" ? "archived" : "active"
    });

    response.status(201).json({ category: serializeCategory(category), ok: true });
  } catch (error) {
    response.status(409).json({
      ok: false,
      message: error instanceof Error && error.message.includes("duplicate") ? "A category with this slug already exists." : "Category could not be saved."
    });
  }
});

blogAdminRouter.patch("/api/admin/blog-categories/:id", requireAdmin, requireMongo, async (request, response) => {
  const update: Record<string, unknown> = {};
  if ("name" in request.body) update.name = getString(request.body.name);
  if ("description" in request.body) update.description = getString(request.body.description);
  if ("programAssociation" in request.body && isProgramAssociation(request.body.programAssociation)) update.programAssociation = request.body.programAssociation;
  if ("slug" in request.body) update.slug = toSlug(request.body.slug);
  if ("status" in request.body) update.status = request.body.status === "archived" ? "archived" : "active";

  if (update.name === "" || update.slug === "") {
    response.status(400).json({ ok: false, message: "Category name and slug cannot be blank." });
    return;
  }

  try {
    const category = await BlogCategoryModel.findByIdAndUpdate(request.params.id, update, { new: true }).lean();
    if (!category) {
      response.status(404).json({ ok: false, message: "Category not found." });
      return;
    }
    response.json({ category: serializeCategory(category), ok: true });
  } catch {
    response.status(409).json({ ok: false, message: "Category could not be updated. Check for duplicate slugs." });
  }
});

blogAdminRouter.get("/api/admin/blog-posts", requireAdmin, requireMongo, async (request, response) => {
  const filter: Record<string, unknown> = {};
  const status = getString(request.query.status);
  const category = toSlug(request.query.categorySlug);
  const search = getString(request.query.search);

  if (isBlogStatus(status)) filter.status = status;
  if (category) filter.categorySlugs = category;
  if (search) filter.$or = [{ title: new RegExp(search, "i") }, { excerpt: new RegExp(search, "i") }];

  const posts = await BlogPostModel.find(filter).sort({ updatedAt: -1 }).lean();
  response.json({ ok: true, posts: posts.map(serializePost) });
});

blogAdminRouter.get("/api/admin/blog-posts/:id", requireAdmin, requireMongo, async (request, response) => {
  const post = await BlogPostModel.findById(request.params.id).lean();
  if (!post) {
    response.status(404).json({ ok: false, message: "Blog post not found." });
    return;
  }

  response.json({ ok: true, post: serializePost(post) });
});

blogAdminRouter.post("/api/admin/blog-posts", requireAdmin, requireMongo, async (request, response) => {
  const { errors, payload } = await buildPostPayload(request.body);
  if (errors.length) {
    response.status(400).json({ errors, ok: false, message: errors[0] });
    return;
  }

  try {
    const post = await BlogPostModel.create(payload);
    if (post.status === "published" && post.featured) {
      await BlogPostModel.updateMany({ _id: { $ne: post._id }, featured: true }, { $set: { featured: false } });
    }
    response.status(201).json({ ok: true, post: serializePost(post) });
  } catch (error) {
    response.status(409).json({
      ok: false,
      message: error instanceof Error && error.message.includes("duplicate") ? "A blog post with this slug already exists." : "Blog post could not be saved."
    });
  }
});

blogAdminRouter.patch("/api/admin/blog-posts/:id", requireAdmin, requireMongo, async (request, response) => {
  const existing = await BlogPostModel.findById(request.params.id).lean<BlogPostDocument | null>();
  if (!existing) {
    response.status(404).json({ ok: false, message: "Blog post not found." });
    return;
  }

  const { errors, payload } = await buildPostPayload({ ...existing, ...request.body }, existing.status);
  if (errors.length) {
    response.status(400).json({ errors, ok: false, message: errors[0] });
    return;
  }

  try {
    const post = await BlogPostModel.findByIdAndUpdate(request.params.id, payload, { new: true }).lean();
    if (!post) {
      response.status(404).json({ ok: false, message: "Blog post not found." });
      return;
    }
    if (post.status === "published" && post.featured) {
      await BlogPostModel.updateMany({ _id: { $ne: post._id }, featured: true }, { $set: { featured: false } });
    }
    response.json({ ok: true, post: serializePost(post) });
  } catch {
    response.status(409).json({ ok: false, message: "Blog post could not be updated. Check for duplicate slugs." });
  }
});
