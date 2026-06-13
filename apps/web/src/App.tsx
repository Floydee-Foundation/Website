import { FormEvent, KeyboardEvent as ReactKeyboardEvent, type CSSProperties, useEffect, useId, useRef, useState } from "react";
import floydeeCircleLogo from "./assets/floydee-circle-logo.png";
import floydeeLogo from "./assets/floydee-logo.png";
import nareeHealthLogo from "./assets/naree-health-logo.png";
import heroFoundation from "./assets/hero-foundation.webp";
import homeHeroHealthScreening from "./assets/home-hero-health-screening.webp";
import heroAboutCorridor from "./assets/hero-about-corridor.webp";
import heroContactCare from "./assets/hero-contact-care.webp";
import heroDonateScreening from "./assets/hero-donate-screening.webp";
import heroGalleryStudents from "./assets/hero-gallery-students.webp";
import heroInitiativesAchievement from "./assets/hero-initiatives-achievement.webp";
import heroJoinCommunity from "./assets/hero-join-community.webp";
import heroLatestField from "./assets/hero-latest-field.webp";
import heroLegalFoundation from "./assets/hero-legal-foundation.webp";
import heroMissionGroup from "./assets/hero-mission-group.webp";
import heroNewsWorkshop from "./assets/hero-news-workshop.webp";
import heroNotFoundStudent from "./assets/hero-not-found-student.webp";
import heroResourcesScreening from "./assets/hero-resources-screening.webp";
import heroSitemapCommunity from "./assets/hero-sitemap-community.webp";
import heroTrustAwareness from "./assets/hero-trust-awareness.webp";
import healthCamp1 from "./assets/health-camp-1.webp";
import healthCamp2 from "./assets/health-camp-2.webp";
import healthCamp3 from "./assets/health-camp-3.webp";
import studentSanika from "./assets/student-sanika.webp";
import programMapping from "./assets/program-mapping.webp";
import websiteAboutHero from "./assets/website-changes/about-hero-left.jpg";
import websiteProgramsHero from "./assets/website-changes/programs-hero.png";
import websiteProgramAarohiCard from "./assets/website-changes/program-aarohi-card.jpg";
import websiteProgramSakhiCard from "./assets/website-changes/program-sakhi-card.png";
import websiteProgramVidyaCard from "./assets/website-changes/program-vidya-card.jpg";
import websiteAarohiHero from "./assets/website-changes/aarohi-hero.jpg";
import websiteSakhiHero from "./assets/website-changes/sakhi-hero.jpg";
import websiteVidyaHero from "./assets/website-changes/vidya-hero.jpg";
import websiteImpactHero from "./assets/website-changes/impact-hero.jpg";
import websiteFeaturedInitiativeHealthCamp from "./assets/website-changes/featured-initiative-health-camp.jpg";
import aarohiAfshanAnjum from "./assets/testimonials/aarohi-afshan-anjum.jpg";
import aarohiAnushkaDas from "./assets/testimonials/aarohi-anushka-das.jpg";
import aarohiAnushkaDutta from "./assets/testimonials/aarohi-anushka-dutta.jpg";
import aarohiBidisha from "./assets/testimonials/aarohi-bidisha.jpg";
import aarohiEshaDas from "./assets/testimonials/aarohi-esha-das.jpg";
import aarohiFirozaKhatun from "./assets/testimonials/aarohi-firoza-khatun.jpg";
import aarohiIpshitaBhattacharjee from "./assets/testimonials/aarohi-ipshita-bhattacharjee.jpg";
import aarohiRaimaDas from "./assets/testimonials/aarohi-raima-das.jpg";
import aarohiSonikaDey from "./assets/testimonials/aarohi-sonika-dey.jpg";
import aarohiStudent from "./assets/testimonials/aarohi-student.jpg";
import screeningBidishaKhatun from "./assets/testimonials/screening-bidisha-khatun.jpg";
import screeningSanaParveen from "./assets/testimonials/screening-sana-parveen.jpg";
import screeningSaniaParveen from "./assets/testimonials/screening-sania-parveen.jpg";
import screeningShaguftaParveen from "./assets/testimonials/screening-shagufta-parveen.jpg";
import screeningStudentCheckup from "./assets/testimonials/screening-student-checkup.jpg";
import screeningStudentGuidance from "./assets/testimonials/screening-student-guidance.jpg";
import vidyaDeepakChauhan from "./assets/testimonials/vidya-deepak-chauhan.jpg";
import vidyaDeepakGcu from "./assets/testimonials/vidya-deepak-gcu.jpg";
import vidyaDeepika from "./assets/testimonials/vidya-deepika.jpg";
import vidyaIshminaSultana from "./assets/testimonials/vidya-ishmina-sultana.jpg";
import vidyaKhanSafiya from "./assets/testimonials/vidya-khan-safiya.jpg";
import vidyaLakshmishree from "./assets/testimonials/vidya-lakshmishree.jpg";
import vidyaNishaRathod from "./assets/testimonials/vidya-nisha-rathod.jpg";
import vidyaRabiya from "./assets/testimonials/vidya-rabiya.jpg";
import vidyaSanika from "./assets/testimonials/vidya-sanika.jpg";
import vidyaSujal from "./assets/testimonials/vidya-sujal.jpg";
import galleryBidhannagar1 from "./assets/gallery/bidhannagar-govt-high-school-01.jpg";
import galleryBidhannagar2 from "./assets/gallery/bidhannagar-govt-high-school-02.jpg";
import galleryBidhannagar3 from "./assets/gallery/bidhannagar-govt-high-school-03.jpg";
import galleryCohort1Bidhannagar1 from "./assets/gallery/cohort-1-bidhannagar-01.jpg";
import galleryCohort1Bidhannagar2 from "./assets/gallery/cohort-1-bidhannagar-02.jpg";
import galleryCohort1Bidhannagar3 from "./assets/gallery/cohort-1-bidhannagar-03.jpg";
import galleryCohort2Bidhannagar1 from "./assets/gallery/cohort-2-bidhannagar-01.jpg";
import galleryCohort2Bidhannagar2 from "./assets/gallery/cohort-2-bidhannagar-02.jpg";
import galleryHatiara1 from "./assets/gallery/hatiara-madrasa-01.jpg";
import galleryHatiara2 from "./assets/gallery/hatiara-madrasa-02.jpg";
import galleryHatiara3 from "./assets/gallery/hatiara-madrasa-03.jpg";
import galleryHaydenHall1 from "./assets/gallery/hayden-hall-01.jpg";
import galleryHaydenHall2 from "./assets/gallery/hayden-hall-02.jpg";
import galleryHaydenHall3 from "./assets/gallery/hayden-hall-03.jpg";
import galleryHealthCamp1 from "./assets/gallery/health-screening-camp-01.jpg";
import galleryHealthCamp2 from "./assets/gallery/health-screening-camp-02.jpg";
import galleryHealthCamp3 from "./assets/gallery/health-screening-camp-03.jpg";
import galleryHealthCamp4 from "./assets/gallery/health-screening-camp-04.jpg";
import galleryHealthCamp5 from "./assets/gallery/health-screening-camp-05.jpg";
import galleryHealthCamp6 from "./assets/gallery/health-screening-camp-06.jpg";
import galleryHelpFoundation1 from "./assets/gallery/help-foundation-01.jpg";
import galleryHelpFoundation2 from "./assets/gallery/help-foundation-02.jpg";
import galleryHelpFoundation3 from "./assets/gallery/help-foundation-03.jpg";
import galleryJdmc1 from "./assets/gallery/jdmc-01.jpg";
import galleryJdmc2 from "./assets/gallery/jdmc-02.jpg";
import galleryJdmc3 from "./assets/gallery/jdmc-03.jpg";
import gallerySpkJain1 from "./assets/gallery/spk-jain-academy-01.jpg";
import gallerySpkJain2 from "./assets/gallery/spk-jain-academy-02.jpg";
import gallerySpkJain3 from "./assets/gallery/spk-jain-academy-03.jpg";
import galleryUdayanCare1 from "./assets/gallery/udayan-care-01.jpg";
import galleryUdayanCare2 from "./assets/gallery/udayan-care-02.jpg";
import galleryUdayanCare3 from "./assets/gallery/udayan-care-03.jpg";
import aarohiOrchids from "./assets/partners/aarohi/aarohi-partner-01.jpeg";
import aarohiHarimatiMadrasah from "./assets/partners/aarohi/aarohi-partner-02.jpg";
import aarohiDeSovrani from "./assets/partners/aarohi/aarohi-partner-03.jpg";
import aarohiSchoolSeal from "./assets/partners/aarohi/aarohi-partner-04.jpg";
import aarohiSpkJain from "./assets/partners/aarohi/aarohi-partner-09.webp";
import aarohiHaydenHall from "./assets/partners/aarohi/hayden-hall.png";
import aarohiHelpFoundation from "./assets/partners/aarohi/help-foundation.png";
import aarohiJankiDevi from "./assets/partners/aarohi/janki-devi-memorial-college.jpeg";
import aarohiUdayanCare from "./assets/partners/aarohi/udayan-care.jpg";
import corporateApex from "./assets/partners/corporate/apex-laboratories.png";
import corporateEmcure from "./assets/partners/corporate/emcure-pharmaceuticals.png";
import corporatePkg from "./assets/partners/corporate/pkg-medical-college-hospital.png";
import vidyaAps from "./assets/partners/vidya/aps-college-of-engineering.png";
import vidyaBharatiVidyapeeth from "./assets/partners/vidya/bharati-vidyapeeth-university.png";
import vidyaBmnit from "./assets/partners/vidya/bmnit.png";
import vidyaDattaMeghe from "./assets/partners/vidya/datta-meghe-institute-of-technology.png";
import vidyaGovernmentEngineeringSiwan from "./assets/partners/vidya/government-engineering-college-siwan.png";
import vidyaJyoti from "./assets/partners/vidya/jyoti-institute-of-technology.png";
import vidyaNgadkm from "./assets/partners/vidya/ngadkm-college.png";
import vidyaOxford from "./assets/partners/vidya/oxford-college-of-engineering.png";
import vidyaPes from "./assets/partners/vidya/pes-university.png";
import vidyaRajivGandhi from "./assets/partners/vidya/rajiv-gandhi-institute-of-technology.png";
import vidyaRamEesh from "./assets/partners/vidya/ram-eesh-institute-of-technology.png";
import vidyaRamniranjan from "./assets/partners/vidya/ramniranjan-jhunjhunwala-college.png";
import vidyaShahAnchor from "./assets/partners/vidya/vidya-partner-01.jpg";
import vidyaSies from "./assets/partners/vidya/sies-college.png";
import vidyaSitamarhi from "./assets/partners/vidya/sitamarhi-institute-of-engineering.png";
import vidyaSndt from "./assets/partners/vidya/sndt-womens-university.png";
import vidyaUemJaipur from "./assets/partners/vidya/uem-jaipur.png";
import vidyaVemana from "./assets/partners/vidya/vemana-institute-of-technology.png";
import teamDisha from "./assets/team-disha.jpg";
import teamHimanshu from "./assets/team-himanshu.png";
import teamIpsito from "./assets/team-ipsito.jpg";
import teamKrishnaShah from "./assets/team-krishna-shah.jpg";
import teamSreeparna from "./assets/team-sreeparna.jpg";
import teamSubhodyuti from "./assets/team-subhodyuti.jpg";
import { BlogAdminPage } from "./BlogAdminPage";
import { LanguageSelector, useLocale } from "./LocaleProvider";
import { BlogArchive, StoryArticlePage, StoriesHubPage } from "./StoriesPage";
import type { BlogCategory, BlogProgramAssociation } from "@floydee/shared";

type NavLink = [label: string, href: string, className?: string];
type NavGroup = {
  label: string;
  href?: string;
  links: NavLink[];
};

type PartnerLogo = {
  name: string;
  image?: string;
  initials?: string;
  note: string;
};

type ProgramStory = {
  focusLabel: string;
  focusTitle: string;
  focusText: string;
  focusAreas: {
    title: string;
    text: string;
  }[];
  journeyLabel: string;
  journeyTitle: string;
  journeyText: string;
  journeySteps: {
    title: string;
    text: string;
  }[];
  secondaryImage: string;
  secondaryImageAlt: string;
  impactMetric: string;
  impactLabel: string;
  impactText: string;
  callToAction: [string, string];
  metaTitle: string;
  metaDescription: string;
};

type ProgramPage = {
  title: string;
  tagline: string;
  eyebrow: string;
  image: string;
  cardImage: string;
  statement: string;
  intro: string;
  problem: string;
  audience: string;
  activities: readonly string[];
  impact: string;
  story?: ProgramStory;
};

type ProgramSlug = "aarohi" | "sakhi" | "vidya";
type TestimonialCategory = "VIDYA" | "AAROHI" | "HEALTH SCREENING CAMP";
type StudentTestimonial = {
  category: TestimonialCategory;
  detail: string;
  image: string;
  name: string;
  program: string;
  quote: string;
};
type GalleryCategory = "Naree Health Awareness" | "Cervical Cancer Awareness" | "Health Screening Camp";
type GalleryImage = {
  alt: string;
  caption: string;
  image: string;
};
type GallerySection = {
  category: GalleryCategory;
  images: GalleryImage[];
  summary: string;
  title: string;
};
type LegalPageContent = {
  eyebrow: string;
  intro: string;
  sections: {
    body: string[];
    title: string;
  }[];
  title: string;
};

const navGroups: NavGroup[] = [
  {
    label: "DONATE",
    href: "/donate",
    links: []
  },
  {
    label: "WHAT WE DO",
    links: [
      ["OUR WORK", "/programs"],
      ["AAROHI", "/programs/aarohi"],
      ["SAKHI", "/programs/sakhi"],
      ["VIDYA", "/programs/vidya"],
      ["OUR IMPACT", "/impact"],
      ["WHERE WE WORK", "/where-we-work"]
    ]
  },
  {
    label: "JOIN US",
    href: "/join-us",
    links: []
  },
  {
    label: "STORIES & LATEST",
    links: [
      ["STORIES", "/stories"],
      ["NEWS", "/news"],
      ["RESOURCES", "/resources"],
      ["GALLERY", "/gallery"]
    ]
  },
  {
    label: "WHO WE ARE",
    links: [
      ["ABOUT US", "/about"]
    ]
  },
  {
    label: "CONTACT",
    links: [
      ["CONTACT", "/contact"]
    ]
  }
];

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "");
const donationProgramOptions = ["AAROHI", "SAKHI", "VIDYA", "Where needed most"];
const namedDonationProgramOptions = ["AAROHI", "SAKHI", "VIDYA"];
const donationTargetLabels = {
  campaign: "Fund a campaign",
  generic: "Generic donation",
  program: "Fund a program",
  workshop: "Fund a workshop"
} as const;
type DonationTargetType = keyof typeof donationTargetLabels;
const donationTargetOptions: DonationTargetType[] = ["program", "campaign", "workshop", "generic"];
const programValueMap: Record<string, BlogProgramAssociation> = {
  AAROHI: "aarohi",
  SAKHI: "sakhi",
  VIDYA: "vidya",
  "Where needed most": "general"
};
const foundationPrograms = [
  ["AAROHI", "Care That Changes Lives"],
  ["SAKHI", "Your space to share, be heard, and feel supported"],
  ["VIDYA", "Building Pathways from Education to Employment"]
] as const;
const donationConsentText =
  "You agree that Floydee Future Foundation can reach out to you through WhatsApp/email/SMS/Phone to provide information of your donation, campaigns, 80G receipt etc.";

const contactIntentOptions = [
  "Partner with the foundation",
  "Volunteer",
  "Collaborate With Us",
  "Request media information"
];
const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/108100391/",
    iconLabel: "in"
  }
] as const;

const routeAliases: Record<string, string> = {
  "/programs/health-wellness": "/programs/aarohi",
  "/programs/emotional-wellbeing": "/programs/sakhi",
  "/programs/education-skill-development": "/programs/vidya"
};

const programPages: Record<ProgramSlug, ProgramPage> = {
  aarohi: {
    title: "AAROHI",
    tagline: "Care That Changes Lives",
    eyebrow: "Health, dignity and access",
    image: websiteAarohiHero,
    cardImage: websiteProgramAarohiCard,
    statement: "Together, we create healthier, safer, and more informed communities through education, screening, and access to care.",
    intro:
      "AAROHI is Floydee Future Foundation's flagship health program for adolescent girls and women, combining trusted information, supportive conversations, preventive screening, and pathways to care.",
    problem:
      "Accurate health information remains difficult to access for many adolescent girls and women. Stigma, misinformation, silence, and limited preventive care can delay support, screening, and treatment. AAROHI responds by bringing education and access into trusted schools and community spaces.",
    audience: "Adolescent girls, young women, schools, colleges, community groups, public institutions, and partner organizations.",
    activities: [
      "Menstrual Health & Hygiene : Education, myth-busting, hygiene management.",
      "Reproductive & Preventive Health: PCOS/PCOD awareness, cervical health, anemia prevention.",
      "Nutrition & Healthy Living: Adolescent nutrition and lifestyle awareness",
      "Access to Care: Screening, counseling, referrals, follow-up support."
    ],
    impact: "150+ girls were impacted through the Aarohi health screening camp conducted at a Government school in Kolkata",
    story: {
      focusLabel: "What AAROHI covers",
      focusTitle: "Health knowledge that grows into confident action.",
      focusText:
        "Sessions are shaped for adolescents, young adults, and women so every conversation feels relevant, respectful, and useful.",
      focusAreas: [
        {
          title: "Puberty and body awareness",
          text: "Age-appropriate guidance helps girls understand physical changes, body literacy, and personal well-being."
        },
        {
          title: "Menstrual hygiene and reproductive health",
          text: "Open conversations replace myths and silence with practical knowledge, dignity, and healthier habits."
        },
        {
          title: "PCOD and PCOS awareness",
          text: "Early understanding helps participants recognise common signs and know when to seek professional care."
        },
        {
          title: "Nutrition and healthy lifestyles",
          text: "Everyday guidance connects food, movement, rest, and preventive habits to long-term well-being."
        },
        {
          title: "Cervical cancer awareness and screening",
          text: "Clear information builds awareness of prevention, early screening, and available care pathways."
        },
        {
          title: "Mental and emotional well-being",
          text: "Safe, supportive spaces make room for questions, reflection, dialogue, and emotional health."
        }
      ],
      journeyLabel: "From awareness to care",
      journeyTitle: "A care pathway built around trust and continuity.",
      journeyText:
        "AAROHI combines education with practical access so a single session can become the beginning of informed, ongoing care.",
      journeySteps: [
        {
          title: "Interactive awareness sessions",
          text: "Classroom and community conversations make essential health information approachable."
        },
        {
          title: "Expert-led guidance",
          text: "Doctors and mental health professionals bring trusted answers into familiar spaces."
        },
        {
          title: "Safe dialogue and digital support",
          text: "Participants can ask freely, reflect, and continue building healthy habits beyond the session."
        },
        {
          title: "Screening and referral access",
          text: "Health camps, follow-up sessions, and medical referrals connect awareness to the next step."
        }
      ],
      secondaryImage: healthCamp2,
      secondaryImageAlt: "A health professional supporting students during a Floydee AAROHI session",
      impactMetric: "150+",
      impactLabel: "girls reached through screening",
      impactText: "A school-based AAROHI health screening camp in Kolkata connected adolescent girls with awareness, preventive care, and informed next steps.",
      callToAction: ["Bring AAROHI to your community", "/book-a-program"],
      metaTitle: "AAROHI | Menstrual Health and Women's Wellness | Floydee Future Foundation",
      metaDescription: "AAROHI advances menstrual health, PCOD and PCOS awareness, cervical cancer screening, nutrition, and mental well-being for adolescent girls and women."
    }
  },
  sakhi: {
    title: "SAKHI",
    tagline: "Your space to share, be heard, and feel supported",
    eyebrow: "Emotional Wellness and Resilience Program for Adolescents and Women",
    image: websiteSakhiHero,
    cardImage: websiteProgramSakhiCard,
    statement: "SAKHI empowers adolescents and women with the knowledge, skills, support systems, and safe spaces needed to build emotional resilience, strengthen mental well-being, and navigate life’s challenges with confidence.",
    intro:
      "SAKHI is Floydee Future Foundation's support pathway for emotional well-being, built around trust, listening, dignity, and confidence for girls, women, and youth.",
    problem:
      "Adolescents and women today face increasing emotional pressures arising from academic stress, social expectations, family challenges, workplace demands, digital exposure, and changing life circumstances. Despite these challenges, emotional well-being remains one of the most neglected areas of health. SAKHI creates safe and supportive spaces where individuals can learn, express themselves, seek guidance, and build resilience for healthier and happier lives.",
    audience: "Adolescent Girls, Women, Young adults, Teachers, Parents, and Community groups ",
    activities: [
      "Emotional Well-being: Understanding emotions, self-awareness, emotional regulation.",
      "Resilience Building-Developing coping skills and adaptability.",
      "Life Skills & Self-Esteem: Confidence building, decision-making, communication.",
      "Mental Health Literacy: Reducing stigma and promoting help-seeking behaviour."
    ],
    impact: "Building emotionally safe, resilient, and empowered adolescents and women through well-being education, life skills, support systems, and resilience-building interventions"
  },
  vidya: {
    title: "VIDYA",
    tagline: "Building Pathways from Education to Employment",
    eyebrow: "Education, skills and employability",
    image: websiteVidyaHero,
    cardImage: websiteProgramVidyaCard,
    statement: "VIDYA empowers youth with future-ready digital skills, career readiness, and employment pathways that bridge the gap between education and meaningful livelihoods.",
    intro:
      "VIDYA is a structured education-to-employment program that helps students and aspiring software professionals build practical technology skills, workplace confidence, career direction, and industry exposure.",
    problem:
      "Many young people graduate with academic qualifications but limited practical experience, career guidance, industry exposure, or access to professional networks. VIDYA closes that gap through hands-on learning, mentorship, employability training, and pathways to opportunity.",
    audience: "Students from underserved communities, graduates, aspiring software professionals, colleges, public institutions, and skill-building partners.",
    activities: [
      "Digital & Technology Skills: Software development, AI, cybersecurity, digital tools.",
      "Soft skills & Career Readiness: Communication, workplace readiness, interviews, personal branding",
      "Mentorship & Guided Growth: Connecting learners with mentors, industry professionals who provide guidance, encouragement, insights, and support to help them make informed academic and career decisions",
      "Experiential Learning & Practical Application:Providing opportunities for hands-on learning, project-based experiences, real-world problem-solving, and collaborative activities that transform knowledge into practical capability."
    ],
    impact: "VIDYA aims to empower 5,000+ youth annually with future-ready skills, career readiness, mentorship, and hands-on learning experiences, preparing them to succeed in an increasingly dynamic and technology-driven world.",
    story: {
      focusLabel: "What learners build",
      focusTitle: "Practical capability for the world of work.",
      focusText:
        "VIDYA brings technology foundations, professional skills, mentorship, and real-world exposure into one structured learning experience.",
      focusAreas: [
        {
          title: "Engineering mindset and technology foundations",
          text: "Learners explore Agile practices, the software development lifecycle, MVP thinking, cybersecurity, and design thinking."
        },
        {
          title: "From idea to execution",
          text: "Git, GitHub, frontend and backend concepts, AI and ML, and collaborative ideation turn theory into practical work."
        },
        {
          title: "Soft skills development",
          text: "Communication, teamwork, leadership, problem solving, time management, and storytelling strengthen workplace confidence."
        },
        {
          title: "Career readiness and professional growth",
          text: "Resume building, LinkedIn, personal branding, mock interviews, workplace etiquette, networking, and goal setting prepare learners for opportunity."
        }
      ],
      journeyLabel: "How VIDYA works",
      journeyTitle: "A clear pathway from education to employment.",
      journeyText:
        "Each stage helps learners move forward with stronger skills, sharper career direction, and greater access to industry.",
      journeySteps: [
        {
          title: "Mobilization",
          text: "Reach motivated students and introduce the opportunity."
        },
        {
          title: "Enrolment",
          text: "Bring learners into a structured, supportive program."
        },
        {
          title: "Training sessions",
          text: "Build practical technology and professional skills."
        },
        {
          title: "Industry exposure",
          text: "Connect learning with real workplace expectations."
        },
        {
          title: "Career counseling",
          text: "Help learners make informed academic and career decisions."
        },
        {
          title: "Placement assistance",
          text: "Support the transition from preparation to opportunity."
        }
      ],
      secondaryImage: studentSanika,
      secondaryImageAlt: "A student building career-ready technology skills through VIDYA",
      impactMetric: "5,000+",
      impactLabel: "youth annual impact goal",
      impactText: "VIDYA aims to expand access to digital literacy, emerging technologies, mentorship, and employability pathways for young people each year.",
      callToAction: ["Bring VIDYA to your institution", "/book-a-program"],
      metaTitle: "VIDYA | Tech Skills and Career Readiness | Floydee Future Foundation",
      metaDescription: "VIDYA equips students and youth with software skills, career guidance, mock interviews, mentorship, and industry exposure across India."
    }
  }
};

const partnerNames = [
  "Udayan Care",
  "Shah and Anchor College",
  "SIES",
  "Rajiv Gandhi Institute of Technology",
  "PES University",
  "SNDT Women's University",
  "Oxford College",
  "Vemana Institute"
];

const programAcademicPartners: Partial<Record<keyof typeof programPages, PartnerLogo[]>> = {
  aarohi: [
    { name: "Orchids The International School", image: aarohiOrchids, note: "Academic partner" },
    { name: "Harimati Girls' High Madrasah", image: aarohiHarimatiMadrasah, note: "Academic partner" },
    { name: "De Sovrani", image: aarohiDeSovrani, note: "Academic partner" },
    { name: "AAROHI academic partner school", image: aarohiSchoolSeal, note: "School partner" },
    { name: "Udayan Care", image: aarohiUdayanCare, note: "Community partner" },
    { name: "Janki Devi Memorial College", image: aarohiJankiDevi, note: "Academic partner" },
    { name: "Help Foundation", image: aarohiHelpFoundation, note: "Community partner" },
    { name: "Hayden Hall", image: aarohiHaydenHall, note: "Community partner" },
    { name: "SPK Jain Futuristic Academy", image: aarohiSpkJain, note: "Academic partner" }
  ],
  vidya: [
    { name: "Shah and Anchor Kutchhi Engineering College", image: vidyaShahAnchor, note: "Academic partner" },
    { name: "Ramniranjan Jhunjhunwala College", image: vidyaRamniranjan, note: "Academic partner" },
    { name: "SIES College of Arts, Science and Commerce", image: vidyaSies, note: "Academic partner" },
    { name: "NG Acharya and DK Marathe College", image: vidyaNgadkm, note: "Academic partner" },
    { name: "Government Engineering College, Siwan", image: vidyaGovernmentEngineeringSiwan, note: "Academic partner" },
    { name: "Sitamarhi Institute of Engineering", image: vidyaSitamarhi, note: "Academic partner" },
    { name: "SNDT Women's University", image: vidyaSndt, note: "Academic partner" },
    { name: "Vemana Institute of Technology", image: vidyaVemana, note: "Academic partner" },
    { name: "Jyoti Institute of Technology", image: vidyaJyoti, note: "Academic partner" },
    { name: "Datta Meghe Institute of Technology", image: vidyaDattaMeghe, note: "Academic partner" },
    { name: "APS College of Engineering", image: vidyaAps, note: "Academic partner" },
    { name: "Rajiv Gandhi Institute of Technology", image: vidyaRajivGandhi, note: "Academic partner" },
    { name: "BMN Institute of Technology", image: vidyaBmnit, note: "Academic partner" },
    { name: "PES University", image: vidyaPes, note: "Academic partner" },
    { name: "University of Engineering and Management, Jaipur", image: vidyaUemJaipur, note: "Academic partner" },
    { name: "Ram-Eesh Institute of Technology", image: vidyaRamEesh, note: "Academic partner" },
    { name: "Bharati Vidyapeeth University", image: vidyaBharatiVidyapeeth, note: "Academic partner" },
    { name: "The Oxford College of Engineering", image: vidyaOxford, note: "Academic partner" }
  ]
};

const corporatePartners: PartnerLogo[] = [
  { name: "Apex Laboratories Pvt. Ltd", image: corporateApex, note: "Corporate sponsor" },
  { name: "Emcure Pharmaceuticals", image: corporateEmcure, note: "Corporate partner" },
  { name: "Naree Health", initials: "NH", note: "Health partner" },
  { name: "PKG Medical College and Hospitals", image: corporatePkg, note: "Hospital partner" }
];

const studentTestimonials: StudentTestimonial[] = [
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiBidisha,
    name: "Bidisha",
    program: "AAROHI",
    quote: "The session did not just give us information. It gave us language: words to describe what we feel, words to use with a doctor, words to use with our own families."
  },
  {
    category: "VIDYA",
    detail: "Oxford College of Engineering, Electrical and Electronics Engineering",
    image: vidyaRabiya,
    name: "Rabiya",
    program: "VIDYA",
    quote: "An amazing and truly informative bootcamp experience."
  },
  {
    category: "VIDYA",
    detail: "PES University, Computer Science Engineering",
    image: vidyaSanika,
    name: "Sanika",
    program: "VIDYA",
    quote: "A very valuable and practical learning experience."
  },
  {
    category: "VIDYA",
    detail: "Girijananda Chowdhury University, Computer Science Engineering",
    image: vidyaDeepakGcu,
    name: "Deepak",
    program: "VIDYA",
    quote: "A valuable and practical learning experience for my career."
  },
  {
    category: "VIDYA",
    detail: "Ramniranjan Jhunjhunwala College, BSc Computer Science",
    image: vidyaSujal,
    name: "Sujal",
    program: "VIDYA",
    quote: "Practical learning that built confidence and real-world skills."
  },
  {
    category: "VIDYA",
    detail: "Rajiv Gandhi Institute of Technology, Electronics and Communication Engineering",
    image: vidyaDeepika,
    name: "Deepika",
    program: "VIDYA",
    quote: "A valuable learning opportunity that built both technical and soft skills."
  },
  {
    category: "VIDYA",
    detail: "BNM Institute of Technology, Computer Science and Engineering",
    image: vidyaLakshmishree,
    name: "Lakshmishree",
    program: "VIDYA",
    quote: "I gained essential AI, machine learning, and cybersecurity skills that can support my future engineering career."
  },
  {
    category: "VIDYA",
    detail: "Girijananda Chowdhury University, Computer Science Engineering",
    image: vidyaIshminaSultana,
    name: "Ishmina Sultana",
    program: "VIDYA",
    quote: "The bootcamp built confidence and gave me practical exposure to GenAI, UI/UX, and cybersecurity."
  },
  {
    category: "VIDYA",
    detail: "N. G. Acharya and D. K. Marathe College, BSc IT",
    image: vidyaNishaRathod,
    name: "Nisha Ramesh Rathod",
    program: "VIDYA",
    quote: "The bootcamp helped me build AI and prompt engineering basics with more confidence for real-world application."
  },
  {
    category: "VIDYA",
    detail: "Ramniranjan Jhunjhunwala College, BSc Computer Science",
    image: vidyaDeepakChauhan,
    name: "Deepak Chauhan",
    program: "VIDYA",
    quote: "A practical bootcamp experience sharpened my coding, cybersecurity, and resume skills for an IT career."
  },
  {
    category: "VIDYA",
    detail: "N. G. Acharya and D. K. Marathe College, BSc IT",
    image: vidyaKhanSafiya,
    name: "Khan Safiya",
    program: "VIDYA",
    quote: "The bootcamp built my leadership, cybersecurity, and IT skills, and showed me how technology can create social impact."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiRaimaDas,
    name: "Raima Das",
    program: "AAROHI",
    quote: "I used to avoid talking about menstrual health even with my friends, but now I feel like it is okay to have these conversations."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiSonikaDey,
    name: "Sonika Dey",
    program: "AAROHI",
    quote: "We talked about things in one hour that I had never discussed in years, and it helped more than I expected."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiEshaDas,
    name: "Esha Das",
    program: "AAROHI",
    quote: "Learning that stress, diet, and sleep can affect my cycle was genuinely reassuring."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiAnushkaDas,
    name: "Anushka Das",
    program: "AAROHI",
    quote: "Having menstrual health myths addressed one by one was both surprising and freeing."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiAnushkaDutta,
    name: "Anushka Dutta",
    program: "AAROHI",
    quote: "Understanding my cycle, my diet, and my body's signals feels like something every girl deserves to know."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiAfshanAnjum,
    name: "Afshan Anjum",
    program: "AAROHI",
    quote: "Most of what I knew about menstrual health came from whispers and guesses. A proper, informed conversation felt completely different."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiIpshitaBhattacharjee,
    name: "Ipshita Bhattacharjee",
    program: "AAROHI",
    quote: "Health is not only about what happens when something goes wrong. It is also about understanding when everything is going right."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiFirozaKhatun,
    name: "Firoza Khatun",
    program: "AAROHI",
    quote: "The session was very informative. I learnt things I genuinely did not know before, and a lot of my doubts were cleared."
  },
  {
    category: "AAROHI",
    detail: "AAROHI participant",
    image: aarohiStudent,
    name: "Student participant",
    program: "AAROHI",
    quote: "The topics were explained in a simple and clear way. It helped me learn how our bodies actually work."
  },
  {
    category: "HEALTH SCREENING CAMP",
    detail: "Health screening camp participant",
    image: screeningSaniaParveen,
    name: "Sania Parveen",
    program: "Health Screening Camp",
    quote: "The doctors were so friendly that I did not feel nervous at all. They told me things about my own health that I had never been told before."
  },
  {
    category: "HEALTH SCREENING CAMP",
    detail: "Health screening camp participant",
    image: screeningShaguftaParveen,
    name: "Shagufta Parveen",
    program: "Health Screening Camp",
    quote: "The doctor told me what my body needed, and I am going to make sure I follow her advice."
  },
  {
    category: "HEALTH SCREENING CAMP",
    detail: "Health screening camp participant",
    image: screeningSanaParveen,
    name: "Sana Parveen",
    program: "Health Screening Camp",
    quote: "The doctor listened carefully, ran a few checks, and explained what I needed to do to take better care of myself."
  },
  {
    category: "HEALTH SCREENING CAMP",
    detail: "Health screening camp participant",
    image: screeningBidishaKhatun,
    name: "Bidisha Khatun",
    program: "Health Screening Camp",
    quote: "Nobody had ever given me that kind of personal health guidance before."
  },
  {
    category: "HEALTH SCREENING CAMP",
    detail: "Health screening camp participant",
    image: screeningStudentCheckup,
    name: "Student participant",
    program: "Health Screening Camp",
    quote: "This was my first proper health checkup. The doctor explained my condition clearly and told me how to take care of myself."
  },
  {
    category: "HEALTH SCREENING CAMP",
    detail: "Health screening camp participant",
    image: screeningStudentGuidance,
    name: "Student participant",
    program: "Health Screening Camp",
    quote: "The doctor was approachable and explained everything in simple language. I am going to follow her advice."
  }
];

const gallerySections: GallerySection[] = [
  {
    category: "Naree Health Awareness",
    images: [
      { alt: "Session with Help Foundation", caption: "Help Foundation awareness session", image: galleryHelpFoundation1 },
      { alt: "Session with Help Foundation", caption: "Help Foundation awareness session", image: galleryHelpFoundation2 },
      { alt: "Session with Help Foundation", caption: "Help Foundation awareness session", image: galleryHelpFoundation3 }
    ],
    summary: "Community health awareness moments with Help Foundation.",
    title: "Session with Help Foundation"
  },
  {
    category: "Naree Health Awareness",
    images: [
      { alt: "Session with SPK Jain Academy", caption: "SPK Jain Academy awareness session", image: gallerySpkJain1 },
      { alt: "Session with SPK Jain Academy", caption: "SPK Jain Academy awareness session", image: gallerySpkJain2 },
      { alt: "Session with SPK Jain Academy", caption: "SPK Jain Academy awareness session", image: gallerySpkJain3 }
    ],
    summary: "Student-facing health conversations with SPK Jain Academy.",
    title: "Session with SPK Jain Academy"
  },
  {
    category: "Naree Health Awareness",
    images: [
      { alt: "Session with JDMC under DU", caption: "JDMC under DU awareness session", image: galleryJdmc1 },
      { alt: "Session with JDMC under DU", caption: "JDMC under DU awareness session", image: galleryJdmc2 },
      { alt: "Session with JDMC under DU", caption: "JDMC under DU awareness session", image: galleryJdmc3 }
    ],
    summary: "College health awareness session with Janki Devi Memorial College under DU.",
    title: "Session with JDMC under DU"
  },
  {
    category: "Naree Health Awareness",
    images: [
      { alt: "Session with Hayden Hall", caption: "Hayden Hall awareness session", image: galleryHaydenHall1 },
      { alt: "Session with Hayden Hall", caption: "Hayden Hall awareness session", image: galleryHaydenHall2 },
      { alt: "Session with Hayden Hall", caption: "Hayden Hall awareness session", image: galleryHaydenHall3 }
    ],
    summary: "Community session moments with Hayden Hall.",
    title: "Session with Hayden Hall"
  },
  {
    category: "Naree Health Awareness",
    images: [
      { alt: "Session with Hatiara Girls' High Madrasa", caption: "Hatiara Girls' High Madrasa awareness session", image: galleryHatiara1 },
      { alt: "Session with Hatiara Girls' High Madrasa", caption: "Hatiara Girls' High Madrasa awareness session", image: galleryHatiara2 },
      { alt: "Session with Hatiara Girls' High Madrasa", caption: "Hatiara Girls' High Madrasa awareness session", image: galleryHatiara3 }
    ],
    summary: "School-based health awareness with Hatiara Girls' High Madrasa.",
    title: "Session with Hatiara Girls' High Madrasa"
  },
  {
    category: "Naree Health Awareness",
    images: [
      { alt: "Session with Bidhannagar Govt High School", caption: "Bidhannagar Govt High School awareness session", image: galleryBidhannagar1 },
      { alt: "Session with Bidhannagar Govt High School", caption: "Bidhannagar Govt High School awareness session", image: galleryBidhannagar2 },
      { alt: "Session with Bidhannagar Govt High School", caption: "Bidhannagar Govt High School awareness session", image: galleryBidhannagar3 }
    ],
    summary: "Awareness session moments with Bidhannagar Govt High School.",
    title: "Session with Bidhannagar Govt High School"
  },
  {
    category: "Naree Health Awareness",
    images: [
      { alt: "Session with Udayan Care, Kolkata", caption: "Udayan Care Kolkata awareness session", image: galleryUdayanCare1 },
      { alt: "Session with Udayan Care, Kolkata", caption: "Udayan Care Kolkata awareness session", image: galleryUdayanCare2 },
      { alt: "Session with Udayan Care, Kolkata", caption: "Udayan Care Kolkata awareness session", image: galleryUdayanCare3 }
    ],
    summary: "Awareness and dialogue moments with Udayan Care, Kolkata.",
    title: "Session with Udayan Care, Kolkata"
  },
  {
    category: "Cervical Cancer Awareness",
    images: [
      { alt: "Cohort 1 with Bidhannagar Govt High School", caption: "Cohort 1 awareness session", image: galleryCohort1Bidhannagar1 },
      { alt: "Cohort 1 with Bidhannagar Govt High School", caption: "Cohort 1 awareness session", image: galleryCohort1Bidhannagar2 },
      { alt: "Cohort 1 with Bidhannagar Govt High School", caption: "Cohort 1 awareness session", image: galleryCohort1Bidhannagar3 }
    ],
    summary: "Cervical cancer awareness session with Cohort 1 at Bidhannagar Govt High School.",
    title: "Cohort 1 with Bidhannagar Govt High School"
  },
  {
    category: "Cervical Cancer Awareness",
    images: [
      { alt: "Cohort 2 with Bidhannagar Govt High School", caption: "Cohort 2 awareness session", image: galleryCohort2Bidhannagar1 },
      { alt: "Cohort 2 with Bidhannagar Govt High School", caption: "Cohort 2 awareness session", image: galleryCohort2Bidhannagar2 }
    ],
    summary: "Cervical cancer awareness session with Cohort 2 at Bidhannagar Govt High School.",
    title: "Cohort 2 with Bidhannagar Govt High School"
  },
  {
    category: "Health Screening Camp",
    images: [
      { alt: "Health screening camp participant registration", caption: "Health Screening Camp", image: galleryHealthCamp1 },
      { alt: "Health screening camp clinical desk", caption: "Health Screening Camp", image: galleryHealthCamp2 },
      { alt: "Health screening camp student checkup", caption: "Health Screening Camp", image: galleryHealthCamp3 },
      { alt: "Health screening camp doctor consultation", caption: "Health Screening Camp", image: galleryHealthCamp4 },
      { alt: "Health screening camp group interaction", caption: "Health Screening Camp", image: galleryHealthCamp5 },
      { alt: "Health screening camp care team", caption: "Health Screening Camp", image: galleryHealthCamp6 }
    ],
    summary: "On-ground screening, consultation, and guidance moments from the Health Screening Camp.",
    title: "Moments from Health Screening Camp"
  }
];

const legalPages: Record<"privacy" | "terms", LegalPageContent> = {
  privacy: {
    eyebrow: "Privacy Policy",
    intro:
      "Floydee Future Foundation respects the privacy of people who visit our website, contact us, make donation enquiries, partner with us, or take part in our programs. This policy explains how we handle information shared through our public website and related foundation communications.",
    sections: [
      {
        title: "Information we collect",
        body: [
          "We may collect information you choose to share, such as your name, email address, phone number, organisation, donation or program interest, message details, and communication preferences.",
          "When you use the website, basic technical information such as device type, browser, approximate location, pages visited, referral source, and cookie or analytics identifiers may be collected to keep the website useful and secure."
        ]
      },
      {
        title: "How we use information",
        body: [
          "We use information to respond to enquiries, coordinate donations, issue donation or 80G follow-up details where applicable, manage program or partnership requests, improve our website, and communicate foundation updates.",
          "Program-related information may be used to plan outreach, delivery, reporting, safeguarding, and impact documentation, always with care for dignity and confidentiality."
        ]
      },
      {
        title: "Communications and consent",
        body: [
          "If you submit a form or share your contact details, we may contact you by phone, email, SMS, or WhatsApp about your enquiry, donation, partnership, campaign, or program request.",
          "You may ask us to stop non-essential communications at any time by contacting us at contact@floydeefoundation.org."
        ]
      },
      {
        title: "Cookies, analytics, and website improvement",
        body: [
          "The website may use cookies or similar technologies to understand traffic, improve performance, remember preferences, and protect forms from misuse.",
          "You can control cookies through your browser settings, though some website features may not work as intended if cookies are disabled."
        ]
      },
      {
        title: "Sharing and safeguards",
        body: [
          "We do not sell personal information. We may share limited information with trusted service providers, payment or donation support teams, implementation partners, professional advisors, or authorities when required for lawful, operational, safety, or compliance reasons.",
          "We use reasonable administrative and technical safeguards, but no internet-based system can be guaranteed to be completely secure."
        ]
      },
      {
        title: "Your choices and contact",
        body: [
          "You may request access, correction, or deletion of information you have shared with us, subject to legal, donation, reporting, safeguarding, and operational requirements.",
          "For privacy questions, write to contact@floydeefoundation.org or contact Floydee Future Foundation at International Financial Hub, West Tower, 13th Floor, Mani Casadona, New Town, Kolkata-700156, West Bengal."
        ]
      }
    ],
    title: "Privacy Policy"
  },
  terms: {
    eyebrow: "Terms & Conditions",
    intro:
      "These terms govern use of the Floydee Future Foundation website and public digital materials. By using the website, submitting forms, or engaging through linked pages, you agree to use the website responsibly and in line with these terms.",
    sections: [
      {
        title: "Use of this website",
        body: [
          "You may use this website to learn about the foundation, read program information, submit enquiries, express donation interest, request collaboration, or access public resources.",
          "You agree not to misuse the website, interfere with its operation, attempt unauthorised access, submit false or harmful information, or use the website for unlawful purposes."
        ]
      },
      {
        title: "Enquiries, donations, and program requests",
        body: [
          "Website forms are enquiry and coordination tools. A donation, campaign, workshop, or program request is confirmed only after the foundation team reviews details and completes any required follow-up.",
          "Information about tax benefits, receipts, campaigns, or partnerships is provided for coordination and may require verification before final confirmation."
        ]
      },
      {
        title: "Content ownership and permitted use",
        body: [
          "Text, photographs, graphics, program names, reports, layouts, and other materials on this website are owned by or licensed to Floydee Future Foundation unless otherwise stated.",
          "You may share public pages for informational purposes with appropriate credit. You may not copy, modify, sell, misrepresent, or commercially exploit website content without written permission."
        ]
      },
      {
        title: "External links and third-party services",
        body: [
          "The website may link to third-party websites, social platforms, payment channels, maps, documents, or partner resources. These services are governed by their own terms and privacy practices.",
          "Floydee Future Foundation is not responsible for the content, security, availability, or practices of third-party websites."
        ]
      },
      {
        title: "Accuracy, availability, and updates",
        body: [
          "We aim to keep website information clear and current, but program details, campaign availability, dates, partner information, and resources may change.",
          "The website may be updated, suspended, or changed at any time for maintenance, security, operational, or editorial reasons."
        ]
      },
      {
        title: "Liability and contact",
        body: [
          "The website is provided for general information and public engagement. It is not a substitute for medical, legal, financial, or professional advice.",
          "To the fullest extent permitted by law, Floydee Future Foundation is not liable for losses arising from website use, unavailable pages, third-party links, or reliance on general website information.",
          "For questions about these terms, write to contact@floydeefoundation.org."
        ]
      }
    ],
    title: "Terms & Conditions"
  }
};

const presenceLocations = [
  { name: "Jammu & Kashmir", x: "32.8%", y: "10.9%", tone: "north" },
  { name: "Delhi", x: "37.4%", y: "29.1%", tone: "north" },
  { name: "Lucknow", x: "43.2%", y: "35.6%", tone: "central" },
  { name: "Patna", x: "55.8%", y: "38.3%", tone: "central" },
  { name: "Darjeeling", x: "65.3%", y: "35.6%", tone: "east" },
  { name: "Guwahati", x: "72.1%", y: "36.9%", tone: "east" },
  { name: "Kolkata", x: "64.6%", y: "49.1%", tone: "east" },
  { name: "Mumbai", x: "22.0%", y: "60.0%", tone: "west" },
  { name: "Pune", x: "22.7%", y: "62.7%", tone: "west" },
  { name: "Bangalore", x: "34.1%", y: "80.3%", tone: "south" },
  { name: "Chennai", x: "39.9%", y: "83.0%", tone: "south" }
] as const;

const newsCards = [
  {
    category: "News",
    title: "Why VIDYA exists",
    text: "Bridging the gap between learning and opportunity through future-ready skills, mentorship, career readiness, and hands-on learning experiences.",
    image: studentSanika
  },
  {
    category: "Initiative",
    title: "Menstrual health screening camp",
    text: "150+ adolescent girls from a government school in Kolkata were empowered through a health awareness and screening initiative that promoted preventive healthcare, informed decision-making, and overall well-being.",
    image: healthCamp1
  },
  {
    category: "Resource",
    title: "Interim Report 2025",
    text: "A resource-centre seed item for reports, research, media material, and source-backed impact updates.",
    image: programMapping
  }
];

const latestHeroImages = {
  gallery: heroGalleryStudents,
  latest: heroLatestField,
  news: heroNewsWorkshop,
  resources: heroResourcesScreening,
  stories: heroAboutCorridor
} as const;

type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  imageAlt?: string;
  initials: string;
};

const coreTeam: TeamMember[] = [
  {
    name: "Subhodyuti Chakraborty",
    role: "Founder and Director",
    bio: "Brings over 15 years of experience in software development and global teams, shaping product strategy and execution.",
    image: teamSubhodyuti,
    imageAlt: "Subhodyuti Chakraborty, Founder and Director",
    initials: "SC"
  },
  {
    name: "Ipsito Ghosh",
    role: "Head of Technology",
    bio: "Brings more than 20 years of software development and engineering leadership experience, supporting technical excellence and team performance.",
    image: teamIpsito,
    imageAlt: "Ipsito Ghosh, Head of Technology",
    initials: "IG"
  },
  {
    name: "Disha Mishra",
    role: "Head, Program Delivery & Partnerships",
    bio: "Leads program delivery and strategic partnerships across academia, industry, institutions, and community collaborators.",
    image: teamDisha,
    imageAlt: "Disha Mishra, Head of Program Delivery and Partnerships",
    initials: "DM"
  },
  {
    name: "Sreeparna Roy",
    role: "Head of Marketing",
    bio: "Brings over 16 years of marketing experience, aligning campaigns with brand vision while strengthening performance, reach, and scalability.",
    image: teamSreeparna,
    imageAlt: "Sreeparna Roy, Head of Marketing",
    initials: "SR"
  },
  {
    name: "Krishna Shah",
    role: "Head of Finance",
    bio: "Brings 6+ years of experience across finance operations, reporting, budgeting, and financial controls, helping strengthen governance and sustainable planning.",
    image: teamKrishnaShah,
    imageAlt: "Krishna Shah, Head of Finance",
    initials: "KS"
  },
  {
    name: "Riya Banerjee",
    role: "Social Media Executive",
    initials: "RB"
  }
];

const expertAdvisors: TeamMember[] = [
  {
    name: "Dr. Himanshu Borase",
    role: "Expert Advisor, Women's Health & Fertility",
    bio: "An expert in fertility and women's health, Dr. Borase helps bridge clinical practice with digital femtech and accessible care.",
    image: teamHimanshu,
    imageAlt: "Dr. Himanshu Borase, Expert Advisor",
    initials: "HB"
  },
  {
    name: "Dr. Suparna Biswas",
    role: "Expert Advisor",
    initials: "SB"
  }
];

async function postInquiry(path: string, payload: Record<string, string | number>) {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error("We could not reach the Floydee email service. Please try again in a moment or email contact@floydeefoundation.org.");
  }

  const result = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(result?.message ?? "We could not send your enquiry right now. Please try again.");
  }

  return result?.message ?? "Thank you. Your enquiry has been sent.";
}

type CustomSelectProps = {
  invalid?: boolean;
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  value: string;
};

function CustomSelect({ invalid = false, label, name, onChange, options, placeholder, value }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const listboxId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!fieldRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectOption = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={`select-field${open ? " is-open" : ""}${invalid ? " is-invalid" : ""}`} ref={fieldRef}>
      <span className="field-label" id={labelId}>{label}</span>
      <input type="hidden" name={name} value={value} />
      <button
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-labelledby={labelId}
        className={`select-trigger${value ? " has-value" : ""}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleTriggerKeyDown}
        type="button"
      >
        <span>{value || placeholder}</span>
        <span className="select-chevron" aria-hidden="true"></span>
      </button>
      <div className="select-menu" id={listboxId} role="listbox" aria-labelledby={labelId}>
        {options.map((option) => (
          <button
            aria-selected={value === option}
            className="select-option"
            key={option}
            onClick={() => selectOption(option)}
            role="option"
            type="button"
          >
            <span>{option}</span>
            <span className="select-check" aria-hidden="true"></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileOpen);
    document.body.classList.toggle("dropdown-open", Boolean(activeMenu));

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    const closeDropdownOutside = (event: PointerEvent) => {
      if (!(event.target as Element | null)?.closest(".nav-group")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", closeDropdownOutside);
    return () => {
      document.body.classList.remove("menu-open", "dropdown-open");
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", closeDropdownOutside);
    };
  }, [mobileOpen, activeMenu]);

  const closeMenus = () => {
    setActiveMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className="site-header" id="top" onMouseLeave={() => setActiveMenu(null)}>
      <a className="brand" href="/" aria-label="Floydee Future Foundation home">
        <img className="brand-logo header-logo" src={floydeeCircleLogo} alt="Floydee Foundation" />
        <span className="brand-title"><span>Floydee</span> <span className="brand-title-gold">Foundation</span></span>
      </a>

      <nav className={`main-nav${mobileOpen ? " open" : ""}`} id="main-navigation" aria-label="Primary navigation">
        {navGroups.map((group) => (
          <div
            className={`nav-group${activeMenu === group.label ? " is-open" : ""}`}
            key={group.label}
          >
            {group.href ? (
              <a className="nav-trigger nav-trigger-link" href={group.href} onClick={closeMenus}>{group.label}</a>
            ) : (
              <>
                <button
                  className="nav-trigger"
                  type="button"
                  aria-expanded={activeMenu === group.label}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveMenu((current) => (current === group.label ? null : group.label));
                  }}
                >
                  {group.label}
                </button>
                <div className="nav-menu">
                  {group.links.map(([label, href, className]) => (
                    <a className={className} href={href} key={label} onClick={closeMenus}>
                      {label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>
      <div className="header-actions">
        <LanguageSelector />
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          onClick={() => {
            setMobileOpen((isOpen) => !isOpen);
            setActiveMenu(null);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
          <span className="sr-only">Open menu</span>
        </button>
      </div>
    </header>
  );
}

type SupportFormProps = {
  defaultFrequency?: "One-time" | "Monthly";
  defaultProgram?: string;
  defaultTargetType?: DonationTargetType;
};

function SupportForm({ defaultFrequency = "One-time", defaultProgram = "", defaultTargetType = "program" }: SupportFormProps) {
  const { locale } = useLocale();
  const [frequency, setFrequency] = useState(defaultFrequency);
  const [amount, setAmount] = useState("500");
  const [targetType, setTargetType] = useState<DonationTargetType>(defaultTargetType);
  const [program, setProgram] = useState(defaultProgram);
  const [targetSlug, setTargetSlug] = useState("");
  const [targetOptions, setTargetOptions] = useState<BlogCategory[]>([]);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const selectedProgramSlug = programValueMap[program] ?? "";
  const needsProgram = targetType === "program" || targetType === "campaign" || targetType === "workshop";
  const needsTargetName = targetType === "campaign" || targetType === "workshop";
  const availableTargets = targetOptions.filter((option) => (
    needsTargetName &&
    option.kind === targetType &&
    option.programAssociation === selectedProgramSlug
  ));
  const allTargetSelected = needsTargetName && targetSlug === "all";
  const selectedTarget = availableTargets.find((option) => option.slug === targetSlug);

  useEffect(() => {
    setFrequency(defaultFrequency);
    setTargetType(defaultTargetType);
    setProgram(defaultProgram);
    setTargetSlug(defaultTargetType === "campaign" || defaultTargetType === "workshop" ? "all" : "");
    setConsentAccepted(false);
    setStatus("");
    setSubmitted(false);
  }, [defaultFrequency, defaultProgram, defaultTargetType]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/blog-categories`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((result: { categories?: BlogCategory[] } | null) => setTargetOptions(result?.categories ?? []))
      .catch(() => {
        if (!controller.signal.aborted) setTargetOptions([]);
      });
    return () => controller.abort();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitted(true);

    if ((needsProgram && !program) || (needsTargetName && !allTargetSelected && !selectedTarget) || !amount || !consentAccepted || !form.checkValidity()) {
      setStatus("Please complete the required fields correctly.");
      form.reportValidity();
      return;
    }

    setIsSubmitting(true);
    setStatus("Sending your donation enquiry...");

    try {
      const message = await postInquiry("/api/donation-inquiries", {
        name: new FormData(form).get("name")?.toString() ?? "",
        email: new FormData(form).get("email")?.toString() ?? "",
        frequency,
        amount: Number(amount),
        program: needsProgram ? program : "",
        targetName: allTargetSelected ? `All ${targetType === "campaign" ? "campaigns" : "workshops"}` : selectedTarget?.name ?? "",
        targetSlug: allTargetSelected ? "all" : selectedTarget?.slug ?? "",
        targetType,
        consentStatus: donationConsentText,
        locale
      });

      setStatus(message);
      form.reset();
      setFrequency(defaultFrequency);
      setAmount("500");
      setTargetType(defaultTargetType);
      setProgram(defaultProgram);
      setTargetSlug(defaultTargetType === "campaign" || defaultTargetType === "workshop" ? "all" : "");
      setConsentAccepted(false);
      setSubmitted(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We could not send your donation enquiry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="support-form" id="support-form" noValidate onSubmit={handleSubmit}>
      <div className="toggle-group" aria-label="Donation frequency">
        {(["One-time", "Monthly"] as const).map((item) => (
          <button
            className={`toggle${frequency === item ? " active" : ""}`}
            type="button"
            key={item}
            onClick={() => {
              setFrequency(item);
              setStatus("");
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <input type="hidden" name="frequency" value={frequency} />
      <div className="amount-grid" aria-label="Suggested amounts">
        {[
          ["500", "Rs 500", "Put a health kit in the room"],
          ["1000", "Rs 1,000", "Support a menstrual health session"],
          ["2500", "Rs 2,500", "Help fund screening access"]
        ].map(([value, label, description]) => (
          <button
            type="button"
            className={`amount-card${amount === value ? " active" : ""}`}
            data-amount={value}
            key={value}
            onClick={() => {
              setAmount(value);
              setStatus("");
            }}
          >
            <strong>{label}</strong>
            <span>{description}</span>
          </button>
        ))}
        <label className={`amount-card custom-amount${!["500", "1000", "2500"].includes(amount) ? " active" : ""}`}>
          <strong>Other</strong>
          <input
            type="number"
            name="customAmount"
            min="1"
            placeholder="Amount"
            onChange={(event) => {
              setAmount(event.target.value);
              setStatus("");
            }}
          />
        </label>
      </div>
      <input type="hidden" name="amount" value={amount} />
      <div className="donation-target-panel" aria-labelledby="donation-target-title">
        <h3 id="donation-target-title">Where should this gift go?</h3>
        <div className="donation-target-grid">
          {donationTargetOptions.map((type) => (
            <button
              className={`donation-target-card${targetType === type ? " active" : ""}`}
              key={type}
              onClick={() => {
                setTargetType(type);
                setProgram(type === "generic" ? "" : type === "program" ? defaultProgram : "");
                setTargetSlug(type === "campaign" || type === "workshop" ? "all" : "");
                setStatus("");
              }}
              type="button"
            >
              <strong>{donationTargetLabels[type]}</strong>
              <span>
                {type === "program" ? "Choose a program focus." :
                  type === "campaign" ? "Choose program, then campaign." :
                    type === "workshop" ? "Choose program, then workshop." :
                      "Let the team route it where needed."}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="form-grid">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        {needsProgram ? (
          <CustomSelect
            invalid={submitted && !program}
            label={needsTargetName ? "Program" : "Program focus"}
            name="program"
            onChange={(nextProgram) => {
              setProgram(nextProgram);
              setTargetSlug(needsTargetName ? "all" : "");
              setStatus("");
            }}
            options={needsTargetName ? namedDonationProgramOptions : donationProgramOptions}
            placeholder="Select a program"
            value={program}
          />
        ) : null}
        {needsTargetName ? (
          <CustomSelect
            invalid={submitted && !allTargetSelected && !selectedTarget}
            label={targetType === "campaign" ? "Campaign name" : "Workshop name"}
            name="targetSlug"
            onChange={(nextName) => {
              if (nextName === "All") {
                setTargetSlug("all");
                setStatus("");
                return;
              }
              const matched = availableTargets.find((option) => option.name === nextName);
              setTargetSlug(matched?.slug ?? "");
              setStatus("");
            }}
            options={["All", ...availableTargets.map((option) => option.name)]}
            placeholder={program ? "All" : "Select parent program first"}
            value={allTargetSelected ? "All" : selectedTarget?.name ?? ""}
          />
        ) : null}
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Donate Now"}
        </button>
      </div>
      <label className={`consent-checkbox${submitted && !consentAccepted ? " is-invalid" : ""}`}>
        <input
          checked={consentAccepted}
          name="donationConsent"
          onChange={(event) => {
            setConsentAccepted(event.target.checked);
            setStatus("");
          }}
          required
          type="checkbox"
        />
        <span>{donationConsentText}</span>
      </label>
      <div className="donation-compliance">
        <p>Your Contributions Are Eligible For Tax Benefit Under Section 80G As Floydee Future Foundation Is Registered As Non Profit Organization</p>
        <p><strong>PAN:</strong> AAGCF6699F | <strong>80G NUMBER:</strong> AAGCF6699FF20261</p>
      </div>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}

type ContactFormProps = {
  defaultIntent?: string;
};

function ContactForm({ defaultIntent = "" }: ContactFormProps) {
  const { locale } = useLocale();
  const [intent, setIntent] = useState(defaultIntent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setIntent(defaultIntent);
    setStatus("");
    setSubmitted(false);
  }, [defaultIntent]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitted(true);

    if (!intent || !form.checkValidity()) {
      setStatus("Please complete the required fields correctly.");
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    setIsSubmitting(true);
    setStatus("Sending your enquiry...");

    try {
      const message = await postInquiry("/api/contact-inquiries", {
        name: formData.get("name")?.toString() ?? "",
        email: formData.get("email")?.toString() ?? "",
        intent,
        message: formData.get("message")?.toString() ?? "",
        locale
      });

      setStatus(message);
      form.reset();
      setIntent(defaultIntent);
      setSubmitted(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We could not send your enquiry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="contact-form" id="contact-form" noValidate onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <CustomSelect
        invalid={submitted && !intent}
        label="I want to"
        name="intent"
        onChange={(nextIntent) => {
          setIntent(nextIntent);
          setStatus("");
        }}
        options={contactIntentOptions}
        placeholder="Choose an option"
        value={intent}
      />
      <label>
        Message
        <textarea name="message" rows={4} required></textarea>
      </label>
      <button className="button button-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Enquiry"}
      </button>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}

function HomePage() {
  return (
    <>
      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Building healthy, skilled, confident futures.</h1>
            <p>
              Floydee Future Foundation works with girls, women, and youth through health access,
              emotional well-being, education, and employability programs rooted in real communities.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#donate">Donate now</a>
              <a className="button button-secondary" href="#book">Collaborate With Us</a>
              <a className="button button-text" href="/stories">Explore stories</a>
            </div>
            <div className="hero-proof" aria-label="Foundation proof points">
              <span>Section 8 foundation</span>
              <span>Kolkata and West Bengal focus</span>
              <span>Health, care, skills</span>
            </div>
          </div>
          <div className="hero-media" aria-hidden="true">
            <img src={homeHeroHealthScreening} alt="" />
            <div className="hero-card hero-card-primary">
              <strong>150+</strong>
              <span>girls reached through screening initiatives</span>
            </div>
            <div className="hero-card hero-card-secondary">
              <strong>AAROHI</strong>
              <span>Care That Changes Lives</span>
            </div>
          </div>
        </section>

        <section className="campaign-rail" id="initiative" aria-labelledby="campaign-title">
          <div className="campaign-label">
            <span>Priority campaign</span>
            <strong>Now mobilizing</strong>
          </div>
          <div>
            <h2 id="campaign-title">Menstrual health screening and education for adolescent girls.</h2>
            <p>
              With Partnership engagements Floydee Future Foundation is turning school-based awareness into
              practical screening access, PCOD awareness, cervical cancer education, and follow-up guidance.
            </p>
          </div>
          <a className="button button-primary" href="#donate">Fund the next camp</a>
        </section>

        <section className="donation-band" id="donate" aria-labelledby="donate-title">
          <div className="donation-intro">
            <span className="icon-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.4-9-9.1C1.6 8.6 3.6 5 7.1 5c2 0 3.5 1.1 4.9 3 1.4-1.9 2.9-3 4.9-3 3.5 0 5.5 3.6 4.1 6.9C19 16.6 12 21 12 21Z"/></svg>
            </span>
            <h2 id="donate-title">Turn concern into access.</h2>
            <p>Choose a program focus and leave your details. The foundation team can follow up with payment and partnership options.</p>
            <ul>
              <li>Health sessions and screening camps</li>
              <li>Learning material and dignity kits</li>
              <li>Skill-building pathways for youth</li>
            </ul>
          </div>
          <SupportForm />
        </section>

        <section className="split-section" id="about" aria-labelledby="about-title">
          <div>
            <p className="section-label">Floydee Foundation</p>
            <h2 id="about-title">The gap is not potential. The gap is access.</h2>
          </div>
          <div className="split-copy">
            <p>
              Floydee Future Foundation is a Section 8 foundation working at the intersection of
              health, well-being, education, and social impact. We help young people and women move
              from potential to access through practical, community-rooted programs.
            </p>
            <div className="access-pathway" aria-label="Floydee access pathway">
              <article>
                <span>01</span>
                <strong>Listen First</strong>
                <p>Start with schools, colleges, communities, and partners to understand what support is missing.</p>
              </article>
              <article>
                <span>02</span>
                <strong>Build Trust</strong>
                <p>Create safe program spaces where girls, women, and youth can ask, learn, and be heard.</p>
              </article>
              <article>
                <span>03</span>
                <strong>Open Access</strong>
                <p>Move awareness into screenings, learning material, dignity kits, and career-ready skills.</p>
              </article>
              <article>
                <span>04</span>
                <strong>Scale With Partners</strong>
                <p>Work with institutions and volunteers so each program can grow beyond one event.</p>
              </article>
            </div>
          </div>
          <div className="mission-panel" id="mission">
            <article className="vision-card">
              <p className="section-label">Our Vision</p>
              <p>
                Our vision is to create an inclusive and sustainable society where young people,
                especially women and girls, have equal access to <strong>education, skills, health, and mental well-being</strong>,
                enabling them to lead confident, healthy, and purposeful lives and contribute
                meaningfully to their communities and the world.
              </p>
            </article>

            <article className="mission-card">
              <p className="section-label">Our Mission</p>
              <div className="mission-list">
                <div className="mission-item">
                  <span className="mission-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 3c3.8 2.4 5.8 5.8 5.8 10.2v3.1l-2.6-1.1-3.2 5.1-3.2-5.1-2.6 1.1v-3.1C6.2 8.8 8.2 5.4 12 3Z"/><circle cx="12" cy="10" r="1.8"/></svg>
                  </span>
                  <p>
                    To drive <strong>holistic development</strong> by strengthening health awareness,
                    access, support, well-being, dignity, and informed decision-making, especially
                    for girls and young women in need.
                  </p>
                </div>
                <div className="mission-item">
                  <span className="mission-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 10.4a10.7 10.7 0 0 1 14 0"/><path d="M8 13.4a6.2 6.2 0 0 1 8 0"/><path d="M11 16.2a1.6 1.6 0 0 1 2 0"/><path d="M12 18.8h.01"/></svg>
                  </span>
                  <p>
                    To empower youth with <strong>future-ready skills, digital confidence, and career pathways</strong>{" "}
                    through VIDYA.
                  </p>
                </div>
                <div className="mission-item">
                  <span className="mission-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.1M12 19.1v2.1M21.2 12h-2.1M4.9 12H2.8M18.5 5.5 17 7M7 17l-1.5 1.5M18.5 18.5 17 17M7 7 5.5 5.5"/><path d="m10.5 12 1 1 2.2-2.4"/></svg>
                  </span>
                  <p>
                    To create safe, inclusive spaces where individuals can
                    <strong> learn, grow, and thrive with self-worth.</strong>
                  </p>
                </div>
                <div className="mission-item">
                  <span className="mission-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M8.5 14.5c-1.2-1-2-2.5-2-4.1a5.5 5.5 0 0 1 11 0c0 1.7-.8 3.1-2 4.1-.8.7-1.1 1.3-1.2 2h-4.6c-.1-.7-.4-1.3-1.2-2Z"/><path d="M4.2 10.2H2.8M21.2 10.2h-1.4M5.8 5.2 4.7 4.1M19.3 4.1l-1.1 1.1"/></svg>
                  </span>
                  <p>
                    To build partnerships with schools, colleges, communities, and institutions to
                    <strong> scale sustainable social impact.</strong>
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="programs" id="programs" aria-labelledby="programs-title">
          <div className="section-heading">
            <p className="section-label">Our work</p>
            <h2 id="programs-title">Pillars of Development</h2>
            <p>
              Floydee's work grows through health, support, education, employability, and
              community engagement so girls, women, and youth can move from potential to access.
            </p>
          </div>
          <div className="program-name-strip" aria-label="Floydee Future Foundation programs">
            {foundationPrograms.map(([name, tagline]) => (
              <article id={name.toLowerCase()} key={name}>
                <span>{name}</span>
                <p>{tagline}</p>
              </article>
            ))}
          </div>
          <div className="pillar-grid">
            <article className="pillar-card" id="health">
              <span className="pillar-number">1</span>
              <h3>Health, Dignity & Well-being</h3>
              <p>This pillar ensures that care is not just delivered but delivered with dignity through AAROHI and SAKHI.</p>
              <a className="button button-secondary" href="/programs/aarohi">Know More</a>
            </article>
            <article className="pillar-card" id="education">
              <span className="pillar-number">2</span>
              <h3>Skills, Education & Employability</h3>
              <p>This pillar builds capability with confidence so youth are prepared not just to work, but to lead through VIDYA.</p>
              <a className="button button-secondary" href="/programs/vidya">Know More</a>
            </article>
            <article className="pillar-card" id="community">
              <span className="pillar-number">3</span>
              <h3>Community Engagement & Scalable Impact</h3>
              <p>Our programs are rooted in real communities and designed for partnerships that can scale with trust.</p>
              <a className="button button-secondary" href="/programs">Know More</a>
            </article>
          </div>
        </section>

        <section className="impact-strip" id="impact" aria-labelledby="impact-title">
          <div>
            <p className="section-label">Impact</p>
            <h2 id="impact-title">Measured in access opened, not promises made.</h2>
          </div>
          <div className="metrics">
            <article><strong>150+</strong><span>girls supported in screening initiatives</span></article>
            <article><strong>30+</strong><span>partner relationships: 20+ VIDYA + 10+ Naree</span></article>
            <article><strong>3</strong><span>core programs across care and opportunity</span></article>
            <article><strong>3</strong><span>named pathways: AAROHI, SAKHI, and VIDYA</span></article>
          </div>
        </section>

        <section className="initiative" aria-labelledby="initiative-title">
          <div className="initiative-copy">
            <p className="section-label">Featured initiative</p>
            <h2 id="initiative-title">Menstrual health screening camp</h2>
            <p>Through partnership engagements, Floydee Future Foundation launched a menstrual health screening initiative at Government Girls High School, Rajarhat, supporting adolescent girls with health education, screening, and practical guidance.</p>
            <div className="mini-metrics"><span><strong>150</strong> girls reached</span><span><strong>1</strong> school camp</span><span><strong>3</strong> health focus areas</span></div>
            <a className="button button-primary" href="/stories">See latest initiatives</a>
          </div>
          <img src={websiteFeaturedInitiativeHealthCamp} alt="Floydee menstrual health screening camp participants" />
        </section>

        <section className="join" id="join" aria-labelledby="join-title">
          <div className="section-heading align-left">
            <p className="section-label">Join us</p>
            <h2 id="join-title">Choose the door that matches your energy.</h2>
          </div>
          <div className="join-grid">
            <article id="volunteer"><span>Volunteer</span><h3>Give time and skills</h3><p>Support outreach, content, events, training, and program delivery.</p><a href="#contact">Sign up</a></article>
            <article id="partners"><span>Partner</span><h3>Collaborate with us</h3><p>Schools, colleges, hospitals, NGOs, and CSR teams can co-create programs.</p><a href="#contact">Partner with us</a></article>
            <article id="book"><span>Book</span><h3>Bring a program in</h3><p>Request a health, well-being, or skill session for your community.</p><a href="#contact">Collaborate With Us</a></article>
            <article><span>Fund</span><h3>Support a campaign</h3><p>Help underwrite kits, screenings, learning materials, and workshops.</p><a href="#donate">Donate today</a></article>
          </div>
        </section>

        <section className="where presence-section" id="where" aria-labelledby="where-title">
          <div className="presence-shell">
            <div className="presence-copy">
              <p className="section-label">Where we work</p>
              <h2 id="where-title">Our Presence Across India</h2>
              <p>
                Floydee programs are designed to move through schools, colleges, communities, and
                institutional partners, with AAROHI, SAKHI, and VIDYA creating clear pathways into care and opportunity.
              </p>
              <div className="presence-programs" aria-label="Floydee program presence">
                {foundationPrograms.map(([name, tagline]) => (
                  <article key={name}>
                    <span className={`presence-dot presence-dot-${name.toLowerCase()}`} aria-hidden="true"></span>
                    <div>
                      <h3>{name}</h3>
                      <p>{tagline}</p>
                    </div>
                  </article>
                ))}
              </div>
              <a className="button button-secondary presence-cta" href="#book">Collaborate With Us</a>
            </div>
            <div className="presence-map-card">
              <div className="presence-map-visual">
                <img src={programMapping} alt="Floydee program presence map across India" />
                <div className="presence-pulse-layer" aria-label="Highlighted presence locations">
                  {presenceLocations.map((location) => (
                    <span
                      aria-label={location.name}
                      className={`pulse-point pulse-${location.tone}`}
                      key={location.name}
                      role="img"
                      style={{
                        "--marker-x": location.x,
                        "--marker-y": location.y
                      } as CSSProperties}
                    >
                      <span>{location.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div>
            <p className="section-label">Contact</p>
            <h2 id="contact-title">For enquiries and partnerships</h2>
            <p>International Financial Hub, West Tower, 13th Floor, Mani Casadona, New Town, Kolkata-700156, West Bengal</p>
            <p><strong>Phone:</strong> +91 91477 48064</p>
            <p><strong>Mail:</strong> contact@floydeefoundation.org</p>
          </div>
          <ContactForm />
        </section>
      </main>

      <StaticNareeAppBanner />
      <footer className="site-footer" id="trust">
        <div className="footer-brand">
          <a className="brand" href="#top"><img className="brand-logo footer-logo" src={floydeeLogo} alt="Floydee Foundation" /></a>
          <p>Section 8 foundation working with girls, women, and youth to build health, dignity, skills, and opportunity.</p>
          <SocialLinks />
        </div>
        <div><h2>Join Us</h2><a href="#donate">Donate</a><a href="#partners">Partner With Us</a><a href="#volunteer">Volunteer</a><a href="#book">Collaborate With Us</a></div>
        <div><h2>Programs</h2><a href="#aarohi">AAROHI</a><a href="#sakhi">SAKHI</a><a href="#vidya">VIDYA</a><a href="#programs">Pillars of Development</a></div>
        <div><h2>Resources</h2><a href="/news">News</a><a href="/stories">Stories</a><a href="/resources">Media Centre</a><a href="#gallery">Gallery</a></div>
        <div><h2>Contact</h2><p>New Town, Kolkata-700156</p><p>+91 91477 48064</p><p>contact@floydeefoundation.org</p></div>
        <div className="footer-bottom"><span>© 2026 Floydee Future Foundation. All rights reserved.</span><FooterLegalLinks /></div>
      </footer>
    </>
  );
}

function RouteFooter() {
  return (
    <>
      <StaticNareeAppBanner />
      <footer className="site-footer route-footer" id="trust">
        <div className="footer-brand">
          <a className="brand" href="/"><img className="brand-logo footer-logo" src={floydeeLogo} alt="Floydee Foundation" /></a>
          <p>Section 8 foundation working with girls, women, and youth to build health, dignity, skills, and opportunity.</p>
          <SocialLinks />
        </div>
        <div><h2>Join Us</h2><a href="/donate">Donate</a><a href="/partner-with-us">Partner With Us</a><a href="/volunteer">Volunteer</a><a href="/book-a-program">Collaborate With Us</a></div>
        <div><h2>Programs</h2><a href="/programs/aarohi">AAROHI</a><a href="/programs/sakhi">SAKHI</a><a href="/programs/vidya">VIDYA</a><a href="/programs">Pillars of Development</a></div>
        <div><h2>Resources</h2><a href="/news">News</a><a href="/stories">Stories</a><a href="/resources">Media Centre</a><a href="/gallery">Gallery</a></div>
        <div><h2>Contact</h2><p>New Town, Kolkata-700156</p><p>+91 91477 48064</p><p>contact@floydeefoundation.org</p></div>
        <div className="footer-bottom"><span>© 2026 Floydee Future Foundation. All rights reserved.</span><FooterLegalLinks /></div>
      </footer>
    </>
  );
}

function FooterLegalLinks() {
  return (
    <span className="footer-legal-links">
      <a href="/trust-centre">Legal</a>
      <span aria-hidden="true">·</span>
      <a href="/privacy-policy">Privacy Policy</a>
      <span aria-hidden="true">·</span>
      <a href="/terms-and-conditions">Terms & Conditions</a>
    </span>
  );
}

function SocialLinks() {
  return (
    <nav className="footer-social" aria-label="Floydee social media links">
      <span className="footer-social-label">Follow</span>
      <div className="footer-social-list">
        {socialLinks.map((link) => (
          <a className="footer-social-link" href={link.href} key={link.label} target="_blank" rel="noreferrer" aria-label={`Follow Floydee Foundation on ${link.label}`}>
            <span className="footer-social-icon" aria-hidden="true">{link.iconLabel}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function PageHero({ eyebrow, title, text, image, cta }: { eyebrow: string; title: string; text: string; image: string; cta?: [string, string] }) {
  const titleClassName = [
    "page-hero-title",
    title.length > 30 ? "is-long" : "",
    title.length > 82 ? "is-very-long" : ""
  ].filter(Boolean).join(" ");

  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="page-hero-copy">
        <p className="section-label">{eyebrow}</p>
        <h1 className={titleClassName} id="page-title">{title}</h1>
        <p>{text}</p>
        {cta ? <a className="button button-primary" href={cta[1]}>{cta[0]}</a> : null}
      </div>
      <div className="page-hero-media">
        <img src={image} alt="" />
      </div>
    </section>
  );
}

function PartnerShowcaseSection({
  eyebrow,
  title,
  text,
  partners,
  variant = "academic"
}: {
  eyebrow: string;
  title: string;
  text: string;
  partners: PartnerLogo[];
  variant?: "academic" | "corporate";
}) {
  const headingId = useId();

  return (
    <section className={`page-section partner-showcase partner-showcase-${variant}`} aria-labelledby={headingId}>
      <div className="partner-showcase-heading">
        <div>
          <p className="section-label">{eyebrow}</p>
          <h2 id={headingId}>{title}</h2>
        </div>
        <p>{text}</p>
      </div>
      <div className="partner-logo-grid">
        {partners.map((partner) => (
          <article className={`partner-logo-card${partner.image ? "" : " is-text-mark"}`} key={partner.name}>
            <div className="partner-logo-mark">
              {partner.image
                ? <img src={partner.image} alt={partner.name} loading="lazy" />
                : <span aria-hidden="true">{partner.initials}</span>}
            </div>
            <div className="partner-logo-copy">
              <h3>{partner.name}</h3>
              <p>{partner.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StudentTestimonialsSection() {
  const headingId = useId();
  const featured = studentTestimonials[0];
  const categories: TestimonialCategory[] = ["VIDYA", "AAROHI", "HEALTH SCREENING CAMP"];

  return (
    <section className="page-section student-testimonials-section" aria-labelledby={headingId}>
      <div className="student-testimonials-heading">
        <div>
          <p className="section-label">Student testimonials</p>
          <h2 id={headingId}>Learning, care, and confidence in their words.</h2>
        </div>
        <p>
          Direct voices from VIDYA learners, AAROHI participants, and students who attended the
          Health Screening Camp. Each card keeps the student context, image, and quote together.
        </p>
      </div>
      <article className="testimonial-feature">
        <div className="testimonial-feature-media">
          <img src={featured.image} alt={`${featured.name}, ${featured.program} participant`} loading="lazy" />
        </div>
        <div className="testimonial-feature-copy">
          <p className="testimonial-tag">{featured.program}</p>
          <blockquote>"{featured.quote}"</blockquote>
          <div>
            <strong>{featured.name}</strong>
            <span>{featured.detail}</span>
          </div>
        </div>
      </article>
      <div className="testimonial-groups">
        {categories.map((category) => {
          const categoryTestimonials = studentTestimonials.filter((testimonial) => testimonial.category === category && testimonial !== featured);

          return (
            <section className="testimonial-group" key={category}>
              <div className="testimonial-group-heading">
                <p className="section-label">{category === "HEALTH SCREENING CAMP" ? "Screening voices" : `${category} voices`}</p>
                <h3>{category === "HEALTH SCREENING CAMP" ? "Health Screening Camp" : category}</h3>
              </div>
              <div className="testimonial-card-grid">
                {categoryTestimonials.map((testimonial) => (
                  <article className="testimonial-card" key={`${testimonial.program}-${testimonial.name}-${testimonial.quote.slice(0, 24)}`}>
                    <img src={testimonial.image} alt={`${testimonial.name}, ${testimonial.program} participant`} loading="lazy" />
                    <div className="testimonial-card-copy">
                      <p className="testimonial-tag">{testimonial.program}</p>
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.detail}</span>
                      <blockquote>"{testimonial.quote}"</blockquote>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function DonationPage({ path }: { path: string }) {
  const isMonthly = path === "/donate/monthly";
  const isCampaign = path === "/donate/campaigns";
  const isWhereNeeded = path === "/donate/where-needed-most";

  return (
    <main className="page route-donate">
      <PageHero
        eyebrow="Donate"
        title={isMonthly ? "Stand with access every month." : "Turn concern into access."}
        text="Support a program, named campaign, workshop, or general foundation need through a donation enquiry. The Floydee team will connect with payment and 80G receipt details."
        image={heroDonateScreening}
      />
      <section className="page-section page-donation-layout" aria-labelledby="donation-page-title">
        <div>
          <p className="section-label">Ways to support</p>
          <h2 id="donation-page-title">Choose the giving path that matches your intent.</h2>
          <div className="page-card-list">
            <article><strong>One-time giving</strong><span>Help fund immediate program needs, kits, screening access, and learning material.</span></article>
            <article><strong>Monthly support</strong><span>Build a predictable base for recurring health sessions, care spaces, and youth training.</span></article>
            <article><strong>Campaign support</strong><span>Underwrite focused initiatives for schools, colleges, communities, and institutional partners.</span></article>
          </div>
        </div>
        <SupportForm
          defaultFrequency={isMonthly ? "Monthly" : "One-time"}
          defaultTargetType={isCampaign ? "campaign" : isWhereNeeded ? "generic" : "program"}
        />
      </section>
      <section className="page-band">
        <h2>Donation FAQs</h2>
        <div className="page-grid three">
          <article><h3>Will I receive 80G details?</h3><p>Yes. The foundation team will connect with donation, campaign, payment, and 80G receipt information after your enquiry.</p></article>
          <article><h3>Can I choose where it goes?</h3><p>Yes. You can fund a program, select a campaign or workshop under a program, or make a generic donation.</p></article>
          <article><h3>Is this a payment gateway?</h3><p>No. This phase keeps donation as an enquiry flow so the team can confirm details directly.</p></article>
        </div>
      </section>
    </main>
  );
}

function ProgramsOverviewPage() {
  return (
    <main className="page">
      <PageHero
        eyebrow="What We Do"
        title="We work where health, confidence, skills, and access meet."
        text="Floydee Future Foundation designs practical, community-rooted programs that help girls, women, and youth move from potential to access."
        image={websiteProgramsHero}
        cta={["Partner with us", "/partner-with-us"]}
      />
      <section className="page-section">
        <div className="page-heading">
          <p className="section-label">Program layer</p>
          <h2>Three named pathways. One foundation model.</h2>
        </div>
        <div className="page-grid three">
          {Object.values(programPages).map((program) => (
            <article className="page-card feature-card" key={program.title}>
              <img src={program.cardImage} alt="" />
              <p>{program.eyebrow}</p>
              <h3>{program.title}</h3>
              <span>{program.tagline}</span>
              <a href={`/programs/${program.title.toLowerCase()}`}>Explore {program.title}</a>
            </article>
          ))}
        </div>
      </section>
      <StudentTestimonialsSection />
      <section className="page-band">
        <h2>Pillars of Development</h2>
        <div className="page-grid three">
          <article><h3>Health, Dignity & Well-being</h3><p>Care is not just delivered; it is delivered with dignity through AAROHI and SAKHI.</p></article>
          <article><h3>Skills, Education & Employability</h3><p>VIDYA builds confidence, exposure, and workplace readiness for young people.</p></article>
          <article><h3>Community Engagement & Scalable Impact</h3><p>Programs grow with schools, colleges, hospitals, communities, NGOs, CSR teams, and institutional partners.</p></article>
        </div>
      </section>
    </main>
  );
}

function ProgramDetailPage({ slug }: { slug: ProgramSlug }) {
  const program = programPages[slug];
  const academicPartners = programAcademicPartners[slug];
  const story = program.story;

  return (
    <main className={`page program-detail program-detail-${slug}`}>
      <PageHero eyebrow={program.eyebrow} title={`${program.title}: ${program.tagline}`} text={program.statement} image={program.image} cta={["Collaborate With Us", "/book-a-program"]} />
      <section className="page-section program-overview">
        <div className="program-overview-lead">
          <p className="section-label">Program overview</p>
          <h2>{program.intro}</h2>
        </div>
        <div className="program-overview-context">
          <div>
            <h3>Why this matters</h3>
            <p>{program.problem}</p>
          </div>
          <div>
            <h3>Who the program serves</h3>
            <p>{program.audience}</p>
          </div>
        </div>
      </section>
      {story ? (
        <>
          <section className="page-band program-focus" aria-labelledby={`${slug}-focus-title`}>
            <div className="program-section-heading">
              <div>
                <p className="section-label">{story.focusLabel}</p>
                <h2 id={`${slug}-focus-title`}>{story.focusTitle}</h2>
              </div>
              <p>{story.focusText}</p>
            </div>
            <div className="program-focus-list">
              {story.focusAreas.map((area, index) => (
                <article key={area.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{area.title}</h3>
                    <p>{area.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="page-section program-journey" aria-labelledby={`${slug}-journey-title`}>
            <div className="program-journey-media">
              <img src={story.secondaryImage} alt={story.secondaryImageAlt} loading="lazy" />
              <p>{story.journeyLabel}</p>
            </div>
            <div className="program-journey-copy">
              <p className="section-label">{story.journeyLabel}</p>
              <h2 id={`${slug}-journey-title`}>{story.journeyTitle}</h2>
              <p className="program-journey-intro">{story.journeyText}</p>
              <ol className="program-journey-steps">
                {story.journeySteps.map((step) => (
                  <li key={step.title}>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section className="page-section program-impact-band">
            <div className="program-impact-metric">
              <strong>{story.impactMetric}</strong>
              <span>{story.impactLabel}</span>
            </div>
            <div className="program-impact-copy">
              <p className="section-label">Impact pathway</p>
              <h2>{story.impactText}</h2>
              <a className="button button-primary" href={story.callToAction[1]}>{story.callToAction[0]}</a>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="page-band">
            <h2>Activities and interventions</h2>
            <div className="page-grid two">
              {program.activities.map((activity) => (
                <article key={activity}><h3>{activity}</h3><p>Designed for practical delivery with partners, facilitators, and community-rooted follow-up.</p></article>
              ))}
            </div>
          </section>
          <section className="page-section page-cta-panel">
            <div>
              <p className="section-label">Impact pathway</p>
              <h2>{program.impact}</h2>
            </div>
            <a className="button button-primary" href="/contact">Start a conversation</a>
          </section>
        </>
      )}
      {academicPartners ? (
        <PartnerShowcaseSection
          eyebrow="Academic partners"
          title={slug === "aarohi" ? "Institutions helping AAROHI reach further." : "Institutions helping VIDYA reach further."}
          text="Our partners open trusted spaces for practical learning, care, mentorship, and opportunity."
          partners={academicPartners}
        />
      ) : null}
      <BlogArchive
        basePath={`/programs/${slug}`}
        eyebrow={`${program.title} stories`}
        fixedProgram={slug}
        title={`Latest from ${program.title}`}
      />
    </main>
  );
}

function InitiativesPage() {
  return (
    <main className="page">
      <PageHero
        eyebrow="Initiatives"
        title="School-based awareness can become practical screening access."
        text="Floydee Future Foundation turns field partnerships into health education, screening guidance, PCOD awareness, cervical cancer education, and follow-up pathways."
        image={heroInitiativesAchievement}
        cta={["Fund the next camp", "/donate/campaigns"]}
      />
      <section className="page-section page-story-feature">
        <img src={healthCamp1} alt="Floydee health camp update from Rajarhat" />
        <div>
          <p className="section-label">Featured initiative</p>
          <h2>Menstrual health screening camp</h2>
          <p>At Government Girls High School, Rajarhat, Floydee Future Foundation supported adolescent girls with health education, screening, and practical guidance.</p>
          <div className="mini-metrics"><span><strong>150</strong> girls reached</span><span><strong>1</strong> school camp</span><span><strong>3</strong> health focus areas</span></div>
        </div>
      </section>
    </main>
  );
}

function ImpactPage() {
  return (
    <main className="page">
      <PageHero eyebrow="Impact" title="Measured in access opened, not promises made." text="Impact at Floydee is tracked through participation, partner engagement, program delivery, and the practical pathways opened for girls, women, and youth." image={websiteImpactHero} />
      <section className="page-section">
        <div className="page-grid four">
          <article className="metric-card"><strong>150+</strong><span>girls supported in screening initiatives</span></article>
          <article className="metric-card"><strong>30+</strong><span>partner relationships: 20+ VIDYA + 10+ Naree</span></article>
          <article className="metric-card"><strong>3</strong><span>core programs across care and opportunity</span></article>
          <article className="metric-card"><strong>3</strong><span>named pathways: AAROHI, SAKHI, and VIDYA</span></article>
        </div>
      </section>
    </main>
  );
}

function WhereWeWorkPage() {
  return (
    <main className="page">
      <PageHero eyebrow="Where We Work" title="Programs designed to move through institutions and communities." text="Floydee's presence grows through schools, colleges, communities, and partner networks across India." image={heroLatestField} cta={["Collaborate With Us", "/book-a-program"]} />
      <section className="page-section page-map-showcase">
        <img src={programMapping} alt="Floydee program presence map across India" />
        <div>
          <p className="section-label">Presence layer</p>
          <h2>AAROHI, SAKHI, and VIDYA create clear pathways into care and opportunity.</h2>
          <p>Highlighted program locations include Kolkata, Delhi, Patna, Lucknow, Mumbai, Bangalore, Pune, Chennai, Darjeeling, Guwahati, and Jammu & Kashmir.</p>
        </div>
      </section>
    </main>
  );
}

function JoinPage({ kind }: { kind?: "volunteer" | "partner" | "book" | "campaign" }) {
  const defaults = {
    volunteer: ["Volunteer", "Give time, skills, and care to outreach, events, training, content, and program delivery."],
    partner: ["Partner with the foundation", "Collaborate through schools, colleges, hospitals, NGOs, CSR teams, and community institutions."],
    book: ["Collaborate With Us", "Bring AAROHI, SAKHI, or VIDYA into a school, college, community, or partner setting."],
    campaign: ["Partner with the foundation", "Co-create a focused campaign around health access, dignity kits, learning material, or employability."]
  } as const;
  const [intent, text] = kind ? defaults[kind] : ["Partner with the foundation", "Choose the engagement pathway that matches your institution, energy, and community need."];

  return (
    <main className="page">
      <PageHero eyebrow="Join Us" title="Choose the door that matches your energy." text={text} image={heroJoinCommunity} cta={["Send enquiry", "#join-form"]} />
      <section className="page-section">
        <div className="page-grid four">
          <article><h3>Volunteer</h3><p>Support outreach, program delivery, events, content, and community engagement.</p><a href="/volunteer">Sign up</a></article>
          <article><h3>Partner</h3><p>Work with Floydee through school, college, hospital, NGO, CSR, or institutional pathways.</p><a href="/partner-with-us">Partner with us</a></article>
          <article><h3>Collaborate With Us</h3><p>Request AAROHI, SAKHI, or VIDYA for your students, community, or institution.</p><a href="/book-a-program">Book now</a></article>
          <article><h3>Campaign</h3><p>Collaborate on targeted drives for care, awareness, dignity, and employability.</p><a href="/campaign-with-us">Campaign with us</a></article>
        </div>
      </section>
      <section className="contact-section page-contact-embed" id="join-form" aria-labelledby="join-form-title">
        <div>
          <p className="section-label">Enquiry</p>
          <h2 id="join-form-title">Tell us how you want to work with Floydee.</h2>
          <p>Use the form and the team will get in touch with the right next step.</p>
        </div>
        <ContactForm defaultIntent={intent} />
      </section>
    </main>
  );
}

function GalleryPage() {
  const categories: GalleryCategory[] = ["Naree Health Awareness", "Cervical Cancer Awareness", "Health Screening Camp"];
  const categoryIds: Record<GalleryCategory, string> = {
    "Cervical Cancer Awareness": "cervical-cancer-awareness",
    "Health Screening Camp": "health-screening-camp",
    "Naree Health Awareness": "naree-health-awareness"
  };
  const imageCount = gallerySections.reduce((total, section) => total + section.images.length, 0);

  return (
    <main className="page gallery-page">
      <PageHero
        eyebrow="Gallery"
        title="Field moments, gathered with care."
        text="Real images from Floydee awareness sessions, school cohorts, community partners, and health screening work."
        image={galleryHealthCamp1}
      />
      <section className="page-section gallery-overview" aria-labelledby="gallery-overview-title">
        <div>
          <p className="section-label">Visual archive</p>
          <h2 id="gallery-overview-title">From awareness rooms to screening desks.</h2>
        </div>
        <div className="gallery-overview-copy">
          <p>
            The legacy Floydee gallery has been rebuilt here with locally stored images, cleaned section labels,
            and a clearer editorial layout for browsing.
          </p>
          <div className="gallery-stats" aria-label="Gallery content summary">
            <span><strong>{gallerySections.length}</strong> sections</span>
            <span><strong>{imageCount}</strong> field images</span>
            <span><strong>3</strong> program themes</span>
          </div>
        </div>
      </section>
      <nav className="gallery-filter-row" aria-label="Gallery sections">
        {categories.map((category) => (
          <a href={`#${categoryIds[category]}`} key={category}>{category}</a>
        ))}
      </nav>
      <section className="page-section gallery-archive" aria-label="Floydee gallery archive">
        {categories.map((category) => (
          <div className="gallery-category-block" id={categoryIds[category]} key={category}>
            <div className="gallery-category-heading">
              <p className="section-label">
                {category === "Naree Health Awareness"
                  ? "Moments from Naree Health Awareness Session"
                  : category === "Cervical Cancer Awareness"
                    ? "Moments from Cervical Cancer Awareness Session"
                    : "Moments from Health Screening Camp"}
              </p>
              <h2>{category}</h2>
            </div>
            {gallerySections.filter((section) => section.category === category).map((section) => (
              <section className="gallery-section" key={section.title} aria-labelledby={`${categoryIds[category]}-${section.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>
                <div className="gallery-section-heading">
                  <div>
                    <p>{section.images.length} images</p>
                    <h3 id={`${categoryIds[category]}-${section.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>{section.title}</h3>
                  </div>
                  <span>{section.summary}</span>
                </div>
                <div className="gallery-masonry-grid">
                  {section.images.map((item, index) => (
                    <figure className={`gallery-tile gallery-tile-${(index % 6) + 1}`} key={`${section.title}-${item.image}`}>
                      <img src={item.image} alt={item.alt} loading="lazy" />
                      <figcaption>
                        <span>{section.category}</span>
                        <strong>{item.caption}</strong>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}

function LatestPage({ type }: { type: "latest" | "stories" | "news" | "resources" | "gallery" }) {
  const titles = {
    latest: "Stories, news, resources, and field updates.",
    stories: "Beneficiary journeys and field voices.",
    news: "Latest news and updates.",
    resources: "Reports, research, and media resources.",
    gallery: "Visual documentation from the field."
  };

  return (
    <main className="page">
      <PageHero eyebrow="Stories & Latest" title={titles[type]} text="Shareable proof from programs, partnerships, reports, media updates, and community moments." image={latestHeroImages[type]} />
      {type === "gallery" ? (
        <section className="page-section page-gallery-grid">
          {[healthCamp1, healthCamp2, healthCamp3, heroFoundation, programMapping, studentSanika].map((image, index) => (
            <img src={image} alt={`Floydee gallery item ${index + 1}`} key={image} />
          ))}
        </section>
      ) : type === "news" || type === "resources" ? (
        <BlogArchive
          basePath={`/${type}`}
          channel={type === "news" ? "news" : "media"}
          eyebrow={type === "news" ? "News archive" : "Media archive"}
          title={type === "news" ? "Latest foundation news" : "Explore media and resources"}
        />
      ) : (
        <section className="page-section">
          <div className="page-grid three">
            {newsCards.map((card) => (
              <article className="page-card feature-card" key={card.title}>
                <img src={card.image} alt="" />
                <p>{card.category}</p>
                <h3>{card.title}</h3>
                <span>{card.text}</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function TeamDirectory({ members, startIndex = 1 }: { members: TeamMember[]; startIndex?: number }) {
  return (
    <div className="team-directory">
      {members.map((member, index) => (
        <article className="team-profile" key={member.name}>
          <span aria-hidden="true" className="team-profile-index">{String(startIndex + index).padStart(2, "0")}</span>
          <div className={`team-profile-portrait${member.image ? "" : " is-placeholder"}`}>
            {member.image ? (
              <img alt={member.imageAlt ?? ""} decoding="async" loading="lazy" src={member.image} />
            ) : (
              <span aria-hidden="true">{member.initials}</span>
            )}
          </div>
          <div className="team-profile-identity">
            <h3>{member.name}</h3>
            <p className="role-label">{member.role}</p>
          </div>
          <div className="team-profile-bio">
            {member.bio ? <p>{member.bio}</p> : <p className="team-profile-awaiting">Official profile details will be added soon.</p>}
          </div>
        </article>
      ))}
    </div>
  );
}

function AboutExperience() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="Potential is everywhere. Access is the work."
        text="Floydee Future Foundation is a Section 8 foundation working at the intersection of education, health, well-being, and social impact."
        image={websiteAboutHero}
        cta={["Meet our team", "#core-team"]}
      />

      <section className="page-section about-story" aria-labelledby="about-story-title">
        <div>
          <p className="section-label">About the foundation</p>
          <h2 id="about-story-title">Empowering women and educating youth are forces for a just, healthy, and prosperous society.</h2>
        </div>
        <div className="about-story-copy">
          <p>Floydee Future Foundation was founded with a simple belief: every young person and every woman deserves the chance to grow with dignity, skills, and opportunity.</p>
          <p>The foundation bridges the gap between potential and access through practical experiences rooted in real community needs.</p>
        </div>
      </section>

      <section className="about-program-thread" aria-label="Floydee programs">
        <article><span>01</span><div><h2>AAROHI</h2><p>Care that changes lives.</p></div></article>
        <article><span>02</span><div><h2>SAKHI</h2><p>A safe space to share and be heard.</p></div></article>
        <article><span>03</span><div><h2>VIDYA</h2><p>Pathways from education to employment.</p></div></article>
      </section>

      <section className="page-section team-section" id="core-team" aria-labelledby="core-team-title">
        <div className="team-section-heading">
          <div>
            <p className="section-label">Our Team</p>
            <h2 id="core-team-title">Core Team</h2>
          </div>
          <p>The internal team guiding the foundation's strategy, programs, partnerships, technology, communication, and day-to-day delivery.</p>
        </div>
        <TeamDirectory members={coreTeam} />
      </section>

      <section className="page-band advisor-section" aria-labelledby="advisor-title">
        <div className="team-section-heading">
          <div>
            <p className="section-label">Specialist guidance</p>
            <h2 id="advisor-title">Our Expert Advisors</h2>
          </div>
          <p>Doctors and professionals who regularly support our initiatives with specialist guidance while remaining distinct from the foundation's full-time core team.</p>
        </div>
        <TeamDirectory members={expertAdvisors} />
      </section>

      <PartnerShowcaseSection
        eyebrow="Our sponsors and corporate partners"
        title="Organizations investing in access."
        text="Corporate, healthcare, and institutional partners help strengthen the reach, quality, and continuity of Floydee's work."
        partners={corporatePartners}
        variant="corporate"
      />

      <section className="page-section about-cta" aria-labelledby="about-cta-title">
        <p className="section-label">Build access with us</p>
        <h2 id="about-cta-title">Bring your expertise, institution, or community into the work.</h2>
        <p>Partner with Floydee Future Foundation to create practical pathways for health, dignity, education, and opportunity.</p>
        <div className="about-cta-actions">
          <a className="button button-primary" href="/partner-with-us">Partner with us</a>
          <a className="button button-secondary" href="/contact">Contact us</a>
        </div>
      </section>
    </>
  );
}

function AboutPage({ view }: { view: "about" | "mission" | "history" | "leadership" | "trust" | "contact" }) {
  if (view === "contact") return <ContactPage />;

  return (
    <main className={`page${view === "about" || view === "leadership" ? " about-page" : ""}`}>
      {view === "about" || view === "leadership" ? (
        <AboutExperience />
      ) : view === "trust" ? (
        <TrustCentrePage embedded />
      ) : (
        <>
          <PageHero
            eyebrow="Who We Are"
            title="Potential is everywhere. Access is the work."
            text="Floydee Future Foundation is a Section 8 foundation working at the intersection of education, health, well-being, and social impact."
            image={heroMissionGroup}
            cta={["Contact us", "/contact"]}
          />
          <section className="page-section page-two-column">
            <div>
              <p className="section-label">{view === "mission" ? "Vision and mission" : view === "history" ? "Foundation history" : "About the foundation"}</p>
              <h2>Empowering women and educating youth are two strong forces for building a just, healthy, and prosperous society.</h2>
            </div>
            <div className="page-copy-panel">
              <p>Floydee Future Foundation was founded with a simple belief: every young person and every woman deserves the chance to grow with dignity, skills, and opportunity.</p>
              <p>The foundation helps bridge the gap between potential and access through hands-on, practical experiences rooted in real community needs.</p>
            </div>
          </section>
          <section className="page-band">
            <h2>Focus and forward path</h2>
            <div className="page-grid three">
              <article><h3>AAROHI</h3><p>Community health awareness, on-ground care, follow-up, and referral guidance.</p></article>
              <article><h3>SAKHI</h3><p>Safe, supportive spaces for sharing, listening, dignity, and self-worth.</p></article>
              <article><h3>VIDYA</h3><p>Skills, digital confidence, career readiness, and education-to-employment pathways.</p></article>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function TrustCentrePage({ embedded = false }: { embedded?: boolean }) {
  const content = (
    <>
      <section className="page-section">
        <div className="page-heading"><p className="section-label">Trust Centre</p><h2>Credibility for donors, partners, institutions, and CSR reviewers.</h2></div>
        <div className="page-grid four">
          <article><h3>Section 8 foundation</h3><p>Floydee Future Foundation is registered as a non-profit organization.</p></article>
          <article><h3>80G and PAN</h3><p>PAN: AAGCF6699F. 80G Number: AAGCF6699FF20261.</p></article>
          <article><h3>Reports</h3><p>Interim Report 2025 and future reports can be organized here for public reference.</p></article>
          <article><h3>Partners</h3><p>Partner references and institutional collaborations support transparent growth.</p></article>
        </div>
      </section>
      <section className="page-band">
        <h2>Partner references</h2>
        <div className="partner-cloud">{partnerNames.map((name) => <span key={name}>{name}</span>)}</div>
      </section>
    </>
  );

  if (embedded) return <>{content}</>;
  return <main className="page"><PageHero eyebrow="Trust Centre" title="Transparency builds the path for sustainable impact." text="Registration, tax, reports, policies, partners, and source notes belong in one clear place." image={heroTrustAwareness} />{content}</main>;
}

function ContactPage() {
  return (
    <main className="page">
      <PageHero eyebrow="Contact" title="Collaborate with us." text="Reach out for donations, partnerships, program bookings, volunteering, media, or general enquiries." image={heroContactCare} cta={["Send enquiry", "#contact-form"]} />
      <section className="contact-section page-contact-embed" aria-labelledby="contact-page-title">
        <div>
          <p className="section-label">Get in touch</p>
          <h2 id="contact-page-title">For enquiries and partnerships</h2>
          <p>International Financial Hub, West Tower, 13th Floor, Mani Casadona, New Town, Kolkata-700156, West Bengal</p>
          <p><strong>Phone:</strong> +91 91477 48064</p>
          <p><strong>Mail:</strong> contact@floydeefoundation.org</p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}

function LegalPage({ page, title }: { page?: LegalPageContent; title?: string }) {
  const resolvedPage = page ?? {
    eyebrow: "Legal and utility",
    intro: "This page supports donor confidence, accessibility, compliance, and public website navigation.",
    sections: [
      {
        title: title ?? "Legal and utility",
        body: [
          "This starter page is ready for foundation-approved legal, accessibility, or policy text.",
          "For official use, the foundation should review and finalize this content before launch."
        ]
      }
    ],
    title: title ?? "Legal and utility"
  };

  return (
    <main className="page legal-page">
      <PageHero eyebrow={resolvedPage.eyebrow} title={resolvedPage.title} text={resolvedPage.intro} image={heroLegalFoundation} />
      <section className="page-section legal-copy">
        {resolvedPage.sections.map((section) => (
          <article className="legal-copy-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
        ))}
      </section>
    </main>
  );
}

function SitemapPage() {
  const groups = [
    ["Donate", ["/donate", "/donate/monthly", "/donate/campaigns", "/donate/where-needed-most"]],
    ["What We Do", ["/programs", "/programs/aarohi", "/programs/sakhi", "/programs/vidya", "/initiatives", "/impact", "/where-we-work"]],
    ["Join Us", ["/join-us", "/volunteer", "/partner-with-us", "/book-a-program", "/campaign-with-us"]],
    ["Stories & Latest", ["/latest", "/stories", "/news", "/resources", "/gallery"]],
    ["Who We Are", ["/about", "/mission", "/history", "/leadership", "/trust-centre", "/contact"]],
    ["Legal", ["/privacy-policy", "/terms-and-conditions", "/refund-policy", "/accessibility", "/sitemap"]]
  ];

  return (
    <main className="page">
      <PageHero eyebrow="Sitemap" title="Floydee Future Foundation website structure." text="A public map of the Phase 1 website pages and future growth pathways." image={heroSitemapCommunity} />
      <section className="page-section">
        <div className="page-grid three">{groups.map(([label, links]) => <article key={label as string}><h3>{label as string}</h3>{(links as string[]).map((link) => <a href={link} key={link}>{link}</a>)}</article>)}</div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="page">
      <PageHero eyebrow="Page not found" title="This page is not part of the current sitemap." text="Use the sitemap to find the current Phase 1 website pages." image={heroNotFoundStudent} cta={["View sitemap", "/sitemap"]} />
    </main>
  );
}

function renderRoute(path: string) {
  const canonicalPath = routeAliases[path] ?? path;

  if (canonicalPath.startsWith("/admin/blogs")) return <BlogAdminPage path={canonicalPath} />;
  if (canonicalPath === "/") return <HomePage />;
  if (canonicalPath.startsWith("/donate")) return <><DonationPage path={canonicalPath} /><RouteFooter /></>;
  if (canonicalPath === "/programs") return <><ProgramsOverviewPage /><RouteFooter /></>;
  if (canonicalPath === "/programs/aarohi") return <><ProgramDetailPage slug="aarohi" /><RouteFooter /></>;
  if (canonicalPath === "/programs/sakhi") return <><ProgramDetailPage slug="sakhi" /><RouteFooter /></>;
  if (canonicalPath === "/programs/vidya") return <><ProgramDetailPage slug="vidya" /><RouteFooter /></>;
  if (canonicalPath === "/initiatives") return <><InitiativesPage /><RouteFooter /></>;
  if (canonicalPath === "/impact") return <><ImpactPage /><RouteFooter /></>;
  if (canonicalPath === "/where-we-work") return <><WhereWeWorkPage /><RouteFooter /></>;
  if (canonicalPath === "/join-us") return <><JoinPage /><RouteFooter /></>;
  if (canonicalPath === "/volunteer") return <><JoinPage kind="volunteer" /><RouteFooter /></>;
  if (canonicalPath === "/partner-with-us") return <><JoinPage kind="partner" /><RouteFooter /></>;
  if (canonicalPath === "/book-a-program") return <><JoinPage kind="book" /><RouteFooter /></>;
  if (canonicalPath === "/campaign-with-us") return <><JoinPage kind="campaign" /><RouteFooter /></>;
  if (canonicalPath === "/latest") return <><LatestPage type="latest" /><RouteFooter /></>;
  if (canonicalPath === "/stories") return <><StoriesHubPage /><RouteFooter /></>;
  if (canonicalPath.startsWith("/stories/")) return <><StoryArticlePage slug={canonicalPath.replace("/stories/", "")} /><RouteFooter /></>;
  if (canonicalPath === "/news") return <><LatestPage type="news" /><RouteFooter /></>;
  if (canonicalPath === "/resources") return <><LatestPage type="resources" /><RouteFooter /></>;
  if (canonicalPath === "/gallery") return <><GalleryPage /><RouteFooter /></>;
  if (canonicalPath === "/about") return <><AboutPage view="about" /><RouteFooter /></>;
  if (canonicalPath === "/mission") return <><AboutPage view="mission" /><RouteFooter /></>;
  if (canonicalPath === "/history") return <><AboutPage view="history" /><RouteFooter /></>;
  if (canonicalPath === "/leadership") return <><AboutPage view="leadership" /><RouteFooter /></>;
  if (canonicalPath === "/trust-centre") return <><TrustCentrePage /><RouteFooter /></>;
  if (canonicalPath === "/contact") return <><ContactPage /><RouteFooter /></>;
  if (canonicalPath === "/privacy-policy") return <><LegalPage page={legalPages.privacy} /><RouteFooter /></>;
  if (canonicalPath === "/terms-and-conditions") return <><LegalPage page={legalPages.terms} /><RouteFooter /></>;
  if (canonicalPath === "/refund-policy") return <><LegalPage title="Refund Policy" /><RouteFooter /></>;
  if (canonicalPath === "/accessibility") return <><LegalPage title="Accessibility" /><RouteFooter /></>;
  if (canonicalPath === "/sitemap") return <><SitemapPage /><RouteFooter /></>;
  return <><NotFoundPage /><RouteFooter /></>;
}

function usePageMotion(path: string) {
  useEffect(() => {
    const root = document.querySelector(".page");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(
      ".page-hero-copy, .page-hero-media, .page-grid article, .page-card-list article, .page-copy-panel, .page-cta-panel, .about-program-thread article, .team-profile, .testimonial-card, .gallery-section, .legal-copy-section"
    ));

    targets.forEach((target, index) => {
      target.classList.add("motion-item");
      target.style.transitionDelay = `${Math.min(index % 6, 5) * 45}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    window.requestAnimationFrame(() => {
      targets.forEach((target) => observer.observe(target));
    });

    return () => observer.disconnect();
  }, [path]);
}

const nareeDismissalStorageKey = "floydee:naree-app-banner-dismissed";
const nareeLinks = {
  apple: "https://apps.apple.com/us/app/naree/id6743942142",
  android: "https://play.google.com/store/apps/details?id=com.nareemobileapp.prod&pcampaignid=web_share",
  website: "https://naree.health/"
} as const;
const whatsappConnectUrl = "https://wa.me/919147748064?text=Hello%20Floydee%20Future%20Foundation%2C%20I%20would%20like%20to%20connect.";

const clientPageShareImages: Record<string, string> = {
  "/": homeHeroHealthScreening,
  "/about": websiteAboutHero,
  "/accessibility": heroLegalFoundation,
  "/book-a-program": heroJoinCommunity,
  "/campaign-with-us": heroJoinCommunity,
  "/contact": heroContactCare,
  "/donate": heroDonateScreening,
  "/donate/campaigns": heroDonateScreening,
  "/donate/monthly": heroDonateScreening,
  "/donate/where-needed-most": heroDonateScreening,
  "/gallery": galleryHealthCamp1,
  "/history": heroMissionGroup,
  "/impact": websiteImpactHero,
  "/initiatives": heroInitiativesAchievement,
  "/join-us": heroJoinCommunity,
  "/leadership": websiteAboutHero,
  "/latest": heroLatestField,
  "/mission": heroMissionGroup,
  "/news": heroNewsWorkshop,
  "/partner-with-us": heroJoinCommunity,
  "/privacy-policy": heroLegalFoundation,
  "/programs": websiteProgramsHero,
  "/programs/aarohi": websiteAarohiHero,
  "/programs/education-skill-development": websiteVidyaHero,
  "/programs/emotional-wellbeing": websiteSakhiHero,
  "/programs/health-wellness": websiteAarohiHero,
  "/programs/sakhi": websiteSakhiHero,
  "/programs/vidya": websiteVidyaHero,
  "/refund-policy": heroLegalFoundation,
  "/resources": heroResourcesScreening,
  "/sitemap": heroSitemapCommunity,
  "/stories": heroAboutCorridor,
  "/terms-and-conditions": heroLegalFoundation,
  "/trust-centre": heroTrustAwareness,
  "/volunteer": heroJoinCommunity,
  "/where-we-work": heroLatestField
};

function NareeAppBannerContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="naree-app-bar-inner">
      <a className="naree-app-brand" href={nareeLinks.website} target="_blank" rel="noreferrer" aria-label="Visit Naree Health">
        <img src={nareeHealthLogo} alt="Naree Health App" />
      </a>
      <div className="naree-app-copy">
        <p className="naree-app-kicker">Naree Health App</p>
        <h2>Download Naree App</h2>
        <p>Track wellness, access trusted guidance, and join our women-first health community.</p>
      </div>
      <div className="naree-app-actions" aria-label="Naree app download links">
        <a className="naree-app-button naree-app-button-primary" href={nareeLinks.apple} target="_blank" rel="noreferrer">
          <span>Download on</span>
          <strong>App Store</strong>
        </a>
        <a className="naree-app-button" href={nareeLinks.android} target="_blank" rel="noreferrer">
          <span>Get it on</span>
          <strong>Google Play</strong>
        </a>
        <span className="naree-app-community">
          Join our Community
        </span>
      </div>
      {onClose ? (
        <button className="naree-app-close" type="button" aria-label="Close Naree app download banner" onClick={onClose}>
          X
        </button>
      ) : null}
    </div>
  );
}

function StaticNareeAppBanner() {
  return (
    <section className="naree-app-static" aria-label="Download Naree app">
      <NareeAppBannerContent />
    </section>
  );
}

function setDocumentMeta(name: string, value: string, property = false) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${property ? "property" : "name"}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(element);
  }
  element.content = value;
}

function absoluteClientUrl(value: string) {
  return new URL(value, window.location.origin).toString();
}

function StickyNareeAppBar({ path }: { path: string }) {
  const isAdminRoute = path.startsWith("/admin/blogs");
  const [dismissed, setDismissed] = useState(() => {
    try {
      return window.localStorage.getItem(nareeDismissalStorageKey) === "true";
    } catch {
      return false;
    }
  });
  const [isClosing, setIsClosing] = useState(false);
  const isVisible = !dismissed && !isAdminRoute;

  useEffect(() => {
    document.body.classList.toggle("has-naree-app-bar", isVisible);
    return () => document.body.classList.remove("has-naree-app-bar");
  }, [isVisible]);

  if (!isVisible) return null;

  const closeBar = () => {
    setIsClosing(true);
    try {
      window.localStorage.setItem(nareeDismissalStorageKey, "true");
    } catch {
      // Keep dismissal working even when storage is unavailable.
    }
    window.setTimeout(() => setDismissed(true), 220);
  };

  return (
    <aside className={`naree-app-bar${isClosing ? " is-closing" : ""}`} aria-label="Download Naree app">
      <NareeAppBannerContent onClose={closeBar} />
    </aside>
  );
}

function WhatsAppConnectButton({ path }: { path: string }) {
  if (path.startsWith("/admin/blogs")) return null;

  return (
    <a
      className="whatsapp-connect"
      href={whatsappConnectUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Connect with Floydee Foundation on WhatsApp"
    >
      <span className="whatsapp-connect-mark" aria-hidden="true">WA</span>
      <span className="whatsapp-connect-copy">
        <span>WhatsApp us</span>
        <strong>One-click connect</strong>
      </span>
    </a>
  );
}

export function App() {
  const { locale, t } = useLocale();
  const [path, setPath] = useState(() => window.location.pathname);

  usePageMotion(path);

  useEffect(() => {
    const scrollToHash = (delay = 0) => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      window.setTimeout(() => {
        window.requestAnimationFrame(() => {
          const target = document.getElementById(id);
          if (!target) return;

          const headerOffset = 96;
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: "auto" });
        });
      }, delay);
    };

    scrollToHash();
    scrollToHash(350);
    scrollToHash(1000);
    const handleHashChange = () => scrollToHash();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [path]);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;

      const isHashOnly = url.pathname === window.location.pathname && url.hash;
      if (isHashOnly) return;

      event.preventDefault();
      window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      setPath(url.pathname);

      if (!url.hash) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (path.startsWith("/stories/")) return;
    const programSlug = path.match(/^\/programs\/(aarohi|sakhi|vidya)$/)?.[1] as ProgramSlug | undefined;
    const programStory = programSlug ? programPages[programSlug].story : undefined;
    document.title = t(programStory?.metaTitle ?? "Floydee Future Foundation");
    const description = t(programStory?.metaDescription ?? "Floydee Future Foundation supports girls, women, and youth through health, emotional well-being, education, and employability programs.");
    const normalizedPath = path.length > 1 ? path.replace(/\/+$/, "") : path;
    const shareImage = absoluteClientUrl(clientPageShareImages[normalizedPath] ?? floydeeLogo);
    const shareUrl = absoluteClientUrl(normalizedPath);
    setDocumentMeta("description", description);
    setDocumentMeta("og:title", document.title, true);
    setDocumentMeta("og:description", description, true);
    setDocumentMeta("og:type", "website", true);
    setDocumentMeta("og:url", shareUrl, true);
    setDocumentMeta("og:image", shareImage, true);
    setDocumentMeta("og:image:secure_url", shareImage, true);
    setDocumentMeta("twitter:card", "summary_large_image");
    setDocumentMeta("twitter:title", document.title);
    setDocumentMeta("twitter:description", description);
    setDocumentMeta("twitter:image", shareImage);
  }, [locale, path, t]);

  return (
    <>
      <Header />
      {renderRoute(path)}
      <WhatsAppConnectButton path={path} />
      <StickyNareeAppBar path={path} />
    </>
  );
}
