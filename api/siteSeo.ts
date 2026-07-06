export type StaticPageMeta = {
  asset: string;
  description: string;
  robots?: string;
  title: string;
  type?: "article" | "website";
};

export const defaultDescription = "Floydee Future Foundation supports girls, women, and youth through health, emotional well-being, education, and employability programs.";

export const pageMeta: Record<string, StaticPageMeta> = {
  "/": {
    asset: "src/assets/home-hero-health-screening.webp",
    description: "Building healthier, skilled, more confident futures for girls, women, and youth.",
    title: "Floydee Future Foundation"
  },
  "/about": {
    asset: "src/assets/website-changes/about-hero.jpg",
    description: "About Floydee Future Foundation and how the organization works across health, well-being, education, and social impact.",
    title: "About Us | Floydee Future Foundation"
  },
  "/programs": {
    asset: "src/assets/website-changes/programs-hero.png",
    description: "Programs from Floydee Future Foundation across health, confidence, skills, care, and access.",
    title: "Our Programs | Floydee Future Foundation"
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
    description: "Donate to support Floydee programs, campaigns, workshops, or general foundation needs.",
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
    description: "Support Floydee foundation needs where your contribution can be used with the most flexibility.",
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
    description: "Our Stories from beneficiary journeys, field updates, and community voices at Floydee Future Foundation.",
    title: "Our Stories | Floydee Future Foundation"
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
    robots: "noindex,follow",
    title: "Refund Policy | Floydee Future Foundation"
  },
  "/accessibility": {
    asset: "src/assets/hero-legal-foundation.webp",
    description: "Floydee Future Foundation accessibility information.",
    robots: "noindex,follow",
    title: "Accessibility | Floydee Future Foundation"
  },
  "/sitemap": {
    asset: "src/assets/hero-sitemap-community.webp",
    description: "A public map of the Floydee Future Foundation website structure.",
    robots: "noindex,follow",
    title: "Sitemap | Floydee Future Foundation"
  },
  "/404": {
    asset: "src/assets/hero-not-found-student.webp",
    description: "This page is not part of the current Floydee Future Foundation sitemap.",
    robots: "noindex,follow",
    title: "Page Not Found | Floydee Future Foundation"
  }
};

export const routeAliases: Record<string, string> = {
  "/programs/education-skill-development": "/programs/vidya",
  "/programs/emotional-wellbeing": "/programs/sakhi",
  "/programs/health-wellness": "/programs/aarohi"
};

export const priorityRoutes = [
  "/stories",
  "/programs",
  "/donate",
  "/about",
  "/programs/aarohi"
] as const;

const sitemapExclusions = new Set([
  "/404",
  "/accessibility",
  "/refund-policy",
  "/sitemap"
]);

export function uniquePaths(paths: readonly string[]) {
  return Array.from(new Set(paths));
}

export function sitemapPaths() {
  const allStatic = Object.keys(pageMeta).filter((pathname) => !sitemapExclusions.has(pathname) && pageMeta[pathname]?.robots !== "noindex,follow");
  return uniquePaths([...priorityRoutes, ...allStatic]);
}

export function breadcrumbName(pathname: string) {
  const labels: Record<string, string> = {
    "/": "Home",
    "/about": "About Us",
    "/contact": "Contact",
    "/donate": "Donate",
    "/gallery": "Gallery",
    "/impact": "Impact",
    "/join-us": "Join Us",
    "/leadership": "Leadership",
    "/mission": "Mission",
    "/news": "News",
    "/programs": "Our Programs",
    "/programs/aarohi": "AAROHI",
    "/programs/sakhi": "SAKHI",
    "/programs/vidya": "VIDYA",
    "/resources": "Resources",
    "/stories": "Our Stories",
    "/trust-centre": "Trust Centre",
    "/where-we-work": "Where We Work"
  };

  return labels[pathname] ?? pageMeta[pathname]?.title.replace(" | Floydee Future Foundation", "") ?? pathname;
}
