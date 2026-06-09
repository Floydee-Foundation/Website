import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useRef, useState } from "react";
import floydeeLogo from "./assets/floydee-logo.png";
import floydeeMark from "./assets/floydee-mark.svg";
import heroFoundation from "./assets/hero-foundation.png";
import healthCamp1 from "./assets/health-camp-1.png";
import healthCamp2 from "./assets/health-camp-2.png";
import healthCamp3 from "./assets/health-camp-3.png";
import studentSanika from "./assets/student-sanika.jpg";
import programMapping from "./assets/program-mapping.png";

type NavLink = [label: string, href: string, className?: string];
type NavGroup = {
  label: string;
  links: NavLink[];
};

const navGroups: NavGroup[] = [
  {
    label: "DONATE",
    links: [
      ["DONATE NOW", "/donate"],
      ["DONATE MONTHLY", "/donate/monthly"],
      ["CAMPAIGNS", "/donate/campaigns"],
      ["WHERE NEEDED MOST", "/donate/where-needed-most"]
    ]
  },
  {
    label: "WHAT WE DO",
    links: [
      ["OUR WORK", "/programs"],
      ["AAROHI", "/programs/aarohi"],
      ["SAKHI", "/programs/sakhi"],
      ["VIDYA", "/programs/vidya"],
      ["INITIATIVES", "/initiatives"],
      ["OUR IMPACT", "/impact"],
      ["WHERE WE WORK", "/where-we-work"]
    ]
  },
  {
    label: "JOIN US",
    links: [
      ["VOLUNTEER", "/volunteer"],
      ["PARTNER WITH US", "/partner-with-us"],
      ["BOOK A PROGRAM", "/book-a-program"],
      ["CAMPAIGN WITH US", "/campaign-with-us"]
    ]
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
      ["ABOUT US", "/about"],
      ["MISSION", "/mission"],
      ["HISTORY", "/history"],
      ["LEADERSHIP", "/leadership"],
      ["TRUST CENTRE", "/trust-centre"]
    ]
  },
  {
    label: "CONTACT",
    links: [
      ["CONTACT", "/contact"],
      ["GENERAL ENQUIRY", "/contact"]
    ]
  }
];

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const donationProgramOptions = ["AAROHI", "SAKHI", "VIDYA", "Where needed most"];
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
  "Book a program",
  "Request media information"
];

const routeAliases: Record<string, string> = {
  "/programs/health-wellness": "/programs/aarohi",
  "/programs/emotional-wellbeing": "/programs/sakhi",
  "/programs/education-skill-development": "/programs/vidya"
};

const programPages = {
  aarohi: {
    title: "AAROHI",
    tagline: "Care That Changes Lives",
    eyebrow: "Health, dignity and access",
    image: healthCamp1,
    statement: "Practical care for girls and young women starts with trusted information and reachable screening access.",
    intro:
      "AAROHI brings menstrual health education, PCOD awareness, cervical cancer education, and screening guidance into schools and communities, helping adolescent girls move from hesitation to informed care.",
    problem:
      "Health information should not be a privilege. Many girls grow up without safe spaces to ask questions about menstrual health, symptoms, screening, or follow-up support.",
    audience: "Adolescent girls, young women, schools, communities, and partner institutions.",
    activities: [
      "Menstrual health education sessions",
      "PCOD awareness and early guidance",
      "Cervical cancer education and screening access pathways",
      "Dignity-led conversations with follow-up and referral guidance"
    ],
    impact: "150+ girls were reached through the Rajarhat school-based screening initiative."
  },
  sakhi: {
    title: "SAKHI",
    tagline: "Your space to share, be heard, and feel supported",
    eyebrow: "Emotional well-being",
    image: heroFoundation,
    statement: "Safe, inclusive spaces help people speak, listen, learn, and grow with self-worth.",
    intro:
      "SAKHI is Floydee Future Foundation's support pathway for emotional well-being, built around trust, listening, dignity, and confidence for girls, women, and youth.",
    problem:
      "Support often begins with being heard. Many young people need a respectful space to ask questions, name concerns, and find the confidence to take the next step.",
    audience: "Girls, women, youth groups, schools, colleges, and community partners.",
    activities: [
      "Safe-space circles and guided sharing formats",
      "Well-being awareness sessions",
      "Confidence, self-worth, and informed decision-making conversations",
      "Partner-led routes into appropriate support where needed"
    ],
    impact: "SAKHI strengthens the foundation's care model by connecting awareness, support, and dignity."
  },
  vidya: {
    title: "VIDYA",
    tagline: "Building Pathways from Education to Employment",
    eyebrow: "Education, skills and employability",
    image: studentSanika,
    statement: "Young people need more than education; they need exposure, confidence, and industry-ready pathways.",
    intro:
      "VIDYA supports aspiring software professionals and students with engineering mindset, practical tools, soft skills, career readiness, mentorship, and industry exposure rooted in real workplace expectations.",
    problem:
      "Talent from Tier-2 and Tier-3 ecosystems is often held back by limited opportunity, exposure, and career guidance.",
    audience: "Students, graduates, aspiring software professionals, colleges, and skill-building partners.",
    activities: [
      "Engineering mindset, SDLC, Agile, MVP, cybersecurity, and design thinking",
      "Git, GitHub, frontend and backend overview, AI/ML introduction, and collaborative ideation",
      "Communication, teamwork, leadership, problem solving, time management, and presentation skills",
      "Resume, LinkedIn, personal branding, mock interviews, etiquette, networking, and goal setting"
    ],
    impact: "VIDYA is designed to engage 5,000+ youth each year through digital confidence and employability pathways."
  }
} as const;

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

const newsCards = [
  {
    category: "News",
    title: "Why VIDYA exists",
    text: "Closing the Tier-2 and Tier-3 gap in product and technology careers through exposure, skills, and industry guidance.",
    image: studentSanika
  },
  {
    category: "Initiative",
    title: "Menstrual health screening camp",
    text: "A school-based awareness and screening initiative at Government Girls High School, Rajarhat reached 150 adolescent girls.",
    image: healthCamp1
  },
  {
    category: "Resource",
    title: "Interim Report 2025",
    text: "A resource-centre seed item for reports, research, media material, and source-backed impact updates.",
    image: programMapping
  }
];

const teamMembers = [
  ["Subho Chakraborty", "Product", "15+ years in software development and global teams, shaping product strategy and execution."],
  ["Sreeparna Roy", "Marketing", "16+ years across marketing, brand vision, performance, reach, and scalability."],
  ["Ipsito Ghosh", "Technology", "20+ years in software and engineering management, supporting technical excellence and team performance."],
  ["Dr. Himanshu Borase", "Healthcare Consultant", "Women's health and fertility expertise, helping bridge clinical practice with digital femtech."],
  ["Disha Mishra", "Partnerships", "Academic and institutional partnership experience across collaborations, licensing, and outreach."]
] as const;

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

    document.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("menu-open", "dropdown-open");
      document.removeEventListener("keydown", close);
    };
  }, [mobileOpen, activeMenu]);

  const closeMenus = () => {
    setActiveMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className="site-header" id="top" onMouseLeave={() => setActiveMenu(null)}>
      <a className="brand" href="/" aria-label="Floydee Future Foundation home">
        <img className="brand-logo header-logo" src={floydeeMark} alt="Floydee Foundation" />
        <span className="brand-title"><span>Floydee</span> <span className="brand-title-gold">Foundation</span></span>
      </a>

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

      <nav className={`main-nav${mobileOpen ? " open" : ""}`} id="main-navigation" aria-label="Primary navigation">
        {navGroups.map((group) => (
          <div
            className={`nav-group${activeMenu === group.label ? " is-open" : ""}`}
            key={group.label}
            onMouseEnter={() => setActiveMenu(group.label)}
            onFocus={() => setActiveMenu(group.label)}
          >
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
          </div>
        ))}
      </nav>
    </header>
  );
}

type SupportFormProps = {
  defaultFrequency?: "One-time" | "Monthly";
  defaultProgram?: string;
};

function SupportForm({ defaultFrequency = "One-time", defaultProgram = "" }: SupportFormProps) {
  const [frequency, setFrequency] = useState(defaultFrequency);
  const [amount, setAmount] = useState("500");
  const [program, setProgram] = useState(defaultProgram);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setFrequency(defaultFrequency);
    setProgram(defaultProgram);
    setConsentAccepted(false);
    setStatus("");
    setSubmitted(false);
  }, [defaultFrequency, defaultProgram]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitted(true);

    if (!program || !amount || !consentAccepted || !form.checkValidity()) {
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
        program,
        consentStatus: donationConsentText
      });

      setStatus(message);
      form.reset();
      setFrequency(defaultFrequency);
      setAmount("500");
      setProgram(defaultProgram);
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
      <div className="form-grid">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <CustomSelect
          invalid={submitted && !program}
          label="Program focus"
          name="program"
          onChange={(nextProgram) => {
            setProgram(nextProgram);
            setStatus("");
          }}
          options={donationProgramOptions}
          placeholder="Select a program"
          value={program}
        />
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
        message: formData.get("message")?.toString() ?? ""
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
              <a className="button button-secondary" href="#book">Book a program</a>
              <a className="button button-text" href="#stories">Explore stories</a>
            </div>
            <div className="hero-proof" aria-label="Foundation proof points">
              <span>Section 8 foundation</span>
              <span>Kolkata and West Bengal focus</span>
              <span>Health, care, skills</span>
            </div>
          </div>
          <div className="hero-media" aria-hidden="true">
            <img src={heroFoundation} alt="" />
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
              <a className="button button-secondary" href="#contact">Know More</a>
            </article>
            <article className="pillar-card" id="education">
              <span className="pillar-number">2</span>
              <h3>Skills, Education & Employability</h3>
              <p>This pillar builds capability with confidence so youth are prepared not just to work, but to lead through VIDYA.</p>
              <a className="button button-secondary" href="#contact">Know More</a>
            </article>
            <article className="pillar-card" id="community">
              <span className="pillar-number">3</span>
              <h3>Community Engagement & Scalable Impact</h3>
              <p>Our programs are rooted in real communities and designed for partnerships that can scale with trust.</p>
              <a className="button button-secondary" href="#partners">Know More</a>
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
            <article><strong>12+</strong><span>academic and NGO partner relationships</span></article>
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
            <a className="button button-primary" href="#latest">See latest initiatives</a>
          </div>
          <img src={healthCamp3} alt="Floydee menstrual health screening camp participants" />
        </section>

        <section className="join" id="join" aria-labelledby="join-title">
          <div className="section-heading align-left">
            <p className="section-label">Join us</p>
            <h2 id="join-title">Choose the door that matches your energy.</h2>
          </div>
          <div className="join-grid">
            <article id="volunteer"><span>Volunteer</span><h3>Give time and skills</h3><p>Support outreach, content, events, training, and program delivery.</p><a href="#contact">Sign up</a></article>
            <article id="partners"><span>Partner</span><h3>Collaborate with us</h3><p>Schools, colleges, hospitals, NGOs, and CSR teams can co-create programs.</p><a href="#contact">Partner with us</a></article>
            <article id="book"><span>Book</span><h3>Bring a program in</h3><p>Request a health, well-being, or skill session for your community.</p><a href="#contact">Book a program</a></article>
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
              <a className="button button-secondary presence-cta" href="#book">Book a Program</a>
            </div>
            <div className="presence-map-card">
              <div className="presence-map-visual">
                <img src={programMapping} alt="Floydee program presence map across India" />
                <div className="presence-pulse-layer" aria-hidden="true">
                  <span className="pulse-point pulse-kolkata"></span>
                  <span className="pulse-point pulse-delhi"></span>
                  <span className="pulse-point pulse-mumbai"></span>
                  <span className="pulse-point pulse-bangalore"></span>
                  <span className="pulse-point pulse-lucknow"></span>
                </div>
              </div>
              <div className="presence-locations" aria-label="Highlighted presence locations">
                <span>Kolkata</span>
                <span>Delhi</span>
                <span>Patna</span>
                <span>Lucknow</span>
                <span>Mumbai</span>
                <span>Bangalore</span>
              </div>
            </div>
          </div>
        </section>

        <section className="stories" id="stories" aria-labelledby="stories-title">
          <div className="section-heading align-left">
            <p className="section-label">Latest</p>
            <h2 id="stories-title">Proof from the field, built to be shared.</h2>
          </div>
          <div className="story-grid" id="latest">
            <article><img src={studentSanika} alt="Indian learner testimonial portrait" /><div><p>Story</p><h3>From hesitation to confidence</h3><span>A field story format for beneficiary journeys, learner voices, and consent-safe updates.</span></div></article>
            <article><img src={healthCamp1} alt="Floydee health camp update from Rajarhat" /><div><p>News</p><h3>Health camp update</h3><span>Program news can include dates, partners, outcomes, images, and media contact.</span></div></article>
            <article id="resources"><img src={programMapping} alt="Floydee program mapping across India" /><div><p>Resource</p><h3>Reports and media centre</h3><span>Resources can be tagged by health, wellness, education, skill, women, youth, and partners.</span></div></article>
          </div>
        </section>

        <section className="gallery" id="gallery" aria-label="Foundation gallery">
          <img src={healthCamp1} alt="Floydee screening camp moment" />
          <img src={healthCamp2} alt="Floydee health education session" />
          <img src={healthCamp3} alt="Floydee adolescent girls health screening program" />
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

      <footer className="site-footer" id="trust">
        <div className="footer-brand">
          <a className="brand" href="#top"><img className="brand-logo footer-logo" src={floydeeLogo} alt="Floydee Foundation" /></a>
          <p>Section 8 foundation working with girls, women, and youth to build health, dignity, skills, and opportunity.</p>
        </div>
        <div><h2>Join Us</h2><a href="#donate">Donate</a><a href="#partners">Partner With Us</a><a href="#volunteer">Volunteer</a><a href="#book">Book a Program</a></div>
        <div><h2>Programs</h2><a href="#aarohi">AAROHI</a><a href="#sakhi">SAKHI</a><a href="#vidya">VIDYA</a><a href="#programs">Pillars of Development</a></div>
        <div><h2>Resources</h2><a href="#latest">News</a><a href="#stories">Stories</a><a href="#resources">Media Centre</a><a href="#gallery">Gallery</a></div>
        <div><h2>Contact</h2><p>New Town, Kolkata-700156</p><p>+91 91477 48064</p><p>contact@floydeefoundation.org</p></div>
        <div className="footer-bottom"><span>© 2026 Floydee Future Foundation. All rights reserved.</span><span>Legal · Privacy Policy · Terms & Conditions</span></div>
      </footer>
    </>
  );
}

function RouteFooter() {
  return (
    <footer className="site-footer route-footer" id="trust">
      <div className="footer-brand">
        <a className="brand" href="/"><img className="brand-logo footer-logo" src={floydeeLogo} alt="Floydee Foundation" /></a>
        <p>Section 8 foundation working with girls, women, and youth to build health, dignity, skills, and opportunity.</p>
      </div>
      <div><h2>Join Us</h2><a href="/donate">Donate</a><a href="/partner-with-us">Partner With Us</a><a href="/volunteer">Volunteer</a><a href="/book-a-program">Book a Program</a></div>
      <div><h2>Programs</h2><a href="/programs/aarohi">AAROHI</a><a href="/programs/sakhi">SAKHI</a><a href="/programs/vidya">VIDYA</a><a href="/programs">Pillars of Development</a></div>
      <div><h2>Resources</h2><a href="/news">News</a><a href="/stories">Stories</a><a href="/resources">Media Centre</a><a href="/gallery">Gallery</a></div>
      <div><h2>Contact</h2><p>New Town, Kolkata-700156</p><p>+91 91477 48064</p><p>contact@floydeefoundation.org</p></div>
      <div className="footer-bottom"><span>© 2026 Floydee Future Foundation. All rights reserved.</span><span>Legal · Privacy Policy · Terms & Conditions</span></div>
    </footer>
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

function DonationPage({ path }: { path: string }) {
  const isMonthly = path === "/donate/monthly";
  const isWhereNeeded = path === "/donate/where-needed-most";

  return (
    <main className="page route-donate">
      <PageHero
        eyebrow="Donate"
        title={isMonthly ? "Stand with access every month." : "Turn concern into access."}
        text="Support health access, emotional well-being, education, employability, and community-rooted programs through a donation enquiry. The Floydee team will connect with payment and 80G receipt details."
        image={healthCamp2}
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
        <SupportForm defaultFrequency={isMonthly ? "Monthly" : "One-time"} defaultProgram={isWhereNeeded ? "Where needed most" : ""} />
      </section>
      <section className="page-band">
        <h2>Donation FAQs</h2>
        <div className="page-grid three">
          <article><h3>Will I receive 80G details?</h3><p>Yes. The foundation team will connect with donation, campaign, payment, and 80G receipt information after your enquiry.</p></article>
          <article><h3>Can I choose a program?</h3><p>You can select `AAROHI`, `SAKHI`, `VIDYA`, or `Where needed most` in the donation form.</p></article>
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
        image={heroFoundation}
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
              <img src={program.image} alt="" />
              <p>{program.eyebrow}</p>
              <h3>{program.title}</h3>
              <span>{program.tagline}</span>
              <a href={`/programs/${program.title.toLowerCase()}`}>Explore {program.title}</a>
            </article>
          ))}
        </div>
      </section>
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

function ProgramDetailPage({ slug }: { slug: keyof typeof programPages }) {
  const program = programPages[slug];

  return (
    <main className="page">
      <PageHero eyebrow={program.eyebrow} title={`${program.title}: ${program.tagline}`} text={program.statement} image={program.image} cta={["Book a program", "/book-a-program"]} />
      <section className="page-section page-two-column">
        <div>
          <p className="section-label">Program overview</p>
          <h2>{program.intro}</h2>
        </div>
        <div className="page-copy-panel">
          <h3>Problem being addressed</h3>
          <p>{program.problem}</p>
          <h3>Target audience</h3>
          <p>{program.audience}</p>
        </div>
      </section>
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
        image={healthCamp3}
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
      <PageHero eyebrow="Impact" title="Measured in access opened, not promises made." text="Impact at Floydee is tracked through participation, partner engagement, program delivery, and the practical pathways opened for girls, women, and youth." image={programMapping} />
      <section className="page-section">
        <div className="page-grid four">
          <article className="metric-card"><strong>150+</strong><span>girls supported in screening initiatives</span></article>
          <article className="metric-card"><strong>12+</strong><span>academic and NGO partner relationships</span></article>
          <article className="metric-card"><strong>3</strong><span>core programs across care and opportunity</span></article>
          <article className="metric-card"><strong>5,000+</strong><span>youth engagement ambition for VIDYA each year</span></article>
        </div>
      </section>
    </main>
  );
}

function WhereWeWorkPage() {
  return (
    <main className="page">
      <PageHero eyebrow="Where We Work" title="Programs designed to move through institutions and communities." text="Floydee's presence grows through schools, colleges, communities, and partner networks across India." image={programMapping} cta={["Book a program", "/book-a-program"]} />
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
    book: ["Book a program", "Bring AAROHI, SAKHI, or VIDYA into a school, college, community, or partner setting."],
    campaign: ["Partner with the foundation", "Co-create a focused campaign around health access, dignity kits, learning material, or employability."]
  } as const;
  const [intent, text] = kind ? defaults[kind] : ["Partner with the foundation", "Choose the engagement pathway that matches your institution, energy, and community need."];

  return (
    <main className="page">
      <PageHero eyebrow="Join Us" title="Choose the door that matches your energy." text={text} image={heroFoundation} cta={["Send enquiry", "#join-form"]} />
      <section className="page-section">
        <div className="page-grid four">
          <article><h3>Volunteer</h3><p>Support outreach, program delivery, events, content, and community engagement.</p><a href="/volunteer">Sign up</a></article>
          <article><h3>Partner</h3><p>Work with Floydee through school, college, hospital, NGO, CSR, or institutional pathways.</p><a href="/partner-with-us">Partner with us</a></article>
          <article><h3>Book a Program</h3><p>Request AAROHI, SAKHI, or VIDYA for your students, community, or institution.</p><a href="/book-a-program">Book now</a></article>
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
      <PageHero eyebrow="Stories & Latest" title={titles[type]} text="Shareable proof from programs, partnerships, reports, media updates, and community moments." image={type === "gallery" ? healthCamp2 : studentSanika} />
      {type === "gallery" ? (
        <section className="page-section page-gallery-grid">
          {[healthCamp1, healthCamp2, healthCamp3, heroFoundation, programMapping, studentSanika].map((image, index) => (
            <img src={image} alt={`Floydee gallery item ${index + 1}`} key={image} />
          ))}
        </section>
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

function AboutPage({ view }: { view: "about" | "mission" | "history" | "leadership" | "trust" | "contact" }) {
  if (view === "contact") return <ContactPage />;

  return (
    <main className="page">
      <PageHero
        eyebrow="Who We Are"
        title="Potential is everywhere. Access is the work."
        text="Floydee Future Foundation is a Section 8 foundation working at the intersection of education, health, well-being, and social impact."
        image={heroFoundation}
        cta={["Contact us", "/contact"]}
      />
      {view === "leadership" ? (
        <section className="page-section">
          <div className="page-heading"><p className="section-label">Leadership</p><h2>Driven by a team committed to future-ready care and opportunity.</h2></div>
          <div className="page-grid three">{teamMembers.map(([name, role, bio]) => <article key={name}><h3>{name}</h3><p className="role-label">{role}</p><p>{bio}</p></article>)}</div>
        </section>
      ) : view === "trust" ? (
        <TrustCentrePage embedded />
      ) : (
        <>
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
  return <main className="page"><PageHero eyebrow="Trust Centre" title="Transparency builds the path for sustainable impact." text="Registration, tax, reports, policies, partners, and source notes belong in one clear place." image={programMapping} />{content}</main>;
}

function ContactPage() {
  return (
    <main className="page">
      <PageHero eyebrow="Contact" title="Collaborate with us." text="Reach out for donations, partnerships, program bookings, volunteering, media, or general enquiries." image={healthCamp2} cta={["Send enquiry", "#contact-form"]} />
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

function LegalPage({ title }: { title: string }) {
  return (
    <main className="page">
      <PageHero eyebrow="Legal and utility" title={title} text="This page supports donor confidence, accessibility, compliance, and public website navigation." image={programMapping} />
      <section className="page-section page-copy-panel">
        <h2>{title}</h2>
        <p>This starter page is ready for foundation-approved legal, accessibility, or policy text. It is included in Phase 1 so the public website has a complete navigation structure.</p>
        <p>For official use, the foundation should review and finalize this content before launch.</p>
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
      <PageHero eyebrow="Sitemap" title="Floydee Future Foundation website structure." text="A public map of the Phase 1 website pages and future growth pathways." image={heroFoundation} />
      <section className="page-section">
        <div className="page-grid three">{groups.map(([label, links]) => <article key={label as string}><h3>{label as string}</h3>{(links as string[]).map((link) => <a href={link} key={link}>{link}</a>)}</article>)}</div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="page">
      <PageHero eyebrow="Page not found" title="This page is not part of the current sitemap." text="Use the sitemap to find the current Phase 1 website pages." image={heroFoundation} cta={["View sitemap", "/sitemap"]} />
    </main>
  );
}

function renderRoute(path: string) {
  const canonicalPath = routeAliases[path] ?? path;

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
  if (canonicalPath === "/stories") return <><LatestPage type="stories" /><RouteFooter /></>;
  if (canonicalPath === "/news") return <><LatestPage type="news" /><RouteFooter /></>;
  if (canonicalPath === "/resources") return <><LatestPage type="resources" /><RouteFooter /></>;
  if (canonicalPath === "/gallery") return <><LatestPage type="gallery" /><RouteFooter /></>;
  if (canonicalPath === "/about") return <><AboutPage view="about" /><RouteFooter /></>;
  if (canonicalPath === "/mission") return <><AboutPage view="mission" /><RouteFooter /></>;
  if (canonicalPath === "/history") return <><AboutPage view="history" /><RouteFooter /></>;
  if (canonicalPath === "/leadership") return <><AboutPage view="leadership" /><RouteFooter /></>;
  if (canonicalPath === "/trust-centre") return <><TrustCentrePage /><RouteFooter /></>;
  if (canonicalPath === "/contact") return <><ContactPage /><RouteFooter /></>;
  if (canonicalPath === "/privacy-policy") return <><LegalPage title="Privacy Policy" /><RouteFooter /></>;
  if (canonicalPath === "/terms-and-conditions") return <><LegalPage title="Terms And Conditions" /><RouteFooter /></>;
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
      ".page-hero-copy, .page-hero-media, .page-section, .page-band, .page-grid article, .page-card-list article, .page-copy-panel, .page-cta-panel"
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

export function App() {
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

  return (
    <>
      <Header />
      {renderRoute(path)}
    </>
  );
}
