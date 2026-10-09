alter table public.soumissions_reseau
  add column if not exists score_scientifique numeric not null default 0
    check (score_scientifique between 0 and 100),
  add column if not exists score_social numeric not null default 0
    check (score_social between 0 and 100),
  add column if not exists score_environnemental numeric not null default 0
    check (score_environnemental between 0 and 100),
  add column if not exists score_politique numeric not null default 0
    check (score_politique between 0 and 100);

notify pgrst, 'reload schema';
