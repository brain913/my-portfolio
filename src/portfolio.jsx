import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  IMG,
  TYPING,
  STATS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATES,
  REFERENCES,
  SKILLS,
  GALLERY,
  PROJECTS,
  CONNECT,
} from "./data/portfolioData";
import "./index.css";

void motion;

const HERO_TITLES = [
  "Student",
  "Developer",
  "Builder",
  "Explorer",
  "Organiser",
];

const TYPE_SPEED = 95;
const DELETE_SPEED = 58;
const HOLD_TIME = 900;
const END_HOLD_TIME = 1100;

const CONNECT_LOGOS = {
  Discord: "https://cdn.simpleicons.org/discord",
  WhatsApp: "https://cdn.simpleicons.org/whatsapp",
  LinkedIn: "https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg",
  Email: "https://cdn.simpleicons.org/gmail",
  "Book a Call": "https://cdn.simpleicons.org/googlecalendar",
};

const TECH_STACK_GROUPS = [
  {
    title: "Core",
    note: "Primary tools I use most often.",
    names: ["JavaScript", "React", "Python", "Git", "GitHub", "Figma"],
  },
  {
    title: "Workflow",
    note: "Daily tooling that keeps projects moving.",
    names: ["VS Code", "Arc Browser", "ChatGPT", "Android Studio", "Kaggle", "Notion", "Raycast"],
  },
  {
    title: "Exploration",
    note: "Tools I use when I’m testing ideas or learning something new.",
    names: ["Machine Learning", "Shapr3D", "Chrome DevTools", "Google Dev Tools", "Firebase", "Framer", "JetBrains"],
  },
];

const VIDEO_LOADING_LINES = [
  "Loading project preview...",
  "Preparing the media clip...",
  "Fetching this project clip...",
  "Setting up the preview...",
];

function indexFromText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 2147483647;
  }
  return Math.abs(hash);
}

function logoForItem(item) {
  if (item.logo) {
    return item.logo;
  }
  if (!item.site) {
    return "";
  }
  try {
    const { hostname } = new URL(item.site);
    return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
  } catch {
    return "";
  }
}

function MediaCard({ item }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const normalizedSrc = item.src.startsWith("/gallery/")
    ? item.src.replace(/ /g, "%20")
    : item.src;
  const src = failed ? IMG.profile : normalizedSrc;

  return (
    <figure className={`mv-media-card ${loaded ? "is-loaded" : ""} ${failed ? "is-failed" : ""}`}>
      {!loaded && !failed ? <div className="mv-media-loading" aria-hidden="true" /> : null}
      <img
        src={src}
        alt={item.label}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
      />
      <figcaption>
        <p>{item.label}</p>
        <span>{item.caption}</span>
        {failed ? <small>Original image unavailable. Showing fallback.</small> : null}
      </figcaption>
    </figure>
  );
}

function Section({
  id,
  title,
  children,
  reducedMotion,
  alwaysVisible = false,
  density = "regular",
  deferContent = true,
}) {
  const sectionRef = useRef(null);
  const isNearViewport = useInView(sectionRef, {
    once: true,
    margin: "250px 0px 250px 0px",
  });
  const shouldRenderContent = !deferContent || alwaysVisible || isNearViewport;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`mv-section mv-section-${density} ${isNearViewport || alwaysVisible ? "is-visible" : ""}`}
    >
      <motion.div
        className="mv-wrap"
        initial={alwaysVisible || reducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={alwaysVisible || reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.h2
          className="mv-section-heading"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reducedMotion ? 0 : 0.34, ease: [0.23, 1, 0.32, 1] }}
        >
          {title}
        </motion.h2>
        {shouldRenderContent ? children : null}
      </motion.div>
    </section>
  );
}

function LazyVideo({ src, label }) {
  const videoContainerRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const loadingLine = useMemo(() => {
    const idx = indexFromText(label) % VIDEO_LOADING_LINES.length;
    return VIDEO_LOADING_LINES[idx];
  }, [label]);
  const shouldLoad = useInView(videoContainerRef, {
    once: true,
    margin: "350px 0px 350px 0px",
  });

  return (
    <div ref={videoContainerRef} className="mv-video-shell">
      {!shouldLoad ? <p className="mv-media-note">{loadingLine}</p> : null}
      <video
        src={shouldLoad ? src : undefined}
        autoPlay
        loop
        muted
        preload="none"
        playsInline
        aria-label={label}
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoFailed(true)}
      />
      {shouldLoad && !videoReady && !videoFailed ? <p className="mv-media-note">Loading preview. This may take a moment.</p> : null}
      {videoFailed ? <p className="mv-media-note">Preview unavailable right now. Try reloading if it stays blank.</p> : null}
    </div>
  );
}

export default function Portfolio() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 24,
    mass: 0.3,
  });
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorOpacity = useMotionValue(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const storedTheme = window.localStorage.getItem("mv-theme");
    return storedTheme
      || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  });
  const [finePointer, setFinePointer] = useState(false);
  const [heroText, setHeroText] = useState(reducedMotion ? HERO_TITLES[0] : "");
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDeleting, setHeroDeleting] = useState(false);

  const featuredProjects = useMemo(() => EXPERIENCE.filter((item) => item.featured), []);
  const heroQuickLinks = useMemo(
    () => CONNECT.filter((item) => item.label === "Email" || item.label === "LinkedIn"),
    [],
  );
  const techStackGroups = useMemo(
    () => TECH_STACK_GROUPS.map((group) => ({
      ...group,
      items: SKILLS.filter((item) => group.names.includes(item.name)),
    })),
    [],
  );
  const groupedGallery = useMemo(() => {
    const groups = new Map();
    GALLERY.forEach((item) => {
      if (!groups.has(item.label)) {
        groups.set(item.label, []);
      }
      groups.get(item.label).push(item);
    });

    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
  }, []);
  const contactContainer = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.34,
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };
  const contactItem = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.26, ease: [0.23, 1, 0.32, 1] },
    },
  };
  const bottomContactLinks = [
    {
      label: "GitHub",
      handle: "@brain913",
      href: "https://github.com/brain913",
      site: "https://github.com",
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("mv-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") {
      return undefined;
    }

    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const updatePointerMode = () => setFinePointer(finePointerQuery.matches);
    updatePointerMode();

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        cursorOpacity.set(0);
        return;
      }

      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      cursorOpacity.set(1);
      setFinePointer(true);
    };

    const handlePointerLeave = () => {
      cursorOpacity.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    if (finePointerQuery.addEventListener) {
      finePointerQuery.addEventListener("change", updatePointerMode);
    } else {
      finePointerQuery.addListener(updatePointerMode);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);

      if (finePointerQuery.removeEventListener) {
        finePointerQuery.removeEventListener("change", updatePointerMode);
      } else {
        finePointerQuery.removeListener(updatePointerMode);
      }
    };
  }, [cursorOpacity, cursorX, cursorY, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const currentTitle = HERO_TITLES[heroIndex];
    const isLastTitle = heroIndex === HERO_TITLES.length - 1;
    let timerId;

    if (!heroDeleting && heroText === currentTitle) {
      timerId = window.setTimeout(() => {
        setHeroDeleting(true);
      }, isLastTitle ? END_HOLD_TIME : HOLD_TIME);
    } else if (heroDeleting && heroText === "") {
      timerId = window.setTimeout(() => {
        setHeroDeleting(false);
        setHeroIndex((value) => (value + 1) % HERO_TITLES.length);
      }, 220);
    } else {
      timerId = window.setTimeout(() => {
        setHeroText((value) => {
          const nextLength = heroDeleting ? value.length - 1 : value.length + 1;
          return currentTitle.slice(0, Math.max(0, nextLength));
        });
      }, heroDeleting ? DELETE_SPEED : TYPE_SPEED);
    }

    return () => window.clearTimeout(timerId);
  }, [heroDeleting, heroIndex, heroText, reducedMotion]);

  return (
    <main className="mv-root">
      <a className="mv-skip-link" href="#projects">Skip to projects</a>
      <motion.div
        aria-hidden="true"
        className="mv-cursor-ring"
        style={{ x: cursorX, y: cursorY, opacity: reducedMotion || !finePointer ? 0 : cursorOpacity }}
      />
      <motion.div className="mv-progress" style={{ scaleX: progress }} />

      <header className="mv-header">
        <a href="#hero" className="mv-brand">vatsal.</a>
        <div className="mv-header-actions">
          <nav aria-label="Main navigation">
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            className="mv-theme-toggle"
            onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
            aria-pressed={theme === "light"}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="mv-theme-toggle-track" aria-hidden="true">
              <span className={`mv-theme-option ${theme === "dark" ? "is-active" : ""}`}>
                <span className="mv-theme-icon" aria-hidden="true">☾</span>
              </span>
              <span className={`mv-theme-option ${theme === "light" ? "is-active" : ""}`}>
                <span className="mv-theme-icon" aria-hidden="true">☼</span>
              </span>
              <span className="mv-theme-thumb" aria-hidden="true">
                {theme === "dark" ? "☾" : "☼"}
              </span>
            </span>
          </button>
        </div>
      </header>

      <section id="hero" className="mv-hero">
        <div className="mv-wrap">
          <div className="mv-hero-top">
            <h1 className="mv-hero-signature" aria-label="Vatsal Mehta">
              <span>Vatsal</span>
              <span>Mehta</span>
              <span className="mv-hero-portrait-wrap" aria-hidden="true">
                <img src={IMG.profile} alt="" className="mv-hero-portrait" loading="eager" />
              </span>
            </h1>
            <span className="mv-scroll-hint">Scroll</span>
          </div>
          <p className="mv-hero-sub">Omnia possibilia credentibus</p>
          <p className="mv-hero-kicker">
            I am a{" "}
            <span className="mv-hero-typing">
              {heroText}
              {!reducedMotion && <span className="mv-hero-caret" aria-hidden="true" />}
            </span>
          </p>
          <p className="mv-copy">
            Year 10 at BBHS. I organise hackathons, compete in robotics, serve coffee, and
            explore technology and finance. I care about doing things properly and adding real value.
          </p>
          <div className="mv-hero-cta">
            {heroQuickLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                <img
                  src={logoForItem({ site: item.href, logo: CONNECT_LOGOS[item.label] })}
                  alt=""
                  aria-hidden="true"
                />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Section id="projects" title="Projects" reducedMotion={reducedMotion} density="feature">
        <div className="mv-project-list">
          {featuredProjects.map((item, index) => (
            <details key={`${item.company}-${item.period}`} className="mv-project" open={index === 0}>
              <summary>
                <span className="mv-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="mv-title">{item.role} - {item.company}</span>
                <span className="mv-plus">+</span>
              </summary>
              <div className="mv-project-content">
                <p>{item.summary}</p>
                <ul>
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
                <div className="mv-meta-row">
                  <span>{item.impact}</span>
                  <span>{item.scope}</span>
                  <span>{item.period}</span>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section id="about" title="About" reducedMotion={reducedMotion} density="feature">
        <blockquote>
          I build systems that make sense of data and opportunities that most people skip.
        </blockquote>
        <p className="mv-copy">
          I am currently {TYPING.join(" ")} Growth mindset, adaptability, and a commitment
          to achieve my goals while adding value through dedication and results.
        </p>
        <p className="mv-copy">
          Most of my work is practical: events, operations, robotics, and communication.
          I focus on showing up consistently, handling pressure well, and finishing what I start.
        </p>

        <div className="mv-ticker" aria-hidden="true">
          <div className="mv-ticker-track">
            {SKILLS.concat(SKILLS).map((item, idx) => (
              <span key={`${item.name}-${idx}`}>{item.name}</span>
            ))}
          </div>
        </div>
      </Section>

      <Section id="experience" title="Experience" reducedMotion={reducedMotion} density="regular">
        <div className="mv-grid two">
          {EXPERIENCE.map((item) => (
            <article key={`${item.company}-${item.period}`} className="mv-card">
              <h3>{item.role}</h3>
              <p className="mv-muted">{item.company} - {item.location}</p>
              <p>{item.summary}</p>
              <div className="mv-tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="education" title="Education and Certificates" reducedMotion={reducedMotion} density="compact">
        <div className="mv-grid two">
          <article className="mv-card">
            <h3>Education</h3>
            {EDUCATION.map((item) => (
              <div className="mv-line mv-line-row" key={`${item.school}-${item.period}`}>
                <p>{item.school}</p>
                <span>{item.period}</span>
              </div>
            ))}
          </article>
          <article className="mv-card">
            <h3>Certificates</h3>
            {CERTIFICATES.map((item) => (
              <div className="mv-line mv-line-row" key={`${item.name}-${item.year}`}>
                <p>{item.name}</p>
                <span>{item.year}</span>
              </div>
            ))}
          </article>
        </div>
      </Section>

      <Section id="references" title="References" reducedMotion={reducedMotion} density="compact">
        <div className="mv-grid two">
          {REFERENCES.map((item) => (
            <article className="mv-card" key={item.name}>
              <h3>{item.name}</h3>
              <p className="mv-muted">{item.short}</p>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="stack" title="Tech Stack" reducedMotion={reducedMotion} density="compact">
        <div className="mv-stack-groups">
          {techStackGroups.map((group, groupIndex) => (
            <details className="mv-stack-group" key={group.title} open={groupIndex === 0}>
              <summary>
                <span className="mv-stack-title">{group.title}</span>
                <span className="mv-stack-note">{group.note}</span>
                <span className="mv-stack-count">{group.items.length} items</span>
              </summary>
              <div className="mv-skill-grid mv-skill-grid-grouped">
                {group.items.map((item) => (
                  <a className="mv-skill" key={item.name} href={item.site} target="_blank" rel="noreferrer">
                    <img src={logoForItem(item)} alt={`${item.name} logo`} loading="lazy" decoding="async" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section id="gallery" title="Gallery" reducedMotion={reducedMotion} density="feature">
        <div className="mv-gallery-groups">
          {groupedGallery.map((group, groupIndex) => (
            <details className="mv-gallery-group" key={group.label} open={groupIndex === 0}>
              <summary>
                <span className="mv-gallery-title">{group.label}</span>
                <span className="mv-gallery-count">
                  {group.items.length} {group.items.length === 1 ? "photo" : "photos"}
                </span>
              </summary>
              <div className="mv-gallery">
                {group.items.map((item, idx) => (
                  <MediaCard item={item} key={`${item.label}-${idx}`} />
                ))}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section id="media" title="Project Media" reducedMotion={reducedMotion} density="compact">
        <div className="mv-grid two">
          {PROJECTS.map((item) => (
            <article className="mv-card" key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.caption}</p>
              <LazyVideo src={item.src} label={item.label} />
            </article>
          ))}
        </div>
      </Section>

      <Section id="activity" title="Activity" reducedMotion={reducedMotion} density="compact">
        <div className="mv-grid two">
          {STATS.map((item) => (
            <article className="mv-card" key={`${item.label}-${item.sub}`}>
              <h3>{item.label}</h3>
              <p className="mv-muted">{item.sub}</p>
              <p>{item.val}</p>
            </article>
          ))}
        </div>
      </Section>

      <section id="contact" className="mv-contact-band">
        <motion.div
          className="mv-contact-noise"
          aria-hidden="true"
          animate={reducedMotion ? {} : { opacity: [0.35, 0.55, 0.35] }}
          transition={reducedMotion ? {} : { duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="mv-contact-shell"
          variants={contactContainer}
          initial={reducedMotion ? false : "hidden"}
          whileInView={reducedMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.55 }}
        >
          <motion.p className="mv-contact-kicker" variants={contactItem}>Contact</motion.p>
          <motion.h3 className="mv-contact-ask" variants={contactItem}>
            <span>Open to Student Tech</span>
            <span>Roles and Collaborations</span>
          </motion.h3>
          <motion.p className="mv-contact-guide" variants={contactItem}>
            Book a call for project chats. Email is better for quick follow-ups and introductions.
          </motion.p>

          <motion.a
            className="mv-contact-cta"
            variants={contactItem}
            href="https://cal.com/brain913"
            target="_blank"
            rel="noreferrer"
            whileHover={reducedMotion ? {} : { y: -2 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <span>Book a Call</span>
          </motion.a>

          <motion.a
            className="mv-contact-email"
            variants={contactItem}
            href="mailto:vatsalplayzforever@gmail.com"
            whileHover={reducedMotion ? {} : { x: 4 }}
            whileTap={reducedMotion ? {} : { scale: 0.99 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            vatsalplayzforever@gmail.com
          </motion.a>

          <motion.div className="mv-contact-pills" variants={contactItem}>
            {bottomContactLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                whileHover={reducedMotion ? {} : { y: -2 }}
                whileTap={reducedMotion ? {} : { scale: 0.97 }}
                transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}
              >
                <img src={logoForItem({ site: item.site })} alt="" aria-hidden="true" />
                <span className="mv-contact-pill-label">{item.label}</span>
                <span className="mv-contact-pill-handle">{item.handle}</span>
              </motion.a>
            ))}
          </motion.div>

          <motion.p className="mv-footnote" variants={contactItem}>
            Built with React and Motion. © 2026 Vatsal Mehta
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
