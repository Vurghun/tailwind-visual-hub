-- Run this in the Supabase SQL Editor to set up (or upgrade) the table used by
-- the "Save Design" feature of the Tailwind Visual Hub.
--
-- BEFORE running: enable anonymous sign-in in Supabase Dashboard:
--   Authentication → Providers → Anonymous sign-ins → Enable

create table if not exists public.saved_components (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  tool text not null default 'box-shadow',
  class_string text,
  config jsonb not null,
  user_id uuid references auth.users (id) on delete cascade
);

-- Upgrade from the public shared table (earlier versions had no user_id).
alter table public.saved_components
  add column if not exists name text;
alter table public.saved_components
  add column if not exists tool text not null default 'box-shadow';
alter table public.saved_components
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

-- Legacy rows (saved before per-user isolation) are no longer readable under RLS.
delete from public.saved_components where user_id is null;

create index if not exists saved_components_user_tool_idx
  on public.saved_components (user_id, tool, created_at desc);

alter table public.saved_components enable row level security;

-- Remove old public policies (everyone saw everyone's saves).
drop policy if exists "Public read access" on public.saved_components;
drop policy if exists "Public insert access" on public.saved_components;
drop policy if exists "Public delete access" on public.saved_components;
drop policy if exists "Select own saves" on public.saved_components;
drop policy if exists "Insert own saves" on public.saved_components;
drop policy if exists "Delete own saves" on public.saved_components;

-- Each signed-in user (including anonymous) only sees their own rows.
create policy "Select own saves"
  on public.saved_components
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Insert own saves"
  on public.saved_components
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Delete own saves"
  on public.saved_components
  for delete
  to authenticated
  using (auth.uid() = user_id);
