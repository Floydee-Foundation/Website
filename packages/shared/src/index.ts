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
}

export interface DonationInquiry {
  name: string;
  email: string;
  frequency: "One-time" | "Monthly";
  amount: number;
  program: ProgramFocus;
  consentStatus: string;
}
