export const createTokens = (dark) => ({
  dark,
  bg: dark ? "#0f0e0c" : "#f9f7f4",
  bgSub: dark ? "#141210" : "#f0ede8",
  glass: dark ? "rgba(255,248,240,0.07)" : "rgba(255,255,255,0.68)",
  glassHov: dark ? "rgba(255,248,240,0.13)" : "rgba(255,255,255,0.88)",
  glassBlur: "blur(28px) saturate(180%) brightness(1.04)",
  glassNav: dark
    ? "blur(40px) saturate(200%) brightness(0.97)"
    : "blur(40px) saturate(220%) brightness(1.02)",
  specular: dark ? "rgba(255,248,235,0.16)" : "rgba(255,255,255,0.94)",
  specularSide: dark ? "rgba(255,248,235,0.07)" : "rgba(255,255,255,0.55)",
  border: dark ? "rgba(255,248,235,0.1)" : "rgba(0,0,0,0.07)",
  borderLight: dark ? "rgba(255,248,235,0.055)" : "rgba(0,0,0,0.04)",
  textPrimary: dark ? "rgba(255,248,234,0.92)" : "#1c1917",
  textSecondary: dark ? "rgba(255,238,210,0.58)" : "#57534a",
  textTertiary: dark ? "rgba(255,230,195,0.34)" : "#9c9488",
  accent: dark ? "#c9ad87" : "#4a3728",
  accentRgb: dark ? "201,173,135" : "74,55,40",
  accentDim: dark ? "rgba(201,173,135,0.1)" : "rgba(74,55,40,0.07)",
  accentBorder: dark ? "rgba(201,173,135,0.22)" : "rgba(74,55,40,0.18)",
  accentPill: dark ? "rgba(201,173,135,0.14)" : "rgba(74,55,40,0.09)",
  shadow: dark
    ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.28)"
    : "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
  shadowHov: dark
    ? "0 16px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.38)"
    : "0 8px 36px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
  shadowCard: dark
    ? "0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,248,235,0.09)"
    : "0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95), inset 1px 0 0 rgba(255,255,255,0.55)",
  navBg: dark ? "rgba(15,14,12,0.88)" : "rgba(249,247,244,0.88)",
  sidebarBg: dark ? "rgba(15,14,12,0.82)" : "rgba(249,247,244,0.82)",
  drawerBg: dark ? "rgba(15,14,12,0.97)" : "rgba(249,247,244,0.97)",
  moreMenuBg: dark ? "rgba(18,16,13,0.98)" : "rgba(250,248,245,0.98)",
  footerFade: dark
    ? "linear-gradient(to top,#0f0e0c,transparent)"
    : "linear-gradient(to top,#f9f7f4,transparent)",
  branch: dark ? "rgba(201,173,135,0.06)" : "rgba(74,55,40,0.05)",
  blobs: dark
    ? ["rgba(201,173,135,0.045)", "rgba(180,140,100,0.03)", "rgba(220,190,150,0.025)"]
    : ["rgba(74,55,40,0.04)", "rgba(120,95,70,0.03)", "rgba(160,130,100,0.02)"],
  r: { sm: "10px", md: "14px", lg: "20px", xl: "28px", pill: "999px" },
});
