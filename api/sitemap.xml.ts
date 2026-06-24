import type { Request, Response } from "express";
import { sitemapPaths } from "./siteSeo";

function siteOrigin(request: Request) {
  const protocol = request.headers["x-forwarded-proto"]?.toString().split(",")[0] || "https";
  const host = request.headers["x-forwarded-host"]?.toString().split(",")[0] || request.headers.host || "www.floydeefoundation.org";
  return `${protocol}://${host}`;
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function handler(request: Request, response: Response) {
  const origin = siteOrigin(request);
  const urls = sitemapPaths()
    .map((pathname) => `  <url>\n    <loc>${xmlEscape(new URL(pathname, origin).toString())}</loc>\n  </url>`)
    .join("\n");

  const body = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    urls,
    "</urlset>"
  ].join("\n");

  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  response.setHeader("Content-Type", "application/xml; charset=utf-8");
  response.status(200).send(body);
}
