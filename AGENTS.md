# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands
- `npm install` — npm with `package-lock.json`; Next 16 requires Node 20.9+.
- `npm run dev` / `npm run build` — Turbopack is the default in Next 16; do **not** add `--turbopack`.
- `npm run lint` — plain ESLint CLI (there is no `next lint`). Baseline is already red with exit code 1: 4 `react-hooks/set-state-in-effect` errors (`theme-toggle.tsx`, `ui/carousel.tsx`, `context/auth-context.tsx`, `hooks/use-mobile.ts`) and 2 unused-import warnings (`Sparkles` in `add-studio/page.tsx`, `Badge` in `home/featured-studios.tsx`). Don't assume a clean run.
- `npx tsc --noEmit` — typecheck (passes; no `typecheck` script).
- No test runner, CI workflow, or pre-commit hook exists; don't go looking for one.

## Layout and routes
- Real App Router routes: `/` (home), `/add-studio` (host form), `/login`, and `/host` (redirects to `/add-studio`).
- Navbar/Footer link to `/studios`, `/how-it-works`, `/about`, `/register`, `/my-listings`, `/terms`, `/privacy`, `/security` — these routes do **not** exist yet and 404. Don't treat them as regressions.
- `src/app/layout.tsx` always renders `Navbar`, `Footer`, and `AuthProvider` around every page; pages render inside its `<main>`.
- `@/*` → `src/*` (alias in `tsconfig.json`, also assumed by `components.json`).

## Data, auth, and API
- `src/data/dummy-data.ts` is the only catalog (`STUDIOS`, `CATEGORIES`, `BOOKING_STEPS`, `GUARANTEES`); home components render it directly. There is no data-fetching layer.
- Auth is a client-only mock in `src/context/auth-context.tsx`: persisted in `localStorage` as `studiospace_user`, password is never checked. `useAuth()` must be under `AuthProvider`, which the root layout provides.
- `add-studio` POSTs to a hard-coded `http://localhost:5000/studios` backend that is not in this repo. On fetch failure it still shows success and redirects to the missing `/studios` route — demo behavior, not a bug to fix incidentally.
- Theme state is client-only: `theme-toggle.tsx` writes `theme` to `localStorage` and toggles `.dark` on `<html>`. There is no blocking theme script, so a flash of light theme on load is expected. Dark mode is class-based (`@custom-variant dark` in `globals.css`).

## Next.js 16 behavior configured here
`next.config.ts` sets `cacheComponents: true` + `partialPrefetching: true`, which changes rendering semantics:
- PPR/static shell is the only rendering model and data is uncached unless opted in. Wrap `cookies()`, `headers()`, `searchParams`, or other uncached fetches in `<Suspense>` with a fallback, or cache with `use cache` / `cacheLife` / `cacheTag` (cached functions must be async). Without a boundary, dev/build surfaces a blocking-route error.
- Do not add the removed `experimental.ppr` flag, the `experimental_ppr` segment config, or `runtime` exports (Cache Components is Node-only).
- `params` and `searchParams` are Promises — await them.
- `LayoutProps<"/">` and `PageProps<...>` are globals generated into `.next/types` by Next. Don't replace them with hand-written prop types.

`reactCompiler: true`: don't add `useMemo`/`useCallback` purely for render performance; the compiler does it. The stricter `react-hooks` rules still flag `setState` calls in effects (see the baseline lint failures).

## Styling
- Tailwind v4 is wired through `next.config.ts` `turbopack.rules` (`@tailwindcss/turbopack`). There is no `postcss.config.*` or `tailwind.config.*` — don't add one. Theme tokens live in `src/app/globals.css` under `@theme inline`, `:root`, and `.dark`.
- App code overwhelmingly uses inline utilities and hard-coded brand colors (`#db1a6e` pink, `#14142b` ink, `#f4f5fa` surface) instead of semantic tokens; match the surrounding markup rather than migrating styles.
- Quirk: `layout.tsx` exposes Geist Sans as `--font-geist-sans`, but `globals.css` maps `--font-sans: var(--font-sans)`, so Geist Sans is not actually applied. Reference `var(--font-geist-sans)` if that font is required.

## UI conventions
- `components.json` uses shadcn style `base-nova`: primitives are Base UI (`@base-ui/react/*`), not Radix. Don't add `@radix-ui/*`. Add components with `npx shadcn@latest add <name>` so generated code matches this style.
- `src/components/ui/` is generated shadcn code (a large preinstalled set, mostly unused). Prefer composing or wrapping over rewriting; app-specific code belongs in `src/hooks/`, `src/lib/`, and `src/components/home/`.
- Import `cn` from the `"cn"` package (as generated components do); `src/lib/utils.ts` only re-exports it.
- Keep the existing `data-slot="..."` attributes and CVA variant pattern when editing primitives.
- Most primitives wrap Base UI; `message-scroller` and `questionnaire` come from `@shadcn/react`. Icons are `lucide-react`.

## Shiki highlighting
- `src/lib/highlighter.tsx` is client-side and lazy-loads languages. A new language must be added to **both** the `languages` and `aliases` maps, otherwise it silently falls back to plain text.
- `src/hooks/use-highlighted-code.ts` highlights complete lines incrementally and re-tokenizes the streaming tail; preserve its grammar-state logic when editing.
