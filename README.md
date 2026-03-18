# Bembe — Puerto Rico's Living Art Museum

A Next.js web application for curating and consuming immersive, GPS-guided audio art walks across Puerto Rico. Artists create multi-stop walking experiences with audio narration, and patrons discover, play, and support them.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Database & Auth**: Supabase (PostgreSQL + Row-Level Security + OAuth)
- **Payments**: Stripe Connect (walk purchases, tips, subscriptions, gift codes)
- **Maps**: Mapbox GL for interactive walk maps
- **State**: Zustand + TanStack React Query
- **Styling**: Tailwind CSS 4
- **i18n**: English & Spanish via React Context

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables and fill in your keys
cp .env.example .env.local

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

See `.env.example` for the full list. Required keys:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL access token |
| `OPENAI_API_KEY` | OpenAI API key (for AI stop generation) |
| `NEXT_PUBLIC_APP_URL` | Public application URL |
| `BEMBE_ADMIN_KEY` | Admin key for seed endpoint |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |

## Project Structure

```
src/
├── app/              # Next.js App Router (pages + API routes)
│   ├── api/          # 15 API endpoints
│   ├── walk/         # Walk playback (GPS-triggered stops)
│   ├── artist/       # Artist dashboard, walk/event creation
│   ├── discover/     # Walk discovery & filtering
│   ├── map/          # Mapbox-based walk map
│   └── ...           # Auth, events, gifts, guides, legal pages
├── components/       # Reusable React components
├── hooks/            # Custom hooks (geolocation)
├── lib/              # Utilities
│   ├── constants.ts  # Shared app constants
│   ├── supabase/     # Supabase client setup
│   ├── stripe/       # Stripe integration
│   ├── i18n/         # Internationalization
│   ├── offline/      # PWA / IndexedDB
│   └── rate-limit.ts # API rate limiting
├── types/            # TypeScript interfaces
└── scripts/          # Database seed script
supabase/
├── migrations/       # SQL migrations
└── schema.sql        # Full database schema
```

## Database

Migrations live in `supabase/migrations/`. The schema includes profiles, art walks, walk stops, purchases, tips, subscriptions, gifts, events, and comments — all with Row-Level Security enabled.

## Deployment

The app is designed for deployment on Vercel. Set all environment variables in your Vercel project settings, and connect your Supabase and Stripe accounts.
