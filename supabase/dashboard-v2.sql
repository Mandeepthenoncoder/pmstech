-- ===========================================================================
-- Purple Magic careers: dashboard v2.
-- Paste into the Supabase SQL editor and Run. Safe to run more than once.
--
-- This file is cumulative. If you skipped an earlier one, running this is
-- enough: it installs the stages, starring, and the new triage verdicts.
--
-- Stages now:
--   new           New in
--   relevant      Relevant
--   considered    Can be considered
--   seen          Saw the profile
--   awaiting      Awaiting input
--   task          Given task
--   interview     Called for interview
--   hired         Hired
--   rejected      Rejected
--   call_rejected Called, rejected
-- ===========================================================================

-- --------------------------------------------------------------- stages
alter table public.applications drop constraint if exists applications_status_check;

update public.applications set status = 'seen'          where status = 'shortlist';
update public.applications set status = 'task'          where status = 'trial';
update public.applications set status = 'call_rejected' where status = 'withdrawn';

update public.applications
   set status = 'new'
 where status not in ('new','relevant','considered','seen','awaiting',
                      'task','interview','hired','rejected','call_rejected');

alter table public.applications
  add constraint applications_status_check
  check (status in ('new','relevant','considered','seen','awaiting',
                    'task','interview','hired','rejected','call_rejected'));

-- ---------------------------------------------------------------- stars
alter table public.applications
  add column if not exists starred boolean not null default false;

create index if not exists applications_starred_idx
  on public.applications (starred) where starred;

comment on column public.applications.starred is
  'Marked by a reviewer as one to come back to. Independent of the stage.';

-- ------------------------------------------------------------ what a reviewer may change
grant update (status, notes, review_score, starred) on public.applications to authenticated;

-- ------------------------------------------------------------- per role counts
-- Feeds the dashboard home screen: one row per role, with how many are waiting.
drop view if exists public.application_pipeline;
create view public.application_pipeline as
select
  role,
  role_title,
  brand,
  count(*) filter (where status = 'new')                            as new_in,
  count(*) filter (where status = 'relevant')                       as relevant,
  count(*) filter (where status = 'considered')                     as considered,
  count(*) filter (where status in ('rejected','call_rejected'))    as rejected,
  count(*) filter (where starred)                                   as starred,
  count(*)                                                          as total,
  max(created_at)                                                   as latest
from public.applications
group by role, role_title, brand;

revoke all on public.application_pipeline from anon;
grant select on public.application_pipeline to authenticated;

-- --------------------------------------------------------------- shortlist
drop view if exists public.application_shortlist;
create view public.application_shortlist as
select
  reference,
  created_at at time zone 'Asia/Kolkata' as applied_ist,
  role_title,
  brand,
  name,
  phone,
  email,
  starred,
  auto_score,
  review_score,
  knockout,
  flags,
  status,
  answers
from public.applications
where not knockout
order by starred desc, auto_score desc, created_at asc;

revoke all on public.application_shortlist from anon;
grant select on public.application_shortlist to authenticated;

-- ===========================================================================
-- Check:
--   select pg_get_constraintdef(oid) from pg_constraint
--    where conname = 'applications_status_check';
--   select * from public.application_pipeline;
-- ===========================================================================
