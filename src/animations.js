/**
 * animations.js — Centralised Framer Motion animation system
 *
 * USAGE:
 *   import { V, spring, ease, mkVariants } from "./animations";
 *   const variants = mkVariants(useReducedMotion());
 *   <motion.div variants={variants.item} initial="hidden" animate="show" />
 *
 * DESIGN PRINCIPLES:
 *   1. Single source of truth for all durations, easings and spring configs.
 *   2. Every exported variant accepts `reduced` (from useReducedMotion) to
 *      collapse animations to instant for accessibility compliance.
 *   3. Variants compose: stagger containers + item children work together
 *      without extra config.
 *   4. Nothing here causes re-renders — values are plain objects, not state.
 */

/* ─── EASING CURVES ─────────────────────────────────────────────── */
export const ease = {
  out:    [0.25, 0.46, 0.45, 0.94],   // smooth deceleration (page slides)
  in:     [0.55, 0.06, 0.68, 0.19],   // sharp acceleration (exits)
  inOut:  [0.76, 0, 0.24, 1],          // balanced (theme transitions)
  overshoot: [0.34, 1.56, 0.64, 1],    // spring-like overshoot for hovers
};

/* ─── SPRING CONFIGS ────────────────────────────────────────────── */
export const spring = {
  default:  { type: "spring", damping: 28, stiffness: 320 },
  snappy:   { type: "spring", damping: 22, stiffness: 400 },
  bouncy:   { type: "spring", damping: 18, stiffness: 360 },
  stiff:    { type: "spring", damping: 32, stiffness: 500 },
  gentle:   { type: "spring", damping: 35, stiffness: 260 },
};

/* ─── DURATION SCALE ────────────────────────────────────────────── */
export const duration = {
  instant: 0,
  fast:    0.16,
  base:    0.22,
  slow:    0.32,
  xslow:   0.5,
};

/* ─── VARIANT FACTORY ────────────────────────────────────────────
  Call mkVariants(reduced) once per component, using the result of
  useReducedMotion(). This collapses all durations to 0 for users
  who prefer reduced motion — no separate code paths needed.
─────────────────────────────────────────────────────────────────── */
export function mkVariants(reduced = false) {
  const d = reduced ? 0 : undefined; // shorthand

  return {
    /* ── Page / Section transitions ── */
    page: {
      hidden: { opacity: 0, y: reduced ? 0 : 10 },
      show:   { opacity: 1, y: 0,
                transition: { duration: reduced ? 0 : duration.slow, ease: ease.out } },
      exit:   { opacity: 0, y: reduced ? 0 : -6,
                transition: { duration: reduced ? 0 : duration.fast, ease: ease.in } },
    },

    /* ── Stagger container — wrap lists/grids ── */
    stagger: {
      hidden: {},
      show:   { transition: {
        staggerChildren: reduced ? 0 : 0.065,
        delayChildren:   reduced ? 0 : 0.04,
      }},
    },

    /* ── Stagger child — used inside a stagger container ── */
    item: {
      hidden: { opacity: 0, y: reduced ? 0 : 12 },
      show:   { opacity: 1, y: 0,
                transition: { duration: reduced ? 0 : duration.base, ease: ease.out } },
    },

    /* ── Fade only (no translate) ── */
    fade: {
      hidden: { opacity: 0 },
      show:   { opacity: 1, transition: { duration: reduced ? 0 : duration.base } },
      exit:   { opacity: 0, transition: { duration: reduced ? 0 : duration.fast } },
    },

    /* ── Modal / Dialog panels ── */
    modal: {
      hidden: { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : -8 },
      show:   { opacity: 1, scale: 1, y: 0,
                transition: { duration: reduced ? 0 : duration.base, ease: ease.out } },
      exit:   { opacity: 0, scale: reduced ? 1 : 0.97,
                transition: { duration: reduced ? 0 : duration.fast } },
    },

    /* ── Overlay backdrops ── */
    backdrop: {
      hidden: { opacity: 0 },
      show:   { opacity: 1, transition: { duration: reduced ? 0 : duration.base } },
      exit:   { opacity: 0, transition: { duration: reduced ? 0 : duration.fast } },
    },

    /* ── Slide-in drawers (from left) ── */
    drawer: {
      hidden: { x: "-100%" },
      show:   { x: 0,
                transition: reduced ? { duration: 0 } : spring.default },
      exit:   { x: "-100%",
                transition: reduced ? { duration: 0 }
                           : { duration: duration.base, ease: ease.in } },
    },

    /* ── Slide-in from right ── */
    slideRight: {
      hidden: { x: "100%" },
      show:   { x: 0,   transition: reduced ? { duration: 0 } : spring.default },
      exit:   { x: "100%", transition: reduced ? { duration: 0 }
                           : { duration: duration.base, ease: ease.in } },
    },

    /* ── Accordion / height collapse ── */
    accordion: {
      hidden: { opacity: 0, height: 0 },
      show:   { opacity: 1, height: "auto",
                transition: { duration: reduced ? 0 : duration.base, ease: ease.out } },
      exit:   { opacity: 0, height: 0,
                transition: { duration: reduced ? 0 : duration.fast } },
    },

    /* ── Popup menus (scale from corner) ── */
    popup: {
      hidden: { opacity: 0, scale: reduced ? 1 : 0.94, y: reduced ? 0 : 6 },
      show:   { opacity: 1, scale: 1, y: 0,
                transition: reduced ? { duration: 0 } : spring.snappy },
      exit:   { opacity: 0, scale: reduced ? 1 : 0.96,
                transition: { duration: reduced ? 0 : duration.fast } },
    },

    /* ── Section heading accent bar ── */
    accentBar: {
      hidden: { width: 0, opacity: 0 },
      show:   { width: "auto", opacity: 1,
                transition: { duration: reduced ? 0 : duration.slow,
                              delay: reduced ? 0 : 0.15, ease: ease.out } },
    },
  };
}

/* ─── GESTURE PRESETS ────────────────────────────────────────────
  Pass these to whileHover / whileTap directly.
  All return {} when reduced = true.
─────────────────────────────────────────────────────────────────── */
export function gestures(reduced = false) {
  return {
    /* Lift card on hover — standard interaction affordance */
    lift: {
      whileHover: reduced ? {} : { y: -2, transition: spring.snappy },
      whileTap:   reduced ? {} : { scale: 0.985, transition: spring.stiff },
    },

    /* Subtle scale for icon buttons */
    iconBtn: {
      whileHover: reduced ? {} : { scale: 1.08, transition: spring.bouncy },
      whileTap:   reduced ? {} : { scale: 0.92,  transition: spring.stiff },
    },

    /* Press for clickable rows / links */
    press: {
      whileHover: reduced ? {} : { y: -3, transition: spring.snappy },
      whileTap:   reduced ? {} : { scale: 0.98, transition: spring.stiff },
    },

    /* Pill / tag tap */
    pill: {
      whileTap: reduced ? {} : { scale: 0.94, transition: spring.stiff },
    },
  };
}

/* ─── TRANSITION PRESETS ─────────────────────────────────────────
  For use in the `transition` prop directly (not inside variants).
─────────────────────────────────────────────────────────────────── */
export const transition = {
  tabIndicator: (reduced) =>
    reduced ? { duration: 0 }
            : { type: "spring", damping: 30, stiffness: 350 },

  themeIcon: (reduced) =>
    reduced ? { duration: 0 } : { duration: duration.base, ease: ease.inOut },

  imageCrossfade: (reduced) =>
    reduced ? { duration: 0 }
            : { duration: duration.base + 0.03, ease: ease.out },
};
