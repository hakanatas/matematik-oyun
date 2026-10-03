/* Nokta'nın Oyunları · ortak motor
   Tuval (mantıksal koordinatlar), geometri, mürekkep çizimleri, Nokta'nın konuşması,
   puan, ses, bitiş penceresi ve kayıtlı yıldızlar. */
(() => {
  'use strict';
  const N = (window.N = {});
  N.INK = '#171411'; N.SOFT = 'rgba(23,20,17,.62)'; N.FAINT = 'rgba(23,20,17,.16)';
  N.AMBER = '#e8a33d'; N.DEEP = '#b8741a'; N.WASH = 'rgba(232,163,61,.18)'; N.SEAL = '#c4432b'; N.SHEET = '#fffaf0';
  N.BRUSH = '"Caveat Brush", "Comic Sans MS", cursive'; N.MONO = '"JetBrains Mono", ui-monospace, monospace'; N.SERIF = 'Fraunces, Georgia, serif';
  const $ = (s, r = document) => r.querySelector(s);
  N.$ = $;
  N.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── geometri (y aşağı ekran koordinatı; açılar matematik yönünde, y yukarı) ── */
  const g = (N.g = {
    P: (x, y) => ({ x, y }),
    add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
    sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
    mul: (a, k) => ({ x: a.x * k, y: a.y * k }),
    dot: (a, b) => a.x * b.x + a.y * b.y,
    cross: (a, b) => a.x * b.y - a.y * b.x,
    len: (a) => Math.hypot(a.x, a.y),
    dist: (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
    unit: (a) => { const l = Math.hypot(a.x, a.y) || 1; return { x: a.x / l, y: a.y / l }; },
    lerp: (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }),
    rad: (d) => (d * Math.PI) / 180,
    deg: (r) => (r * 180) / Math.PI,
    nd: (d) => ((d % 360) + 360) % 360,
    /** a'dan b'ye yönün matematik açısı (radyan, saat yönünün tersi, y yukarı) */
    ang: (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x),
    /** c merkezli r yarıçaplı, t açısındaki nokta */
    polar: (c, r, t) => ({ x: c.x + r * Math.cos(t), y: c.y - r * Math.sin(t) }),
    dir: (t) => ({ x: Math.cos(t), y: -Math.sin(t) }),
    /** iki sonsuz doğrunun kesişimi (p1p2 ve p3p4); paralelse null */
    meet(p1, p2, p3, p4) {
      const d1 = g.sub(p2, p1), d2 = g.sub(p4, p3), den = g.cross(d1, d2);
      if (Math.abs(den) < 1e-9 * g.len(d1) * g.len(d2)) return null;
      const t = g.cross(g.sub(p3, p1), d2) / den;
      return g.add(p1, g.mul(d1, t));
    },
    proj(p, a, b) { const d = g.sub(b, a), t = g.dot(g.sub(p, a), d) / g.dot(d, d); return g.add(a, g.mul(d, t)); },
    distLine: (p, a, b) => g.dist(p, g.proj(p, a, b)),
    distSeg(p, a, b) { const d = g.sub(b, a), l2 = g.dot(d, d); let t = l2 ? g.dot(g.sub(p, a), d) / l2 : 0; t = Math.max(0, Math.min(1, t)); return g.dist(p, g.add(a, g.mul(d, t))); },
    /** p'den d yönünde giden ışının dikdörtgen kenarına kadar parametresi */
    exitT(p, d, W, H) {
      let t = Infinity;
      if (d.x > 1e-9) t = Math.min(t, (W - p.x) / d.x); else if (d.x < -1e-9) t = Math.min(t, -p.x / d.x);
      if (d.y > 1e-9) t = Math.min(t, (H - p.y) / d.y); else if (d.y < -1e-9) t = Math.min(t, -p.y / d.y);
      return Math.max(0, t);
    },
    /** iki çemberin kesişimi: [üstteki, alttaki] ya da [] */
    circles(a, r1, b, r2) {
      const d = g.dist(a, b);
      if (d < 1e-9 || d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9) return [];
      const x = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - x * x));
      const u = g.unit(g.sub(b, a)), m = g.add(a, g.mul(u, x)), n = { x: u.y, y: -u.x };
      const p = g.add(m, g.mul(n, h)), q = g.sub(m, g.mul(n, h));
      return p.y <= q.y ? [p, q] : [q, p];
    },
    /** üç noktanın köşe açısı (b köşesinde), derece */
    angleAt(a, b, c) {
      const u = g.sub(a, b), v = g.sub(c, b);
      return g.deg(Math.acos(Math.max(-1, Math.min(1, g.dot(u, v) / (g.len(u) * g.len(v) || 1)))));
    },
    shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    rnd: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  });

  /* ── tuval: sabit mantıksal boyut, her ekrana ölçeklenir ── */
  N.Stage = class {
    constructor(canvas, W, H) {
      this.cv = canvas; this.W = W; this.H = H; this.ctx = canvas.getContext('2d');
      this.draw = () => {}; this.onDown = this.onMove = this.onUp = null; this.down = false; this._q = false;
      canvas.style.aspectRatio = `${W} / ${H}`;
      const ro = new ResizeObserver(() => this.resize()); ro.observe(canvas);
      canvas.addEventListener('pointerdown', (e) => {
        if (e.button > 0) return;
        this.down = true; try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        e.preventDefault(); this.onDown && this.onDown(this.pt(e), e);
      });
      canvas.addEventListener('pointermove', (e) => { this.hover = this.pt(e); this.onMove && this.onMove(this.hover, e); });
      const up = (e) => { if (!this.down) return; this.down = false; this.onUp && this.onUp(this.pt(e), e); };
      canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
      canvas.addEventListener('pointerleave', () => { if (!this.down) { this.hover = null; this.onMove && this.onMove(null); } });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.render());
      this.resize();
    }
    resize() {
      const r = this.cv.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round((r.width * this.H / this.W) * dpr);
      this.k = this.cv.width / this.W; this.css = r.width / this.W; this.render();
    }
    pt(e) { const r = this.cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * this.W / r.width, y: (e.clientY - r.top) * this.H / r.height }; }
    /** dokunma yarıçapı: tahta küçüldükçe parmak için büyür */
    hit(r) { return r * Math.max(1, .62 / (this.css || 1)); }
    /** mantıksal noktayı tahtaya göre CSS pikseline çevirir */
    toCss(p) { return { x: p.x * this.css, y: p.y * this.css }; }
    render() {
      const c = this.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, this.cv.width, this.cv.height);
      c.setTransform(this.k, 0, 0, this.k, 0, 0); c.lineCap = 'round'; c.lineJoin = 'round';
      this.draw(c);
    }
    /** bir sonraki karede yeniden çiz */
    ask() { if (this._q) return; this._q = true; requestAnimationFrame(() => { this._q = false; this.render(); }); }
    cursor(s) { this.cv.style.cursor = s; }
  };

  /** t: 0→1 arası ara değer; her karede fn(t) çağrılır */
  N.tween = (ms, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise((res) => {
    if (N.reduced) ms = Math.min(ms, 60);
    const t0 = performance.now();
    const step = (now) => { const t = Math.min(1, (now - t0) / ms); fn(ease(t)); if (t < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
  N.wait = (ms) => new Promise((r) => setTimeout(r, N.reduced ? Math.min(ms, 120) : ms));

  /* ── el çizimi: sabit gürültü ve kalem izi ── */
  N.nz = (a) => { const v = Math.sin(a * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
  N.sketch = true;
  const ghostOk = (o) => N.sketch && o.sketch !== false && !(o.dash && o.dash.length) && (o.w || 3) >= 2 && (o.alpha == null || o.alpha > .3);
  const ghostStyle = (c, o) => { c.strokeStyle = o.color || N.INK; c.lineWidth = (o.w || 3) * .42; c.setLineDash([]); c.globalAlpha = (o.alpha == null ? 1 : o.alpha) * .32; };
  function ghostSeg(c, a, e, o) {
    const L = Math.hypot(e.x - a.x, e.y - a.y); if (L < 6) return;
    const n = { x: -(e.y - a.y) / L, y: (e.x - a.x) / L }, j = (p, k) => (N.nz(p.x * .137 + p.y * .291 + k) - .5) * 2.6;
    const j1 = j(a, 1), j2 = j(e, 2), j3 = (N.nz(a.x * .07 + e.y * .11) - .5) * Math.min(4, L / 40);
    const m = { x: (a.x + e.x) / 2 + n.x * j3, y: (a.y + e.y) / 2 + n.y * j3 };
    ghostStyle(c, o); c.beginPath(); c.moveTo(a.x + n.x * j1, a.y + n.y * j1); c.quadraticCurveTo(m.x, m.y, e.x + n.x * j2, e.y + n.y * j2); c.stroke(); c.globalAlpha = 1;
  }

  /* ── Nokta karakteri: yürür, göz kırpar, sevinir, üzülür ── */
  N.noktaChar = (c, x, gy, o) => {
    const t = o.t, mv = o.moving, dir = o.dir || 1, happy = o.happy, sad = !happy && o.sad;
    const step = Math.sin(t * 11), bob = mv ? Math.abs(Math.cos(t * 11)) * 5 : Math.sin(t * 2) * 1.2 + (happy ? Math.abs(Math.sin(t * 9)) * 8 : 0);
    const legL = 24, bw = 25, bh = 31, cx = x, cy = gy - legL - bh + 4 - bob;
    const sq = mv ? 1 + Math.cos(t * 22) * .03 : 1 + Math.sin(t * 2) * .015;
    c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = N.INK;
    // bacaklar
    [-1, 1].forEach((sd) => {
      const hx = cx + sd * 9, hy = cy + bh * .82, sw = mv ? step * sd * 11 : 0, fx = hx + sw + dir * (mv ? 2 : 0), fy = gy - (mv ? Math.max(0, -step * sd) * 6 : 0);
      c.beginPath(); c.moveTo(hx, hy); c.quadraticCurveTo((hx + fx) / 2 - sd * 1.5, (hy + fy) / 2, fx, fy - 3); c.lineWidth = 3.4; c.stroke();
      c.beginPath(); c.ellipse(fx + dir * 3, fy - 2.5, 6, 3.6, 0, 0, 7); c.fillStyle = N.INK; c.fill();
    });
    // kollar
    const arm = (sd) => {
      const sx = cx + sd * bw * .93, sy = cy + 4; let hx, hy;
      if (o.umbrella && sd === 1) { hx = o.umbrella.x; hy = o.umbrella.y; }
      else if (happy) { hx = cx + sd * (bw + 16); hy = cy - 30 + Math.sin(t * 14 + sd) * 4; }
      else if (mv) { hx = sx + sd * 8 - step * sd * 10; hy = sy + 22; }
      else if (sad) { hx = sx + sd * 4; hy = sy + 24; }
      else { hx = sx + sd * 10; hy = sy + 20 + Math.sin(t * 2 + sd) * 1.5; }
      c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + sd * 6, (sy + hy) / 2 - 4, hx, hy); c.lineWidth = 2.8; c.stroke();
      c.beginPath(); c.arc(hx, hy, 3.8, 0, 7); c.fillStyle = N.INK; c.fill();
    };
    arm(-1); arm(1);
    // gövde: yumurta
    c.save(); c.translate(cx, cy); c.scale(1 / sq, sq); c.rotate(mv ? dir * .06 : Math.sin(t * 1.3) * .02);
    const egg = () => { c.beginPath(); c.moveTo(0, -bh); c.bezierCurveTo(bw * .95, -bh, bw * 1.05, bh * .1, bw * .92, bh * .45); c.bezierCurveTo(bw * .8, bh * .95, -bw * .8, bh * .95, -bw * .92, bh * .45); c.bezierCurveTo(-bw * 1.05, bh * .1, -bw * .95, -bh, 0, -bh); c.closePath(); };
    const gr = c.createRadialGradient(-bw * .35, -bh * .45, 3, 0, 0, bh * 1.2); gr.addColorStop(0, '#f1ede6'); gr.addColorStop(.6, '#d6d0c6'); gr.addColorStop(1, '#a9a196');
    egg(); c.fillStyle = gr; c.fill();
    c.save(); egg(); c.clip(); c.fillStyle = 'rgba(80,70,60,.18)'; for (let i = 0; i < 26; i++) { c.beginPath(); c.arc((N.nz(i * 3.1) - .5) * bw * 1.8, (N.nz(i * 5.7) - .5) * bh * 1.8, .9 + N.nz(i) * .8, 0, 7); c.fill(); }
    c.strokeStyle = 'rgba(23,20,17,.22)'; c.lineWidth = 1.2; c.beginPath(); for (let k = 0; k < 6; k++) { const yy = bh * .15 + k * 4.5; c.moveTo(bw * .25 + k * 2, yy + 8); c.lineTo(bw * .9, yy - 4); } c.stroke(); c.restore();
    egg(); c.strokeStyle = N.INK; c.lineWidth = 3.6; c.stroke();
    c.save(); c.translate(.8, .6); c.rotate(.02); egg(); c.globalAlpha = .3; c.lineWidth = 1.5; c.stroke(); c.restore();
    // saç
    c.lineWidth = 1.8; c.beginPath(); [-4, 0, 4].forEach((hx, i) => { const w = Math.sin(t * 3 + i) * 1.5 - (mv ? dir * 3 : 0); c.moveTo(hx * .6, -bh + 1); c.quadraticCurveTo(hx + w, -bh - 6, hx * 1.6 + w * 1.4, -bh - 9 + Math.abs(hx) * .4); }); c.stroke();
    // yüz
    const fx = dir * 3.5 * (mv ? 1 : .5), blink = (t % 4.3) < .13;
    if (happy || blink) { c.lineWidth = 2; [-1, 1].forEach((sd) => { c.beginPath(); c.arc(fx + sd * 8, -3, 3.6, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }); }
    else { c.fillStyle = N.INK; [-1, 1].forEach((sd) => { c.beginPath(); c.ellipse(fx + sd * 8, -4, 2.3, 3, 0, 0, 7); c.fill(); c.beginPath(); c.arc(fx + sd * 8 + .8, -5.2, .8, 0, 7); c.fillStyle = '#fff'; c.fill(); c.fillStyle = N.INK; }); }
    c.lineWidth = sad ? 1.8 : 1.2; c.globalAlpha = sad ? .9 : .55; [-1, 1].forEach((sd) => { c.beginPath(); c.moveTo(fx + sd * 5, -12 - (happy ? 1.5 : 0) - (sad ? 2.5 : 0)); c.lineTo(fx + sd * 11, -11.5 - (happy ? 2.5 : 0) + (sad ? 1.5 : 0)); c.stroke(); }); c.globalAlpha = 1;
    c.fillStyle = 'rgba(196,67,43,.18)'; [-1, 1].forEach((sd) => { c.beginPath(); c.ellipse(fx + sd * 14, 4, 4, 2.4, 0, 0, 7); c.fill(); });
    c.lineWidth = 2; c.beginPath();
    if (happy) { c.moveTo(fx - 6, 4); c.quadraticCurveTo(fx, 13, fx + 6, 4); c.closePath(); c.fillStyle = '#5a3a2c'; c.fill(); c.stroke(); }
    else if (sad) { c.arc(fx, 10, 5.5, Math.PI * 1.2, Math.PI * 1.8); c.stroke(); }
    else { c.arc(fx, 2, 5.5, Math.PI * .2, Math.PI * .8); c.stroke(); }
    c.restore();
    // sevinç kırıntıları
    if (happy) { c.strokeStyle = N.AMBER; c.lineWidth = 3; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45 + Math.sin(t * 3 + i) * .08, r = 52 + Math.sin(t * 6 + i * 2) * 5, px = cx + Math.cos(a) * r, py = cy + 8 + Math.sin(a) * r; c.beginPath(); c.moveTo(px - Math.cos(a + 1.2) * 5, py - Math.sin(a + 1.2) * 5); c.lineTo(px + Math.cos(a + 1.2) * 5, py + Math.sin(a + 1.2) * 5); c.stroke(); } }
    c.lineCap = 'butt'; c.lineJoin = 'miter';
  };

  /* sayfadaki Nokta resimlerini canlı karaktere çevirir (hop → sevinç, shake → üzüntü) */
  const AV = new Set(); let avRun = false;
  function avLoop(now) {
    const t = now / 1000 * (N.reduced ? .3 : 1);
    AV.forEach((cv) => {
      if (!cv.isConnected) { AV.delete(cv); return; }
      const A = cv._av;
      if (cv.classList.contains('hop')) { cv.classList.remove('hop'); A.happy = t + 2.2; A.sad = 0; }
      const sh = cv.classList.contains('shake'); if (sh && !A.shook) { A.sad = t + 1.6; A.happy = 0; } A.shook = sh;
      const w = cv.clientWidth; if (!w) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2), W = Math.round(w * dpr), H = Math.round(w * 1.24 * dpr);
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.setTransform(W / 100, 0, 0, W / 100, 0, 0);
      const happy = A.always === 'happy' || t < A.happy;
      c.beginPath(); c.ellipse(53, 117, 24, 4.5, 0, 0, 7); c.fillStyle = 'rgba(23,20,17,.14)'; c.fill();
      N.noktaChar(c, 50, 116, { t: t + A.seed, moving: false, dir: 1, happy, sad: t < A.sad });
    });
    if (AV.size) requestAnimationFrame(avLoop); else avRun = false;
  }
  N.avatar = (cv, o = {}) => { cv._av = { happy: 0, sad: 0, seed: Math.random() * 10, ...o }; AV.add(cv); if (!avRun) { avRun = true; requestAnimationFrame(avLoop); } return cv; };
  function swapNokta(root) {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('img[src$="nokta.png"]:not([data-keep])').forEach((img) => {
      const cv = document.createElement('canvas'), cs = getComputedStyle(img);
      cv.className = img.className + ' nokta-cv'; if (img.id) cv.id = img.id;
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', img.alt || 'Nokta');
      const w = parseFloat(cs.width) || parseFloat(img.getAttribute('width')) || 78; cv.width = 100; cv.height = 124; cv.style.width = w + 'px'; cv.style.height = 'auto';
      const end = !!img.closest('.end-card'); img.replaceWith(cv); N.avatar(cv, end ? { always: 'happy' } : {});
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    swapNokta(document.body);
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((nd) => { if (nd.nodeType === 1) swapNokta(nd.matches && nd.matches('img') ? nd.parentNode || nd : nd); }))).observe(document.body, { childList: true, subtree: true });
  });

  /* ── mürekkep çizimleri ── */
  const d = (N.d = {
    style(c, o = {}) {
      c.strokeStyle = o.color || N.INK; c.lineWidth = o.w || 3; c.setLineDash(o.dash || []);
      c.globalAlpha = o.alpha == null ? 1 : o.alpha;
    },
    end(c) { c.setLineDash([]); c.globalAlpha = 1; },
    seg(c, a, b, o = {}) {
      const t = o.t == null ? 1 : o.t, e = g.lerp(a, b, t);
      d.style(c, o); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(e.x, e.y); c.stroke(); d.end(c);
      if (ghostOk(o)) ghostSeg(c, a, e, o);
    },
    arrow(c, at, dir, o = {}) {
      const s = o.size || 13, u = g.unit(dir), n = { x: -u.y, y: u.x };
      const p1 = g.add(g.sub(at, g.mul(u, s)), g.mul(n, s * .55)), p2 = g.sub(g.sub(at, g.mul(u, s)), g.mul(n, s * .55));
      d.style(c, { ...o, dash: [] }); c.beginPath(); c.moveTo(p1.x, p1.y); c.lineTo(at.x, at.y); c.lineTo(p2.x, p2.y); c.stroke(); d.end(c);
    },
    /** a'dan b'ye ışın: b'nin ötesine ext kadar uzar, ucunda ok */
    ray(c, a, b, o = {}) {
      const u = g.unit(g.sub(b, a)), L = g.dist(a, b) + (o.ext == null ? 70 : o.ext), e = g.add(a, g.mul(u, L * (o.t == null ? 1 : o.t)));
      d.seg(c, a, e, o); if ((o.t == null || o.t > .98) && !o.noArrow) d.arrow(c, e, u, o);
    },
    /** a ve b'den geçen doğru: iki yana ext kadar uzar, iki ucunda ok */
    line(c, a, b, o = {}) {
      const u = g.unit(g.sub(b, a)), ext = o.ext == null ? 70 : o.ext, t = o.t == null ? 1 : o.t;
      const m = g.lerp(a, b, .5), h = g.dist(a, b) / 2 + ext;
      const p = g.sub(m, g.mul(u, h * t)), q = g.add(m, g.mul(u, h * t));
      d.seg(c, p, q, o); if (t > .98 && !o.noArrow) { d.arrow(c, q, u, o); d.arrow(c, p, g.mul(u, -1), o); }
    },
    /** tuvalin bir ucundan öbür ucuna doğru (sonsuz doğru izlenimi) */
    fullLine(c, a, b, W, H, o = {}) {
      const u = g.unit(g.sub(b, a)), t1 = g.exitT(a, u, W, H), t0 = g.exitT(a, g.mul(u, -1), W, H);
      d.seg(c, g.sub(a, g.mul(u, t0)), g.add(a, g.mul(u, t1)), o);
    },
    circle(c, p, r, o = {}) {
      const t = o.t == null ? 1 : o.t, s = o.start == null ? 0 : o.start;
      d.style(c, o); c.beginPath(); c.arc(p.x, p.y, Math.max(0, r), -s, -s - t * Math.PI * 2, true);
      if (o.fill) { c.fillStyle = o.fill; c.fill(); }
      if (!o.noStroke) c.stroke(); d.end(c);
      if (!o.noStroke && ghostOk(o) && r > 8) { const dr = (N.nz(p.x * .3 + p.y * .7 + r) - .5) * 3, ox = (N.nz(p.y + r) - .5) * 1.6; ghostStyle(c, o); c.beginPath(); c.arc(p.x + ox, p.y - ox * .6, r + dr, -s - .35, -s - .35 - Math.min(t * Math.PI * 2, Math.PI * 2 - .2), true); c.stroke(); c.globalAlpha = 1; }
    },
    dot(c, p, o = {}) {
      c.beginPath(); c.arc(p.x, p.y, o.r || 5.5, 0, Math.PI * 2); c.fillStyle = o.color || N.INK; c.fill();
      if (o.ring) { c.lineWidth = 2.5; c.strokeStyle = o.ring; c.beginPath(); c.arc(p.x, p.y, (o.r || 5.5) + 7, 0, Math.PI * 2); c.stroke(); }
      if (o.label) d.text(c, o.label, p.x + (o.lx == null ? 12 : o.lx), p.y + (o.ly == null ? -12 : o.ly), { size: o.size || 30, color: o.lcolor || o.color || N.INK });
    },
    text(c, s, x, y, o = {}) {
      c.font = `${o.weight || 400} ${o.size || 26}px ${o.font || N.BRUSH}`; c.textAlign = o.align || 'center'; c.textBaseline = o.base || 'middle';
      if (o.halo !== false) { c.lineWidth = o.haloW || 6; c.strokeStyle = o.haloColor || 'rgba(255,250,240,.92)'; c.lineJoin = 'round'; c.strokeText(s, x, y); }
      c.fillStyle = o.color || N.INK; c.fillText(s, x, y);
    },
    /** v köşesinde a1'den a2'ye (matematik yönü, radyan) açı yayı */
    arc(c, v, a1, a2, r, o = {}) {
      let sweep = a2 - a1; while (sweep < 0) sweep += Math.PI * 2; while (sweep > Math.PI * 2) sweep -= Math.PI * 2;
      if (o.fill) { c.beginPath(); c.moveTo(v.x, v.y); c.arc(v.x, v.y, r, -a1, -a1 - sweep, true); c.closePath(); c.fillStyle = o.fill; c.fill(); }
      d.style(c, { color: N.AMBER, w: 3, ...o }); c.beginPath(); c.arc(v.x, v.y, r, -a1, -a1 - sweep, true); c.stroke(); d.end(c);
    },
    /** v köşesinde u ve w yönleri arasında dik açı işareti */
    right(c, v, u, w, s = 18, o = {}) {
      u = g.unit(u); w = g.unit(w);
      const p1 = g.add(v, g.mul(u, s)), p2 = g.add(p1, g.mul(w, s)), p3 = g.add(v, g.mul(w, s));
      d.style(c, { color: N.AMBER, w: 2.5, ...o }); c.beginPath(); c.moveTo(p1.x, p1.y); c.lineTo(p2.x, p2.y); c.lineTo(p3.x, p3.y); c.stroke(); d.end(c);
    },
    poly(c, pts, o = {}) {
      if (!pts.length) return;
      c.beginPath(); c.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y); if (o.open !== true) c.closePath();
      if (o.fill) { c.fillStyle = o.fill; c.fill(); }
      if (!o.noStroke) { d.style(c, o); c.stroke(); d.end(c); }
      if (!o.noStroke && ghostOk(o)) { const n = pts.length - (o.open === true ? 1 : 0); for (let i = 0; i < n; i++) ghostSeg(c, pts[i], pts[(i + 1) % pts.length], o); }
    },
    /** kenar üzerine eşlik çentikleri (n adet) */
    ticks(c, a, b, n, o = {}) {
      const m = g.lerp(a, b, .5), u = g.unit(g.sub(b, a)), nn = { x: -u.y, y: u.x }, s = o.size || 9, gap = 7;
      d.style(c, { color: N.DEEP, w: 2.5, ...o });
      for (let i = 0; i < n; i++) {
        const cpt = g.add(m, g.mul(u, (i - (n - 1) / 2) * gap));
        c.beginPath(); c.moveTo(cpt.x - nn.x * s, cpt.y - nn.y * s); c.lineTo(cpt.x + nn.x * s, cpt.y + nn.y * s); c.stroke();
      }
      d.end(c);
    },
    grid(c, W, H, step, o = {}) {
      c.strokeStyle = o.color || 'rgba(23,20,17,.07)'; c.lineWidth = 1; c.beginPath();
      for (let x = (o.ox || 0) % step; x <= W; x += step) { c.moveTo(x, 0); c.lineTo(x, H); }
      for (let y = (o.oy || 0) % step; y <= H; y += step) { c.moveTo(0, y); c.lineTo(W, y); }
      c.stroke();
    },
  });

  /* ── Nokta konuşuyor ── */
  N.say = (html, mood) => {
    const p = $('#say'), img = $('#noktaImg'); if (!p) return;
    p.innerHTML = html; p.classList.remove('pop'); void p.offsetWidth; p.classList.add('pop');
    if (img) { img.classList.remove('hop', 'shake'); void img.offsetWidth; if (mood === 'good') img.classList.add('hop'); if (mood === 'bad') img.classList.add('shake'); }
  };
  N.panel = (html) => { const el = $('#panel'); el.innerHTML = html; return el; };
  /** seçenek düğmeleri: options [{t, ok, why}] → onPick(option, button, ilkDeneme) */
  N.choices = (host, options, onPick, cls = '') => {
    const box = document.createElement('div'); box.className = 'choices ' + cls; let tries = 0;
    options.forEach((o) => {
      const b = document.createElement('button'); b.className = 'choice'; b.type = 'button'; b.innerHTML = o.t;
      b.addEventListener('click', () => {
        if (b.disabled) return; tries++;
        const first = tries === 1;
        if (o.ok) { b.classList.add('ok'); box.querySelectorAll('.choice').forEach((x) => { x.disabled = true; if (x !== b) x.classList.add('dim'); }); }
        else { b.classList.add('no'); b.disabled = true; }
        onPick(o, b, first);
      });
      box.appendChild(b);
    });
    host.appendChild(box); return box;
  };

  /* ── ses ── */
  let ac = null, muted = false;
  try { muted = localStorage.getItem('nokta-ses') === 'kapali'; } catch (_) {}
  const tone = (f, t0, dur, type = 'sine', vol = .1) => {
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const t = ac.currentTime + t0, o = ac.createOscillator(), gn = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); gn.gain.setValueAtTime(0.0001, t);
      gn.gain.exponentialRampToValueAtTime(vol, t + .015); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(gn).connect(ac.destination); o.start(t); o.stop(t + dur + .05);
    } catch (_) {}
  };
  N.sfx = {
    good() { tone(660, 0, .14); tone(990, .08, .2); },
    bad() { tone(200, 0, .22, 'triangle', .12); tone(160, .1, .25, 'triangle', .1); },
    tick() { tone(1500, 0, .035, 'square', .025); },
    snap() { tone(880, 0, .06, 'triangle', .07); },
    draw() { tone(420, 0, .25, 'sine', .04); },
    win() { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * .1, .28, 'triangle', .09)); },
  };

  /* ── puan, ilerleme ── */
  N.score = 0; N.max = 0;
  N.addScore = (n, at, bad) => {
    N.score = Math.max(0, N.score + n);
    const el = $('#score'); if (el) { el.textContent = N.score; el.classList.remove('bump'); void el.offsetWidth; if (n > 0) el.classList.add('bump'); }
    if (at && N.stage) N.float((n > 0 ? '+' : '') + n, at, bad || n < 0);
  };
  N.float = (txt, at, bad) => {
    const fx = $('.board .fx'); if (!fx || !N.stage) return;
    const p = N.stage.toCss(at), s = document.createElement('span');
    s.className = 'float' + (bad ? ' bad' : ''); s.textContent = txt; s.style.left = p.x + 'px'; s.style.top = p.y + 'px';
    fx.appendChild(s); setTimeout(() => s.remove(), 1300);
  };
  N.dots = (n, i) => {
    const el = $('#dots'); if (!el) return;
    el.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k < i ? 'on' : k === i ? 'now' : ''}"></i>`).join('');
    el.setAttribute('aria-label', `${n} turdan ${Math.min(i + 1, n)}.`);
  };

  /* ── mürekkep sıçraması (kutlama) ── */
  N.splash = (at) => {
    if (N.reduced || !N.stage) return;
    const fx = $('.board .fx'); if (!fx) return;
    const p = at ? N.stage.toCss(at) : { x: fx.clientWidth / 2, y: fx.clientHeight / 2 };
    for (let i = 0; i < 22; i++) {
      const s = document.createElement('i'), a = Math.random() * Math.PI * 2, r = 40 + Math.random() * 120, z = 5 + Math.random() * 9;
      s.style.cssText = `position:absolute;left:${p.x}px;top:${p.y}px;width:${z}px;height:${z}px;border-radius:50%;background:${i % 3 ? N.AMBER : N.INK};transform:translate(-50%,-50%);transition:transform .9s cubic-bezier(.2,.8,.2,1),opacity .9s ease-in;opacity:1`;
      fx.appendChild(s);
      requestAnimationFrame(() => requestAnimationFrame(() => { s.style.transform = `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r + 30}px)) scale(.4)`; s.style.opacity = '0'; }));
      setTimeout(() => s.remove(), 1000);
    }
  };

  /* ── kayıt ── */
  const KEY = 'nokta-oyunlari';
  N.load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; } };
  N.save = (id, rec) => {
    try { const all = N.load(), old = all[id] || {}; all[id] = { stars: Math.max(old.stars || 0, rec.stars), score: Math.max(old.score || 0, rec.score), at: Date.now() }; localStorage.setItem(KEY, JSON.stringify(all)); } catch (_) {}
  };
  const STAR = (on) => `<svg viewBox="0 0 48 48" class="${on ? 'got' : ''}" aria-hidden="true"><path d="M24 4 L29.6 17.2 L44 18.4 L33 27.8 L36.4 42 L24 34.4 L11.6 42 L15 27.8 L4 18.4 L18.4 17.2 Z" fill="${on ? N.AMBER : 'none'}" stroke="${on ? N.DEEP : 'rgba(23,20,17,.3)'}" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  N.starSvg = STAR;

  /** oyun sonu: yıldız = puan oranına göre */
  N.finish = ({ id, title = 'Harika!', text = '', film }) => {
    const ratio = N.max ? N.score / N.max : 1, stars = ratio >= .85 ? 3 : ratio >= .55 ? 2 : 1;
    N.save(id, { stars, score: N.score });
    N.sfx.win(); N.splash();
    let dlg = $('dialog.end');
    if (!dlg) { dlg = document.createElement('dialog'); dlg.className = 'end'; document.body.appendChild(dlg); }
    dlg.innerHTML = `<div class="end-card">
      <img src="../img/nokta.png" alt="Nokta seviniyor">
      <h2>${title}</h2>
      <div class="stars">${[0, 1, 2].map((i) => STAR(i < stars).replace('class="got"', `class="got" style="animation-delay:${.25 + i * .25}s"`)).join('')}</div>
      <p><b style="font-family:var(--brush);font-size:30px;font-weight:400;color:var(--ink)">${N.score}</b> / ${N.max} puan</p>
      <p>${text}</p>
      <div class="row">
        <button class="btn primary" data-again>↺ Yeniden oyna</button>
        <a class="btn" href="../index.html">Tüm oyunlar</a>
        ${film ? `<a class="btn" href="https://hakanatas.github.io/nokta-filmleri/#${film}" target="_blank" rel="noopener">Filmi izle ↗</a>` : ''}
      </div></div>`;
    dlg.querySelector('[data-again]').onclick = () => location.reload();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  };

  /* ── sayfa iskeleti: ses düğmesi ── */
  document.addEventListener('DOMContentLoaded', () => {
    const m = $('#mute'); if (!m) return;
    const set = () => { m.textContent = muted ? 'ses: kapalı' : 'ses: açık'; m.setAttribute('aria-pressed', String(!muted)); };
    set();
    m.addEventListener('click', () => { muted = !muted; try { localStorage.setItem('nokta-ses', muted ? 'kapali' : 'acik'); } catch (_) {} set(); if (!muted) N.sfx.good(); });
  });

  /** Türkçe yazımla sayı (ondalık virgül) */
  N.fmt = (x, k = 1) => (Math.round(x * 10 ** k) / 10 ** k).toString().replace('.', ',');
  /** Türkçe ondalık girişini okur */
  N.num = (s) => { const v = parseFloat(String(s).trim().replace(',', '.').replace('°', '')); return Number.isFinite(v) ? v : null; };
})();
