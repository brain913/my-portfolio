import { useState, useEffect, useRef, useCallback } from "react";

/* ─── TYPING HOOK ─────────────────────────────────────────────── */
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

/* ─── REAL ASSETS from brain913.framer.website ────────────────── */
const IMG = {
  profile:     "https://framerusercontent.com/images/756BTambj6zVcmmKE3LLaFxfu8Q.jpg?lossless=1",
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
};

/* ─── DATA ────────────────────────────────────────────────────── */
const TYPING = [
  "exploring technology & finance.",
  "thinking about good food and art.",
  "preparing myself for what's next.",
  "balancing academics & extracurriculars.",
];

const STATS = [
  { label: "AccelRT",        sub: "Non-profit",  val: "Active"    },
  { label: "FiRST Robotics", sub: "APOC",        val: "Competed"  },
  { label: "BBHS Cafe",      sub: "Barista",     val: "Active"    },
  { label: "City2Surf",      sub: "Volunteer",   val: "Completed" },
];

const EXPERIENCE = [
  {
    period: "2024 – 2025",
    role: "Volunteer",
    company: "AccelRT",
    link: "https://accelrt-v2.vercel.app/",
    location: "Sydney – Hybrid",
    logo: IMG.accelrtLogo,
    siteImg: IMG.accelrtSite,
    summary: "Work at AccelRT, a non-profit dedicated to creating and organising Hackathons for students in Australia. This gives me the ability to put volunteering and the ability to work in a formal but work from home environment. All of our spending is visible through Hack Club Bank.",
    achievements: [
      "Organised hackathon events connecting students with industry across Australia",
      "Managed event logistics and participant communication end-to-end",
      "All spending is transparently tracked through Hack Club Bank",
    ],
    tags: ["Events", "Community", "Leadership"],
  },
  {
    period: "2024",
    role: "Table Reset Volunteer",
    company: "FIRST Robotics",
    link: "https://www.firstlegoleague.org/",
    location: "Sydney – In person",
    logo: IMG.roboticsLogo,
    siteImg: IMG.roboticsSite,
    summary: "Volunteered at FIRST Robotics, Asia Pacific Open Championship (APOC) with a table reset role which taught me how to work in a fast-paced timed environment.",
    achievements: [
      "Managed fast-paced timed table resets across all competition rounds",
      "Collaborated with international teams at the Asia Pacific Open Championship",
    ],
    tags: ["Robotics", "STEM", "Teamwork"],
  },
  {
    period: "2023 – 2025",
    role: "Barista",
    company: "BBHS Cafe",
    link: "#",
    location: "Blacktown, NSW",
    logo: IMG.cafeLogo,
    siteImg: IMG.cafeSite,
    summary: "A barista who makes coffees, hot chocolates, shakes and cheese toasties for students and teachers. Gives me the ability to work in a fast-paced environment with a way of learning how to communicate and deliver products in a successful manner.",
    achievements: [
      "High-volume, fast-paced customer service in a school cafe setting",
      "Developed communication and product delivery skills",
    ],
    tags: ["Customer Service", "F&B"],
  },
  {
    period: "2024",
    role: "Volunteer",
    company: "City2Surf",
    link: "https://city2surf.com.au/",
    location: "Sydney – In person",
    logo: IMG.city2Logo,
    siteImg: IMG.city2Site,
    summary: "Volunteering at City2Surf was an exhilarating experience which showed me people from all walks of life trying to do their best for charity and giving their all to run the best they can.",
    achievements: [
      "Supported runners and event operations across the course",
      "Contributed to one of Australia's largest charity fun runs",
    ],
    tags: ["Charity", "Community", "Events"],
  },
];

const EDUCATION = [
  { school: "Blacktown Boys High School", link: "#", role: "Student", period: "2020 – 2025" },
];

const CERTIFICATES = [
  { name: "Google Developer Student Clubs", issuer: "Google", year: "2024", link: "#" },
  { name: "Introduction to Cybersecurity",  issuer: "Cisco NetAcad", year: "2024", link: "#" },
];

const REFERENCES = [
  {
    name: "Shuwei Guo", initials: "SG",
    text: "I am pleased to recommend Vatsal for his enthusiastic contributions to our team. He has demonstrated initiative by developing advertising plans for our social media platforms and participating in events, where he made valuable efforts to connect with key stakeholders. Additionally, Vatsal made creative contributions to our design team mascot during our branding discussions. His proactive attitude and willingness to support various aspects of our work have been appreciated.",
  },
  {
    name: "Aaron O'Meara", initials: "AO",
    text: "Vatsal played a key role in supporting the Team Alliance practice rooms at the 2025 FIRST® LEGO® League Asia Pacific Championships, ensuring teams adhered to scheduled time slots with 'gracious professionalism'. He also assisted with bump-out tasks, including rearranging furniture and maintaining clean, organised spaces. While encouraged to focus on his assigned responsibilities, he consistently demonstrated initiative and enthusiasm by seeking out additional ways to contribute throughout the day — a true example of the collaborative spirit that powers FIRST® events in Australia and across the world",
  },
];

const SKILLS = [
  { name: "Google Developer Tools", icon: "🔧" },
  { name: "Raycast",                icon: "⚡" },
  { name: "Notion",                 icon: "📋" },
  { name: "Arc Browser",            icon: "🌐" },
  { name: "VS Code",                icon: ">_" },
  { name: "GitHub",                 icon: "🐙" },
  { name: "Shapr3D",                icon: "🎨" },
  { name: "ChatGPT",                icon: "🤖" },
  { name: "Kaggle",                 icon: "📊" },
  { name: "Python",                 icon: "🐍" },
  { name: "JavaScript",             icon: "𝐉𝐒" },
  { name: "React",                  icon: "⚛"  },
  { name: "Git",                    icon: "⎇"  },
  { name: "Figma",                  icon: "✏️" },
];

const GALLERY = [
  { type: "image", label: "Scrapyard Hackathon", caption: "Hackathon, fun times, school spirit.", src: IMG.scrapyard1 },
  { type: "image", label: "Multicultural Day", caption: "Explosion of culture, food, ethnicity.", src: IMG.scrapyard2 },
  { type: "image", label: "Athletics Carnival",  caption: "Sport, key event, great times, fun times.", src: IMG.athletics },
];

const PROJECTS = [
  {
    type: "video",
    label: "Flower Animation",
    caption: "Flower animation for multimedia at 12 FPS",
    src: IMG.flowerVid,
  },
  {
    type: "video",
    label: "Square to Triangle",
    caption: "Switching between two objects by combining opposite frames with creative liberty.",
    src: IMG.squareVid,
  },
];

const CONNECT = [
  { label: "Discord",     val: "brain913",                       icon: "💬", href: "https://discord.com/users/767977600915734530" },
  { label: "WhatsApp",    val: "Vatsal Mehta",                   icon: "📱", href: "https://web.whatsapp.com/send/?phone=61493444893&text&type=phone_number&app_absent=0" },
  { label: "LinkedIn",    val: "Vatsal Mehta",                   icon: "💼", href: "https://linkedin.com/in/brain913" },
  { label: "Email",       val: "vatsalplayzforever@gmail.com",   icon: "✉️", href: "mailto:vatsalplayzforever@gmail.com" },
  { label: "Book a Call", val: "cal.com",                        icon: "📅", href: "https://cal.com/brain913" },
];

const CMD_ITEMS = [
  { section: "Actions", label: "Print Resume",  icon: "🖨",  hotkey: "Ctrl+P", action: () => window.print() },
  { section: "Social",  label: "LinkedIn",      icon: "💼",  hotkey: "Ctrl+L", action: () => window.open("https://linkedin.com/in/brain913","_blank") },
  { section: "Social",  label: "Email",         icon: "✉️",  hotkey: "Ctrl+E", action: () => { window.location.href="mailto:vatsalplayzforever@gmail.com"; } },
  { section: "Social",  label: "Instagram",       icon: "🅾",  hotkey: "",       action: () => window.open("https://instagram.com/u/brain913","_blank") },
  { section: "Coding",  label: "GitHub",     icon: "🏃",  hotkey: "",       action: () => window.open("https://github.com/brain913","_blank") },
];

/* ─── SHARED ──────────────────────────────────────────────────── */
const Hr = () => <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0 18px" }} />;

function SectionHead({ children }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <h2 style={{ fontFamily: "'Lora',Georgia,serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>{children}</h2>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <div style={{ width: 28, height: 2, background: "var(--accent)", borderRadius: 2 }} />
        <div style={{ width: 10, height: 2, background: "var(--accent-dim-border)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

const Tag = ({ children }) => (
  <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, padding: "2px 8px", borderRadius: 4, background: "var(--accent-dim)", border: "1px solid var(--accent-dim-border)", color: "var(--accent)" }}>{children}</span>
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
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 520, background: "#141a12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 14, opacity: 0.4 }}>🔍</span>
          <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setSel(0); }} placeholder="Search commands…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "var(--mono)", fontSize: 13, color: "#fff" }} />
          <kbd style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 6px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, color: "rgba(255,255,255,0.4)" }}>Esc</kbd>
        </div>
        <div style={{ maxHeight: 320, overflowY: "auto", padding: "8px 0" }}>
          {sections.map(sec => (
            <div key={sec}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", padding: "6px 16px 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{sec}</div>
              {filtered.filter(i => i.section === sec).map(item => {
                const gi = filtered.indexOf(item);
                return (
                  <div key={item.label} onClick={() => { item.action(); onClose(); }} onMouseEnter={() => setSel(gi)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", cursor: "pointer", background: sel === gi ? "rgba(255,255,255,0.06)" : "transparent", transition: "background 0.1s" }}>
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
          {filtered.length === 0 && <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "20px 16px", textAlign: "center" }}>No results for "{query}"</div>}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "8px 16px", display: "flex", gap: 16 }}>
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

/* ─── SIDEBAR ─────────────────────────────────────────────────── */
function Sidebar({ theme, setTheme, onCmdOpen }) {
  const typed = useTyping(TYPING);
  return (
    <aside style={{ position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden", padding: "36px 24px 80px", display: "flex", flexDirection: "column", gap: 20, borderRight: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Real profile photo */}
      <div style={{ position: "relative", width: 72, height: 72, borderRadius: 16, overflow: "hidden", flexShrink: 0, border: "1px solid var(--accent-dim-border)", boxShadow: "0 0 28px var(--accent-glow)" }}>
        <img src={IMG.profile} alt="Vatsal Mehta" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div>
        <h1 style={{ fontFamily: "'Lora',serif", fontSize: 21, fontWeight: 700, color: "#fff", margin: "0 0 3px", lineHeight: 1.2 }}>Vatsal Mehta</h1>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", margin: "0 0 5px" }}>Student · Blacktown Boys HS</p>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,0.3)" }}>📍 Blacktown, NSW, AU</span>
      </div>

      <Hr />

      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>About</p>
        <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>
          I'm currently <span style={{ color: "var(--accent)" }}>{typed}</span>
          <span style={{ display: "inline-block", width: "1.5px", height: "0.9em", background: "var(--accent)", animation: "blink 1s step-end infinite", verticalAlign: "middle", marginLeft: 1 }} />
        </p>
        <p style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,0.28)", lineHeight: 1.7, marginTop: 8 }}>
          I bring a growth mindset, adaptability, and a commitment to achieve my goals. My goal is to add value through dedication, communication and results which speak for themselves.
        </p>
      </div>

      <Hr />

      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Activity</p>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>{s.sub}</div>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid var(--accent-dim-border)", padding: "1px 7px", borderRadius: 4 }}>{s.val}</span>
          </div>
        ))}
        <p style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>* Updated 2025</p>
      </div>

      <Hr />

      {/* Theme dots */}
      <div>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Theme</p>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {Object.entries(THEMES).map(([key, val]) => (
            <button key={key} onClick={() => setTheme(key)} title={key}
              style={{ width: 18, height: 18, borderRadius: "50%", border: "none", cursor: "pointer", background: val.accent, outline: theme === key ? `2px solid ${val.accent}` : "2px solid transparent", outlineOffset: 2, transition: "outline 0.15s" }} />
          ))}
        </div>
      </div>

      <Hr />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Links</p>
        {[{ label: "LinkedIn", href: "https://linkedin.com/in/vatsal-mehta", icon: "💼" }, { label: "Email", href: "mailto:vatsalplayzforever@gmail.com", icon: "✉️" }].map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
          >{l.icon} {l.label}</a>
        ))}
      </div>

      <button onClick={onCmdOpen}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.3)", transition: "all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
      >⌘ Press Cmd + K</button>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, #0c0f0a, transparent)", pointerEvents: "none" }} />
    </aside>
  );
}

/* ─── NAV ─────────────────────────────────────────────────────── */
const TABS = ["Work Experience", "Education", "References", "Tech Stack", "Gallery", "Projects", "Connect"];

function NavBar({ active, setActive }) {
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

/* ─── WORK EXPERIENCE ─────────────────────────────────────────── */
function WorkExperience() {
  const [open, setOpen] = useState({});
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? EXPERIENCE : EXPERIENCE.slice(0, 3);
  return (
    <section style={{ padding: "36px 36px 64px" }}>
      <SectionHead>Experience</SectionHead>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {visible.map((exp, i) => (
          <li key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 18, paddingBottom: 36 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", paddingTop: 3, lineHeight: 1.5 }}>{exp.period}</div>
            <div style={{ position: "relative", paddingLeft: 18, borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ position: "absolute", left: -4.5, top: 5, width: 8, height: 8, borderRadius: "50%", background: "#0c0f0a", border: "1.5px solid var(--accent)", boxShadow: "0 0 8px var(--accent-glow)" }} />

              {/* Logo + title row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <img src={exp.logo} alt={exp.company} style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }} />
                <h3 style={{ fontFamily: "var(--mono)", fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0, fontWeight: 600 }}>
                  {exp.role} <span style={{ color: "rgba(255,255,255,0.28)" }}>@</span>{" "}
                  <a href={exp.link} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >{exp.company} ↗</a>
                </h3>
              </div>

              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>{exp.location}</div>

              {/* Site screenshot */}
              <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 12, border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "16/7" }}>
                <img src={exp.siteImg} alt={exp.company + " screenshot"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Summary:</div>
                <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0 }}>{exp.summary}</p>
              </div>

              <div style={{ overflow: "hidden", maxHeight: open[i] ? 300 : 0, transition: "max-height 0.3s ease" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, marginTop: 8 }}>Achievements:</div>
                <ul style={{ margin: "0 0 8px 14px", padding: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                  {exp.achievements.map((a, ai) => <li key={ai} style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}>{a}</li>)}
                </ul>
              </div>

              <button onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,0.3)", textDecoration: "underline", padding: 0, marginBottom: 8, transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
              >{open[i] ? "Show less ↑" : "Show more ↓"}</button>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {exp.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {EXPERIENCE.length > 3 && (
        <button onClick={() => setShowAll(s => !s)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "underline", padding: 0, transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
        >{showAll ? "Show fewer experiences ↑" : "Show more experiences ↓"}</button>
      )}
    </section>
  );
}

/* ─── EDUCATION ───────────────────────────────────────────────── */
function Education() {
  return (
    <section style={{ padding: "36px 36px 64px" }}>
      <SectionHead>Education</SectionHead>
      {EDUCATION.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 20 }}>
          <span style={{ fontSize: 16, marginTop: 2 }}>🎓</span>
          <div>
            <a href={e.link} target="_blank" rel="noreferrer"
              style={{ fontFamily: "var(--mono)", fontSize: 14, color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={ev => ev.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={ev => ev.currentTarget.style.color = "rgba(255,255,255,0.85)"}
            >{e.school}</a>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{e.role}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{e.period}</div>
          </div>
        </div>
      ))}
      <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "24px 0 14px" }}>Certificates</div>
      {CERTIFICATES.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
          <span style={{ fontSize: 15, marginTop: 1 }}>📜</span>
          <div>
            <a href={c.link} target="_blank" rel="noreferrer"
              style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
              onMouseEnter={ev => { ev.currentTarget.style.color = "var(--accent)"; ev.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={ev => { ev.currentTarget.style.color = "rgba(255,255,255,0.8)"; ev.currentTarget.style.textDecoration = "none"; }}
            >{c.name}</a>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{c.issuer} · {c.year}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ─── REFERENCES ──────────────────────────────────────────────── */
function References() {
  return (
    <section style={{ padding: "36px 36px 64px" }}>
      <SectionHead>References</SectionHead>
      {REFERENCES.map((r, i) => (
        <div key={i} style={{ padding: "24px 0", borderBottom: i < REFERENCES.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
          <div style={{ fontFamily: "'Lora',serif", fontSize: 34, color: "var(--accent-dim-border)", lineHeight: 0.7, marginBottom: 12 }}>"</div>
          <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.85, margin: "0 0 16px", fontStyle: "italic", maxWidth: 620 }}>{r.text}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-dim)", border: "1px solid var(--accent-dim-border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>{r.initials}</div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{r.name}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ─── TECH STACK ──────────────────────────────────────────────── */
function TechStack() {
  return (
    <section style={{ padding: "36px 36px 64px" }}>
      <SectionHead>Tech Stack</SectionHead>
      <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>Tools & technologies I use day-to-day</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 8 }}>
        {SKILLS.map(s => (
          <div key={s.name}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", cursor: "default", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.borderColor = "var(--accent-dim-border)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}
          >
            <span style={{ fontSize: 15 }}>{s.icon}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── GALLERY ─────────────────────────────────────────────────── */
function Gallery() {
  const [lb, setLb] = useState(null);
  return (
    <section style={{ padding: "36px 36px 64px" }}>
      <SectionHead>Gallery</SectionHead>
      <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>Day in the life</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 32 }}>
        {GALLERY.map((g, i) => (
          <div key={i} onClick={() => setLb(g)}
            style={{ borderRadius: 10, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "4/3", position: "relative", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-dim-border)"; e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}
          >
            <img src={g.src} alt={g.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", display: "flex", alignItems: "flex-end", padding: "10px 12px" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,0.8)" }}>{g.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lb && (
        <div onClick={() => setLb(null)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 700, width: "90%", background: "#141a12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden" }}>
            <img src={lb.src} alt={lb.label} style={{ width: "100%", display: "block", maxHeight: 450, objectFit: "cover" }} />
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Lora',serif", color: "#fff", fontSize: 15, marginBottom: 4 }}>{lb.label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{lb.caption}</div>
              </div>
              <button onClick={() => setLb(null)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 12px", fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>✕</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── PROJECTS (videos from portfolio page) ───────────────────── */
function Projects() {
  return (
    <section style={{ padding: "36px 36px 64px" }}>
      <SectionHead>Projects</SectionHead>
      <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>Creative & multimedia work</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {PROJECTS.map((p, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            <video src={p.src} autoPlay loop muted playsInline style={{ width: "100%", display: "block", maxHeight: 340, objectFit: "cover" }} />
            <div style={{ padding: "14px 18px" }}>
              <div style={{ fontFamily: "'Lora',serif", color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 5 }}>{p.label}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>{p.caption}</div>
            </div>
          </div>
        ))}

        {/* Scrapyard section from portfolio page */}
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Scrapyard Hackathon</div>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.38)", marginBottom: 16 }}>Hackathon, fun times, school spirit.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[IMG.scrapyard1, IMG.scrapyard2].map((src, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                <img src={src} alt="Scrapyard" style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Athletics Carnival</div>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.38)", marginBottom: 16 }}>Sport, key event, great times, fun times.</p>
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
            <img src={IMG.athletics} alt="Athletics Carnival" style={{ width: "100%", display: "block", maxHeight: 300, objectFit: "cover" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONNECT ─────────────────────────────────────────────────── */
function Connect() {
  return (
    <section style={{ padding: "36px 36px 64px" }}>
      <SectionHead>Connect</SectionHead>
      <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>My goal is to add value through dedication, communication and results which speak for themselves.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}>
        {CONNECT.map(c => (
          <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 8, textDecoration: "none", border: "1px solid transparent", background: "transparent", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.borderColor = "var(--accent-dim-border)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{c.icon}</div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{c.val}</div>
              </div>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 14, color: "rgba(255,255,255,0.2)" }}>→</span>
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

export default function Portfolio() {
  const [active, setActive]   = useState("Work Experience");
  const [theme, setTheme]     = useState("green");
  const [cmdOpen, setCmdOpen] = useState(false);
  const ActiveSection = CONTENT[active];
  const t = THEMES[theme];

  const openCmd  = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    const handler = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "k") { e.preventDefault(); setCmdOpen(o => !o); }
      if (cmdOpen) return;
      if (ctrl && e.key === "l") { e.preventDefault(); window.open("https://linkedin.com/in/vatsal-mehta","_blank"); }
      if (ctrl && e.key === "e") { e.preventDefault(); window.location.href = "mailto:vatsalplayzforever@gmail.com"; }
      if (ctrl && e.key === "p") { e.preventDefault(); window.print(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cmdOpen]);

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
        ::-webkit-scrollbar-thumb { background: rgba(var(--accent-rgb), 0.15); border-radius: 3px; }
        aside::-webkit-scrollbar, nav::-webkit-scrollbar { display: none; }
        @media print { canvas, nav { display: none !important; } }
      `}</style>

      <PlumCanvas color={t.branch} />

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -120, left: "20%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, rgba(${t.accentRgb},0.05) 0%, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: 80, right: "5%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, rgba(${t.accentRgb},0.04) 0%, transparent 70%)` }} />
      </div>

      <CommandPalette open={cmdOpen} onClose={closeCmd} />

      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "260px 1fr", maxWidth: 1300, margin: "0 auto", minHeight: "100vh" }}>
        <Sidebar theme={theme} setTheme={setTheme} onCmdOpen={openCmd} />

        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <NavBar active={active} setActive={setActive} />
          <main key={active} className="slide-up" style={{ flex: 1 }}><ActiveSection /></main>
          <div style={{ position: "sticky", bottom: 0, height: 80, background: "linear-gradient(to top, #0c0f0a, transparent)", pointerEvents: "none" }} />
          <footer style={{ padding: "14px 36px 32px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,0.2)" }}>© 2025 Vatsal Mehta · Blacktown, NSW</span>
            <button onClick={openCmd} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 4, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
            >⌘K — command palette</button>
          </footer>
        </div>
      </div>
    </>
  );
}
