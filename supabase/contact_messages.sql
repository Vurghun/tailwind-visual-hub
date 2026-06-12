-- Contact form messages (run in Supabase SQL Editor)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Allow anonymous visitors to submit the contact form (insert only)
create policy "Anyone can submit contact form"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- No public read access (view messages in Supabase Dashboard or via service role)
