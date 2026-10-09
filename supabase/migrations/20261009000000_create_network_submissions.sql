create table if not exists public.soumissions_reseau (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  approval_token_hash text unique,
  project_name text not null,
  organization text not null,
  contact_name text not null,
  contact_email text not null,
  global_score numeric not null check (global_score between 0 and 100),
  economic_value numeric not null default 0 check (economic_value >= 0),
  data_value numeric not null default 0 check (data_value >= 0),
  scientific_score numeric not null check (scientific_score between 0 and 100),
  social_score numeric not null check (social_score between 0 and 100),
  environmental_score numeric not null check (environmental_score between 0 and 100),
  political_score numeric not null check (political_score between 0 and 100),
  consent boolean not null check (consent),
  reviewed_at timestamptz
);

alter table public.soumissions_reseau enable row level security;
revoke all on public.soumissions_reseau from anon, authenticated;
grant all on public.soumissions_reseau to service_role;
