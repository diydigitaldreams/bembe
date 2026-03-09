# Timed Comments on Walk Stop Waveform

## Context
The walk player (`src/app/walk/[walkId]/play/page.tsx`) currently simulates audio playback with a `setInterval` timer — there's no actual `<audio>` element or waveform. Comments will anchor to the simulated timeline (milliseconds into a stop's `duration_seconds`).

Each walk has multiple **stops**, each with its own duration. Comments are per-stop, not per-walk.

## 1. Database: `stop_comments` table

Add migration `supabase/migrations/003_stop_comments.sql`:

```sql
create table public.stop_comments (
  id uuid primary key default uuid_generate_v4(),
  stop_id uuid not null references public.walk_stops (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  timestamp_ms integer not null,          -- position in the track (milliseconds)
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
```

## 2. TypeScript type

Add to `src/types/index.ts`:

```ts
export interface StopComment {
  id: string;
  stop_id: string;
  user_id: string;
  timestamp_ms: number;
  body: string;
  created_at: string;
  user?: Pick<Profile, "id" | "full_name" | "avatar_url">;
}
```

## 3. API: `/api/stops/[stopId]/comments`

New file `src/app/api/stops/[stopId]/comments/route.ts`:

- **GET** — fetch all comments for a stop, joined with `profiles` for user name/avatar. Ordered by `timestamp_ms`.
- **POST** — create a comment. Requires auth. Body: `{ timestamp_ms: number, body: string }`. Validates `timestamp_ms >= 0` and `body` is non-empty (max 280 chars).

## 4. Frontend: Waveform component

New file `src/components/waveform-comments.tsx`:

This is a self-contained component used inside the walk player. It replaces the current static progress bar.

**Props:**
```ts
interface WaveformCommentsProps {
  stopId: string;
  durationSeconds: number;
  elapsed: number;            // current playback position in seconds
  onSeek: (seconds: number) => void;
}
```

**Waveform rendering:**
- Since there's no real audio file to analyze, render a **decorative pseudo-waveform** using pre-generated random bar heights (seeded by stopId for consistency). This is an array of ~80 bars drawn via simple divs, with bars behind the playhead colored in `bembe-teal` and future bars in `bembe-night/10`.
- This replaces the thin progress bar currently in the player.

**Comment markers:**
- Fetch comments from `GET /api/stops/{stopId}/comments` on mount.
- Each comment is positioned horizontally: `left = (timestamp_ms / (durationSeconds * 1000)) * 100%`.
- Rendered as small circular avatars (16×16px) with the user's first initial, sitting above the waveform.
- When multiple comments share the same timestamp (within 2000ms of each other), they stack vertically with a small offset.

**Comment display on playback:**
- During playback, when `elapsed * 1000` comes within 500ms of a comment's `timestamp_ms`, that comment fades in as a speech bubble above its marker. It fades out 3 seconds later.
- Bubble shows: user name, comment text, and timestamp formatted as `m:ss`.

**Click to comment:**
- Clicking on the waveform area (above the bars, in a dedicated "comment zone") opens a small inline input.
- The click position is converted to a timestamp: `clickX / waveformWidth * durationSeconds * 1000` → `timestamp_ms`.
- On submit, POST to the API, then add the new comment to the local list.
- Clicking on the bars themselves triggers seek (existing behavior).

## 5. Integration into the player

Modify `src/app/walk/[walkId]/play/page.tsx`:

- Import `WaveformComments` component.
- Replace the current progress bar section (the `<div className="mb-3">` block with the thin bar + seek handler + time labels) with `<WaveformComments>`.
- Pass `stopId={currentStop.id}`, `durationSeconds={currentStop.duration_seconds}`, `elapsed={elapsed}`, and wire `onSeek` to `setElapsed`.

## 6. i18n strings

Add to both `en` and `es` in `src/lib/i18n/translations.ts`:

```ts
// English
comments: {
  add: "Add a comment...",
  post: "Post",
  at: "at",
  no_comments: "No comments yet",
  login_to_comment: "Log in to comment",
},

// Spanish
comments: {
  add: "Agregar un comentario...",
  post: "Publicar",
  at: "en",
  no_comments: "Sin comentarios aún",
  login_to_comment: "Inicia sesión para comentar",
},
```

## Files changed (summary)
1. `supabase/migrations/003_stop_comments.sql` — **new** (DB table + RLS)
2. `src/types/index.ts` — **edit** (add `StopComment` interface)
3. `src/app/api/stops/[stopId]/comments/route.ts` — **new** (GET + POST)
4. `src/components/waveform-comments.tsx` — **new** (waveform + comment markers + bubbles + input)
5. `src/app/walk/[walkId]/play/page.tsx` — **edit** (swap progress bar for waveform component)
6. `src/lib/i18n/translations.ts` — **edit** (add comment strings in EN + ES)
