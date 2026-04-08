import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { mkVariants, mkGestures, SP, EA, TR } from "./animations";
import { createTokens } from "./theme/tokens";
import {
  IMG, TYPING, STATS, EXPERIENCE, EDUCATION, CERTIFICATES,
  REFERENCES, SKILLS, GALLERY, PROJECTS, CONNECT, CMD_ITEMS,
  CONNECT_ICONS, CMD_ICON,
} from "./data/portfolioData";
import "./index.css";

/* ─── HOOKS ─────────────────────────────────────────────────────── */
function useTyping(strings, speed = 55, pause = 2000) {
  const [txt, setTxt] = useState(""); const [idx, setIdx] = useState(0);
  const [ch, setCh] = useState(0);   const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = strings[idx];
    const t = setTimeout(() => {
      if (!del && ch < cur.length)        { setCh(c => c + 1); setTxt(cur.slice(0, ch + 1)); }
      else if (!del && ch === cur.length)   setDel(true);
      else if (del && ch > 0)             { setCh(c => c - 1); setTxt(cur.slice(0, ch - 1)); }
      else                                { setDel(false); setIdx(i => (i + 1) % strings.length); }
    }, del ? speed / 2 : ch === cur.length ? pause : speed);
    return () => clearTimeout(t);
  }, [ch, del, idx, strings, speed, pause]);
  return txt;
}

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return m;
}

/* Focus trap hook - accessibility for modal dialogs */
function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const sel = 'button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const nodes = [...el.querySelectorAll(sel)];
    const first = nodes[0]; const last = nodes[nodes.length - 1];
    setTimeout(() => first?.focus(), 50);
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first?.focus(); } }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, [ref, active]);
}

/* ─── TOKEN ALIAS ────────────────────────────────────────────────── */
const T = createTokens;

/* ─── TAB CONFIG ─────────────────────────────────────────────────── */
const TABS = ["Overview", "Work Experience", "Education", "References", "Tech Stack", "Gallery", "Projects", "Connect"];
const TAB_S    = { "Overview": "Home", "Work Experience": "Work", "Education": "Edu", "References": "Refs", "Tech Stack": "Stack", "Gallery": "Gallery", "Projects": "Projects", "Connect": "Connect" };
const TAB_ICON = { "Overview": "house", "Work Experience": "bag", "Education": "grad", "References": "chat", "Tech Stack": "gear", "Gallery": "photo", "Projects": "film", "Connect": "wave" };
const TAB_EMOJI= { "Overview": "✦", "Work Experience": "💼", "Education": "🎓", "References": "💬", "Tech Stack": "⚙️", "Gallery": "🌇", "Projects": "🎬", "Connect": "📡" };

/* ─── BACKGROUND ─────────────────────────────────────────────────
   Reduced vs original: 2 blobs (down from 3), lower branch density,
   lower branch opacity - keeps signature feel without stacking noise.
─────────────────────────────────────────────────────────────────── */
function PlumCanvas({ color }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const PI = Math.PI, H = PI / 2, J = PI / 14;
    let w = window.innerWidth, h = window.innerHeight;
    c.width = w; c.height = h;
    const ctx = c.getContext("2d"); ctx.lineWidth = 1; ctx.strokeStyle = color;
    let q = [], p = [];
    const b = (x, y, a, d = { v: 0 }) => {
      if (x < -80 || x > w + 80 || y < -80 || y > h + 80) return; d.v++;
      const l = 5 + Math.random() * 4, nx = x + l * Math.cos(a), ny = y + l * Math.sin(a);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
      const g = d.v <= 22 ? 0.72 : 0.38;
      if (Math.random() < g) p.push(() => b(nx, ny, a + Math.random() * J, d));
      if (Math.random() < g) p.push(() => b(nx, ny, a - Math.random() * J, d));
    };
    const rn = () => 0.2 + Math.random() * 0.6;
    q = [() => b(rn() * w, -5, H), () => b(rn() * w, h + 5, -H)];
    if (w >= 600) { q.push(() => b(-5, rn() * h, 0)); q.push(() => b(w + 5, rn() * h, PI)); }
    let raf;
    const tick = () => { const cur = q; q = []; p = []; cur.forEach(fn => { Math.random() < 0.5 ? q.push(fn) : fn(); }); q.push(...p); if (q.length) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const resize = () => { cancelAnimationFrame(raf); ctx.clearRect(0, 0, w, h); w = window.innerWidth; h = window.innerHeight; c.width = w; c.height = h; ctx.lineWidth = 1; ctx.strokeStyle = color; q = [() => b(rn() * w, -5, H), () => b(rn() * w, h + 5, -H)]; raf = requestAnimationFrame(tick); };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [color]);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

function Background({ t }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: t.bg }} />
      <PlumCanvas color={t.branch} />
      {t.blobs.map((c, i) => (
        <div key={i} style={{ position: "fixed", zIndex: 0, pointerEvents: "none",
          ...([{ top: "-10%", left: "5%", width: "40%", height: "40%" }, { bottom: "3%", right: "3%", width: "28%", height: "28%" }][i]),
          borderRadius: "50%", background: `radial-gradient(circle,${c} 0%,transparent 70%)`, filter: "blur(80px)"
        }} />
      ))}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: t.dark ? 0.015 : 0.01,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "128px"
      }} />
    </>
  );
}

/* ─── GLASS CARD ─────────────────────────────────────────────────
   motion.div with whileHover/whileTap - zero React re-renders on hover.
   Framer drives animation directly on the DOM element.
─────────────────────────────────────────────────────────────────── */
function GlassCard({ children, style = {}, onClick, t, noHover = false }) {
  const r = useReducedMotion();
  return (
    <motion.div
      onClick={onClick}
      layout
      whileHover={(!noHover && !r) ? { y: -2, transition: { type: "spring", damping: 22, stiffness: 380 } } : {}}
      whileTap={(onClick && !r) ? { scale: 0.985, transition: { type: "spring", damping: 25, stiffness: 500 } } : {}}
      style={{
        background: t.glass, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur,
        border: `1px solid ${t.border}`, borderTop: `1.5px solid ${t.specular}`, borderLeft: `1.5px solid ${t.specularSide}`,
        boxShadow: t.shadow, borderRadius: t.r.lg, position: "relative", overflow: "hidden",
        cursor: onClick ? "pointer" : "default", ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: t.r.lg, background: "linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 55%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

/* ─── SHARED ATOMS ──────────────────────────────────────────────── */
const Pill = ({ children, t }) => (
  <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 9px", borderRadius: t.r.pill, background: t.accentPill, border: `1px solid ${t.accentBorder}`, color: t.accent, fontWeight: 600, letterSpacing: "0.02em" }}>
    {children}
  </span>
);

function SectionHead({ children, sub, t }) {
  const r = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, y: r ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: r ? 0 : 0.32, ease: EA.out }} style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(18px,3.5vw,24px)", fontWeight: 700, color: t.textPrimary, margin: "0 0 5px", letterSpacing: "-0.03em" }}>{children}</h2>
      {sub && <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: t.textTertiary, margin: "0 0 10px" }}>{sub}</p>}
      <div style={{ display: "flex", gap: 4 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: 28 }} transition={{ duration: r ? 0 : 0.4, delay: r ? 0 : 0.12, ease: EA.out }} style={{ height: 2.5, background: t.accent, borderRadius: t.r.pill }} />
        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 10, opacity: 1 }} transition={{ duration: r ? 0 : 0.3, delay: r ? 0 : 0.25, ease: EA.out }} style={{ height: 2.5, background: t.accentBorder, borderRadius: t.r.pill }} />
      </div>
    </motion.div>
  );
}

/* ─── THEME TOGGLE ───────────────────────────────────────────────
   AnimatePresence mode="wait": old icon exits fully before new one enters.
   Icon rotates out/in giving clear directional cue of the state change.
─────────────────────────────────────────────────────────────────── */
function ThemeToggle({ dark, setDark, t }) {
  const r = useReducedMotion();
  return (
    <motion.button
      onClick={() => setDark(d => !d)}
      title={dark ? "Switch to Light" : "Switch to Dark"}
      aria-label={dark ? "Switch to Light mode" : "Switch to Dark mode"}
      whileHover={r ? {} : { scale: 1.08 }}
      whileTap={r ? {} : { scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 400 }}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: t.r.pill, background: t.glass, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur, border: `1.5px solid ${t.specular}`, boxShadow: t.shadowCard, cursor: "pointer", fontSize: 17 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "sun" : "moon"}
          initial={r ? {} : { rotate: -25, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={r ? {} : { rotate: 25, opacity: 0, scale: 0.7 }}
          transition={TR.themeIcon(r)}
        >
          {dark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── COMMAND PALETTE ────────────────────────────────────────────
   AnimatePresence for backdrop fade + panel scale.
   Full dialog semantics: role, aria-modal, focus trap.
─────────────────────────────────────────────────────────────────── */
function CommandPalette({ open, onClose, t }) {
  const [q, setQ] = useState(""); const [sel, setSel] = useState(0);
  const inp = useRef(null); const panelRef = useRef(null);
  const r = useReducedMotion(); const V = mkVariants(r);
  useFocusTrap(panelRef, open);

  useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => inp.current?.focus(), 50); } }, [open]);

  const f = CMD_ITEMS.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, f.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter")     { f[sel]?.action(); onClose(); }
      if (e.key === "Escape")    { onClose(); }
    };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, f, sel, onClose]);

  const sections = [...new Set(f.map(i => i.section))];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmd-backdrop"
          variants={V.backdrop} initial="hidden" animate="show" exit="exit"
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "10vh 16px 0" }}
        >
          <motion.div
            key="cmd-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            variants={V.modal} initial="hidden" animate="show" exit="exit"
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 520, background: t.glass, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur, border: `1.5px solid ${t.specular}`, borderRadius: t.r.xl, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.12)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${t.borderLight}` }}>
              <span style={{ fontSize: 14, opacity: 0.45 }}>&#x1F50D;</span>
              <input
                ref={inp} value={q} onChange={e => { setQ(e.target.value); setSel(0); }}
                placeholder="Search commands..."
                aria-label="Search commands"
                style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "var(--mono)", fontSize: 13, color: t.textPrimary }}
              />
              <kbd style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 7px", border: `1px solid ${t.border}`, borderRadius: t.r.sm, color: t.textTertiary, background: t.accentDim }}>Esc</kbd>
            </div>
            <div style={{ maxHeight: 300, overflowY: "auto", padding: "6px 0" }}>
              {sections.map(sec => (
                <div key={sec}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: t.textTertiary, padding: "6px 16px 4px", textTransform: "uppercase", letterSpacing: "0.12em" }}>{sec}</div>
                  {f.filter(i => i.section === sec).map(item => {
                    const gi = f.indexOf(item);
                    return (
                      <motion.div
                        key={item.label}
                        onClick={() => { item.action(); onClose(); }}
                        onMouseEnter={() => setSel(gi)}
                        animate={{ background: sel === gi ? t.accentDim : "transparent" }}
                        transition={{ duration: 0.1 }}
                        role="option"
                        aria-selected={sel === gi}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === "Enter") { item.action(); onClose(); } }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", cursor: "pointer" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 14 }}>{CMD_ICON[item.icon] || item.icon}</span>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: t.textSecondary }}>{item.label}</span>
                        </div>
                        {item.hotkey && <kbd style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 6px", border: `1px solid ${t.border}`, borderRadius: 4, color: t.textTertiary }}>{item.hotkey}</kbd>}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
              {f.length === 0 && <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: t.textTertiary, padding: "20px 16px", textAlign: "center" }}>No results</div>}
            </div>
            <div style={{ borderTop: `1px solid ${t.borderLight}`, padding: "8px 16px", display: "flex", gap: 14 }}>
              {[["&#x21A9;", "select"], ["&#x2191;&#x2193;", "navigate"], ["Esc", "close"]].map(([k, v]) => (
                <span key={v} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <kbd style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "1px 5px", border: `1px solid ${t.border}`, borderRadius: 3, color: t.textTertiary }} dangerouslySetInnerHTML={{ __html: k }} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: t.textTertiary }}>{v}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── SIDEBAR CONTENT ────────────────────────────────────────────
   Staggered children via mkVariants(r).stagger + .item
   - Profile, about card, stats card, theme row, links, cmd-K
   Each staggers in 65ms after the previous one on mount.
─────────────────────────────────────────────────────────────────── */
function SidebarContent({ dark, setDark, onCmdOpen, t }) {
  const typed = useTyping(TYPING);
  const r = useReducedMotion(); const V = mkVariants(r);

  return (
    <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 17, padding: "32px 22px 100px" }}>

      {/* Profile */}
      <motion.div variants={V.item} style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <motion.div
          whileHover={r ? {} : { scale: 1.04 }}
          transition={{ type: "spring", damping: 20, stiffness: 350 }}
          style={{ width: 60, height: 60, borderRadius: t.r.md, overflow: "hidden", flexShrink: 0, border: `2px solid ${t.specular}`, boxShadow: t.shadowHov }}
        >
          <img src={IMG.profile} alt="Vatsal Mehta" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div>
          <h1 style={{ fontFamily: "var(--heading)", fontSize: 18, fontWeight: 800, color: t.textPrimary, margin: "0 0 4px", letterSpacing: "-0.025em" }}>Vatsal Mehta</h1>
          <Pill t={t}>Student &middot; BBHS</Pill>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: t.textTertiary, marginTop: 5 }}>&#x1F4CD; Blacktown, NSW, AU</div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div variants={V.item}>
        <GlassCard t={t} style={{ padding: "12px 14px" }} noHover>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>About</div>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: t.textSecondary, lineHeight: 1.75, margin: 0 }}>
            I'm currently <span style={{ color: t.accent }}>{typed}</span>
            <span style={{ display: "inline-block", width: "1.5px", height: "0.9em", background: t.accent, animation: "blink 1s step-end infinite", verticalAlign: "middle", marginLeft: 1, borderRadius: 1 }} />
          </p>
          <p style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: t.textTertiary, lineHeight: 1.7, marginTop: 7, marginBottom: 0 }}>
            Growth mindset, adaptability, and a commitment to achieve my goals &mdash; adding value through dedication and results.
          </p>
        </GlassCard>
      </motion.div>

      {/* Stats */}
      <motion.div variants={V.item}>
        <GlassCard t={t} style={{ padding: "12px 14px" }} noHover>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 9 }}>Activity</div>
          {STATS.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < STATS.length - 1 ? `1px solid ${t.borderLight}` : "none" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: t.textSecondary, fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.textTertiary }}>{s.sub}</div>
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: t.accent, background: t.accentPill, border: `1px solid ${t.accentBorder}`, padding: "2px 8px", borderRadius: t.r.pill, fontWeight: 700, flexShrink: 0, marginLeft: 6 }}>{s.val}</span>
            </div>
          ))}
          <p style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: t.textTertiary, marginTop: 5 }}>* Updated {new Date().getFullYear()}</p>
        </GlassCard>
      </motion.div>

      {/* Theme row */}
      <motion.div variants={V.item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em" }}>Appearance</div>
        <ThemeToggle dark={dark} setDark={setDark} t={t} />
      </motion.div>

      {/* Links */}
      <motion.div variants={V.item} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Links</div>
        {[{ label: "LinkedIn", href: "https://linkedin.com/in/brain913", emoji: "&#x1F4BC;" }, { label: "Email", href: "mailto:vatsalplayzforever@gmail.com", emoji: "&#x2709;&#xFE0F;" }].map(l => (
          <motion.a
            key={l.label} href={l.href} target="_blank" rel="noreferrer"
            whileHover={r ? {} : { y: -1, boxShadow: t.shadow }}
            whileTap={r ? {} : { scale: 0.97 }}
            transition={{ type: "spring", damping: 22, stiffness: 400 }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: t.r.md, background: t.accentDim, border: `1px solid ${t.accentBorder}`, textDecoration: "none", fontFamily: "var(--mono)", fontSize: 12, color: t.accent, fontWeight: 600 }}
          >
            <span dangerouslySetInnerHTML={{ __html: l.emoji }} /> {l.label}
          </motion.a>
        ))}
      </motion.div>

      {/* Cmd K */}
      <motion.div variants={V.item}>
        <motion.button
          onClick={onCmdOpen}
          whileHover={r ? {} : { boxShadow: t.shadowHov }}
          whileTap={r ? {} : { scale: 0.97 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", borderRadius: t.r.md, background: t.glass, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur, border: `1px solid ${t.border}`, cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, color: t.textTertiary, boxShadow: t.shadowCard, width: "100%" }}
        >
          &#x2318; Press Cmd + K
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ─── SIDEBAR / DRAWER / HEADER ─────────────────────────────────── */
function Sidebar({ dark, setDark, onCmdOpen, t }) {
  return (
    <aside aria-label="Profile and navigation" style={{ position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden", background: t.sidebarBg, backdropFilter: t.glassNav, WebkitBackdropFilter: t.glassNav, borderRight: `1px solid ${t.border}` }}>
      <SidebarContent dark={dark} setDark={setDark} onCmdOpen={onCmdOpen} t={t} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: t.footerFade, pointerEvents: "none" }} />
    </aside>
  );
}

function MobileDrawer({ open, onClose, dark, setDark, onCmdOpen, t }) {
  const r = useReducedMotion(); const V = mkVariants(r);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="drawer-bd" variants={V.backdrop} initial="hidden" animate="show" exit="exit" onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }} />
          <motion.div key="drawer-panel" role="dialog" aria-modal="true" aria-label="Profile menu"
            variants={V.drawer} initial="hidden" animate="show" exit="exit"
            style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 201, width: "82vw", maxWidth: 300, background: t.drawerBg, backdropFilter: t.glassNav, WebkitBackdropFilter: t.glassNav, borderRight: `1px solid ${t.border}`, overflowY: "auto", boxShadow: t.shadowHov }}>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 16px 0" }}>
              <motion.button onClick={onClose} aria-label="Close menu"
                whileHover={r ? {} : { scale: 1.05 }} whileTap={r ? {} : { scale: 0.93 }}
                style={{ background: t.glass, border: `1px solid ${t.border}`, borderRadius: t.r.md, width: 32, height: 32, cursor: "pointer", fontSize: 15, color: t.textSecondary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                &#x2715;
              </motion.button>
            </div>
            <SidebarContent dark={dark} setDark={setDark} onCmdOpen={() => { onClose(); onCmdOpen(); }} t={t} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MobileHeader({ onMenuOpen, onCmdOpen, dark, setDark, t }) {
  const r = useReducedMotion();
  return (
    <header role="banner" style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: t.navBg, backdropFilter: t.glassNav, WebkitBackdropFilter: t.glassNav, borderBottom: `1px solid ${t.border}` }}>
      <motion.button onClick={onMenuOpen} aria-label="Open menu" aria-expanded={false}
        whileHover={r ? {} : { scale: 1.04 }} whileTap={r ? {} : { scale: 0.94 }}
        style={{ background: t.glass, border: `1px solid ${t.border}`, borderRadius: t.r.sm, padding: "7px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
        {[18, 14, 18].map((w, i) => <span key={i} style={{ display: "block", width: w, height: 1.5, background: t.textSecondary, borderRadius: 2 }} />)}
      </motion.button>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: t.r.sm, overflow: "hidden", border: `1.5px solid ${t.border}` }}>
          <img src={IMG.profile} alt="Vatsal" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <span style={{ fontFamily: "var(--heading)", fontSize: 15, fontWeight: 700, color: t.textPrimary }}>Vatsal Mehta</span>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <ThemeToggle dark={dark} setDark={setDark} t={t} />
        <motion.button onClick={onCmdOpen} aria-label="Open command palette"
          whileHover={r ? {} : { scale: 1.04 }} whileTap={r ? {} : { scale: 0.94 }}
          style={{ background: t.glass, border: `1px solid ${t.border}`, borderRadius: t.r.sm, padding: "7px 10px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, color: t.textTertiary }}>
          &#x2318;K
        </motion.button>
      </div>
    </header>
  );
}

/* ─── DESKTOP NAV ────────────────────────────────────────────────
   layoutId="tab-indicator" - the underline slides between tabs using
   Framer FLIP. No manual x-position calculation needed.
─────────────────────────────────────────────────────────────────── */
function DesktopNav({ active, setActive, t }) {
  const r = useReducedMotion();
  return (
    <nav role="tablist" aria-label="Portfolio sections" style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", overflowX: "auto", background: t.navBg, backdropFilter: t.glassNav, WebkitBackdropFilter: t.glassNav, borderBottom: `1px solid ${t.border}`, padding: "0 20px", scrollbarWidth: "none" }}>
      {TABS.map(tab => (
        <motion.button
          key={tab}
          role="tab"
          aria-selected={active === tab}
          aria-controls={`panel-${tab}`}
          onClick={() => setActive(tab)}
          whileHover={r ? {} : { color: active === tab ? t.accent : t.textSecondary }}
          whileTap={r ? {} : { scale: 0.96 }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "13px 14px", fontFamily: "var(--mono)", fontSize: 11, color: active === tab ? t.accent : t.textTertiary, position: "relative", whiteSpace: "nowrap" }}
        >
          {tab}
          {active === tab && (
            <motion.div
              layoutId="tab-indicator"
              transition={TR.tabBar(r)}
              style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: t.accent, borderRadius: t.r.pill }}
            />
          )}
        </motion.button>
      ))}
    </nav>
  );
}

/* ─── MOBILE TAB BAR ─────────────────────────────────────────────
   layoutId="mobile-tab-dot" slides the dot between active tabs.
   Icons scale up with spring physics on selection.
─────────────────────────────────────────────────────────────────── */
function MobileMoreMenu({ active, setActive, t }) {
  const [open, setOpen] = useState(false);
  const r = useReducedMotion(); const V = mkVariants(r);
  const rest = TABS.slice(5);
  return (
    <div style={{ flex: 1, position: "relative" }}>
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label="More sections"
        aria-expanded={open}
        whileTap={r ? {} : { scale: 0.94 }}
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px 6px", background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontSize: 18 }}>&#x22EF;</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: rest.includes(active) ? t.accent : t.textTertiary }}>More</span>
        {rest.includes(active) && <div style={{ width: 4, height: 4, borderRadius: "50%", background: t.accent, marginTop: -2 }} />}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div key="more-menu" role="menu" variants={V.popup} initial="hidden" animate="show" exit="exit"
            style={{ position: "absolute", bottom: "100%", right: 0, background: t.moreMenuBg, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur, border: `1px solid ${t.border}`, borderRadius: t.r.lg, overflow: "hidden", boxShadow: t.shadowHov, minWidth: 140 }}>
            {rest.map(tab => (
              <motion.button key={tab} role="menuitem"
                onClick={() => { setActive(tab); setOpen(false); }}
                whileHover={r ? {} : { background: t.accentDim }}
                animate={{ background: active === tab ? t.accentDim : "transparent" }}
                transition={{ duration: 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 12, color: active === tab ? t.accent : t.textSecondary, textAlign: "left" }}>
                <span>{TAB_EMOJI[tab]}</span>{TAB_S[tab]}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileTabBar({ active, setActive, t }) {
  const r = useReducedMotion();
  return (
    <nav role="tablist" aria-label="Portfolio sections" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, display: "flex", background: t.navBg, backdropFilter: t.glassNav, WebkitBackdropFilter: t.glassNav, borderTop: `1px solid ${t.border}`, paddingBottom: "env(safe-area-inset-bottom,8px)" }}>
      {TABS.slice(0, 5).map(tab => (
        <motion.button key={tab} role="tab" aria-selected={active === tab}
          onClick={() => setActive(tab)}
          whileTap={r ? {} : { scale: 0.92 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px 6px", background: "none", border: "none", cursor: "pointer" }}>
          <motion.span
            animate={{ scale: active === tab ? (r ? 1 : 1.15) : 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 400 }}
            style={{ fontSize: 17, display: "block" }}>{TAB_EMOJI[tab]}</motion.span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: active === tab ? t.accent : t.textTertiary }}>{TAB_S[tab]}</span>
          <AnimatePresence>
            {active === tab && (
              <motion.div layoutId="mobile-tab-dot"
                initial={r ? {} : { scale: 0 }} animate={{ scale: 1 }} exit={r ? {} : { scale: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 400 }}
                style={{ width: 4, height: 4, borderRadius: "50%", background: t.accent, marginTop: -2 }} />
            )}
          </AnimatePresence>
        </motion.button>
      ))}
      <MobileMoreMenu active={active} setActive={setActive} t={t} />
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: OVERVIEW (Hero)
   Phase 2: editorial hero - identity + 2 CTAs + credibility row.
═══════════════════════════════════════════════════════════════ */
function Overview({ t, setActive }) {
  const r = useReducedMotion(); const V = mkVariants(r);
  const featured = EXPERIENCE.filter(e => e.featured);

  return (
    <section aria-label="Overview" style={{ padding: "clamp(32px,6vw,64px) clamp(16px,4vw,36px) 80px" }}>
      {/* Hero narrative */}
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ marginBottom: 56 }}>
        <motion.div variants={V.item}>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: t.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Vatsal Mehta &mdash; Student, Organiser</p>
        </motion.div>
        <motion.div variants={V.item}>
          <h1 style={{ fontFamily: "var(--heading)", fontSize: "clamp(32px,6vw,58px)", fontWeight: 800, color: t.textPrimary, lineHeight: 1.08, letterSpacing: "-0.04em", margin: "0 0 20px", maxWidth: 720 }}>
            Building things, learning fast, showing up.
          </h1>
        </motion.div>
        <motion.div variants={V.item}>
          <p style={{ fontFamily: "var(--sans)", fontSize: "clamp(14px,1.8vw,17px)", color: t.textSecondary, lineHeight: 1.7, maxWidth: 560, margin: "0 0 32px" }}>
            Year 11 at BBHS. I organise hackathons, compete in robotics, serve coffee, and explore technology &amp; finance. I care about doing things properly and adding real value.
          </p>
        </motion.div>
        {/* CTAs */}
        <motion.div variants={V.item} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <motion.button
            onClick={() => setActive("Connect")}
            whileHover={r ? {} : { y: -2, boxShadow: t.shadowHov }}
            whileTap={r ? {} : { scale: 0.97 }}
            transition={SP.snappy}
            style={{ padding: "12px 24px", borderRadius: t.r.pill, background: t.accent, border: "none", cursor: "pointer", fontFamily: "var(--heading)", fontSize: 14, fontWeight: 700, color: t.dark ? "#0f0e0c" : "#fff", boxShadow: t.shadow }}
          >Get in touch</motion.button>
          <motion.button
            onClick={() => setActive("Work Experience")}
            whileHover={r ? {} : { y: -2 }}
            whileTap={r ? {} : { scale: 0.97 }}
            transition={SP.snappy}
            style={{ padding: "12px 24px", borderRadius: t.r.pill, background: t.glass, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur, border: `1.5px solid ${t.specular}`, cursor: "pointer", fontFamily: "var(--heading)", fontSize: 14, fontWeight: 700, color: t.textPrimary, boxShadow: t.shadow }}
          >View work</motion.button>
        </motion.div>
      </motion.div>

      {/* Featured case-study strips */}
      <motion.div initial={{ opacity: 0, y: r ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: r ? 0 : 0.4, delay: r ? 0 : 0.3, ease: EA.out }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Featured work</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {featured.map((e, i) => {
            const logoSrc = t.dark && e.logoDark ? e.logoDark : e.logo;
            return (
              <GlassCard key={i} t={t} onClick={() => setActive("Work Experience")} style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "stretch" }}>
                  <div style={{ padding: "20px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <img src={logoSrc} alt={e.company} style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", border: `1px solid ${t.border}` }} onError={ev => ev.target.style.display = "none"} />
                      <div>
                        <div style={{ fontFamily: "var(--heading)", fontSize: 14, fontWeight: 700, color: t.textPrimary }}>{e.role}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: t.accent, fontWeight: 600 }}>{e.company}</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: t.textSecondary, lineHeight: 1.65, margin: "0 0 12px" }}>{e.summary}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {e.tags.map(tg => <Pill key={tg} t={t}>{tg}</Pill>)}
                    </div>
                  </div>
                  {e.impact && (
                    <div style={{ padding: "20px 20px 20px 0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", gap: 4, minWidth: 100, textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--heading)", fontSize: 20, fontWeight: 800, color: t.accent }}>{e.impact}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: t.textTertiary }}>{e.scope}</div>
                      <Pill t={t}>{e.period}</Pill>
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
        <motion.button
          onClick={() => setActive("Work Experience")}
          whileHover={r ? {} : { x: 4 }}
          whileTap={r ? {} : { scale: 0.97 }}
          style={{ marginTop: 14, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, color: t.accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, padding: 0 }}
        >
          See all experience &#x2192;
        </motion.button>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: WORK EXPERIENCE
   Featured case-study strips + compact timeline for secondary roles.
═══════════════════════════════════════════════════════════════ */
function WorkExperience({ t }) {
  const [exp, setExp] = useState(null);
  const r = useReducedMotion(); const V = mkVariants(r);
  const featured = EXPERIENCE.filter(e => e.featured);
  const timeline = EXPERIENCE.filter(e => !e.featured);

  return (
    <section aria-label="Work Experience" style={{ padding: "clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <SectionHead sub="Roles, volunteering, and community work" t={t}>Work Experience</SectionHead>

      {/* Featured case-study strips */}
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {featured.map((e, i) => {
          const isOpen = exp === i;
          const logoSrc = t.dark && e.logoDark ? e.logoDark : e.logo;
          return (
            <motion.div key={i} variants={V.item} layout>
              <GlassCard t={t} style={{ overflow: "hidden", padding: 0 }}>
                {/* Site image hero */}
                {e.siteImg && (
                  <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                    <img src={e.siteImg} alt={e.company} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 50%)" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 18, display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={logoSrc} alt={e.company} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", border: `2px solid rgba(255,255,255,0.85)` }} onError={ev => ev.target.style.display = "none"} />
                      <div>
                        <div style={{ fontFamily: "var(--heading)", fontSize: 15, fontWeight: 700, color: "#fff" }}>{e.role}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{e.company} &middot; {e.location}</div>
                      </div>
                    </div>
                    {e.impact && (
                      <div style={{ position: "absolute", top: 12, right: 14, textAlign: "right" }}>
                        <div style={{ fontFamily: "var(--heading)", fontSize: 20, fontWeight: 800, color: "#fff" }}>{e.impact}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "rgba(255,255,255,0.65)" }}>{e.scope}</div>
                      </div>
                    )}
                  </div>
                )}
                {/* Card body */}
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {e.tags.map(tg => <Pill key={tg} t={t}>{tg}</Pill>)}
                    </div>
                    <Pill t={t}>{e.period}</Pill>
                  </div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: t.textSecondary, lineHeight: 1.7, margin: "0 0 10px" }}>{e.summary}</p>

                  {/* Accordion detail */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div key="detail" variants={V.accordion} initial="hidden" animate="show" exit="exit" style={{ overflow: "hidden" }}>
                        <div style={{ paddingTop: 12, borderTop: `1px solid ${t.borderLight}`, marginTop: 4, marginBottom: 10 }}>
                          <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                            {e.achievements.map((a, j) => (
                              <motion.li key={j} initial={r ? {} : { opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: r ? 0 : 0.2, delay: j * 0.05 }}
                                style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: t.textSecondary, lineHeight: 1.6 }}>{a}</motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <a href={e.link} target="_blank" rel="noreferrer" onClick={ev => ev.stopPropagation()} style={{ fontFamily: "var(--mono)", fontSize: 11, color: t.accent, textDecoration: "none", fontWeight: 600 }}>{e.company} &#x2197;</a>
                    <motion.button
                      onClick={() => setExp(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      whileHover={r ? {} : { scale: 1.02 }}
                      style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: t.r.pill, padding: "4px 12px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, color: t.accent, display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={r ? { duration: 0 } : { type: "spring", damping: 22, stiffness: 350 }}>&#x203A;</motion.span>
                      {isOpen ? "Less" : "More"}
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Compact timeline for remaining roles */}
      {timeline.length > 0 && (
        <>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Additional roles</div>
          <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {timeline.map((e, i) => {
              const idx = featured.length + i;
              const isOpen = exp === idx;
              const logoSrc = t.dark && e.logoDark ? e.logoDark : e.logo;
              return (
                <motion.div key={i} variants={V.item} layout>
                  <GlassCard t={t} onClick={() => setExp(isOpen ? null : idx)} style={{ padding: "14px 18px", cursor: "pointer", borderRadius: i === 0 ? `${t.r.lg} ${t.r.lg} ${t.r.md} ${t.r.md}` : i === timeline.length - 1 ? `${t.r.md} ${t.r.md} ${t.r.lg} ${t.r.lg}` : t.r.md }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <img src={logoSrc} alt={e.company} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: `1px solid ${t.border}`, flexShrink: 0 }} onError={ev => ev.target.style.display = "none"} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontFamily: "var(--heading)", fontSize: 13, fontWeight: 700, color: t.textPrimary, marginBottom: 2 }}>{e.role}</div>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: t.accent, fontWeight: 600 }}>{e.company}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <Pill t={t}>{e.period}</Pill>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: t.textTertiary, marginTop: 3 }}>{e.location}</div>
                          </div>
                        </div>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div key="tl-body" variants={V.accordion} initial="hidden" animate="show" exit="exit" style={{ overflow: "hidden" }}>
                              <p style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: t.textSecondary, lineHeight: 1.68, margin: "10px 0 8px" }}>{e.summary}</p>
                              <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                                {e.achievements.map((a, j) => <li key={j} style={{ fontFamily: "var(--sans)", fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>{a}</li>)}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={r ? { duration: 0 } : { type: "spring", damping: 22, stiffness: 350 }} style={{ fontSize: 13, color: t.textTertiary, flexShrink: 0, marginTop: 2, display: "inline-block" }}>&#x203A;</motion.span>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: EDUCATION
═══════════════════════════════════════════════════════════════ */
function Education({ t }) {
  const r = useReducedMotion(); const V = mkVariants(r);
  return (
    <section aria-label="Education" style={{ padding: "clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <SectionHead sub="Academic background &amp; certifications" t={t}>Education</SectionHead>
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {EDUCATION.map((e, i) => (
          <motion.div key={i} variants={V.item}>
            <GlassCard t={t} style={{ padding: "15px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontFamily: "var(--heading)", fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 2 }}>{e.school}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: t.textSecondary }}>{e.role}</div>
                </div>
                <Pill t={t}>{e.period}</Pill>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
      <SectionHead sub="Google Developer Programme &amp; courses" t={t}>Certificates</SectionHead>
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column" }}>
        {CERTIFICATES.map((c, i) => (
          <motion.div key={i} variants={V.item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < CERTIFICATES.length - 1 ? `1px solid ${t.borderLight}` : "none", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12 }}>&#x1F393;</span>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: t.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: t.textTertiary }}>{c.issuer}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: t.accent, background: t.accentDim, padding: "1px 7px", borderRadius: t.r.pill }}>{c.year}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: REFERENCES
   Short quote preview + expand for full text.
═══════════════════════════════════════════════════════════════ */
function References({ t }) {
  const [expanded, setExpanded] = useState({});
  const r = useReducedMotion(); const V = mkVariants(r);
  return (
    <section aria-label="References" style={{ padding: "clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <SectionHead sub="What people say about working with me" t={t}>References</SectionHead>
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {REFERENCES.map((ref, i) => (
          <motion.div key={i} variants={V.item}>
            <GlassCard t={t} style={{ padding: "20px 22px" }}>
              {/* Short quote always visible */}
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: t.textSecondary, lineHeight: 1.72, fontStyle: "italic", margin: "0 0 10px" }}>
                &ldquo;{ref.short}&rdquo;
              </p>
              {/* Full text on expand */}
              <AnimatePresence initial={false}>
                {expanded[i] && (
                  <motion.div key="full" variants={V.accordion} initial="hidden" animate="show" exit="exit" style={{ overflow: "hidden" }}>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: t.textTertiary, lineHeight: 1.75, margin: "0 0 10px", fontStyle: "italic" }}>{ref.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.accentPill, border: `1.5px solid ${t.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: t.accent, flexShrink: 0 }}>{ref.initials}</div>
                  <div style={{ fontFamily: "var(--heading)", fontSize: 13, fontWeight: 700, color: t.textPrimary }}>{ref.name}</div>
                </div>
                <motion.button
                  onClick={() => setExpanded(p => ({ ...p, [i]: !p[i] }))}
                  aria-expanded={!!expanded[i]}
                  whileHover={r ? {} : { scale: 1.02 }}
                  style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: t.r.pill, padding: "4px 11px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, color: t.textTertiary }}
                >
                  {expanded[i] ? "Less" : "Full quote"}
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: TECH STACK
═══════════════════════════════════════════════════════════════ */
const SKILL_EMOJI = { "Google Dev Tools":"🔧","Raycast":"⚡","Notion":"📋","Arc Browser":"🌐","VS Code":">_","GitHub":"🐙","Shapr3D":"🎨","ChatGPT":"🤖","Kaggle":"📊","Python":"🐍","JavaScript":"JS","React":"⚛","Git":"⎇","Figma":"✏️" };

function TechStack({ t }) {
  const r = useReducedMotion(); const V = mkVariants(r);
  return (
    <section aria-label="Tech Stack" style={{ padding: "clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <SectionHead sub="Tools and languages I use daily" t={t}>Tech Stack</SectionHead>
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(138px,1fr))", gap: 10 }}>
        {SKILLS.map((s, i) => (
          <motion.div key={i} variants={V.item}>
            <GlassCard t={t} style={{ padding: "13px 15px" }}>
              <motion.div
                whileHover={r ? {} : { scale: 1.18, rotate: [-2, 2, 0] }}
                transition={{ type: "spring", damping: 18, stiffness: 380 }}
                style={{ fontFamily: "var(--mono)", fontSize: 18, marginBottom: 5, display: "inline-block" }}
              >
                {SKILL_EMOJI[s.name] || s.icon}
              </motion.div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: t.textSecondary, fontWeight: 500 }}>{s.name}</div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: GALLERY
   GalleryCard extracted as component (fixes useState-in-map bug).
   AnimatePresence mode="wait" for smooth image crossfades.
═══════════════════════════════════════════════════════════════ */
function GalleryCard({ label, items, onOpenLb, t }) {
  const [idx, setIdx] = useState(0);
  const r = useReducedMotion();
  const current = items[idx]; const isMulti = items.length > 1;

  return (
    <motion.div
      whileHover={r ? {} : { scale: 1.025, boxShadow: t.shadowHov }}
      whileTap={r ? {} : { scale: 0.985 }}
      transition={{ type: "spring", damping: 22, stiffness: 340 }}
      onClick={() => isMulti ? setIdx(i => (i + 1) % items.length) : onOpenLb(items, 0)}
      aria-label={isMulti ? `${label} - tap to cycle (${items.length} photos)` : `Open ${label}`}
      style={{ borderRadius: t.r.lg, overflow: "hidden", position: "relative", aspectRatio: "4/3", cursor: "pointer", boxShadow: t.shadow, border: `1px solid ${t.border}` }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={current.src}
          src={current.src} alt={label}
          initial={r ? {} : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={r ? {} : { opacity: 0 }}
          transition={TR.imgFade(r)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
        />
      </AnimatePresence>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)", pointerEvents: "none" }} />
      <motion.button
        onClick={e => { e.stopPropagation(); onOpenLb(items, idx); }}
        aria-label="Expand to fullscreen"
        whileHover={r ? {} : { scale: 1.08 }} whileTap={r ? {} : { scale: 0.92 }}
        style={{ position: "absolute", top: 7, left: 7, width: 26, height: 26, borderRadius: t.r.sm, background: "rgba(255,255,255,0.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", color: "#333", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        &#x26F6;
      </motion.button>
      {isMulti && (
        <>
          <div style={{ position: "absolute", top: 7, right: 7, background: "rgba(0,0,0,0.48)", backdropFilter: "blur(8px)", borderRadius: t.r.pill, padding: "2px 7px", fontFamily: "var(--mono)", fontSize: 9, color: "#fff", pointerEvents: "none" }}>{idx + 1}/{items.length}</div>
          <div style={{ position: "absolute", top: 7, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4, pointerEvents: "none" }}>
            {items.map((_, di) => (
              <motion.div key={di} animate={{ width: di === idx ? 13 : 5, background: di === idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.38)" }} transition={{ duration: 0.22, ease: EA.out }} style={{ height: 5, borderRadius: t.r.pill }} />
            ))}
          </div>
          <div style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "rgba(255,255,255,0.5)", pointerEvents: "none", fontWeight: 300 }}>&#x203A;</div>
        </>
      )}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 10px", pointerEvents: "none" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: "#fff", fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 9.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.4 }}>{current.caption}</div>
      </div>
    </motion.div>
  );
}

function Gallery({ t }) {
  const groups = {};
  GALLERY.forEach(item => { if (!groups[item.label]) groups[item.label] = []; groups[item.label].push(item); });
  const [lb, setLb] = useState(null); const [lbIdx, setLbIdx] = useState(0);
  const lbRef = useRef(null);
  const r = useReducedMotion(); const V = mkVariants(r);
  useFocusTrap(lbRef, !!lb);

  const openLb = (items, idx = 0) => { setLb(items); setLbIdx(idx); };
  const lbNav = useCallback(dir => setLbIdx(i => (i + dir + lb.length) % lb.length), [lb]);

  useEffect(() => {
    if (!lb) return;
    const h = (e) => { if (e.key === "ArrowLeft") lbNav(-1); if (e.key === "ArrowRight") lbNav(1); if (e.key === "Escape") setLb(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lb, lbNav]);

  return (
    <section aria-label="Gallery" style={{ padding: "clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <SectionHead sub="Moments, events and memories - tap to cycle, expand to fullscreen" t={t}>Gallery</SectionHead>
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(178px,1fr))", gap: 10, marginBottom: 32 }}>
        {Object.entries(groups).map(([label, items]) => (
          <motion.div key={label} variants={V.item}>
            <GalleryCard label={label} items={items} onOpenLb={openLb} t={t} />
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox with dialog semantics, focus trap, keyboard nav */}
      <AnimatePresence>
        {lb && (
          <motion.div key="lb-bd" variants={V.backdrop} initial="hidden" animate="show" exit="exit"
            onClick={() => setLb(null)}
            role="presentation"
            style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.div key="lb-panel" ref={lbRef} role="dialog" aria-modal="true" aria-label="Image lightbox"
              variants={V.modal} initial="hidden" animate="show" exit="exit"
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 740, width: "100%", background: t.glass, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur, border: `1.5px solid ${t.specular}`, borderRadius: t.r.xl, overflow: "hidden", boxShadow: t.shadowHov }}>
              <div style={{ position: "relative" }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img key={lb[lbIdx].src} src={lb[lbIdx].src} alt={lb[lbIdx].label}
                    initial={r ? {} : { opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={r ? {} : { opacity: 0 }}
                    transition={TR.imgFade(r)}
                    style={{ width: "100%", display: "block", maxHeight: 460, objectFit: "cover" }} />
                </AnimatePresence>
                {lb.length > 1 && [-1, 1].map(dir => (
                  <motion.button key={dir} onClick={e => { e.stopPropagation(); lbNav(dir); }}
                    aria-label={dir === -1 ? "Previous image" : "Next image"}
                    whileHover={r ? {} : { scale: 1.08, background: "rgba(255,255,255,0.92)" }}
                    whileTap={r ? {} : { scale: 0.92 }}
                    style={{ position: "absolute", [dir === -1 ? "left" : "right"]: 10, top: "50%", transform: "translateY(-50%)", width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.78)", backdropFilter: "blur(8px)", border: `1px solid ${t.border}`, color: t.textPrimary, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {dir === -1 ? "&#x2039;" : "&#x203A;"}
                  </motion.button>
                ))}
                {lb.length > 1 && (
                  <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
                    {lb.map((_, di) => (
                      <motion.div key={di} onClick={e => { e.stopPropagation(); setLbIdx(di); }}
                        animate={{ width: di === lbIdx ? 16 : 6, background: di === lbIdx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}
                        transition={{ duration: 0.22, ease: EA.out }}
                        style={{ height: 6, borderRadius: t.r.pill, cursor: "pointer" }} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "var(--heading)", color: t.textPrimary, fontSize: 14, fontWeight: 700, marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                    {lb[lbIdx].label}
                    {lb.length > 1 && <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: t.accent, background: t.accentDim, padding: "1px 7px", borderRadius: t.r.pill }}>{lbIdx + 1} / {lb.length}</span>}
                  </div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: t.textSecondary }}>{lb[lbIdx].caption}</div>
                </div>
                <motion.button onClick={() => setLb(null)} aria-label="Close lightbox"
                  whileHover={r ? {} : { scale: 1.05 }} whileTap={r ? {} : { scale: 0.93 }}
                  style={{ background: t.accentDim, border: `1px solid ${t.accentBorder}`, borderRadius: t.r.md, padding: "6px 14px", fontFamily: "var(--mono)", fontSize: 12, color: t.accent, cursor: "pointer", fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>
                  &#x2715;
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: PROJECTS
═══════════════════════════════════════════════════════════════ */
function Projects({ t }) {
  const r = useReducedMotion(); const V = mkVariants(r);
  return (
    <section aria-label="Projects" style={{ padding: "clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <SectionHead sub="Creative &amp; multimedia work" t={t}>Projects</SectionHead>
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {PROJECTS.map((p, i) => (
          <motion.div key={i} variants={V.item}>
            <GlassCard t={t} style={{ overflow: "hidden", padding: 0 }}>
              <video src={p.src} autoPlay loop muted playsInline style={{ width: "100%", display: "block", maxHeight: 280, objectFit: "cover" }} />
              <div style={{ padding: "14px 20px" }}>
                <div style={{ fontFamily: "var(--heading)", color: t.textPrimary, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 12.5, color: t.textSecondary, lineHeight: 1.6 }}>{p.caption}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: CONNECT
═══════════════════════════════════════════════════════════════ */
function Connect({ t }) {
  const r = useReducedMotion(); const V = mkVariants(r);
  return (
    <section aria-label="Connect" style={{ padding: "clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <SectionHead sub="My goal is to add value through dedication, communication and results." t={t}>Connect</SectionHead>
      <motion.div variants={V.stagger} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520 }}>
        {CONNECT.map(c => (
          <motion.div key={c.label} variants={V.item}>
            <motion.a
              href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              aria-label={`${c.label}: ${c.val}`}
              whileHover={r ? {} : { y: -3, boxShadow: t.shadowHov }}
              whileTap={r ? {} : { scale: 0.985 }}
              transition={{ type: "spring", damping: 22, stiffness: 380 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: t.r.lg, textDecoration: "none", background: t.glass, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur, border: `1px solid ${t.border}`, borderTop: `1.5px solid ${t.specular}`, boxShadow: t.shadowCard }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <motion.div whileHover={r ? {} : { scale: 1.12, rotate: [-4, 4, 0] }} transition={{ type: "spring", damping: 18, stiffness: 360 }}
                  style={{ width: 40, height: 40, borderRadius: t.r.md, flexShrink: 0, background: t.accentDim, border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  {CONNECT_ICONS[c.icon] || c.icon}
                </motion.div>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.textTertiary, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: t.textPrimary, fontWeight: 600 }}>{c.val}</div>
                </div>
              </div>
              <motion.span whileHover={r ? {} : { x: 3 }} transition={{ type: "spring", damping: 20, stiffness: 400 }} style={{ color: t.accent, fontSize: 18, fontWeight: 300 }}>&#x2192;</motion.span>
            </motion.a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT — Portfolio
═══════════════════════════════════════════════════════════════ */
const SECTIONS = {
  "Overview":        Overview,
  "Work Experience": WorkExperience,
  "Education":       Education,
  "References":      References,
  "Tech Stack":      TechStack,
  "Gallery":         Gallery,
  "Projects":        Projects,
  "Connect":         Connect,
};

export default function Portfolio() {
  const [dark, setDark]     = useState(true);
  const [active, setActive] = useState("Overview");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [drawer, setDrawer]   = useState(false);
  const isMobile = useIsMobile();
  const r = useReducedMotion();
  const tok = T(dark);
  const V = mkVariants(r);
  const Section = SECTIONS[active];

  /* Keep CSS focus-color var in sync with token */
  useEffect(() => { document.documentElement.style.setProperty("--focus-color", tok.focusColor); }, [tok.focusColor]);

  const openCmd  = useCallback(() => setCmdOpen(true),  []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    const h = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "k") { e.preventDefault(); setCmdOpen(o => !o); }
      if (cmdOpen) return;
      if (ctrl && e.key === "l") { e.preventDefault(); window.open("https://linkedin.com/in/brain913","_blank"); }
      if (ctrl && e.key === "e") { e.preventDefault(); window.location.href = "mailto:vatsalplayzforever@gmail.com"; }
      if (ctrl && e.key === "p") { e.preventDefault(); window.print(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [cmdOpen]);

  return (
    <>
      <style>{`html,body{background:${tok.bg};color:${tok.textPrimary};}`}</style>

      <Background t={tok} />
      <CommandPalette open={cmdOpen} onClose={closeCmd} t={tok} />
      {isMobile && <MobileDrawer open={drawer} onClose={() => setDrawer(false)} dark={dark} setDark={setDark} onCmdOpen={openCmd} t={tok} />}

      <div className="g-desktop" style={{ position: "relative", zIndex: 1, gridTemplateColumns: "260px 1fr", maxWidth: 1340, margin: "0 auto", minHeight: "100vh" }}>
        <div className="g-sidebar">
          <Sidebar dark={dark} setDark={setDark} onCmdOpen={openCmd} t={tok} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div className="g-mhdr">
            <MobileHeader onMenuOpen={() => setDrawer(true)} onCmdOpen={openCmd} dark={dark} setDark={setDark} t={tok} />
          </div>
          <div className="g-topnav">
            <DesktopNav active={active} setActive={setActive} t={tok} />
          </div>

          {/* AnimatePresence mode="wait" - outgoing section fully exits before incoming enters */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={active}
              id={`panel-${active}`}
              role="tabpanel"
              aria-label={active}
              initial={V.page.hidden}
              animate={V.page.show}
              exit={V.page.exit}
              style={{ flex: 1 }}
            >
              <Section t={tok} setActive={setActive} />
            </motion.main>
          </AnimatePresence>

          <div style={{ position: "sticky", bottom: 0, height: 80, background: tok.footerFade, pointerEvents: "none" }} />
          <footer role="contentinfo" style={{ padding: "12px clamp(16px,4vw,36px) clamp(72px,11vw,32px)", borderTop: `1px solid ${tok.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, background: tok.navBg, backdropFilter: tok.glassNav, WebkitBackdropFilter: tok.glassNav }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: tok.textTertiary }}>
              &copy; {new Date().getFullYear()} Vatsal Mehta &middot; Blacktown, NSW
            </span>
            <motion.button onClick={openCmd} aria-label="Open command palette"
              whileHover={r ? {} : { scale: 1.04 }} whileTap={r ? {} : { scale: 0.95 }}
              style={{ background: tok.glass, backdropFilter: tok.glassBlur, WebkitBackdropFilter: tok.glassBlur, border: `1px solid ${tok.border}`, borderRadius: tok.r.md, padding: "4px 10px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, color: tok.textTertiary }}>
              &#x2318;K
            </motion.button>
          </footer>
        </div>
      </div>

      {isMobile && <MobileTabBar active={active} setActive={tab => { setActive(tab); setDrawer(false); }} t={tok} />}
    </>
  );
}
