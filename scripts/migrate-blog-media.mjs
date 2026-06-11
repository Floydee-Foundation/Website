import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: new URL("../.env.local", import.meta.url), override: false });
dotenv.config({ path: new URL("../.env", import.meta.url), override: false });

const apply = process.argv.includes("--apply");
const maxBytes = 15 * 1024 * 1024;

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required.");
if (apply && !process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN is required with --apply.");

const [{ BlogPostModel }, { downloadDriveImage, googleDriveFileId, optimizeAndStoreImage }] = await Promise.all([
  import("../apps/api/dist/models/blog.js"),
  import("../apps/api/dist/services/blogMedia.js")
]);

async function downloadExternalImage(url) {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol) || ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error("Unsafe external image URL.");
  }
  const response = await fetch(parsed, { redirect: "follow", signal: AbortSignal.timeout(15_000) });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error("External URL did not return an image.");
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > maxBytes) throw new Error("Image exceeds 15 MB.");
  return buffer;
}

async function migrateMedia(media, name) {
  if (!media?.url || media.storageProvider === "vercel-blob") return { changed: false, media };
  if (!apply) return { changed: true, media };
  const sourceUrl = media.sourceUrl || media.url;
  const input = googleDriveFileId(sourceUrl) ? await downloadDriveImage(sourceUrl) : await downloadExternalImage(sourceUrl);
  return {
    changed: true,
    media: await optimizeAndStoreImage(input, {
      alt: media.alt,
      caption: media.caption,
      name,
      sourceUrl
    })
  };
}

await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
const posts = await BlogPostModel.find().lean();
const failures = [];
let changedPosts = 0;
let changedImages = 0;

for (const post of posts) {
  let changed = false;
  const update = {};
  try {
    const hero = await migrateMedia(post.heroImage, `${post.slug}-hero`);
    if (hero.changed) {
      changed = true;
      changedImages += 1;
      update.heroImage = hero.media;
    }

    const blocks = [];
    for (const [index, block] of (post.blocks ?? []).entries()) {
      if (block?.type !== "image") {
        blocks.push(block);
        continue;
      }
      const result = await migrateMedia(block.media, `${post.slug}-${index + 1}`);
      if (result.changed) {
        changed = true;
        changedImages += 1;
        blocks.push({ ...block, media: result.media });
      } else {
        blocks.push(block);
      }
    }
    if (changed) {
      changedPosts += 1;
      update.blocks = blocks;
      if (apply) await BlogPostModel.updateOne({ _id: post._id }, { $set: update });
    }
  } catch (error) {
    failures.push({ error: error instanceof Error ? error.message : String(error), slug: post.slug });
  }
}

await mongoose.disconnect();
console.log(JSON.stringify({ apply, changedImages, changedPosts, failures }, null, 2));
if (failures.length) process.exitCode = 1;
