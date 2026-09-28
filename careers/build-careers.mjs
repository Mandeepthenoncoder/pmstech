/* Generates careers.html (the index) and careers/<slug>.html (one page per role).
   Run: node careers/build-careers.mjs
   Re-run after any edit to careers/jobs.mjs. Generated files are committed. */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jobs, meta, commonQuestions } from './jobs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const SITE = 'https://www.purplemagic.tech';
/* vercel.json sets cleanUrls, so /careers.html redirects to /careers.
   Canonicals, og:url and the sitemap must name the URL that actually serves,
   otherwise every one of them points at a redirect. */
const clean = (p) => `${SITE}/${String(p).replace(/\.html$/, '').replace(/^index$/, '')}`;
const POSTED = '2026-09-28';
const VALID_THROUGH = '2026-12-31';

/* Supabase. The anon key is public by design and safe in the page: the schema
   in supabase/setup.sql gives it no table access at all, only permission to
   call submit_application(). The service role key must never appear here. */
const SUPABASE_URL = 'https://kvifzyskdmqtmteipvye.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2aWZ6eXNrZG1xdG10ZWlwdnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NzUzMzYsImV4cCI6MjEwNjE1MTMzNn0.z5sV6xilywfkR6OPA1jVFd4o4W0br0YH23XItbCuKa8';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* The browser only ever receives the questions, never the points. */
const publicQuestions = (job) =>
  [...job.questions, ...commonQuestions].map((q) => ({
    id: q.id,
    type: q.type,
    label: q.label,
    help: q.help || null,
    max: q.max || null,
    maxPick: q.maxPick || null,
    link: q.link || false,
    options: (q.options || []).map((o) => ({ v: o.v, label: o.label }))
  }));

const LOGO = `<svg aria-hidden="true" viewBox="0 0 512 512"><rect width="512" height="512" rx="112.4" fill="#7C3AED"/><path d="M319.2 74.0 L320.4 169.2 L410.6 138.6 L452.2 260.1 L362.0 290.8 L417.1 364.5 L314.6 441.2 L259.5 367.5 L204.6 445.3 L99.7 371.1 L154.6 293.3 L63.6 265.2 L101.3 142.8 L192.3 170.8 L191.1 75.6Z" fill="#fff"/></svg>`;

const head = ({ title, desc, up, canonical, extraHead = '' }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#000000">
<link rel="canonical" href="${clean(canonical)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${clean(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${up}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css">
<link rel="stylesheet" href="${up}styles.css">
<link rel="stylesheet" href="${up}careers.css">
<script>
document.documentElement.classList.add('js');
window.PM_SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
window.PM_SUPABASE_ANON_KEY = ${JSON.stringify(SUPABASE_ANON_KEY)};
</script>
${extraHead}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="nav-wrap">
  <nav class="nav" aria-label="Main">
    <a class="brand" href="${up}index.html" aria-label="Purple Magic home">${LOGO}<span>Purple Magic</span></a>
    <div class="nav-links">
      <a href="${up}careers.html">All roles</a>
      <a href="${up}index.html#services">Services</a>
      <a href="${up}index.html#contact">Contact</a>
    </div>
    <a class="btn btn-ghost btn-sm nav-cta" href="${up}careers.html"><i class="ph ph-briefcase" aria-hidden="true"></i>Roles</a>
  </nav>
</div>
`;

const footer = (up) => `<footer>
  <div class="container">
    <div class="foot-top">
      <div class="foot-brand reveal">
        <a class="brand" href="${up}index.html" aria-label="Purple Magic home">${LOGO}<span class="lockup"><span>Purple</span><span>Magic</span></span></a>
        <p class="foot-line">We build the AI, the brands and the content. Then we hire the people who run it.</p>
      </div>
      <div class="foot-cols reveal" style="--d:100ms">
        <div>
          <p class="foot-label">Questions about a role</p>
          <p><a class="foot-link mono" href="mailto:${meta.contactEmail}">${meta.contactEmail}</a></p>
          <p><a class="foot-link mono" href="https://wa.me/${meta.whatsapp}" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo" aria-hidden="true"></i>+91 70137 49462</a></p>
          <p class="muted">${esc(meta.replyPromise)}</p>
        </div>
        <div>
          <p class="foot-label">Where we are</p>
          <p>Hyderabad, India</p>
          <p class="muted">Baseerbagh and Kokapet.</p>
        </div>
      </div>
    </div>
    <div class="legal">
      <p>&copy; <span id="year">2026</span> Purple Magic. All rights reserved.</p>
      <p><a class="foot-link" href="${up}privacy.html">Privacy</a> &middot; <a class="foot-link" href="${up}terms.html">Terms</a></p>
    </div>
  </div>
</footer>
<script src="${up}careers.js" defer></script>
</body>
</html>
`;

const chips = (job) => `<ul class="jd-chips">
  <li><i class="ph ph-buildings" aria-hidden="true"></i>${esc(job.brand)}</li>
  <li><i class="ph ph-clock" aria-hidden="true"></i>${esc(job.type)}</li>
  <li><i class="ph ph-${job.workplace === 'Work from home' ? 'house' : 'map-pin'}" aria-hidden="true"></i>${esc(job.workplace)}</li>
  <li><i class="ph ph-navigation-arrow" aria-hidden="true"></i>${esc(job.location)}</li>
  <li><i class="ph ph-users-three" aria-hidden="true"></i>${job.openings} opening${job.openings > 1 ? 's' : ''}</li>
</ul>`;

const list = (items, icon) =>
  `<ul class="ticks">${items.map((t) => `<li><i class="ph ph-${icon}" aria-hidden="true"></i>${esc(t)}</li>`).join('')}</ul>`;

/* ---------------------------------------------------------------- role page */
function rolePage(job) {
  const title = `${job.title} at ${job.brand} | Purple Magic careers`;
  const desc = job.blurb;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: `<p>${job.blurb}</p><p>${job.about.join('</p><p>')}</p><h3>What you would do</h3><ul>${job.doing.map((d) => `<li>${d}</li>`).join('')}</ul><h3>What we are looking for</h3><ul>${job.need.map((d) => `<li>${d}</li>`).join('')}</ul>`,
    datePosted: POSTED,
    validThrough: VALID_THROUGH,
    employmentType: 'FULL_TIME',
    directApply: true,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Purple Magic',
      sameAs: SITE,
      logo: `${SITE}/logo-mark.svg`
    },
    url: clean(`careers/${job.slug}.html`),
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressRegion: 'Telangana', addressCountry: 'IN' }
    },
    ...(job.workplace === 'Work from home' ? { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: 'India' } } : {})
  };

  const extraHead = `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n`;

  return `${head({ title, desc, up: '../', canonical: `careers/${job.slug}.html`, extraHead })}
<main id="main" class="jd">
  <header class="jd-hero">
    <div class="container">
      <a class="back" href="../careers.html"><i class="ph ph-arrow-left" aria-hidden="true"></i>All roles</a>
      <p class="eyebrow reveal">${esc(job.team)}</p>
      <h1 class="jd-title reveal" style="--d:60ms">${esc(job.title)}</h1>
      <p class="lede reveal" style="--d:120ms">${esc(job.blurb)}</p>
      <div class="reveal" style="--d:180ms">${chips(job)}</div>
      <div class="cta-row reveal" style="--d:240ms">
        <a class="btn btn-primary" href="#apply">Apply in 5 minutes <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
        <span class="cta-note">No CV needed. Just answer the questions.</span>
      </div>
    </div>
  </header>

  <section class="t-white round-top">
    <div class="container jd-body">
      <div class="jd-main">
        <div class="jd-block reveal">
          <h2 class="h2">About the role</h2>
          ${job.about.map((p) => `<p class="lede">${esc(p)}</p>`).join('')}
        </div>

        <div class="jd-block reveal">
          <h2 class="h2">What you would do</h2>
          ${list(job.doing, 'check')}
        </div>

        <div class="jd-block reveal">
          <h2 class="h2">What you are getting into</h2>
          <p class="lede">The honest version. Read this part twice.</p>
          <div class="card reality">${list(job.reality, 'warning-circle')}</div>
        </div>

        <div class="jd-block reveal">
          <h2 class="h2">What we are looking for</h2>
          ${list(job.need, 'check')}
          <h3 class="sub-h">Nice to have, not required</h3>
          ${list(job.bonus, 'plus')}
        </div>
      </div>

      <aside class="jd-side">
        <div class="card jd-sticky reveal">
          <h3>At a glance</h3>
          <dl class="glance">
            <div><dt>Brand</dt><dd>${esc(job.brand)}</dd></div>
            <div><dt>Type</dt><dd>${esc(job.type)}</dd></div>
            <div><dt>Where</dt><dd>${esc(job.location)}</dd></div>
            <div><dt>Openings</dt><dd>${job.openings}</dd></div>
            <div><dt>Pay</dt><dd>Discussed at interview</dd></div>
          </dl>
          <a class="btn btn-primary" href="#apply">Apply now <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          <p class="fine">${esc(meta.replyPromise)}</p>
        </div>
      </aside>
    </div>
  </section>

  <section id="apply" class="t-grey round-bottom">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Apply</p>
        <h2 class="h2">No CV. Just answer these.</h2>
        <p class="lede">About five minutes. Most of it is tapping. Two short written answers, in your own words.</p>
      </div>
      <div class="card apply-card reveal" data-role="${esc(job.slug)}" data-role-title="${esc(job.title)}" data-role-brand="${esc(job.brand)}">
        <noscript><p>This application needs JavaScript. Email <a href="mailto:${meta.contactEmail}">${meta.contactEmail}</a> instead and we will send you the questions.</p></noscript>
      </div>
    </div>
  </section>
</main>
<script id="role-data" type="application/json">${JSON.stringify({ slug: job.slug, title: job.title, brand: job.brand, questions: publicQuestions(job) }).replace(/</g, '\\u003c')}</script>
${footer('../')}`;
}

/* --------------------------------------------------------------- index page */
function indexPage() {
  const cards = jobs
    .map(
      (job, i) => `<article class="card card-hover role reveal"${i ? ` style="--d:${Math.min(i, 3) * 80}ms"` : ''}>
      <div class="role-top">
        <p class="tag">${esc(job.brand)}</p>
        <p class="tag">${esc(job.workplace)}</p>
      </div>
      <h3><a class="stretch" href="careers/${job.slug}.html">${esc(job.title)}</a></h3>
      <p class="muted">${esc(job.blurb)}</p>
      <p class="role-meta"><i class="ph ph-map-pin" aria-hidden="true"></i>${esc(job.location)}</p>
      <p class="role-go"><span>Read the role and apply</span><i class="ph ph-arrow-right" aria-hidden="true"></i></p>
    </article>`
    )
    .join('\n      ');

  const title = 'Careers at Purple Magic | Open roles in Hyderabad';
  const desc = 'Open roles at Purple Magic and the House of Mangatrai in Hyderabad. No CV needed. A five minute application that asks about the actual work.';

  return `${head({ title, desc, up: '', canonical: 'careers.html' })}
<main id="main">
  <header class="careers-hero">
    <div class="container">
      <p class="pill reveal"><span class="dot"></span>${jobs.length} open roles &middot; Hyderabad</p>
      <h1 class="hero-title reveal" style="--d:60ms"><span>We would rather see</span><span>how you think</span></h1>
      <p class="sub reveal" style="--d:120ms">So we do not ask for a CV. Pick a role, read what the job is really like, and answer a few questions about the work itself. It takes about five minutes.</p>
      <div class="cta-row reveal" style="--d:180ms">
        <a class="btn btn-primary" href="#roles">See the roles <i class="ph ph-arrow-down" aria-hidden="true"></i></a>
        <span class="cta-note">${esc(meta.replyPromise)}</span>
      </div>
    </div>
  </header>

  <section class="t-white round-top" id="roles">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Open roles</p>
        <h2 class="h2">${jobs.length} roles, across the studio and the stores</h2>
        <p class="lede">${esc(meta.brandLine)}</p>
      </div>
      <div class="grid-3 roles">
      ${cards}
      </div>
    </div>
  </section>

  <section class="t-grey round-bottom">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">How hiring works here</p>
        <h2 class="h2">Four steps, and you always hear back</h2>
      </div>
      <ol class="grid-3 hiring">
        <li class="card reveal"><p class="n">01</p><h3>Answer the questions</h3><p>About five minutes, on your phone. No CV, no cover letter, no login.</p></li>
        <li class="card reveal" style="--d:80ms"><p class="n">02</p><h3>We read every one</h3><p>Your answers are scored against what the role actually needs. You hear back either way within five working days.</p></li>
        <li class="card reveal" style="--d:160ms"><p class="n">03</p><h3>A real conversation</h3><p>A call or a meeting at the office. We talk about the work, not your résumé formatting.</p></li>
        <li class="card reveal"><p class="n">04</p><h3>A paid trial task</h3><p>For most roles, a small real task, paid. It tells both of us more than an interview ever could.</p></li>
      </ol>
      <div class="card note reveal">
        <span class="ico"><i class="ph ph-shield-check" aria-hidden="true"></i></span>
        <div>
          <h3>About your details</h3>
          <p class="muted">We collect only what we need to assess your application and contact you about it. We do not sell or share it. Ask us to delete your application at any time by writing to <a href="mailto:${meta.contactEmail}">${meta.contactEmail}</a>. Applications are deleted after twelve months.</p>
        </div>
      </div>
    </div>
  </section>
</main>
${footer('')}`;
}

/* ------------------------------------------------------------------- write */
mkdirSync(join(root, 'careers'), { recursive: true });
writeFileSync(join(root, 'careers.html'), indexPage());

/* Question text for the admin dashboard, so answers read as words not q3: b.
   Labels only, never points. */
const labels = {};
for (const job of jobs) {
  labels[job.slug] = { title: job.title, brand: job.brand, questions: {} };
  for (const q of [...job.questions, ...commonQuestions]) {
    labels[job.slug].questions[q.id] = {
      label: q.label,
      type: q.type,
      options: Object.fromEntries((q.options || []).map((o) => [o.v, o.label]))
    };
  }
}
writeFileSync(join(root, 'careers', 'question-labels.json'), JSON.stringify(labels));

/* robots.txt and sitemap.xml. Google Jobs needs to be able to crawl the role
   pages to pick up their JobPosting data. admin.html is kept out of both. */
writeFileSync(join(root, 'robots.txt'),
`User-agent: *
Allow: /
Disallow: /admin.html

Sitemap: ${SITE}/sitemap.xml
`);

const urls = [
  { loc: '', pri: '1.0' },
  { loc: 'careers.html', pri: '0.9' },
  ...jobs.map((j) => ({ loc: `careers/${j.slug}.html`, pri: '0.8' })),
  { loc: 'privacy.html', pri: '0.2' },
  { loc: 'terms.html', pri: '0.2' }
];
writeFileSync(join(root, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${clean(u.loc)}</loc>
    <lastmod>${POSTED}</lastmod>
    <priority>${u.pri}</priority>
  </url>`).join('\n')}
</urlset>
`);
let n = 1;
for (const job of jobs) {
  writeFileSync(join(root, 'careers', `${job.slug}.html`), rolePage(job));
  console.log(`  ${n++}. careers/${job.slug}.html`);
}
console.log(`\nBuilt careers.html and ${jobs.length} role pages.`);
