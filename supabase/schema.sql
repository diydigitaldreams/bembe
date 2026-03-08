-- =============================================================================
-- Bembe — Puerto Rico's Living Art Museum
-- Complete Supabase Database Schema
-- =============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

create type user_role as enum ('artist', 'patron', 'both');
create type subscription_plan as enum ('free', 'pro');

-- =============================================================================
-- PROFILES (extends auth.users)
-- =============================================================================

create table public.profiles (
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

create index idx_profiles_role on public.profiles (role);
create index idx_profiles_location on public.profiles (lat, lng) where lat is not null and lng is not null;

-- Auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- =============================================================================
-- ART WALKS
-- =============================================================================

create table public.art_walks (
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
  constraint chk_avg_rating_range check (avg_rating >= 0 and avg_rating <= 5),
  constraint chk_total_plays_non_negative check (total_plays >= 0)
);

create index idx_walks_artist on public.art_walks (artist_id);
create index idx_walks_neighborhood on public.art_walks (neighborhood) where is_published = true;
create index idx_walks_municipality on public.art_walks (municipality) where is_published = true;
create index idx_walks_featured on public.art_walks (is_featured) where is_published = true and is_featured = true;
create index idx_walks_price on public.art_walks (price_cents) where is_published = true;
create index idx_walks_created on public.art_walks (created_at desc);
create index idx_walks_search on public.art_walks using gin (
  to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(neighborhood, ''))
);

-- RLS
alter table public.art_walks enable row level security;

create policy "Published walks are viewable by everyone"
  on public.art_walks for select using (
    is_published = true or auth.uid() = artist_id
  );

create policy "Artists can insert own walks"
  on public.art_walks for insert with check (auth.uid() = artist_id);

create policy "Artists can update own walks"
  on public.art_walks for update using (auth.uid() = artist_id);

create policy "Artists can delete own walks"
  on public.art_walks for delete using (auth.uid() = artist_id);

-- =============================================================================
-- WALK STOPS
-- =============================================================================

create table public.walk_stops (
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
  constraint chk_duration_seconds_non_negative check (duration_seconds >= 0),
  unique (walk_id, order_index)
);

create index idx_stops_walk on public.walk_stops (walk_id, order_index);

-- RLS
alter table public.walk_stops enable row level security;

create policy "Walk stops are viewable if walk is viewable"
  on public.walk_stops for select using (
    exists (
      select 1 from public.art_walks w
      where w.id = walk_id and (w.is_published = true or auth.uid() = w.artist_id)
    )
  );

create policy "Artists can manage stops on own walks"
  on public.walk_stops for insert with check (
    exists (select 1 from public.art_walks w where w.id = walk_id and auth.uid() = w.artist_id)
  );

create policy "Artists can update stops on own walks"
  on public.walk_stops for update using (
    exists (select 1 from public.art_walks w where w.id = walk_id and auth.uid() = w.artist_id)
  );

create policy "Artists can delete stops on own walks"
  on public.walk_stops for delete using (
    exists (select 1 from public.art_walks w where w.id = walk_id and auth.uid() = w.artist_id)
  );

-- =============================================================================
-- WALK PURCHASES
-- =============================================================================

create table public.walk_purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles (id) on delete set null,
  walk_id uuid not null references public.art_walks (id) on delete cascade,
  amount_cents integer not null default 0,
  stripe_payment_id text,
  created_at timestamptz not null default now(),

  constraint chk_purchase_amount_non_negative check (amount_cents >= 0)
);

create index idx_purchases_user on public.walk_purchases (user_id) where user_id is not null;
create index idx_purchases_walk on public.walk_purchases (walk_id);
create index idx_purchases_stripe on public.walk_purchases (stripe_payment_id) where stripe_payment_id is not null;

-- RLS
alter table public.walk_purchases enable row level security;

create policy "Users can view own purchases"
  on public.walk_purchases for select using (auth.uid() = user_id);

create policy "Artists can view purchases of own walks"
  on public.walk_purchases for select using (
    exists (select 1 from public.art_walks w where w.id = walk_id and auth.uid() = w.artist_id)
  );

-- Insert is done server-side via service role (webhook), no user-facing insert policy needed.

-- =============================================================================
-- EVENTS
-- =============================================================================

create table public.events (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null default '',
  cover_image_url text not null default '',
  location_name text not null default '',
  lat double precision not null,
  lng double precision not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  ticket_price_cents integer not null default 0,
  max_capacity integer not null default 0,
  tickets_sold integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),

  constraint chk_event_price_non_negative check (ticket_price_cents >= 0),
  constraint chk_event_capacity_positive check (max_capacity >= 0),
  constraint chk_event_tickets_sold_non_negative check (tickets_sold >= 0),
  constraint chk_event_dates check (ends_at > starts_at)
);

create index idx_events_organizer on public.events (organizer_id);
create index idx_events_starts on public.events (starts_at) where is_published = true;
create index idx_events_location on public.events (lat, lng) where is_published = true;

-- RLS
alter table public.events enable row level security;

create policy "Published events are viewable by everyone"
  on public.events for select using (
    is_published = true or auth.uid() = organizer_id
  );

create policy "Organizers can insert own events"
  on public.events for insert with check (auth.uid() = organizer_id);

create policy "Organizers can update own events"
  on public.events for update using (auth.uid() = organizer_id);

create policy "Organizers can delete own events"
  on public.events for delete using (auth.uid() = organizer_id);

-- =============================================================================
-- EVENT TICKETS
-- =============================================================================

create table public.event_tickets (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount_cents integer not null default 0,
  stripe_payment_id text,
  purchased_at timestamptz not null default now(),

  constraint chk_ticket_amount_non_negative check (amount_cents >= 0),
  unique (event_id, user_id)
);

create index idx_tickets_event on public.event_tickets (event_id);
create index idx_tickets_user on public.event_tickets (user_id);

-- RLS
alter table public.event_tickets enable row level security;

create policy "Users can view own tickets"
  on public.event_tickets for select using (auth.uid() = user_id);

create policy "Organizers can view tickets for own events"
  on public.event_tickets for select using (
    exists (select 1 from public.events e where e.id = event_id and auth.uid() = e.organizer_id)
  );

-- =============================================================================
-- BUSINESS SPONSORS
-- =============================================================================

create table public.business_sponsors (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  contact_email text not null,
  logo_url text,
  lat double precision not null,
  lng double precision not null,
  monthly_budget_cents integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),

  constraint chk_sponsor_budget_non_negative check (monthly_budget_cents >= 0)
);

create index idx_sponsors_active on public.business_sponsors (is_active) where is_active = true;
create index idx_sponsors_location on public.business_sponsors (lat, lng);

-- RLS
alter table public.business_sponsors enable row level security;

create policy "Active sponsors are viewable by everyone"
  on public.business_sponsors for select using (is_active = true);

-- Admin-only insert/update/delete (use service role key server-side)

-- =============================================================================
-- WALK SPONSORSHIPS (junction: sponsor ↔ walk)
-- =============================================================================

create table public.walk_sponsorships (
  id uuid primary key default uuid_generate_v4(),
  sponsor_id uuid not null references public.business_sponsors (id) on delete cascade,
  walk_id uuid not null references public.art_walks (id) on delete cascade,
  amount_cents integer not null default 0,
  starts_at date not null default current_date,
  ends_at date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),

  constraint chk_sponsorship_amount_non_negative check (amount_cents >= 0),
  constraint chk_sponsorship_dates check (ends_at is null or ends_at >= starts_at),
  unique (sponsor_id, walk_id)
);

create index idx_sponsorships_walk on public.walk_sponsorships (walk_id) where is_active = true;
create index idx_sponsorships_sponsor on public.walk_sponsorships (sponsor_id);

-- RLS
alter table public.walk_sponsorships enable row level security;

create policy "Active sponsorships are viewable by everyone"
  on public.walk_sponsorships for select using (is_active = true);

-- =============================================================================
-- ARTIST SUBSCRIPTIONS
-- =============================================================================

create table public.artist_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  artist_id uuid not null references public.profiles (id) on delete cascade,
  plan subscription_plan not null default 'free',
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),

  unique (artist_id)
);

create index idx_subscriptions_artist on public.artist_subscriptions (artist_id);
create index idx_subscriptions_stripe on public.artist_subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- RLS
alter table public.artist_subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.artist_subscriptions for select using (auth.uid() = artist_id);

create policy "Users can update own subscription"
  on public.artist_subscriptions for update using (auth.uid() = artist_id);

-- =============================================================================
-- REVIEWS
-- =============================================================================

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  walk_id uuid not null references public.art_walks (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null,
  comment text,
  created_at timestamptz not null default now(),

  constraint chk_rating_range check (rating >= 1 and rating <= 5),
  unique (walk_id, user_id)
);

create index idx_reviews_walk on public.reviews (walk_id);
create index idx_reviews_user on public.reviews (user_id);

-- RLS
alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews for delete using (auth.uid() = user_id);

-- Trigger to update avg_rating on art_walks when reviews change
create or replace function public.update_walk_avg_rating()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  target_walk_id uuid;
begin
  target_walk_id := coalesce(new.walk_id, old.walk_id);
  update public.art_walks
  set avg_rating = coalesce(
    (select round(avg(rating)::numeric, 2) from public.reviews where walk_id = target_walk_id),
    0
  )
  where id = target_walk_id;
  return null;
end;
$$;

create trigger trg_update_avg_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_walk_avg_rating();

-- =============================================================================
-- MESSAGES / CONVERSATIONS
-- =============================================================================

create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  participant_a uuid not null references public.profiles (id) on delete cascade,
  participant_b uuid not null references public.profiles (id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  constraint chk_different_participants check (participant_a <> participant_b),
  unique (participant_a, participant_b)
);

create index idx_conversations_a on public.conversations (participant_a);
create index idx_conversations_b on public.conversations (participant_b);
create index idx_conversations_recent on public.conversations (last_message_at desc);

-- RLS
alter table public.conversations enable row level security;

create policy "Users can view own conversations"
  on public.conversations for select using (
    auth.uid() = participant_a or auth.uid() = participant_b
  );

create policy "Users can create conversations they participate in"
  on public.conversations for insert with check (
    auth.uid() = participant_a or auth.uid() = participant_b
  );

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_messages_conversation on public.messages (conversation_id, created_at desc);
create index idx_messages_sender on public.messages (sender_id);
create index idx_messages_unread on public.messages (conversation_id, is_read) where is_read = false;

-- RLS
alter table public.messages enable row level security;

create policy "Users can view messages in own conversations"
  on public.messages for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (auth.uid() = c.participant_a or auth.uid() = c.participant_b)
    )
  );

create policy "Users can send messages in own conversations"
  on public.messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (auth.uid() = c.participant_a or auth.uid() = c.participant_b)
    )
  );

create policy "Sender can update own messages (mark read)"
  on public.messages for update using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (auth.uid() = c.participant_a or auth.uid() = c.participant_b)
    )
  );

-- Update conversation.last_message_at on new message
create or replace function public.update_conversation_timestamp()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger trg_update_conversation_timestamp
  after insert on public.messages
  for each row execute procedure public.update_conversation_timestamp();
