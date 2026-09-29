/* Purple Magic careers: one source of truth for every open role.
   build-careers.mjs turns this into careers.html and one page per role.
   careers-form.js reads the same data to build the application.

   SCORING: every option carries `p` (points). The browser never adds them up.
   The Supabase edge function re-reads this file's scoring table server side,
   so a candidate cannot read the answer key out of the page source.
   Keep answer points here and in supabase/functions/score-application in step. */

export const meta = {
  brandLine: 'Purple Magic hires for our own studio and for the jewellery houses we work with.',
  city: 'Hyderabad',
  replyPromise: 'Every application is read. You hear back within five working days, yes or no.',
  contactEmail: 'careers@purplemagicstudio.com',
  whatsapp: '917013749462'
};

/* Questions every applicant answers. Scored out of 30. */
export const commonQuestions = [
  {
    id: 'start',
    type: 'choice',
    label: 'When could you start?',
    options: [
      { v: 'now', label: 'Right away', p: 10 },
      { v: '2w', label: 'Within 2 weeks', p: 9 },
      { v: '1m', label: 'In about a month', p: 7 },
      { v: '2m', label: 'Two months or more', p: 3 }
    ]
  },
  {
    id: 'exp',
    type: 'choice',
    label: 'How long have you done work like this?',
    help: 'Be honest. We hire freshers for some of these roles.',
    options: [
      { v: '0', label: 'I am starting out', p: 4 },
      { v: '1', label: 'Under a year', p: 6 },
      { v: '1-3', label: '1 to 3 years', p: 10 },
      { v: '3-5', label: '3 to 5 years', p: 10 },
      { v: '5+', label: 'More than 5 years', p: 9 }
    ]
  },
  {
    id: 'why',
    type: 'text',
    label: 'Why this role, and why now?',
    help: 'Two or three lines is plenty. Written by you, not by AI.',
    max: 400,
    review: true
  }
];

export const jobs = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'content-creator-the-lab',
    title: 'Content Creator',
    brand: 'Lab grown diamond brand',
    team: 'Client of Purple Magic',
    type: 'Full time',
    workplace: 'On site',
    location: 'Baseerbagh office and Kokapet store, Hyderabad',
    openings: 1,
    blurb: 'Make the daily content for a brand new lab grown diamond brand. You shoot it, you are in it, you cut it.',
    about: [
      'A new lab grown diamond brand from a long established Hyderabad jewellery house. The Kokapet store has just opened, which means almost nothing has been made yet. You would be the person making it.',
      'You work out of the Purple Magic office near Baseerbagh and shoot at the Kokapet store. Both, most weeks.'
    ],
    doing: [
      'Shoot and cut four to six Reels a week, mostly on a phone',
      'Appear on camera yourself, wearing and showing the pieces',
      'Write your own hooks and scripts, then rewrite them when they do not land',
      'Shoot product, store moments, customer reactions and behind the scenes',
      'Explain lab grown diamonds to people who have never heard of them, without sounding like a brochure',
      'Work alongside the store team while they are selling, without getting in the way'
    ],
    reality: [
      'This is a making job, not a planning job. Most days end with footage shot and cut.',
      'You will be on camera. Much of the collection is women’s jewellery, so you should be comfortable modelling it yourself.',
      'Jewellery is genuinely hard to shoot. Reflections, sparkle and true gold colour take real patience.',
      'The category is new to most buyers. A lot of your content has to answer "is it a real diamond" without getting defensive.',
      'Weekends and festival dates are the busiest times in a jewellery store. Some of them are working days.',
      'You travel between Baseerbagh and Kokapet. Have a plan for that commute before you apply.'
    ],
    need: [
      'You already make short video, even if it is only your own account',
      'Comfortable on camera and on a shop floor with strangers',
      'CapCut, Premiere or equivalent, and a phone that shoots clean video',
      'You can write a hook that makes someone stop scrolling',
      'Grit. Some shoots fail and get reshot the same day.'
    ],
    bonus: [
      'You have shot jewellery, watches or anything else shiny',
      'Lightroom or basic colour work',
      'You use AI image or video tools already',
      'Telugu or Hindi on camera as well as English'
    ],
    questions: [
      {
        id: 'q1', type: 'choice', weight: 1,
        label: 'A customer comments "this is not a real diamond". What is the best reply on the brand’s account?',
        options: [
          { v: 'a', label: 'Delete the comment and move on', p: 0 },
          { v: 'b', label: 'Argue that lab grown is chemically identical and they are wrong', p: 4 },
          { v: 'c', label: 'Reply plainly that it is a real diamond grown in a lab, same material, and invite them to see it in store', p: 12 },
          { v: 'd', label: 'Ignore it, comments do not matter', p: 1 }
        ]
      },
      {
        id: 'q2', type: 'choice', weight: 1,
        label: 'Your Reel gets high views but very few saves or sends. What do you change first?',
        options: [
          { v: 'a', label: 'Post more often', p: 3 },
          { v: 'b', label: 'Give the viewer something worth keeping or showing someone, not just something pretty', p: 12 },
          { v: 'c', label: 'Add trending audio', p: 5 },
          { v: 'd', label: 'Use more hashtags', p: 1 }
        ]
      },
      {
        id: 'q3', type: 'choice', weight: 1,
        label: 'You are shooting a diamond ring and it keeps looking dull and grey on camera. First thing you try?',
        options: [
          { v: 'a', label: 'Raise exposure in the edit', p: 3 },
          { v: 'b', label: 'Change the light. Small hard source, control what the stone reflects, and move the ring, not the camera', p: 12 },
          { v: 'c', label: 'Add a sparkle filter', p: 1 },
          { v: 'd', label: 'Shoot it outdoors in the sun', p: 5 }
        ]
      },
      {
        id: 'q4', type: 'multi', weight: 1, maxPick: 3,
        label: 'Pick up to three things you can already do well today.',
        options: [
          { v: 'shoot', label: 'Shoot video on a phone', p: 4 },
          { v: 'oncam', label: 'Present on camera', p: 4 },
          { v: 'edit', label: 'Edit Reels start to finish', p: 4 },
          { v: 'write', label: 'Write hooks and captions', p: 4 },
          { v: 'photo', label: 'Product photography', p: 3 },
          { v: 'ai', label: 'AI image or video tools', p: 3 }
        ]
      },
      {
        id: 'q5', type: 'text', weight: 1, max: 280, review: true,
        label: 'Write a hook for a Reel about a lab grown diamond engagement ring.',
        help: 'Just the first line a viewer would hear or read. One sentence.'
      },
      {
        id: 'q6', type: 'text', weight: 1, max: 400, review: true,
        label: 'Tell us about something you made that did not work, and what you did next.',
        help: 'Any medium. We care about the "what you did next" part.'
      },
      {
        id: 'ig', type: 'text', weight: 1, max: 60, review: true, handle: true,
        label: 'Your Instagram handle.',
        help: 'Just the handle, like yourname. Not a link. This is how we find you if a link stops working.'
      },
      {
        id: 'work', type: 'text', weight: 1, max: 600, review: true, link: true,
        label: 'Links to content you have made.',
        help: 'As many as you like, one per line. A profile, a Reel, a YouTube video, anything you shot or cut yourself. Handles such as @yourname work too. Your own account is fine.'
      },
      {
        id: 'q7', type: 'choice', weight: 1, ack: true,
        label: 'This role needs you on camera, in store on some weekends, and travelling between Baseerbagh and Kokapet. Does that work for you?',
        options: [
          { v: 'yes', label: 'Yes, all three are fine', p: 10 },
          { v: 'most', label: 'Two of the three are fine, I would want to discuss one', p: 5 },
          { v: 'no', label: 'No, that does not suit me', p: 0, knockout: true }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'customer-relationship-executive',
    title: 'Customer Relationship Executive',
    brand: 'Jewellery showroom, Kokapet',
    team: 'Client of Purple Magic',
    type: 'Full time',
    workplace: 'On site',
    location: 'Kokapet store, Hyderabad',
    openings: 2,
    blurb: 'Look after customers on the shop floor from the moment they walk in to the moment they buy, and after.',
    about: [
      'A jewellery house that has been selling in Hyderabad for generations. The Kokapet store is its newest address, and the floor team there is being built now.',
      'This is not a cashier job. You own the customer’s whole visit.'
    ],
    doing: [
      'Greet people properly and work out what they actually came in for',
      'Help customers try pieces on, including bangles, necklaces and earrings',
      'Sit with bridal customers and their families through long, careful decisions',
      'Explain making charges, gold rate, hallmarking, exchange and buyback clearly',
      'Log every customer in the CRM and follow up when you said you would',
      'Book appointments and bring back people who visited once and left'
    ],
    reality: [
      'Helping customers try pieces on is a real part of the job, every day. Bridal appointments are often in a private room with the family.',
      'You are on your feet for most of a shift.',
      'Weekends, festivals and the wedding season are the busiest days of the year. That is when you work hardest.',
      'One customer can take two hours and buy nothing, then come back next month and buy a lot. Patience pays here.',
      'Every conversation involves large sums and somebody’s trust. Getting a detail wrong matters.',
      'You need Telugu, Hindi and English. Customers switch between them mid sentence.'
    ],
    need: [
      'Fluent Telugu, Hindi and English',
      'Comfortable talking to strangers about money without flinching',
      'Neat, patient and genuinely warm with people',
      'Willing to learn gold purity, diamond basics and our stock properly',
      'Available on weekends and through festival season'
    ],
    bonus: [
      'You have sold jewellery, watches, cars, real estate or anything else with a long decision',
      'You have used a CRM',
      'You already know the West Hyderabad customer'
    ],
    questions: [
      {
        id: 'q1', type: 'multi', weight: 1, maxPick: 3, required: true,
        label: 'Which languages can you handle a full sales conversation in?',
        help: 'Not just understand. Sell in.',
        options: [
          { v: 'te', label: 'Telugu', p: 8 },
          { v: 'hi', label: 'Hindi', p: 8 },
          { v: 'en', label: 'English', p: 8 },
          { v: 'ur', label: 'Urdu', p: 2 }
        ]
      },
      {
        id: 'q2', type: 'choice', weight: 1,
        label: 'A customer spends an hour trying pieces on, then says "I will think about it." What do you do?',
        options: [
          { v: 'a', label: 'Offer a discount on the spot to close it', p: 2 },
          { v: 'b', label: 'Thank them and let them go', p: 3 },
          { v: 'c', label: 'Note what they liked, take their number, agree when you will follow up, and send photos after', p: 12 },
          { v: 'd', label: 'Tell them the gold rate is going up tomorrow', p: 0 }
        ]
      },
      {
        id: 'q3', type: 'choice', weight: 1,
        label: 'A bride’s mother wants a heavy traditional set. The bride wants something lighter. What is your move?',
        options: [
          { v: 'a', label: 'Side with whoever is paying', p: 3 },
          { v: 'b', label: 'Bring out pieces that could satisfy both, and let them decide together without taking a side', p: 12 },
          { v: 'c', label: 'Tell the bride the mother knows best', p: 0 },
          { v: 'd', label: 'Suggest they come back once they agree', p: 2 }
        ]
      },
      {
        id: 'q4', type: 'choice', weight: 1,
        label: 'Someone asks why our price is higher than the shop down the road.',
        options: [
          { v: 'a', label: 'Say the other shop is cheating them', p: 0 },
          { v: 'b', label: 'Walk them through making charges, purity and hallmarking so they can compare properly', p: 12 },
          { v: 'c', label: 'Immediately offer to match the price', p: 3 },
          { v: 'd', label: 'Change the subject to a different piece', p: 2 }
        ]
      },
      {
        id: 'q5', type: 'text', weight: 1, max: 400, review: true,
        label: 'Tell us about a difficult customer you handled and how it ended.',
        help: 'Any job counts. If you have not worked before, tell us about a time you calmed someone down.'
      },
      {
        id: 'q6', type: 'choice', weight: 1, ack: true,
        label: 'The job means weekends, festival days, standing for long stretches, and helping customers try pieces on. Does that work for you?',
        options: [
          { v: 'yes', label: 'Yes, all of it', p: 10 },
          { v: 'most', label: 'Mostly, I would want to discuss one part', p: 5 },
          { v: 'no', label: 'No', p: 0, knockout: true }
        ]
      },
      {
        id: 'q7', type: 'choice', weight: 1,
        label: 'How far is Kokapet from where you live?',
        options: [
          { v: 'near', label: 'I am nearby, under 30 minutes', p: 10 },
          { v: 'mid', label: '30 to 60 minutes', p: 6 },
          { v: 'far', label: 'Over an hour', p: 2 },
          { v: 'move', label: 'I would relocate closer for this job', p: 7 }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'graphic-designer-ai',
    title: 'Graphic Designer, AI first',
    brand: 'Jewellery house, Baseerbagh',
    team: 'Client of Purple Magic',
    type: 'Full time',
    workplace: 'On site',
    location: 'Baseerbagh, Hyderabad',
    openings: 1,
    blurb: 'Design for a heritage jewellery house, with AI doing the heavy lifting and you holding the taste.',
    about: [
      'The client runs several brands, from heritage gold to lab grown diamonds. They all need artwork, constantly.',
      'We already use AI image tools every day in this studio. We need a designer who can drive them properly, not someone who is scared of them or someone who trusts them blindly.'
    ],
    doing: [
      'Campaign artwork, social posts, offer creatives, in store signage and print',
      'Product retouching where the piece must stay exactly as it really is',
      'Use AI image tools to build scenes, models and backgrounds around real product',
      'Keep gold tones, stone counts and settings accurate when AI tries to invent them',
      'Adapt one campaign into every size it is needed in, quickly',
      'Keep each brand looking like itself and not like the others'
    ],
    reality: [
      'AI gets jewellery wrong constantly. Wrong number of stones, invented prongs, gold that has gone brassy. Catching that is a real part of the job.',
      'The product must stay true. We regenerate scenes, never the piece itself, and never the logo.',
      'Turnaround is fast. Offer creatives sometimes need to be out the same day.',
      'You will do unglamorous resizing work as well as the fun concepts.',
      'Taste is the part AI cannot do. That is what we are hiring for.'
    ],
    need: [
      'Strong Photoshop and Illustrator',
      'You already use AI image tools in real work, not just for fun',
      'A good eye for type, spacing and colour',
      'You can spot when an AI image is subtly wrong',
      'Print ready artwork does not scare you'
    ],
    bonus: [
      'Jewellery, beauty or luxury retail experience',
      'After Effects or basic motion',
      'ComfyUI, Magnific, Nano Banana, Firefly or similar in your daily kit',
      'Telugu or Hindi'
    ],
    questions: [
      {
        id: 'q1', type: 'multi', weight: 1, maxPick: 4,
        label: 'Which of these do you actually use in your work today?',
        options: [
          { v: 'ps', label: 'Photoshop', p: 4 },
          { v: 'ai', label: 'Illustrator', p: 3 },
          { v: 'gen', label: 'AI image generation', p: 5 },
          { v: 'up', label: 'AI upscaling or retouch tools', p: 4 },
          { v: 'fig', label: 'Figma', p: 2 },
          { v: 'ae', label: 'After Effects', p: 3 }
        ]
      },
      {
        id: 'q2', type: 'choice', weight: 1,
        label: 'An AI generated image of a necklace looks beautiful but has one stone too many. What do you do?',
        options: [
          { v: 'a', label: 'Ship it, nobody counts stones', p: 0, flag: 'fidelity' },
          { v: 'b', label: 'Composite the real product photo back in, and keep only the generated background', p: 12 },
          { v: 'c', label: 'Regenerate until it happens to come out right', p: 5 },
          { v: 'd', label: 'Ask the client if it matters', p: 3 }
        ]
      },
      {
        id: 'q3', type: 'choice', weight: 1,
        label: 'Which job should not go to an AI image tool at all?',
        options: [
          { v: 'a', label: 'A lifestyle background for a campaign', p: 2 },
          { v: 'b', label: 'The brand logo on an offer creative', p: 12 },
          { v: 'c', label: 'A mood board', p: 3 },
          { v: 'd', label: 'A social post backdrop', p: 2 }
        ]
      },
      {
        id: 'q4', type: 'choice', weight: 1,
        label: 'Gold in your render is coming out brassy and orange next to the real product shot. First fix?',
        options: [
          { v: 'a', label: 'Lower the saturation on the whole image', p: 4 },
          { v: 'b', label: 'Match it to the real product: sample the true gold, correct hue and highlights selectively, check against the physical piece', p: 12 },
          { v: 'c', label: 'Add a warm filter over everything', p: 1 },
          { v: 'd', label: 'Leave it, screens vary', p: 0 }
        ]
      },
      {
        id: 'q5', type: 'text', weight: 1, max: 400, review: true,
        label: 'Write the prompt you would use to place a real gold necklace into a premium campaign scene.',
        help: 'Write it as you would actually type it into your tool.'
      },
      {
        id: 'q6', type: 'text', weight: 1, max: 400, review: true,
        label: 'Describe one piece of work you are proud of and what you personally decided in it.',
        help: 'We want the decisions, not the brief.'
      },
      {
        id: 'ig', type: 'text', weight: 1, max: 60, review: true, handle: true,
        label: 'Your Instagram handle.',
        help: 'Just the handle, like yourname. Not a link. This is how we find you if a link stops working.'
      },
      {
        id: 'work', type: 'text', weight: 1, max: 600, review: true, link: true,
        label: 'Links to your portfolio or recent work.',
        help: 'As many as you like, one per line. Behance, Dribbble, Instagram, a Drive folder, or a handle such as @yourname. Check the sharing is open so we can see it.'
      }
    ]
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'seo-specialist',
    title: 'SEO Specialist, AI search',
    brand: 'Purple Magic',
    team: 'Marketing',
    type: 'Full time',
    workplace: 'On site',
    location: 'Baseerbagh, Hyderabad',
    openings: 1,
    blurb: 'Get our brands found on Google and inside ChatGPT, Gemini and Perplexity answers.',
    about: [
      'Buyers now ask an AI assistant what to buy before they ever open Google. Most brands have no idea what those assistants say about them.',
      'This role owns both sides: classic search that still sends traffic, and AI answers that increasingly decide the shortlist.'
    ],
    doing: [
      'Own SEO for Purple Magic and our client brands',
      'Track how ChatGPT, Gemini, Perplexity and AI Overviews describe and cite our brands',
      'Build the entity, schema and content work that earns those citations',
      'Earn third party mentions, because most AI citations come from other sites, not your own',
      'Technical SEO: site health, speed, structured data, internal linking',
      'Report what actually moved, in plain language'
    ],
    reality: [
      'This is a young field full of people repeating things they read. We will test whether you actually do it.',
      'Results are slow. You need the patience to keep going for months before a curve turns.',
      'Some of it is unglamorous. Schema, redirects, site audits.',
      'We do not buy links or stuff keywords. If that is your playbook, this is not your job.',
      'You will have to explain your work to people who do not know what a canonical tag is.'
    ],
    need: [
      'Real SEO experience you can talk through in detail',
      'You understand schema and structured data properly',
      'You have already experimented with AEO or GEO, even informally',
      'Comfortable with Search Console, and with one of Semrush or Ahrefs',
      'You write clearly'
    ],
    bonus: [
      'Ecommerce or retail SEO',
      'You have used an AI visibility tracker',
      'Basic HTML, or you can brief a developer precisely',
      'Local SEO for multi store brands'
    ],
    questions: [
      {
        id: 'q1', type: 'choice', weight: 1,
        label: 'Where do most citations in AI answers come from?',
        options: [
          { v: 'a', label: 'The brand’s own website', p: 3 },
          { v: 'b', label: 'Earned mentions on third party sites', p: 12 },
          { v: 'c', label: 'Paid placements', p: 0 },
          { v: 'd', label: 'Social media posts', p: 2 }
        ]
      },
      {
        id: 'q2', type: 'choice', weight: 1,
        label: 'A client asks how their AI search visibility is doing. What do you actually measure?',
        options: [
          { v: 'a', label: 'Keyword rankings, same as always', p: 2 },
          { v: 'b', label: 'How often and how accurately they are mentioned and cited across a fixed set of buyer questions, tracked over time', p: 12 },
          { v: 'c', label: 'Total website traffic', p: 3 },
          { v: 'd', label: 'Domain authority', p: 1 }
        ]
      },
      {
        id: 'q3', type: 'choice', weight: 1,
        label: 'Which does the most to help an AI assistant describe a brand correctly?',
        options: [
          { v: 'a', label: 'Publishing more blog posts each week', p: 3 },
          { v: 'b', label: 'Clear entity information, consistent facts across the web and structured data', p: 12 },
          { v: 'c', label: 'Adding keywords to page titles', p: 2 },
          { v: 'd', label: 'Buying backlinks', p: 0, flag: 'blackhat' }
        ]
      },
      {
        id: 'q4', type: 'multi', weight: 1, maxPick: 4,
        label: 'Which have you personally used?',
        options: [
          { v: 'gsc', label: 'Google Search Console', p: 4 },
          { v: 'sem', label: 'Semrush or Ahrefs', p: 4 },
          { v: 'schema', label: 'Written schema markup by hand', p: 5 },
          { v: 'geo', label: 'An AI visibility or citation tracker', p: 5 },
          { v: 'ga', label: 'GA4', p: 2 },
          { v: 'screaming', label: 'Screaming Frog or similar crawler', p: 3 }
        ]
      },
      {
        id: 'q5', type: 'text', weight: 1, max: 450, review: true,
        label: 'Pick one brand you have worked on. What did you change, and what happened?',
        help: 'Numbers welcome. Be specific about what you did yourself.'
      },
      {
        id: 'q6', type: 'text', weight: 1, max: 400, review: true,
        label: 'A jewellery brand wants to be the answer when someone asks an AI "best lab grown diamond jeweller in Hyderabad". What are your first three moves?',
        help: 'Short and concrete.'
      },
      {
        id: 'work', type: 'text', weight: 1, max: 600, review: true, link: true,
        label: 'Links to sites you have worked on.',
        help: 'As many as you like, one per line. The sites themselves, or a case study or post you wrote. Add a few words on what part was yours.'
      }
    ]
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'video-editor',
    title: 'Video Editor',
    brand: 'Purple Magic',
    team: 'Founder content',
    type: 'Full time',
    workplace: 'On site',
    location: 'Baseerbagh, Hyderabad',
    openings: 1,
    blurb: 'Personal editor for Mandeep’s channel. Two Reels and one long form video, every week.',
    about: [
      'Mandeep teaches AI tools and workflows to business owners, on camera. The channel is the front door to everything Purple Magic does.',
      'This is a dedicated seat in the Baseerbagh studio. One editor, one channel, a steady weekly rhythm. We provide the machine.'
    ],
    doing: [
      'Cut two Reels and one long form video every week',
      'Build the first three seconds so people stay',
      'Retention editing: cut the dead air, keep the pace honest',
      'Captions, b roll, sound design and clean motion graphics in After Effects',
      'Pull the best moments out of long form and turn them into shorts',
      'Keep project files tidy and hand them over when asked'
    ],
    reality: [
      'The weekly rhythm does not pause. Two Reels and one long form, every week, is the job.',
      'This is an in studio role at Baseerbagh, not remote. You sit with the founder and cut.',
      'Shoot days and edit days run into each other. Some weeks are lumpy.',
      'Feedback can be blunt and fast. Revisions are part of the work, not an insult.',
      'You will be judged on retention and sends, not on how clever the effects were.'
    ],
    need: [
      'Premiere or Final Cut, and real After Effects ability',
      'You understand what makes a Reel keep people watching',
      'You can work in the Baseerbagh studio every day',
      'You hit deadlines without being chased'
    ],
    bonus: [
      'You have edited for a founder or personal brand before',
      'Thumbnail and packaging sense',
      'You use AI tools in your edit workflow',
      'You can shoot as well as cut'
    ],
    questions: [
      {
        id: 'q1', type: 'choice', weight: 1,
        label: 'Which signal matters most for a Reel getting pushed to new viewers?',
        options: [
          { v: 'a', label: 'Likes', p: 2 },
          { v: 'b', label: 'Watch time, replays and sends', p: 12 },
          { v: 'c', label: 'Hashtag count', p: 0 },
          { v: 'd', label: 'Posting at exactly the right hour', p: 3 }
        ]
      },
      {
        id: 'q2', type: 'choice', weight: 1,
        label: 'A long form video loses most viewers in the first 30 seconds. What do you fix first?',
        options: [
          { v: 'a', label: 'Add more effects throughout', p: 2 },
          { v: 'b', label: 'Cut the intro, open on the most interesting moment and make the promise clear immediately', p: 12 },
          { v: 'c', label: 'Change the background music', p: 3 },
          { v: 'd', label: 'Make the video shorter overall', p: 5 }
        ]
      },
      {
        id: 'q3', type: 'choice', weight: 1,
        label: 'The founder sends you raw footage on Friday for a Monday post, and it has a bad audio patch. What do you do?',
        options: [
          { v: 'a', label: 'Deliver it as is and mention the audio', p: 3 },
          { v: 'b', label: 'Fix what can be fixed, flag it immediately with options, and propose a reshoot of just that line if needed', p: 12 },
          { v: 'c', label: 'Wait until Monday to raise it', p: 0 },
          { v: 'd', label: 'Cover the bad patch with loud music', p: 4 }
        ]
      },
      {
        id: 'q4', type: 'multi', weight: 1, maxPick: 4,
        label: 'What can you do without help?',
        options: [
          { v: 'ae', label: 'After Effects motion graphics', p: 6 },
          { v: 'ret', label: 'Retention focused cutting', p: 5 },
          { v: 'cap', label: 'Styled captions', p: 3 },
          { v: 'snd', label: 'Sound design and mixing', p: 4 },
          { v: 'thumb', label: 'Thumbnails', p: 3 },
          { v: 'ai', label: 'AI tools in the workflow', p: 3 }
        ]
      },
      {
        id: 'q5', type: 'choice', weight: 1, required: true, ack: true,
        label: 'This is full time in our Baseerbagh studio, five days a week, with two Reels and one long form due every week. Does that work?',
        help: 'We provide the machine and the software.',
        options: [
          { v: 'yes', label: 'Yes, in studio and that weekly output are both fine', p: 10 },
          { v: 'maybe', label: 'The output is fine, I would want to discuss the days in studio', p: 4 },
          { v: 'no', label: 'No, I am looking for remote or freelance work', p: 0, knockout: true }
        ]
      },
      {
        id: 'q6', type: 'text', weight: 1, max: 280, review: true,
        label: 'Rewrite this opening line so people stay: "Hi guys, welcome back to the channel, today we are going to talk about AI tools."',
        help: 'One line.'
      },
      {
        id: 'ig', type: 'text', weight: 1, max: 60, review: true, handle: true,
        label: 'Your Instagram handle.',
        help: 'Just the handle, like yourname. Not a link. This is how we find you if a link stops working.'
      },
      {
        id: 'work', type: 'text', weight: 1, max: 600, review: true, link: true,
        label: 'Links to things you have edited.',
        help: 'As many as you like, one per line. Instagram, YouTube, a Drive folder, or a channel handle such as @yourname. Anything you cut yourself.'
      }
    ]
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'inside-sales-the-lab',
    title: 'Inside Sales Executive',
    brand: 'Lab grown diamond brand',
    team: 'Client of Purple Magic',
    type: 'Full time',
    workplace: 'On site',
    location: 'Hyderabad',
    openings: 3,
    blurb: 'Turn Instagram and Facebook enquiries into people who actually walk into the store.',
    about: [
      'We run the ads for this brand. They produce enquiries every day. Right now too many of those enquiries go cold before anyone reaches them.',
      'This team fixes that. You call fast, you qualify honestly, you book the visit and you make sure they turn up.'
    ],
    doing: [
      'Call new enquiries quickly, while they still remember filling the form',
      'Follow up on WhatsApp when calls do not connect, and keep trying properly',
      'Find out what the person actually wants and whether they are serious, without interrogating them',
      'Book a store appointment with a date and a time, not a vague "sometime"',
      'Remind and confirm so appointments actually become walk ins',
      'Log every call and outcome so we know which ads are worth the money'
    ],
    reality: [
      'Most people do not pick up the first time. The job is in the second, third and fourth attempt.',
      'You will be told no, a lot. It has to not stick to you.',
      'There is a daily call target and it is visible to everyone.',
      'Speed matters more than polish. A fast decent call beats a perfect one an hour later.',
      'Every number is a real person who asked about jewellery. Pushy calling damages the brand and we will not allow it.'
    ],
    need: [
      'Clear Telugu, Hindi and English on the phone',
      'You can hold a conversation with a stranger without a script crutch',
      'Organised enough to follow up on time, every time',
      'You keep going after a run of rejections',
      'Comfortable with a daily target'
    ],
    bonus: [
      'Telecalling, inside sales or retail sales experience',
      'You have used a CRM or lead sheet',
      'You know jewellery or another high ticket category'
    ],
    questions: [
      {
        id: 'q1', type: 'multi', weight: 1, maxPick: 3, required: true,
        label: 'Which languages can you comfortably call in?',
        options: [
          { v: 'te', label: 'Telugu', p: 8 },
          { v: 'hi', label: 'Hindi', p: 8 },
          { v: 'en', label: 'English', p: 6 },
          { v: 'ur', label: 'Urdu', p: 2 }
        ]
      },
      {
        id: 'q2', type: 'choice', weight: 1,
        label: 'An enquiry comes in at 3pm. When should the first call go out?',
        options: [
          { v: 'a', label: 'Within minutes', p: 12 },
          { v: 'b', label: 'Same evening', p: 6 },
          { v: 'c', label: 'Next morning', p: 2 },
          { v: 'd', label: 'Whenever the list is worked through', p: 0 }
        ]
      },
      {
        id: 'q3', type: 'choice', weight: 1,
        label: 'They pick up and say "I was just browsing." What do you say?',
        options: [
          { v: 'a', label: 'Sorry to disturb you, and hang up', p: 2 },
          { v: 'b', label: 'Ask one easy question about what caught their eye, then offer a specific time to come and see it', p: 12 },
          { v: 'c', label: 'Tell them about every offer running right now', p: 3 },
          { v: 'd', label: 'Ask straight away what their budget is', p: 1 }
        ]
      },
      {
        id: 'q4', type: 'choice', weight: 1,
        label: 'Someone books an appointment for Saturday. What makes them actually turn up?',
        options: [
          { v: 'a', label: 'Nothing, it is out of your hands', p: 0 },
          { v: 'b', label: 'A confirmation message with the time and address, then a short reminder before the slot', p: 12 },
          { v: 'c', label: 'Calling them repeatedly until they come', p: 2 },
          { v: 'd', label: 'Offering an extra discount', p: 4 }
        ]
      },
      {
        id: 'q5', type: 'choice', weight: 1,
        label: 'You have called a number four times over a week with no answer. Next?',
        options: [
          { v: 'a', label: 'Keep calling daily', p: 3 },
          { v: 'b', label: 'Send one clear WhatsApp with a reason to reply, then mark it for a later attempt', p: 12 },
          { v: 'c', label: 'Mark it dead and move on', p: 4 },
          { v: 'd', label: 'Call from a different number so they pick up', p: 0, flag: 'pushy' }
        ]
      },
      {
        id: 'q6', type: 'text', weight: 1, max: 350, review: true,
        label: 'Write your opening line for a first call to someone who filled a form about diamond rings.',
        help: 'Exactly what you would say. Any language you would use on the call.'
      },
      {
        id: 'q7', type: 'choice', weight: 1, ack: true,
        label: 'The role has a daily call target and a lot of rejection. How do you feel about that?',
        options: [
          { v: 'yes', label: 'Fine, I work better with a clear number', p: 10 },
          { v: 'ok', label: 'I can handle it', p: 6 },
          { v: 'no', label: 'I would rather not work to a target', p: 0, knockout: true }
        ]
      }
    ]
  }
];

export const bySlug = Object.fromEntries(jobs.map((j) => [j.slug, j]));
