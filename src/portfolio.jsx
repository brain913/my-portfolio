import { useState, useEffect, useRef, useCallback } from "react";

/* ─── HOOKS ───────────────────────────────────────────────────── */
function useTyping(strings, speed = 55, pause = 2000) {
  const [txt, setTxt] = useState("");
  const [idx, setIdx] = useState(0);
  const [ch, setCh] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = strings[idx];
    const t = setTimeout(() => {
      if (!del && ch < cur.length) { setCh(c => c + 1); setTxt(cur.slice(0, ch + 1)); }
      else if (!del && ch === cur.length) setDel(true);
      else if (del && ch > 0) { setCh(c => c - 1); setTxt(cur.slice(0, ch - 1)); }
      else { setDel(false); setIdx(i => (i + 1) % strings.length); }
    }, del ? speed / 2 : ch === cur.length ? pause : speed);
    return () => clearTimeout(t);
  }, [ch, del, idx, strings, speed, pause]);
  return txt;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

/* ─── PLUM CANVAS ─────────────────────────────────────────────── */
function PlumCanvas({ color }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const PI = Math.PI, HALF = PI / 2, J = PI / 14;
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 1; ctx.strokeStyle = color;
    let queue = [], pending = [];
    const branch = (x, y, a, d = { v: 0 }) => {
      if (x < -80 || x > w + 80 || y < -80 || y > h + 80) return;
      d.v++;
      const len = 5 + Math.random() * 4;
      const nx = x + len * Math.cos(a), ny = y + len * Math.sin(a);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
      const g = d.v <= 28 ? 0.78 : 0.45;
      if (Math.random() < g) pending.push(() => branch(nx, ny, a + Math.random() * J, d));
      if (Math.random() < g) pending.push(() => branch(nx, ny, a - Math.random() * J, d));
    };
    const rnd = () => 0.2 + Math.random() * 0.6;
    queue = [() => branch(rnd() * w, -5, HALF), () => branch(rnd() * w, h + 5, -HALF), () => branch(-5, rnd() * h, 0), () => branch(w + 5, rnd() * h, PI)];
    if (w < 600) queue = queue.slice(0, 2);
    let rafId;
    const tick = () => {
      const cur = queue; queue = []; pending = [];
      cur.forEach(fn => { Math.random() < 0.5 ? queue.push(fn) : fn(); });
      queue.push(...pending);
      if (queue.length) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    const onResize = () => {
      cancelAnimationFrame(rafId); ctx.clearRect(0, 0, w, h);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
      ctx.lineWidth = 1; ctx.strokeStyle = color;
      queue = [() => branch(rnd() * w, -5, HALF), () => branch(rnd() * w, h + 5, -HALF), () => branch(-5, rnd() * h, 0), () => branch(w + 5, rnd() * h, PI)];
      rafId = requestAnimationFrame(tick);
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize); };
  }, [color]);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── THEMES ──────────────────────────────────────────────────── */
const THEMES = {
  green:  { accent: "#4ade80", accentRgb: "74,222,128",  branch: "rgba(74,222,128,0.09)"  },
  blue:   { accent: "#60a5fa", accentRgb: "96,165,250",  branch: "rgba(96,165,250,0.09)"  },
  purple: { accent: "#a78bfa", accentRgb: "167,139,250", branch: "rgba(167,139,250,0.09)" },
  pink:   { accent: "#f472b6", accentRgb: "244,114,182", branch: "rgba(244,114,182,0.09)" },
  orange: { accent: "#fb923c", accentRgb: "251,146,60",  branch: "rgba(251,146,60,0.09)"  },
  cyber:  { accent: "#facc15", accentRgb: "250,204,21",  branch: "rgba(250,204,21,0.09)"  },
};

/* ─── ASSETS ──────────────────────────────────────────────────── */
const IMG = {
  profile:     "/gallery/profile_new.jpg",
  accelrtLogo: "https://framerusercontent.com/images/TSAli1ZEa27c4TP04Bm7UQIUQ.png?scale-down-to=512",
  accelrtSite: "https://framerusercontent.com/images/e0UVnUVjKLv5Ml8kJ5dRPMFf73Q.png",
  roboticsLogo:"https://framerusercontent.com/images/cuIo4eVBHbM00xXLX8JGOsgtUo.jpg?scale-down-to=512",
  roboticsSite:"https://framerusercontent.com/images/GChbrPKmHoUqbyTczTyy9OKupe4.jpg",
  cafeLogo:    "https://framerusercontent.com/images/wVaWfn9GujVGnYPiHUz6qtusWaQ.jpg",
  cafeSite:    "https://framerusercontent.com/images/VrerlOXUnIZtWILehqwd8HIhW54.jpg",
  city2Logo:   "https://framerusercontent.com/images/rtNcXMSTJ0h0tvEy5ukgMpY68.png",
  city2Site:   "https://framerusercontent.com/images/y3cKAV5jwOJGcb8wAzr95VJM49c.jpg",
  scrapyard1:  "https://framerusercontent.com/images/zVJ0xEO14uoYedqzRcyE2u3LDBs.jpg?scale-down-to=1024",
  scrapyard2:  "https://framerusercontent.com/images/sAPlOltwcpel7KaPCn3F0RwlEU.jpg?scale-down-to=1024",
  athletics:   "https://framerusercontent.com/images/QUj5yg4QAZFH8t6eJb1SJCCE.png?scale-down-to=1024",
  flowerVid:   "https://framerusercontent.com/assets/J9mOhxlb8oAWga9V9J7FMk7Y.mp4",
  squareVid:   "https://framerusercontent.com/assets/Xa80JloFiy8jFUQd7V9kAzma5L4.mp4",
  daydreamPhoto: "https://framerusercontent.com/images/SzFUezPNJJVFtZO9J4QAIQBxI.jpeg?scale-down-to=2048&width=5712&height=4284",
  daydreamIcon: "https://daydream.hackclub.com/favicon.png",
};

/* ─── DATA ────────────────────────────────────────────────────── */
const TYPING = [
  "exploring technology & finance.",
  "thinking about good food and art.",
  "preparing myself for what's next.",
  "balancing academics & extracurriculars.",
];

const STATS = [
  { label: "Hackathons",     sub: "Organised/Competed", val: "2+"    },
  { label: "Model United Nations",   sub: "Competing",      val: "Competing"   },
  { label: "AccelRT",        sub: "Non-profit", val: "2025"    },
  { label: "FIRST Robotics Submerged", sub: "APOC",       val: "Volunteered"  },
  { label: "FIRST Robotics Unearthed", sub: "Nationals",       val: "Competed"  },
  { label: "FIRST Robotics Unearthed", sub: "Regionals (UNSW, Bossley Park)", val: "Volunteered"  },
  { label: "BBHS Cafe",      sub: "Barista",    val: "2024-2025"    },
  { label: "City2Surf",      sub: "Volunteer",  val: "Completed" },
];

const EXPERIENCE = [
  {
    period: "2025", role: "Hackathon Organiser", company: "Hack Club",
    link: "https://daydream.hackclub.com/sydney", location: "UNSW - In person",
    logo: IMG.daydreamIcon, siteImg: IMG.daydreamPhoto,
    summary: "Work at Hack Club, a non-profit dedicated to creating and organising Hackathons for students in Australia. This gives me the ability to put volunteering and the ability to work in a formal but work from home environment. All of our spending is visible through Hack Club Bank.",
    achievements: ["Organised hackathon events connecting students with industry across Australia", "Managed event logistics and participant communication end-to-end", "All spending is transparently tracked through Hack Club Bank"],
    tags: ["Events", "Community", "Leadership"],
  },
  {
    period: "2024 – 2025", role: "Volunteer", company: "AccelRT",
    link: "https://accelrt-v2.vercel.app/", location: "Sydney – Hybrid",
    logo: IMG.accelrtLogo, siteImg: IMG.accelrtSite,
    summary: "Work at AccelRT, a non-profit dedicated to creating and organising Hackathons for students in Australia. This gives me the ability to put volunteering and the ability to work in a formal but work from home environment. All of our spending is visible through Hack Club Bank.",
    achievements: ["Organised hackathon events connecting students with industry across Australia", "Managed event logistics and participant communication end-to-end", "All spending is transparently tracked through Hack Club Bank"],
    tags: ["Events", "Community", "Leadership"],
  },
  {
    period: "2024", role: "Table Reset Volunteer", company: "FIRST Robotics",
    link: "https://www.firstlegoleague.org/", location: "Sydney – In person",
    logo: IMG.roboticsLogo, siteImg: IMG.roboticsSite,
    summary: "Volunteered at FIRST Robotics, Asia Pacific Open Championship (APOC) with a table reset role which taught me how to work in a fast-paced timed environment.",
    achievements: ["Managed fast-paced timed table resets across all competition rounds", "Collaborated with international teams at the Asia Pacific Open Championship"],
    tags: ["Robotics", "STEM", "Teamwork"],
  },
  {
    period: "2023 – 2025", role: "Barista", company: "BBHS Cafe",
    link: "#", location: "Blacktown, NSW",
    logo: IMG.cafeLogo, siteImg: IMG.cafeSite,
    summary: "A barista who makes coffees, hot chocolates, shakes and cheese toasties for students and teachers. Gives me the ability to work in a fast-paced environment with a way of learning how to communicate and deliver products in a successful manner.",
    achievements: ["High-volume, fast-paced customer service in a school cafe setting", "Developed communication and product delivery skills"],
    tags: ["Customer Service", "F&B"],
  },
  {
    period: "2024", role: "Volunteer", company: "City2Surf",
    link: "https://city2surf.com.au/", location: "Sydney – In person",
    logo: IMG.city2Logo, siteImg: IMG.city2Site,
    summary: "Volunteering at City2Surf was an exhilarating experience which showed me people from all walks of life trying to do their best for charity and giving their all to run the best they can.",
    achievements: ["Supported runners and event operations across the course", "Contributed to one of Australia's largest charity fun runs"],
    tags: ["Charity", "Community", "Events"],
  },
];

const EDUCATION = [
  { school: "University of New South Wales", link: "#", role: "Bachelor of Computer Science / Law", period: "Future" },
  { school: "Blacktown Boys High School",    link: "#", role: "Student",                            period: "2020 – 2025" },
  { school: "Quakers Hill Public School",    link: "#", role: "Advanced & OC streams",              period: "2016 – 2022" },
];

const CERTIFICATES = [
  { name: "Chrome DevTools User",                                        issuer: "Google", year: "2026", link: "#" },
  { name: "DOM Detective",                                               issuer: "Google", year: "2026", link: "#" },
  { name: "Android Studio User",                                         issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Numerical Data",               issuer: "Google", year: "2025", link: "#" },
  { name: "Firebase Studio Developer Community",                         issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Classification",               issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Logistic Regression",         issuer: "Google", year: "2025", link: "#" },
  { name: "Machine Learning Crash Course: Linear Regression",           issuer: "Google", year: "2025", link: "#" },
  { name: "I/O 2025 – Registered",                                      issuer: "Google", year: "2025", link: "#" },
  { name: "Joined the Google Developer Program",                         issuer: "Google", year: "2025", link: "#" },
];

const REFERENCES = [
  {
    name: "Shuwei Guo", initials: "SG",
    text: "I am pleased to recommend Vatsal for his enthusiastic contributions to our team. He has demonstrated initiative by developing advertising plans for our social media platforms and participating in events, where he made valuable efforts to connect with key stakeholders. Additionally, Vatsal made creative contributions to our design team mascot during our branding discussions. His proactive attitude and willingness to support various aspects of our work have been appreciated.",
  },
  {
    name: "Aaron O'Meara", initials: "AO",
    text: "Vatsal played a key role in supporting the Team Alliance practice rooms at the 2025 FIRST® LEGO® League Asia Pacific Championships, ensuring teams adhered to scheduled time slots with 'gracious professionalism'. He also assisted with bump-out tasks, including rearranging furniture and maintaining clean, organised spaces. While encouraged to focus on his assigned responsibilities, he consistently demonstrated initiative and enthusiasm by seeking out additional ways to contribute throughout the day.",
  },
];

const SKILLS = [
  { name: "Google Dev Tools", icon: "🔧" }, { name: "Raycast",      icon: "⚡" },
  { name: "Notion",           icon: "📋" }, { name: "Arc Browser",  icon: "🌐" },
  { name: "VS Code",          icon: ">_" }, { name: "GitHub",       icon: "🐙" },
  { name: "Shapr3D",          icon: "🎨" }, { name: "ChatGPT",      icon: "🤖" },
  { name: "Kaggle",           icon: "📊" }, { name: "Python",       icon: "🐍" },
  { name: "JavaScript",       icon: "𝐉𝐒"  }, { name: "React",       icon: "⚛"  },
  { name: "Git",              icon: "⎇"  }, { name: "Figma",        icon: "✏️" },
];

const GALLERY = [
  { label: "Campfire Hackathon",                    caption: "Building, hacking, and vibing — a night to remember.",              src: "/gallery/campfire.jpg"  },
  { label: "Fried Brothers with Friends",           caption: "Good food, great people. The crew at our favourite spot.",           src: "/gallery/fried1.jpg"    },
  { label: "Fried Brothers with Friends",           caption: "Neon lights and fries — peak dining experience.",                  src: "/gallery/fried2.jpg"    },
  { label: "Mock Trial vs James Ruse Ag HS",        caption: "Lost by 9 pts — but we held our own in the courtroom.",             src: "/gallery/mocktrial.jpg" },
  { label: "Comp Club UNSW AI Course",              caption: "Learning AI with the Competitive Programming Club at UNSW.",         src: "/gallery/compclub.jpg"  },
  { label: "UNSW AI Conference @ W Sydney",         caption: "The Darling Harbour view from the W Hotel.",                        src: "/gallery/unsw1.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",         caption: "Night view from the conference — Sydney city lit up.",               src: "/gallery/unsw2.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",         caption: "Sydney Harbour Bridge at night after the conference.",               src: "/gallery/unsw3.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",         caption: "Panel: NAIC, Future Government, AMP CTO, UNSW AI Director.",        src: "/gallery/unsw4.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",         caption: "Post-conference gelato run — well earned.",                          src: "/gallery/unsw5.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",         caption: "Sydney CBD at night from the rooftop.",                             src: "/gallery/unsw6.jpg"     },
  { label: "UNSW AI Conference @ W Sydney",         caption: "Inside the AI panel event at W Sydney Hotel.",                      src: "/gallery/unsw7.jpg"     },
  { label: "Scrapyard Hackathon",                   caption: "Hackathon, fun times, school spirit.",                              src: IMG.scrapyard1           },
  { label: "Multicultural Day",                     caption: "Explosion of culture, food, ethnicity.",                            src: IMG.scrapyard2           },
  { label: "Athletics Carnival",                    caption: "Sport, key event, great times, fun times.",                         src: IMG.athletics            },
];

const PROJECTS = [
  { label: "Flower Animation",   caption: "Flower animation for multimedia at 12 FPS",                                                       src: IMG.flowerVid  },
  { label: "Square to Triangle", caption: "Switching between two objects by combining opposite frames with creative liberty.",                src: IMG.squareVid  },
];

const CONNECT = [
  { label: "Discord",     val: "brain913",                     icon: "💬", href: "https://discord.com/users/767977600915734530" },
  { label: "WhatsApp",    val: "Vatsal Mehta",                 icon: "📱", href: "https://web.whatsapp.com/send/?phone=61493444893" },
  { label: "LinkedIn",    val: "Vatsal Mehta",                 icon: "💼", href: "https://linkedin.com/in/brain913" },
  { label: "Email",       val: "vatsalplayzforever@gmail.com", icon: "✉️", href: "mailto:vatsalplayzforever@gmail.com" },
  { label: "Book a Call", val: "cal.com",                      icon: "📅", href: "https://cal.com/brain913" },
];

const CMD_ITEMS = [
  { section: "Actions", label: "Print Resume", icon: "🖨",  hotkey: "Ctrl+P", action: () => window.print() },
  { section: "Social",  label: "LinkedIn",     icon: "💼",  hotkey: "Ctrl+L", action: () => window.open("https://linkedin.com/in/brain913","_blank") },
  { section: "Social",  label: "Email",        icon: "✉️",  hotkey: "Ctrl+E", action: () => { window.location.href="mailto:vatsalplayzforever@gmail.com"; } },
  { section: "Social",  label: "Instagram",    icon: "📸",  hotkey: "",       action: () => window.open("https://instagram.com/brain913","_blank") },
  { section: "Coding",  label: "GitHub",       icon: "🐙",  hotkey: "",       action: () => window.open("https://github.com/brain913","_blank") },
];

const TABS = ["Work Experience", "Education", "References", "Tech Stack", "Gallery", "Projects", "Connect"];
// Short labels for mobile bottom bar
const TAB_SHORT = { "Work Experience": "Work", "Education": "Edu", "References": "Refs", "Tech Stack": "Stack", "Gallery": "Gallery", "Projects": "Projects", "Connect": "Connect" };
const TAB_ICON  = { "Work Experience": "💼", "Education": "🎓", "References": "💬", "Tech Stack": "⚙️", "Gallery": "🌇", "Projects": "🎬", "Connect": "📡" };

/* ─── SHARED UI ───────────────────────────────────────────────── */
const Hr = () => <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0 18px" }} />;

function SectionHead({ children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'Lora',Georgia,serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 700, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>{children}</h2>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <div style={{ width: 28, height: 2, background: "var(--accent)", borderRadius: 2 }} />
        <div style={{ width: 10, height: 2, background: "var(--accent-dim-border)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

const Tag = ({ children }) => (
  <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "var(--accent-dim)", border: "1px solid var(--accent-dim-border)", color: "var(--accent)" }}>{children}</span>
);

/* ─── COMMAND PALETTE ─────────────────────────────────────────── */
function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { if (open) { setQuery(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);
  const filtered = CMD_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter")     { filtered[sel]?.action(); onClose(); }
      if (e.key === "Escape")    { onClose(); }
    };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, filtered, sel, onClose]);
  if (!open) return null;
  const sections = [...new Set(filtered.map(i => i.section))];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "10vh", padding: "10vh 16px 0" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 520, background: "#141a12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 14, opacity: 0.4 }}>🔍</span>
          <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setSel(0); }} placeholder="Search commands…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "var(--mono)", fontSize: 13, color: "#fff" }} />
          <kbd style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 6px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, color: "rgba(255,255,255,0.4)" }}>Esc</kbd>
        </div>
        <div style={{ maxHeight: 300, overflowY: "auto", padding: "8px 0" }}>
          {sections.map(sec => (
            <div key={sec}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", padding: "6px 16px 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{sec}</div>
              {filtered.filter(i => i.section === sec).map(item => {
                const gi = filtered.indexOf(item);
                return (
                  <div key={item.label} onClick={() => { item.action(); onClose(); }} onMouseEnter={() => setSel(gi)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", cursor: "pointer", background: sel === gi ? "rgba(255,255,255,0.06)" : "transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 14 }}>{item.icon}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{item.label}</span>
                    </div>
                    {item.hotkey && <kbd style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 6px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, color: "rgba(255,255,255,0.3)" }}>{item.hotkey}</kbd>}
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "20px 16px", textAlign: "center" }}>No results</div>}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "8px 16px", display: "flex", gap: 14 }}>
          {[["↩","select"],["↑↓","navigate"],["Esc","close"]].map(([k,v]) => (
            <span key={v} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <kbd style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "1px 5px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3, color: "rgba(255,255,255,0.35)" }}>{k}</kbd>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{v}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR CONTENT (shared between desktop sidebar & mobile drawer) ── */
function SidebarContent({ theme, setTheme, onCmdOpen, onClose }) {
  const typed = useTyping(TYPING);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "36px 24px 100px" }}>
      {/* Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 60, height: 60, borderRadius: 14, overflow: "hidden", flexShrink: 0, border: "1px solid var(--accent-dim-border)", boxShadow: "0 0 20px var(--accent-glow)" }}>
          <img src={IMG.profile} alt="Vatsal Mehta" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <h1 style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>Vatsal Mehta</h1>
          <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)", margin: "0 0 3px" }}>Student · Blacktown Boys HS</p>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>📍 Blacktown, NSW, AU</span>
        </div>
      </div>

      <Hr />

      {/* About */}
      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>About</p>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>
          I'm currently <span style={{ color: "var(--accent)" }}>{typed}</span>
          <span style={{ display: "inline-block", width: "1.5px", height: "0.9em", background: "var(--accent)", animation: "blink 1s step-end infinite", verticalAlign: "middle", marginLeft: 1 }} />
        </p>
        <p style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,0.28)", lineHeight: 1.7, marginTop: 8 }}>
          I bring a growth mindset, adaptability, and a commitment to achieve my goals. My goal is to add value through dedication, communication and results which speak for themselves.
        </p>
      </div>

      <Hr />

      {/* Stats */}
      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Activity</p>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{s.sub}</div>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid var(--accent-dim-border)", padding: "1px 6px", borderRadius: 4 }}>{s.val}</span>
          </div>
        ))}
        <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>* Updated 2025</p>
      </div>

      <Hr />

      {/* Theme */}
      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Theme</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(THEMES).map(([key, val]) => (
            <button key={key} onClick={() => setTheme(key)} title={key}
              style={{ width: 22, height: 22, borderRadius: "50%", border: "none", cursor: "pointer", background: val.accent, outline: theme === key ? `2px solid ${val.accent}` : "2px solid transparent", outlineOffset: 2, transition: "outline 0.15s" }} />
          ))}
        </div>
      </div>

      <Hr />

      {/* Links */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Links</p>
        {[{ label: "LinkedIn", href: "https://linkedin.com/in/brain913", icon: "💼" }, { label: "Email", href: "mailto:vatsalplayzforever@gmail.com", icon: "✉️" }].map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
          >{l.icon} {l.label}</a>
        ))}
      </div>

      <button onClick={onCmdOpen}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 14px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
        ⌘ Press Cmd + K
      </button>
    </div>
  );
}

/* ─── DESKTOP SIDEBAR ─────────────────────────────────────────── */
function Sidebar({ theme, setTheme, onCmdOpen }) {
  return (
    <aside style={{ position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
      <SidebarContent theme={theme} setTheme={setTheme} onCmdOpen={onCmdOpen} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, #0c0f0a, transparent)", pointerEvents: "none" }} />
    </aside>
  );
}

/* ─── MOBILE DRAWER ───────────────────────────────────────────── */
function MobileDrawer({ open, onClose, theme, setTheme, onCmdOpen }) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.25s" }} />
      {/* Panel */}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 201, width: "80vw", maxWidth: 300, background: "#0f1410", borderRight: "1px solid rgba(255,255,255,0.1)", overflowY: "auto", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 16px 0" }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "rgba(255,255,255,0.5)" }}>✕</button>
        </div>
        <SidebarContent theme={theme} setTheme={setTheme} onCmdOpen={() => { onClose(); onCmdOpen(); }} />
      </div>
    </>
  );
}

/* ─── MOBILE HEADER ───────────────────────────────────────────── */
function MobileHeader({ onMenuOpen, onCmdOpen }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(12,15,10,0.95)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <button onClick={onMenuOpen} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ display: "block", width: 18, height: 1.5, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
        <span style={{ display: "block", width: 14, height: 1.5, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
        <span style={{ display: "block", width: 18, height: 1.5, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", border: "1px solid var(--accent-dim-border)" }}>
          <img src={IMG.profile} alt="Vatsal" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <span style={{ fontFamily: "'Lora',serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>Vatsal Mehta</span>
      </div>

      <button onClick={onCmdOpen} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>⌘K</button>
    </header>
  );
}

/* ─── DESKTOP NAV ─────────────────────────────────────────────── */
function DesktopNav({ active, setActive }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", overflowX: "auto", background: "rgba(12,15,10,0.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", scrollbarWidth: "none" }}>
      {TABS.map(tab => (
        <button key={tab} onClick={() => setActive(tab)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 13px", fontFamily: "var(--mono)", fontSize: 11, color: active === tab ? "var(--accent)" : "rgba(255,255,255,0.35)", borderBottom: active === tab ? "2px solid var(--accent)" : "2px solid transparent", marginBottom: -1, transition: "all 0.15s", whiteSpace: "nowrap" }}
          onMouseEnter={e => { if (active !== tab) e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          onMouseLeave={e => { if (active !== tab) e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
        >{tab}</button>
      ))}
    </nav>
  );
}

/* ─── MOBILE BOTTOM TAB BAR ───────────────────────────────────── */
function MobileTabBar({ active, setActive }) {
  // Show only first 5 tabs to avoid overflow; rest accessible via scroll
  const visible = TABS.slice(0, 5);
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, display: "flex", background: "rgba(10,13,9,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
      {visible.map(tab => (
        <button key={tab} onClick={() => setActive(tab)}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px 6px", background: "none", border: "none", cursor: "pointer", transition: "all 0.15s" }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{TAB_ICON[tab]}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: active === tab ? "var(--accent)" : "rgba(255,255,255,0.3)", transition: "color 0.15s" }}>{TAB_SHORT[tab]}</span>
          {active === tab && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", marginTop: -2 }} />}
        </button>
      ))}
      {/* "More" button for remaining tabs */}
      <MobileMoreMenu active={active} setActive={setActive} />
    </nav>
  );
}

function MobileMoreMenu({ active, setActive }) {
  const [open, setOpen] = useState(false);
  const rest = TABS.slice(5);
  return (
    <div style={{ flex: 1, position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px 6px", background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontSize: 18 }}>•••</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>More</span>
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "100%", right: 0, background: "#141a12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", width: 140, marginBottom: 4 }}>
          {rest.map(tab => (
            <button key={tab} onClick={() => { setActive(tab); setOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: active === tab ? "rgba(255,255,255,0.06)" : "none", border: "none", cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>{TAB_ICON[tab]}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: active === tab ? "var(--accent)" : "rgba(255,255,255,0.6)" }}>{tab}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SECTION: WORK EXPERIENCE ────────────────────────────────── */
function WorkExperience() {
  const [open, setOpen] = useState({});
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? EXPERIENCE : EXPERIENCE.slice(0, 3);
  return (
    <section className="section-pad">
      <SectionHead>Experience</SectionHead>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {visible.map((exp, i) => (
          <li key={i} className="exp-grid">
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", paddingTop: 3, lineHeight: 1.5 }}>{exp.period}</div>
            <div style={{ position: "relative", paddingLeft: 16, borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ position: "absolute", left: -4.5, top: 5, width: 8, height: 8, borderRadius: "50%", background: "#0c0f0a", border: "1.5px solid var(--accent)", boxShadow: "0 0 8px var(--accent-glow)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                <img src={exp.logo} alt={exp.company} style={{ width: 24, height: 24, borderRadius: 5, objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }} />
                <h3 style={{ fontFamily: "var(--mono)", fontSize: "clamp(12px,2.5vw,14px)", color: "rgba(255,255,255,0.85)", margin: 0, fontWeight: 600, flexWrap: "wrap" }}>
                  {exp.role} <span style={{ color: "rgba(255,255,255,0.28)" }}>@</span>{" "}
                  <a href={exp.link} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >{exp.company} ↗</a>
                </h3>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>{exp.location}</div>
              <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 12, border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "16/7" }}>
                <img src={exp.siteImg} alt={exp.company} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Summary:</div>
                <p style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,11.5px)", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0 }}>{exp.summary}</p>
              </div>
              <div style={{ overflow: "hidden", maxHeight: open[i] ? 300 : 0, transition: "max-height 0.3s ease" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, marginTop: 8 }}>Achievements:</div>
                <ul style={{ margin: "0 0 8px 14px", padding: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                  {exp.achievements.map((a, ai) => <li key={ai} style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,11.5px)", color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}>{a}</li>)}
                </ul>
              </div>
              <button onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,0.3)", textDecoration: "underline", padding: "4px 0", marginBottom: 8, display: "block" }}>
                {open[i] ? "Show less ↑" : "Show more ↓"}
              </button>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {exp.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {EXPERIENCE.length > 3 && (
        <button onClick={() => setShowAll(s => !s)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "underline", padding: "4px 0" }}>
          {showAll ? "Show fewer experiences ↑" : "Show more experiences ↓"}
        </button>
      )}
    </section>
  );
}

/* ─── SECTION: EDUCATION ──────────────────────────────────────── */
function Education() {
  return (
    <section className="section-pad">
      <SectionHead>Education</SectionHead>
      {EDUCATION.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 18 }}>
          <span style={{ fontSize: 15, marginTop: 2, flexShrink: 0 }}>🎓</span>
          <div>
            <a href={e.link} target="_blank" rel="noreferrer"
              style={{ fontFamily: "var(--mono)", fontSize: "clamp(12px,2.5vw,14px)", color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={ev => ev.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={ev => ev.currentTarget.style.color = "rgba(255,255,255,0.85)"}
            >{e.school}</a>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{e.role}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{e.period}</div>
          </div>
        </div>
      ))}
      <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "20px 0 14px" }}>Certificates</div>
      {CERTIFICATES.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 13, marginTop: 2, flexShrink: 0 }}>📜</span>
          <div>
            <a href={c.link} target="_blank" rel="noreferrer"
              style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,13px)", color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
              onMouseEnter={ev => { ev.currentTarget.style.color = "var(--accent)"; ev.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={ev => { ev.currentTarget.style.color = "rgba(255,255,255,0.8)"; ev.currentTarget.style.textDecoration = "none"; }}
            >{c.name}</a>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{c.issuer} · {c.year}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ─── SECTION: REFERENCES ─────────────────────────────────────── */
function References() {
  return (
    <section className="section-pad">
      <SectionHead>References</SectionHead>
      {REFERENCES.map((r, i) => (
        <div key={i} style={{ padding: "22px 0", borderBottom: i < REFERENCES.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
          <div style={{ fontFamily: "'Lora',serif", fontSize: 32, color: "var(--accent-dim-border)", lineHeight: 0.7, marginBottom: 12 }}>"</div>
          <p style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,12px)", color: "rgba(255,255,255,0.38)", lineHeight: 1.85, margin: "0 0 16px", fontStyle: "italic" }}>{r.text}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent-dim)", border: "1px solid var(--accent-dim-border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>{r.initials}</div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{r.name}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ─── SECTION: TECH STACK ─────────────────────────────────────── */
function TechStack() {
  return (
    <section className="section-pad">
      <SectionHead>Tech Stack</SectionHead>
      <p style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,11.5px)", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Tools & technologies I use day-to-day</p>
      <div className="skill-grid">
        {SKILLS.map(s => (
          <div key={s.name}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", cursor: "default", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.borderColor = "var(--accent-dim-border)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>{s.icon}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "clamp(10px,2vw,12px)", color: "rgba(255,255,255,0.7)" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── SECTION: GALLERY ────────────────────────────────────────── */
function Gallery() {
  const groups = GALLERY.reduce((acc, item) => {
    if (!acc[item.label]) acc[item.label] = [];
    acc[item.label].push(item);
    return acc;
  }, {});
  const groupKeys = Object.keys(groups);

  const [cardIdx, setCardIdx] = useState(() =>
    Object.fromEntries(groupKeys.map(k => [k, 0]))
  );
  const [lb, setLb] = useState(null);

  // Cycle to next image on card click
  const handleCardClick = (label, items) => {
    if (items.length === 1) {
      setLb({ items, idx: 0 });
    } else {
      setCardIdx(prev => ({ ...prev, [label]: (prev[label] + 1) % items.length }));
    }
  };

  // Open lightbox at current index
  const openLightbox = (e, label, items) => {
    e.stopPropagation();
    setLb({ items, idx: cardIdx[label] || 0 });
  };

  // Navigate inside lightbox
  const lbNav = (dir) => {
    setLb(prev => ({ ...prev, idx: (prev.idx + dir + prev.items.length) % prev.items.length }));
  };

  return (
    <section className="section-pad">
      <SectionHead>Gallery</SectionHead>
      <p style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,11.5px)", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
        Day in the life <span style={{ color: "var(--accent)" }}>·</span> tap to cycle <span style={{ color: "var(--accent)" }}>·</span> ⛶ to expand
      </p>
      <div className="gallery-grid">
        {groupKeys.map((label) => {
          const items = groups[label];
          const idx = cardIdx[label] || 0;
          const current = items[idx];
          const isMulti = items.length > 1;
          return (
            <div key={label}
              onClick={() => handleCardClick(label, items)}
              style={{ borderRadius: 10, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "4/3", position: "relative", transition: "border-color 0.2s, transform 0.2s", userSelect: "none" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-dim-border)"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}
            >
              <img key={current.src} src={current.src} alt={current.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "imgFade 0.25s ease" }} />

              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)", pointerEvents: "none" }} />

              {/* Expand button — top-left */}
              <button
                onClick={(e) => openLightbox(e, label, items)}
                title="Open fullscreen"
                style={{
                  position: "absolute", top: 8, left: 8,
                  width: 26, height: 26, borderRadius: 6,
                  background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)", fontSize: 12,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  lineHeight: 1, transition: "background 0.15s",
                  zIndex: 2,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.8)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.55)"}
              >&#x26F6;</button>

              {/* Counter badge — top-right (only multi) */}
              {isMulti && (
                <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", borderRadius: 999, padding: "2px 8px", fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.85)", pointerEvents: "none", zIndex: 2 }}>
                  {idx + 1} / {items.length}
                </div>
              )}

              {/* Dot indicators */}
              {isMulti && (
                <div style={{ position: "absolute", top: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4, pointerEvents: "none", zIndex: 2 }}>
                  {items.map((_, di) => (
                    <div key={di} style={{ width: di === idx ? 14 : 5, height: 5, borderRadius: 999, background: di === idx ? "var(--accent)" : "rgba(255,255,255,0.3)", transition: "all 0.25s" }} />
                  ))}
                </div>
              )}

              {/* Label + caption */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px", pointerEvents: "none", zIndex: 2 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "#fff", fontWeight: 500, marginBottom: 2 }}>{label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{current.caption}</div>
              </div>

              {/* Next arrow hint */}
              {isMulti && (
                <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 22, color: "rgba(255,255,255,0.35)", pointerEvents: "none", fontWeight: 300, zIndex: 2 }}>&#8250;</div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Lightbox ── */}
      {lb && (
        <div
          onClick={() => setLb(null)}
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 740, width: "100%", background: "#141a12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", position: "relative" }}>

            {/* Image */}
            <div style={{ position: "relative" }}>
              <img key={lb.items[lb.idx].src} src={lb.items[lb.idx].src} alt={lb.items[lb.idx].label}
                style={{ width: "100%", display: "block", maxHeight: 460, objectFit: "cover", animation: "imgFade 0.2s ease" }} />

              {/* Prev / Next arrows inside lightbox */}
              {lb.items.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); lbNav(-1); }}
                    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    &#8249;
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); lbNav(1); }}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    &#8250;
                  </button>
                  {/* Dot strip */}
                  <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
                    {lb.items.map((_, di) => (
                      <div key={di} onClick={(e) => { e.stopPropagation(); setLb(prev => ({ ...prev, idx: di })); }}
                        style={{ width: di === lb.idx ? 18 : 6, height: 6, borderRadius: 999, background: di === lb.idx ? "var(--accent)" : "rgba(255,255,255,0.35)", transition: "all 0.25s", cursor: "pointer" }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Lora',serif", color: "#fff", fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                  {lb.items[lb.idx].label}
                  {lb.items.length > 1 && (
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid var(--accent-dim-border)", padding: "1px 7px", borderRadius: 999 }}>
                      {lb.idx + 1} / {lb.items.length}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lb.items[lb.idx].caption}</div>
              </div>
              <button onClick={() => setLb(null)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 12px", fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.5)", cursor: "pointer", flexShrink: 0, marginLeft: 12 }}>&#x2715;</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── SECTION: PROJECTS ───────────────────────────────────────── */
function Projects() {
  return (
    <section className="section-pad">
      <SectionHead>Projects</SectionHead>
      <p style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,11.5px)", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Creative & multimedia work</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {PROJECTS.map((p, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            <video src={p.src} autoPlay loop muted playsInline style={{ width: "100%", display: "block", maxHeight: 300, objectFit: "cover" }} />
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontFamily: "'Lora',serif", color: "#fff", fontSize: "clamp(13px,2.5vw,15px)", fontWeight: 600, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(10px,2vw,11.5px)", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>{p.caption}</div>
            </div>
          </div>
        ))}
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Scrapyard Hackathon</div>
          <p style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,11.5px)", color: "rgba(255,255,255,0.38)", marginBottom: 14 }}>Hackathon, fun times, school spirit.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[IMG.scrapyard1, IMG.scrapyard2].map((src, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                <img src={src} alt="Scrapyard" style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Athletics Carnival</div>
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
            <img src={IMG.athletics} alt="Athletics Carnival" style={{ width: "100%", display: "block", maxHeight: 260, objectFit: "cover" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION: CONNECT ────────────────────────────────────────── */
function Connect() {
  return (
    <section className="section-pad">
      <SectionHead>Connect</SectionHead>
      <p style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,11.5px)", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>My goal is to add value through dedication, communication and results which speak for themselves.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {CONNECT.map(c => (
          <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 8, textDecoration: "none", border: "1px solid transparent", background: "transparent", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.borderColor = "var(--accent-dim-border)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{c.icon}</div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,2vw,13px)", color: "rgba(255,255,255,0.8)" }}>{c.val}</div>
              </div>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 14, color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>→</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─── ROOT ────────────────────────────────────────────────────── */
const CONTENT = {
  "Work Experience": WorkExperience,
  "Education":       Education,
  "References":      References,
  "Tech Stack":      TechStack,
  "Gallery":         Gallery,
  "Projects":        Projects,
  "Connect":         Connect,
};

export default function Portfolio({ onToggle }) {
  const [active, setActive]     = useState("Work Experience");
  const [theme, setTheme]       = useState("green");
  const [cmdOpen, setCmdOpen]   = useState(false);
  const [drawerOpen, setDrawer] = useState(false);
  const isMobile = useIsMobile();
  const ActiveSection = CONTENT[active];
  const t = THEMES[theme];

  const openCmd  = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    const handler = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "k") { e.preventDefault(); setCmdOpen(o => !o); }
      if (cmdOpen) return;
      if (ctrl && e.key === "l") { e.preventDefault(); window.open("https://linkedin.com/in/brain913","_blank"); }
      if (ctrl && e.key === "e") { e.preventDefault(); window.location.href = "mailto:vatsalplayzforever@gmail.com"; }
      if (ctrl && e.key === "p") { e.preventDefault(); window.print(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cmdOpen]);

  // Close drawer on tab change (mobile)
  const handleTabChange = (tab) => { setActive(tab); setDrawer(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Fira+Code:wght@300;400;500;600&display=swap');
        :root {
          --accent: ${t.accent};
          --accent-rgb: ${t.accentRgb};
          --accent-dim: rgba(${t.accentRgb}, 0.12);
          --accent-dim-border: rgba(${t.accentRgb}, 0.22);
          --accent-glow: rgba(${t.accentRgb}, 0.2);
          --mono: 'Fira Code', 'Courier New', monospace;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0c0f0a; color: rgba(255,255,255,0.85); min-height: 100vh; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .slide-up { animation: slideUp 0.28s ease forwards; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(${t.accentRgb}, 0.15); border-radius: 3px; }
        aside::-webkit-scrollbar, nav::-webkit-scrollbar { display: none; }

        /* Responsive section padding */
        .section-pad { padding: clamp(20px, 5vw, 40px) clamp(16px, 4vw, 36px) 80px; }

        /* Experience grid: 2-col on desktop, stacked on mobile */
        .exp-grid { display: grid; grid-template-columns: 72px 1fr; gap: 16px; padding-bottom: 32px; }
        @media (max-width: 480px) {
          .exp-grid { grid-template-columns: 1fr; gap: 6px; }
          .exp-grid > div:first-child { color: rgba(255,255,255,0.25) !important; font-size: 10px; }
        }

        /* Skill grid */
        .skill-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
        @media (max-width: 480px) { .skill-grid { grid-template-columns: repeat(2, 1fr); } }

        /* Gallery grid */
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 32px; }
        @media (max-width: 480px) { .gallery-grid { grid-template-columns: 1fr 1fr; } }

        /* Desktop layout */
        .desktop-layout { display: grid; grid-template-columns: 260px 1fr; max-width: 1300px; margin: 0 auto; min-height: 100vh; }
        @media (max-width: 767px) { .desktop-layout { display: block; } }
        .desktop-sidebar { display: block; }
        @media (max-width: 767px) { .desktop-sidebar { display: none; } }
        .desktop-nav { display: flex; }
        @media (max-width: 767px) { .desktop-nav { display: none; } }
        .mobile-header { display: none; }
        @media (max-width: 767px) { .mobile-header { display: flex; } }
        .mobile-tabbar { display: none; }
        @media (max-width: 767px) { .mobile-tabbar { display: flex; } }

        @media print { canvas, nav, .mobile-tabbar, .mobile-header { display: none !important; } }
      `}</style>

      <PlumCanvas color={t.branch} />

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -120, left: "20%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, rgba(${t.accentRgb},0.05) 0%, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: 80, right: "5%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, rgba(${t.accentRgb},0.04) 0%, transparent 70%)` }} />
      </div>

      <CommandPalette open={cmdOpen} onClose={closeCmd} />

      {/* Mobile drawer */}
      <div className="mobile-tabbar" style={{ display: "none" }}>
        <MobileDrawer open={drawerOpen} onClose={() => setDrawer(false)} theme={theme} setTheme={setTheme} onCmdOpen={openCmd} />
      </div>
      {isMobile && <MobileDrawer open={drawerOpen} onClose={() => setDrawer(false)} theme={theme} setTheme={setTheme} onCmdOpen={openCmd} />}

      <div className="desktop-layout" style={{ position: "relative", zIndex: 1 }}>
        {/* Desktop sidebar */}
        <div className="desktop-sidebar">
          <Sidebar theme={theme} setTheme={setTheme} onCmdOpen={openCmd} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {/* Mobile header */}
          <div className="mobile-header">
            <MobileHeader onMenuOpen={() => setDrawer(true)} onCmdOpen={openCmd} />
          </div>

          {/* Desktop top nav */}
          <div className="desktop-nav">
            <DesktopNav active={active} setActive={setActive} />
          </div>

          <main key={active} className="slide-up" style={{ flex: 1 }}>
            <ActiveSection />
          </main>

          <div style={{ position: "sticky", bottom: 0, height: 80, background: "linear-gradient(to top, #0c0f0a, transparent)", pointerEvents: "none" }} />

          <footer style={{ padding: "12px clamp(16px,4vw,36px) clamp(80px,12vw,36px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Made with ❤️ & 👑 by Vatsal & Claude</span>
            <button onClick={openCmd} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>⌘K</button>
          </footer>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      {isMobile && <MobileTabBar active={active} setActive={handleTabChange} />}
      {/* Design toggle */}
      <button onClick={onToggle}
        style={{ position:"fixed", bottom: isMobile ? 90 : 28, right: 20, zIndex: 500,
          display:"flex", alignItems:"center", gap: 8, padding:"10px 18px",
          borderRadius: 999, background:"rgba(255,255,255,0.07)",
          backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
          border:"1px solid rgba(255,255,255,0.14)",
          boxShadow:"0 8px 24px rgba(0,0,0,0.35)",
          cursor:"pointer", fontFamily:"var(--mono)", fontSize: 12,
          color: "rgba(255,255,255,0.75)", transition:"all 0.2s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.13)";e.currentTarget.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.transform="none";}}
      >
        <span style={{fontSize:16}}>&#x2728;</span> Switch to Glass
      </button>
    </>
  );
}
