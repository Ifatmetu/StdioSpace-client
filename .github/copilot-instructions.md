# Copilot Instructions

## Project overview

This repository is a StudioSpace marketplace demo built with Next.js 16, React 19, and strict TypeScript. The app is a front-end-only booking experience for creative spaces: the home page, studio explorer, add-studio flow, login flow, and host redirect all live under `src/app/`.

The shared app shell sits in `src/app/layout.tsx`: every route renders the global `Navbar`, `Footer`, and `AuthProvider`. Studio listings are fetched from the `/studios` API endpoint by `src/hooks/use-studios.ts`; category and other static presentation configuration lives in `src/data/studio-catalog.ts`.

The project does not contain a real database or API service in-repo; `src/context/auth-context.tsx` stores a mock user in `localStorage`, and studio reads and writes use the API base URL configured by `NEXT_PUBLIC_API_URL`.

## Build, lint, and verification commands

Use the repo's existing scripts:

- `npm install` or `npm ci` to install dependencies
- `npm run dev` to start the Next.js dev server
- `npm run build` to create a production build
- `npm run start` to serve the production build locally
- `npm run lint` to run ESLint
- `npx tsc --noEmit` to run the TypeScript checker

There is no configured test runner or test suite in this repository. There is therefore no single-test command to use yet. If a test runner is introduced later, prefer targeting the exact file or test name instead of broad suite runs.

## High-level architecture

- App Router structure: route pages and segments live in `src/app/`.
- Root layout: `src/app/layout.tsx` wraps every page in the shared shell and auth state provider.
- Studio data: `src/hooks/use-studios.ts` fetches live studio records from `${NEXT_PUBLIC_API_URL}/studios` for the home cards, banner, category counts, and explorer. Static category, booking-step, and guarantee configuration lives in `src/data/studio-catalog.ts`.
- Studio search/filtering: `/studios` reads `?category=<key>` from the URL, while search, price, capacity, sort, saved-state, and the booking dialog remain local to `src/components/studios/studios-explorer.tsx`.
- Auth: `src/context/auth-context.tsx` is a mock client-side auth flow persisted in `localStorage` under `studiospace_user`.
- Add-studio flow: `src/app/add-studio/page.tsx` redirects unauthenticated users to `/login?redirect=/add-studio` when needed, then posts to `${NEXT_PUBLIC_API_URL}/studios`.
- Styling: Tailwind v4 is loaded via `next.config.ts` and `src/app/globals.css`; the app mostly uses inline utility classes and existing brand colors rather than a separate design system.

## Key repository conventions

- Next.js 16 specifics matter here: `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`. Read `node_modules/next/dist/docs/` before changing routing or cache-related APIs, and do not reintroduce removed flags like `experimental.ppr` or `runtime` exports.
- In Cache Components mode, uncached request data such as `cookies()`, `headers()`, and `searchParams` needs a `<Suspense>` boundary with a fallback (or an explicit cache strategy). `params` and `searchParams` are Promises in App Router and should be awaited.
- Do not add `useMemo` or `useCallback` purely for render performance; the React Compiler is enabled.
- `useSearchParams()` on `/studios` needs the existing `<Suspense>` boundary to avoid blocking prerender issues.
- Keep route assumptions honest: implemented routes include `/`, `/studios`, `/add-studio`, `/login`, and `/host` (which redirects to `/add-studio`). Avoid relying on pages that are not in the current app.
- `components.json` uses the shadcn-style `base-nova` setup; primitives under `src/components/ui/` are Base UI wrappers. Preserve their `data-slot` attributes and CVA variant patterns when editing them, and import `cn` from the `cn` package rather than redefining utilities.
- Dark mode is class-based and toggled on `<html>` by `src/components/theme-toggle.tsx`; theme preference is stored in `localStorage` and there is no blocking theme script.
- `src/lib/highlighter.tsx` registers Shiki languages in both the `languages` and `aliases` maps. New languages must be added to both maps or syntax highlighting silently falls back to plain text.
- The project is intentionally front-end/demo oriented. Do not treat the success path from the add-studio demo backend as a production API contract; it currently shows success even when the request fails.

## Existing project-specific baseline

- `npm run lint` is already baseline-red in this repo and should not be treated as a clean pass. The known issues include the `react-hooks/set-state-in-effect` warnings in `src/components/theme-toggle.tsx`, `src/components/ui/carousel.tsx`, `src/context/auth-context.tsx`, and `src/hooks/use-mobile.ts`, plus unused imports/variables in the login/add-studio pages.
- `npm run build` currently shows a known prerender issue if a client component reads a non-deterministic value like `new Date()` during render; move that value into an effect or event handler, or wrap the relevant content in a `<Suspense>` boundary.

## Working style and conventions for this repo

- Prefer composing or wrapping existing shadcn/Base UI components instead of rewriting them from scratch.
- Match the surrounding markup and brand colors (`#db1a6e`, `#14142b`, `#f4f5fa`) rather than introducing a separate styling system.
- Respect the local app structure: data hooks and app-specific utilities belong in `src/hooks/` and `src/lib/`; page- or feature-specific UI should live in `src/components/home/` or the relevant component folder.
- Keep the project’s mock/demo behavior intact unless a task explicitly requires changing it.
