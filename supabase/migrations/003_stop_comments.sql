-- =============================================================================
-- Timed comments on walk stops
-- =============================================================================

create table public.stop_comments (
  id uuid primary key default uuid_generate_v4(),
  stop_id uuid not null references public.walk_stops (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  timestamp_ms integer not null,
  body text not null,
  created_at timestamptz not null default now(),

  constraint chk_timestamp_non_negative check (timestamp_ms >= 0),
  constraint chk_body_not_empty check (length(trim(body)) > 0)
);

create index idx_stop_comments_stop on public.stop_comments (stop_id, timestamp_ms);
create index idx_stop_comments_user on public.stop_comments (user_id);

alter table public.stop_comments enable row level security;

-- Anyone can read comments on published walks
create policy "Comments viewable on published walks"
  on public.stop_comments for select using (
    exists (
      select 1 from public.walk_stops ws
      join public.art_walks w on w.id = ws.walk_id
      where ws.id = stop_id and (w.is_published = true or auth.uid() = w.artist_id)
    )
  );

-- Authenticated users can post comments
create policy "Authenticated users can insert comments"
  on public.stop_comments for insert with check (auth.uid() = user_id);

-- Users can delete their own comments
create policy "Users can delete own comments"
  on public.stop_comments for delete using (auth.uid() = user_id);
