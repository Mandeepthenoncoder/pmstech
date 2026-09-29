/* Careers pages: scroll reveal, and the five minute application.

   The form never scores anything. It posts the raw answers to a Supabase
   edge function, which holds the answer key and writes the score. That way a
   candidate reading this file learns nothing about how they are marked. */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- config */
  var SUPABASE_URL = window.PM_SUPABASE_URL || 'https://kvifzyskdmqtmteipvye.supabase.co';
  var SUPABASE_ANON_KEY = window.PM_SUPABASE_ANON_KEY || '';
  var FALLBACK_EMAIL = 'careers@purplemagicstudio.com';
  // Postgres function, set up by supabase/setup.sql. It scores and stores the
  // application. The anon key can call this and nothing else.
  var ENDPOINT = SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/rpc/submit_application';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- shared */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ form */
  var host = document.querySelector('.apply-card');
  var dataEl = document.getElementById('role-data');
  if (!host || !dataEl) return;

  var role;
  try { role = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var CONTACT = [
    { id: 'name', type: 'input', label: 'Your name', autocomplete: 'name', required: true },
    { id: 'phone', type: 'input', label: 'WhatsApp number', autocomplete: 'tel', inputmode: 'tel', help: 'We reply here first.', required: true },
    { id: 'email', type: 'input', label: 'Email', autocomplete: 'email', inputmode: 'email', required: true }
  ];

  /* Group questions into steps: contact, then role questions 3 at a time. */
  var steps = [{ title: 'About you', qs: CONTACT }];
  for (var i = 0; i < role.questions.length; i += 3) {
    steps.push({ title: 'About the work', qs: role.questions.slice(i, i + 3) });
  }
  var last = steps[steps.length - 1];
  last.consent = true;

  var state = {};
  var at = 0;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fieldHtml(q) {
    var help = q.help ? '<p class="q-help">' + esc(q.help) + '</p>' : '';
    var body = '';

    if (q.type === 'input') {
      body = '<input id="q-' + q.id + '" type="text" name="' + q.id + '"' +
        (q.autocomplete ? ' autocomplete="' + q.autocomplete + '"' : '') +
        (q.inputmode ? ' inputmode="' + q.inputmode + '"' : '') + '>';
    } else if (q.type === 'text') {
      body = '<textarea id="q-' + q.id + '" name="' + q.id + '" maxlength="' + (q.max || 400) + '"' +
        (q.link ? ' inputmode="url" placeholder="https://"' : '') + '></textarea>' +
        '<p class="count" data-for="' + q.id + '">0 / ' + (q.max || 400) + '</p>';
    } else {
      var multi = q.type === 'multi';
      body = '<div class="opts" role="group" aria-labelledby="l-' + q.id + '">' +
        q.options.map(function (o) {
          return '<label class="opt' + (multi ? ' multi' : '') + '">' +
            '<input type="' + (multi ? 'checkbox' : 'radio') + '" name="' + q.id + '" value="' + esc(o.v) + '">' +
            '<span>' + esc(o.label) + '</span></label>';
        }).join('') + '</div>';
      if (multi && q.maxPick) help += '<p class="q-help">Pick up to ' + q.maxPick + '.</p>';
    }

    var labelTag = q.type === 'input' || q.type === 'text' ? 'label' : 'p';
    var labelFor = q.type === 'input' || q.type === 'text' ? ' for="q-' + q.id + '"' : '';
    return '<div class="q" data-q="' + q.id + '">' +
      '<' + labelTag + ' class="q-label" id="l-' + q.id + '"' + labelFor + '>' + esc(q.label) + '</' + labelTag + '>' +
      help + body + '<p class="err" id="e-' + q.id + '"></p></div>';
  }

  function render() {
    var pct = Math.round((at / steps.length) * 100);
    var s = steps[at];
    host.innerHTML =
      '<div class="apply-head">' +
        '<div class="apply-meta"><span>' + esc(s.title) + '</span><span class="mono">Step ' + (at + 1) + ' of ' + steps.length + '</span></div>' +
        '<div class="bar"><span style="width:' + pct + '%"></span></div>' +
      '</div>' +
      '<form class="apply-step" novalidate>' +
        s.qs.map(fieldHtml).join('') +
        (s.consent ? consentHtml() : '') +
        '<div class="apply-foot">' +
          '<div class="side">' +
            (at > 0 ? '<button class="btn btn-ghost" type="button" data-back><i class="ph ph-arrow-left" aria-hidden="true"></i>Back</button>' : '') +
          '</div>' +
          '<button class="btn btn-primary" type="submit">' +
            (at === steps.length - 1 ? 'Send application' : 'Continue') +
            ' <i class="ph ph-arrow-right" aria-hidden="true"></i></button>' +
        '</div>' +
        '<p class="err" id="e-form"></p>' +
      '</form>';

    restore(s);
    wire(s);
    requestAnimationFrame(function () {
      var f = host.querySelector('input, textarea');
      if (f && at > 0) f.focus({ preventScroll: true });
      host.querySelector('.bar span').style.width = Math.round(((at + 1) / steps.length) * 100) + '%';
    });
  }

  function consentHtml() {
    return '<div class="consent">' +
      '<p>We use your answers only to assess this application and to contact you about it. We do not sell or share them. Ask us to delete your application at any time by writing to <a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>. Applications are deleted after twelve months.</p>' +
      '<label class="check"><input type="checkbox" name="consent"><span class="box"><i class="ph ph-check" aria-hidden="true"></i></span>' +
      '<span class="t">I agree to Purple Magic storing these answers to consider my application.</span></label>' +
      '<p class="err" id="e-consent"></p></div>';
  }

  function restore(s) {
    s.qs.forEach(function (q) {
      var v = state[q.id];
      if (v === undefined) return;
      if (q.type === 'input' || q.type === 'text') {
        var el = host.querySelector('#q-' + q.id);
        if (el) { el.value = v; bumpCount(q, el); }
      } else if (q.type === 'multi') {
        (v || []).forEach(function (val) {
          var el = host.querySelector('[name="' + q.id + '"][value="' + val + '"]');
          if (el) el.checked = true;
        });
      } else {
        var r = host.querySelector('[name="' + q.id + '"][value="' + v + '"]');
        if (r) r.checked = true;
      }
    });
    if (s.consent && state.consent) {
      var c = host.querySelector('[name="consent"]');
      if (c) c.checked = true;
    }
  }

  function bumpCount(q, el) {
    var c = host.querySelector('.count[data-for="' + q.id + '"]');
    if (!c) return;
    var max = q.max || 400;
    c.textContent = el.value.length + ' / ' + max;
    c.classList.toggle('over', el.value.length >= max);
  }

  function wire(s) {
    var form = host.querySelector('form');

    s.qs.forEach(function (q) {
      if (q.type === 'text') {
        var el = host.querySelector('#q-' + q.id);
        el.addEventListener('input', function () { bumpCount(q, el); });
      }
      if (q.type === 'multi' && q.maxPick) {
        host.querySelectorAll('[name="' + q.id + '"]').forEach(function (box) {
          box.addEventListener('change', function () {
            var picked = host.querySelectorAll('[name="' + q.id + '"]:checked');
            if (picked.length > q.maxPick) { box.checked = false; flash(q.id, 'You can pick up to ' + q.maxPick + '.'); }
            else clear(q.id);
          });
        });
      }
      if (q.type === 'choice') {
        host.querySelectorAll('[name="' + q.id + '"]').forEach(function (r) {
          r.addEventListener('change', function () { clear(q.id); });
        });
      }
    });

    var back = host.querySelector('[data-back]');
    if (back) back.addEventListener('click', function () { collect(s); at--; render(); scrollTop(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      collect(s);
      if (!validate(s)) return;
      if (at < steps.length - 1) { at++; render(); scrollTop(); }
      else send(form);
    });
  }

  function scrollTop() {
    var top = host.getBoundingClientRect().top + window.pageYOffset - 96;
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
  }

  function collect(s) {
    s.qs.forEach(function (q) {
      if (q.type === 'input' || q.type === 'text') {
        var el = host.querySelector('#q-' + q.id);
        if (el) state[q.id] = el.value.trim();
      } else if (q.type === 'multi') {
        state[q.id] = Array.prototype.map.call(host.querySelectorAll('[name="' + q.id + '"]:checked'), function (x) { return x.value; });
      } else {
        var r = host.querySelector('[name="' + q.id + '"]:checked');
        state[q.id] = r ? r.value : undefined;
      }
    });
    if (s.consent) {
      var c = host.querySelector('[name="consent"]');
      state.consent = !!(c && c.checked);
    }
  }

  function flash(id, msg) {
    var e = document.getElementById('e-' + id);
    if (e) e.textContent = msg;
  }
  function clear(id) { flash(id, ''); }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

  /* Work links. People paste a full URL, a bare domain, or just a handle, and
     often several at once. The same rules run in the dashboard, so anything
     accepted here renders as a clickable link there. Keep the two in step. */
  var LINK_TOKEN = /^(https?:\/\/\S{4,}|(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/\S*)?|@[A-Za-z0-9._]{2,})$/i;
  /* People type @name, instagram.com/name, or a full profile URL. We store the
     bare handle, so it is one thing we can check rather than a link that can
     point anywhere or stop working. */
  function cleanHandle(v) {
    return String(v || '')
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/^instagram\.com\//i, '')
      .replace(/^@/, '')
      .replace(/[/?#].*$/, '')
      .trim();
  }

  function workLinks(v) {
    return String(v || '')
      .split(/[\s,]+/)
      .map(function (t) { return t.replace(/[.,;)]+$/, '').trim(); })
      .filter(function (t) { return LINK_TOKEN.test(t); });
  }

  function validate(s) {
    var ok = true, first = null;
    s.qs.forEach(function (q) {
      var v = state[q.id];
      var bad = '';
      if (q.id === 'name') { if (!v) bad = 'Please tell us your name.'; }
      else if (q.id === 'phone') { if (!PHONE_RE.test(String(v || '').replace(/[\s-]/g, ''))) bad = 'Enter a 10 digit Indian mobile number.'; }
      else if (q.id === 'email') { if (!EMAIL_RE.test(v || '')) bad = 'Enter a valid email address.'; }
      else if (q.type === 'multi') { if (!v || !v.length) bad = 'Pick at least one.'; }
      else if (q.handle) {
        var h = cleanHandle(v);
        if (!h) bad = 'Please add your Instagram handle.';
        else if (!/^[A-Za-z0-9._]{2,30}$/.test(h)) bad = 'Just the handle, like yourname. Letters, numbers, dots and underscores.';
        else state[q.id] = h;
      }
      else if (q.link) {
        if (!v) bad = 'Please add at least one link to your work.';
        else if (!workLinks(v).length) bad = 'We could not find a link in there. Paste a web address, or a handle like @yourname.';
      }
      else if (q.type === 'text') { if (!v || v.length < 8) bad = 'A line or two, please.'; }
      else if (q.type === 'choice') { if (!v) bad = 'Pick one.'; }
      flash(q.id, bad);
      if (bad) { ok = false; if (!first) first = q.id; }
    });
    if (s.consent && !state.consent) { flash('consent', 'Please tick this to continue.'); ok = false; if (!first) first = 'consent'; }
    if (!ok && first) {
      var el = host.querySelector('[data-q="' + first + '"]') || host.querySelector('.consent');
      if (el) el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }
    return ok;
  }

  function payload() {
    var answers = {};
    role.questions.forEach(function (q) { answers[q.id] = state[q.id]; });
    ['start', 'exp', 'why'].forEach(function (k) { if (state[k] !== undefined) answers[k] = state[k]; });
    return {
      role: role.slug,
      role_title: role.title,
      brand: role.brand,
      name: state.name,
      phone: String(state.phone || '').replace(/[\s-]/g, ''),
      email: state.email,
      answers: answers,
      consent: true,
      source: String(window.location.pathname || ''),
      submitted_at: new Date().toISOString()
    };
  }

  function mailtoFallback() {
    var p = payload();
    var lines = ['Application for ' + p.role_title + ' (' + p.brand + ')', '', 'Name: ' + p.name, 'Phone: ' + p.phone, 'Email: ' + p.email, ''];
    role.questions.concat([{ id: 'start', label: 'Could start' }, { id: 'exp', label: 'Experience' }, { id: 'why', label: 'Why this role' }])
      .forEach(function (q) {
        var v = p.answers[q.id];
        if (v === undefined) return;
        if (Array.isArray(v)) v = v.join(', ');
        lines.push(q.label, '  ' + v, '');
      });
    return 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent('Application: ' + p.role_title) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function done(ref, viaEmail) {
    host.innerHTML = '<div class="done">' +
      '<i class="ph ph-check-circle big" aria-hidden="true"></i>' +
      '<h3>' + (viaEmail ? 'Almost there' : 'Application received') + '</h3>' +
      (viaEmail
        ? '<p>We could not reach our server, so we have opened your email app with the answers filled in. Press send there and it reaches us.</p>' +
          '<a class="btn btn-primary" href="' + mailtoFallback() + '">Open email again</a>'
        : '<p>Thanks, ' + esc(String(state.name || '').split(' ')[0]) + '. Your answers are with us.</p>' +
          (ref ? '<p class="ref">Reference ' + esc(ref) + '</p>' : '') +
          '<p>Every application is read. You will hear back within five working days, either way.</p>' +
          '<a class="btn btn-ghost" href="../careers.html">See the other roles</a>') +
      '</div>';
    host.setAttribute('tabindex', '-1');
    host.focus({ preventScroll: true });
    scrollTop();
  }

  function send(form) {
    var btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = 'Sending<i class="ph ph-circle-notch" aria-hidden="true"></i>';

    if (!SUPABASE_ANON_KEY) { window.location.href = mailtoFallback(); done(null, true); return; }

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 12000);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ payload: payload() }),
      signal: ctrl.signal
    })
      .then(function (r) {
        clearTimeout(timer);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) { done(d && d.reference, false); })
      .catch(function () {
        clearTimeout(timer);
        window.location.href = mailtoFallback();
        done(null, true);
      });
  }

  render();
})();
