/* animations.js - Centralised Framer Motion animation system
 *
 * Usage:
 *   import { mkVariants, mkGestures, SP, EA, TR } from "./animations";
 *   const V = mkVariants(useReducedMotion());
 *   const G = mkGestures(useReducedMotion());
 *
 * All functions accept `r` = result of useReducedMotion().
 * When r=true, all durations collapse to 0 for accessibility.
 */

/* ── Easing curves ───────────────────────────────────────────────── */
export const EA = {
  out:  [0.25, 0.46, 0.45, 0.94],  /* smooth deceleration */
  in:   [0.55, 0.06, 0.68, 0.19],  /* sharp acceleration (exits) */
  io:   [0.76, 0, 0.24, 1],         /* balanced inOut */
};

/* ── Spring configs ──────────────────────────────────────────────── */
export const SP = {
  default: { type: "spring", damping: 28, stiffness: 320 },
  snappy:  { type: "spring", damping: 22, stiffness: 400 },
  bouncy:  { type: "spring", damping: 18, stiffness: 360 },
  stiff:   { type: "spring", damping: 32, stiffness: 500 },
  gentle:  { type: "spring", damping: 35, stiffness: 260 },
};

/* ── Variant factory ─────────────────────────────────────────────── */
export function mkVariants(r = false) {
  return {
    /* Page/section swap - AnimatePresence mode="wait" */
    page: {
      hidden: { opacity: 0, y: r ? 0 : 10 },
      show:   { opacity: 1, y: 0, transition: { duration: r ? 0 : 0.32, ease: EA.out } },
      exit:   { opacity: 0, y: r ? 0 : -6, transition: { duration: r ? 0 : 0.16, ease: EA.in } },
    },
    /* Stagger container - parent of item variants */
    stagger: {
      hidden: {},
      show:   { transition: { staggerChildren: r ? 0 : 0.065, delayChildren: r ? 0 : 0.04 } },
    },
    /* Stagger child */
    item: {
      hidden: { opacity: 0, y: r ? 0 : 12 },
      show:   { opacity: 1, y: 0, transition: { duration: r ? 0 : 0.26, ease: EA.out } },
    },
    /* Simple fade - overlays, image swaps */
    fade: {
      hidden: { opacity: 0 },
      show:   { opacity: 1, transition: { duration: r ? 0 : 0.22 } },
      exit:   { opacity: 0, transition: { duration: r ? 0 : 0.16 } },
    },
    /* Modal/command palette panel */
    modal: {
      hidden: { opacity: 0, scale: r ? 1 : 0.96, y: r ? 0 : -8 },
      show:   { opacity: 1, scale: 1, y: 0, transition: { duration: r ? 0 : 0.24, ease: EA.out } },
      exit:   { opacity: 0, scale: r ? 1 : 0.97, transition: { duration: r ? 0 : 0.16 } },
    },
    /* Overlay backdrop */
    backdrop: {
      hidden: { opacity: 0 },
      show:   { opacity: 1, transition: { duration: r ? 0 : 0.2 } },
      exit:   { opacity: 0, transition: { duration: r ? 0 : 0.18 } },
    },
    /* Drawer slide from left */
    drawer: {
      hidden: { x: "-100%" },
      show:   { x: 0, transition: r ? { duration: 0 } : SP.default },
      exit:   { x: "-100%", transition: r ? { duration: 0 } : { duration: 0.22, ease: EA.in } },
    },
    /* Accordion height collapse */
    accordion: {
      hidden: { opacity: 0, height: 0 },
      show:   { opacity: 1, height: "auto", transition: { duration: r ? 0 : 0.3, ease: EA.out } },
      exit:   { opacity: 0, height: 0, transition: { duration: r ? 0 : 0.2 } },
    },
    /* Popup menu */
    popup: {
      hidden: { opacity: 0, scale: r ? 1 : 0.94, y: r ? 0 : 6 },
      show:   { opacity: 1, scale: 1, y: 0, transition: r ? { duration: 0 } : SP.snappy },
      exit:   { opacity: 0, scale: r ? 1 : 0.96, transition: { duration: r ? 0 : 0.15 } },
    },
  };
}

/* ── Gesture presets ─────────────────────────────────────────────── */
export function mkGestures(r = false) {
  return {
    /* Card lift - primary interactive affordance */
    lift: {
      whileHover: r ? {} : { y: -2, transition: SP.snappy },
      whileTap:   r ? {} : { scale: 0.985, transition: SP.stiff },
    },
    /* Icon button scale */
    icon: {
      whileHover: r ? {} : { scale: 1.1, transition: SP.bouncy },
      whileTap:   r ? {} : { scale: 0.9, transition: SP.stiff },
    },
    /* Link/row press */
    press: {
      whileHover: r ? {} : { y: -3, transition: SP.snappy },
      whileTap:   r ? {} : { scale: 0.98, transition: SP.stiff },
    },
  };
}

/* ── Specific transitions ────────────────────────────────────────── */
export const TR = {
  /* Sliding tab underline with layoutId */
  tabBar:    (r) => r ? { duration: 0 } : { type: "spring", damping: 30, stiffness: 350 },
  /* Theme toggle icon crossfade */
  themeIcon: (r) => r ? { duration: 0 } : { duration: 0.22, ease: [0.76, 0, 0.24, 1] },
  /* Gallery image crossfade */
  imgFade:   (r) => r ? { duration: 0 } : { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
};
