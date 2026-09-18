/* Light Curtain (Originkit), ported from React to plain JS for the hero background.
   Preset: spread 0, striation 100, curtain width 30, density 150. Brand purples. */
(() => {
  const canvas = document.getElementById('curtain');
  const host = document.getElementById('hero');
  if (!canvas || !host) return;

  const CFG = {
    bg: [0, 0, 0],                       // #000000
    base: [0.486, 0.227, 0.929],         // #7C3AED
    accent: [0.718, 0.580, 0.965],       // #B794F6
    high: [0.914, 0.835, 1.0],           // #E9D5FF
    density: 150 / 50,
    speed: 50 / 50,
    cw: 30 / 100,
    spread: 0,
    striation: 1,
    hover: 1,
    reach: 0.02 + 0.3 * 0.18,
    gain: 0.32                           // keeps the text in front readable
  };

  // Phones get a lighter canvas: the shader is heavy and the streaks are soft anyway.
  const MAX_DPR = matchMedia('(pointer: coarse), (max-width: 767px)').matches ? 1 : 1.5;
  const TRAIL = 8, HIST = TRAIL - 1, TRAIL_LIFE = 0.62, TRAIL_STEP = 0.022;
  const PULSES = 3, PULSE_LIFE = 1.15, PULSE_SPEED = 1.05;
  const SWAY_W = 9.5, SWAY_Z = 0.3;

  const VERT = 'attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }';
  const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
const int TRAIL = 8;
const int PULSES = 3;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uHover;
uniform float uReach; uniform float uSway; uniform float uRush;
uniform vec3 uTrail[TRAIL]; uniform vec3 uPulse[PULSES];
uniform vec3 uBg; uniform vec3 uBase; uniform vec3 uAccent; uniform vec3 uHigh;
uniform float uDensity; uniform float uWidth; uniform float uSpread; uniform float uStriation; uniform float uGain;

float sat(float x){ return clamp(x, 0.0, 1.0); }
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 34.56); return fract(p.x * p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = h21(i), b = h21(i + vec2(1.0, 0.0)), c = h21(i + vec2(0.0, 1.0)), d = h21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * vnoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime;
  float rx = max(uReach, 0.02), rx2 = rx * rx;

  float lift = 0.0, blob = 0.0, cenY = 0.0, cenW = 0.0;
  for (int i = 0; i < TRAIL; i++){
    vec3 s = uTrail[i];
    float dx = uv.x - s.x, dy = uv.y - s.y;
    float gx = s.z * exp(-(dx * dx) / rx2);
    lift += gx; blob += gx * exp(-(dy * dy) / (rx2 * 2.6)); cenY += gx * s.y; cenW += gx;
  }
  float trailY = cenY / max(cenW, 1e-4);

  float ring = 0.0;
  for (int i = 0; i < PULSES; i++){
    vec3 p = uPulse[i];
    float d = abs(uv.x - p.x) - p.y;
    ring += p.z * exp(-(d * d) / 0.0012);
  }

  lift = (min(lift, 2.0) + ring * 0.9) * uHover;
  blob = min(blob, 1.5) * uHover;

  float nearP = exp(-pow(uv.x - uMouse.x, 2.0) / (rx2 * 4.0));
  float xw = uv.x - uSway * 0.09 * (0.25 + 0.75 * nearP) * uHover;

  float n1 = fbm5(vec2(xw * 6.5 * uDensity, t * 0.045));
  float n2 = fbm5(vec2(xw * 24.0 * uDensity + 3.1, t * 0.075));
  float n3 = vnoise(vec2(xw * 210.0 * uDensity, t * 0.04));
  float n4 = vnoise(vec2(xw * 70.0 * uDensity, 4.0 + t * 0.03));

  float band = pow(sat(n1 * 1.30 + n2 * 0.80 - 0.58 + lift * 0.34), 1.95);
  band *= 0.62 + 0.70 * n4;

  float yc = 0.50 + 0.24 * uSpread * (fbm5(vec2(xw * 3.1 * uDensity, 11.0)) - 0.5) * 2.0;
  yc = mix(yc, trailY, sat(cenW * 1.1) * uHover * 0.45);

  float wdt = uWidth * (0.22 + 0.28 * n2 + 0.10 * n1) * (1.0 + 0.5 * uRush * sat(lift));
  float prof = exp(-pow(abs(uv.y - yc) / max(wdt, 0.02), 1.75));
  float inten = band * prof * (1.0 - uStriation * 0.5 + uStriation * n3);

  float blend = sat(n1 * 1.30 - n2 * 0.55 + 0.28);
  vec3 c = mix(uBase, uAccent, blend);
  float hi = sat((n2 - 0.70) * 5.2) * sat(n1 * 1.6 - 0.35);
  c = mix(c, uHigh, hi * 0.85);

  vec3 glow = vec3(0.0);
  glow += c * pow(inten, 0.88) * 1.42;
  glow += vec3(1.0, 0.94, 1.0) * pow(inten, 4.5) * 0.65;
  glow += c * 0.30 * pow(sat(prof * band * 3.0), 0.70);
  glow += c * 0.10 * pow(sat(prof * 1.2), 1.3);
  glow += mix(uAccent, uHigh, sat(uRush)) * blob * (0.22 + 0.16 * uRush);
  glow += mix(uAccent, uHigh, 0.35) * ring * prof * 0.75 * uHover;
  glow += vec3(1.0, 0.95, 0.98) * pow(ring, 3.0) * prof * 0.35 * uHover;

  gl_FragColor = vec4(clamp(uBg + glow * uGain, 0.0, 1.0), 1.0);
}`;

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false });
  if (!gl) { canvas.remove(); return; }

  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.error('Curtain shader:', gl.getShaderInfoLog(sh)); return null; }
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { canvas.remove(); return; }
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error('Curtain link:', gl.getProgramInfoLog(prog)); canvas.remove(); return; }
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const locs = {};
  const u = (n) => (n in locs ? locs[n] : (locs[n] = gl.getUniformLocation(prog, n)));
  const clampN = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, on: 0, onTarget: 0 };
  const hx = new Float32Array(HIST), hy = new Float32Array(HIST), hAge = new Float32Array(HIST).fill(TRAIL_LIFE * 2);
  let head = 0, lastEmitX = 0.5, lastEmitY = 0.5;
  const trailData = new Float32Array(TRAIL * 3);
  const pulseX = new Float32Array(PULSES), pulseAge = new Float32Array(PULSES).fill(PULSE_LIFE * 2);
  let pulseHead = 0;
  const pulseData = new Float32Array(PULSES * 3);
  const sway = { p: 0.5, v: 0 };
  let rush = 0, prevX = 0.5, prevY = 0.5;
  let raf = 0, last = performance.now(), clock = 7;

  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock = (clock + dt * CFG.speed) % 3600;

    ptr.on += (ptr.onTarget - ptr.on) * (1 - Math.exp(-6 * dt));
    const kHead = 1 - Math.exp(-22 * dt);
    ptr.x += (ptr.tx - ptr.x) * kHead;
    ptr.y += (ptr.ty - ptr.y) * kHead;

    const inst = Math.hypot(ptr.tx - prevX, ptr.ty - prevY) / Math.max(dt, 1e-3);
    prevX = ptr.tx; prevY = ptr.ty;
    const rushTarget = clampN(inst / 2, 0, 1) * ptr.on;
    rush += (rushTarget - rush) * (1 - Math.exp(-(rushTarget > rush ? 14 : 3.2) * dt));

    sway.v += (-2 * SWAY_Z * SWAY_W * sway.v - SWAY_W * SWAY_W * (sway.p - ptr.x)) * dt;
    sway.p += sway.v * dt;
    const lag = clampN((ptr.x - sway.p) * 3, -1, 1);

    const my = 1 - ptr.y;
    if (ptr.on > 0.02 && Math.hypot(ptr.x - lastEmitX, my - lastEmitY) > TRAIL_STEP) {
      head = (head + 1) % HIST;
      hx[head] = ptr.x; hy[head] = my; hAge[head] = 0;
      lastEmitX = ptr.x; lastEmitY = my;
    }
    trailData[0] = ptr.x; trailData[1] = my; trailData[2] = ptr.on;
    for (let i = 0; i < HIST; i++) {
      const idx = (head - i + HIST * 2) % HIST;
      hAge[idx] += dt;
      const a = hAge[idx];
      trailData[(i + 1) * 3] = hx[idx];
      trailData[(i + 1) * 3 + 1] = hy[idx];
      trailData[(i + 1) * 3 + 2] = a >= TRAIL_LIFE ? 0 : Math.pow(1 - a / TRAIL_LIFE, 1.6) * ptr.on * 0.8;
    }
    for (let i = 0; i < PULSES; i++) {
      pulseAge[i] += dt;
      const a = pulseAge[i];
      pulseData[i * 3] = pulseX[i];
      pulseData[i * 3 + 1] = a * PULSE_SPEED;
      pulseData[i * 3 + 2] = a >= PULSE_LIFE ? 0 : Math.pow(1 - a / PULSE_LIFE, 2);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const bw = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const bh = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
    gl.viewport(0, 0, bw, bh);

    gl.uniform2f(u('uRes'), bw, bh);
    gl.uniform1f(u('uTime'), clock);
    gl.uniform2f(u('uMouse'), ptr.x, my);
    gl.uniform1f(u('uHover'), Math.min(1, ptr.on) * CFG.hover);
    gl.uniform1f(u('uReach'), CFG.reach);
    gl.uniform1f(u('uSway'), lag);
    gl.uniform1f(u('uRush'), rush);
    gl.uniform3fv(u('uTrail[0]'), trailData);
    gl.uniform3fv(u('uPulse[0]'), pulseData);
    gl.uniform3fv(u('uBg'), CFG.bg);
    gl.uniform3fv(u('uBase'), CFG.base);
    gl.uniform3fv(u('uAccent'), CFG.accent);
    gl.uniform3fv(u('uHigh'), CFG.high);
    gl.uniform1f(u('uDensity'), CFG.density);
    gl.uniform1f(u('uWidth'), CFG.cw);
    gl.uniform1f(u('uSpread'), CFG.spread);
    gl.uniform1f(u('uStriation'), CFG.striation);
    gl.uniform1f(u('uGain'), CFG.gain);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false;
  const loop = (now) => { frame(now); raf = requestAnimationFrame(loop); };
  const sync = () => {
    cancelAnimationFrame(raf);
    if (visible && !document.hidden && !reduced) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; sync(); }).observe(canvas);
  document.addEventListener('visibilitychange', sync);
  frame(performance.now());
  if (reduced) addEventListener('resize', () => requestAnimationFrame(frame));

  // Pointer is tracked on the hero section because the text sits in front of the canvas.
  const track = (e) => {
    const r = canvas.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    ptr.tx = clampN((e.clientX - r.left) / r.width, 0, 1);
    ptr.ty = clampN((e.clientY - r.top) / r.height, 0, 1);
    if (ptr.on < 0.02) {
      ptr.x = ptr.tx; ptr.y = ptr.ty;
      sway.p = ptr.tx; sway.v = 0;
      prevX = ptr.tx; prevY = ptr.ty;
      lastEmitX = ptr.tx; lastEmitY = 1 - ptr.ty;
      hAge.fill(TRAIL_LIFE * 2);
    }
    ptr.onTarget = 1;
  };
  const leave = () => { ptr.onTarget = 0; };
  host.addEventListener('pointermove', track);
  host.addEventListener('pointerenter', track);
  host.addEventListener('pointerdown', (e) => {
    track(e);
    pulseHead = (pulseHead + 1) % PULSES;
    pulseX[pulseHead] = ptr.tx;
    pulseAge[pulseHead] = 0;
  });
  host.addEventListener('pointerleave', leave);
  host.addEventListener('pointercancel', leave);
})();
