# StudioSpace

Live site: run the app locally at [http://localhost:3000](http://localhost:3000). A public Vercel URL is not attached to this folder yet.

StudioSpace is a peer-to-peer marketplace where filmmakers, photographers, podcasters, and musicians book creative rooms by the hour.

- Browse photo studios, film stages, podcast lounges, music suites, and workshops, then book an exact time slot.
- Hosts list a space with hourly rate, deposit, amenities, and photos stored in MongoDB.
- Signed-in users keep their session on reload and manage listings, bookings, and saved studios.
- Light and dark themes, toast feedback, and a custom 404 page cover the main flows.
- Tech stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui, React Hot Toast, Better Auth, Express, and MongoDB.

## Local setup

1. Start MongoDB and copy the server environment variables (`MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CLIENT_URL`, and optional `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`).
2. In `stdiospace-server`, run `npm install` and `npm start` (API on port 5000).
3. In `stdiospace-client`, set `NEXT_PUBLIC_API_URL=http://localhost:5000` and, for image uploads, `NEXT_PUBLIC_IMGBB_API_KEY`.
4. Run `npm install` and `npm run dev`, then open [http://localhost:3000](http://localhost:3000).

## Examiner test credentials

- Email: `rina@mail.com`
- Password: `password123`

New registrations must use at least 6 characters with one uppercase and one lowercase letter. Password reset and email verification are intentionally off.
