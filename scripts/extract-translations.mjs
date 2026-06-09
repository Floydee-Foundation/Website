import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default;
const root = process.cwd();
const sources = [
  ["website", "/", "apps/web/src/App.tsx", "Shared website content"],
  ["website", "global", "apps/web/src/LocaleProvider.tsx", "Language selector"],
  ["metadata", "global", "apps/web/index.html", "Website metadata"],
  ["visitor email", "email", "apps/api/src/routes/inquiries.ts", "Visitor confirmation emails"]
];

const componentPages = {
  CustomSelect: "Shared form dropdown",
  Header: "Header navigation",
  SupportForm: "Donation form",
  ContactForm: "Contact form",
  HomePage: "Home",
  RouteFooter: "Shared page footer",
  PageHero: "Shared page hero",
  DonationPage: "Donate",
  ProgramsOverviewPage: "Programs overview",
  ProgramDetailPage: "Program detail: AAROHI / SAKHI / VIDYA",
  InitiativesPage: "Initiatives",
  ImpactPage: "Impact",
  WhereWeWorkPage: "Where we work",
  JoinPage: "Join us / Volunteer / Partner / Book / Campaign",
  LatestPage: "Stories / News / Resources / Gallery",
  AboutPage: "About / Mission / History / Leadership",
  TrustCentrePage: "Trust centre",
  ContactPage: "Contact",
  LegalPage: "Legal pages",
  SitemapPage: "Sitemap",
  NotFoundPage: "Page not found"
};

const excluded = /^(?:\.{0,2}\/\S+|[a-z0-9_-]+|#[a-z0-9_-]+|\/[\w/#?&=.-]*|https?:\/\/\S+|[\w.-]+@[\w.-]+|\.[\w-]+|GET|POST|Content-Type|application\/json)$/;
const looksLikeCopy = (value) => {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text || excluded.test(text) || text.length === 1) return false;
  if (/^[a-z]+(?:[A-Z][a-z]+)+$/.test(text)) return false;
  if (/^[\w-]+(?:\s[\w-]+){0,2}$/.test(text) && text === text.toLowerCase()) return false;
  return /[A-Za-z]/.test(text);
};

const entries = new Map();
let previousByEnglish = new Map();
try {
  const previous = JSON.parse(await fs.readFile(path.join(root, "translations/source.json"), "utf8"));
  previousByEnglish = new Map(previous.map((row) => [row.english, row]));
} catch {
  // First extraction.
}
const add = (english, surface, route, context, pageName) => {
  const text = english.replace(/\s+/g, " ").trim();
  if (!looksLikeCopy(text)) return;
  const existing = entries.get(text);
  if (existing) {
    if (!existing.route.includes(route)) existing.route += `, ${route}`;
    if (!existing.pageName.includes(pageName)) existing.pageName += `; ${pageName}`;
    return;
  }
  const previous = previousByEnglish.get(text);
  entries.set(text, {
    key: `copy.${createHash("sha1").update(text).digest("hex").slice(0, 12)}`,
    surface,
    pageName,
    route,
    section: "site copy",
    context,
    english: text,
    hindi: previous?.hindi ?? "",
    bengali: previous?.bengali ?? "",
    status: previous?.status ?? "AI draft - review",
    translatorNotes: previous?.translatorNotes ?? ""
  });
};

for (const [surface, route, relativePath, defaultPageName] of sources) {
  const source = await fs.readFile(path.join(root, relativePath), "utf8");
  if (relativePath.endsWith(".html")) {
    for (const match of source.matchAll(/(?:content|title|aria-label|alt)="([^"]+)"/g)) add(match[1], surface, route, relativePath, defaultPageName);
    for (const match of source.matchAll(/<title>([^<]+)<\/title>/g)) add(match[1], surface, route, relativePath, defaultPageName);
    continue;
  }
  const ast = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] });
  const pageNameForPath = (nodePath) => {
    const functionParent = nodePath.getFunctionParent();
    const functionName = functionParent?.node?.id?.name
      ?? functionParent?.parentPath?.node?.id?.name
      ?? functionParent?.parentPath?.node?.key?.name;
    return componentPages[functionName] ?? defaultPageName;
  };
  traverse(ast, {
    JSXText(nodePath) {
      add(nodePath.node.value, surface, route, relativePath, pageNameForPath(nodePath));
    },
    StringLiteral(nodePath) {
      add(nodePath.node.value, surface, route, relativePath, pageNameForPath(nodePath));
    },
    TemplateElement(nodePath) {
      add(nodePath.node.value.cooked ?? "", surface, route, relativePath, pageNameForPath(nodePath));
    }
  });
}

const renderedDynamicCopy = [
  "AAROHI: Care That Changes Lives",
  "SAKHI: Your space to share, be heard, and feel supported",
  "VIDYA: Building Pathways from Education to Employment",
  "Explore AAROHI",
  "Explore SAKHI",
  "Explore VIDYA",
  ...Array.from({ length: 6 }, (_, index) => `Floydee gallery item ${index + 1}`)
];
for (const value of renderedDynamicCopy) {
  const pageName = value.startsWith("Floydee gallery") ? "Gallery" : "Programs overview / Program detail";
  add(value, "website", "routed pages", "Rendered dynamic copy", pageName);
}

const protectedCopy = [
  "AAROHI", "SAKHI", "VIDYA", "Floydee", "Floydee Foundation", "Floydee Future Foundation",
  "PAN", "80G", "AAGCF6699F", "AAGCF6699FF20261", "contact@floydeefoundation.org",
  "+91 91477 48064", "Kolkata", "Delhi", "Patna", "Lucknow", "Mumbai", "Bangalore"
];
for (const value of protectedCopy) {
  const entry = entries.get(value);
  if (entry) {
    entry.hindi = value;
    entry.bengali = value;
    entry.translatorNotes = "Protected term; keep unchanged.";
  }
}

for (const [name, tagline] of [
  ["AAROHI", "Care That Changes Lives"],
  ["SAKHI", "Your space to share, be heard, and feel supported"],
  ["VIDYA", "Building Pathways from Education to Employment"]
]) {
  const taglineEntry = entries.get(tagline);
  const titleEntry = entries.get(`${name}: ${tagline}`);
  const exploreEntry = entries.get(`Explore ${name}`);
  if (taglineEntry && titleEntry) {
    titleEntry.hindi = `${name}: ${taglineEntry.hindi}`;
    titleEntry.bengali = `${name}: ${taglineEntry.bengali}`;
    titleEntry.translatorNotes = "Keep the program name unchanged.";
  }
  if (exploreEntry) {
    exploreEntry.hindi = `${name} के बारे में जानें`;
    exploreEntry.bengali = `${name} সম্পর্কে জানুন`;
    exploreEntry.translatorNotes = "Keep the program name unchanged.";
  }
}

await fs.mkdir(path.join(root, "translations"), { recursive: true });
await fs.writeFile(path.join(root, "translations/source.json"), JSON.stringify([...entries.values()], null, 2) + "\n");
console.log(`Extracted ${entries.size} translation rows.`);
