alter table if exists public.soumissions_reseau
  add column if not exists volunteer_count integer not null default 0
    check (volunteer_count >= 0),
  add column if not exists volunteer_hours numeric not null default 0
    check (volunteer_hours >= 0);

alter table if exists public.projets_reseau
  add column if not exists volunteer_count integer not null default 0
    check (volunteer_count >= 0),
  add column if not exists volunteer_hours numeric not null default 0
    check (volunteer_hours >= 0);

notify pgrst, 'reload schema';
