/* Turns careers/jobs.mjs into the answer key the edge function scores against.
   Run: node careers/build-answer-key.mjs
   Re-run after ANY change to points in jobs.mjs, then redeploy the function. */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jobs, commonQuestions } from './jobs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'supabase', 'functions', 'score-application');

const key = {};

for (const job of jobs) {
  const questions = {};
  let max = 0;

  for (const q of [...job.questions, ...commonQuestions]) {
    if (q.type === 'text') continue; // written answers are reviewed by a person

    const opts = {};
    const knockouts = [];
    const flags = {};
    for (const o of q.options || []) {
      opts[o.v] = o.p || 0;
      if (o.knockout) knockouts.push(o.v);
      if (o.flag) flags[o.v] = o.flag;
    }

    const points = Object.values(opts);
    if (q.type === 'multi') {
      const pick = q.maxPick || points.length;
      max += points.sort((a, b) => b - a).slice(0, pick).reduce((a, b) => a + b, 0);
    } else {
      max += Math.max(0, ...points);
    }

    questions[q.id] = {
      type: q.type,
      maxPick: q.maxPick || null,
      options: opts,
      knockouts,
      flags
    };
  }

  key[job.slug] = { title: job.title, brand: job.brand, max, questions };
}

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'answer-key.json'), JSON.stringify(key, null, 2));

for (const [slug, v] of Object.entries(key)) {
  console.log(`  ${slug}: ${Object.keys(v.questions).length} scored questions, max ${v.max} raw points`);
}
console.log('\nWrote supabase/functions/score-application/answer-key.json');
