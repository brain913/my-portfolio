import { useState, useEffect, useRef, useCallback } from "react";

/* ─── shared hooks (same as original) ──────────────────────────── */
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
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => { const fn = () => setM(window.innerWidth < 768); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return m;
}

/* ─── DATA (identical to portfolio.jsx) ────────────────────────── */
const TYPING = ["exploring technology & finance.", "thinking about good food and art.", "preparing myself for what's next.", "balancing academics & extracurriculars."];
const IMG = {
  profile:"/gallery/profile_new.jpg",
  accelrtLogo:"https://framerusercontent.com/images/TSAli1ZEa27c4TP04Bm7UQIUQ.png?scale-down-to=512",
  accelrtSite:"https://framerusercontent.com/images/e0UVnUVjKLv5Ml8kJ5dRPMFf73Q.png",
  roboticsLogo:"https://framerusercontent.com/images/cuIo4eVBHbM00xXLX8JGOsgtUo.jpg?scale-down-to=512",
  roboticsSite:"https://framerusercontent.com/images/GChbrPKmHoUqbyTczTyy9OKupe4.jpg",
  cafeLogo:"https://framerusercontent.com/images/wVaWfn9GujVGnYPiHUz6qtusWaQ.jpg",
  cafeSite:"https://framerusercontent.com/images/VrerlOXUnIZtWILehqwd8HIhW54.jpg",
  city2Logo:"https://framerusercontent.com/images/rtNcXMSTJ0h0tvEy5ukgMpY68.png",
  city2Site:"https://framerusercontent.com/images/y3cKAV5jwOJGcb8wAzr95VJM49c.jpg",
  scrapyard1:"https://framerusercontent.com/images/zVJ0xEO14uoYedqzRcyE2u3LDBs.jpg?scale-down-to=1024",
  scrapyard2:"https://framerusercontent.com/images/sAPlOltwcpel7KaPCn3F0RwlEU.jpg?scale-down-to=1024",
  athletics:"https://framerusercontent.com/images/QUj5yg4QAZFH8t6eJb1SJCCE.png?scale-down-to=1024",
  flowerVid:"https://framerusercontent.com/assets/J9mOhxlb8oAWga9V9J7FMk7Y.mp4",
  daydreamPhoto: "https://framerusercontent.com/images/SzFUezPNJJVFtZO9J4QAIQBxI.jpeg?scale-down-to=2048&width=5712&height=4284",
  daydreamIcon: "https://daydream.hackclub.com/favicon.png",
  squareVid:"https://framerusercontent.com/assets/Xa80JloFiy8jFUQd7V9kAzma5L4.mp4",
};

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
  { period:"2025",         role:"Hackathon Organiser", company:"Hack Club",      link:"https://daydream.hackclub.com/sydney", location:"UNSW - In person", logo:IMG.daydreamIcon, siteImg:IMG.daydreamPhoto, summary:"Work at Hack Club, a non-profit dedicated to creating and organising Hackathons for students in Australia. This gives me the ability to put volunteering and the ability to work in a formal but work from home environment. All of our spending is visible through Hack Club Bank.", achievements:["Organised hackathon events connecting students with industry across Australia","Managed event logistics and participant communication end-to-end","All spending is transparently tracked through Hack Club Bank"], tags:["Events","Community","Leadership"] },
  { period:"2024 – 2025", role:"Volunteer",             company:"AccelRT",       link:"https://accelrt-v2.vercel.app/",        location:"Sydney – Hybrid",    logo:IMG.accelrtLogo,  siteImg:IMG.accelrtSite,  summary:"Work at AccelRT, a non-profit dedicated to creating and organising Hackathons for students in Australia. This gives me the ability to put volunteering and the ability to work in a formal but work from home environment. All of our spending is visible through Hack Club Bank.", achievements:["Organised hackathon events connecting students with industry across Australia","Managed event logistics and participant communication end-to-end","All spending is transparently tracked through Hack Club Bank"], tags:["Events","Community","Leadership"] },
  { period:"2024",         role:"Table Reset Volunteer", company:"FIRST Robotics",link:"https://www.firstlegoleague.org/",      location:"Sydney – In person", logo:IMG.roboticsLogo, siteImg:IMG.roboticsSite, summary:"Volunteered at FIRST Robotics, Asia Pacific Open Championship (APOC) with a table reset role which taught me how to work in a fast-paced timed environment.", achievements:["Managed fast-paced timed table resets across all competition rounds","Collaborated with international teams at the Asia Pacific Open Championship"], tags:["Robotics","STEM","Teamwork"] },
  { period:"2023 – 2025",  role:"Barista",               company:"BBHS Cafe",     link:"#",                                     location:"Blacktown, NSW",     logo:IMG.cafeLogo,     siteImg:IMG.cafeSite,     summary:"A barista who makes coffees, hot chocolates, shakes and cheese toasties for students and teachers. Gives me the ability to work in a fast-paced environment with a way of learning how to communicate and deliver products in a successful manner.", achievements:["High-volume, fast-paced customer service in a school cafe setting","Developed communication and product delivery skills"], tags:["Customer Service","F&B"] },
  { period:"2024",         role:"Volunteer",             company:"City2Surf",      link:"https://city2surf.com.au/",             location:"Sydney – In person", logo:IMG.city2Logo,    siteImg:IMG.city2Site,    summary:"Volunteering at City2Surf was an exhilarating experience which showed me people from all walks of life trying to do their best for charity and giving their all to run the best they can.", achievements:["Supported runners and event operations across the course","Contributed to one of Australia's largest charity fun runs"], tags:["Charity","Community","Events"] },
];
const EDUCATION = [
  { school:"University of New South Wales", link:"#", role:"Bachelor of Computer Science / Law", period:"Future"       },
  { school:"Blacktown Boys High School",    link:"#", role:"Student",                            period:"2020 – 2025"  },
  { school:"Quakers Hill Public School",    link:"#", role:"Advanced & OC streams",              period:"2016 – 2022"  },
];
const CERTIFICATES = [
  { name:"Chrome DevTools User",                                issuer:"Google", year:"2026", link:"#" },
  { name:"DOM Detective",                                       issuer:"Google", year:"2026", link:"#" },
  { name:"Android Studio User",                                 issuer:"Google", year:"2025", link:"#" },
  { name:"Machine Learning Crash Course: Numerical Data",       issuer:"Google", year:"2025", link:"#" },
  { name:"Firebase Studio Developer Community",                 issuer:"Google", year:"2025", link:"#" },
  { name:"Machine Learning Crash Course: Classification",       issuer:"Google", year:"2025", link:"#" },
  { name:"Machine Learning Crash Course: Logistic Regression",  issuer:"Google", year:"2025", link:"#" },
  { name:"Machine Learning Crash Course: Linear Regression",    issuer:"Google", year:"2025", link:"#" },
  { name:"I/O 2025 – Registered",                               issuer:"Google", year:"2025", link:"#" },
  { name:"Joined the Google Developer Program",                 issuer:"Google", year:"2025", link:"#" },
];
const REFERENCES = [
  { name:"Shuwei Guo",    initials:"SG", text:"I am pleased to recommend Vatsal for his enthusiastic contributions to our team. He has demonstrated initiative by developing advertising plans for our social media platforms and participating in events, where he made valuable efforts to connect with key stakeholders. Additionally, Vatsal made creative contributions to our design team mascot during our branding discussions. His proactive attitude and willingness to support various aspects of our work have been appreciated." },
  { name:"Aaron O'Meara", initials:"AO", text:"Vatsal played a key role in supporting the Team Alliance practice rooms at the 2025 FIRST® LEGO® League Asia Pacific Championships, ensuring teams adhered to scheduled time slots with 'gracious professionalism'. He consistently demonstrated initiative and enthusiasm by seeking out additional ways to contribute throughout the day." },
];
const SKILLS = [
  { name:"Google Dev Tools",icon:"🔧" },{ name:"Raycast",     icon:"⚡" },{ name:"Notion",      icon:"📋" },{ name:"Arc Browser",icon:"🌐" },
  { name:"VS Code",         icon:">_" },{ name:"GitHub",      icon:"🐙" },{ name:"Shapr3D",     icon:"🎨" },{ name:"ChatGPT",    icon:"🤖" },
  { name:"Kaggle",          icon:"📊" },{ name:"Python",      icon:"🐍" },{ name:"JavaScript",  icon:"𝐉𝐒"  },{ name:"React",      icon:"⚛"  },
  { name:"Git",             icon:"⎇"  },{ name:"Figma",       icon:"✏️"},
];
const GALLERY = [
  { label:"Campfire Hackathon",             caption:"Building, hacking, and vibing — a night to remember.",         src:"/gallery/campfire.jpg"  },
  { label:"Fried Brothers with Friends",    caption:"Good food, great people. The crew at our favourite spot.",     src:"/gallery/fried1.jpg"    },
  { label:"Fried Brothers with Friends",    caption:"Neon lights and fries — peak dining experience.",             src:"/gallery/fried2.jpg"    },
  { label:"Mock Trial vs James Ruse Ag HS", caption:"Lost by 9 pts — but we held our own in the courtroom.",       src:"/gallery/mocktrial.jpg" },
  { label:"Comp Club UNSW AI Course",       caption:"Learning AI with the Competitive Programming Club at UNSW.",   src:"/gallery/compclub.jpg"  },
  { label:"UNSW AI Conference @ W Sydney",  caption:"The Darling Harbour view from the W Hotel.",                  src:"/gallery/unsw1.jpg"     },
  { label:"UNSW AI Conference @ W Sydney",  caption:"Night view from the conference — Sydney city lit up.",         src:"/gallery/unsw2.jpg"     },
  { label:"UNSW AI Conference @ W Sydney",  caption:"Sydney Harbour Bridge at night after the conference.",         src:"/gallery/unsw3.jpg"     },
  { label:"UNSW AI Conference @ W Sydney",  caption:"Panel: NAIC, Future Government, AMP CTO, UNSW AI Director.",  src:"/gallery/unsw4.jpg"     },
  { label:"UNSW AI Conference @ W Sydney",  caption:"Post-conference gelato run — well earned.",                    src:"/gallery/unsw5.jpg"     },
  { label:"UNSW AI Conference @ W Sydney",  caption:"Sydney CBD at night from the rooftop.",                       src:"/gallery/unsw6.jpg"     },
  { label:"UNSW AI Conference @ W Sydney",  caption:"Inside the AI panel event at W Sydney Hotel.",                src:"/gallery/unsw7.jpg"     },
  { label:"Scrapyard Hackathon",            caption:"Hackathon, fun times, school spirit.",                        src:IMG.scrapyard1           },
  { label:"Multicultural Day",              caption:"Explosion of culture, food, ethnicity.",                      src:IMG.scrapyard2           },
  { label:"Athletics Carnival",             caption:"Sport, key event, great times, fun times.",                   src:IMG.athletics            },
];
const PROJECTS = [
  { label:"Flower Animation",   caption:"Flower animation for multimedia at 12 FPS",                                            src:IMG.flowerVid },
  { label:"Square to Triangle", caption:"Switching between two objects by combining opposite frames with creative liberty.",    src:IMG.squareVid },
];
const CONNECT = [
  { label:"Discord",     val:"brain913",                       icon:"💬", href:"https://discord.com/users/767977600915734530"                             },
  { label:"WhatsApp",    val:"Vatsal Mehta",                   icon:"📱", href:"https://web.whatsapp.com/send/?phone=61493444893"                         },
  { label:"LinkedIn",    val:"Vatsal Mehta",                   icon:"💼", href:"https://linkedin.com/in/brain913"                                         },
  { label:"Email",       val:"vatsalplayzforever@gmail.com",   icon:"✉️", href:"mailto:vatsalplayzforever@gmail.com"                                       },
  { label:"Book a Call", val:"cal.com",                        icon:"📅", href:"https://cal.com/brain913"                                                 },
];
const TABS = ["Work Experience","Education","References","Tech Stack","Gallery","Projects","Connect"];
const TAB_ICON = { "Work Experience":"💼","Education":"🎓","References":"💬","Tech Stack":"⚙️","Gallery":"🖼","Projects":"🎬","Connect":"📡" };

/* ─── GLASS DESIGN TOKENS ──────────────────────────────────────── */
// Material 3 / Liquid Glass / Fluent fusion
const G = {
  // M3 tonal palette (purple seed)
  primary:       "#6750A4",
  onPrimary:     "#FFFFFF",
  primaryCont:   "#EADDFF",
  onPrimaryCont: "#21005D",
  secondary:     "#625B71",
  tertiary:      "#7D5260",
  surface:       "rgba(255,255,255,0.62)",
  surfaceHigh:   "rgba(255,255,255,0.82)",
  surfaceTint:   "rgba(103,80,164,0.06)",
  outline:       "rgba(103,80,164,0.18)",
  outlineVar:    "rgba(103,80,164,0.09)",
  // Liquid Glass
  glass:         "rgba(255,255,255,0.58)",
  glassHover:    "rgba(255,255,255,0.78)",
  glassStrong:   "rgba(255,255,255,0.88)",
  glassBlur:     "blur(28px) saturate(200%) brightness(1.04)",
  glassBlurNav:  "blur(40px) saturate(220%) brightness(1.06)",
  specular:      "rgba(255,255,255,0.9)",
  // Fluent depth
  shadow:        "0 8px 32px rgba(103,80,164,0.12), 0 2px 8px rgba(103,80,164,0.08)",
  shadowHover:   "0 16px 48px rgba(103,80,164,0.2), 0 4px 16px rgba(103,80,164,0.12)",
  shadowCard:    "0 4px 20px rgba(103,80,164,0.1), inset 0 1px 0 rgba(255,255,255,0.9), inset 1px 0 0 rgba(255,255,255,0.5)",
  // Typography
  textPrimary:   "#1C1B1F",
  textSecondary: "#49454F",
  textTertiary:  "#79747E",
  textOnGlass:   "#1C1B1F",
  // Radii (M3 spec)
  radiusSm:      "12px",
  radiusMd:      "16px",
  radiusLg:      "24px",
  radiusXl:      "32px",
  radiusPill:    "999px",
};

/* ─── GLASS CARD component ─────────────────────────────────────── */
function GlassCard({ children, style = {}, onClick, onMouseEnter, onMouseLeave }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={(e) => { setHov(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHov(false); onMouseLeave && onMouseLeave(e); }}
      style={{
        background: hov ? G.glassHover : G.glass,
        backdropFilter: G.glassBlur,
        WebkitBackdropFilter: G.glassBlur,
        border: `1px solid ${hov ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)"}`,
        borderTop: `1.5px solid ${G.specular}`,
        borderLeft: `1.5px solid ${G.specular}`,
        boxShadow: hov ? G.shadowHover : G.shadow,
        borderRadius: G.radiusLg,
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Specular inner glow */}
      <div style={{ position:"absolute", inset:0, borderRadius: G.radiusLg, background:"linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 60%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
}

/* ─── GLASS PILL TAG ───────────────────────────────────────────── */
const GlassTag = ({ children }) => (
  <span style={{
    display:"inline-flex", alignItems:"center",
    padding:"3px 12px", borderRadius: G.radiusPill,
    background: G.primaryCont,
    border:`1px solid rgba(103,80,164,0.2)`,
    color: G.onPrimaryCont,
    fontSize:11, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600,
    letterSpacing:"0.02em",
  }}>{children}</span>
);

/* ─── SECTION HEAD ─────────────────────────────────────────────── */
function GlassSectionHead({ children, sub }) {
  return (
    <div style={{ marginBottom:28 }}>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"clamp(22px,4vw,28px)", fontWeight:800, color:G.textPrimary, margin:"0 0 6px", letterSpacing:"-0.03em" }}>{children}</h2>
      {sub && <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:G.textTertiary, margin:"0 0 14px" }}>{sub}</p>}
      <div style={{ display:"flex", gap:4 }}>
        <div style={{ width:32, height:3, borderRadius:G.radiusPill, background:`linear-gradient(90deg,${G.primary},${G.tertiary})` }} />
        <div style={{ width:12, height:3, borderRadius:G.radiusPill, background:G.primaryCont }} />
      </div>
    </div>
  );
}

/* ─── MICA BACKGROUND (Fluent) ─────────────────────────────────── */
function MicaBackground() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
      {/* Base gradient mesh */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#f3eeff 0%,#eef1ff 35%,#fce4f8 70%,#e8f5ff 100%)" }} />
      {/* Fluent acrylic blobs */}
      <div style={{ position:"absolute", top:"-15%", left:"-5%",  width:"55%", height:"55%", borderRadius:"50%", background:"radial-gradient(circle,rgba(179,136,255,0.22) 0%,transparent 70%)", filter:"blur(60px)" }} />
      <div style={{ position:"absolute", bottom:"-10%", right:"-5%",  width:"50%", height:"50%", borderRadius:"50%", background:"radial-gradient(circle,rgba(130,177,255,0.18) 0%,transparent 70%)", filter:"blur(60px)" }} />
      <div style={{ position:"absolute", top:"40%",   left:"30%",  width:"40%", height:"40%", borderRadius:"50%", background:"radial-gradient(circle,rgba(240,149,255,0.12) 0%,transparent 70%)", filter:"blur(80px)" }} />
      <div style={{ position:"absolute", top:"10%",   right:"15%", width:"30%", height:"30%", borderRadius:"50%", background:"radial-gradient(circle,rgba(103,80,164,0.08) 0%,transparent 70%)", filter:"blur(40px)" }} />
      {/* Fluent noise texture */}
      <div style={{ position:"absolute", inset:0, opacity:0.025, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat:"repeat", backgroundSize:"128px" }} />
    </div>
  );
}

/* ─── GLASS SIDEBAR CONTENT ────────────────────────────────────── */
function GlassSidebarContent({ onCmdOpen, onClose }) {
  const typed = useTyping(TYPING);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, padding:"32px 22px 100px" }}>
      {/* Avatar */}
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{
          width:64, height:64, borderRadius:G.radiusMd, overflow:"hidden", flexShrink:0,
          boxShadow:`0 4px 20px rgba(103,80,164,0.25), inset 0 1px 0 rgba(255,255,255,0.8)`,
          border:`2px solid rgba(255,255,255,0.9)`,
        }}>
          <img src={IMG.profile} alt="Vatsal" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:19, fontWeight:800, color:G.textPrimary, margin:"0 0 3px" }}>Vatsal Mehta</h1>
          <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 10px", borderRadius:G.radiusPill, background:G.primaryCont, color:G.primary, fontSize:10, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Student · BBHS</span>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, color:G.textTertiary, marginTop:4 }}>📍 Blacktown, NSW, AU</div>
        </div>
      </div>

      {/* About glass chip */}
      <GlassCard style={{ padding:"14px 16px" }}>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, color:G.primary, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>About</div>
        <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:G.textSecondary, lineHeight:1.75, margin:0 }}>
          I'm currently <span style={{ color:G.primary, fontWeight:700 }}>{typed}</span>
          <span style={{ display:"inline-block", width:"1.5px", height:"0.9em", background:G.primary, animation:"blink 1s step-end infinite", verticalAlign:"middle", marginLeft:1, borderRadius:1 }} />
        </p>
        <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11.5, color:G.textTertiary, lineHeight:1.7, marginTop:8, marginBottom:0 }}>
          Growth mindset, adaptability, and a commitment to achieve my goals — adding value through dedication and results.
        </p>
      </GlassCard>

      {/* Stats — M3 tonal list */}
      <GlassCard style={{ padding:"14px 16px" }}>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, color:G.primary, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Activity</div>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom: i < STATS.length-1 ? `1px solid ${G.outlineVar}` : "none" }}>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12.5, color:G.textPrimary, fontWeight:600 }}>{s.label}</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, color:G.textTertiary }}>{s.sub}</div>
            </div>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10.5, color:G.primary, background:G.primaryCont, padding:"2px 9px", borderRadius:G.radiusPill, fontWeight:700 }}>{s.val}</span>
          </div>
        ))}
      </GlassCard>

      {/* Links */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {[{ label:"LinkedIn", href:"https://linkedin.com/in/brain913", icon:"💼" }, { label:"Email", href:"mailto:vatsalplayzforever@gmail.com", icon:"✉️" }].map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 14px", borderRadius:G.radiusMd, background:G.surfaceTint, border:`1px solid ${G.outline}`, textDecoration:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:G.primary, fontWeight:600, transition:"all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.background=G.primaryCont; e.currentTarget.style.boxShadow=G.shadow; }}
            onMouseLeave={e => { e.currentTarget.style.background=G.surfaceTint; e.currentTarget.style.boxShadow="none"; }}
          >{l.icon} {l.label}</a>
        ))}
      </div>

      {/* Cmd K */}
      <button onClick={onCmdOpen} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"10px 16px", borderRadius:G.radiusMd, background:G.glass, backdropFilter:G.glassBlur, WebkitBackdropFilter:G.glassBlur, border:`1px solid ${G.outline}`, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:G.textSecondary, boxShadow:G.shadowCard }}>
        <span style={{ fontSize:14 }}>⌘</span> Press Cmd + K
      </button>
    </div>
  );
}

/* ─── GLASS SIDEBAR (desktop) ──────────────────────────────────── */
function GlassSidebar({ onCmdOpen }) {
  return (
    <aside style={{
      position:"sticky", top:0, height:"100vh", overflowY:"auto", overflowX:"hidden",
      background:"rgba(255,255,255,0.45)",
      backdropFilter:"blur(40px) saturate(200%)",
      WebkitBackdropFilter:"blur(40px) saturate(200%)",
      borderRight:`1px solid rgba(255,255,255,0.8)`,
      boxShadow:"inset -1px 0 0 rgba(103,80,164,0.08)",
    }}>
      <GlassSidebarContent onCmdOpen={onCmdOpen} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to top,rgba(243,238,255,0.9),transparent)", pointerEvents:"none" }} />
    </aside>
  );
}

/* ─── MOBILE DRAWER ────────────────────────────────────────────── */
function GlassMobileDrawer({ open, onClose, onCmdOpen }) {
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(4px)", opacity:open?1:0, pointerEvents:open?"auto":"none", transition:"opacity 0.25s" }} />
      <div style={{ position:"fixed", top:0, left:0, bottom:0, zIndex:201, width:"82vw", maxWidth:300, background:"rgba(243,238,255,0.88)", backdropFilter:"blur(40px) saturate(200%)", WebkitBackdropFilter:"blur(40px) saturate(200%)", borderRight:`1px solid rgba(255,255,255,0.85)`, overflowY:"auto", transform:open?"translateX(0)":"translateX(-100%)", transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)", boxShadow:"4px 0 32px rgba(103,80,164,0.15)" }}>
        <div style={{ display:"flex", justifyContent:"flex-end", padding:"16px 16px 0" }}>
          <button onClick={onClose} style={{ background:G.glass, backdropFilter:G.glassBlur, WebkitBackdropFilter:G.glassBlur, border:`1px solid ${G.outline}`, borderRadius:G.radiusMd, width:34, height:34, cursor:"pointer", fontSize:16, color:G.textSecondary, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:G.shadowCard }}>✕</button>
        </div>
        <GlassSidebarContent onCmdOpen={() => { onClose(); onCmdOpen(); }} />
      </div>
    </>
  );
}

/* ─── MOBILE HEADER ────────────────────────────────────────────── */
function GlassMobileHeader({ onMenuOpen, onCmdOpen }) {
  return (
    <header style={{ position:"sticky", top:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"rgba(255,255,255,0.72)", backdropFilter:"blur(32px) saturate(200%)", WebkitBackdropFilter:"blur(32px) saturate(200%)", borderBottom:`1px solid rgba(255,255,255,0.85)`, boxShadow:`0 1px 0 ${G.outlineVar}` }}>
      <button onClick={onMenuOpen} style={{ background:G.glass, backdropFilter:G.glassBlur, WebkitBackdropFilter:G.glassBlur, border:`1px solid ${G.outline}`, borderRadius:G.radiusMd, padding:"7px 10px", cursor:"pointer", display:"flex", flexDirection:"column", gap:4, boxShadow:G.shadowCard }}>
        {[18,14,18].map((w,i) => <span key={i} style={{ display:"block", width:w, height:1.5, background:G.textSecondary, borderRadius:2 }} />)}
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:10, overflow:"hidden", border:`2px solid rgba(255,255,255,0.9)`, boxShadow:`0 2px 8px rgba(103,80,164,0.2)` }}>
          <img src={IMG.profile} alt="Vatsal" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:16, fontWeight:800, color:G.textPrimary }}>Vatsal Mehta</span>
      </div>
      <button onClick={onCmdOpen} style={{ background:G.glass, backdropFilter:G.glassBlur, WebkitBackdropFilter:G.glassBlur, border:`1px solid ${G.outline}`, borderRadius:G.radiusMd, padding:"7px 10px", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, color:G.textSecondary, fontWeight:600, boxShadow:G.shadowCard }}>⌘K</button>
  </header>
  );
}

/* ─── LIQUID GLASS NAV (iOS 26 floating pill) ──────────────────── */
function GlassNav({ active, setActive }) {
  return (
    <div style={{ position:"sticky", top:0, zIndex:10, padding:"10px 20px", background:"rgba(243,238,255,0.7)", backdropFilter:"blur(30px) saturate(180%)", WebkitBackdropFilter:"blur(30px) saturate(180%)", borderBottom:`1px solid rgba(255,255,255,0.8)` }}>
      <div style={{ display:"flex", gap:2, overflowX:"auto", scrollbarWidth:"none", padding:"2px 0" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActive(tab)}
            style={{
              position:"relative", background:active===tab ? G.primary : "transparent",
              border:"none", borderRadius:G.radiusPill, padding:"7px 14px",
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:active===tab?700:500,
              color:active===tab ? G.onPrimary : G.textSecondary,
              cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow:active===tab ? `0 4px 14px rgba(103,80,164,0.35)` : "none",
            }}
            onMouseEnter={e => { if(active!==tab) { e.currentTarget.style.background=G.primaryCont; e.currentTarget.style.color=G.primary; } }}
            onMouseLeave={e => { if(active!==tab) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=G.textSecondary; } }}
          >{tab}</button>
        ))}
      </div>
    </div>
  );
}

/* ─── MOBILE BOTTOM TAB BAR ────────────────────────────────────── */
function GlassMobileTabBar({ active, setActive }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const visible = TABS.slice(0, 5);
  const rest = TABS.slice(5);
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:50, background:"rgba(255,255,255,0.8)", backdropFilter:"blur(32px) saturate(200%)", WebkitBackdropFilter:"blur(32px) saturate(200%)", borderTop:`1px solid rgba(255,255,255,0.9)`, boxShadow:`0 -1px 0 ${G.outlineVar}, 0 -4px 20px rgba(103,80,164,0.08)`, display:"flex", paddingBottom:"env(safe-area-inset-bottom,8px)" }}>
      {visible.map(tab => (
        <button key={tab} onClick={() => setActive(tab)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 4px 6px", background:"none", border:"none", cursor:"pointer" }}>
          <span style={{ fontSize:20 }}>{TAB_ICON[tab]}</span>
          <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:9, fontWeight:active===tab?700:500, color:active===tab?G.primary:G.textTertiary }}>{tab.split(" ")[0]}</span>
          {active===tab && <div style={{ width:4, height:4, borderRadius:"50%", background:G.primary, marginTop:-2 }} />}
        </button>
      ))}
      <div style={{ flex:1, position:"relative" }}>
        <button onClick={() => setMoreOpen(o=>!o)} style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 4px 6px", background:"none", border:"none", cursor:"pointer" }}>
          <span style={{ fontSize:18, lineHeight:1, color:G.textTertiary }}>•••</span>
          <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:9, color:G.textTertiary, fontWeight:500 }}>More</span>
        </button>
        {moreOpen && (
          <div style={{ position:"absolute", bottom:"100%", right:0, background:"rgba(255,255,255,0.92)", backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)", border:`1px solid ${G.outline}`, borderRadius:G.radiusLg, overflow:"hidden", width:150, marginBottom:4, boxShadow:G.shadow }}>
            {rest.map(tab => (
              <button key={tab} onClick={() => { setActive(tab); setMoreOpen(false); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:active===tab?G.primaryCont:"transparent", border:"none", cursor:"pointer" }}>
                <span style={{ fontSize:14 }}>{TAB_ICON[tab]}</span>
                <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:active===tab?G.primary:G.textPrimary, fontWeight:active===tab?700:500 }}>{tab}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

/* ─── COMMAND PALETTE (glass style) ────────────────────────────── */
function GlassCommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const items = [
    { section:"Actions", label:"Print Resume",  icon:"🖨",  hotkey:"Ctrl+P", action:()=>window.print() },
    { section:"Social",  label:"LinkedIn",      icon:"💼",  hotkey:"Ctrl+L", action:()=>window.open("https://linkedin.com/in/brain913","_blank") },
    { section:"Social",  label:"Email",         icon:"✉️",  hotkey:"Ctrl+E", action:()=>{ window.location.href="mailto:vatsalplayzforever@gmail.com"; } },
    { section:"Social",  label:"Instagram",     icon:"📸",  hotkey:"",       action:()=>window.open("https://instagram.com/brain913","_blank") },
    { section:"Coding",  label:"GitHub",        icon:"🐙",  hotkey:"",       action:()=>window.open("https://github.com/brain913","_blank") },
  ];
  useEffect(() => { if(open) { setQuery(""); setSel(0); setTimeout(()=>inputRef.current?.focus(),50); } }, [open]);
  const filtered = items.filter(i=>i.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const h = (e) => {
      if(e.key==="ArrowDown"){e.preventDefault();setSel(s=>Math.min(s+1,filtered.length-1));}
      if(e.key==="ArrowUp"){e.preventDefault();setSel(s=>Math.max(s-1,0));}
      if(e.key==="Enter"){filtered[sel]?.action();onClose();}
      if(e.key==="Escape"){onClose();}
    };
    if(open) window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[open,filtered,sel,onClose]);
  if(!open) return null;
  const sections = [...new Set(filtered.map(i=>i.section))];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(28,27,31,0.4)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"12vh 16px 0" }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:520, background:"rgba(255,255,255,0.88)", backdropFilter:"blur(40px) saturate(200%)", WebkitBackdropFilter:"blur(40px) saturate(200%)", border:`1.5px solid ${G.specular}`, borderRadius:G.radiusXl, overflow:"hidden", boxShadow:`0 32px 80px rgba(103,80,164,0.25), inset 0 1px 0 rgba(255,255,255,0.95)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", borderBottom:`1px solid ${G.outlineVar}` }}>
          <span style={{ fontSize:16, opacity:0.5 }}>🔍</span>
          <input ref={inputRef} value={query} onChange={e=>{setQuery(e.target.value);setSel(0);}} placeholder="Search commands…"
            style={{ flex:1, background:"none", border:"none", outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, color:G.textPrimary }} />
          <kbd style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, padding:"2px 8px", background:G.primaryCont, border:`1px solid ${G.outline}`, borderRadius:G.radiusMd, color:G.primary, fontWeight:600 }}>Esc</kbd>
        </div>
        <div style={{ maxHeight:300, overflowY:"auto", padding:"8px 0" }}>
          {sections.map(sec => (
            <div key={sec}>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, color:G.primary, padding:"6px 18px 4px", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:700 }}>{sec}</div>
              {filtered.filter(i=>i.section===sec).map(item => {
                const gi=filtered.indexOf(item);
                return (
                  <div key={item.label} onClick={()=>{item.action();onClose();}} onMouseEnter={()=>setSel(gi)}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 18px", cursor:"pointer", background:sel===gi?G.primaryCont:"transparent", transition:"background 0.1s" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontSize:16 }}>{item.icon}</span>
                      <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:G.textPrimary, fontWeight:500 }}>{item.label}</span>
                    </div>
                    {item.hotkey && <kbd style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, padding:"2px 7px", background:G.primaryCont, border:`1px solid ${G.outline}`, borderRadius:G.radiusMd, color:G.primary, fontWeight:600 }}>{item.hotkey}</kbd>}
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length===0 && <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:G.textTertiary, padding:"20px 18px", textAlign:"center" }}>No results for "{query}"</div>}
        </div>
        <div style={{ borderTop:`1px solid ${G.outlineVar}`, padding:"8px 18px", display:"flex", gap:14 }}>
          {[["↩","select"],["↑↓","navigate"],["Esc","close"]].map(([k,v])=>(
            <span key={v} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <kbd style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:9, padding:"1px 6px", background:G.primaryCont, border:`1px solid ${G.outline}`, borderRadius:6, color:G.primary, fontWeight:700 }}>{k}</kbd>
              <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, color:G.textTertiary }}>{v}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SECTIONS
══════════════════════════════════════════════════════════════════ */

function GlassWorkExperience() {
  const [open, setOpen] = useState({});
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? EXPERIENCE : EXPERIENCE.slice(0, 3);
  return (
    <section style={{ padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <GlassSectionHead>Experience</GlassSectionHead>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {visible.map((exp, i) => (
          <GlassCard key={i} style={{ padding:"20px 22px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
              <img src={exp.logo} alt={exp.company} style={{ width:36, height:36, borderRadius:10, objectFit:"cover", border:`2px solid rgba(255,255,255,0.9)`, boxShadow:`0 2px 8px rgba(103,80,164,0.15)`, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:6 }}>
                  <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:G.textPrimary, margin:0 }}>
                    {exp.role} <span style={{ color:G.textTertiary, fontWeight:400 }}>@</span>{" "}
                    <a href={exp.link} target="_blank" rel="noreferrer" style={{ color:G.primary, textDecoration:"none" }}
                      onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
                      onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}
                    >{exp.company} ↗</a>
                  </h3>
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, color:G.primary, background:G.primaryCont, padding:"2px 9px", borderRadius:G.radiusPill, fontWeight:700, flexShrink:0 }}>{exp.period}</span>
                </div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, color:G.textTertiary, marginTop:2 }}>{exp.location}</div>
              </div>
            </div>
            {/* Screenshot */}
            <div style={{ borderRadius:G.radiusMd, overflow:"hidden", marginBottom:12, boxShadow:`inset 0 0 0 1px ${G.outlineVar}`, aspectRatio:"16/7" }}>
              <img src={exp.siteImg} alt={exp.company} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            </div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12.5, color:G.textSecondary, lineHeight:1.7, margin:"0 0 10px" }}>{exp.summary}</p>
            <div style={{ overflow:"hidden", maxHeight:open[i]?300:0, transition:"max-height 0.3s ease" }}>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, color:G.primary, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Achievements</div>
              <ul style={{ margin:"0 0 10px 16px", padding:0, display:"flex", flexDirection:"column", gap:4 }}>
                {exp.achievements.map((a,ai)=><li key={ai} style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12.5, color:G.textSecondary, lineHeight:1.65 }}>{a}</li>)}
              </ul>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {exp.tags.map(t=><GlassTag key={t}>{t}</GlassTag>)}
              </div>
              <button onClick={()=>setOpen(o=>({...o,[i]:!o[i]}))}
                style={{ background:"none", border:`1px solid ${G.outline}`, borderRadius:G.radiusPill, padding:"4px 12px", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, color:G.primary, fontWeight:600, transition:"all 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.background=G.primaryCont;}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";}}
              >{open[i]?"Show less ↑":"Show more ↓"}</button>
            </div>
          </GlassCard>
        ))}
      </div>
      {EXPERIENCE.length > 3 && (
        <button onClick={()=>setShowAll(s=>!s)} style={{ marginTop:16, background:"none", border:`1.5px solid ${G.outline}`, borderRadius:G.radiusPill, padding:"8px 20px", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:G.primary, fontWeight:700, transition:"all 0.15s" }}
          onMouseEnter={e=>{e.currentTarget.style.background=G.primaryCont;}}
          onMouseLeave={e=>{e.currentTarget.style.background="none";}}
        >{showAll?"Show fewer ↑":"Show more experiences ↓"}</button>
      )}
    </section>
  );
}

function GlassEducation() {
  return (
    <section style={{ padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <GlassSectionHead>Education</GlassSectionHead>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
        {EDUCATION.map((e,i)=>(
          <GlassCard key={i} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:40, height:40, borderRadius:G.radiusMd, background:G.primaryCont, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🎓</div>
            <div style={{ flex:1 }}>
              <a href={e.link} target="_blank" rel="noreferrer" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, color:G.textPrimary, fontWeight:700, textDecoration:"none" }}
                onMouseEnter={ev=>ev.currentTarget.style.color=G.primary}
                onMouseLeave={ev=>ev.currentTarget.style.color=G.textPrimary}
              >{e.school}</a>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11.5, color:G.textSecondary, marginTop:2 }}>{e.role}</div>
            </div>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10.5, color:G.primary, background:G.primaryCont, padding:"2px 9px", borderRadius:G.radiusPill, fontWeight:600, flexShrink:0 }}>{e.period}</span>
          </GlassCard>
        ))}
      </div>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10, color:G.primary, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Certificates</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {CERTIFICATES.map((c,i)=>(
          <GlassCard key={i} style={{ padding:"12px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:14, flexShrink:0 }}>📜</span>
            <div style={{ flex:1 }}>
              <a href={c.link} target="_blank" rel="noreferrer" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:G.textPrimary, fontWeight:600, textDecoration:"none" }}
                onMouseEnter={ev=>{ev.currentTarget.style.color=G.primary;ev.currentTarget.style.textDecoration="underline";}}
                onMouseLeave={ev=>{ev.currentTarget.style.color=G.textPrimary;ev.currentTarget.style.textDecoration="none";}}
              >{c.name}</a>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:10.5, color:G.textTertiary, marginTop:2 }}>{c.issuer} · {c.year}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function GlassReferences() {
  return (
    <section style={{ padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <GlassSectionHead>References</GlassSectionHead>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {REFERENCES.map((r,i)=>(
          <GlassCard key={i} style={{ padding:"24px 24px" }}>
            <div style={{ fontSize:40, color:G.primaryCont, lineHeight:0.7, marginBottom:14, fontFamily:"Georgia,serif" }}>"</div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:G.textSecondary, lineHeight:1.85, margin:"0 0 18px", fontStyle:"italic" }}>{r.text}</p>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${G.primary},${G.tertiary})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, color:"#fff", fontWeight:700, boxShadow:`0 4px 12px rgba(103,80,164,0.3)` }}>{r.initials}</div>
              <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, color:G.textPrimary, fontWeight:700 }}>{r.name}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function GlassTechStack() {
  return (
    <section style={{ padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <GlassSectionHead sub="Tools & technologies I use day-to-day">Tech Stack</GlassSectionHead>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10 }}>
        {SKILLS.map(s=>(
          <GlassCard key={s.name} style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, cursor:"default" }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{s.icon}</span>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12.5, color:G.textPrimary, fontWeight:600 }}>{s.name}</span>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function GlassGallery() {
  const groups = GALLERY.reduce((acc,item)=>{ if(!acc[item.label])acc[item.label]=[]; acc[item.label].push(item); return acc; },{});
  const groupKeys = Object.keys(groups);
  const [cardIdx, setCardIdx] = useState(()=>Object.fromEntries(groupKeys.map(k=>[k,0])));
  const [lb, setLb] = useState(null);
  const handleClick = (label,items) => {
    if(items.length===1) setLb({items,idx:0});
    else setCardIdx(prev=>({...prev,[label]:(prev[label]+1)%items.length}));
  };
  const openLb = (e,label,items) => { e.stopPropagation(); setLb({items,idx:cardIdx[label]||0}); };
  const lbNav = dir => setLb(p=>({...p,idx:(p.idx+dir+p.items.length)%p.items.length}));
  return (
    <section style={{ padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <GlassSectionHead sub="Day in the life · tap to cycle · ⛶ to expand">Gallery</GlassSectionHead>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
        {groupKeys.map(label=>{
          const items=groups[label], idx=cardIdx[label]||0, current=items[idx], isMulti=items.length>1;
          return (
            <div key={label} onClick={()=>handleClick(label,items)}
              style={{ borderRadius:G.radiusLg, overflow:"hidden", cursor:"pointer", aspectRatio:"4/3", position:"relative", boxShadow:G.shadow, border:`1.5px solid rgba(255,255,255,0.85)`, transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)", userSelect:"none" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=G.shadowHover;e.currentTarget.style.transform="scale(1.03)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=G.shadow;e.currentTarget.style.transform="none";}}
            >
              <img key={current.src} src={current.src} alt={current.label} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",animation:"imgFade 0.25s ease" }} />
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(28,27,31,0.72) 0%,transparent 55%)",pointerEvents:"none" }} />
              {/* Expand btn */}
              <button onClick={e=>openLb(e,label,items)} style={{ position:"absolute",top:8,left:8,width:28,height:28,borderRadius:G.radiusMd,background:"rgba(255,255,255,0.72)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:`1px solid rgba(255,255,255,0.9)`,color:G.primary,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2,boxShadow:`0 2px 8px rgba(103,80,164,0.2)` }}>&#x26F6;</button>
              {isMulti && (
                <>
                  <div style={{ position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.72)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",borderRadius:G.radiusPill,padding:"2px 8px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9.5,color:G.primary,fontWeight:700,pointerEvents:"none",zIndex:2 }}>{idx+1} / {items.length}</div>
                  <div style={{ position:"absolute",top:8,left:0,right:0,display:"flex",justifyContent:"center",gap:4,pointerEvents:"none",zIndex:2 }}>
                    {items.map((_,di)=><div key={di} style={{ width:di===idx?14:5,height:5,borderRadius:G.radiusPill,background:di===idx?G.primary:"rgba(255,255,255,0.55)",transition:"all 0.25s" }} />)}
                  </div>
                  <div style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:22,color:"rgba(255,255,255,0.7)",pointerEvents:"none",zIndex:2 }}>›</div>
                </>
              )}
              <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"10px 12px",pointerEvents:"none",zIndex:2 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"#fff",fontWeight:700,marginBottom:2 }}>{label}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9.5,color:"rgba(255,255,255,0.65)",lineHeight:1.4 }}>{current.caption}</div>
              </div>
            </div>
          );
        })}
      </div>
      {lb && (
        <div onClick={()=>setLb(null)} style={{ position:"fixed",inset:0,zIndex:300,background:"rgba(28,27,31,0.6)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:740,width:"100%",background:"rgba(255,255,255,0.88)",backdropFilter:"blur(40px) saturate(200%)",WebkitBackdropFilter:"blur(40px) saturate(200%)",border:`1.5px solid ${G.specular}`,borderRadius:G.radiusXl,overflow:"hidden",boxShadow:`0 32px 80px rgba(103,80,164,0.25)` }}>
            <div style={{ position:"relative" }}>
              <img key={lb.items[lb.idx].src} src={lb.items[lb.idx].src} alt={lb.items[lb.idx].label} style={{ width:"100%",display:"block",maxHeight:460,objectFit:"cover",animation:"imgFade 0.2s ease" }} />
              {lb.items.length>1 && (
                <>
                  {[-1,1].map(dir=>(
                    <button key={dir} onClick={e=>{e.stopPropagation();lbNav(dir);}} style={{ position:"absolute",[dir===-1?"left":"right"]:12,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.82)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:`1px solid ${G.outline}`,color:G.primary,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:G.shadow }}>{dir===-1?"‹":"›"}</button>
                  ))}
                  <div style={{ position:"absolute",bottom:10,left:0,right:0,display:"flex",justifyContent:"center",gap:6 }}>
                    {lb.items.map((_,di)=><div key={di} onClick={e=>{e.stopPropagation();setLb(p=>({...p,idx:di}));}} style={{ width:di===lb.idx?18:6,height:6,borderRadius:G.radiusPill,background:di===lb.idx?G.primary:"rgba(255,255,255,0.6)",transition:"all 0.25s",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />)}
                  </div>
                </>
              )}
            </div>
            <div style={{ padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",color:G.textPrimary,fontSize:15,fontWeight:700,marginBottom:4,display:"flex",alignItems:"center",gap:8 }}>
                  {lb.items[lb.idx].label}
                  {lb.items.length>1 && <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:G.primary,background:G.primaryCont,padding:"1px 8px",borderRadius:G.radiusPill,fontWeight:700 }}>{lb.idx+1} / {lb.items.length}</span>}
                </div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11.5,color:G.textTertiary,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{lb.items[lb.idx].caption}</div>
              </div>
              <button onClick={()=>setLb(null)} style={{ background:G.primaryCont,border:`1px solid ${G.outline}`,borderRadius:G.radiusMd,padding:"6px 14px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:G.primary,cursor:"pointer",fontWeight:700,marginLeft:12,flexShrink:0 }}>✕</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function GlassProjects() {
  return (
    <section style={{ padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <GlassSectionHead sub="Creative & multimedia work">Projects</GlassSectionHead>
      <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
        {PROJECTS.map((p,i)=>(
          <GlassCard key={i} style={{ overflow:"hidden",padding:0 }}>
            <video src={p.src} autoPlay loop muted playsInline style={{ width:"100%",display:"block",maxHeight:300,objectFit:"cover" }} />
            <div style={{ padding:"14px 20px" }}>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",color:G.textPrimary,fontSize:15,fontWeight:800,marginBottom:5 }}>{p.label}</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12.5,color:G.textSecondary,lineHeight:1.6 }}>{p.caption}</div>
            </div>
          </GlassCard>
        ))}
        {/* Photo sub-sections */}
        {[{ title:"Scrapyard Hackathon", desc:"Hackathon, fun times, school spirit.", srcs:[IMG.scrapyard1,IMG.scrapyard2] },{ title:"Athletics Carnival", desc:"Sport, key event, great times, fun times.", srcs:[IMG.athletics] }].map(sec=>(
          <div key={sec.title}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:G.primary,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10 }}>{sec.title}</div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12.5,color:G.textSecondary,marginBottom:12 }}>{sec.desc}</p>
            <div style={{ display:"grid",gridTemplateColumns:sec.srcs.length>1?"1fr 1fr":"1fr",gap:10 }}>
              {sec.srcs.map((src,i)=>(
                <div key={i} style={{ borderRadius:G.radiusLg,overflow:"hidden",boxShadow:G.shadow,border:`1.5px solid rgba(255,255,255,0.85)` }}>
                  <img src={src} alt={sec.title} style={{ width:"100%",display:"block",aspectRatio:"4/3",objectFit:"cover" }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GlassConnect() {
  return (
    <section style={{ padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px" }}>
      <GlassSectionHead sub="My goal is to add value through dedication, communication and results.">Connect</GlassSectionHead>
      <div style={{ display:"flex",flexDirection:"column",gap:10,maxWidth:520 }}>
        {CONNECT.map(c=>(
          <a key={c.label} href={c.href} target={c.href.startsWith("http")?"_blank":undefined} rel="noreferrer"
            style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderRadius:G.radiusLg,textDecoration:"none",background:G.glass,backdropFilter:G.glassBlur,WebkitBackdropFilter:G.glassBlur,border:`1px solid rgba(255,255,255,0.75)`,borderTop:`1.5px solid ${G.specular}`,boxShadow:G.shadowCard,transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
            onMouseEnter={e=>{e.currentTarget.style.background=G.glassHover;e.currentTarget.style.boxShadow=G.shadowHover;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background=G.glass;e.currentTarget.style.boxShadow=G.shadowCard;e.currentTarget.style.transform="none";}}
          >
            <div style={{ display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ width:42,height:42,borderRadius:G.radiusMd,flexShrink:0,background:G.primaryCont,border:`1px solid ${G.outline}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19 }}>{c.icon}</div>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:G.textTertiary,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600 }}>{c.label}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:G.textPrimary,fontWeight:600 }}>{c.val}</div>
              </div>
            </div>
            <span style={{ color:G.primary,fontSize:18,fontWeight:300 }}>→</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT GLASS PORTFOLIO
══════════════════════════════════════════════════════════════════ */
const GLASS_CONTENT = {
  "Work Experience": GlassWorkExperience,
  "Education":       GlassEducation,
  "References":      GlassReferences,
  "Tech Stack":      GlassTechStack,
  "Gallery":         GlassGallery,
  "Projects":        GlassProjects,
  "Connect":         GlassConnect,
};

export default function PortfolioGlass({ onToggle }) {
  const [active, setActive]     = useState("Work Experience");
  const [cmdOpen, setCmdOpen]   = useState(false);
  const [drawerOpen, setDrawer] = useState(false);
  const isMobile = useIsMobile();
  const ActiveSection = GLASS_CONTENT[active];

  const openCmd  = useCallback(()=>setCmdOpen(true),[]);
  const closeCmd = useCallback(()=>setCmdOpen(false),[]);

  useEffect(()=>{
    const h = (e)=>{
      const ctrl=e.ctrlKey||e.metaKey;
      if(ctrl&&e.key==="k"){e.preventDefault();setCmdOpen(o=>!o);}
      if(cmdOpen) return;
      if(ctrl&&e.key==="l"){e.preventDefault();window.open("https://linkedin.com/in/brain913","_blank");}
      if(ctrl&&e.key==="e"){e.preventDefault();window.location.href="mailto:vatsalplayzforever@gmail.com";}
      if(ctrl&&e.key==="p"){e.preventDefault();window.print();}
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[cmdOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { min-height:100vh; background:#f3eeff; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes imgFade { from{opacity:0;transform:scale(1.02)} to{opacity:1;transform:scale(1)} }
        .glass-slide { animation:slideUp 0.28s ease forwards; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(103,80,164,0.2); border-radius:4px; }
        aside::-webkit-scrollbar, nav::-webkit-scrollbar { display:none; }
        .glass-desktop-sidebar { display:block; }
        .glass-desktop-nav     { display:flex; }
        .glass-mobile-header   { display:none; }
        .glass-mobile-tabbar   { display:none; }
        @media (max-width:767px) {
          .glass-desktop-sidebar { display:none; }
          .glass-desktop-nav     { display:none; }
          .glass-mobile-header   { display:flex; }
          .glass-mobile-tabbar   { display:flex; }
        }
        @media print { canvas,.glass-mobile-tabbar,.glass-mobile-header { display:none !important; } }
      `}</style>

      <MicaBackground />

      <GlassCommandPalette open={cmdOpen} onClose={closeCmd} />
      {isMobile && <GlassMobileDrawer open={drawerOpen} onClose={()=>setDrawer(false)} onCmdOpen={openCmd} />}

      {/* Toggle button — floating pill */}
      <button onClick={onToggle}
        style={{ position:"fixed",bottom:isMobile?90:28,right:20,zIndex:500,display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:G.radiusPill,background:"rgba(255,255,255,0.82)",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",border:`1.5px solid ${G.specular}`,boxShadow:`0 8px 32px rgba(103,80,164,0.2),inset 0 1px 0 rgba(255,255,255,0.95)`,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:700,color:G.primary,transition:"all 0.2s" }}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 12px 40px rgba(103,80,164,0.3),inset 0 1px 0 rgba(255,255,255,0.95)`;e.currentTarget.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 8px 32px rgba(103,80,164,0.2),inset 0 1px 0 rgba(255,255,255,0.95)`;e.currentTarget.style.transform="none";}}
      >
        <span style={{ fontSize:16 }}>🌙</span> Switch to Dark
      </button>

      <div style={{ position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"260px 1fr",maxWidth:1340,margin:"0 auto",minHeight:"100vh" }}>
        <div className="glass-desktop-sidebar">
          <GlassSidebar onCmdOpen={openCmd} />
        </div>

        <div style={{ display:"flex",flexDirection:"column",minHeight:"100vh" }}>
          <div className="glass-mobile-header">
            <GlassMobileHeader onMenuOpen={()=>setDrawer(true)} onCmdOpen={openCmd} />
          </div>
          <div className="glass-desktop-nav">
            <GlassNav active={active} setActive={setActive} />
          </div>

          <main key={active} className="glass-slide" style={{ flex:1 }}>
            <ActiveSection />
          </main>

          <div style={{ position:"sticky",bottom:0,height:80,background:"linear-gradient(to top,rgba(243,238,255,0.9),transparent)",pointerEvents:"none" }} />

          <footer style={{ padding:"12px clamp(16px,4vw,36px) clamp(80px,12vw,36px)",borderTop:`1px solid ${G.outlineVar}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,background:"rgba(255,255,255,0.4)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)" }}>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:G.textTertiary }}>Made with ❤️ & 👑 by Vatsal & Claude</span>
            <button onClick={openCmd} style={{ background:G.glass,backdropFilter:G.glassBlur,WebkitBackdropFilter:G.glassBlur,border:`1px solid ${G.outline}`,borderRadius:G.radiusMd,padding:"5px 12px",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:G.primary,fontWeight:600,boxShadow:G.shadowCard }}>⌘K</button>
          </footer>
        </div>
      </div>

      {isMobile && <GlassMobileTabBar active={active} setActive={t=>{setActive(t);setDrawer(false);}} />}
    </>
  );
}