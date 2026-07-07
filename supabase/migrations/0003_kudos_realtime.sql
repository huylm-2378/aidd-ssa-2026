-- F008_KudosLiveBoard — enable Supabase Realtime on public.kudos.
-- Run in Supabase Dashboard → SQL Editor (after 0001 + 0002 + seed.sql).
-- Idempotent: re-running is safe (guarded by a pg_publication_tables check —
-- Postgres has no `add table if not exists` for publications).
-- RLS "public read kudos" (0001) already gates anon realtime reads: no policy
-- change here. INSERT-only use → no REPLICA IDENTITY change needed (the `new`
-- record on INSERT is always the full row regardless of replica identity).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename  = 'kudos'
  ) then
    alter publication supabase_realtime add table public.kudos;
  end if;
end $$;
