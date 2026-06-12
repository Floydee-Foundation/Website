import crypto from "node:crypto";
import mongoose from "mongoose";
import type {
  BlogCategoryKind,
  BlogChannel,
  BlogContentBlock,
  BlogImageMedia,
  BlogProgramAssociation,
  BlogStatus
} from "@floydee/shared";

const sessionTtlMs = 1000 * 60 * 60 * 8;

export function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

export function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getStringList(value: unknown) {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map(getString).filter(Boolean)));
  }

  return getString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toSlug(value: unknown) {
  return getString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function isProgramAssociation(value: unknown): value is BlogProgramAssociation {
  return value === "aarohi" || value === "sakhi" || value === "vidya" || value === "general";
}

export function isBlogCategoryKind(value: unknown): value is BlogCategoryKind {
  return value === "workshop" || value === "campaign" || value === "general";
}

export function isBlogChannel(value: unknown): value is BlogChannel {
  return value === "news" || value === "media";
}

export function isBlogStatus(value: unknown): value is BlogStatus {
  return value === "draft" || value === "published" || value === "archived";
}

export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isYoutubeUrl(value: string) {
  if (!isValidHttpUrl(value)) return false;
  const host = new URL(value).hostname.replace(/^www\./, "");
  return host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com";
}

export function isGoogleDriveUrl(value: string) {
  if (!isValidHttpUrl(value)) return false;
  const host = new URL(value).hostname.replace(/^www\./, "");
  return host === "drive.google.com" || host === "docs.google.com";
}

export function sanitizeImageMedia(value: unknown): BlogImageMedia | undefined {
  if (!value || typeof value !== "object") return undefined;
  const media = value as Record<string, unknown>;
  const url = getString(media.url);
  if (!url) return undefined;

  return {
    alt: getString(media.alt) || undefined,
    byteSize: typeof media.byteSize === "number" ? media.byteSize : undefined,
    caption: getString(media.caption) || undefined,
    format: media.format === "webp" ? "webp" : undefined,
    height: typeof media.height === "number" ? media.height : undefined,
    importStatus: media.importStatus === "ready" || media.importStatus === "pending" || media.importStatus === "failed" ? media.importStatus : undefined,
    pathname: getString(media.pathname) || undefined,
    publicAccessConfirmed: media.publicAccessConfirmed === true || undefined,
    sourceUrl: getString(media.sourceUrl) || undefined,
    storageProvider: media.storageProvider === "vercel-blob" ? "vercel-blob" : undefined,
    url,
    variants: Array.isArray(media.variants) ? media.variants.flatMap((variant) => {
      if (!variant || typeof variant !== "object") return [];
      const item = variant as Record<string, unknown>;
      const variantUrl = getString(item.url);
      if (!variantUrl || typeof item.width !== "number" || typeof item.height !== "number" || typeof item.byteSize !== "number") return [];
      return [{ byteSize: item.byteSize, height: item.height, url: variantUrl, width: item.width }];
    }) : undefined,
    width: typeof media.width === "number" ? media.width : undefined
  };
}

export function sanitizeBlocks(value: unknown): BlogContentBlock[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((block, index): BlogContentBlock[] => {
    if (!block || typeof block !== "object") return [];
    const raw = block as Record<string, unknown>;
    const id = getString(raw.id) || crypto.randomUUID();

    if (raw.type === "heading") {
      const text = getString(raw.text);
      if (!text) return [];
      return [{ id, level: raw.level === 3 ? 3 : 2, text, type: "heading" }];
    }

    if (raw.type === "paragraph") {
      const text = getString(raw.text);
      if (!text) return [];
      return [{ id, text, type: "paragraph" }];
    }

    if (raw.type === "image") {
      const media = sanitizeImageMedia(raw.media);
      if (!media) return [];
      return [{ id, media, type: "image" }];
    }

    if (raw.type === "youtube") {
      const url = getString(raw.url);
      if (!url) return [];
      return [{
        id,
        publicAccessConfirmed: raw.publicAccessConfirmed === true || undefined,
        title: getString(raw.title) || undefined,
        type: "youtube",
        url
      }];
    }

    if (raw.type === "quote") {
      const text = getString(raw.text);
      if (!text) return [];
      return [{ attribution: getString(raw.attribution) || undefined, id, text, type: "quote" }];
    }

    if (raw.type === "list") {
      const items = getStringList(raw.items);
      if (!items.length) return [];
      return [{ id, items, style: raw.style === "numbered" ? "numbered" : "bullet", type: "list" }];
    }

    return [];
  });
}

export function signAdminToken(secret: string) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + sessionTtlMs, scope: "blog-admin" })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string, secret: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number; scope?: string };
    return parsed.scope === "blog-admin" && typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}
