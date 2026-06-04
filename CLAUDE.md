# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server (HMR)
npm run build      # tsc -b && vite build (type-check then bundle)
npm run lint       # ESLint over entire src/
npm run preview    # serve the dist/ build locally
```

There are no tests in this project.

## Architecture

Single-page marketing website for **A N D Travel and Tours** — a Philippines-based travel agency. Built with React 19, TypeScript, Vite, Tailwind CSS v3, and Framer Motion.

### Path aliases (tsconfig.app.json)

All imports use short aliases instead of relative paths:

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@sections/*` | `src/components/sections/*` |
| `@ui/*` | `src/components/ui/*` |
| `@layout/*` | `src/components/layout/*` |
| `@hooks/*` | `src/hooks/*` |
| `@lib/*` | `src/lib/*` |
| `@data/*` | `src/data/*` |

### Page structure

`App.tsx` composes the page in order: `Header → Hero → About → MissionVision → WhyChooseUs → ServicesVisual → Destinations → Contact → Footer`. The `<Credentials />` section is intentionally commented out pending real document scans.

### Data layer (`src/data/`)

All site content lives in plain TypeScript data files — no CMS or backend:

- **`contact.ts`** — single source of truth for phone, email, address, Facebook URL, Messenger URL, and Google Maps embed. Import `CONTACT` from here instead of hardcoding anywhere.
- **`destinations.ts`** — array of `Destination` objects (name, Unsplash image URL, shortDesc, badge, slug).
- **`services.ts`, `packages.ts`, `testimonials.ts`** — similar static arrays.

Shared TypeScript interfaces for all data shapes live in `src/types/index.ts`.

### Animations (`src/lib/animations.ts`)

All Framer Motion `Variants` objects are defined centrally here and imported by components. Do not define one-off variants inline — add them here and export. Key exports: `fadeUpVariants`, `fadeLeftVariants`, `fadeRightVariants`, `cardVariants`, `staggerContainer()` (factory), `heroSlideVariants`, `destinationImageVariants`, `destinationOverlayVariants`, `mobileMenuVariants`.

`defaultViewport = { once: true, margin: '-80px' }` — use this on all `whileInView` calls.

`MotionConfig reducedMotion="user"` is set at the root in `App.tsx` to respect OS accessibility settings (WCAG 2.3.3). CSS counterpart in `index.css`.

### Styling

Tailwind with three custom brand tokens (defined in `tailwind.config` and CSS variables in `index.css`):
- `brand-orange` → `#F97316`
- `brand-black` → `#111111`
- `brand-gold` → `#D4A017`

Custom shadows: `shadow-orange`, `shadow-card`, `shadow-card-lg`.

Body font: **Inter**. Heading font (`h1–h4`, `.font-heading`): **Playfair Display**.

### Contact form (`src/components/sections/Contact.tsx`)

The form is fully client-side with validation and a honeypot anti-spam field. **EmailJS integration is stubbed** — the `emailjs.send(...)` call is commented out and replaced with a fake `setTimeout`. To activate it, install `@emailjs/browser`, uncomment the block, and fill in `service_ast3kud`, `YOUR_TEMPLATE_ID`, and `YOUR_PUBLIC_KEY`.

### Credentials section

`src/components/sections/Credentials.tsx` is complete but commented out in `App.tsx`. Restore it by uncommenting `<Credentials />` once actual DTI/BIR/Mayor's Permit document scans replace the Unsplash placeholders. The section includes a lightbox viewer.

### Accessibility conventions

- One `<h1>` per page (inside `Hero`).
- `aria-label` / `aria-current` / `aria-expanded` / `role="alert"` applied throughout.
- Skip-to-content link at top of `App.tsx` (visually hidden, appears on keyboard focus).
- All decorative icons carry `aria-hidden="true"`.
- Focus styles use `:focus-visible` only (ring doesn't show for mouse users).
