# Hiring ads brief

Hand this whole folder to Claude and say: **"Read BRIEF.md and make the ads."**

Six roles are open. Each needs static ads for Instagram and Facebook. Nothing here is a mockup: whatever comes out of this goes straight into Ads Manager, so it has to be final quality.

---

## 1. Before you start

**Check the brand folder.** `brand/` holds the logos. If a role's brand folder is empty, stop and say which file is missing rather than drawing a logo yourself. A wrong logo is worse than no ad.

| Folder | What belongs in it |
|---|---|
| `brand/purple-magic/` | Purple Magic mark and wordmark |
| `brand/mangatrai/` | Mangatrai Jewels logo, light and dark versions |
| `brand/the-lab/` | The LAB by Mangatrai logo |
| `reference/` | Screenshots of past ads, store photos, anything to match |
| `output/` | Where the finished ads go |

**Never redraw, recolour or regenerate a logo.** Place the supplied file. If it needs to sit on a dark background and you only have a dark logo, say so.

---

## 2. What to make

For **each of the six roles**, three sizes:

| Size | Pixels | Where it runs |
|---|---|---|
| Feed, portrait | 1080 × 1350 | Instagram and Facebook feed. **Make this one first** — it takes the most screen. |
| Feed, square | 1080 × 1080 | Feed fallback, and a safe crop |
| Story | 1080 × 1920 | Stories and Reels |

Eighteen files in total. Name them `output/<role-slug>-<size>.png`, for example `output/video-editor-1080x1350.png`.

**Story safe area:** keep everything that matters inside the middle 1080 × 1420. The top and bottom 250px get covered by Instagram's own interface.

---

## 3. The rule that matters most

These are **hiring ads, not brand ads**. Someone scrolling has to know within one second:

1. That a job is going
2. What the job is
3. Where it is

If the job title is not readable at thumbnail size, the ad has failed. Big type, short words, heavy contrast. The prettiest layout that hides the job title is the worst ad in the set.

---

## 4. Brand looks

Three different brands. Do not blend them.

### The LAB by Mangatrai — lab grown diamonds
- Monochrome, with film grain, and **one** colour bloom as the single accent
- Type: Cormorant Garamond for display, Jost for everything else
- Palette: blueprint blue-grey, heirloom gold as the accent
- Feels: modern, quiet, technical. Not traditional jewellery.

### Mangatrai Jewels — the heritage house
- Warm and established. Gold, deep neutrals, generous space.
- This is a multi-generation Hyderabad name. Dignified, never shouty.

### Purple Magic — the studio
- Flat black backgrounds, purple `#7C3AED` as the accent
- Type: Geist
- Feels: sharp, technical, current

---

## 5. The copy

Use this exactly. It is written to match the careers pages. Do not rewrite it into ad-speak, do not add exclamation marks, do not use "Elevate", "Unleash", "Dream job" or "Join our family".

Every ad ends with the same call to action: **Apply in 5 minutes. No CV.**
That line is the strongest thing we have. Never drop it.

---

### 1. Content Creator — The LAB by Mangatrai
- **Headline:** You shoot it. You are in it. You cut it.
- **Alt headline:** We need someone to make a brand new diamond brand look alive
- **Sub:** Content Creator, The LAB by Mangatrai
- **Detail:** Baseerbagh and Kokapet, Hyderabad · Full time
- **CTA:** Apply in 5 minutes. No CV.

### 2. Customer Relationship Executive — Mangatrai Jewels
- **Headline:** Some people walk in for a wedding. You are who they remember.
- **Alt headline:** Two hours with one customer. That is the job.
- **Sub:** Customer Relationship Executive, Mangatrai Jewels
- **Detail:** Kokapet store, Hyderabad · Telugu, Hindi and English · 2 openings
- **CTA:** Apply in 5 minutes. No CV.

### 3. Graphic Designer, AI first — Mangatrai Jewels
- **Headline:** AI can make the picture. It cannot tell you if it is right.
- **Alt headline:** We need a designer who drives AI, not one who fears it
- **Sub:** Graphic Designer, Mangatrai Jewels
- **Detail:** Baseerbagh, Hyderabad · Full time
- **CTA:** Apply in 5 minutes. No CV.

### 4. SEO Specialist, AI search — Purple Magic
- **Headline:** People ask ChatGPT what to buy. Can you get us in the answer?
- **Alt headline:** SEO is not dead. It moved.
- **Sub:** SEO Specialist, AI search
- **Detail:** Baseerbagh, Hyderabad · Full time
- **CTA:** Apply in 5 minutes. No CV.

### 5. Video Editor — Purple Magic
- **Headline:** Two Reels and one long form. Every week.
- **Alt headline:** If you know why the first three seconds decide everything, read this
- **Sub:** Video Editor, work from home
- **Detail:** Remote, India · After Effects · Own laptop
- **CTA:** Apply in 5 minutes. No CV.

### 6. Inside Sales Executive — The LAB by Mangatrai
- **Headline:** The lead is already warm. Somebody has to call.
- **Alt headline:** Most people do not pick up the first time. That is the job.
- **Sub:** Inside Sales Executive, The LAB by Mangatrai
- **Detail:** Hyderabad · Telugu, Hindi and English · 3 openings
- **CTA:** Apply in 5 minutes. No CV.

---

## 6. Layout

A layout that works for all three sizes:

```
┌──────────────────────────┐
│  [brand logo]            │   small, top left
│                          │
│  HEADLINE                │   biggest thing on the ad
│  the hook, 2 to 3 lines  │
│                          │
│  Role name               │   clearly the job title
│  Location · Type         │   small, muted
│                          │
│  ──────────────────      │
│  Apply in 5 minutes.     │   pinned to the bottom
│  No CV.                  │
└──────────────────────────┘
```

**Rules**
- One idea per ad. No bullet lists of responsibilities.
- Headline at least 1/8 the height of the canvas.
- Leave a 64px margin all round on feed sizes, 96px on stories.
- No stock photos of people in suits shaking hands.
- No photos of jewellery unless you have a real product shot in `reference/`. Do not generate jewellery: AI gets stone counts and settings wrong and these are real products.
- Contrast: the headline must pass against its background. If you cannot read it squinting from arm's length, fix it.

**Make one version per ad, not four variations of the same idea.** If you want to offer options, use the alt headline for a genuinely different second version.

---

## 7. Ad copy for Ads Manager

Alongside each image, write the post text into `output/<role-slug>-adtext.txt`:

- **Primary text:** two or three lines. The honest bit about the role. Straight from the "What you are getting into" section on the role page.
- **Headline field:** the job title plus the location
- **Link:** the role page (below)
- **Button:** Apply Now

---

## 8. Links

| Role | Link |
|---|---|
| Content Creator | `https://www.purplemagic.tech/careers/content-creator-the-lab` |
| Customer Relationship Executive | `https://www.purplemagic.tech/careers/customer-relationship-executive` |
| Graphic Designer | `https://www.purplemagic.tech/careers/graphic-designer-ai` |
| SEO Specialist | `https://www.purplemagic.tech/careers/seo-specialist` |
| Video Editor | `https://www.purplemagic.tech/careers/video-editor` |
| Inside Sales | `https://www.purplemagic.tech/careers/inside-sales-the-lab` |
| All roles | `https://www.purplemagic.tech/careers` |

Add `?utm_source=meta&utm_campaign=hiring&utm_content=<role-slug>` to each link so we can tell which ad brought which applicant.

---

## 9. Things not to put on the ad

- **No salary.** Pay is discussed at interview, on every role.
- **No gender preference.** Not "female candidates preferred", not implied through imagery. It is discriminatory under the Equal Remuneration Act, and Meta removes such ads.
- **No age limit.** Same reason.
- **No promises** about growth, culture or "great team". Nobody believes them.
- **No client names** beyond the brands already named here.

---

## 10. Check before handing over

- [ ] Job title readable when the image is 200px wide
- [ ] Logo is the supplied file, untouched
- [ ] "Apply in 5 minutes. No CV." is on every single ad
- [ ] Story version keeps everything inside the middle 1080 × 1420
- [ ] Right brand look for the right brand
- [ ] No salary, no gender, no age
- [ ] Filenames follow `<role-slug>-<size>.png`
- [ ] Link and UTM correct per role

---

## Open questions for Mandeep

1. **Telugu and Hindi versions?** The CRE and Inside Sales roles need Telugu and Hindi speakers. An English-only ad will cut the applicant pool badly. Worth a Telugu version of at least those two.
2. **Any store photography** we can use, rather than type-only ads? Real photos of the Kokapet store would lift the CRE and Inside Sales ads a lot. Drop them in `reference/`.
3. **Who is running these** in Ads Manager, and what is the budget per role? That changes how many variations are worth making.
