import { FormEvent, useEffect, useState } from "react";
import floydeeLogo from "./assets/floydee-logo.png";
import healthCamp1 from "./assets/health-camp-1.png";
import healthCamp2 from "./assets/health-camp-2.png";
import healthCamp3 from "./assets/health-camp-3.png";
import studentSanika from "./assets/student-sanika.jpg";
import programMapping from "./assets/program-mapping.png";

const navGroups = [
  {
    label: "JOIN US",
    links: [
      ["DONATE NOW", "#donate"],
      ["DONATE MONTHLY", "#donate"],
      ["CAMPAIGN WITH US", "#join"],
      ["LEARN & SHARE", "#stories"],
      ["PARTNER WITH US", "#partners"],
      ["WORK WITH US", "#volunteer", "has-submenu"]
    ]
  },
  {
    label: "WHAT WE DO",
    links: [
      ["EMERGENCIES", "#initiative"],
      ["OUR WORK", "#programs"],
      ["OUR IMPACT", "#impact"]
    ]
  },
  {
    label: "WHO WE ARE",
    links: [
      ["ABOUT US", "#about"],
      ["OUR HISTORY", "#mission"],
      ["OUR LEADERSHIP", "#about"],
      ["TRUST CENTRE", "#trust"]
    ]
  },
  {
    label: "LATEST",
    links: [
      ["NEWS", "#latest"],
      ["STORIES", "#stories"],
      ["RESEARCH & REPORTS", "#resources"]
    ]
  }
] as const;

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
      <a className="brand" href="#home" aria-label="Floydee Future Foundation home">
        <img className="brand-logo" src={floydeeLogo} alt="Floydee Foundation" />
        <span className="brand-title">Floydee Foundation</span>
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

function SupportForm() {
  const [frequency, setFrequency] = useState("One-time");
  const [amount, setAmount] = useState("500");
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setStatus("Please complete the required fields correctly.");
      form.reportValidity();
      return;
    }

    setStatus("Thank you. The Floydee team can follow up with donation details.");
    form.reset();
    setFrequency("One-time");
    setAmount("500");
  };

  return (
    <form className="support-form" id="support-form" noValidate onSubmit={handleSubmit}>
      <div className="toggle-group" aria-label="Donation frequency">
        {["One-time", "Monthly"].map((item) => (
          <button
            className={`toggle${frequency === item ? " active" : ""}`}
            type="button"
            key={item}
            onClick={() => setFrequency(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <input type="hidden" name="frequency" value={frequency} />
      <div className="amount-grid" aria-label="Suggested amounts">
        {[
          ["500", "Rs 500", "Sponsor a health session kit"],
          ["1000", "Rs 1,000", "Support menstrual education"],
          ["2500", "Rs 2,500", "Fund wellness support"]
        ].map(([value, label, description]) => (
          <button
            type="button"
            className={`amount-card${amount === value ? " active" : ""}`}
            data-amount={value}
            key={value}
            onClick={() => setAmount(value)}
          >
            <strong>{label}</strong>
            <span>{description}</span>
          </button>
        ))}
        <label className={`amount-card custom-amount${!["500", "1000", "2500"].includes(amount) ? " active" : ""}`}>
          <strong>Other</strong>
          <input type="number" name="customAmount" min="1" placeholder="Amount" onChange={(event) => setAmount(event.target.value)} />
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
        <label>
          Program focus
          <select name="program" required defaultValue="">
            <option value="">Select a program</option>
            <option>Health & Wellness</option>
            <option>Emotional Well-being</option>
            <option>Education & Skill Development</option>
            <option>Where needed most</option>
          </select>
        </label>
        <button className="button button-primary" type="submit">Donate Now</button>
      </div>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}

function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setStatus("Please complete the required fields correctly.");
      form.reportValidity();
      return;
    }

    setStatus("Thank you. Your enquiry has been captured for the foundation team.");
    form.reset();
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
      <label>
        I want to
        <select name="intent" required defaultValue="">
          <option value="">Choose an option</option>
          <option>Partner with the foundation</option>
          <option>Volunteer</option>
          <option>Book a program</option>
          <option>Request media information</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" rows={4} required></textarea>
      </label>
      <button className="button button-primary" type="submit">Send Enquiry</button>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}

export function App() {
  return (
    <>
      <Header />
      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="brand-line">Urgent: girls and youth need access now</p>
            <h1 id="hero-title">Building healthy, skilled, confident futures.</h1>
            <p>
              We work with girls, women, and youth through health access, emotional well-being,
              education, and employability programs rooted in real communities.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#donate">Support Our Cause</a>
              <a className="button button-secondary" href="#stories">Read Field Stories</a>
            </div>
          </div>
        </section>

        <section className="donation-band" id="donate" aria-labelledby="donate-title">
          <div className="donation-intro">
            <span className="icon-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.4-9-9.1C1.6 8.6 3.6 5 7.1 5c2 0 3.5 1.1 4.9 3 1.4-1.9 2.9-3 4.9-3 3.5 0 5.5 3.6 4.1 6.9C19 16.6 12 21 12 21Z"/></svg>
            </span>
            <h2 id="donate-title">Donate to support girls and youth.</h2>
            <p>Choose a program focus and leave your details. The foundation team can follow up with payment and partnership options.</p>
          </div>
          <SupportForm />
        </section>

        <section className="split-section" id="about" aria-labelledby="about-title">
          <div>
            <p className="section-label">Floydee Foundation</p>
            <h2 id="about-title">Girls and youth deserve more than access. They deserve dignity, skills, and confidence.</h2>
          </div>
          <div className="split-copy">
            <p>
              Floydee Future Foundation is a Section 8 foundation working at the intersection of
              health, well-being, education, and social impact. We help young people and women move
              from potential to access through practical, community-rooted programs.
            </p>
            <div className="mission-grid" id="mission">
              <article>
                <h3>Vision</h3>
                <p>An inclusive society where girls, women, and youth can live with health, dignity, skills, and purpose.</p>
              </article>
              <article>
                <h3>Mission</h3>
                <p>Build health awareness, emotional confidence, digital readiness, and partnerships that scale sustainable impact.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="impact-strip" id="impact" aria-labelledby="impact-title">
          <h2 id="impact-title">Our impact in numbers</h2>
          <div className="metrics">
            <article><strong>150+</strong><span>girls supported in screening initiatives</span></article>
            <article><strong>12+</strong><span>academic and NGO partner relationships</span></article>
            <article><strong>3</strong><span>core programs across care and opportunity</span></article>
            <article><strong>2</strong><span>flagship program models: Aarohi and Vidya</span></article>
          </div>
        </section>

        <section className="join" id="join" aria-labelledby="join-title">
          <div className="section-heading align-left">
            <p className="section-label">Join us</p>
            <h2 id="join-title">Ways to get involved</h2>
          </div>
          <div className="join-grid">
            <article id="volunteer"><span>Volunteer</span><h3>Give time and skills</h3><p>Support outreach, content, events, training, and program delivery.</p><a href="#contact">Sign up</a></article>
            <article id="partners"><span>Partner</span><h3>Collaborate with us</h3><p>Schools, colleges, hospitals, NGOs, and CSR teams can co-create programs.</p><a href="#contact">Partner with us</a></article>
            <article id="book"><span>Book</span><h3>Bring a program in</h3><p>Request a health, well-being, or skill session for your community.</p><a href="#contact">Book a program</a></article>
            <article><span>Fund</span><h3>Support a campaign</h3><p>Help underwrite kits, screenings, learning materials, and workshops.</p><a href="#donate">Donate today</a></article>
          </div>
        </section>

        <section className="programs" id="programs" aria-labelledby="programs-title">
          <div className="section-heading">
            <p className="section-label">Our work</p>
            <h2 id="programs-title">How we empower girls, women, and youth.</h2>
            <p>Each program page is structured around the problem, our approach, who we serve, partner pathways, impact proof, stories, and a clear call to action.</p>
          </div>
          <div className="program-grid">
            <article className="program-card" id="health"><img src={healthCamp1} alt="Floydee menstrual health screening camp in Rajarhat" /><div><span className="program-index">01</span><h3>Health & Wellness</h3><p>Aarohi brings menstrual health education, PCOD awareness, cervical cancer screening, sanitary pad distribution, and school/community sessions closer to girls and women.</p><a href="#book">Book a health program</a></div></article>
            <article className="program-card" id="wellbeing"><img src={healthCamp2} alt="Floydee health and well-being session with adolescent girls" /><div><span className="program-index">02</span><h3>Emotional Well-being</h3><p>Safe spaces, awareness sessions, confidence-building conversations, mental well-being education, and referral pathways where deeper support is needed.</p><a href="#volunteer">Support well-being work</a></div></article>
            <article className="program-card" id="education"><img src={studentSanika} alt="Indian student learner from Floydee skill development programs" /><div><span className="program-index">03</span><h3>Education & Skill Development</h3><p>Vidya equips youth with software skills, career readiness, digital confidence, industry exposure, and bootcamp-based employability pathways.</p><a href="#partners">Partner on skill programs</a></div></article>
          </div>
        </section>

        <section className="initiative" id="initiative" aria-labelledby="initiative-title">
          <div className="initiative-copy">
            <p className="section-label">Featured initiative</p>
            <h2 id="initiative-title">Menstrual health screening camp</h2>
            <p>In partnership with PKG Medical College & Hospital, Floydee launched a menstrual health screening initiative at Government Girls High School, Rajarhat, supporting adolescent girls with health education, screening, and practical guidance.</p>
            <div className="mini-metrics"><span><strong>150</strong> girls reached</span><span><strong>1</strong> school camp</span><span><strong>3</strong> health focus areas</span></div>
            <a className="button button-primary" href="#latest">See latest initiatives</a>
          </div>
          <img src={healthCamp3} alt="Floydee menstrual health screening camp participants" />
        </section>

        <section className="where" id="where" aria-labelledby="where-title">
          <div className="section-heading align-left">
            <p className="section-label">Where we work</p>
            <h2 id="where-title">An India-first presence designed to scale.</h2>
            <p>The first release can show current and planned activity areas while leaving room for a CMS-backed map later.</p>
          </div>
          <div className="where-grid">
            <article><h3>Kolkata & West Bengal</h3><p>Foundation headquarters, partner outreach, school and community health activity.</p></article>
            <article><h3>Academic partner network</h3><p>Colleges and institutions supporting upskilling, career readiness, and youth access.</p></article>
            <article><h3>Community partners</h3><p>NGOs, schools, hospitals, and CSR collaborators expanding care and opportunity.</p></article>
          </div>
        </section>

        <section className="stories" id="stories" aria-labelledby="stories-title">
          <div className="section-heading align-left">
            <p className="section-label">Latest</p>
            <h2 id="stories-title">Stories, news, and resources.</h2>
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
        <div><h2>Programs</h2><a href="#health">Health & Wellness</a><a href="#wellbeing">Emotional Well-being</a><a href="#education">Education & Skill Development</a><a href="#initiative">Events & Initiatives</a></div>
        <div><h2>Resources</h2><a href="#latest">News</a><a href="#stories">Stories</a><a href="#resources">Media Centre</a><a href="#gallery">Gallery</a></div>
        <div><h2>Contact</h2><p>New Town, Kolkata-700156</p><p>+91 91477 48064</p><p>contact@floydeefoundation.org</p></div>
        <div className="footer-bottom"><span>© 2026 Floydee Future Foundation. All rights reserved.</span><span>Legal · Privacy Policy · Terms & Conditions</span></div>
      </footer>
    </>
  );
}
