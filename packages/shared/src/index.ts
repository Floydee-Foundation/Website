export type ProgramSlug = "health-wellness" | "emotional-wellbeing" | "education-skill";

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
  program: ProgramSlug | "where-needed-most";
}
