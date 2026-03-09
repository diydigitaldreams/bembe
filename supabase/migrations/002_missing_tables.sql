-- =============================================================================
-- Bembe — Migration 002: Add missing tables + cleanup
-- Run this in the Supabase Dashboard → SQL Editor
-- =============================================================================

-- =============================================================================
-- WALK PURCHASES
-- =============================================================================
create table if not exists public.walk_purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles (id) on delete set null,
  walk_id uuid not null references public.art_walks (id) on delete cascade,
  amount_cents integer not null default 0,
  stripe_payment_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_purchases_user on public.walk_purchases (user_id);
create index if not exists idx_purchases_walk on public.walk_purchases (walk_id);

alter table public.walk_purchases enable row level security;

drop policy if exists "Users see own purchases" on public.walk_purchases;
create policy "Users see own purchases" on public.walk_purchases
  for select using (auth.uid() = user_id);

drop policy if exists "Service inserts purchases" on public.walk_purchases;
create policy "Service inserts purchases" on public.walk_purchases
  for insert with check (auth.uid() = user_id);

-- =============================================================================
-- WALK GIFTS
-- =============================================================================
create table if not exists public.walk_gifts (
  id uuid primary key default uuid_generate_v4(),
  gift_code text not null unique,
  walk_id uuid not null references public.art_walks (id) on delete cascade,
  sender_id uuid references public.profiles (id) on delete set null,
  sender_name text not null default '',
  recipient_email text,
  message text,
  stripe_session_id text,
  status text not null default 'pending',
  redeemed_by uuid references public.profiles (id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_gifts_code on public.walk_gifts (gift_code);
create index if not exists idx_gifts_walk on public.walk_gifts (walk_id);

alter table public.walk_gifts enable row level security;

drop policy if exists "Gift senders see own gifts" on public.walk_gifts;
create policy "Gift senders see own gifts" on public.walk_gifts
  for select using (auth.uid() = sender_id or auth.uid() = redeemed_by);

drop policy if exists "Gifts viewable by code" on public.walk_gifts;
create policy "Gifts viewable by code" on public.walk_gifts
  for select using (true);

drop policy if exists "Authenticated users insert gifts" on public.walk_gifts;
create policy "Authenticated users insert gifts" on public.walk_gifts
  for insert with check (auth.uid() = sender_id);

drop policy if exists "Gift redemption update" on public.walk_gifts;
create policy "Gift redemption update" on public.walk_gifts
  for update using (auth.uid() is not null);

-- =============================================================================
-- ARTIST SUBSCRIPTIONS
-- =============================================================================
create table if not exists public.artist_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  artist_id uuid not null unique references public.profiles (id) on delete cascade,
  plan text not null default 'free',
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_artist on public.artist_subscriptions (artist_id);

alter table public.artist_subscriptions enable row level security;

drop policy if exists "Users see own subscription" on public.artist_subscriptions;
create policy "Users see own subscription" on public.artist_subscriptions
  for select using (auth.uid() = artist_id);

drop policy if exists "Service manages subscriptions" on public.artist_subscriptions;
create policy "Service manages subscriptions" on public.artist_subscriptions
  for all using (auth.uid() = artist_id);

-- =============================================================================
-- CLEANUP: Remove is_act60 column if it exists
-- =============================================================================
alter table public.profiles drop column if exists is_act60;

-- =============================================================================
-- HELPER: Atomic play counter increment function
-- =============================================================================
create or replace function public.increment_plays(walk uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.art_walks
  set total_plays = total_plays + 1
  where id = walk;
end;
$$;
