# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands
- `npm install` — npm with `package-lock.json`; Next 16 requires Node 20.9+.
- `npm run dev` / `npm run build` / `npm run start` — Turbopack is the default in Next 16; do **not** add `--turbopack`.
- `npm run lint` — plain ESLint CLI (there is no `next lint`). Baseline is already red: 11 errors / 5 warnings, mostly `react-hooks/set-state-in-effect` (`theme-toggle.tsx`, `ui/carousel.tsx`, `hooks/use-mobile.ts`, `hooks/use-my-bookings.ts`, `studios/studio-details-dialog.tsx`), `react-hooks/static-components` + unescaped apostrophes in `app/profile/page.tsx`, unused icons in `navbar.tsx`, and `<img>` warnings. Compare against that instead of expecting a clean run.
- `npx tsc --noEmit` and `npm run build` currently both fail at the typecheck step: the untracked `src/lib/toast.ts` calls `baseToast.create(...)`, but Base UI's `ToastManager` has no `create` method (`build` compiles first, then fails). Treat this as the current baseline, not necessarily a regression from your change.
- No test runner, test files, CI workflow, or pre-commit hook exists; don't go looking for one.

## Routes and shell
- Implemented routes: `/` (home), `/studios` (explore/filter), `/add-studio`, `/login`, `/register`, `/profile`, `/my-listings`, `/booking-requests`, and `/host` (server redirect to `/add-studio`).
- `/Registration` (capital R) is the canonical register page; `src/app/register/page.tsx` is only `export { default } from "../Registration/page"`. Keep that pairing in mind when editing registration.
- `/about`, `/terms`, `/privacy`, and `/security` do not exist. Navbar "How It Works" points at `/#how-it-works`; "About Us" points at `/#host-guarantee` (anchors in `components/home/`). Don't treat those as broken links.
- `src/app/layout.tsx` always renders `AuthProvider`, `Navbar`, `<main>`, `Footer`, and the Base UI `Toaster`. Pages render inside that shell.
- `/studios` reads `?category=<key>` from the URL and uses `router.replace`; search/price/capacity/sort/saved state and the details dialog are local. The page must keep its `<Suspense>` wrapper because `StudiosExplorer` uses `useSearchParams`; `/login` wraps its form for the same reason.
- `@/*` → `src/*` (alias in `tsconfig.json`, also assumed by `components.json`).

## Data, auth, and API
- `src/data/studio-catalog.ts` contains only static config and types: `CATEGORIES`, `BOOKING_STEPS`, `GUARANTEES`, `Studio`, `Category`. There is no static `STUDIOS` list; live records come from the backend.
- `src/hooks/use-studios.ts` GETs `${NEXT_PUBLIC_API_URL}/studios/public` with `cache: "no-store"` and defensively normalizes loosely typed records. `Banner`, `FeaturedStudios`, `BrowseCategory`, and `StudiosExplorer` each call the hook independently.
- Auth is real Better Auth, not the old localStorage mock. `src/lib/auth-client.ts` creates the client from `NEXT_PUBLIC_API_URL` with the JWT plugin; `AuthProvider` exposes `authClient.useSession()`. `useAuth()` must be under `AuthProvider`.
- Authenticated calls go through `apiFetch()` in `src/lib/api.ts`: it obtains a JWT via `authClient.token()`, sets `Authorization: Bearer ...`, adds JSON `Content-Type` for bodies, and throws on non-2xx. `NEXT_PUBLIC_API_URL` must be set (`.env`/`.env.local` currently point at `http://localhost:5000`).
- Endpoints used: `GET/POST /studios`, `GET /bookings`, `GET /bookings?role=host`, `POST /bookings`, `PATCH /bookings/:id/status`, `PATCH /bookings/:id/cancel`. The backend is not in this repo.
- Booking mutations dispatch a browser `bookings-updated` event; `useMyBookings` listens and refetches. Reuse that event rather than adding a new cross-component store.
- Two toast systems coexist: login imports `react-hot-toast`, but only the Base UI `Toaster` is mounted in the layout, so those calls won't render. The untracked `src/lib/toast.ts` wrapper is unused and is what breaks typecheck.
- Theme is client-only: `theme-toggle.tsx` writes `theme` to `localStorage` and toggles `.dark` on `<html>`. There is no blocking theme script, so a light flash on load is expected.

## Next.js 16 behavior configured here
`next.config.ts` sets `cacheComponents: true`, `partialPrefetching: true`, and `reactCompiler: true`:
- PPR/static shell is the only rendering model and data is uncached unless opted in. Wrap `cookies()`, `headers()`, `searchParams`, or uncached fetches in `<Suspense>` with a fallback, or cache with `use cache` / `cacheLife` / `cacheTag` (cached functions must be async).
- Unstable values read during render are rejected at prerender time; defer them to an effect or event handler.
- Do not add the removed `experimental.ppr` flag, `experimental_ppr` segment config, or `runtime` exports (Cache Components is Node-only).
- `params` and `searchParams` are Promises — await them.
- `LayoutProps<"/">` and `PageProps<...>` are globals generated into `.next/types`; don't replace them with hand-written prop types.
- Don't add `useMemo`/`useCallback` purely for render performance; the compiler does it.

## Styling and UI
- Tailwind v4 is wired through `next.config.ts` `turbopack.rules` (`@tailwindcss/turbopack`). There is no `postcss.config.*` or `tailwind.config.*` — don't add one. Theme tokens live in `src/app/globals.css` under `@theme inline`, `:root`, and `.dark`.
- App code overwhelmingly uses inline utilities and hard-coded brand colors (`#db1a6e` pink, `#14142b` ink, `#f4f5fa` surface). Match the surrounding markup rather than migrating to semantic tokens; the newer profile/booking pages mix in slate/purple.
- `components.json` uses shadcn style `base-nova`: primitives are Base UI (`@base-ui/react/*`), not Radix. Don't add `@radix-ui/*`. Add components with `npx shadcn@latest add <name>` so generated code matches this style.
- `src/components/ui/` is generated shadcn code (a large preinstalled set, mostly unused). Prefer composing or wrapping it; app-specific code belongs in `src/hooks/`, `src/lib/`, `src/components/home/`, and `src/components/studios/`.
- Import `cn` from the `"cn"` package (as generated components do); `src/lib/utils.ts` only re-exports it.
- Keep the existing `data-slot="..."` attributes and CVA variant pattern when editing primitives.
- Font quirk: `layout.tsx` exposes Geist Sans as `--font-geist-sans`, but `globals.css` maps `--font-sans: var(--font-sans)`, so Geist Sans is not actually applied. Reference `var(--font-geist-sans)` if that font is required.

## Shiki highlighting
- `src/lib/highlighter.tsx` is client-side and lazy-loads languages. A new language must be added to **both** the `languages` and `aliases` maps, otherwise it silently falls back to plain text.
- `src/hooks/use-highlighted-code.ts` highlights complete lines incrementally and re-tokenizes the streaming tail; preserve its grammar-state logic when editing.
