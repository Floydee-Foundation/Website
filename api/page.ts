import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Request, Response } from "express";
import { breadcrumbName, defaultDescription, pageMeta, routeAliases } from "./siteSeo";

type ManifestEntry = {
  file?: string;
};

type ShareMeta = {
  description: string;
  image: string;
  robots?: string;
  title: string;
  type?: "article" | "website";
};

type PublicBlogPost = {
  excerpt?: string;
  heroImage?: {
    url?: string;
  };
  seo?: {
    description?: string;
    title?: string;
  };
  title?: string;
};

const distDir = path.join(process.cwd(), "apps/web/dist");
const fallbackLogoPath = "/social/floydee-logo.png";

let indexHtmlCache: Promise<string> | undefined;
let manifestCache: Promise<Record<string, ManifestEntry>> | undefined;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character] ?? character);
}

function publicOrigin(request: Request) {
  const protocol = request.headers["x-forwarded-proto"]?.toString().split(",")[0] || "https";
  const host = request.headers["x-forwarded-host"]?.toString().split(",")[0] || request.headers.host || "floydeefoundation.org";
  return `${protocol}://${host}`;
}

function absoluteUrl(request: Request, url: string) {
  try {
    return new URL(url, publicOrigin(request)).toString();
  } catch {
    return new URL(fallbackLogoPath, publicOrigin(request)).toString();
  }
}

function googleDriveFileId(url: string) {
  try {
    const parsed = new URL(url);
    if (!["drive.google.com", "docs.google.com"].includes(parsed.hostname.replace(/^www\./, ""))) return "";
    return parsed.pathname.match(/\/d\/([^/]+)/)?.[1] ?? parsed.searchParams.get("id") ?? "";
  } catch {
    return "";
  }
}

function shareImageUrl(url: string) {
  const driveId = googleDriveFileId(url);
  return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w2000` : url;
}

function toSlug(value: unknown) {
  return typeof value === "string"
    ? value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90)
    : "";
}

async function readIndexHtml() {
  indexHtmlCache ??= readFile(path.join(distDir, "index.html"), "utf8").catch(() => (
    "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /></head><body><div id=\"root\"></div></body></html>"
  ));
  return indexHtmlCache;
}

async function readManifest() {
  manifestCache ??= readFile(path.join(distDir, ".vite/manifest.json"), "utf8")
    .then((content) => JSON.parse(content) as Record<string, ManifestEntry>)
    .catch(() => ({}));
  return manifestCache;
}

async function assetUrl(request: Request, assetKey: string) {
  const manifest = await readManifest();
  const file = manifest[assetKey]?.file;
  return absoluteUrl(request, file ? `/${file}` : fallbackLogoPath);
}

function normalizedPath(request: Request) {
  const parsed = new URL(request.url, publicOrigin(request));
  const withoutSlash = parsed.pathname.length > 1 ? parsed.pathname.replace(/\/+$/, "") : parsed.pathname;
  return routeAliases[withoutSlash] ?? withoutSlash;
}

async function storyMeta(request: Request, slug: string): Promise<ShareMeta | undefined> {
  try {
    const response = await fetch(absoluteUrl(request, `/api/blog-posts/${toSlug(slug)}`), {
      headers: { accept: "application/json" }
    });
    if (!response.ok) return undefined;
    const payload = await response.json() as { post?: PublicBlogPost };
    const post = payload.post;
    if (!post?.title) return undefined;

    return {
      description: post.seo?.description || post.excerpt || defaultDescription,
      image: post.heroImage?.url ? shareImageUrl(post.heroImage.url) : absoluteUrl(request, fallbackLogoPath),
      title: post.seo?.title || `${post.title} | Floydee Future Foundation`,
      type: "article"
    };
  } catch {
    return undefined;
  }
}

async function pageShareMeta(request: Request): Promise<ShareMeta> {
  const pathname = normalizedPath(request);
  const storySlug = pathname.match(/^\/stories\/([^/]+)$/)?.[1];
  if (storySlug) {
    const meta = await storyMeta(request, storySlug);
    if (meta) return meta;
  }

  const staticMeta = pageMeta[pathname];
  if (staticMeta) {
    return {
      description: staticMeta.description,
      image: await assetUrl(request, staticMeta.asset),
      robots: staticMeta.robots,
      title: staticMeta.title,
      type: staticMeta.type ?? "website"
    };
  }

  return {
    description: defaultDescription,
    image: absoluteUrl(request, fallbackLogoPath),
    title: "Floydee Future Foundation",
    type: "website"
  };
}

function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function breadcrumbTrail(pathname: string, storyTitle?: string) {
  const normalized = pathname === "/" ? ["/"] : pathname.split("/").filter(Boolean);
  const crumbs = [{ name: "Home", path: "/" }];

  if (pathname.startsWith("/stories/") && storyTitle) {
    crumbs.push({ name: breadcrumbName("/stories"), path: "/stories" });
    crumbs.push({ name: storyTitle, path: pathname });
    return crumbs;
  }

  if (pathname === "/") return crumbs;

  let current = "";
  for (const segment of normalized) {
    current += `/${segment}`;
    crumbs.push({ name: breadcrumbName(current), path: current });
  }

  return crumbs;
}

function structuredData(request: Request, pathname: string, meta: ShareMeta) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    logo: absoluteUrl(request, fallbackLogoPath),
    name: "Floydee Future Foundation",
    url: absoluteUrl(request, "/")
  };

  const storyTitle = pathname.startsWith("/stories/") ? meta.title.replace(" | Floydee Future Foundation", "") : undefined;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbTrail(pathname, storyTitle).map((crumb, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(request, crumb.path),
      name: crumb.name,
      position: index + 1
    }))
  };

  return [organization, breadcrumb];
}

function injectMeta(html: string, request: Request, meta: ShareMeta) {
  const pathname = normalizedPath(request);
  const canonical = absoluteUrl(request, pathname);
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    meta.robots ? `<meta name="robots" content="${escapeHtml(meta.robots)}" />` : "",
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(meta.type ?? "website")}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(meta.image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(meta.image)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<script type="application/ld+json">${jsonLd(structuredData(request, pathname, meta))}</script>`
  ].join("\n    ");

  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="robots"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:[^"]+"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]+"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?>/i, "")
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "")
    .replace("</head>", `    ${tags}\n  </head>`);
}

export default async function handler(request: Request, response: Response) {
  const [html, meta] = await Promise.all([readIndexHtml(), pageShareMeta(request)]);
  response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=86400");
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.status(200).send(injectMeta(html, request, meta));
}
