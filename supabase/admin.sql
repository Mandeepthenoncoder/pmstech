-- ===========================================================================
-- Purple Magic careers: dashboard access.
-- Paste into the Supabase SQL editor and Run, AFTER setup.sql.
-- Safe to run more than once.
--
-- Only people listed in app_admins can read applications. Signing up on its
-- own gets you nothing, so a stray account cannot see candidate data.
-- ===========================================================================

-- ------------------------------------------------------------ 1. admin list
create table if not exists public.app_admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  email    text not null,
  added_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;
revoke all on public.app_admins from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------- 2. who can read it
-- Read everything, but only if you are on the list.
drop policy if exists admins_read_applications on public.applications;
create policy admins_read_applications
  on public.applications for select
  to authenticated
  using (public.is_admin());

-- Update only the three review columns. Enforced by the column grant below,
-- so a signed in admin cannot rewrite a candidate's answers or their score.
drop policy if exists admins_update_applications on public.applications;
create policy admins_update_applications
  on public.applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.applications to authenticated;
grant update (status, notes, review_score) on public.applications to authenticated;

-- anon still gets nothing at all. It may only call submit_application().
revoke all on public.applications    from anon;
revoke all on public.role_answer_key from anon, authenticated;

-- ------------------------------------------------------- 3. add an admin
-- Create the person in Authentication -> Users first, then run:
--   select public.add_admin('you@purplemagicstudio.com');
create or replace function public.add_admin(p_email text)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare uid uuid;
begin
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then
    return 'No user with that email. Create them in Authentication -> Users first.';
  end if;
  insert into public.app_admins (user_id, email)
  values (uid, lower(trim(p_email)))
  on conflict (user_id) do nothing;
  return 'Added ' || p_email || ' as an admin.';
end;
$$;

revoke all on function public.add_admin(text) from public, anon, authenticated;

-- ===========================================================================
-- NEXT STEPS
--
-- 1. Authentication -> Users -> Add user. Set an email and password,
--    and tick "Auto Confirm User".
-- 2. Run:  select public.add_admin('that@email.com');
-- 3. Authentication -> Sign In / Providers -> turn OFF "Allow new users to
--    sign up". Nobody should be able to create their own account.
-- 4. Open admin.html and sign in.
--
-- To check who has access:  select email, added_at from public.app_admins;
-- To remove someone:        delete from public.app_admins where email = '...';
-- ===========================================================================
