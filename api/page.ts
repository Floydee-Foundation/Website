import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Request, Response } from "express";
import { connectMongo } from "../apps/api/src/config/mongo.js";
import { BlogPostModel } from "../apps/api/src/models/blog.js";
import { toSlug } from "../apps/api/src/utils/blog.js";

type ManifestEntry = {
  file?: string;
};

type ShareMeta = {
  description: string;
  image: string;
  title: string;
  type?: "article" | "website";
};

type StaticPageMeta = Omit<ShareMeta, "image"> & {
  asset: string;
};

const distDir = path.join(process.cwd(), "apps/web/dist");
const fallbackLogoPath = "/social/floydee-logo.png";
const defaultDescription = "Floydee Future Foundation supports girls, women, and youth through health, emotional well-being, education, and employability programs.";

const pageMeta: Record<string, StaticPageMeta> = {
  "/": {
    asset: "src/assets/home-hero-health-screening.webp",
    description: "Building healthier, skilled, more confident futures for girls, women, and youth.",
    title: "Floydee Future Foundation"
  },
  "/about": {
    asset: "src/assets/website-changes/about-hero.jpg",
    description: "Floydee Future Foundation works at the intersection of education, health, well-being, and social impact.",
    title: "About Floydee Future Foundation"
  },
  "/programs": {
    asset: "src/assets/website-changes/programs-hero.png",
    description: "Explore Floydee's practical, community-rooted programs across health, confidence, skills, and access.",
    title: "Our Work | Floydee Future Foundation"
  },
  "/programs/aarohi": {
    asset: "src/assets/website-changes/aarohi-hero.jpg",
    description: "AAROHI advances menstrual health, PCOD and PCOS awareness, cervical cancer screening, nutrition, and mental well-being.",
    title: "AAROHI | Floydee Future Foundation"
  },
  "/programs/sakhi": {
    asset: "src/assets/website-changes/sakhi-hero.jpg",
    description: "SAKHI creates safe spaces for emotional wellness, resilience, life skills, and mental health literacy.",
    title: "SAKHI | Floydee Future Foundation"
  },
  "/programs/vidya": {
    asset: "src/assets/website-changes/vidya-hero.jpg",
    description: "VIDYA builds pathways from education to employment through digital skills, mentorship, and career readiness.",
    title: "VIDYA | Floydee Future Foundation"
  },
  "/impact": {
    asset: "src/assets/website-changes/impact-hero.jpg",
    description: "Floydee impact is tracked through participation, partner engagement, program delivery, and access opened.",
    title: "Impact | Floydee Future Foundation"
  },
  "/where-we-work": {
    asset: "src/assets/hero-latest-field.webp",
    description: "Floydee programs move through schools, colleges, communities, and partner networks across India.",
    title: "Where We Work | Floydee Future Foundation"
  },
  "/join-us": {
    asset: "src/assets/hero-join-community.webp",
    description: "Volunteer, partner, donate, or bring Floydee programs into your community.",
    title: "Join Us | Floydee Future Foundation"
  },
  "/volunteer": {
    asset: "src/assets/hero-join-community.webp",
    description: "Volunteer with Floydee to support outreach, events, content, training, and program delivery.",
    title: "Volunteer | Floydee Future Foundation"
  },
  "/partner-with-us": {
    asset: "src/assets/hero-join-community.webp",
    description: "Partner with Floydee through schools, colleges, hospitals, NGOs, CSR teams, and institutions.",
    title: "Partner With Us | Floydee Future Foundation"
  },
  "/book-a-program": {
    asset: "src/assets/hero-join-community.webp",
    description: "Bring AAROHI, SAKHI, or VIDYA into a school, college, community, or partner setting.",
    title: "Collaborate With Us | Floydee Future Foundation"
  },
  "/campaign-with-us": {
    asset: "src/assets/hero-join-community.webp",
    description: "Co-create focused campaigns around health access, dignity kits, learning material, or employability.",
    title: "Campaign With Us | Floydee Future Foundation"
  },
  "/donate": {
    asset: "src/assets/hero-donate-screening.webp",
    description: "Support Floydee programs, campaigns, workshops, or general foundation needs through a donation enquiry.",
    title: "Donate | Floydee Future Foundation"
  },
  "/donate/monthly": {
    asset: "src/assets/hero-donate-screening.webp",
    description: "Become a monthly supporter for recurring health sessions, care spaces, and youth training.",
    title: "Monthly Giving | Floydee Future Foundation"
  },
  "/donate/campaigns": {
    asset: "src/assets/hero-donate-screening.webp",
    description: "Support focused Floydee campaigns for schools, colleges, communities, and institutional partners.",
    title: "Campaign Donations | Floydee Future Foundation"
  },
  "/donate/where-needed-most": {
    asset: "src/assets/hero-donate-screening.webp",
    description: "Support the Floydee foundation needs where your contribution can be used with the most flexibility.",
    title: "Where Needed Most | Floydee Future Foundation"
  },
  "/initiatives": {
    asset: "src/assets/hero-initiatives-achievement.webp",
    description: "Explore Floydee initiatives across community engagement, access, dignity, and opportunity.",
    title: "Initiatives | Floydee Future Foundation"
  },
  "/gallery": {
    asset: "src/assets/gallery/health-screening-camp-01.jpg",
    description: "Real images from Floydee awareness sessions, school cohorts, community partners, and health screening work.",
    title: "Gallery | Floydee Future Foundation"
  },
  "/latest": {
    asset: "src/assets/hero-latest-field.webp",
    description: "Shareable proof from Floydee programs, partnerships, reports, media updates, and community moments.",
    title: "Latest | Floydee Future Foundation"
  },
  "/stories": {
    asset: "src/assets/hero-about-corridor.webp",
    description: "Beneficiary journeys and field voices from Floydee Future Foundation.",
    title: "Stories | Floydee Future Foundation"
  },
  "/news": {
    asset: "src/assets/hero-news-workshop.webp",
    description: "Latest foundation news and updates from Floydee Future Foundation.",
    title: "News | Floydee Future Foundation"
  },
  "/resources": {
    asset: "src/assets/hero-resources-screening.webp",
    description: "Reports, research, media resources, and source-backed impact updates from Floydee.",
    title: "Resources | Floydee Future Foundation"
  },
  "/mission": {
    asset: "src/assets/hero-mission-group.webp",
    description: "Floydee's mission is to build health, dignity, skills, and opportunity with real communities.",
    title: "Mission | Floydee Future Foundation"
  },
  "/history": {
    asset: "src/assets/hero-mission-group.webp",
    description: "Floydee Future Foundation was built around dignity, access, skills, and practical community work.",
    title: "History | Floydee Future Foundation"
  },
  "/leadership": {
    asset: "src/assets/website-changes/about-hero.jpg",
    description: "Meet the people helping Floydee Future Foundation build practical pathways for communities.",
    title: "Leadership | Floydee Future Foundation"
  },
  "/trust-centre": {
    asset: "src/assets/hero-trust-awareness.webp",
    description: "Registration, tax, reports, policies, partners, and source notes for Floydee Future Foundation.",
    title: "Trust Centre | Floydee Future Foundation"
  },
  "/contact": {
    asset: "src/assets/hero-contact-care.webp",
    description: "Contact Floydee for donations, partnerships, program bookings, volunteering, media, or general enquiries.",
    title: "Contact | Floydee Future Foundation"
  },
  "/privacy-policy": {
    asset: "src/assets/hero-legal-foundation.webp",
    description: "Floydee Future Foundation privacy policy for website visitors, enquiries, partners, and donors.",
    title: "Privacy Policy | Floydee Future Foundation"
  },
  "/terms-and-conditions": {
    asset: "src/assets/hero-legal-foundation.webp",
    description: "Terms for using the Floydee Future Foundation website and public digital materials.",
    title: "Terms and Conditions | Floydee Future Foundation"
  },
  "/refund-policy": {
    asset: "src/assets/hero-legal-foundation.webp",
    description: "Floydee Future Foundation refund policy.",
    title: "Refund Policy | Floydee Future Foundation"
  },
  "/accessibility": {
    asset: "src/assets/hero-legal-foundation.webp",
    description: "Floydee Future Foundation accessibility information.",
    title: "Accessibility | Floydee Future Foundation"
  },
  "/sitemap": {
    asset: "src/assets/hero-sitemap-community.webp",
    description: "A public map of the Floydee Future Foundation website structure.",
    title: "Sitemap | Floydee Future Foundation"
  },
  "/404": {
    asset: "src/assets/hero-not-found-student.webp",
    description: "This page is not part of the current Floydee Future Foundation sitemap.",
    title: "Page Not Found | Floydee Future Foundation"
  }
};

const routeAliases: Record<string, string> = {
  "/programs/education-skill-development": "/programs/vidya",
  "/programs/emotional-wellbeing": "/programs/sakhi",
  "/programs/health-wellness": "/programs/aarohi"
};

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

async function readIndexHtml() {
  indexHtmlCache ??= readFile(path.join(distDir, "index.html"), "utf8");
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
    await connectMongo();
    const post = await BlogPostModel.findOne({ slug: toSlug(slug), status: "published" }).lean();
    if (!post) return undefined;
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

function injectMeta(html: string, request: Request, meta: ShareMeta) {
  const canonical = absoluteUrl(request, normalizedPath(request));
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
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
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`
  ].join("\n    ");

  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:[^"]+"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]+"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?>/i, "")
    .replace("</head>", `    ${tags}\n  </head>`);
}

export default async function handler(request: Request, response: Response) {
  const [html, meta] = await Promise.all([readIndexHtml(), pageShareMeta(request)]);
  response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=86400");
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.status(200).send(injectMeta(html, request, meta));
}
