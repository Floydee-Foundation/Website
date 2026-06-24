import type { Request, Response } from "express";

function siteOrigin(request: Request) {
  const protocol = request.headers["x-forwarded-proto"]?.toString().split(",")[0] || "https";
  const host = request.headers["x-forwarded-host"]?.toString().split(",")[0] || request.headers.host || "www.floydeefoundation.org";
  return `${protocol}://${host}`;
}

export default function handler(request: Request, response: Response) {
  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${siteOrigin(request)}/sitemap.xml`
  ].join("\n");

  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.status(200).send(`${body}\n`);
}
