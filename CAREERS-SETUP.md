# Careers pages: how they work and how to set them up

Six roles, each with a full job description and a five minute application.
No CV. Answers are scored per role, server side, and land in Supabase.

---

## 1. What is where

| File | What it is |
|---|---|
| `careers/jobs.mjs` | **The only file you edit.** Every role, every question, every point value. |
| `careers/build-careers.mjs` | Generates `careers.html` and the six role pages. |
| `careers/build-answer-key.mjs` | Generates the answer key the server scores against. |
| `careers/test-scoring.mjs` | Checks the scoring and that no points leak into the page. |
| `careers.html` | Generated. The index of open roles. |
| `careers/<slug>.html` | Generated. One page per role, with the application on it. |
| `careers.css`, `careers.js` | Styling and the form. Hand written. |
| `supabase/schema.sql` | Run once in Supabase. |
| `supabase/functions/score-application/` | The edge function that scores and stores. |

Generated files are committed, so the site stays a plain static site with no build step at deploy time.

### After any edit to a role

```bash
node careers/build-answer-key.mjs   # if you changed points
node careers/build-careers.mjs      # always
node careers/test-scoring.mjs       # always
supabase functions deploy score-application   # if points changed
```

---

## 2. Why scoring runs on the server

If the scoring lived in `careers.js`, any candidate could open the page source and read the answer key.

So the browser receives the questions and the options, and nothing else. It posts the raw answers to the `score-application` edge function, which holds the points, works out the score and writes the row. `careers/test-scoring.mjs` fails the build if points ever appear in a generated page.

---

## 3. Supabase setup

Project `kvifzyskdmqtmteipvye`.

### a. Create the table

Paste `supabase/schema.sql` into the Supabase SQL editor and run it.

It creates `applications`, turns on row level security with **no policies for anon**, so nothing can be read or written from a browser, and adds an `application_shortlist` view for reviewing.

### b. Deploy the function

```bash
supabase link --project-ref kvifzyskdmqtmteipvye
supabase functions deploy score-application --no-verify-jwt
supabase secrets set ALLOWED_ORIGIN=https://your-domain.com
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically. The service role key must never appear in any file in this repo.

### c. Give the site the anon key

The anon key is public by design, but it is not in this repo. Add it in the page, before `careers.js` loads:

```html
<script>window.PM_SUPABASE_ANON_KEY = 'eyJhbGci...';</script>
```

Add that line to the `head()` template in `careers/build-careers.mjs`, then rebuild.

**Until you do this, the form still works**: it falls back to opening the candidate's email app with all their answers filled in, addressed to `careers@purplemagicstudio.com`. It also falls back if Supabase is unreachable, so an application is never lost.

---

## 4. Reading applications

In the Supabase SQL editor:

```sql
-- strongest first, knocked out candidates already excluded
select * from application_shortlist where role_title = 'Content Creator';
```

Columns worth knowing:

- **`auto_score`** 0 to 100. Structured answers only.
- **`knockout`** `true` means they said no to a hard requirement, such as not owning a laptop for the editor role. They are hidden from the shortlist view.
- **`flags`** behaviours worth a second look: `blackhat` (SEO link buying), `pushy` (calling from a different number to get picked up), `fidelity` (shipping an AI image with the wrong stone count).
- **`review_score`** empty until you fill it in. The written answers are deliberately **not** auto scored; a person reads them.
- **`status`** `new` → `shortlist` → `interview` → `trial` → `hired` or `rejected`.

A second application for the same role from the same email replaces the first.

---

## 5. Scoring, role by role

Every role is normalised to 0 to 100, so scores are comparable across roles.

| Role | Scored questions | Knockout question |
|---|---|---|
| Content Creator, The LAB | 7 | On camera, weekends and the Baseerbagh to Kokapet commute |
| Customer Relationship Executive | 8 | Weekends, standing, try on assistance |
| Graphic Designer, AI first | 6 | none |
| SEO Specialist | 6 | none |
| Video Editor | 7 | Does not own a capable laptop |
| Inside Sales, The LAB | 8 | Will not work to a daily target |

Tuning a role means changing the `p` values in `careers/jobs.mjs`, then rebuilding the answer key and redeploying the function.

---

## 6. Two decisions you should know about

**Pay is hidden on all six roles.** Each page says "Discussed at interview". The ₹30,000 figures for SEO and Video Editor are not on the site. Job ads that state pay usually attract better applicants, so this is worth revisiting.

**The gender preference is not in the ads.** You asked for the genuine requirement to be stated instead, so:

- *Content Creator* says: you appear on camera, and much of the collection is women's jewellery, so you should be comfortable modelling it yourself.
- *CRE* says: the job includes helping customers try pieces on and sitting with bridal customers and their families.

Both are real parts of those jobs and both are legitimate to state. Neither is a gender bar, and neither guarantees you only get women applying. In India, naming a gender in a job ad runs into the Equal Remuneration Act, and Naukri, LinkedIn and Indeed all remove such postings. I am not a lawyer; if you want to go further than this, take proper advice first.

---

## 7. Still to do

- [ ] Run `schema.sql` in Supabase
- [ ] Deploy `score-application` and set `ALLOWED_ORIGIN`
- [ ] Add the anon key to the page template and rebuild
- [ ] Confirm the office address for the SEO role (currently "Baseerbagh, Hyderabad")
- [ ] Confirm the Inside Sales location (currently just "Hyderabad")
- [ ] Set up `careers@purplemagicstudio.com`, or change it in `careers/jobs.mjs` and `careers.js`
- [ ] Decide whether to show pay
- [ ] Add `og-image.png` so shared links show a card
- [ ] Point Google at the pages: they carry `JobPosting` structured data, so they can appear in Google Jobs once the site is live on its real domain
