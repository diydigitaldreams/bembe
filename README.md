# Bembe

**Puerto Rico's Living Art Museum** — GPS-guided audio art walks curated by local artists.

Artists create immersive, multi-stop walking experiences with audio narration tied to real locations. Patrons discover walks, follow GPS-triggered audio stops through neighborhoods, and support artists directly. Artists earn 88% of every sale.

**Live:** [bembe.vercel.app](https://bembe.vercel.app)  
**Contact:** hola@bembe.pr  
**Status:** Pre-launch (actively developing)

---

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # Fill in your keys
pnpm dev                      # → localhost:3000
```

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Database & Auth | Supabase (PostgreSQL, Row-Level Security, OAuth) |
| Payments | Stripe Connect (destination charges, 88/12 artist/platform split) |
| Maps | Mapbox GL |
| State | Zustand + TanStack React Query |
| Styling | Tailwind CSS 4 |
| i18n | Spanish (default) + English via React Context |
| Hosting | Vercel |

## Project Structure

```
src/
├── app/                # Pages + API routes (App Router)
│   ├── api/            # 15 endpoints (walks, gifts, tips, events, webhooks, AI)
│   ├── walk/           # Walk playback — GPS-triggered audio stops
│   ├── artist/         # Artist dashboard, walk + event creation
│   ├── discover/       # Walk discovery + filtering
│   ├── map/            # Mapbox walk map
│   ├── neighborhoods/  # Barrio landing pages
│   ├── events/         # Community events
│   └── grants/         # Artist grant finder + AI assistant
├── components/         # Shared React components
├── hooks/              # Custom hooks (geolocation)
├── lib/
│   ├── supabase/       # client.ts (browser) + server.ts (RSC/API)
│   ├── stripe/         # Stripe singleton + checkout helpers
│   ├── i18n/           # context.tsx + translations.ts (EN/ES)
│   ├── offline/        # PWA / IndexedDB for offline playback
│   └── rate-limit.ts   # In-memory rate limiter for AI endpoints
├── types/              # TypeScript interfaces
└── scripts/            # Database seed script

supabase/
├── migrations/         # SQL migrations (run manually in Supabase SQL Editor)
└── schema.sql          # Full database schema
```

## Database

PostgreSQL via Supabase. RLS enabled on all tables.

**Core tables:** `profiles`, `art_walks`, `walk_stops`, `walk_purchases`, `walk_gifts`, `events`, `artist_subscriptions`, `tips`, `comments`

**Enums:** `user_role` (artist | patron | both), `subscription_plan` (free | pro)

**Auth:** `handle_new_user()` trigger auto-creates a profile row on signup. `profiles.id` references `auth.users(id)`.

**Migrations:** No CLI runner configured. Run SQL files from `supabase/migrations/` directly in the Supabase Dashboard SQL Editor.

**Seeding:** `POST /api/seed` with `x-admin-key` header matching `BEMBE_ADMIN_KEY`. Only works if no walks exist yet.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_ARTIST_PRO` | Stripe price ID for artist pro subscription |
| `STRIPE_PRICE_PATRON_PREMIUM` | Stripe price ID for patron premium subscription |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL access token |
| `OPENAI_API_KEY` | OpenAI key (AI stop generation + grant assistant) |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `BEMBE_ADMIN_KEY` | Admin key for seed endpoint |

## Scripts

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript check |
| `pnpm format` | Prettier (write) |
| `pnpm format:check` | Prettier (check only) |

## Key Patterns

**Auth:** Every protected API route starts with `const { data: { user } } = await supabase.auth.getUser()`. Middleware in `src/middleware.ts` refreshes the Supabase session on every request. `/artist/*` routes redirect to `/login` if unauthenticated.

**Payments:** Stripe Connect destination charges. `application_fee_amount` is 12%, remainder goes to the artist's connected account via `transfer_data`. Webhook at `/api/webhooks/stripe/route.ts` handles `checkout.session.completed` and `account.updated`.

**i18n:** Default locale is Spanish. Stored in `localStorage('bembe-locale')`. Use the `useI18n()` hook which returns `{ locale, setLocale, t }`. All user-facing strings go through translation keys in `src/lib/i18n/translations.ts`.

**Prices:** Stored as cents (integer) in the database — `price_cents`, `amount_cents`, `ticket_price_cents`.

**Coordinates:** `lat` / `lng` as double precision. Default fallback: `18.4655, -66.1057` (San Juan).

**Components:** `"use client"` only on interactive components. Keep pages as server components when possible.

**Mapbox:** CSS loaded only on pages that use the map, not in root layout.

**Rate limiting:** In-memory per-user limiter on AI endpoints (10 req/min).

## Design Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `bembe-gold` | #D4A843 | Primary accent, CTAs |
| `bembe-teal` | #1A7A6D | Secondary accent |
| `bembe-coral` | #E85D4A | Alerts, highlights |
| `bembe-sand` | #F5F0E8 | Light backgrounds |
| `bembe-night` | #1A1A2E | Dark backgrounds |

## Deployment

Vercel. Connect the repo, set all environment variables in project settings, connect Supabase and Stripe accounts. Pushes to `main` auto-deploy.

## License

Proprietary. All rights reserved.
