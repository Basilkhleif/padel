-- Tables
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  created_by uuid,
  title text not null,
  venue text,
  starts_at timestamptz not null,
  players_needed int not null check (players_needed between 2 and 8),
  notes text,
  is_cancelled boolean not null default false,
  created_at timestamptz not null default now()
);

create type rsvp_status as enum ('yes','no','maybe');

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  user_id uuid,
  display_name text not null,
  status rsvp_status not null,
  created_at timestamptz not null default now(),
  unique (game_id, display_name)
);

-- View for counts
create or replace view public.game_rsvp_counts as
select g.id as game_id,
       coalesce(sum((r.status = 'yes')::int),0)   as yes_count,
       coalesce(sum((r.status = 'maybe')::int),0) as maybe_count,
       coalesce(sum((r.status = 'no')::int),0)    as no_count
from public.games g
left join public.rsvps r on r.game_id = g.id
group by g.id;

-- RLS
alter table public.games enable row level security;
alter table public.rsvps enable row level security;

-- Anyone can read (so friends don't need accounts to view)
create policy if not exists "Public read games" on public.games
for select using (true);

create policy if not exists "Public read rsvps" on public.rsvps
for select using (true);

-- Allow inserting games (open). For production you may restrict this.
create policy if not exists "Create game (open)" on public.games
for insert with check (true);

-- Only the creator can update if signed in (we won't show update UI for guests yet)
create policy if not exists "Update own game" on public.games
for update
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

-- Allow inserting RSVPs (open)
create policy if not exists "Add rsvp (open)" on public.rsvps
for insert with check (true);

-- Optional: index for speed
create index if not exists idx_rsvps_game on public.rsvps(game_id);
