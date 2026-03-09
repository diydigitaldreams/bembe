-- =============================================================================
-- Bembe — Initial Schema Migration
-- Run this in the Supabase Dashboard → SQL Editor
-- =============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enum types
do $$ begin
  create type user_role as enum ('artist', 'patron', 'both');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type subscription_plan as enum ('free', 'pro');
exception when duplicate_object then null;
end $$;

-- =============================================================================
-- PROFILES
-- =============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  avatar_url text,
  role user_role not null default 'patron',
  bio text,
  location text,
  lat double precision,
  lng double precision,
  is_act60 boolean not null default false,
  stripe_account_id text,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles (role);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- =============================================================================
-- ART WALKS
-- =============================================================================
create table if not exists public.art_walks (
  id uuid primary key default uuid_generate_v4(),
  artist_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null default '',
  cover_image_url text not null default '',
  price_cents integer not null default 0,
  duration_minutes integer not null default 0,
  distance_km numeric(6, 2) not null default 0,
  neighborhood text not null default '',
  municipality text not null default '',
  is_published boolean not null default false,
  is_featured boolean not null default false,
  total_plays integer not null default 0,
  avg_rating numeric(3, 2) not null default 0,
  created_at timestamptz not null default now(),
  constraint chk_price_non_negative check (price_cents >= 0),
  constraint chk_duration_positive check (duration_minutes >= 0),
  constraint chk_distance_positive check (distance_km >= 0),
  constraint chk_avg_rating_range check (avg_rating >= 0 and avg_rating <= 5)
);

create index if not exists idx_walks_artist on public.art_walks (artist_id);
create index if not exists idx_walks_neighborhood on public.art_walks (neighborhood) where is_published = true;
create index if not exists idx_walks_created on public.art_walks (created_at desc);

alter table public.art_walks enable row level security;
drop policy if exists "Published walks visible" on public.art_walks;
create policy "Published walks visible" on public.art_walks for select using (is_published = true or auth.uid() = artist_id);
drop policy if exists "Artists insert own walks" on public.art_walks;
create policy "Artists insert own walks" on public.art_walks for insert with check (auth.uid() = artist_id);
drop policy if exists "Artists update own walks" on public.art_walks;
create policy "Artists update own walks" on public.art_walks for update using (auth.uid() = artist_id);
drop policy if exists "Artists delete own walks" on public.art_walks;
create policy "Artists delete own walks" on public.art_walks for delete using (auth.uid() = artist_id);

-- =============================================================================
-- WALK STOPS
-- =============================================================================
create table if not exists public.walk_stops (
  id uuid primary key default uuid_generate_v4(),
  walk_id uuid not null references public.art_walks (id) on delete cascade,
  order_index integer not null default 0,
  title text not null,
  description text not null default '',
  audio_url text,
  image_urls text[] not null default '{}',
  lat double precision not null,
  lng double precision not null,
  trigger_radius_meters integer not null default 30,
  duration_seconds integer not null default 0,
  constraint chk_trigger_radius_positive check (trigger_radius_meters > 0),
  unique (walk_id, order_index)
);

create index if not exists idx_stops_walk on public.walk_stops (walk_id, order_index);

alter table public.walk_stops enable row level security;
drop policy if exists "Stops viewable if walk viewable" on public.walk_stops;
create policy "Stops viewable if walk viewable" on public.walk_stops for select using (
  exists (select 1 from public.art_walks w where w.id = walk_id and (w.is_published = true or auth.uid() = w.artist_id))
);
drop policy if exists "Artists manage own stops" on public.walk_stops;
create policy "Artists manage own stops" on public.walk_stops for all using (
  exists (select 1 from public.art_walks w where w.id = walk_id and auth.uid() = w.artist_id)
);

-- =============================================================================
-- EVENTS (with neighborhood + rsvp_url)
-- =============================================================================
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null default '',
  cover_image_url text not null default '',
  location_name text not null default '',
  neighborhood text not null default '',
  lat double precision not null default 18.4655,
  lng double precision not null default -66.1057,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  ticket_price_cents integer not null default 0,
  max_capacity integer not null default 0,
  tickets_sold integer not null default 0,
  rsvp_url text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint chk_event_price_non_negative check (ticket_price_cents >= 0),
  constraint chk_event_capacity_positive check (max_capacity >= 0),
  constraint chk_event_dates check (ends_at > starts_at)
);

create index if not exists idx_events_organizer on public.events (organizer_id);
create index if not exists idx_events_starts on public.events (starts_at) where is_published = true;

alter table public.events enable row level security;
drop policy if exists "Published events visible" on public.events;
create policy "Published events visible" on public.events for select using (is_published = true or auth.uid() = organizer_id);
drop policy if exists "Organizers insert events" on public.events;
create policy "Organizers insert events" on public.events for insert with check (auth.uid() = organizer_id);
drop policy if exists "Organizers update events" on public.events;
create policy "Organizers update events" on public.events for update using (auth.uid() = organizer_id);
drop policy if exists "Organizers delete events" on public.events;
create policy "Organizers delete events" on public.events for delete using (auth.uid() = organizer_id);

-- =============================================================================
-- REVIEWS
-- =============================================================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  walk_id uuid not null references public.art_walks (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null,
  comment text,
  created_at timestamptz not null default now(),
  constraint chk_rating_range check (rating >= 1 and rating <= 5),
  unique (walk_id, user_id)
);

alter table public.reviews enable row level security;
drop policy if exists "Reviews viewable" on public.reviews;
create policy "Reviews viewable" on public.reviews for select using (true);
drop policy if exists "Users insert reviews" on public.reviews;
create policy "Users insert reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- Avg rating trigger
create or replace function public.update_walk_avg_rating()
returns trigger language plpgsql security definer set search_path = '' as $$
declare target_walk_id uuid;
begin
  target_walk_id := coalesce(new.walk_id, old.walk_id);
  update public.art_walks set avg_rating = coalesce(
    (select round(avg(rating)::numeric, 2) from public.reviews where walk_id = target_walk_id), 0
  ) where id = target_walk_id;
  return null;
end;
$$;

drop trigger if exists trg_update_avg_rating on public.reviews;
create trigger trg_update_avg_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_walk_avg_rating();
