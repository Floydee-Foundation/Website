import type { Locale } from "./i18n.js";

export type ProgramSlug = "aarohi" | "sakhi" | "vidya";
export type ProgramFocus = "AAROHI" | "SAKHI" | "VIDYA" | "Where needed most";

export interface ImpactMetric {
  label: string;
  value: string;
  sourceNote?: string;
}

export interface Program {
  slug: ProgramSlug;
  title: string;
  summary: string;
  audience: string;
  activities: string[];
}

export interface Story {
  title: string;
  category: "Story" | "News" | "Resource";
  excerpt: string;
  program?: ProgramSlug;
  consentStatus?: "approved" | "pending" | "restricted";
}

export interface ContactInquiry {
  name: string;
  email: string;
  intent: "Partner with the foundation" | "Volunteer" | "Book a program" | "Request media information";
  message: string;
  locale?: Locale;
}

export interface DonationInquiry {
  name: string;
  email: string;
  frequency: "One-time" | "Monthly";
  amount: number;
  program?: ProgramFocus;
  targetName?: string;
  targetSlug?: string;
  targetType: "program" | "campaign" | "workshop" | "generic";
  consentStatus: string;
  locale?: Locale;
}

export type BlogStatus = "draft" | "published" | "archived";

export type BlogCategoryStatus = "active" | "archived";

export type BlogProgramAssociation = ProgramSlug | "general";

export type BlogCategoryKind = "workshop" | "campaign" | "general";

export type BlogChannel = "news" | "media";

export interface BlogSeo {
  title?: string;
  description?: string;
  keywords: string[];
}

export interface BlogImageMedia {
  alt?: string;
  byteSize?: number;
  caption?: string;
  format?: "webp";
  height?: number;
  importStatus?: "ready" | "pending" | "failed";
  pathname?: string;
  publicAccessConfirmed?: boolean;
  sourceUrl?: string;
  storageProvider?: "vercel-blob";
  url: string;
  variants?: BlogImageVariant[];
  width?: number;
}

export interface BlogImageVariant {
  byteSize: number;
  height: number;
  url: string;
  width: number;
}

export interface BlogBaseBlock {
  id: string;
}

export interface BlogHeadingBlock extends BlogBaseBlock {
  type: "heading";
  level: 2 | 3;
  text: string;
}

export interface BlogParagraphBlock extends BlogBaseBlock {
  type: "paragraph";
  text: string;
}

export interface BlogImageBlock extends BlogBaseBlock {
  type: "image";
  media: BlogImageMedia;
}

export interface BlogYoutubeBlock extends BlogBaseBlock {
  type: "youtube";
  publicAccessConfirmed?: boolean;
  title?: string;
  url: string;
}

export interface BlogQuoteBlock extends BlogBaseBlock {
  type: "quote";
  attribution?: string;
  text: string;
}

export interface BlogListBlock extends BlogBaseBlock {
  type: "list";
  style: "bullet" | "numbered";
  items: string[];
}

export type BlogContentBlock =
  | BlogHeadingBlock
  | BlogParagraphBlock
  | BlogImageBlock
  | BlogYoutubeBlock
  | BlogQuoteBlock
  | BlogListBlock;

export interface BlogCategory {
  createdAt?: string;
  description?: string;
  id: string;
  kind: BlogCategoryKind;
  name: string;
  programAssociation: BlogProgramAssociation;
  slug: string;
  status: BlogCategoryStatus;
  updatedAt?: string;
}

export interface BlogPost {
  author?: string;
  blocks: BlogContentBlock[];
  categoryKind: BlogCategoryKind;
  categorySlug?: string;
  categorySlugs: string[];
  channels: BlogChannel[];
  createdAt?: string;
  eventDate?: string;
  excerpt: string;
  featured?: boolean;
  heroImage?: BlogImageMedia;
  id: string;
  location?: string;
  programAssociation: BlogProgramAssociation;
  publishedAt?: string;
  seo: BlogSeo;
  slug: string;
  status: BlogStatus;
  tags: string[];
  title: string;
  updatedAt?: string;
}

export * from "./i18n.js";
