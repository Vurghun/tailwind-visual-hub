-- Run this in the Supabase SQL Editor to set up (or upgrade) the table used by
-- the "Save Design" feature of the Tailwind Visual Hub.

create table if not exists public.saved_components (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  tool text not null default 'box-shadow',
  class_string text,
  config jsonb not null
);

-- If you created the table with an earlier version, add the new columns:
alter table public.saved_components
  add column if not exists name text;
alter table public.saved_components
  add column if not exists tool text not null default 'box-shadow';

-- Row Level Security: allow anonymous read / insert / delete from the browser.
alter table public.saved_components enable row level security;

drop policy if exists "Public read access" on public.saved_components;
create policy "Public read access"
  on public.saved_components
  for select
  using (true);

drop policy if exists "Public insert access" on public.saved_components;
create policy "Public insert access"
  on public.saved_components
  for insert
  with check (true);

drop policy if exists "Public delete access" on public.saved_components;
create policy "Public delete access"
  on public.saved_components
  for delete
  using (true);
