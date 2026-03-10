-- =============================================================================
-- Bembe — Migration 006: Business sponsors and walk sponsorships
-- Run this in the Supabase Dashboard → SQL Editor
-- =============================================================================

-- BUSINESS SPONSORS
create table if not exists public.business_sponsors (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  contact_email text not null,
  logo_url text,
  lat double precision not null,
  lng double precision not null,
  monthly_budget_cents integer not null default 0,
  sponsored_walks text[] not null default '{}',
  is_active boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  tier text not null default 'starter',
  created_at timestamptz not null default now(),

  constraint chk_sponsor_budget_non_negative check (monthly_budget_cents >= 0)
);

create index if not exists idx_sponsors_active on public.business_sponsors (is_active) where is_active = true;
create index if not exists idx_sponsors_location on public.business_sponsors (lat, lng);

alter table public.business_sponsors enable row level security;

drop policy if exists "Active sponsors are viewable by everyone" on public.business_sponsors;
create policy "Active sponsors are viewable by everyone"
  on public.business_sponsors for select using (is_active = true);

-- WALK SPONSORSHIPS (junction: sponsor ↔ walk)
create table if not exists public.walk_sponsorships (
  id uuid primary key default uuid_generate_v4(),
  sponsor_id uuid not null references public.business_sponsors (id) on delete cascade,
  walk_id uuid not null references public.art_walks (id) on delete cascade,
  amount_cents integer not null default 0,
  starts_at date not null default current_date,
  ends_at date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),

  unique (sponsor_id, walk_id)
);

create index if not exists idx_sponsorships_walk on public.walk_sponsorships (walk_id) where is_active = true;

alter table public.walk_sponsorships enable row level security;

drop policy if exists "Active sponsorships visible to all" on public.walk_sponsorships;
create policy "Active sponsorships visible to all"
  on public.walk_sponsorships for select using (is_active = true);
