import { raw, Router, type NextFunction, type Request, type Response } from "express";
import { env } from "../config/env.js";
import { connectMongo } from "../config/mongo.js";
import { BlogCategoryModel, BlogPostModel, type BlogPostDocument } from "../models/blog.js";
import { deleteStoredMedia, downloadDriveImage, optimizeAndStoreImage } from "../services/blogMedia.js";
import {
  getString,
  getStringList,
  isBlogChannel,
  isBlogCategoryKind,
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
import type { BlogCategory, BlogCategoryKind, BlogContentBlock, BlogImageMedia, BlogPost, BlogProgramAssociation, BlogStatus } from "@floydee/shared";

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

async function getActiveCategorySlugs(slugs: string[]) {
  if (!slugs.length) return [];
  const categories = await BlogCategoryModel.find({ slug: { $in: slugs }, status: "active" }).lean();
  return categories.map((category) => category.slug);
}

async function resolveNamedCategory(
  body: Record<string, unknown>,
  programAssociation: BlogProgramAssociation,
  categoryKind: BlogCategoryKind,
  errors: string[]
) {
  if (categoryKind === "general") return "";

  const requestedSlug = toSlug(body.categorySlug);
  const requestedName = getString(body.categoryName);
  const slug = requestedSlug || toSlug(requestedName);

  if (!slug) {
    errors.push(`${categoryKind === "campaign" ? "Campaign" : "Workshop"} name is required.`);
    return "";
  }

  const existing = await BlogCategoryModel.findOne({
    kind: categoryKind,
    programAssociation,
    slug,
    status: "active"
  }).lean();

  if (existing) return existing.slug;

  if (!requestedName) {
    errors.push(`${categoryKind === "campaign" ? "Campaign" : "Workshop"} name must match an active option or include a new name.`);
    return "";
  }

  const category = await BlogCategoryModel.findOneAndUpdate(
    { kind: categoryKind, programAssociation, slug },
    {
      $set: {
        description: getString(body.categoryDescription),
        name: requestedName,
        status: "active"
      },
      $setOnInsert: {
        kind: categoryKind,
        programAssociation,
        slug
      }
    },
    { new: true, upsert: true }
  ).lean();

  return category?.slug ?? slug;
}

function validateMedia(media: BlogImageMedia | undefined, errors: string[], label: string, requireInternal = false) {
  if (media?.url && !isValidHttpUrl(media.url)) errors.push(`${label} must be a valid http or https URL.`);
  if (media?.url && isGoogleDriveUrl(media.url) && !media.publicAccessConfirmed) {
    errors.push(`${label} from Google Drive requires confirmation that anyone on the internet with the link can view.`);
  }
  if (media?.url && requireInternal && (media.storageProvider !== "vercel-blob" || media.importStatus !== "ready")) {
    errors.push(`${label} must be imported and optimized before publishing.`);
  }
}

function validateBlocks(blocks: BlogContentBlock[], errors: string[], requireInternal = false) {
  blocks.forEach((block) => {
    if (block.type === "image") validateMedia(block.media, errors, "Image block URL", requireInternal);
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
  const programAssociation = isProgramAssociation(body.programAssociation) ? body.programAssociation : "general";
  const categoryKind = isBlogCategoryKind(body.categoryKind) ? body.categoryKind : "general";
  const heroImage = sanitizeImageMedia(body.heroImage);
  const blocks = sanitizeBlocks(body.blocks);
  const seo = body.seo && typeof body.seo === "object" ? body.seo as Record<string, unknown> : {};
  const publishedAt = body.publishedAt instanceof Date
    ? body.publishedAt
    : body.publishedAt
      ? new Date(getString(body.publishedAt))
      : undefined;
  const eventDateValue = getString(body.eventDate);
  const eventDate = body.eventDate instanceof Date
    ? body.eventDate
    : eventDateValue
      ? new Date(`${eventDateValue.slice(0, 10)}T00:00:00.000Z`)
      : undefined;
  const errors: string[] = [];

  validateMedia(heroImage, errors, "Hero image URL", status === "published");
  validateBlocks(blocks, errors, status === "published");
  const categorySlug = await resolveNamedCategory(body, programAssociation, categoryKind, errors);
  const activeCategorySlugs = categorySlug ? [categorySlug] : [];

  const payload = {
    author: getString(body.author),
    blocks,
    categoryKind,
    categorySlug: categorySlug || undefined,
    categorySlugs: activeCategorySlugs,
    channels: getStringList(body.channels).filter(isBlogChannel),
    eventDate,
    excerpt: getString(body.excerpt),
    featured: body.featured === true,
    heroImage,
    location: getString(body.location),
    programAssociation,
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
  if (payload.eventDate && Number.isNaN(payload.eventDate.getTime())) errors.push("Event date is invalid.");

  if (status === "published") {
    if (!payload.title) errors.push("Title is required before publishing.");
    if (!payload.excerpt) errors.push("Excerpt is required before publishing.");
    if (!payload.programAssociation) errors.push("Program is required before publishing.");
    if (!payload.categoryKind) errors.push("Category type is required before publishing.");
    if (payload.categoryKind !== "general" && !payload.categorySlug) errors.push("Workshop or campaign name is required before publishing.");
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

blogAdminRouter.post("/api/admin/media/import-drive", requireAdmin, async (request, response) => {
  const sourceUrl = getString(request.body.sourceUrl);
  if (!isGoogleDriveUrl(sourceUrl) || request.body.publicAccessConfirmed !== true) {
    response.status(400).json({ ok: false, message: "Paste a Google Drive image link and confirm general access first." });
    return;
  }

  try {
    const input = await downloadDriveImage(sourceUrl);
    const media = await optimizeAndStoreImage(input, {
      alt: getString(request.body.alt),
      caption: getString(request.body.caption),
      name: getString(request.body.name),
      sourceUrl
    });
    response.status(201).json({ media, ok: true });
  } catch (error) {
    response.status(422).json({ ok: false, message: error instanceof Error ? error.message : "Image could not be imported." });
  }
});

blogAdminRouter.post(
  "/api/admin/media/upload",
  requireAdmin,
  raw({ limit: "15mb", type: ["image/*", "application/octet-stream"] }),
  async (request, response) => {
    if (!Buffer.isBuffer(request.body) || !request.body.length) {
      response.status(400).json({ ok: false, message: "Choose an image to upload." });
      return;
    }
    try {
      const media = await optimizeAndStoreImage(request.body, {
        alt: getString(request.headers["x-image-alt"]),
        caption: getString(request.headers["x-image-caption"]),
        name: getString(request.headers["x-image-name"])
      });
      response.status(201).json({ media, ok: true });
    } catch (error) {
      response.status(422).json({ ok: false, message: error instanceof Error ? error.message : "Image could not be uploaded." });
    }
  }
);

blogAdminRouter.post("/api/admin/media/delete", requireAdmin, async (request, response) => {
  const media = sanitizeImageMedia(request.body.media);
  if (!media || media.storageProvider !== "vercel-blob") {
    response.status(400).json({ ok: false, message: "Stored media metadata is required." });
    return;
  }
  try {
    await deleteStoredMedia(media);
    response.json({ ok: true });
  } catch {
    response.status(503).json({ ok: false, message: "Stored media could not be removed." });
  }
});

blogAdminRouter.get("/api/admin/blog-categories", requireAdmin, requireMongo, async (_request, response) => {
  const categories = await BlogCategoryModel.find().sort({ status: 1, name: 1 }).lean();
  response.json({ categories: categories.map(serializeCategory), ok: true });
});

blogAdminRouter.post("/api/admin/blog-categories", requireAdmin, requireMongo, async (request, response) => {
  const name = getString(request.body.name);
  const slug = toSlug(request.body.slug) || toSlug(name);
  const kind = isBlogCategoryKind(request.body.kind) && request.body.kind !== "general" ? request.body.kind : undefined;
  const programAssociation = isProgramAssociation(request.body.programAssociation) ? request.body.programAssociation : "general";

  if (!name || !slug || !kind) {
    response.status(400).json({ ok: false, message: "Workshop or campaign name, type, and slug are required." });
    return;
  }

  try {
    const category = await BlogCategoryModel.create({
      description: getString(request.body.description),
      kind,
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
  if ("kind" in request.body && isBlogCategoryKind(request.body.kind) && request.body.kind !== "general") update.kind = request.body.kind;
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
  const categoryKind = getString(request.query.categoryKind);
  const categorySlug = toSlug(request.query.categorySlug);
  const programSlug = getString(request.query.programSlug);
  const search = getString(request.query.search);

  if (isBlogStatus(status)) filter.status = status;
  if (isProgramAssociation(programSlug)) filter.programAssociation = programSlug;
  if (isBlogCategoryKind(categoryKind)) filter.categoryKind = categoryKind;
  if (categorySlug) filter.categorySlug = categorySlug;
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
