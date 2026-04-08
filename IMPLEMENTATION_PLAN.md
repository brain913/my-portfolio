# Portfolio Redesign — Concrete Implementation Plan

This plan turns the high-level design feedback into shippable tasks with file-level scope, order of operations, acceptance criteria, and risk controls.

## Goals

1. Improve visual hierarchy (hero → proof → detail).
2. Reduce visual noise from overlapping glass/background effects.
3. Convert content from “card list” to “portfolio storytelling”.
4. Improve accessibility + interaction quality.
5. Reduce technical design debt so future iterations are faster.

---

## Current code touchpoints (source of truth)

- Active app entry: `src/main.jsx` imports `src/portfolio.jsx`.
- Current UI and data all live in `src/portfolio.jsx` (single large file).
- Legacy/alternate variants still present: `src/portfolio_fm.jsx`, `src/portfolio-glass.jsx`.

---

## Delivery Strategy

Use **4 implementation phases**. Each phase is independently releasable.

- **Phase 1:** Foundation (tokens, typography, layout shell).
- **Phase 2:** Hero + Work section redesign.
- **Phase 3:** Gallery/Projects/References polish + accessibility.
- **Phase 4:** Cleanup + consolidation + QA hardening.

---

## Phase 1 — Foundation (Day 1–2)

### Scope
- Introduce a lightweight component structure and move repeated primitives out of `portfolio.jsx`.
- Establish consistent typography + spacing scale.
- Tone down global visual effects before section redesign.

### Tasks
1. **Create component folders**
   - `src/components/layout/`
   - `src/components/primitives/`
   - `src/sections/`
2. **Extract primitives from `portfolio.jsx`**
   - `GlassCard`, `Pill`, `SectionHead`, `ThemeToggle`.
3. **Create a token file**
   - `src/theme/tokens.js` with `createTokens(dark)`.
4. **Create global type/spacing system**
   - Add variables/classes in `src/index.css` for:
     - font sizes (`--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-body`, `--fs-meta`)
     - spacing (`--space-1` … `--space-8`)
5. **Reduce baseline visual noise**
   - Keep grain + one subtle blob layer; reduce branch intensity/opacity.

### Acceptance criteria
- `portfolio.jsx` reduced by at least 30% lines.
- No visual regressions in nav/sidebar behavior.
- Build passes.

---

## Phase 2 — Hero + Work redesign (Day 3–5)

### Scope
- Add a strong hero section and transform Work Experience into a case-study-first layout.

### Tasks
1. **Add new hero section component** (`src/sections/Hero.jsx`)
   - Headline (positioning statement)
   - 1 primary CTA (Contact)
   - 1 secondary CTA (View Work)
   - compact credibility row (2–3 key highlights)
2. **Refactor Work section into two layers**
   - `FeaturedCaseStudies` (top 2–3 entries with large visual + outcomes)
   - `ExperienceTimeline` (remaining items compact)
3. **Data reshaping**
   - Move data arrays from component body to `src/data/portfolioData.js`.
   - Add optional fields for outcomes/metrics (`impact`, `scope`, `stack`).
4. **Navigation update**
   - Add “Overview” tab mapped to hero + featured work anchor.

### Acceptance criteria
- First viewport communicates identity + direction in under 5 seconds.
- Work section shows at least 2 featured case-study strips.
- Timeline entries remain readable on mobile without accordion dependency.

---

## Phase 3 — Content polish + accessibility (Day 6–8)

### Scope
- Improve readability and interaction quality across gallery, references, dialogs, and controls.

### Tasks
1. **Gallery UX fixes**
   - Replace hook misuse pattern (`useState` in map) with componentized `GalleryCard` state.
   - Add keyboard navigation in lightbox (left/right/esc).
2. **References text treatment**
   - Short quote preview + expand/collapse for long testimonials.
3. **Accessibility pass**
   - Add `aria-label` to icon-only buttons.
   - Use dialog semantics (`role="dialog"`, `aria-modal="true"`) for command palette/lightbox/drawer.
   - Add visible `:focus-visible` styles.
4. **Copy consistency pass**
   - Standardize date format and punctuation style.
   - Replace static year labels with dynamic year where appropriate.

### Acceptance criteria
- Keyboard-only user can operate nav, command palette, drawer, and lightbox.
- No React hook-rule violations in redesigned gallery.
- Lighthouse accessibility score improves vs baseline.

---

## Phase 4 — Consolidation + QA (Day 9–10)

### Scope
- Remove duplicate implementations and finalize production readiness.

### Tasks
1. **Consolidate entrypoint architecture**
   - Keep only active portfolio implementation path.
   - Archive or delete `src/portfolio_fm.jsx` and `src/portfolio-glass.jsx`.
2. **Performance checks**
   - Ensure media sizing and lazy behavior are reasonable.
   - Trim unnecessary effects on low-end/mobile.
3. **Cross-device QA matrix**
   - iPhone width, Android width, tablet, desktop ultrawide.
4. **Regression checks**
   - Theme toggle
   - Mobile drawer
   - Tab switching
   - Command palette shortcuts

### Acceptance criteria
- Single canonical implementation in repo.
- No broken links/interactions.
- Build and lint pass.

---

## Implementation Backlog (copy/paste checklist)

- [ ] Create `src/theme/tokens.js`.
- [ ] Create `src/data/portfolioData.js`.
- [ ] Extract primitives to `src/components/primitives/*`.
- [ ] Extract layout pieces to `src/components/layout/*`.
- [ ] Introduce `Hero.jsx` with CTA structure.
- [ ] Split work into `FeaturedCaseStudies.jsx` + `ExperienceTimeline.jsx`.
- [ ] Refactor gallery card state (no hooks inside loops/maps).
- [ ] Add semantic dialog attributes to modal surfaces.
- [ ] Add `:focus-visible` styling globally.
- [ ] Standardize copy/date style.
- [ ] Remove duplicate portfolio variant files.
- [ ] Run build + lint + manual QA sweep.

---

## Risk Controls

- **Risk:** Large one-shot refactor breaks behavior.
  - **Mitigation:** Phase-by-phase PRs; keep each phase deployable.
- **Risk:** Visual drift away from current identity.
  - **Mitigation:** Keep existing color tokens initially; iterate hierarchy first.
- **Risk:** Accessibility regressions while redesigning.
  - **Mitigation:** Add accessibility checklist as merge gate in Phase 3.

---

## Definition of Done (final state)

- Clear hero-first narrative.
- Featured work storytelling replaces dense undifferentiated card list.
- Simplified but still distinctive glass visual language.
- Accessible and keyboard-friendly interactions.
- Modular structure enabling rapid future design iterations.
