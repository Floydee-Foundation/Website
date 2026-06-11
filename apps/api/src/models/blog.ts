import mongoose, { type Model, Schema } from "mongoose";
import type { BlogCategoryKind, BlogProgramAssociation, BlogStatus } from "@floydee/shared";

export interface BlogCategoryDocument {
  createdAt: Date;
  description?: string;
  kind: BlogCategoryKind;
  name: string;
  programAssociation: BlogProgramAssociation;
  slug: string;
  status: "active" | "archived";
  updatedAt: Date;
}

export interface BlogPostDocument {
  author?: string;
  blocks: unknown[];
  categoryKind: BlogCategoryKind;
  categorySlug?: string;
  categorySlugs: string[];
  createdAt: Date;
  excerpt: string;
  featured?: boolean;
  heroImage?: {
    alt?: string;
    caption?: string;
    publicAccessConfirmed?: boolean;
    url: string;
  };
  programAssociation: BlogProgramAssociation;
  publishedAt?: Date;
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
  };
  slug: string;
  status: BlogStatus;
  tags: string[];
  title: string;
  updatedAt: Date;
}

const blogCategorySchema = new Schema<BlogCategoryDocument>(
  {
    description: { trim: true, type: String },
    kind: { default: "general", enum: ["workshop", "campaign", "general"], index: true, type: String },
    name: { required: true, trim: true, type: String },
    programAssociation: {
      default: "general",
      enum: ["aarohi", "sakhi", "vidya", "general"],
      type: String
    },
    slug: { index: true, required: true, trim: true, type: String },
    status: { default: "active", enum: ["active", "archived"], type: String }
  },
  { timestamps: true }
);

const blogPostSchema = new Schema<BlogPostDocument>(
  {
    author: { trim: true, type: String },
    blocks: { default: [], type: Array },
    categoryKind: { default: "general", enum: ["workshop", "campaign", "general"], index: true, type: String },
    categorySlug: { index: true, trim: true, type: String },
    categorySlugs: { default: [], type: [String] },
    excerpt: { default: "", trim: true, type: String },
    featured: { default: false, index: true, type: Boolean },
    heroImage: {
      alt: { trim: true, type: String },
      caption: { trim: true, type: String },
      publicAccessConfirmed: { type: Boolean },
      url: { trim: true, type: String }
    },
    programAssociation: {
      default: "general",
      enum: ["aarohi", "sakhi", "vidya", "general"],
      type: String
    },
    publishedAt: { type: Date },
    seo: {
      description: { trim: true, type: String },
      keywords: { default: [], type: [String] },
      title: { trim: true, type: String }
    },
    slug: { index: true, required: true, trim: true, type: String, unique: true },
    status: { default: "draft", enum: ["draft", "published", "archived"], type: String },
    tags: { default: [], type: [String] },
    title: { default: "", trim: true, type: String }
  },
  { timestamps: true }
);

blogCategorySchema.index({ kind: 1, programAssociation: 1, slug: 1 }, { unique: true });

export const BlogCategoryModel =
  (mongoose.models.BlogCategory as Model<BlogCategoryDocument> | undefined) ??
  mongoose.model<BlogCategoryDocument>("BlogCategory", blogCategorySchema);

export const BlogPostModel =
  (mongoose.models.BlogPost as Model<BlogPostDocument> | undefined) ??
  mongoose.model<BlogPostDocument>("BlogPost", blogPostSchema);
