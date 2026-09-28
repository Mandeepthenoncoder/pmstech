-- ===========================================================================
-- Purple Magic careers: dashboard update.
-- Paste into the Supabase SQL editor and Run. Safe to run more than once.
--
-- Run this if the dashboard will not move a candidate to another stage.
-- That happens when the database still has the old stage names, so writing
-- the new ones breaks the check constraint and the update is rejected.
--
-- This file does two things:
--   1. Installs the current stage list and carries old rows over.
--   2. Adds starring, so you can mark the profiles worth coming back to.
-- ===========================================================================

-- ------------------------------------------------------------- 1. stages
alter table public.applications drop constraint if exists applications_status_check;

update public.applications set status = 'seen'          where status = 'shortlist';
update public.applications set status = 'task'          where status = 'trial';
update public.applications set status = 'call_rejected' where status = 'withdrawn';

update public.applications
   set status = 'new'
 where status not in ('new','seen','awaiting','task','interview','hired','rejected','call_rejected');

alter table public.applications
  add constraint applications_status_check
  check (status in ('new','seen','awaiting','task','interview','hired','rejected','call_rejected'));

-- -------------------------------------------------------------- 2. stars
alter table public.applications
  add column if not exists starred boolean not null default false;

create index if not exists applications_starred_idx
  on public.applications (starred) where starred;

comment on column public.applications.starred is
  'Marked by a reviewer as one to come back to. Independent of the stage.';

-- Reviewers may set the stage, the star, the written score and notes.
-- They still cannot touch auto_score or the candidate''s own answers.
grant update (status, notes, review_score, starred) on public.applications to authenticated;

-- --------------------------------------------------------- 3. shortlist
-- Dropped first: a replace cannot add a column in the middle of a view.
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
-- Check it worked. This should list the eight stages and no error:
--   select unnest(enum_range(null::text)) ;  -- not an enum, use the constraint:
--   select pg_get_constraintdef(oid) from pg_constraint
--    where conname = 'applications_status_check';
--
-- And this should return true:
--   select exists (select 1 from information_schema.columns
--                   where table_name='applications' and column_name='starred');
-- ===========================================================================
