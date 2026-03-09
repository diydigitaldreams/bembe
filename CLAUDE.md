# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bembe is a curated immersive audio art walk platform for Puerto Rico. Users discover and play GPS-guided audio walks through neighborhoods. Artists create walks with stops, earn 88% of revenue (12% platform fee). Built with Next.js App Router + Supabase + Stripe Connect + Mapbox.

**Live site**: bembe.vercel.app

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
```

No test framework is configured.

**Seeding the database**: `POST /api/seed` with `x-admin-key` header matching `BEMBE_ADMIN_KEY` env var. Only works if no walks exist yet.

**Database migrations**: Run SQL files from `supabase/migrations/` in the Supabase Dashboard SQL Editor (no CLI migration runner configured).

## Architecture

### Stack
Next.js 16 (App Router) · React 19 · Supabase (auth/DB/RLS) · Stripe Connect · Mapbox GL · Tailwind CSS 4 · Zustand · TanStack Query · TypeScript 5

### Key directories
- `src/app/api/` — API route handlers (walks, gifts, tips, events, subscriptions, webhooks, AI)
- `src/lib/supabase/` — `client.ts` (browser) and `server.ts` (RSC/API) Supabase clients using `@supabase/ssr`
- `src/lib/stripe/client.ts` — Stripe singleton + checkout/subscription helpers
- `src/lib/i18n/` — `context.tsx` (provider + `useI18n` hook) and `translations.ts` (EN/ES keys)
- `src/lib/rate-limit.ts` — In-memory per-user rate limiter for AI endpoints
- `src/types/index.ts` — All TypeScript interfaces (Profile, ArtWalk, WalkStop, etc.)
- `src/scripts/seed.ts` — Database seed data (example walks, artists, events)
- `supabase/migrations/` — SQL migration files (run manually in Supabase SQL Editor)

### Database
PostgreSQL via Supabase. Core tables: `profiles`, `art_walks`, `walk_stops`, `walk_purchases`, `walk_gifts`, `events`, `artist_subscriptions`, `tips`. RLS enabled on all tables. `profiles.id` references `auth.users(id)` — creating seed profiles requires creating auth users first via admin API.

Enums: `user_role` (artist|patron|both), `subscription_plan` (free|pro).

### Auth flow
- `src/middleware.ts` — Refreshes Supabase session on every request
- Protected routes under `/artist/*` redirect to `/login` if unauthenticated
- `handle_new_user()` DB trigger auto-creates a profile row on signup
- Role-based redirects: patrons → `/discover`, artists → `/artist/dashboard`

### i18n
Default language is **Spanish (es)**. Locale stored in `localStorage('bembe-locale')`. Use the `useI18n()` hook which returns `{ locale, setLocale, t }`. All user-facing strings should use translation keys from `src/lib/i18n/translations.ts`. Single language toggle in navbar only.

### Stripe integration
- **Destination charges**: `application_fee_amount` (12%) with `transfer_data` to artist's connected account
- **Webhook** at `/api/webhooks/stripe/route.ts` handles `checkout.session.completed` and `account.updated`
- Subscription price IDs come from env vars `STRIPE_PRICE_ARTIST_PRO` and `STRIPE_PRICE_PATRON_PREMIUM`

### API route patterns
- Auth: `const { data: { user } } = await supabase.auth.getUser()` at start of protected routes
- Pagination: `page`/`limit` query params, max 50-100 results
- Search: Sanitize with `q.replace(/[.,%()]/g, "")` before passing to PostgREST `.ilike`
- Errors: Return generic messages to client, never expose internal error details
- Rate limiting: Applied on AI endpoints (10 req/min per user)

### Tailwind theme colors
`bembe-gold` (#D4A843), `bembe-teal` (#1A7A6D), `bembe-coral` (#E85D4A), `bembe-sand` (#F5F0E8), `bembe-night` (#1A1A2E)

## Environment variables

See `.env.example` for the full list. Key vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `OPENAI_API_KEY`, `NEXT_PUBLIC_APP_URL`, `BEMBE_ADMIN_KEY`.

## Conventions

- **"use client"** only on interactive components (modals, forms, hooks). Keep pages as server components when possible.
- Prices stored as **cents** (integer) in the database (`price_cents`, `amount_cents`, `ticket_price_cents`).
- Walk coordinates use `lat`/`lng` (double precision). Default fallback: 18.4655, -66.1057 (San Juan).
- Supabase foreign key naming: `art_walks_artist_id_fkey`, `profiles!organizer_id`, etc.
- Mapbox CSS should only be loaded on pages that use the map (not in root layout).
