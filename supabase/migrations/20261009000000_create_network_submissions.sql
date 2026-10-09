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
  score_scientifique numeric not null check (score_scientifique between 0 and 100),
  score_social numeric not null check (score_social between 0 and 100),
  score_environnemental numeric not null check (score_environnemental between 0 and 100),
  score_politique numeric not null check (score_politique between 0 and 100),
  consent boolean not null check (consent),
  reviewed_at timestamptz
);

alter table public.soumissions_reseau enable row level security;
revoke all on public.soumissions_reseau from anon, authenticated;
grant all on public.soumissions_reseau to service_role;
