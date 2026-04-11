# Project Guidelines

## Code Style
- Use React function components and hooks; avoid class components.
- Keep styling in CSS files and CSS custom properties, matching patterns in `src/index.css`.
- Reuse shared motion utilities from `src/animations.js` and avoid ad-hoc animation constants.
- Keep display/content updates in `src/data/portfolioData.js` when possible instead of hardcoding text in components.

## Architecture
- App entry is `src/main.jsx`, which renders `src/portfolio.jsx`.
- `src/portfolio.jsx` is currently the main composition file and contains custom hooks, layout logic, and section components.
- Theme tokens are centralized in `src/theme/tokens.js`; prefer token usage over one-off color values.
- 3D model and gallery assets are served from `public/models` and `public/gallery`.

## Build and Validate
- Install deps: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Preview build: `npm run preview`
- There is no automated test command configured yet. Do not assume `npm test` exists.

## Conventions
- Preserve responsive behavior across desktop/tablet/mobile breakpoints and keep mobile navigation accessible.
- Respect reduced-motion behavior; when adding animations, ensure they can be disabled for users who prefer reduced motion.
- Keep the visual direction consistent with existing glassmorphism and token-based theming.
- Prefer small focused edits and avoid broad refactors of `src/portfolio.jsx` unless explicitly requested.

## Working Notes For Agents
- Validate changes with `npm run lint` and `npm run build` when the task is code-related.
- If adding new project process docs, create them under `docs/` and reference them here instead of embedding long guidance.
