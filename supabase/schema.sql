-- Purple Magic careers. Run once in the Supabase SQL editor.
-- Project: kvifzyskdmqtmteipvye
--
-- Design note: the public (anon) role can do NOTHING here. The website posts to
-- the score-application edge function, which uses the service role key to write.
-- That keeps both the answer key and the stored applications out of the browser.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- table
create table if not exists public.applications (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  reference     text not null unique,          -- e.g. PM-7K3Q2, shown to the candidate

  role          text not null,                 -- slug from careers/jobs.mjs
  role_title    text not null,
  brand         text not null,

  name          text not null,
  phone         text not null,
  email         text not null,

  answers       jsonb not null default '{}'::jsonb,

  -- scoring, all written server side by the edge function
  auto_score    integer not null default 0,    -- 0 to 100, structured answers only
  max_score     integer not null default 100,
  knockout      boolean not null default false,-- answered "no" to a hard requirement
  flags         text[] not null default '{}',  -- e.g. blackhat, pushy, fidelity

  -- filled in later by a human or a review pass
  review_score  integer,                       -- 0 to 100 for the written answers
  status        text not null default 'new'
                check (status in ('new','shortlist','interview','trial','hired','rejected','withdrawn')),
  notes         text,

  -- housekeeping
  consent_at    timestamptz not null default now(),
  purge_after   date not null default (current_date + interval '12 months'),
  source        text,
  user_agent    text
);

comment on table  public.applications is 'Careers applications. Written only by the score-application edge function.';
comment on column public.applications.auto_score is 'Structured answers only, 0-100. Written answers are scored separately in review_score.';
comment on column public.applications.purge_after is 'Delete on or after this date. Twelve months, as told to the candidate.';

create index if not exists applications_role_idx    on public.applications (role, created_at desc);
create index if not exists applications_score_idx   on public.applications (role, auto_score desc);
create index if not exists applications_status_idx  on public.applications (status);
create index if not exists applications_purge_idx   on public.applications (purge_after);

-- One application per person per role. A resubmission replaces the old one.
-- The edge function lowercases the email before writing, so a plain column
-- constraint is enough, and upsert can target it by name.
alter table public.applications
  drop constraint if exists applications_one_per_role;
alter table public.applications
  add constraint applications_one_per_role unique (role, email);

-- ---------------------------------------------------------------- security
alter table public.applications enable row level security;

-- No policies for anon or authenticated: nobody reads or writes from the browser.
-- The service role bypasses RLS, which is how the edge function writes.
revoke all on public.applications from anon, authenticated;

-- ---------------------------------------------------------------- shortlist
-- A convenience view for reviewing. Query it from the Supabase table editor
-- or the SQL editor while signed in as the project owner.
create or replace view public.application_shortlist as
select
  reference,
  created_at at time zone 'Asia/Kolkata' as applied_ist,
  role_title,
  brand,
  name,
  phone,
  email,
  auto_score,
  review_score,
  coalesce(review_score, 0) + auto_score as combined,
  knockout,
  flags,
  status,
  answers->>'why'  as why_this_role,
  answers
from public.applications
where not knockout
order by auto_score desc, created_at asc;

comment on view public.application_shortlist is 'Non knocked out applicants, strongest structured score first.';

-- ---------------------------------------------------------------- retention
-- Optional: schedule with pg_cron if the extension is enabled on your plan.
create or replace function public.purge_old_applications()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare removed integer;
begin
  delete from public.applications where purge_after <= current_date;
  get diagnostics removed = row_count;
  return removed;
end;
$$;

revoke all on function public.purge_old_applications() from public, anon, authenticated;

-- select cron.schedule('purge-applications', '0 3 * * *', $$select public.purge_old_applications()$$);
