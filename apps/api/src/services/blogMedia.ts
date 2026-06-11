import crypto from "node:crypto";
import { del, put } from "@vercel/blob";
import sharp from "sharp";
import type { BlogImageMedia, BlogImageVariant } from "@floydee/shared";
import { env } from "../config/env.js";
import { getString, isGoogleDriveUrl, toSlug } from "../utils/blog.js";

const maxSourceBytes = 15 * 1024 * 1024;
const maxInputPixels = 40_000_000;
const variantWidths = [640, 1280, 2400];
const allowedDriveHosts = new Set(["drive.google.com", "docs.google.com", "drive.usercontent.google.com", "googleusercontent.com"]);

function requireBlobToken() {
  if (!env.blobReadWriteToken) throw new Error("Vercel Blob storage is not configured.");
  return env.blobReadWriteToken;
}

export function googleDriveFileId(url: string) {
  try {
    const parsed = new URL(url);
    if (!isGoogleDriveUrl(url)) return "";
    return parsed.pathname.match(/\/d\/([^/]+)/)?.[1] ?? parsed.searchParams.get("id") ?? "";
  } catch {
    return "";
  }
}

function driveDownloadUrl(sourceUrl: string) {
  const id = googleDriveFileId(sourceUrl);
  if (!id) throw new Error("A valid Google Drive image link is required.");
  return `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`;
}

async function readLimitedResponse(response: globalThis.Response) {
  if (!response.ok) throw new Error(response.status === 403 || response.status === 401 ? "Google Drive denied access to this image." : "The source image could not be downloaded.");
  const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ?? "";
  if (!contentType.startsWith("image/") && contentType !== "application/octet-stream") {
    throw new Error("The shared link does not resolve to an image. Confirm Google Drive general access.");
  }
  const declaredSize = Number(response.headers.get("content-length") ?? 0);
  if (declaredSize > maxSourceBytes) throw new Error("Image is too large. Use an image smaller than 15 MB.");

  const reader = response.body?.getReader();
  if (!reader) throw new Error("The source image could not be read.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxSourceBytes) {
      await reader.cancel();
      throw new Error("Image is too large. Use an image smaller than 15 MB.");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function downloadDriveImage(sourceUrl: string) {
  const response = await fetch(driveDownloadUrl(sourceUrl), {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000)
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) throw new Error("Google Drive did not provide an image download.");
    const redirect = new URL(location, response.url);
    const host = redirect.hostname.replace(/^www\./, "");
    if (![...allowedDriveHosts].some((allowed) => host === allowed || host.endsWith(`.${allowed}`))) {
      throw new Error("Google Drive returned an unsafe redirect.");
    }
    return readLimitedResponse(await fetch(redirect, { redirect: "error", signal: AbortSignal.timeout(15_000) }));
  }

  return readLimitedResponse(response);
}

export async function optimizeAndStoreImage(input: Buffer, options: { alt?: string; caption?: string; name?: string; sourceUrl?: string }) {
  requireBlobToken();
  if (!input.length || input.length > maxSourceBytes) throw new Error("Image must be smaller than 15 MB.");

  const base = sharp(input, { failOn: "error", limitInputPixels: maxInputPixels }).rotate();
  const metadata = await base.metadata();
  if (!metadata.width || !metadata.height || !["jpeg", "jpg", "png", "webp", "tiff", "gif", "avif"].includes(metadata.format ?? "")) {
    throw new Error("Use a supported JPEG, PNG, WebP, TIFF, GIF, or AVIF image.");
  }

  const widths = Array.from(new Set([...variantWidths.filter((width) => width < metadata.width!), Math.min(2400, metadata.width!)]));
  const folder = `blog/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}-${toSlug(options.name) || "image"}`;
  const variants: BlogImageVariant[] = [];
  let pathname = "";

  try {
    for (const width of widths) {
      const output = await sharp(input, { failOn: "error", limitInputPixels: maxInputPixels })
        .rotate()
        .resize({ fit: "inside", height: undefined, withoutEnlargement: true, width })
        .webp({ effort: 4, quality: 82 })
        .toBuffer({ resolveWithObject: true });
      const path = `${folder}-${output.info.width}w.webp`;
      const blob = await put(path, output.data, {
        access: "public",
        addRandomSuffix: false,
        contentType: "image/webp",
        token: env.blobReadWriteToken
      });
      pathname = blob.pathname;
      variants.push({
        byteSize: output.info.size,
        height: output.info.height,
        url: blob.url,
        width: output.info.width
      });
    }
  } catch (error) {
    if (variants.length) await Promise.allSettled(variants.map((variant) => del(variant.url, { token: env.blobReadWriteToken })));
    throw error;
  }

  const largest = variants.at(-1)!;
  return {
    alt: getString(options.alt) || undefined,
    byteSize: largest.byteSize,
    caption: getString(options.caption) || undefined,
    format: "webp",
    height: largest.height,
    importStatus: "ready",
    pathname,
    sourceUrl: getString(options.sourceUrl) || undefined,
    storageProvider: "vercel-blob",
    url: largest.url,
    variants,
    width: largest.width
  } satisfies BlogImageMedia;
}

export async function deleteStoredMedia(media: BlogImageMedia) {
  if (media.storageProvider !== "vercel-blob") return;
  const urls = Array.from(new Set([media.url, ...(media.variants ?? []).map((variant) => variant.url)].filter(Boolean)));
  if (urls.length) await del(urls, { token: requireBlobToken() });
}
