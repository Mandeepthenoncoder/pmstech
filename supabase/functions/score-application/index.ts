// Purple Magic careers: receives an application, scores the structured answers
// server side, and stores it. The browser never sees the answer key.
//
// Deploy:  supabase functions deploy score-application --no-verify-jwt
// Secrets: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.
//          Set ALLOWED_ORIGIN to your live domain before going public.

import { createClient } from 'jsr:@supabase/supabase-js@2';
import answerKey from './answer-key.json' with { type: 'json' };

type Question = {
  type: 'choice' | 'multi';
  maxPick: number | null;
  options: Record<string, number>;
  knockouts: string[];
  flags: Record<string, string>;
};
type RoleKey = { title: string; brand: string; max: number; questions: Record<string, Question> };
const KEY = answerKey as unknown as Record<string, RoleKey>;

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*';
const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(\+?91)?[6-9]\d{9}$/;
const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no look alikes

function reference(): string {
  const n = new Uint8Array(5);
  crypto.getRandomValues(n);
  return 'PM-' + Array.from(n, (b) => REF_CHARS[b % REF_CHARS.length]).join('');
}

function clean(v: unknown, limit: number): string {
  return String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
}

/** Scores only choice and multi answers. Free text is left for human review. */
function score(roleKey: RoleKey, answers: Record<string, unknown>) {
  let raw = 0;
  let knockout = false;
  const flags = new Set<string>();

  for (const [qid, q] of Object.entries(roleKey.questions)) {
    const given = answers[qid];

    if (q.type === 'multi') {
      const picked = Array.isArray(given) ? given.map(String) : [];
      const allowed = q.maxPick ?? picked.length;
      // Score the candidate's best picks, capped, so extra picks cannot inflate.
      const pts = picked
        .filter((v) => v in q.options)
        .map((v) => {
          if (q.knockouts.includes(v)) knockout = true;
          if (q.flags[v]) flags.add(q.flags[v]);
          return q.options[v];
        })
        .sort((a, b) => b - a)
        .slice(0, allowed);
      raw += pts.reduce((a, b) => a + b, 0);
      continue;
    }

    const v = given == null ? '' : String(given);
    if (!(v in q.options)) continue;
    if (q.knockouts.includes(v)) knockout = true;
    if (q.flags[v]) flags.add(q.flags[v]);
    raw += q.options[v];
  }

  const auto = roleKey.max > 0 ? Math.round((raw / roleKey.max) * 100) : 0;
  return { auto: Math.max(0, Math.min(100, auto)), knockout, flags: [...flags] };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Bad JSON' }, 400);
  }

  const role = clean(body.role, 64);
  const roleKey = KEY[role];
  if (!roleKey) return json({ error: 'Unknown role' }, 400);

  const name = clean(body.name, 120);
  const email = clean(body.email, 160).toLowerCase();
  const phone = clean(body.phone, 20).replace(/[\s-]/g, '');

  if (!name) return json({ error: 'Name is required' }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: 'Invalid email' }, 400);
  if (!PHONE_RE.test(phone)) return json({ error: 'Invalid phone' }, 400);
  if (body.consent !== true) return json({ error: 'Consent is required' }, 400);

  const answers = (body.answers && typeof body.answers === 'object' ? body.answers : {}) as Record<string, unknown>;

  // Trim free text so a huge paste cannot bloat the row.
  const stored: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(answers)) {
    if (Array.isArray(v)) stored[k] = v.slice(0, 10).map((x) => clean(x, 64));
    else stored[k] = clean(v, 1000);
  }

  const { auto, knockout, flags } = score(roleKey, answers);

  const db = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  );

  const row = {
    reference: reference(),
    role,
    role_title: roleKey.title,
    brand: roleKey.brand,
    name,
    phone,
    email,
    answers: stored,
    auto_score: auto,
    max_score: 100,
    knockout,
    flags,
    source: clean(req.headers.get('referer'), 200),
    user_agent: clean(req.headers.get('user-agent'), 250)
  };

  // A second application for the same role replaces the first.
  const { data, error } = await db
    .from('applications')
    .upsert(row, { onConflict: 'role,email', ignoreDuplicates: false })
    .select('reference')
    .single();

  if (error) {
    console.error('insert failed', error.message);
    return json({ error: 'Could not save the application' }, 500);
  }

  return json({ ok: true, reference: data?.reference ?? row.reference });
});
