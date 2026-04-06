import { useState, useEffect, useRef, useCallback } from "react";

/* ─── HOOKS ─────────────────────────────────────────────────────── */
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

/* ─── DESIGN TOKENS ── Liquid Glass macOS, both modes ──────────── */
/*
  LIGHT: Clean editorial warm paper. Stone ink accent.
         Surfaces: frosted glass on warm cream.
  DARK:  Warm charcoal editorial. Muted sand accent.
         Surfaces: frosted glass on deep warm dark.
  Inspired by ontikreza.framer.website — bold type, clean space,
  Liquid Glass: backdrop-filter blur+saturate, specular top-border.
*/
const T = (dark) => ({
  dark,
  // ── backgrounds ──
  bg:           dark ? "#0f0e0c" : "#f9f7f4",
  bgSub:        dark ? "#141210" : "#f0ede8",
  // ── surfaces (Liquid Glass) ──
  glass:        dark ? "rgba(255,248,240,0.07)"  : "rgba(255,255,255,0.68)",
  glassHov:     dark ? "rgba(255,248,240,0.13)"  : "rgba(255,255,255,0.88)",
  glassBlur:    "blur(28px) saturate(180%) brightness(1.04)",
  glassNav:     dark ? "blur(40px) saturate(200%) brightness(0.97)" : "blur(40px) saturate(220%) brightness(1.02)",
  specular:     dark ? "rgba(255,248,235,0.16)"  : "rgba(255,255,255,0.94)",
  specularSide: dark ? "rgba(255,248,235,0.07)"  : "rgba(255,255,255,0.55)",
  border:       dark ? "rgba(255,248,235,0.1)"   : "rgba(0,0,0,0.07)",
  borderLight:  dark ? "rgba(255,248,235,0.055)" : "rgba(0,0,0,0.04)",
  // ── text ──
  textPrimary:   dark ? "rgba(255,248,234,0.92)" : "#1c1917",
  textSecondary: dark ? "rgba(255,238,210,0.58)" : "#57534a",
  textTertiary:  dark ? "rgba(255,230,195,0.34)" : "#9c9488",
  // ── accent — warm sand (dark) / warm stone ink (light) ──
  accent:       dark ? "#c9ad87"              : "#4a3728",
  accentRgb:    dark ? "201,173,135"          : "74,55,40",
  accentDim:    dark ? "rgba(201,173,135,0.1)": "rgba(74,55,40,0.07)",
  accentBorder: dark ? "rgba(201,173,135,0.22)":"rgba(74,55,40,0.18)",
  accentPill:   dark ? "rgba(201,173,135,0.14)":"rgba(74,55,40,0.09)",
  // ── shadows ──
  shadow:    dark ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.28)"     : "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
  shadowHov: dark ? "0 16px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.38)"    : "0 8px 36px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
  shadowCard:dark ? "0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,248,235,0.09)" : "0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95), inset 1px 0 0 rgba(255,255,255,0.55)",
  // ── chrome ──
  navBg:      dark ? "rgba(15,14,12,0.88)"   : "rgba(249,247,244,0.88)",
  sidebarBg:  dark ? "rgba(15,14,12,0.82)"   : "rgba(249,247,244,0.82)",
  drawerBg:   dark ? "rgba(15,14,12,0.97)"   : "rgba(249,247,244,0.97)",
  moreMenuBg: dark ? "rgba(18,16,13,0.98)"   : "rgba(250,248,245,0.98)",
  footerFade: dark ? "linear-gradient(to top,#0f0e0c,transparent)" : "linear-gradient(to top,#f9f7f4,transparent)",
  // ── branch animation ──
  branch:      dark ? "rgba(201,173,135,0.06)" : "rgba(74,55,40,0.05)",
  blobs: dark
    ? ["rgba(201,173,135,0.045)","rgba(180,140,100,0.03)","rgba(220,190,150,0.025)"]
    : ["rgba(74,55,40,0.04)",   "rgba(120,95,70,0.03)", "rgba(160,130,100,0.02)"],
  // ── radius ──
  r: { sm:"10px", md:"14px", lg:"20px", xl:"28px", pill:"999px" },
});

/* ─── ASSETS ────────────────────────────────────────────────────── */
const IMG = {
  profile:      "/gallery/profile_new.jpg",
  accelrtLogo:  "https://framerusercontent.com/images/TSAli1ZEa27c4TP04Bm7UQIUQ.png?scale-down-to=512",
  accelrtSite:  "https://framerusercontent.com/images/e0UVnUVjKLv5Ml8kJ5dRPMFf73Q.png",
  roboticsLogo: "https://framerusercontent.com/images/cuIo4eVBHbM00xXLX8JGOsgtUo.jpg?scale-down-to=512",
  roboticsSite: "https://framerusercontent.com/images/GChbrPKmHoUqbyTczTyy9OKupe4.jpg",
  cafeLogo:     "https://framerusercontent.com/images/wVaWfn9GujVGnYPiHUz6qtusWaQ.jpg",
  cafeSite:     "https://framerusercontent.com/images/VrerlOXUnIZtWILehqwd8HIhW54.jpg",
  city2Logo:    "https://framerusercontent.com/images/rtNcXMSTJ0h0tvEy5ukgMpY68.png",
  city2Site:    "https://framerusercontent.com/images/y3cKAV5jwOJGcb8wAzr95VJM49c.jpg",
  fllSite:      "https://framerusercontent.com/images/9JV40cfKNMxfprkrpOBNYEt8XQ.jpeg?scale-down-to=1024",
  scrapyard1:   "https://framerusercontent.com/images/zVJ0xEO14uoYedqzRcyE2u3LDBs.jpg?scale-down-to=1024",
  scrapyard2:   "https://framerusercontent.com/images/sAPlOltwcpel7KaPCn3F0RwlEU.jpg?scale-down-to=1024",
  athletics:    "https://framerusercontent.com/images/QUj5yg4QAZFH8t6eJb1SJCCE.png?scale-down-to=1024",
  flowerVid:    "https://framerusercontent.com/assets/J9mOhxlb8oAWga9V9J7FMk7Y.mp4",
  squareVid:    "https://framerusercontent.com/assets/Xa80JloFiy8jFUQd7V9kAzma5L4.mp4",
  daydreamPhoto:"https://framerusercontent.com/images/SzFUezPNJJVFtZO9J4QAIQBxI.jpeg?scale-down-to=2048",
  daydreamIcon: "https://daydream.hackclub.com/favicon.png",
};

/* ─── DATA ──────────────────────────────────────────────────────── */
const TYPING = ["exploring technology & finance.","thinking about good food and art.","preparing myself for what's next.","balancing academics & extracurriculars."];

const STATS = [
  { label:"Hackathons",               sub:"Organised/Competed",             val:"2+"          },
  { label:"Model United Nations",     sub:"Competing",                      val:"Competing"   },
  { label:"AccelRT",                  sub:"Non-profit",                     val:"2025"        },
  { label:"FIRST Robotics Submerged", sub:"APOC",                           val:"Volunteered" },
  { label:"FIRST Robotics Unearthed", sub:"Nationals",                      val:"Competed"    },
  { label:"FIRST Robotics Unearthed", sub:"Regionals (UNSW, Bossley Park)", val:"Volunteered" },
  { label:"BBHS Cafe",                sub:"Barista",                        val:"2024–2025"   },
  { label:"City2Surf",                sub:"Volunteer",                      val:"Completed"   },
];

const EXPERIENCE = [
  {
    period:"2025", role:"Hackathon Organiser", company:"Hack Club",
    link:"https://daydream.hackclub.com/sydney", location:"UNSW – In person",
    logo:IMG.daydreamIcon, logoDark:IMG.daydreamIcon, siteImg:IMG.daydreamPhoto,
    summary:"Organised Daydream @ UNSW for Hack Club, a non-profit dedicated to creating and organising Hackathons for students in Australia. All spending is visible through Hack Club Bank.",
    achievements:["Organised hackathon events connecting students with industry across Australia","Managed event logistics and participant communication end-to-end","All spending transparently tracked through Hack Club Bank"],
    tags:["Events","Community","Leadership"],
  },
  {
    period:"2024–2025", role:"Volunteer", company:"AccelRT",
    link:"https://accelrt-v2.vercel.app/", location:"Sydney – Hybrid",
    logo:IMG.accelrtLogo, logoDark:IMG.accelrtLogo, siteImg:IMG.accelrtSite,
    summary:"Work at AccelRT, a non-profit dedicated to creating and organising Hackathons for students in Australia — flexible, hybrid volunteering format.",
    achievements:["Organised hackathon events connecting students with industry across Australia","Managed event logistics and participant communication end-to-end"],
    tags:["Events","Community","Leadership"],
  },
  {
    period:"2024–2025", role:"Competitor – Unearthed Season", company:"First Lego League",
    link:"https://www.firstlegoleague.org/", location:"Sydney – In person",
    logo:"/gallery/vanguardlight.png", logoDark:"/gallery/vanguarddark.png",
    logoOnDark:true, siteImg:IMG.fllSite,
    summary:"Competed in the FIRST LEGO League Unearthed Season, representing our school at Regionals (UNSW & Bossley Park) and advancing all the way to Nationals. An incredible team experience combining robotics, research, and presentation.",
    achievements:["Advanced to Nationals — one of the top-ranked teams in Australia","Competed at two Regionals events: UNSW and Bossley Park","Designed, programmed and piloted a LEGO robot through complex missions"],
    tags:["Robotics","STEM","Nationals","Teamwork"],
  },
  {
    period:"2024", role:"Table Reset Volunteer", company:"FIRST Robotics",
    link:"https://www.firstlegoleague.org/", location:"Sydney – In person",
    logo:IMG.roboticsLogo, logoDark:IMG.roboticsLogo, siteImg:IMG.roboticsSite,
    summary:"Volunteered at FIRST Robotics, Asia Pacific Open Championship (APOC) with a table reset role which taught me how to work in a fast-paced timed environment.",
    achievements:["Managed fast-paced timed table resets across all competition rounds","Collaborated with international teams at the Asia Pacific Open Championship"],
    tags:["Robotics","STEM","Teamwork"],
  },
  {
    period:"2023–2025", role:"Barista", company:"BBHS Cafe",
    link:"#", location:"Blacktown, NSW",
    logo:IMG.cafeLogo, logoDark:IMG.cafeLogo, siteImg:IMG.cafeSite,
    summary:"A barista who makes coffees, hot chocolates, shakes and cheese toasties for students and teachers. Gives me the ability to work in a fast-paced environment with a way of learning how to communicate and deliver products.",
    achievements:["High-volume, fast-paced customer service in a school cafe setting","Developed communication and product delivery skills"],
    tags:["Customer Service","F&B"],
  },
  {
    period:"2024", role:"Volunteer", company:"City2Surf",
    link:"https://city2surf.com.au/", location:"Sydney – In person",
    logo:IMG.city2Logo, logoDark:IMG.city2Logo, siteImg:IMG.city2Site,
    summary:"Volunteering at City2Surf was an exhilarating experience which showed me people from all walks of life trying to do their best for charity and giving their all to run the best they can.",
    achievements:["Supported runners and event operations across the course","Contributed to one of Australia's largest charity fun runs"],
    tags:["Charity","Community","Events"],
  },
];

const EDUCATION = [
  { school:"University of New South Wales", link:"#", role:"Bachelor of Computer Science / Law", period:"Future"      },
  { school:"Blacktown Boys High School",    link:"#", role:"Student",                            period:"2020–2025"   },
  { school:"Quakers Hill Public School",    link:"#", role:"Advanced & OC streams",              period:"2016–2022"   },
];

const CERTIFICATES = [
  { name:"Chrome DevTools User",                               issuer:"Google", year:"2026", link:"#" },
  { name:"DOM Detective",                                      issuer:"Google", year:"2026", link:"#" },
  { name:"Android Studio User",                                issuer:"Google", year:"2025", link:"#" },
  { name:"Machine Learning Crash Course: Numerical Data",      issuer:"Google", year:"2025", link:"#" },
  { name:"Firebase Studio Developer Community",                issuer:"Google", year:"2025", link:"#" },
  { name:"Machine Learning Crash Course: Classification",      issuer:"Google", year:"2025", link:"#" },
  { name:"Machine Learning Crash Course: Logistic Regression", issuer:"Google", year:"2025", link:"#" },
  { name:"Machine Learning Crash Course: Linear Regression",   issuer:"Google", year:"2025", link:"#" },
  { name:"I/O 2025 – Registered",                              issuer:"Google", year:"2025", link:"#" },
  { name:"Joined the Google Developer Program",                issuer:"Google", year:"2025", link:"#" },
];

const REFERENCES = [
  { name:"Shuwei Guo", initials:"SG", text:"I am pleased to recommend Vatsal for his enthusiastic contributions to our team. He has demonstrated initiative by developing advertising plans for our social media platforms and participating in events, where he made valuable efforts to connect with key stakeholders. Additionally, Vatsal made creative contributions to our design team mascot during our branding discussions. His proactive attitude and willingness to support various aspects of our work have been appreciated." },
  { name:"Aaron O'Meara", initials:"AO", text:"Vatsal played a key role in supporting the Team Alliance practice rooms at the 2025 FIRST® LEGO® League Asia Pacific Championships, ensuring teams adhered to scheduled time slots with 'gracious professionalism'. He also assisted with bump-out tasks, including rearranging furniture and maintaining clean, organised spaces. While encouraged to focus on his assigned responsibilities, he consistently demonstrated initiative and enthusiasm by seeking out additional ways to contribute throughout the day." },
];

const SKILLS = [
  {name:"Google Dev Tools",icon:"🔧"},{name:"Raycast",    icon:"⚡"},{name:"Notion",     icon:"📋"},{name:"Arc Browser",icon:"🌐"},
  {name:"VS Code",        icon:">_"},{name:"GitHub",     icon:"🐙"},{name:"Shapr3D",    icon:"🎨"},{name:"ChatGPT",    icon:"🤖"},
  {name:"Kaggle",         icon:"📊"},{name:"Python",     icon:"🐍"},{name:"JavaScript", icon:"𝐉𝐒" },{name:"React",      icon:"⚛" },
  {name:"Git",            icon:"⎇" },{name:"Figma",      icon:"✏️"},
];

const GALLERY = [
  {label:"Campfire Hackathon",            caption:"Building, hacking, and vibing — a night to remember.",             src:"/gallery/campfire.jpg"  },
  {label:"Fried Brothers with Friends",   caption:"Good food, great people. The crew at our favourite spot.",          src:"/gallery/fried1.jpg"    },
  {label:"Fried Brothers with Friends",   caption:"Neon lights and fries — peak dining experience.",                  src:"/gallery/fried2.jpg"    },
  {label:"Mock Trial vs James Ruse Ag HS",caption:"Lost by 9 pts — but we held our own in the courtroom.",            src:"/gallery/mocktrial.jpg" },
  {label:"Comp Club UNSW AI Course",      caption:"Learning AI with the Competitive Programming Club at UNSW.",        src:"/gallery/compclub.jpg"  },
  {label:"UNSW AI Conference @ W Sydney", caption:"The Darling Harbour view from the W Hotel.",                       src:"/gallery/unsw1.jpg"     },
  {label:"UNSW AI Conference @ W Sydney", caption:"Night view from the conference — Sydney city lit up.",              src:"/gallery/unsw2.jpg"     },
  {label:"UNSW AI Conference @ W Sydney", caption:"Sydney Harbour Bridge at night after the conference.",              src:"/gallery/unsw3.jpg"     },
  {label:"UNSW AI Conference @ W Sydney", caption:"Panel: NAIC, Future Government, AMP CTO, UNSW AI Director.",       src:"/gallery/unsw4.jpg"     },
  {label:"UNSW AI Conference @ W Sydney", caption:"Post-conference gelato run — well earned.",                         src:"/gallery/unsw5.jpg"     },
  {label:"UNSW AI Conference @ W Sydney", caption:"Sydney CBD at night from the rooftop.",                            src:"/gallery/unsw6.jpg"     },
  {label:"UNSW AI Conference @ W Sydney", caption:"Inside the AI panel event at W Sydney Hotel.",                     src:"/gallery/unsw7.jpg"     },
  {label:"Scrapyard Hackathon",           caption:"Hackathon, fun times, school spirit.",                             src:IMG.scrapyard1           },
  {label:"Multicultural Day",             caption:"Explosion of culture, food, ethnicity.",                           src:IMG.scrapyard2           },
  {label:"Athletics Carnival",            caption:"Sport, key event, great times, fun times.",                        src:IMG.athletics            },
];

const PROJECTS = [
  {label:"Flower Animation",   caption:"Flower animation for multimedia at 12 FPS",                                         src:IMG.flowerVid},
  {label:"Square to Triangle", caption:"Switching between two objects by combining opposite frames with creative liberty.",  src:IMG.squareVid},
];

const CONNECT = [
  {label:"Discord",    val:"brain913",                      icon:"💬",href:"https://discord.com/users/767977600915734530"    },
  {label:"WhatsApp",   val:"Vatsal Mehta",                  icon:"📱",href:"https://web.whatsapp.com/send/?phone=61493444893"},
  {label:"LinkedIn",   val:"Vatsal Mehta",                  icon:"💼",href:"https://linkedin.com/in/brain913"                },
  {label:"Email",      val:"vatsalplayzforever@gmail.com",  icon:"✉️",href:"mailto:vatsalplayzforever@gmail.com"             },
  {label:"Book a Call",val:"cal.com",                       icon:"📅",href:"https://cal.com/brain913"                        },
];

const CMD_ITEMS = [
  {section:"Actions",label:"Print Resume",icon:"🖨", hotkey:"Ctrl+P",action:()=>window.print()},
  {section:"Social", label:"LinkedIn",   icon:"💼", hotkey:"Ctrl+L",action:()=>window.open("https://linkedin.com/in/brain913","_blank")},
  {section:"Social", label:"Email",      icon:"✉️", hotkey:"Ctrl+E",action:()=>{window.location.href="mailto:vatsalplayzforever@gmail.com";}},
  {section:"Social", label:"Instagram",  icon:"📸", hotkey:"",      action:()=>window.open("https://instagram.com/brain913","_blank")},
  {section:"Coding", label:"GitHub",     icon:"🐙", hotkey:"",      action:()=>window.open("https://github.com/brain913","_blank")},
];

const TABS     = ["Work Experience","Education","References","Tech Stack","Gallery","Projects","Connect"];
const TAB_S    = {"Work Experience":"Work","Education":"Edu","References":"Refs","Tech Stack":"Stack","Gallery":"Gallery","Projects":"Projects","Connect":"Connect"};
const TAB_ICON = {"Work Experience":"💼","Education":"🎓","References":"💬","Tech Stack":"⚙️","Gallery":"🌇","Projects":"🎬","Connect":"📡"};

/* ─── LIQUID GLASS BACKGROUND ───────────────────────────────────── */
function PlumCanvas({color}) {
  const ref = useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const PI=Math.PI,H=PI/2,J=PI/14;
    let w=window.innerWidth,h=window.innerHeight;
    c.width=w; c.height=h;
    const ctx=c.getContext("2d"); ctx.lineWidth=1; ctx.strokeStyle=color;
    let q=[],p=[];
    const b=(x,y,a,d={v:0})=>{
      if(x<-80||x>w+80||y<-80||y>h+80)return; d.v++;
      const l=5+Math.random()*4,nx=x+l*Math.cos(a),ny=y+l*Math.sin(a);
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);ctx.stroke();
      const g=d.v<=28?.78:.45;
      if(Math.random()<g)p.push(()=>b(nx,ny,a+Math.random()*J,d));
      if(Math.random()<g)p.push(()=>b(nx,ny,a-Math.random()*J,d));
    };
    const rn=()=>.2+Math.random()*.6;
    q=[()=>b(rn()*w,-5,H),()=>b(rn()*w,h+5,-H),()=>b(-5,rn()*h,0),()=>b(w+5,rn()*h,PI)];
    if(w<600)q=q.slice(0,2);
    let raf;
    const tick=()=>{
      const cur=q;q=[];p=[];
      cur.forEach(fn=>{Math.random()<.5?q.push(fn):fn();});
      q.push(...p); if(q.length)raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    const resize=()=>{
      cancelAnimationFrame(raf);ctx.clearRect(0,0,w,h);
      w=window.innerWidth;h=window.innerHeight;c.width=w;c.height=h;
      ctx.lineWidth=1;ctx.strokeStyle=color;
      q=[()=>b(rn()*w,-5,H),()=>b(rn()*w,h+5,-H),()=>b(-5,rn()*h,0),()=>b(w+5,rn()*h,PI)];
      raf=requestAnimationFrame(tick);
    };
    window.addEventListener("resize",resize);
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[color]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}/>;
}

function Background({t}) {
  return (
    <>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:t.bg}}/>
      <PlumCanvas color={t.branch}/>
      {t.blobs.map((c,i)=>(
        <div key={i} style={{position:"fixed",zIndex:0,pointerEvents:"none",
          ...[{top:"-12%",left:"8%",width:"44%",height:"44%"},{bottom:"4%",right:"4%",width:"32%",height:"32%"},{top:"38%",left:"32%",width:"28%",height:"28%"}][i],
          borderRadius:"50%",background:`radial-gradient(circle,${c} 0%,transparent 70%)`,filter:"blur(70px)"
        }}/>
      ))}
      {/* Mica noise grain (macOS Liquid Glass texture) */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:t.dark?0.018:0.012,
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize:"128px"
      }}/>
    </>
  );
}

/* ─── GLASS CARD (Liquid Glass macOS spec) ──────────────────────── */
function GlassCard({children,style={},onClick,t}) {
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:hov?t.glassHov:t.glass,
        backdropFilter:t.glassBlur, WebkitBackdropFilter:t.glassBlur,
        /* macOS Liquid Glass: top+left specular edge highlights */
        border:`1px solid ${hov?t.specular:t.border}`,
        borderTop:`1.5px solid ${t.specular}`,
        borderLeft:`1.5px solid ${t.specularSide}`,
        boxShadow:hov?t.shadowHov:t.shadow,
        borderRadius:t.r.lg,
        transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        position:"relative", overflow:"hidden",
        cursor:onClick?"pointer":"default",
        ...style,
      }}
    >
      {/* inner specular bloom */}
      <div style={{position:"absolute",inset:0,borderRadius:t.r.lg,background:"linear-gradient(135deg,rgba(255,255,255,0.09) 0%,transparent 55%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1}}>{children}</div>
    </div>
  );
}

/* ─── SHARED ATOMS ──────────────────────────────────────────────── */
const Pill=({children,t})=>(
  <span style={{fontFamily:"var(--mono)",fontSize:10,padding:"3px 9px",borderRadius:t.r.pill,background:t.accentPill,border:`1px solid ${t.accentBorder}`,color:t.accent,fontWeight:600,letterSpacing:"0.02em"}}>{children}</span>
);

function SectionHead({children,sub,t}) {
  return (
    <div style={{marginBottom:28}}>
      <h2 style={{fontFamily:"var(--heading)",fontSize:"clamp(20px,4vw,26px)",fontWeight:700,color:t.textPrimary,margin:"0 0 5px",letterSpacing:"-0.03em"}}>{children}</h2>
      {sub&&<p style={{fontFamily:"var(--sans)",fontSize:13,color:t.textTertiary,margin:"0 0 10px"}}>{sub}</p>}
      <div style={{display:"flex",gap:4}}>
        <div style={{width:28,height:2.5,background:t.accent,borderRadius:t.r.pill}}/>
        <div style={{width:10,height:2.5,background:t.accentBorder,borderRadius:t.r.pill}}/>
      </div>
    </div>
  );
}

/* ─── THEME TOGGLE ICON BUTTON ──────────────────────────────────── */
/* Shows icon of what it WILL switch TO: moon = click to go dark, sun = click to go light */
function ThemeToggle({dark,setDark,t,style={}}) {
  return (
    <button onClick={()=>setDark(d=>!d)}
      title={dark?"Switch to Light":"Switch to Dark"}
      style={{
        display:"flex",alignItems:"center",justifyContent:"center",
        width:34,height:34,borderRadius:t.r.pill,
        background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,
        border:`1.5px solid ${t.specular}`,
        boxShadow:t.shadowCard,cursor:"pointer",
        fontSize:17,transition:"all 0.2s",
        ...style,
      }}
      onMouseEnter={e=>{e.currentTarget.style.background=t.glassHov;e.currentTarget.style.boxShadow=t.shadowHov;}}
      onMouseLeave={e=>{e.currentTarget.style.background=t.glass;e.currentTarget.style.boxShadow=t.shadowCard;}}
    >
      {/* shows what you'll switch TO */}
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

/* ─── COMMAND PALETTE ───────────────────────────────────────────── */
function CommandPalette({open,onClose,t}) {
  const [q,setQ]=useState(""); const [sel,setSel]=useState(0);
  const inp=useRef(null);
  useEffect(()=>{if(open){setQ("");setSel(0);setTimeout(()=>inp.current?.focus(),50);}},[ open]);
  const f=CMD_ITEMS.filter(i=>i.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(()=>{
    const h=(e)=>{
      if(e.key==="ArrowDown"){e.preventDefault();setSel(s=>Math.min(s+1,f.length-1));}
      if(e.key==="ArrowUp")  {e.preventDefault();setSel(s=>Math.max(s-1,0));}
      if(e.key==="Enter")    {f[sel]?.action();onClose();}
      if(e.key==="Escape")   {onClose();}
    };
    if(open)window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[open,f,sel,onClose]);
  if(!open)return null;
  const sections=[...new Set(f.map(i=>i.section))];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"10vh 16px 0"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1.5px solid ${t.specular}`,borderRadius:t.r.xl,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.12)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:`1px solid ${t.borderLight}`}}>
          <span style={{fontSize:14,opacity:.45}}>🔍</span>
          <input ref={inp} value={q} onChange={e=>{setQ(e.target.value);setSel(0);}} placeholder="Search commands…"
            style={{flex:1,background:"none",border:"none",outline:"none",fontFamily:"var(--mono)",fontSize:13,color:t.textPrimary}}/>
          <kbd style={{fontFamily:"var(--mono)",fontSize:10,padding:"2px 7px",border:`1px solid ${t.border}`,borderRadius:t.r.sm,color:t.textTertiary,background:t.accentDim}}>Esc</kbd>
        </div>
        <div style={{maxHeight:300,overflowY:"auto",padding:"6px 0"}}>
          {sections.map(sec=>(
            <div key={sec}>
              <div style={{fontFamily:"var(--mono)",fontSize:9.5,color:t.textTertiary,padding:"6px 16px 4px",textTransform:"uppercase",letterSpacing:"0.12em"}}>{sec}</div>
              {f.filter(i=>i.section===sec).map(item=>{
                const gi=f.indexOf(item);
                return (
                  <div key={item.label} onClick={()=>{item.action();onClose();}} onMouseEnter={()=>setSel(gi)}
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",cursor:"pointer",background:sel===gi?t.accentDim:"transparent",transition:"background 0.1s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:14}}>{item.icon}</span>
                      <span style={{fontFamily:"var(--mono)",fontSize:13,color:t.textSecondary}}>{item.label}</span>
                    </div>
                    {item.hotkey&&<kbd style={{fontFamily:"var(--mono)",fontSize:10,padding:"2px 6px",border:`1px solid ${t.border}`,borderRadius:4,color:t.textTertiary}}>{item.hotkey}</kbd>}
                  </div>
                );
              })}
            </div>
          ))}
          {f.length===0&&<div style={{fontFamily:"var(--mono)",fontSize:12,color:t.textTertiary,padding:"20px 16px",textAlign:"center"}}>No results</div>}
        </div>
        <div style={{borderTop:`1px solid ${t.borderLight}`,padding:"8px 16px",display:"flex",gap:14}}>
          {[["↩","select"],["↑↓","navigate"],["Esc","close"]].map(([k,v])=>(
            <span key={v} style={{display:"flex",alignItems:"center",gap:4}}>
              <kbd style={{fontFamily:"var(--mono)",fontSize:9,padding:"1px 5px",border:`1px solid ${t.border}`,borderRadius:3,color:t.textTertiary}}>{k}</kbd>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:t.textTertiary}}>{v}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR CONTENT ───────────────────────────────────────────── */
function SidebarContent({dark,setDark,onCmdOpen,t}) {
  const typed=useTyping(TYPING);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:17,padding:"32px 22px 100px"}}>
      {/* Profile row */}
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:60,height:60,borderRadius:t.r.md,overflow:"hidden",flexShrink:0,border:`2px solid ${t.specular}`,boxShadow:t.shadowHov}}>
          <img src={IMG.profile} alt="Vatsal Mehta" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        <div>
          <h1 style={{fontFamily:"var(--heading)",fontSize:18,fontWeight:800,color:t.textPrimary,margin:"0 0 4px",letterSpacing:"-0.025em"}}>Vatsal Mehta</h1>
          <Pill t={t}>Student · BBHS</Pill>
          <div style={{fontFamily:"var(--mono)",fontSize:10,color:t.textTertiary,marginTop:5}}>📍 Blacktown, NSW, AU</div>
        </div>
      </div>

      {/* About */}
      <GlassCard t={t} style={{padding:"12px 14px"}}>
        <div style={{fontFamily:"var(--mono)",fontSize:9,color:t.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>About</div>
        <p style={{fontFamily:"var(--mono)",fontSize:11.5,color:t.textSecondary,lineHeight:1.75,margin:0}}>
          I'm currently <span style={{color:t.accent}}>{typed}</span>
          <span style={{display:"inline-block",width:"1.5px",height:"0.9em",background:t.accent,animation:"blink 1s step-end infinite",verticalAlign:"middle",marginLeft:1,borderRadius:1}}/>
        </p>
        <p style={{fontFamily:"var(--mono)",fontSize:10.5,color:t.textTertiary,lineHeight:1.7,marginTop:7,marginBottom:0}}>
          Growth mindset, adaptability, and a commitment to achieve my goals — adding value through dedication and results.
        </p>
      </GlassCard>

      {/* Stats */}
      <GlassCard t={t} style={{padding:"12px 14px"}}>
        <div style={{fontFamily:"var(--mono)",fontSize:9,color:t.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:9}}>Activity</div>
        {STATS.map((s,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<STATS.length-1?`1px solid ${t.borderLight}`:"none"}}>
            <div>
              <div style={{fontFamily:"var(--mono)",fontSize:11,color:t.textSecondary,fontWeight:500}}>{s.label}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:t.textTertiary}}>{s.sub}</div>
            </div>
            <span style={{fontFamily:"var(--mono)",fontSize:9.5,color:t.accent,background:t.accentPill,border:`1px solid ${t.accentBorder}`,padding:"2px 8px",borderRadius:t.r.pill,fontWeight:700,flexShrink:0,marginLeft:6}}>{s.val}</span>
          </div>
        ))}
        <p style={{fontFamily:"var(--mono)",fontSize:8.5,color:t.textTertiary,marginTop:5}}>* Updated 2025</p>
      </GlassCard>

      {/* Theme + Links row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:"var(--mono)",fontSize:9,color:t.textTertiary,textTransform:"uppercase",letterSpacing:"0.1em"}}>Appearance</div>
        <ThemeToggle dark={dark} setDark={setDark} t={t}/>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        <div style={{fontFamily:"var(--mono)",fontSize:9,color:t.textTertiary,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Links</div>
        {[{label:"LinkedIn",href:"https://linkedin.com/in/brain913",icon:"💼"},{label:"Email",href:"mailto:vatsalplayzforever@gmail.com",icon:"✉️"}].map(l=>(
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
            style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:t.r.md,background:t.accentDim,border:`1px solid ${t.accentBorder}`,textDecoration:"none",fontFamily:"var(--mono)",fontSize:12,color:t.accent,fontWeight:600,transition:"all 0.18s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=t.accentPill;e.currentTarget.style.boxShadow=t.shadow;}}
            onMouseLeave={e=>{e.currentTarget.style.background=t.accentDim;e.currentTarget.style.boxShadow="none";}}
          >{l.icon} {l.label}</a>
        ))}
      </div>

      <button onClick={onCmdOpen} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px 16px",borderRadius:t.r.md,background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1px solid ${t.border}`,cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,color:t.textTertiary,boxShadow:t.shadowCard}}>
        ⌘ Press Cmd + K
      </button>
    </div>
  );
}

/* ─── DESKTOP SIDEBAR ───────────────────────────────────────────── */
function Sidebar({dark,setDark,onCmdOpen,t}) {
  return (
    <aside style={{position:"sticky",top:0,height:"100vh",overflowY:"auto",overflowX:"hidden",background:t.sidebarBg,backdropFilter:t.glassNav,WebkitBackdropFilter:t.glassNav,borderRight:`1px solid ${t.border}`}}>
      <SidebarContent dark={dark} setDark={setDark} onCmdOpen={onCmdOpen} t={t}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:t.footerFade,pointerEvents:"none"}}/>
    </aside>
  );
}

/* ─── MOBILE DRAWER ─────────────────────────────────────────────── */
function MobileDrawer({open,onClose,dark,setDark,onCmdOpen,t}) {
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)",opacity:open?1:0,pointerEvents:open?"auto":"none",transition:"opacity 0.25s"}}/>
      <div style={{position:"fixed",top:0,left:0,bottom:0,zIndex:201,width:"82vw",maxWidth:300,background:t.drawerBg,backdropFilter:t.glassNav,WebkitBackdropFilter:t.glassNav,borderRight:`1px solid ${t.border}`,overflowY:"auto",transform:open?"translateX(0)":"translateX(-100%)",transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",boxShadow:t.shadowHov}}>
        <div style={{display:"flex",justifyContent:"flex-end",padding:"16px 16px 0"}}>
          <button onClick={onClose} style={{background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1px solid ${t.border}`,borderRadius:t.r.md,width:32,height:32,cursor:"pointer",fontSize:15,color:t.textSecondary,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <SidebarContent dark={dark} setDark={setDark} onCmdOpen={()=>{onClose();onCmdOpen();}} t={t}/>
      </div>
    </>
  );
}

/* ─── MOBILE HEADER ─────────────────────────────────────────────── */
function MobileHeader({onMenuOpen,onCmdOpen,dark,setDark,t}) {
  return (
    <header style={{position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:t.navBg,backdropFilter:t.glassNav,WebkitBackdropFilter:t.glassNav,borderBottom:`1px solid ${t.border}`}}>
      <button onClick={onMenuOpen} style={{background:t.glass,border:`1px solid ${t.border}`,borderRadius:t.r.sm,padding:"7px 10px",cursor:"pointer",display:"flex",flexDirection:"column",gap:4}}>
        {[18,14,18].map((w,i)=><span key={i} style={{display:"block",width:w,height:1.5,background:t.textSecondary,borderRadius:2}}/>)}
      </button>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:t.r.sm,overflow:"hidden",border:`1.5px solid ${t.border}`}}>
          <img src={IMG.profile} alt="Vatsal" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        <span style={{fontFamily:"var(--heading)",fontSize:15,fontWeight:700,color:t.textPrimary}}>Vatsal Mehta</span>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <ThemeToggle dark={dark} setDark={setDark} t={t}/>
        <button onClick={onCmdOpen} style={{background:t.glass,border:`1px solid ${t.border}`,borderRadius:t.r.sm,padding:"7px 10px",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,color:t.textTertiary}}>⌘K</button>
      </div>
    </header>
  );
}

/* ─── DESKTOP NAV ───────────────────────────────────────────────── */
function DesktopNav({active,setActive,t}) {
  return (
    <nav style={{position:"sticky",top:0,zIndex:10,display:"flex",overflowX:"auto",background:t.navBg,backdropFilter:t.glassNav,WebkitBackdropFilter:t.glassNav,borderBottom:`1px solid ${t.border}`,padding:"0 20px",scrollbarWidth:"none"}}>
      {TABS.map(tab=>(
        <button key={tab} onClick={()=>setActive(tab)}
          style={{background:"none",border:"none",cursor:"pointer",padding:"13px 14px",fontFamily:"var(--mono)",fontSize:11,color:active===tab?t.accent:t.textTertiary,borderBottom:active===tab?`2px solid ${t.accent}`:"2px solid transparent",marginBottom:-1,transition:"all 0.15s",whiteSpace:"nowrap"}}
          onMouseEnter={e=>{if(active!==tab)e.currentTarget.style.color=t.textSecondary;}}
          onMouseLeave={e=>{if(active!==tab)e.currentTarget.style.color=t.textTertiary;}}
        >{tab}</button>
      ))}
    </nav>
  );
}

/* ─── MOBILE BOTTOM TAB BAR ─────────────────────────────────────── */
function MobileMoreMenu({active,setActive,t}) {
  const [open,setOpen]=useState(false);
  const rest=TABS.slice(5);
  return (
    <div style={{flex:1,position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 4px 6px",background:"none",border:"none",cursor:"pointer"}}>
        <span style={{fontSize:18}}>⋯</span>
        <span style={{fontFamily:"var(--mono)",fontSize:9,color:rest.includes(active)?t.accent:t.textTertiary}}>More</span>
        {rest.includes(active)&&<div style={{width:4,height:4,borderRadius:"50%",background:t.accent,marginTop:-2}}/>}
      </button>
      {open&&(
        <div style={{position:"absolute",bottom:"100%",right:0,background:t.moreMenuBg,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1px solid ${t.border}`,borderRadius:t.r.lg,overflow:"hidden",boxShadow:t.shadowHov,minWidth:140}}>
          {rest.map(tab=>(
            <button key={tab} onClick={()=>{setActive(tab);setOpen(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 14px",background:active===tab?t.accentDim:"transparent",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:12,color:active===tab?t.accent:t.textSecondary,textAlign:"left"}}>
              <span>{TAB_ICON[tab]}</span>{TAB_S[tab]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function MobileTabBar({active,setActive,t}) {
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,display:"flex",background:t.navBg,backdropFilter:t.glassNav,WebkitBackdropFilter:t.glassNav,borderTop:`1px solid ${t.border}`,paddingBottom:"env(safe-area-inset-bottom,8px)"}}>
      {TABS.slice(0,5).map(tab=>(
        <button key={tab} onClick={()=>setActive(tab)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 4px 6px",background:"none",border:"none",cursor:"pointer"}}>
          <span style={{fontSize:17}}>{TAB_ICON[tab]}</span>
          <span style={{fontFamily:"var(--mono)",fontSize:9,color:active===tab?t.accent:t.textTertiary,transition:"color 0.15s"}}>{TAB_S[tab]}</span>
          {active===tab&&<div style={{width:4,height:4,borderRadius:"50%",background:t.accent,marginTop:-2}}/>}
        </button>
      ))}
      <MobileMoreMenu active={active} setActive={setActive} t={t}/>
    </nav>
  );
}

/* ══════ SECTIONS ══════════════════════════════════════════════════ */

function WorkExperience({t}) {
  const [exp,setExp]=useState(null);
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="Roles, volunteering, and community work" t={t}>Work Experience</SectionHead>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {EXPERIENCE.map((e,i)=>{
          const isOpen=exp===i;
          const logoSrc=t.dark&&e.logoDark?e.logoDark:e.logo;
          return (
            <GlassCard key={i} t={t} onClick={()=>setExp(isOpen?null:i)} style={{padding:"18px 20px",cursor:"pointer"}}>
              <div style={{display:"flex",gap:13,alignItems:"flex-start"}}>
                <div style={{width:42,height:42,borderRadius:t.r.md,overflow:"hidden",flexShrink:0,border:`1px solid ${t.border}`,background:e.logoOnDark&&!t.dark?"#f8f7f4":t.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.03)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <img src={logoSrc} alt={e.company} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={ev=>ev.target.style.display="none"}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
                    <div>
                      <div style={{fontFamily:"var(--heading)",fontSize:14,fontWeight:700,color:t.textPrimary,marginBottom:2}}>{e.role}</div>
                      <a href={e.link} target="_blank" rel="noreferrer" onClick={ev=>ev.stopPropagation()} style={{fontFamily:"var(--mono)",fontSize:12,color:t.accent,textDecoration:"none",fontWeight:600}}>{e.company} ↗</a>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <Pill t={t}>{e.period}</Pill>
                      <div style={{fontFamily:"var(--mono)",fontSize:9.5,color:t.textTertiary,marginTop:4}}>{e.location}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
                    {e.tags.map(tg=><Pill key={tg} t={t}>{tg}</Pill>)}
                  </div>
                </div>
                <span style={{fontSize:13,color:t.textTertiary,transition:"transform 0.2s",transform:isOpen?"rotate(90deg)":"none",flexShrink:0,marginTop:2}}>›</span>
              </div>
              {isOpen&&(
                <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${t.borderLight}`,animation:"slideDown 0.22s ease"}}>
                  {e.siteImg&&(
                    <div style={{borderRadius:t.r.md,overflow:"hidden",marginBottom:14,maxHeight:200}}>
                      <img src={e.siteImg} alt={e.company} style={{width:"100%",objectFit:"cover",display:"block",maxHeight:200}}/>
                    </div>
                  )}
                  <p style={{fontFamily:"var(--sans)",fontSize:13,color:t.textSecondary,lineHeight:1.72,marginBottom:12}}>{e.summary}</p>
                  <ul style={{paddingLeft:16,margin:0,display:"flex",flexDirection:"column",gap:5}}>
                    {e.achievements.map((a,j)=><li key={j} style={{fontFamily:"var(--sans)",fontSize:12.5,color:t.textSecondary,lineHeight:1.6}}>{a}</li>)}
                  </ul>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

function Education({t}) {
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="Academic background & certifications" t={t}>Education</SectionHead>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
        {EDUCATION.map((e,i)=>(
          <GlassCard key={i} t={t} style={{padding:"15px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
              <div>
                <div style={{fontFamily:"var(--heading)",fontSize:14,fontWeight:700,color:t.textPrimary,marginBottom:2}}>{e.school}</div>
                <div style={{fontFamily:"var(--mono)",fontSize:11,color:t.textSecondary}}>{e.role}</div>
              </div>
              <Pill t={t}>{e.period}</Pill>
            </div>
          </GlassCard>
        ))}
      </div>
      <SectionHead sub="Google Developer Programme & courses" t={t}>Certificates</SectionHead>
      <div style={{display:"flex",flexDirection:"column"}}>
        {CERTIFICATES.map((c,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<CERTIFICATES.length-1?`1px solid ${t.borderLight}`:"none",gap:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",flex:1,minWidth:0}}>
              <span style={{fontSize:12}}>🎓</span>
              <div style={{fontFamily:"var(--sans)",fontSize:12.5,color:t.textSecondary,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:t.textTertiary}}>{c.issuer}</span>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:t.accent,background:t.accentDim,padding:"1px 7px",borderRadius:t.r.pill}}>{c.year}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function References({t}) {
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="What people say about working with me" t={t}>References</SectionHead>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {REFERENCES.map((r,i)=>(
          <GlassCard key={i} t={t} style={{padding:"20px 22px"}}>
            <p style={{fontFamily:"var(--sans)",fontSize:13.5,color:t.textSecondary,lineHeight:1.78,fontStyle:"italic",margin:"0 0 16px"}}>"{r.text}"</p>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:t.accentPill,border:`1.5px solid ${t.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:t.accent,flexShrink:0}}>{r.initials}</div>
              <div style={{fontFamily:"var(--heading)",fontSize:13,fontWeight:700,color:t.textPrimary}}>{r.name}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function TechStack({t}) {
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="Tools and languages I use daily" t={t}>Tech Stack</SectionHead>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(138px,1fr))",gap:10}}>
        {SKILLS.map((s,i)=>(
          <GlassCard key={i} t={t} style={{padding:"13px 15px"}}>
            <div style={{fontFamily:"var(--mono)",fontSize:18,marginBottom:5}}>{s.icon}</div>
            <div style={{fontFamily:"var(--mono)",fontSize:12,color:t.textSecondary,fontWeight:500}}>{s.name}</div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function Gallery({t}) {
  const groups={};
  GALLERY.forEach(item=>{if(!groups[item.label])groups[item.label]=[];groups[item.label].push(item);});
  const [lb,setLb]=useState(null);
  const [lbIdx,setLbIdx]=useState(0);
  const openLb=(label,items,idx=0)=>{setLb({label,items});setLbIdx(idx);};
  const lbNav=dir=>setLbIdx(i=>(i+dir+lb.items.length)%lb.items.length);

  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="Moments, events and memories — tap to cycle · ⛶ to expand" t={t}>Gallery</SectionHead>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(178px,1fr))",gap:10,marginBottom:32}}>
        {Object.entries(groups).map(([label,items])=>{
          const [idx,setIdx]=useState(0);
          const current=items[idx];
          const isMulti=items.length>1;
          return (
            <div key={label}
              onClick={()=>isMulti?setIdx(i=>(i+1)%items.length):openLb(label,items,0)}
              style={{borderRadius:t.r.lg,overflow:"hidden",position:"relative",aspectRatio:"4/3",cursor:"pointer",boxShadow:t.shadow,border:`1px solid ${t.border}`,transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shadowHov;e.currentTarget.style.transform="scale(1.025)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadow;e.currentTarget.style.transform="none";}}
            >
              <img src={current.src} alt={label} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",animation:"imgFade 0.22s ease"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)",pointerEvents:"none"}}/>
              {/* macOS-style glass expand button */}
              <button onClick={e=>{e.stopPropagation();openLb(label,items,idx);}}
                style={{position:"absolute",top:7,left:7,width:26,height:26,borderRadius:t.r.sm,background:"rgba(255,255,255,0.72)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.9)",color:"#333",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.18)"}}>⛶</button>
              {isMulti&&(
                <>
                  <div style={{position:"absolute",top:7,right:7,background:"rgba(0,0,0,0.48)",backdropFilter:"blur(8px)",borderRadius:t.r.pill,padding:"2px 7px",fontFamily:"var(--mono)",fontSize:9,color:"#fff",pointerEvents:"none"}}>{idx+1}/{items.length}</div>
                  <div style={{position:"absolute",top:7,left:0,right:0,display:"flex",justifyContent:"center",gap:4,pointerEvents:"none"}}>
                    {items.map((_,di)=><div key={di} style={{width:di===idx?13:5,height:5,borderRadius:t.r.pill,background:di===idx?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.38)",transition:"all 0.22s"}}/>)}
                  </div>
                  <div style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",fontSize:20,color:"rgba(255,255,255,0.5)",pointerEvents:"none",fontWeight:300}}>›</div>
                </>
              )}
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 10px",pointerEvents:"none"}}>
                <div style={{fontFamily:"var(--sans)",fontSize:11,color:"#fff",fontWeight:600,marginBottom:2}}>{label}</div>
                <div style={{fontFamily:"var(--sans)",fontSize:9.5,color:"rgba(255,255,255,0.62)",lineHeight:1.4}}>{current.caption}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Lightbox */}
      {lb&&(
        <div onClick={()=>setLb(null)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:740,width:"100%",background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1.5px solid ${t.specular}`,borderRadius:t.r.xl,overflow:"hidden",boxShadow:t.shadowHov}}>
            <div style={{position:"relative"}}>
              <img src={lb.items[lbIdx].src} alt={lb.label} style={{width:"100%",display:"block",maxHeight:460,objectFit:"cover",animation:"imgFade 0.2s ease"}}/>
              {lb.items.length>1&&[-1,1].map(dir=>(
                <button key={dir} onClick={e=>{e.stopPropagation();lbNav(dir);}} style={{position:"absolute",[dir===-1?"left":"right"]:10,top:"50%",transform:"translateY(-50%)",width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.78)",backdropFilter:"blur(8px)",border:`1px solid ${t.border}`,color:t.textPrimary,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:t.shadow}}>{dir===-1?"‹":"›"}</button>
              ))}
              {lb.items.length>1&&(
                <div style={{position:"absolute",bottom:10,left:0,right:0,display:"flex",justifyContent:"center",gap:5}}>
                  {lb.items.map((_,di)=><div key={di} onClick={e=>{e.stopPropagation();setLbIdx(di);}} style={{width:di===lbIdx?16:6,height:6,borderRadius:t.r.pill,background:di===lbIdx?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.4)",transition:"all 0.22s",cursor:"pointer"}}/>)}
                </div>
              )}
            </div>
            <div style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"var(--heading)",color:t.textPrimary,fontSize:14,fontWeight:700,marginBottom:3,display:"flex",alignItems:"center",gap:8}}>
                  {lb.items[lbIdx].label}
                  {lb.items.length>1&&<span style={{fontFamily:"var(--mono)",fontSize:9.5,color:t.accent,background:t.accentDim,padding:"1px 7px",borderRadius:t.r.pill}}>{lbIdx+1} / {lb.items.length}</span>}
                </div>
                <div style={{fontFamily:"var(--sans)",fontSize:12,color:t.textSecondary}}>{lb.items[lbIdx].caption}</div>
              </div>
              <button onClick={()=>setLb(null)} style={{background:t.accentDim,border:`1px solid ${t.accentBorder}`,borderRadius:t.r.md,padding:"6px 14px",fontFamily:"var(--mono)",fontSize:12,color:t.accent,cursor:"pointer",fontWeight:700,flexShrink:0,marginLeft:12}}>✕</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Projects({t}) {
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="Creative & multimedia work" t={t}>Projects</SectionHead>
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        {PROJECTS.map((p,i)=>(
          <GlassCard key={i} t={t} style={{overflow:"hidden",padding:0}}>
            <video src={p.src} autoPlay loop muted playsInline style={{width:"100%",display:"block",maxHeight:280,objectFit:"cover"}}/>
            <div style={{padding:"14px 20px"}}>
              <div style={{fontFamily:"var(--heading)",color:t.textPrimary,fontSize:15,fontWeight:700,marginBottom:4}}>{p.label}</div>
              <div style={{fontFamily:"var(--sans)",fontSize:12.5,color:t.textSecondary,lineHeight:1.6}}>{p.caption}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function Connect({t}) {
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="My goal is to add value through dedication, communication and results." t={t}>Connect</SectionHead>
      <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:520}}>
        {CONNECT.map(c=>(
          <a key={c.label} href={c.href} target={c.href.startsWith("http")?"_blank":undefined} rel="noreferrer"
            style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderRadius:t.r.lg,textDecoration:"none",background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1px solid ${t.border}`,borderTop:`1.5px solid ${t.specular}`,boxShadow:t.shadowCard,transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)"}}
            onMouseEnter={e=>{e.currentTarget.style.background=t.glassHov;e.currentTarget.style.boxShadow=t.shadowHov;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background=t.glass;e.currentTarget.style.boxShadow=t.shadowCard;e.currentTarget.style.transform="none";}}
          >
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:40,height:40,borderRadius:t.r.md,flexShrink:0,background:t.accentDim,border:`1px solid ${t.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{c.icon}</div>
              <div>
                <div style={{fontFamily:"var(--mono)",fontSize:9,color:t.textTertiary,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{c.label}</div>
                <div style={{fontFamily:"var(--sans)",fontSize:13,color:t.textPrimary,fontWeight:600}}>{c.val}</div>
              </div>
            </div>
            <span style={{color:t.accent,fontSize:18,fontWeight:300}}>→</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─── ROOT ──────────────────────────────────────────────────────── */
const SECTIONS = {
  "Work Experience":WorkExperience,
  "Education":Education,
  "References":References,
  "Tech Stack":TechStack,
  "Gallery":Gallery,
  "Projects":Projects,
  "Connect":Connect,
};

export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState("Work Experience");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const isMobile = useIsMobile();
  const tok = T(dark);
  const Section = SECTIONS[active];

  const openCmd  = useCallback(()=>setCmdOpen(true),[]);
  const closeCmd = useCallback(()=>setCmdOpen(false),[]);

  useEffect(()=>{
    const h=(e)=>{
      const ctrl=e.ctrlKey||e.metaKey;
      if(ctrl&&e.key==="k"){e.preventDefault();setCmdOpen(o=>!o);}
      if(cmdOpen)return;
      if(ctrl&&e.key==="l"){e.preventDefault();window.open("https://linkedin.com/in/brain913","_blank");}
      if(ctrl&&e.key==="e"){e.preventDefault();window.location.href="mailto:vatsalplayzforever@gmail.com";}
      if(ctrl&&e.key==="p"){e.preventDefault();window.print();}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[cmdOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
        :root {
          --heading: 'Syne', sans-serif;
          --sans: 'Inter', sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { min-height:100vh; background:${tok.bg}; color:${tok.textPrimary}; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes imgFade { from{opacity:0;transform:scale(1.02)} to{opacity:1;transform:scale(1)} }
        .slide-up { animation:slideUp 0.26s ease forwards; }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${tok.accentBorder}; border-radius:3px; }
        aside::-webkit-scrollbar, nav::-webkit-scrollbar { display:none; }
        .g-desktop { display:grid; }
        .g-sidebar { display:block; }
        .g-topnav  { display:flex; }
        .g-mhdr    { display:none; }
        .g-mtab    { display:none; }
        @media(max-width:767px){
          .g-desktop { display:block; }
          .g-sidebar { display:none; }
          .g-topnav  { display:none; }
          .g-mhdr    { display:flex; }
          .g-mtab    { display:flex; }
        }
        @media print { canvas,.g-mtab,.g-mhdr { display:none !important; } }
      `}</style>

      <Background t={tok}/>
      <CommandPalette open={cmdOpen} onClose={closeCmd} t={tok}/>
      {isMobile&&<MobileDrawer open={drawer} onClose={()=>setDrawer(false)} dark={dark} setDark={setDark} onCmdOpen={openCmd} t={tok}/>}

      <div className="g-desktop" style={{position:"relative",zIndex:1,gridTemplateColumns:"260px 1fr",maxWidth:1340,margin:"0 auto",minHeight:"100vh"}}>
        <div className="g-sidebar">
          <Sidebar dark={dark} setDark={setDark} onCmdOpen={openCmd} t={tok}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
          <div className="g-mhdr">
            <MobileHeader onMenuOpen={()=>setDrawer(true)} onCmdOpen={openCmd} dark={dark} setDark={setDark} t={tok}/>
          </div>
          <div className="g-topnav">
            <DesktopNav active={active} setActive={setActive} t={tok}/>
          </div>

          <main key={active} className="slide-up" style={{flex:1}}>
            <Section t={tok}/>
          </main>

          <div style={{position:"sticky",bottom:0,height:80,background:tok.footerFade,pointerEvents:"none"}}/>
          <footer style={{padding:"12px clamp(16px,4vw,36px) clamp(72px,11vw,32px)",borderTop:`1px solid ${tok.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,background:tok.navBg,backdropFilter:tok.glassNav,WebkitBackdropFilter:tok.glassNav}}>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:tok.textTertiary}}>© 2025 Vatsal Mehta · Blacktown, NSW</span>
            <button onClick={openCmd} style={{background:tok.glass,backdropFilter:tok.glassBlur,WebkitBackdropFilter:tok.glassBlur,border:`1px solid ${tok.border}`,borderRadius:tok.r.md,padding:"4px 10px",cursor:"pointer",fontFamily:"var(--mono)",fontSize:10,color:tok.textTertiary}}>⌘K</button>
          </footer>
        </div>
      </div>

      {isMobile&&<MobileTabBar active={active} setActive={t=>{setActive(t);setDrawer(false);}} t={tok}/>}
    </>
  );
}
