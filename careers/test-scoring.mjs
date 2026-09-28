/* Sanity checks on the answer key and the generated pages.
   Run: node careers/test-scoring.mjs */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jobs, commonQuestions } from './jobs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const key = JSON.parse(readFileSync(join(root, 'supabase/functions/score-application/answer-key.json'), 'utf8'));

let fails = 0;
const ok = (cond, msg) => { if (!cond) { console.log('  FAIL ' + msg); fails++; } };

/* Mirrors the edge function's score(). Kept in step by hand. */
function score(roleKey, answers) {
  let raw = 0, knockout = false;
  const flags = new Set();
  for (const [qid, q] of Object.entries(roleKey.questions)) {
    const given = answers[qid];
    if (q.type === 'multi') {
      const picked = Array.isArray(given) ? given.map(String) : [];
      const allowed = q.maxPick ?? picked.length;
      const pts = picked.filter((v) => v in q.options).map((v) => {
        if (q.knockouts.includes(v)) knockout = true;
        if (q.flags[v]) flags.add(q.flags[v]);
        return q.options[v];
      }).sort((a, b) => b - a).slice(0, allowed);
      raw += pts.reduce((a, b) => a + b, 0);
      continue;
    }
    const v = given == null ? '' : String(given);
    if (!(v in q.options)) continue;
    if (q.knockouts.includes(v)) knockout = true;
    if (q.flags[v]) flags.add(q.flags[v]);
    raw += q.options[v];
  }
  return { auto: Math.max(0, Math.min(100, Math.round((raw / roleKey.max) * 100))), knockout, flags: [...flags] };
}

const best = (rk) => Object.fromEntries(Object.entries(rk.questions).map(([id, q]) => {
  const sorted = Object.entries(q.options).sort((a, b) => b[1] - a[1]);
  return [id, q.type === 'multi' ? sorted.slice(0, q.maxPick ?? sorted.length).map(([v]) => v) : sorted[0][0]];
}));
const worst = (rk) => Object.fromEntries(Object.entries(rk.questions).map(([id, q]) => {
  const sorted = Object.entries(q.options).sort((a, b) => a[1] - b[1]);
  return [id, q.type === 'multi' ? [sorted[0][0]] : sorted[0][0]];
}));

console.log('Answer key\n');
for (const [slug, rk] of Object.entries(key)) {
  const hi = score(rk, best(rk));
  const lo = score(rk, worst(rk));
  const blank = score(rk, {});
  console.log(`  ${slug}`);
  console.log(`    best answers  ${String(hi.auto).padStart(3)} / 100   knockout=${hi.knockout}`);
  console.log(`    worst answers ${String(lo.auto).padStart(3)} / 100   knockout=${lo.knockout} flags=[${lo.flags}]`);
  console.log(`    left blank    ${String(blank.auto).padStart(3)} / 100`);

  ok(hi.auto === 100, `${slug}: best answers should score 100, got ${hi.auto}`);
  ok(!hi.knockout, `${slug}: best answers must not knock out`);
  ok(blank.auto === 0, `${slug}: a blank form should score 0`);
  ok(lo.auto < hi.auto, `${slug}: worst must score below best`);
  ok(rk.max > 0, `${slug}: max must be positive`);

  for (const [qid, q] of Object.entries(rk.questions)) {
    const pts = Object.values(q.options);
    ok(pts.length >= 2, `${slug}.${qid}: needs at least two options`);
    ok(Math.max(...pts) > 0, `${slug}.${qid}: every question needs one option worth points`);
  }
}

/* Every knockout option must be reachable and worth zero. */
for (const job of jobs) {
  for (const q of [...job.questions, ...commonQuestions]) {
    for (const o of q.options || []) {
      if (o.knockout) ok((o.p || 0) === 0, `${job.slug}.${q.id}.${o.v}: a knockout option should be worth 0`);
    }
  }
}

/* The browser must never receive the points. */
console.log('\nLeak check on generated pages\n');
for (const job of jobs) {
  const html = readFileSync(join(root, 'careers', `${job.slug}.html`), 'utf8');
  const data = JSON.parse(html.match(/<script id="role-data"[^>]*>([\s\S]*?)<\/script>/)[1].replace(/\\u003c/g, '<'));
  const blob = JSON.stringify(data);
  ok(!/"p"\s*:/.test(blob), `${job.slug}: points leaked into the page`);
  ok(!/knockout/i.test(blob), `${job.slug}: knockout flags leaked into the page`);
  ok(!/"flag"\s*:/.test(blob), `${job.slug}: behaviour flags leaked into the page`);
  ok(data.questions.length === job.questions.length + commonQuestions.length,
    `${job.slug}: question count mismatch`);
  console.log(`  ${job.slug}: ${data.questions.length} questions sent, no scoring data`);
}

console.log(fails ? `\n${fails} check(s) failed.` : '\nAll checks passed.');
process.exit(fails ? 1 : 0);
