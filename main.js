(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => revealIO.observe(el));

  /* ---------- Island nav ---------- */
  const burger = $('.burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('locked', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Mobile: the pill alternates between the logo and the Free review button.
  const navEl = $('.nav');
  const smallNav = matchMedia('(max-width: 767px)');
  let swapTimer = 0;
  const runSwap = () => {
    clearInterval(swapTimer);
    navEl.classList.remove('show-cta');
    if (!smallNav.matches) return;
    if (reduced) { navEl.classList.add('show-cta'); return; }   // no motion: keep the button, the menu still has the logo link
    swapTimer = setInterval(() => {
      if (document.hidden || menu.classList.contains('open')) return;
      navEl.classList.toggle('show-cta');
    }, 3200);
  };
  smallNav.addEventListener('change', runSwap);
  runSwap();

  const navLinks = $$('.nav-links a');
  const byId = Object.fromEntries(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const activeIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.removeAttribute('aria-current'));
      const link = byId[e.target.id];
      if (link) link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('main section[id]').forEach((s) => activeIO.observe(s));

  /* ---------- Hero: rotating copy (focus in, blur out) ---------- */
  const rot = $('#rot');
  if (rot) {
    const items = $$('.rot-item', rot);
    const dots = $$('.rot-dot');
    const pauseBtn = $('#rot-pause');
    const HOLD = 5200;
    let idx = 0, timer = 0, paused = reduced, inView = true;
    const show = (n) => {
      if (n === idx) return;
      const prev = items[idx];
      prev.classList.add('out');
      prev.classList.remove('on');
      prev.setAttribute('aria-hidden', 'true');
      setTimeout(() => prev.classList.remove('out'), 1200);
      idx = n;
      items[idx].classList.add('on');
      items[idx].removeAttribute('aria-hidden');
      dots.forEach((d, i) => (i === idx ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    };
    const schedule = () => {
      clearTimeout(timer);
      if (paused || !inView || document.hidden) return;
      timer = setTimeout(() => { show((idx + 1) % items.length); schedule(); }, HOLD);
    };
    const setPaused = (p) => {
      paused = p;
      pauseBtn.setAttribute('aria-pressed', String(p));
      pauseBtn.setAttribute('aria-label', p ? 'Play the changing text' : 'Pause the changing text');
      $('i', pauseBtn).className = p ? 'ph ph-play' : 'ph ph-pause';
      schedule();
    };
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); setPaused(true); }));
    pauseBtn.addEventListener('click', () => setPaused(!paused));
    new IntersectionObserver((e) => { inView = e[0].isIntersecting; schedule(); }).observe(rot);
    document.addEventListener('visibilitychange', schedule);
    setPaused(paused);
  }

  /* ---------- Demo: interactive agent run ---------- */
  const scenarios = {
    invoice: {
      name: 'Invoice helper',
      source: 'A new supplier bill arrived by email',
      interest: 'AI helpers',
      ask: 'We would like help with how we handle supplier bills.',
      steps: [
        { icon: 'ph-file-text', title: 'Read the bill', done: 'Saraswati Packaging, bill SP/2026/1184, ₹4,82,650', log: 'Bill read, all details picked up' },
        { icon: 'ph-arrows-left-right', title: 'Check it against your order', done: 'It matches your order. Delivery charge is ₹1,240 higher, which is within your limit.', log: 'Bill matches the order, 1 small difference' },
        { approval: true, icon: 'ph-user-check', title: 'Your approval',
          why: 'Bills above ₹2,00,000 always wait for a person. That rule is yours to set.',
          facts: [['Supplier', 'Saraswati Packaging'], ['Amount', '₹4,82,650'], ['Difference', '₹1,240 delivery']] },
        { icon: 'ph-bank', title: 'Enter it and schedule the payment', done: 'Entered in your accounts software. Payment set for the due date.', log: 'Bill entered, payment scheduled',
          backTitle: 'Hold it and ask the supplier', backDone: 'Bill on hold. A question to the supplier is drafted for you to check.', backLog: 'Bill held, question to supplier drafted' }
      ]
    },
    ticket: {
      name: 'Customer message helper',
      source: 'A customer sent a WhatsApp message',
      interest: 'AI helpers',
      ask: 'We would like help with replying to customer messages.',
      steps: [
        { icon: 'ph-chat-circle-text', title: 'Read the message', done: 'The customer wants a refund for order 18842', log: 'Message read, it is a refund request' },
        { icon: 'ph-clipboard-text', title: 'Check the order and your rules', done: 'Delivered 6 days ago. Your rules allow returns for 10 days.', log: 'Order found, refund is allowed by your rules' },
        { approval: true, icon: 'ph-user-check', title: 'Your approval',
          why: 'Refunds move money, so a person always decides.',
          facts: [['Order', '18842'], ['Refund', '₹3,499'], ['Your rules', 'Allowed']] },
        { icon: 'ph-paper-plane-tilt', title: 'Reply and start the refund', done: 'Customer told on WhatsApp. Refund started.', log: 'Reply sent, refund started',
          backTitle: 'Reply and ask for photos', backDone: 'Customer asked for photos of the item. The chat stays open.', backLog: 'Asked the customer for photos' }
      ]
    },
    call: {
      name: 'Voice agent',
      source: 'A call came in after closing time',
      interest: 'Voice agents',
      ask: 'We would like a voice agent to answer our calls.',
      steps: [
        { icon: 'ph-phone-call', title: 'Answer the call', done: 'The caller wants a sofa cleaning visit this Saturday', log: 'Call answered, request understood' },
        { icon: 'ph-calendar-check', title: 'Check your calendar and prices', done: 'Saturday 11 am is free. Your normal price is ₹2,400.', log: 'Free slot found, price looked up' },
        { approval: true, icon: 'ph-user-check', title: 'Your approval',
          why: 'The caller asked for a discount. Only you can say yes to that.',
          facts: [['Caller', 'New customer'], ['Slot', 'Saturday 11 am'], ['Asked for', '₹300 off']] },
        { icon: 'ph-calendar-plus', title: 'Book the visit and confirm', done: 'Visit booked with ₹300 off. Confirmation sent on WhatsApp.', log: 'Visit booked, confirmation sent',
          backTitle: 'Book at the normal price', backDone: 'Caller told the normal price applies. Visit booked at ₹2,400.', backLog: 'Discount declined, visit booked at normal price' }
      ]
    }
  };

  const agent = $('#agent');
  if (agent) {
    const stepsEl = $('#agent-steps');
    const logEl = $('#agent-log');
    const nameEl = $('#agent-name');
    const srcEl = $('#agent-source');
    const progEl = $('#agent-progress');
    const noteEl = $('#agent-note');
    const actsEl = $('#agent-acts');
    const tabs = $$('.agent-tab', agent);
    let current = 'invoice';
    let runId = 0;
    let started = false;
    let decide = null;

    const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
    const stamp = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
    const log = (text, you) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${stamp()}</span><span${you ? ' class="you"' : ''}></span>`;
      li.lastChild.textContent = text;
      logEl.appendChild(li);
      logEl.scrollTop = logEl.scrollHeight;
    };
    const skel = '<span class="skel" aria-hidden="true"><span></span><span></span></span>';

    const render = (scn) => {
      nameEl.textContent = scn.name;
      srcEl.textContent = scn.source;
      progEl.textContent = `Step 0 of ${scn.steps.length}`;
      logEl.innerHTML = '';
      actsEl.hidden = true;
      noteEl.textContent = 'The AI does the work. You make the decision at step three.';
      stepsEl.innerHTML = scn.steps.map((s, i) => `
        <li class="step" data-s="pending" data-i="${i}">
          <span class="step-ico"><i class="ph ${s.icon}" aria-hidden="true"></i></span>
          <div>
            <p class="step-title"><span class="t">${s.title}</span></p>
            <div class="step-detail"></div>
            ${s.approval ? `<div class="approve"><div><div class="approve-card">
              <dl class="facts">${s.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
              <p class="approve-why">${s.why}</p>
              <div class="approve-actions">
                <button class="btn btn-solid btn-sm" type="button" data-act="approve" disabled><i class="ph ph-check" aria-hidden="true"></i>Yes, approve</button>
                <button class="btn btn-ghost btn-sm" type="button" data-act="back" disabled><i class="ph ph-arrow-u-up-left" aria-hidden="true"></i>No, not this</button>
              </div>
              <p class="approve-hint">Try it. The AI waits for as long as you need.</p>
            </div></div></div>` : ''}
          </div>
        </li>`).join('');
    };

    const run = async (key) => {
      const id = ++runId;
      const scn = scenarios[key];
      const alive = () => id === runId;
      render(scn);
      agent.dataset.state = 'running';
      log(`Run started. ${scn.source}`);
      let sentBack = false;

      for (let i = 0; i < scn.steps.length; i++) {
        const s = scn.steps[i];
        const el = $(`.step[data-i="${i}"]`, stepsEl);
        const detail = $('.step-detail', el);
        progEl.textContent = `Step ${i + 1} of ${scn.steps.length}`;

        if (s.approval) {
          el.dataset.s = 'waiting';
          agent.dataset.state = 'waiting';
          $('.step-title', el).insertAdjacentHTML('beforeend', '<span class="tag waiting-tag">Waiting for you</span>');
          $('.approve', el).classList.add('open');
          const btns = $$('button', el);
          btns.forEach((b) => { b.disabled = false; });
          log('Paused. Waiting for a person to decide');
          const choice = await new Promise((res) => {
            decide = res;
            btns.forEach((b) => b.addEventListener('click', () => res(b.dataset.act), { once: true }));
          });
          if (!alive()) return;
          sentBack = choice === 'back';
          $('.approve', el).classList.remove('open');
          $('.waiting-tag', el).remove();
          el.dataset.s = sentBack ? 'back' : 'done';
          $('.step-ico i', el).className = `ph ${sentBack ? 'ph-arrow-u-up-left' : 'ph-check'}`;
          detail.textContent = sentBack ? 'Declined by you' : 'Approved by you';
          log(sentBack ? 'Declined by you' : 'Approved by you', true);
          agent.dataset.state = 'running';
          await wait(500);
          if (!alive()) return;
          continue;
        }

        if (sentBack && s.backTitle) $('.t', el).textContent = s.backTitle;
        el.dataset.s = 'running';
        detail.innerHTML = skel;
        await wait(1300 + i * 200);
        if (!alive()) return;
        el.dataset.s = 'done';
        $('.step-ico i', el).className = 'ph ph-check';
        detail.textContent = sentBack && s.backDone ? s.backDone : s.done;
        log(sentBack && s.backLog ? s.backLog : s.log);
        await wait(450);
        if (!alive()) return;
      }

      agent.dataset.state = 'done';
      log('Run complete');
      noteEl.textContent = sentBack
        ? 'You said no, so the AI changed its plan and wrote down why.'
        : 'Nothing happened until you said yes. Everything we build works this way.';
      actsEl.hidden = false;
    };

    const select = (key, focus) => {
      current = key;
      tabs.forEach((t) => {
        const on = t.dataset.scn === key;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      if (decide) { decide(null); decide = null; }
      run(key);
    };

    tabs.forEach((t, idx) => {
      t.addEventListener('click', () => select(t.dataset.scn));
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = tabs[(idx + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(next.dataset.scn, true);
      });
    });
    $('#agent-again').addEventListener('click', () => run(current));
    $('#agent-like').addEventListener('click', () => {
      const scn = scenarios[current];
      const chip = $(`input[name="interest"][value="${scn.interest}"]`);
      if (chip) chip.checked = true;
      const msg = $('#f-msg');
      if (msg && !msg.value.trim()) msg.value = scn.ask;
    });

    render(scenarios[current]);
    const startIO = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting) && !started) {
        started = true;
        startIO.disconnect();
        setTimeout(() => run(current), reduced ? 0 : 900);
      }
    }, { threshold: 0.35 });
    startIO.observe(agent);
  }

  /* ---------- Tagline: word by word, rAF throttled ---------- */
  const tagline = $('#tagline');
  if (tagline && !reduced) {
    const words = [];
    $$('[data-words]', tagline).forEach((p) => {
      const parts = p.textContent.trim().split(/\s+/);
      p.textContent = '';
      parts.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = w;
        p.appendChild(span);
        if (i < parts.length - 1) p.appendChild(document.createTextNode(' '));
        words.push(span);
      });
    });
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = tagline.getBoundingClientRect();
      const vh = innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.3;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.5)));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
        else removeEventListener('scroll', onScroll);
      });
    }, { rootMargin: '20% 0px 20% 0px' }).observe(tagline);
  }

  /* ---------- Enquiry form ---------- */
  const form = $('#enquiry');
  if (form) {
    const EMAIL = 'info@purplemagicstudio.com';
    const rules = {
      'f-name': (v) => (v ? '' : 'Please add your name.'),
      'f-company': (v) => (v ? '' : 'Please add your company.'),
      'f-email': (v) => (!v ? 'Please add your email.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'That email does not look right. Check for typos.')
    };
    const check = (id) => {
      const input = $(`#${id}`);
      const msg = rules[id](input.value.trim());
      $(`#e-${id.slice(2)}`).textContent = msg;
      input.setAttribute('aria-invalid', String(!!msg));
      return !msg;
    };
    Object.keys(rules).forEach((id) => {
      $(`#${id}`).addEventListener('blur', () => check(id));
      $(`#${id}`).addEventListener('input', () => { if ($(`#${id}`).getAttribute('aria-invalid') === 'true') check(id); });
    });
    const sent = $('#sent');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).filter((id) => !check(id));
      if (bad.length) { $(`#${bad[0]}`).focus(); return; }
      const d = new FormData(form);
      const body = [
        `Name: ${d.get('name')}`, `Company: ${d.get('company')}`, `Email: ${d.get('email')}`,
        `Interested in: ${d.getAll('interest').join(', ') || 'Not specified'}`,
        '', `Needs help with: ${d.get('message') || 'Not provided'}`
      ].join('\n');
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Free review request: ${d.get('company')}`)}&body=${encodeURIComponent(body)}`;
      form.hidden = true;
      sent.hidden = false;
      sent.focus();
    });
    $('#sent-back').addEventListener('click', () => { sent.hidden = true; form.hidden = false; $('#f-name').focus(); });

    const copyBtn = $('#mail-copy');
    copyBtn.addEventListener('click', async () => {
      const label = $('span', copyBtn);
      try { await navigator.clipboard.writeText(EMAIL); label.textContent = 'Copied'; }
      catch { label.textContent = 'Copy failed. Select the address instead.'; }
      setTimeout(() => { label.textContent = 'Copy email'; }, 2400);
    });
  }

  /* ---------- Client logos: show the name as text until the logo file exists ---------- */
  $$('img[data-fallback]').forEach((img) => {
    img.loading = 'eager';
    const swap = () => {
      const t = document.createElement('span');
      t.className = 'logo-text';
      t.textContent = img.alt;
      img.replaceWith(t);
    };
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener('error', swap, { once: true });
  });

  /* ---------- Footer wordmark: fill spreads from the pointer ---------- */
  const wm = $('.wordmark');
  if (wm) {
    const place = (e) => {
      const r = wm.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      wm.style.setProperty('--x', `${x}px`);
      wm.style.setProperty('--y', `${y}px`);
      return Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
    };
    wm.addEventListener('pointerenter', (e) => {
      wm.classList.add('snap');            // move the origin without animating it
      place(e);
      wm.style.setProperty('--r', '0px');
      void wm.offsetWidth;
      wm.classList.remove('snap');
      wm.style.setProperty('--r', `${Math.ceil(place(e))}px`);
    });
    wm.addEventListener('pointerleave', (e) => { place(e); wm.style.setProperty('--r', '0px'); });
  }

  // Footnote links open the sources list before jumping to it.
  $$('sup a').forEach((a) => a.addEventListener('click', () => { const d = $('#sources'); if (d) d.open = true; }));

  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
