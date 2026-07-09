-- F015_KudosHearts — per-user like toggle (kudo_likes) + count-sync triggers.
-- Run in Supabase Dashboard → SQL Editor (after 0001 + 0002 + 0003 + seed).
-- Idempotent: re-running is safe.

create table if not exists public.kudo_likes (
  kudo_id    uuid        not null references public.kudos(id)     on delete cascade,
  user_id    uuid        not null references auth.users(id)       on delete cascade,
  created_at timestamptz not null default now(),
  primary key (kudo_id, user_id)
);
create index if not exists kudo_likes_user_id_idx on public.kudo_likes (user_id);

alter table public.kudo_likes enable row level security;

-- Board is public-read; a like has a real actor; rows are insert/delete only.
drop policy if exists "public read kudo_likes" on public.kudo_likes;
create policy "public read kudo_likes" on public.kudo_likes
  for select using (true);
drop policy if exists "own insert kudo_likes" on public.kudo_likes;
create policy "own insert kudo_likes" on public.kudo_likes
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "own delete kudo_likes" on public.kudo_likes;
create policy "own delete kudo_likes" on public.kudo_likes
  for delete to authenticated using (auth.uid() = user_id);
-- No UPDATE policy: rows are never mutated.

-- like_count is maintained ONLY here. SECURITY DEFINER so the trigger can UPDATE
-- kudos without any client-facing UPDATE policy on kudos. search_path pinned.
create or replace function public.kudo_likes_count_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.kudos set like_count = like_count + 1 where id = new.kudo_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.kudos set like_count = greatest(0, like_count - 1) where id = old.kudo_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists kudo_likes_count_sync_ins on public.kudo_likes;
create trigger kudo_likes_count_sync_ins
  after insert on public.kudo_likes
  for each row execute function public.kudo_likes_count_sync();

drop trigger if exists kudo_likes_count_sync_del on public.kudo_likes;
create trigger kudo_likes_count_sync_del
  after delete on public.kudo_likes
  for each row execute function public.kudo_likes_count_sync();
