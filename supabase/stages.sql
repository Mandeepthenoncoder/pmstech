-- ===========================================================================
-- Purple Magic careers: hiring stages.
-- Paste into the Supabase SQL editor and Run, after setup.sql and admin.sql.
-- Safe to run more than once.
--
-- Replaces the old stage list with the buckets used on the dashboard:
--   new           New in
--   seen          Saw the profile
--   awaiting      Awaiting input
--   task          Given task
--   interview     Called for interview
--   hired         Hired
--   rejected      Rejected
--   call_rejected Called, rejected
-- ===========================================================================

alter table public.applications drop constraint if exists applications_status_check;

-- Carry any existing rows onto the new names.
update public.applications set status = 'seen'          where status = 'shortlist';
update public.applications set status = 'task'          where status = 'trial';
update public.applications set status = 'call_rejected' where status = 'withdrawn';

-- Anything unexpected goes back to the start rather than breaking the constraint.
update public.applications
   set status = 'new'
 where status not in ('new','seen','awaiting','task','interview','hired','rejected','call_rejected');

alter table public.applications
  add constraint applications_status_check
  check (status in ('new','seen','awaiting','task','interview','hired','rejected','call_rejected'));

-- Counts per bucket, for a quick look without opening the dashboard.
create or replace view public.application_pipeline as
select
  role_title,
  count(*) filter (where status = 'new')           as new_in,
  count(*) filter (where status = 'seen')          as saw_profile,
  count(*) filter (where status = 'awaiting')      as awaiting_input,
  count(*) filter (where status = 'task')          as given_task,
  count(*) filter (where status = 'interview')     as interview,
  count(*) filter (where status = 'hired')         as hired,
  count(*) filter (where status = 'rejected')      as rejected,
  count(*) filter (where status = 'call_rejected') as called_rejected,
  count(*)                                         as total
from public.applications
group by role_title
order by role_title;

revoke all on public.application_pipeline from anon;
grant select on public.application_pipeline to authenticated;

-- select * from public.application_pipeline;
