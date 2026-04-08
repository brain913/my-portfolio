import { useState, useEffect, useRef, useCallback } from "react";
import { createTokens } from "./theme/tokens";
import { IMG, TYPING, STATS, EXPERIENCE, EDUCATION, CERTIFICATES, REFERENCES, SKILLS, GALLERY, PROJECTS, CONNECT, TABS, TAB_S, TAB_ICON } from "./data/portfolioData";

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

/* ─── CONTENT DATA MOVED TO src/data/portfolioData.js ───────────── */

const CMD_ITEMS = [
  {section:"Actions",label:"Print Resume",icon:"🖨", hotkey:"Ctrl+P",action:()=>window.print()},
  {section:"Social", label:"LinkedIn",   icon:"💼", hotkey:"Ctrl+L",action:()=>window.open("https://linkedin.com/in/brain913","_blank")},
  {section:"Social", label:"Email",      icon:"✉️", hotkey:"Ctrl+E",action:()=>{window.location.href="mailto:vatsalplayzforever@gmail.com";}},
  {section:"Social", label:"Instagram",  icon:"📸", hotkey:"",      action:()=>window.open("https://instagram.com/brain913","_blank")},
  {section:"Coding", label:"GitHub",     icon:"🐙", hotkey:"",      action:()=>window.open("https://github.com/brain913","_blank")},
];



function Background({t}) {
  return (
    <>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:t.bg}}/>
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
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
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
  useEffect(()=>{if(open){setTimeout(()=>inp.current?.focus(),50);}},[ open]);
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
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1.5px solid ${t.specular}`,borderRadius:t.r.xl,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.12)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:`1px solid ${t.borderLight}`}}>
          <span style={{fontSize:14,opacity:.45}}>🔍</span>
          <input aria-label="Search commands" ref={inp} value={q} onChange={e=>{setQ(e.target.value);setSel(0);}} placeholder="Search commands…"
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
      <div role="dialog" aria-modal="true" aria-label="Navigation menu" style={{position:"fixed",top:0,left:0,bottom:0,zIndex:201,width:"82vw",maxWidth:300,background:t.drawerBg,backdropFilter:t.glassNav,WebkitBackdropFilter:t.glassNav,borderRight:`1px solid ${t.border}`,overflowY:"auto",transform:open?"translateX(0)":"translateX(-100%)",transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",boxShadow:t.shadowHov}}>
        <div style={{display:"flex",justifyContent:"flex-end",padding:"16px 16px 0"}}>
          <button aria-label="Close menu" onClick={onClose} style={{background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1px solid ${t.border}`,borderRadius:t.r.md,width:32,height:32,cursor:"pointer",fontSize:15,color:t.textSecondary,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
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
      <button aria-label="Open menu" onClick={onMenuOpen} style={{background:t.glass,border:`1px solid ${t.border}`,borderRadius:t.r.sm,padding:"7px 10px",cursor:"pointer",display:"flex",flexDirection:"column",gap:4}}>
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
        <button aria-label="Open command palette" onClick={onCmdOpen} style={{background:t.glass,border:`1px solid ${t.border}`,borderRadius:t.r.sm,padding:"7px 10px",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,color:t.textTertiary}}>⌘K</button>
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

function FeaturedExperienceCard({ e, t }) {
  const logoSrc=t.dark&&e.logoDark?e.logoDark:e.logo;
  return (
    <GlassCard t={t} style={{padding:0, overflow:"hidden"}}>
      {e.siteImg&&<img src={e.siteImg} alt={e.company} style={{width:"100%",maxHeight:230,objectFit:"cover",display:"block"}}/>}
      <div style={{padding:"16px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap",marginBottom:8}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:34,height:34,borderRadius:t.r.sm,overflow:"hidden",border:`1px solid ${t.border}`}}>
              <img src={logoSrc} alt={e.company} style={{width:"100%",height:"100%",objectFit:"cover"}} />
            </div>
            <div>
              <div style={{fontFamily:"var(--heading)",fontSize:14,fontWeight:700,color:t.textPrimary}}>{e.role}</div>
              <a href={e.link} target="_blank" rel="noreferrer" style={{fontFamily:"var(--mono)",fontSize:11,color:t.accent,textDecoration:"none"}}>{e.company} ↗</a>
            </div>
          </div>
          <Pill t={t}>{e.period}</Pill>
        </div>
        <p style={{fontFamily:"var(--sans)",fontSize:12.5,color:t.textSecondary,lineHeight:1.65,marginBottom:8}}>{e.summary}</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{e.tags.map(tag=><Pill key={tag} t={t}>{tag}</Pill>)}</div>
      </div>
    </GlassCard>
  );
}

function Overview({t}) {
  const featured = EXPERIENCE.slice(0,2);
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <div style={{marginBottom:28,maxWidth:760}}>
        <p style={{fontFamily:"var(--mono)",fontSize:10,color:t.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Overview</p>
        <h1 style={{fontFamily:"var(--heading)",fontSize:"clamp(28px,6vw,52px)",lineHeight:1.05,color:t.textPrimary,margin:"0 0 10px"}}>
          Student builder focused on technology, community, and practical impact.
        </h1>
        <p style={{fontFamily:"var(--sans)",fontSize:14,color:t.textSecondary,lineHeight:1.7,marginBottom:14}}>
          I design and run student initiatives, compete in STEM programs, and build projects that connect people with opportunities.
        </p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <a href="mailto:vatsalplayzforever@gmail.com" style={{padding:"10px 14px",borderRadius:t.r.md,background:t.accentPill,border:`1px solid ${t.accentBorder}`,textDecoration:"none",fontFamily:"var(--mono)",fontSize:12,color:t.accent,fontWeight:700}}>Contact Me</a>
          <a href="https://linkedin.com/in/brain913" target="_blank" rel="noreferrer" style={{padding:"10px 14px",borderRadius:t.r.md,background:t.glass,border:`1px solid ${t.border}`,textDecoration:"none",fontFamily:"var(--mono)",fontSize:12,color:t.textSecondary}}>View LinkedIn ↗</a>
        </div>
      </div>
      <SectionHead sub="Featured work and leadership highlights" t={t}>Featured Experience</SectionHead>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
        {featured.map((item)=><FeaturedExperienceCard key={item.company+item.period} e={item} t={t} />)}
      </div>
    </section>
  );
}

function WorkExperience({t}) {
  const [exp,setExp]=useState(null);
  const featured = EXPERIENCE.slice(0,2);
  const timeline = EXPERIENCE.slice(2);
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="Featured case studies and timeline" t={t}>Work Experience</SectionHead>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12,marginBottom:18}}>
        {featured.map((item)=><FeaturedExperienceCard key={item.company+item.period} e={item} t={t} />)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {timeline.map((e,i)=>{
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
  const [expanded, setExpanded] = useState({});
  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="What people say about working with me" t={t}>References</SectionHead>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {REFERENCES.map((r,i)=>(
          <GlassCard key={i} t={t} style={{padding:"20px 22px"}}>
            <p style={{fontFamily:"var(--sans)",fontSize:13.5,color:t.textSecondary,lineHeight:1.78,fontStyle:"italic",margin:"0 0 10px"}}>
              "{expanded[i] ? r.text : `${r.text.slice(0, 190)}...`}"
            </p>
            <button
              onClick={()=>setExpanded((s)=>({ ...s, [i]: !s[i] }))}
              style={{marginBottom:12,background:"none",border:"none",padding:0,color:t.accent,cursor:"pointer",fontFamily:"var(--mono)",fontSize:11}}
            >
              {expanded[i] ? "Show less" : "Read more"}
            </button>
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

function GalleryGroupCard({ label, items, t, onOpen }) {
  const [idx,setIdx]=useState(0);
  const current=items[idx];
  const isMulti=items.length>1;
  return (
    <div
      onClick={()=>isMulti?setIdx(i=>(i+1)%items.length):onOpen(label,items,0)}
      style={{borderRadius:t.r.lg,overflow:"hidden",position:"relative",aspectRatio:"4/3",cursor:"pointer",boxShadow:t.shadow,border:`1px solid ${t.border}`,transition:"all 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shadowHov;e.currentTarget.style.transform="scale(1.025)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadow;e.currentTarget.style.transform="none";}}
    >
      <img src={current.src} alt={label} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",animation:"imgFade 0.22s ease"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)",pointerEvents:"none"}}/>
      <button aria-label={`Expand ${label}`} onClick={e=>{e.stopPropagation();onOpen(label,items,idx);}}
        style={{position:"absolute",top:7,left:7,width:26,height:26,borderRadius:t.r.sm,background:"rgba(255,255,255,0.72)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.9)",color:"#333",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.18)"}}>⛶</button>
      {isMulti&&(
        <>
          <div style={{position:"absolute",top:7,right:7,background:"rgba(0,0,0,0.48)",backdropFilter:"blur(8px)",borderRadius:t.r.pill,padding:"2px 7px",fontFamily:"var(--mono)",fontSize:9,color:"#fff",pointerEvents:"none"}}>{idx+1}/{items.length}</div>
          <div style={{position:"absolute",top:7,left:0,right:0,display:"flex",justifyContent:"center",gap:4,pointerEvents:"none"}}>
            {items.map((_,di)=><div key={di} style={{width:di===idx?13:5,height:5,borderRadius:t.r.pill,background:di===idx?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.38)",transition:"all 0.22s"}}/>)}
          </div>
        </>
      )}
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 10px",pointerEvents:"none"}}>
        <div style={{fontFamily:"var(--sans)",fontSize:11,color:"#fff",fontWeight:600,marginBottom:2}}>{label}</div>
        <div style={{fontFamily:"var(--sans)",fontSize:9.5,color:"rgba(255,255,255,0.62)",lineHeight:1.4}}>{current.caption}</div>
      </div>
    </div>
  );
}

function Gallery({t}) {
  const groups={};
  GALLERY.forEach(item=>{if(!groups[item.label])groups[item.label]=[];groups[item.label].push(item);});
  const [lb,setLb]=useState(null);
  const [lbIdx,setLbIdx]=useState(0);
  const openLb=(label,items,idx=0)=>{setLb({label,items});setLbIdx(idx);};
  const lbNav=useCallback((dir)=>setLbIdx(i=>(i+dir+lb.items.length)%lb.items.length),[lb]);
  useEffect(()=>{
    if(!lb) return;
    const h=(e)=>{
      if(e.key==="Escape") setLb(null);
      if(e.key==="ArrowRight" && lb.items.length>1) lbNav(1);
      if(e.key==="ArrowLeft" && lb.items.length>1) lbNav(-1);
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[lb, lbNav]);

  return (
    <section style={{padding:"clamp(20px,5vw,40px) clamp(16px,4vw,36px) 80px"}}>
      <SectionHead sub="Moments, events and memories — tap to cycle · ⛶ to expand" t={t}>Gallery</SectionHead>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(178px,1fr))",gap:10,marginBottom:32}}>
        {Object.entries(groups).map(([label,items])=>(
          <GalleryGroupCard key={label} label={label} items={items} t={t} onOpen={openLb} />
        ))}
      </div>
      {/* Lightbox */}
      {lb&&(
        <div onClick={()=>setLb(null)} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div role="dialog" aria-modal="true" aria-label={`${lb.label} lightbox`} onClick={e=>e.stopPropagation()} style={{maxWidth:740,width:"100%",background:t.glass,backdropFilter:t.glassBlur,WebkitBackdropFilter:t.glassBlur,border:`1.5px solid ${t.specular}`,borderRadius:t.r.xl,overflow:"hidden",boxShadow:t.shadowHov}}>
            <div style={{position:"relative"}}>
              <img src={lb.items[lbIdx].src} alt={lb.label} style={{width:"100%",display:"block",maxHeight:460,objectFit:"cover",animation:"imgFade 0.2s ease"}}/>
              {lb.items.length>1&&[-1,1].map(dir=>(
                <button aria-label={dir===-1?"Previous image":"Next image"} key={dir} onClick={e=>{e.stopPropagation();lbNav(dir);}} style={{position:"absolute",[dir===-1?"left":"right"]:10,top:"50%",transform:"translateY(-50%)",width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.78)",backdropFilter:"blur(8px)",border:`1px solid ${t.border}`,color:t.textPrimary,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:t.shadow}}>{dir===-1?"‹":"›"}</button>
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
              <button aria-label="Close lightbox" onClick={()=>setLb(null)} style={{background:t.accentDim,border:`1px solid ${t.accentBorder}`,borderRadius:t.r.md,padding:"6px 14px",fontFamily:"var(--mono)",fontSize:12,color:t.accent,cursor:"pointer",fontWeight:700,flexShrink:0,marginLeft:12}}>✕</button>
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
  "Overview":Overview,
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
  const [active, setActive] = useState("Overview");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const isMobile = useIsMobile();
  const tok = createTokens(dark);
  const Section = SECTIONS[active] || Overview;
  const year = new Date().getFullYear();

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
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:tok.textTertiary}}>© {year} Vatsal Mehta · Blacktown, NSW</span>
            <button aria-label="Open command palette" onClick={openCmd} style={{background:tok.glass,backdropFilter:tok.glassBlur,WebkitBackdropFilter:tok.glassBlur,border:`1px solid ${tok.border}`,borderRadius:tok.r.md,padding:"4px 10px",cursor:"pointer",fontFamily:"var(--mono)",fontSize:10,color:tok.textTertiary}}>⌘K</button>
          </footer>
        </div>
      </div>

      {isMobile&&<MobileTabBar active={active} setActive={t=>{setActive(t);setDrawer(false);}} t={tok}/>}
    </>
  );
}
