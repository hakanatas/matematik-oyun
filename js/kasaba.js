/* Nokta'nın Kasabası · geometri gözlem ortamı.
   Metinler js/kasaba-metinleri.js içindeki KASABA_METINLERI nesnesindedir. */
(() => {
  const { g, d } = N;
  const T = KASABA_METINLERI, STS = T.istasyonlar;
  const WH = 760, GROUND = 600, WW = 7800, WMIN = -1500, FX = 4800;
  const LAMPS = [-300, 470, 1120, 1480, 2240, 3200, 4180, 5030, 5600, 6560, 7330];
  const $ = (s) => document.querySelector(s);
  const KEY = 'nokta-kasaba';
  { const mb = $('#menuBtn'), tr = $('#toolsR'); if (mb) { mb.onclick = () => { const o = tr.classList.toggle('open'); mb.setAttribute('aria-expanded', String(o)); mb.textContent = o ? '× kapat' : '☰ menü'; }; tr.addEventListener('click', (e) => { if (e.target !== mb && e.target.closest('button') && innerWidth <= 700) { tr.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.textContent = '☰ menü'; } }); } }

  /* ══════════ durum ══════════ */
  const save0 = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; } })();
  const st = {
    cur: 0, hava: save0.hava || 'sabah', t: 0,
    done: save0.done || {}, // 'saat.uc': true
    sence: save0.sence || {}, // saat: 1
    log: save0.log || {}, // saat: [..]
    son: save0.son || {}, ad: save0.ad || '',
    av: save0.av || {}, cardMin: false, present: false,
  };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify({ hava: st.hava, done: st.done, sence: st.sence, log: st.log, son: st.son, ad: st.ad, av: st.av })); } catch (_) {} };
  const isDone = (sid, tid) => !!st.done[sid + '.' + tid];
  const stationDone = (S) => S.gorevler.every((t) => isDone(S.id, t.id));
  function markDone(sid, tid) {
    if (isDone(sid, tid)) return;
    st.done[sid + '.' + tid] = true; persist(); N.sfx.good(); nokta.happyUntil = st.t + 2.5;
    const S = STS.find((x) => x.id === sid), task = S.gorevler.find((x) => x.id === tid);
    toast(`Görev tamam: <b>${task.metin}</b>`);
    renderCard(); renderStations(); if (zoomOpen) renderZSide();
    if (stationDone(S)) setTimeout(() => { toast(`<b>${S.ad}</b> tamamlandı! Açıklamayı oku ya da sonraki noktaya geç.`); N.sfx.win(); }, 900);
  }
  function addLog(sid, line) { const L = (st.log[sid] = st.log[sid] || []); if (!L.includes(line)) { L.push(line); persist(); } }
  let toastT; function toast(html) { const el = $('#toast'); el.innerHTML = html; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 3200); }

  /* ══════════ dünya tuvali ══════════ */
  const cv = $('#world'), ctx = cv.getContext('2d');
  let dpr = 1, s = 1, vw = 1000;
  const cam = { x: STS[0].x, tx: STS[0].x };
  const nokta = { x: STS[0].x + STS[0].nx, tx: STS[0].x + STS[0].nx, hop: 0 };
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    s = innerHeight / WH; vw = innerWidth / s;
  }
  addEventListener('resize', resize); resize();
  const clampCam = (x) => (vw >= WW - WMIN ? (WW + WMIN) / 2 : Math.max(WMIN + vw / 2, Math.min(WW - vw / 2, x)));
  function focusX(i) { const off = innerWidth > 900 ? (Math.min(410, innerWidth * .4) / 2 + 20) / s : 0; return clampCam(STS[i].x - off); }
  const layer = (p) => ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (innerWidth / 2 - cam.x * p * s), 0);
  const toWorld = (cx, cy) => ({ x: (cx - innerWidth / 2) / s + cam.x, y: cy / s });

  const PAL = {
    sabah: { sky: ['#efe4cc', '#f8ecd2'], far: 'rgba(23,20,17,.09)', mid: 'rgba(23,20,17,.12)', ground: '#e6d9bd', tint: null },
    aksam: { sky: ['#2c3650', '#7d6f88'], far: 'rgba(15,18,30,.35)', mid: 'rgba(15,18,30,.4)', ground: '#cdbfa3', tint: 'rgba(28,36,66,.42)' },
    yagmur: { sky: ['#bdbbb5', '#dcd7cc'], far: 'rgba(23,20,17,.12)', mid: 'rgba(23,20,17,.14)', ground: '#d7cfbf', tint: 'rgba(70,80,92,.16)' },
  };

  // ── çizim yardımcıları
  const wobble = (x) => Math.sin(x * .013) * 40 + Math.sin(x * .031 + 1) * 18 + Math.sin(x * .007 + 2) * 30;
  function sky() {
    const P = PAL[st.hava]; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gr = ctx.createLinearGradient(0, 0, 0, innerHeight); gr.addColorStop(0, P.sky[0]); gr.addColorStop(1, P.sky[1]);
    ctx.fillStyle = gr; ctx.fillRect(0, 0, innerWidth, innerHeight);
    layer(.05);
    if (st.hava === 'sabah') { const sx = 900, sy = 120; const gl = ctx.createRadialGradient(sx, sy, 10, sx, sy, 130); gl.addColorStop(0, 'rgba(232,163,61,.55)'); gl.addColorStop(1, 'rgba(232,163,61,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(sx, sy, 130, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(sx, sy, 42, 0, 7); ctx.fillStyle = '#ecae4f'; ctx.fill(); }
    if (st.hava === 'aksam') {
      ctx.fillStyle = 'rgba(255,248,230,.85)'; for (let i = 0; i < 60; i++) { const x = (i * 197) % 2200 - 300, y = (i * 83) % 330 + 20, r = (i % 3) * .5 + .8; ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(st.t * .8 + i)); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(980, 110, 34, 0, 7); ctx.fillStyle = '#f3e7c4'; ctx.fill(); ctx.beginPath(); ctx.arc(994, 102, 30, 0, 7); ctx.fillStyle = PAL.aksam.sky[0]; ctx.fill();
    }
    layer(.15);
    const cc = st.hava === 'yagmur' ? 'rgba(120,120,125,.55)' : st.hava === 'aksam' ? 'rgba(90,95,120,.5)' : 'rgba(255,252,244,.9)';
    const n = st.hava === 'yagmur' ? 18 : 9;
    for (let i = 0; i < n; i++) { const x = ((i * 430 + st.t * (8 + i % 3 * 4)) % 3000) - 1100, y = 60 + (i * 47) % 140; cloud(x, y, .8 + (i % 3) * .3, cc); }
  }
  function cloud(x, y, k, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.beginPath();
    ctx.arc(0, 0, 24, Math.PI * .9, Math.PI * 1.95); ctx.arc(34, -12, 30, Math.PI * 1.05, Math.PI * 1.9); ctx.arc(70, 0, 22, Math.PI * 1.2, Math.PI * .1); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(23,20,17,.18)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }
  const toLayer = (cx, cy, p) => ({ x: (cx - innerWidth / 2) / s + cam.x * p, y: cy / s });

  /* ── uzak katman: tepeler, cami, yel değirmeni ── */
  function farLayer() {
    layer(.3); const P = PAL[st.hava];
    ctx.beginPath(); ctx.moveTo(-1300, WH);
    for (let x = -1300; x <= 3600; x += 20) ctx.lineTo(x, 420 - wobble(x) * .9 - 30);
    ctx.lineTo(3600, WH); ctx.closePath(); ctx.fillStyle = P.far; ctx.fill();
    const cx = 760, by = 420 - wobble(760) * .9 - 30;
    ctx.fillStyle = P.far;
    ctx.fillRect(cx - 70, by - 50, 140, 50); ctx.beginPath(); ctx.arc(cx, by - 50, 52, Math.PI, 0); ctx.fill();
    [cx - 92, cx + 92].forEach((mx) => { ctx.fillRect(mx - 6, by - 150, 12, 150); ctx.beginPath(); ctx.moveTo(mx - 8, by - 150); ctx.lineTo(mx, by - 182); ctx.lineTo(mx + 8, by - 150); ctx.fill(); });
    // uzak ağaçlar
    for (let i = 0; i < 47; i++) { const x = -1300 + i * 105 + (i % 4) * 17, y = 420 - wobble(x) * .9 - 26; ctx.beginPath(); ctx.arc(x, y - 14, 13 + (i % 3) * 4, 0, 7); ctx.fill(); }
    // yel değirmeni: kanatlar hep dik açıyla
    const wx = 1460, wy = 420 - wobble(1460) * .9 - 30;
    ctx.fillStyle = P.mid; ctx.beginPath(); ctx.moveTo(wx - 20, wy + 4); ctx.lineTo(wx - 11, wy - 92); ctx.lineTo(wx + 11, wy - 92); ctx.lineTo(wx + 20, wy + 4); ctx.fill();
    ctx.save(); ctx.translate(wx, wy - 92); ctx.rotate(st.t * .6);
    for (let k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); ctx.fillRect(-2, 0, 4, 70); ctx.fillRect(2, 18, 13, 50); }
    ctx.restore(); ctx.beginPath(); ctx.arc(wx, wy - 92, 6, 0, 7); ctx.fill();
  }
  function balloon() {
    if (st.hava === 'yagmur') return;
    layer(.1); const x = ((st.t * 7) % 2000) - 400, y = 160 + Math.sin(st.t * .5) * 14;
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.clip();
    for (let k = -3; k <= 3; k++) { ctx.fillStyle = k % 2 ? N.AMBER : N.SEAL; ctx.fillRect(x + k * 11 - 5.5, y - 40, 11, 80); }
    ctx.restore(); ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 20, y + 27); ctx.lineTo(x - 8, y + 52); ctx.moveTo(x + 20, y + 27); ctx.lineTo(x + 8, y + 52); ctx.stroke();
    ctx.fillStyle = '#9b7653'; ctx.fillRect(x - 9, y + 52, 18, 13); ctx.strokeRect(x - 9, y + 52, 18, 13);
  }
  /* kuş sürüsü (V = açı) */
  const birdsAt = () => ({ x: ((st.t * 55) % 2600) - 500, y: 200 + Math.sin(st.t * .3) * 20 });
  function birds() {
    if (st.hava === 'yagmur') return;
    layer(.2); const b = birdsAt(), pts = [{ x: b.x, y: b.y }];
    for (let k = 1; k <= 3; k++) { pts.push({ x: b.x - 30 * k, y: b.y - 17 * k }); pts.push({ x: b.x - 30 * k, y: b.y + 17 * k }); }
    if (st.av.kuslar) { ctx.setLineDash([6, 6]); ctx.strokeStyle = N.AMBER; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(pts[5].x, pts[5].y); ctx.lineTo(b.x, b.y); ctx.lineTo(pts[6].x, pts[6].y); ctx.stroke(); ctx.setLineDash([]); }
    ctx.strokeStyle = st.hava === 'aksam' ? '#e9e2d0' : N.INK; ctx.lineWidth = 2.6;
    pts.forEach((p, i) => { const f = Math.sin(st.t * 9 + i) * 6; ctx.beginPath(); ctx.moveTo(p.x - 11, p.y - 2 + f); ctx.quadraticCurveTo(p.x - 5, p.y - 7 - f * .3, p.x, p.y); ctx.quadraticCurveTo(p.x + 5, p.y - 7 - f * .3, p.x + 11, p.y - 2 + f); ctx.stroke(); });
  }
  function midLayer() {
    layer(.6); const P = PAL[st.hava];
    for (let i = 0; i < 56; i++) {
      const x = -1700 + i * 145 + (i % 3) * 20, w = 90 + (i % 4) * 18, h = 110 + ((i * 37) % 70), base = 560;
      ctx.fillStyle = P.mid; ctx.fillRect(x, base - h, w, h);
      ctx.beginPath(); ctx.moveTo(x - 8, base - h); ctx.lineTo(x + w / 2, base - h - 46 - (i % 2) * 14); ctx.lineTo(x + w + 8, base - h); ctx.fill();
      if (i % 3 === 0) ctx.fillRect(x + w * .7, base - h - 40, 12, 30);
      const lit = st.hava === 'aksam';
      for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) {
        const on = lit && (i + k + j) % 3 && Math.sin(st.t * .2 + i * 3 + k) > -.85;
        ctx.fillStyle = on ? 'rgba(244,190,96,.85)' : lit ? 'rgba(255,240,200,.18)' : 'rgba(255,250,240,.35)';
        ctx.fillRect(x + 16 + j * (w - 48), base - h + 22 + k * 40, 16, 22);
      }
    }
  }

  /* ── el çizimi yardımcıları (deneme: Saat Kulesi çevresinde SK = true) ── */
  let SK = false;
  const nz = (a) => { const v = Math.sin(a * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
  // kenarı alt parçalara böl, sabit (titremeyen) sapma ekle, köşelerde biraz taşır
  function sketchEdge(a, b, amp, seed, ov) {
    const L = Math.hypot(b.x - a.x, b.y - a.y) || 1, ux = (b.x - a.x) / L, uy = (b.y - a.y) / L, n = Math.max(2, Math.round(L / 26));
    const A = { x: a.x - ux * ov, y: a.y - uy * ov }, B = { x: b.x + ux * ov, y: b.y + uy * ov };
    ctx.moveTo(A.x, A.y); let px = A.x, py = A.y;
    for (let k = 1; k <= n; k++) {
      const t = k / n, j = k === n ? 0 : (nz(a.x * .31 + a.y * .57 + b.x * .13 + k * 3.7 + seed) - .5) * 2 * amp;
      const x = A.x + (B.x - A.x) * t - uy * j, y = A.y + (B.y - A.y) * t + ux * j;
      ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2); px = x; py = y;
    }
    ctx.lineTo(B.x, B.y);
  }
  function inkPoly(pts, o = {}) {
    const closed = o.closed !== false, w = o.w || 3, col = o.color || N.INK;
    if (o.fill) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.noStroke) return;
    const edges = []; for (let i = 0; i < pts.length - (closed ? 0 : 1); i++) edges.push([pts[i], pts[(i + 1) % pts.length]]);
    ctx.lineCap = 'round'; ctx.strokeStyle = col;
    if (!SK) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); if (closed) ctx.closePath(); ctx.lineWidth = w; ctx.stroke(); ctx.lineCap = 'butt'; return; }
    const amp = o.amp ?? 1.4;
    ctx.beginPath(); edges.forEach(([a, b], i) => sketchEdge(a, b, amp, i, 1.5)); ctx.lineWidth = w; ctx.stroke();
    ctx.globalAlpha = .35; ctx.beginPath(); edges.forEach(([a, b], i) => sketchEdge(a, b, amp * 1.4, i + 17, 3)); ctx.lineWidth = w * .45; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }
  const rectPts = (x, y, w, h) => [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  function inkLine(a, b, w = 3, col = N.INK) { inkPoly([a, b], { closed: false, w, color: col }); }
  function inkCircle(cx, cy, r, o = {}) {
    if (o.fill) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.noStroke) return;
    ctx.strokeStyle = o.color || N.INK; ctx.lineWidth = o.w || 3;
    if (!SK) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); return; }
    ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) {
      const a0 = nz(cx + pass * 5) * 6, n = Math.max(14, Math.round(r / 3)), sweep = Math.PI * 2 + (pass ? .5 : .3);
      ctx.beginPath();
      for (let k = 0; k <= n; k++) { const a = a0 + sweep * k / n, rr = r + (nz(cx * .7 + cy * .3 + k * 1.9 + pass * 11) - .5) * (o.amp ?? 1.6) * (pass ? 2 : 1.2); const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.globalAlpha = pass ? .35 : 1; ctx.lineWidth = (o.w || 3) * (pass ? .45 : 1); ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.lineCap = 'butt';
  }
  // şekle kırpılmış eğik tarama (gölge tarafı)
  function hatch(pts, o = {}) {
    if (!SK) return;
    const gap = o.gap || 7, xs = pts.map((p) => p.x), ys = pts.map((p) => p.y), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), H = y1 - y0;
    ctx.save(); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.clip();
    ctx.strokeStyle = o.color || `rgba(23,20,17,${o.alpha ?? .2})`; ctx.lineWidth = o.w || 1.3; ctx.lineCap = 'round'; ctx.beginPath();
    for (let x = x0 - H, i = 0; x < x1 + 4; x += gap, i++) { const j = (nz(x * .1 + i) - .5) * 3; ctx.moveTo(x + j, y1 + 2); ctx.lineTo(x + H + j + 2, y0 - 2); }
    ctx.stroke(); ctx.restore(); ctx.lineCap = 'butt';
  }
  // yere düşen yumuşak gölge (ışık soldan, gölge sağa uzanır)
  function groundShadow(cx, w, k = 1) {
    if (!SK) return;
    const sx = cx + w * .18, a = st.hava === 'aksam' ? .1 : st.hava === 'yagmur' ? .12 : .2;
    const gr = ctx.createRadialGradient(sx, GROUND + 2, 2, sx, GROUND + 2, w * .7);
    gr.addColorStop(0, `rgba(40,30,20,${a * k})`); gr.addColorStop(1, 'rgba(40,30,20,0)');
    ctx.save(); ctx.translate(sx, GROUND + 2); ctx.scale(1, .16); ctx.translate(-sx, -(GROUND + 2)); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(sx, GROUND + 2, w * .7, 0, 7); ctx.fill(); ctx.restore();
  }

  /* ── ana katman nesneleri ── */
  function inkRect(x, y, w, h, fill, lw = 3) { inkPoly(rectPts(x, y, w, h), { fill, w: lw }); }
  function smoke(x, y) {
    for (let k = 0; k < 5; k++) { const ph = (st.t * .3 + k / 5) % 1; ctx.beginPath(); ctx.arc(x + ph * 26 + Math.sin(st.t + k) * 4, y - ph * 90, 6 + ph * 14, 0, 7); ctx.fillStyle = `rgba(${st.hava === 'aksam' ? '200,200,215' : '120,110,100'},${.32 * (1 - ph)})`; ctx.fill(); }
  }
  function house(x, w, h, roof, opts = {}) {
    const top = GROUND - h, rh = opts.rh || 70, lit = st.hava === 'aksam', wall = opts.wall || '#f6ecd8';
    groundShadow(x + w / 2, w * 1.3);
    if (opts.chimney != null) { const cx = x + opts.chimney; inkRect(cx, top - rh * .62, 18, rh * .45, '#b65a3f'); hatch(rectPts(cx + 10, top - rh * .62, 8, rh * .45), { gap: 4, alpha: .3 }); if (SK) inkRect(cx - 3, top - rh * .62 - 6, 24, 7, '#9a4a33', 2.5); smoke(cx + 9, top - rh * .62 - 6); }
    inkRect(x, top, w, h, wall);
    if (SK) {
      // sıva lekeleri, saçak altı gölgesi, sağ köşe gölgesi
      ctx.strokeStyle = 'rgba(120,90,60,.18)'; ctx.lineWidth = 1.3; ctx.beginPath();
      for (let i = 0; i < Math.round(w * h / 2600); i++) { const px = x + 8 + nz(x + i * 7.1) * (w - 16), py = top + 14 + nz(x * .3 + i * 3.3) * (h - 30); ctx.moveTo(px, py); ctx.lineTo(px + 6 + nz(i) * 6, py - 1); }
      ctx.stroke();
      ctx.fillStyle = 'rgba(60,40,25,.16)'; ctx.fillRect(x + 1.5, top + 1.5, w - 3, 9);
      hatch(rectPts(x + w * .8, top + 10, w * .2 - 1.5, h - 11), { gap: 6, alpha: .16 });
    }
    const roofPts = [{ x: x - 14, y: top }, { x: x + w / 2, y: top - rh }, { x: x + w + 14, y: top }];
    ctx.beginPath(); roofPts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath();
    ctx.fillStyle = roof; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(23,20,17,.22)'; ctx.lineWidth = 1.5;
    for (let yy = top - rh + 14; yy < top; yy += 13) { ctx.beginPath(); for (let xx = x - 20 + ((yy / 13) % 2) * 8; xx < x + w + 20; xx += 16) { ctx.moveTo(xx, yy); ctx.arc(xx + 8, yy, 8, Math.PI, 0); } ctx.stroke(); }
    ctx.restore();
    hatch([{ x: x + w / 2, y: top - rh }, { x: x + w + 14, y: top }, { x: x + w / 2, y: top }], { gap: 6, alpha: .2 });
    inkPoly(roofPts, { w: 3 });
    if (SK) inkLine({ x: x - 18, y: top + 1 }, { x: x + w + 18, y: top + 1 }, 4);
    const win = (wx, wy, ww, wh) => {
      const on = lit && Math.sin(st.t * .15 + wx * .7) > -.6;
      if (SK) { ctx.fillStyle = 'rgba(60,40,25,.18)'; ctx.fillRect(wx + 3, wy + 3, ww, wh); }
      inkRect(wx, wy, ww, wh, on ? '#f5c06a' : lit ? '#55607a' : '#d7e1e4', 2.5);
      if (SK) {
        ctx.fillStyle = on ? 'rgba(180,100,30,.25)' : 'rgba(23,20,17,.14)'; ctx.fillRect(wx + 1.5, wy + 1.5, ww - 3, 6);
        if (!lit) { ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wx + 5, wy + wh - 6); ctx.lineTo(wx + 11, wy + wh / 2 + 2); ctx.moveTo(wx + ww / 2 + 4, wy + 10); ctx.lineTo(wx + ww / 2 + 8, wy + 5); ctx.stroke(); }
      }
      ctx.strokeStyle = N.INK; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.lineWidth = 1.5; ctx.stroke();
      if (SK && !opts.box) inkRect(wx - 4, wy + wh, ww + 8, 5, '#e3d3b4', 2);
      if (opts.shutters) [wx - 12, wx + ww].forEach((sx) => { inkRect(sx, wy, 12, wh, opts.shutters, 2.5); if (SK) { ctx.strokeStyle = 'rgba(23,20,17,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let ly = wy + 5; ly < wy + wh - 2; ly += 5) { ctx.moveTo(sx + 2, ly); ctx.lineTo(sx + 10, ly + 2); } ctx.stroke(); } });
      if (opts.box) { inkRect(wx - 4, wy + wh, ww + 8, 8, '#9b7653', 2.5); for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.arc(wx + 3 + f * (ww / 3), wy + wh - 2 + Math.sin(st.t * 2 + f + wx) * .8, 4, 0, 7); ctx.fillStyle = f % 2 ? N.SEAL : N.AMBER; ctx.fill(); if (SK) { ctx.strokeStyle = N.INK; ctx.lineWidth = 1.2; ctx.stroke(); } } }
    };
    const rows = Math.max(1, Math.floor((h - 70) / 60));
    for (let r = 0; r < rows; r++) { if (opts.bay && r === rows - 1 && rows > 1) continue; win(x + 18, top + 22 + r * 60, 30, 34); if (w > 110) win(x + w - 48, top + 22 + r * 60, 30, 34); }
    if (opts.bay) { // cumba
      const by = top + 18, bw = w + 24; inkRect(x - 12, by, bw, 64, wall); hatch(rectPts(x - 12 + bw * .82, by, bw * .18, 64), { gap: 6, alpha: .16 }); inkRect(x - 16, by + 64, bw + 8, 8, '#9b7653', 3);
      for (let k = 0; k < 3; k++) win(x - 2 + k * (bw - 20) / 3, by + 12, 30, 40);
      [0, 1, 2].forEach((k) => inkLine({ x: x - 6 + k * bw / 2.6, y: by + 72 }, { x: x + 6 + k * bw / 2.6, y: by + 92 }, 2.5));
    }
    const dx = x + w / 2 - 20;
    if (SK) { inkRect(dx - 6, GROUND - 6, 52, 6, '#cbbd9f', 2); ctx.fillStyle = 'rgba(60,40,25,.2)'; ctx.fillRect(dx + 2, GROUND - 60, 40, 8); }
    inkRect(dx, GROUND - 62, 40, 62, '#7b5a3c', 2.5);
    if (SK) { ctx.strokeStyle = 'rgba(23,20,17,.45)'; ctx.lineWidth = 1.5; ctx.strokeRect(dx + 6, GROUND - 55, 12, 22); ctx.strokeRect(dx + 22, GROUND - 55, 12, 22); ctx.strokeRect(dx + 6, GROUND - 28, 28, 18); }
    ctx.beginPath(); ctx.arc(dx + 31, GROUND - 30, 2.5, 0, 7); ctx.fillStyle = SK ? N.AMBER : N.INK; ctx.fill();
    if (opts.awning) {
      const ap = [{ x: dx - 26, y: GROUND - 92 }, { x: dx + 66, y: GROUND - 92 }, { x: dx + 76, y: GROUND - 70 }, { x: dx - 36, y: GROUND - 70 }];
      ctx.save(); ctx.beginPath(); ap.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.clip(); for (let k = 0; k < 9; k++) { ctx.fillStyle = k % 2 ? '#fffaf0' : opts.awning; ctx.fillRect(dx - 36 + k * 13, GROUND - 92, 13, 24); } ctx.restore();
      inkPoly(ap, { w: 2.5 });
      if (SK) { ctx.fillStyle = 'rgba(60,40,25,.18)'; ctx.beginPath(); ctx.moveTo(dx - 30, GROUND - 70); ctx.lineTo(dx + 70, GROUND - 70); ctx.lineTo(dx + 60, GROUND - 60); ctx.lineTo(dx - 20, GROUND - 60); ctx.fill(); for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.arc(dx - 30 + k * 12.5, GROUND - 70, 6.2, 0, Math.PI); ctx.fillStyle = k % 2 ? '#fffaf0' : opts.awning; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.stroke(); } }
    }
    if (opts.sign) opts.sign();
  }
  function tree(x, k = 1) {
    const aks = st.hava === 'aksam';
    groundShadow(x, 110 * k);
    if (SK) {
      const tp = [{ x: x - 9 * k, y: GROUND }, { x: x - 5 * k, y: GROUND - 96 * k }, { x: x + 5 * k, y: GROUND - 96 * k }, { x: x + 9 * k, y: GROUND }];
      inkPoly(tp, { fill: '#6b4f35', w: 2.5 }); hatch([tp[1], tp[2], tp[3], { x, y: GROUND }], { gap: 4, alpha: .3 });
      ctx.strokeStyle = 'rgba(23,20,17,.4)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i < 4; i++) { const yy = GROUND - 18 * k - i * 20 * k; ctx.moveTo(x - 4 * k, yy); ctx.quadraticCurveTo(x, yy - 6, x - 1, yy - 12 * k); } ctx.stroke();
      inkLine({ x, y: GROUND - 70 * k }, { x: x + 24 * k, y: GROUND - 100 * k }, 4 * k); inkLine({ x: x - 1, y: GROUND - 80 * k }, { x: x - 22 * k, y: GROUND - 106 * k }, 3.5 * k);
    } else { ctx.fillStyle = '#6b4f35'; ctx.fillRect(x - 7 * k, GROUND - 90 * k, 14 * k, 90 * k); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.strokeRect(x - 7 * k, GROUND - 90 * k, 14 * k, 90 * k); }
    const sway = Math.sin(st.t * 1.2 + x) * 2.5;
    [[0, -120, 46], [-34, -98, 34], [34, -100, 36], [0, -158, 34]].forEach(([dx, dy, r], i) => {
      const cx = x + dx * k + sway * (1 + i * .3), cy = GROUND + dy * k, R = r * k, base = aks ? '#4f6150' : i === 3 ? '#9bb383' : '#87a074';
      inkCircle(cx, cy, R, { fill: base, noStroke: true });
      if (SK) {
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
        ctx.beginPath(); ctx.arc(cx + R * .35, cy + R * .45, R * .95, 0, 7); ctx.fillStyle = aks ? 'rgba(20,30,25,.35)' : 'rgba(50,75,45,.35)'; ctx.fill();
        ctx.beginPath(); ctx.arc(cx - R * .38, cy - R * .4, R * .45, 0, 7); ctx.fillStyle = aks ? 'rgba(160,190,150,.12)' : 'rgba(225,240,190,.35)'; ctx.fill();
        ctx.strokeStyle = 'rgba(23,20,17,.28)'; ctx.lineWidth = 1.4; ctx.lineCap = 'round'; ctx.beginPath();
        for (let q = 0; q < 7; q++) { const a = nz(x + i * 9 + q) * 6.28, rr = nz(x * .5 + q * 3 + i) * R * .8, px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr; ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 3, py + 4, px + 7, py + 2); }
        ctx.stroke(); ctx.restore(); ctx.lineCap = 'butt';
      }
      inkCircle(cx, cy, R, { w: 2.5 });
    });
    if (st.hava !== 'yagmur') for (let i = 0; i < 3; i++) { // düşen yapraklar
      const ph = (st.t * .12 + i / 3 + x * .001) % 1, lx = x + Math.sin(st.t * 1.3 + i * 2) * 34 + (i - 1) * 24, ly = GROUND - 150 * k + ph * 150 * k;
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(st.t * 2 + i); ctx.beginPath(); ctx.ellipse(0, 0, 6, 3, 0, 0, 7); ctx.fillStyle = i % 2 ? N.AMBER : '#87a074'; ctx.globalAlpha = 1 - ph * .6; ctx.fill(); if (SK) { ctx.strokeStyle = N.INK; ctx.lineWidth = 1; ctx.stroke(); } ctx.restore(); ctx.globalAlpha = 1;
    }
  }
  function lamp(x) {
    const on = st.hava === 'aksam';
    if (!SK) {
      ctx.strokeStyle = N.INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x, GROUND - 150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 14, GROUND - 150); ctx.lineTo(x + 14, GROUND - 150); ctx.lineTo(x + 9, GROUND - 176); ctx.lineTo(x - 9, GROUND - 176); ctx.closePath();
      ctx.fillStyle = on ? '#ffd27a' : '#f6ecd8'; ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke(); return;
    }
    groundShadow(x, 40);
    inkPoly([{ x: x - 9, y: GROUND }, { x: x - 6, y: GROUND - 14 }, { x: x + 6, y: GROUND - 14 }, { x: x + 9, y: GROUND }], { fill: '#3b3530', w: 2.5 });
    inkLine({ x, y: GROUND - 14 }, { x, y: GROUND - 146 }, 4.5);
    ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, GROUND - 110); ctx.quadraticCurveTo(x + 14, GROUND - 114, x + 12, GROUND - 124); ctx.arc(x + 8, GROUND - 124, 4, 0, Math.PI * 1.4); ctx.stroke();
    inkRect(x - 16, GROUND - 151, 32, 5, '#3b3530', 2.5);
    const lp = [{ x: x - 12, y: GROUND - 151 }, { x: x + 12, y: GROUND - 151 }, { x: x + 9, y: GROUND - 178 }, { x: x - 9, y: GROUND - 178 }];
    inkPoly(lp, { fill: on ? '#ffd27a' : '#e9eef0', w: 2.5 });
    if (!on) { ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 6, GROUND - 156); ctx.lineTo(x - 4, GROUND - 172); ctx.stroke(); }
    inkLine({ x, y: GROUND - 151 }, { x, y: GROUND - 178 }, 1.5);
    inkPoly([{ x: x - 14, y: GROUND - 178 }, { x: x + 14, y: GROUND - 178 }, { x, y: GROUND - 192 }], { fill: '#3b3530', w: 2.5 });
    ctx.beginPath(); ctx.arc(x, GROUND - 195, 3, 0, 7); ctx.fillStyle = N.INK; ctx.fill();
  }
  function lampGlow(x) {
    const gl = ctx.createRadialGradient(x, GROUND - 163, 4, x, GROUND - 163, 120); gl.addColorStop(0, 'rgba(255,200,110,.55)'); gl.addColorStop(1, 'rgba(255,200,110,0)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, GROUND - 163, 120, 0, 7); ctx.fill();
  }
  let bellAmp = 0;
  function clockTower() {
    const x = 650, cl = clock, aks = st.hava === 'aksam';
    groundShadow(x, 230, 1.2);
    // gövde: taş kaide + tuğla duvar + kat silmeleri
    inkRect(x - 62, 170, 124, GROUND - 170, '#efe0c2');
    ctx.save(); ctx.beginPath(); ctx.rect(x - 62, 170, 124, GROUND - 170); ctx.clip();
    for (let y = 196, r = 0; y < GROUND; y += 26, r++) for (let xx = x - 62 + (r % 2) * 20 - 40; xx < x + 62; xx += 40) {
      const tone = nz(xx * .13 + y * .07); if (tone > .72) { ctx.fillStyle = `rgba(184,116,26,${.1 + (tone - .72) * .5})`; ctx.fillRect(xx + 2, y + 2, 36, 22); }
    }
    ctx.strokeStyle = 'rgba(23,20,17,.25)'; ctx.lineWidth = 1.5;
    for (let y = 196, r = 0; y < GROUND; y += 26, r++) { ctx.beginPath(); ctx.moveTo(x - 62, y); ctx.lineTo(x + 62, y + (nz(y) - .5) * 1.5); ctx.stroke(); for (let xx = x - 62 + (r % 2) * 20; xx < x + 62; xx += 40) { ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx + (nz(xx + y) - .5) * 2, y + 26); ctx.stroke(); } }
    ctx.restore();
    hatch(rectPts(x + 34, 172, 27, GROUND - 172), { gap: 6, alpha: .2 });
    ctx.fillStyle = 'rgba(60,40,25,.15)'; ctx.fillRect(x - 60, 172, 120, 10);
    inkRect(x - 72, GROUND - 46, 144, 46, '#d9c7a3', 3); hatch(rectPts(x + 40, GROUND - 46, 32, 46), { gap: 5, alpha: .22 });
    ctx.strokeStyle = 'rgba(23,20,17,.3)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 72, GROUND - 23); ctx.lineTo(x + 72, GROUND - 23); [-48, 0, 48].forEach((o, i) => { ctx.moveTo(x + o, GROUND - 46); ctx.lineTo(x + o, GROUND - 23); ctx.moveTo(x + o - 24, GROUND - 23); ctx.lineTo(x + o - 24, GROUND); }); ctx.stroke();
    [330, 175].forEach((yy) => { inkRect(x - 70, yy - 6, 140, 12, '#d9c7a3', 2.5); ctx.fillStyle = 'rgba(60,40,25,.2)'; ctx.fillRect(x - 62, yy + 6, 124, 6); });
    // çan odası: kemerli açıklık
    inkRect(x - 48, 100, 96, 72, '#e3d2b0', 3);
    ctx.beginPath(); ctx.moveTo(x - 34, 172); ctx.lineTo(x - 34, 128); ctx.arc(x, 128, 34, Math.PI, 0); ctx.lineTo(x + 34, 172); ctx.closePath(); ctx.fillStyle = aks ? '#2a2630' : '#3b3530'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    hatch(rectPts(x + 30, 100, 18, 72), { gap: 5, alpha: .22 });
    const sw = Math.sin(st.t * 7) * .45 * bellAmp; bellAmp *= .985;
    inkLine({ x: x - 34, y: 116 }, { x: x + 34, y: 116 }, 3);
    ctx.save(); ctx.translate(x, 116); ctx.rotate(sw);
    ctx.beginPath(); ctx.moveTo(-16, 40); ctx.quadraticCurveTo(-16, 6, 0, 6); ctx.quadraticCurveTo(16, 6, 16, 40); ctx.lineTo(20, 46); ctx.lineTo(-20, 46); ctx.closePath();
    const bg = ctx.createLinearGradient(-20, 0, 20, 0); bg.addColorStop(0, '#f6c66a'); bg.addColorStop(.45, N.AMBER); bg.addColorStop(1, '#9b5f12'); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,240,200,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-9, 36); ctx.quadraticCurveTo(-10, 16, -3, 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 6); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 48, 4, 0, 7); ctx.fillStyle = N.INK; ctx.fill(); ctx.restore();
    // çatı
    const rp = [{ x: x - 84, y: 104 }, { x, y: 30 }, { x: x + 84, y: 104 }];
    ctx.beginPath(); rp.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.fillStyle = '#c4432b'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(23,20,17,.25)'; ctx.lineWidth = 1.4; for (let yy = 44; yy < 104; yy += 11) { ctx.beginPath(); for (let xx = x - 90 + ((yy / 11) % 2) * 7; xx < x + 90; xx += 14) { ctx.moveTo(xx, yy); ctx.arc(xx + 7, yy, 7, Math.PI, 0); } ctx.stroke(); } ctx.restore();
    hatch([{ x, y: 30 }, { x: x + 84, y: 104 }, { x, y: 104 }], { gap: 6, alpha: .22 });
    inkPoly(rp, { w: 3 }); inkLine({ x: x - 90, y: 104 }, { x: x + 90, y: 104 }, 4.5);
    inkLine({ x, y: 32 }, { x, y: 6 }, 3); ctx.beginPath(); ctx.arc(x, 6, 3.5, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
    const fl = Math.sin(st.t * 5) * 3; ctx.beginPath(); ctx.moveTo(x, 10); ctx.quadraticCurveTo(x + 12, 12 + fl, x + 26, 15 + fl); ctx.quadraticCurveTo(x + 12, 18 + fl * .6, x, 23); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke();
    // saat (yelkovan ve akrep yakın plandaki ayarı gösterir; saniye kolu gerçek zamanla döner)
    const c = { x, y: 250 }, R = 50;
    const rim = ctx.createRadialGradient(c.x - 14, c.y - 18, 10, c.x, c.y, R + 8); rim.addColorStop(0, '#f2d58f'); rim.addColorStop(.75, '#c9973f'); rim.addColorStop(1, '#8c5d17');
    inkCircle(c.x, c.y, R + 7, { fill: rim, w: 3 });
    const face = ctx.createRadialGradient(c.x - 10, c.y - 12, 4, c.x, c.y, R); face.addColorStop(0, '#fffdf6'); face.addColorStop(1, aks ? '#f3d9a0' : '#efe4cc');
    inkCircle(c.x, c.y, R, { fill: face, w: 2.5 });
    ctx.strokeStyle = N.INK;
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, big = i % 5 === 0, r1 = R - 4, r2 = R - (big ? (i % 15 === 0 ? 14 : 10) : 6.5); ctx.beginPath(); ctx.moveTo(c.x + Math.sin(a) * r1, c.y - Math.cos(a) * r1); ctx.lineTo(c.x + Math.sin(a) * r2, c.y - Math.cos(a) * r2); ctx.lineWidth = big ? (i % 15 === 0 ? 3.5 : 2.4) : .9; ctx.stroke(); }
    const hand = (deg, L, w, col, tail) => { const a = g.rad(deg), sx = Math.sin(a), cy2 = Math.cos(a); ctx.beginPath(); ctx.moveTo(c.x - sx * tail, c.y + cy2 * tail); ctx.lineTo(c.x + sx * L, c.y - cy2 * L); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.strokeStyle = col || N.INK; ctx.stroke(); ctx.lineCap = 'butt'; };
    ctx.save(); ctx.translate(2, 3); ctx.globalAlpha = .18; hand(cl.h, 28, 6, '#000', 6); hand(cl.m, 40, 3.5, '#000', 8); ctx.restore();
    hand(cl.h, 28, 6, N.INK, 6); hand(cl.m, 40, 3.5, N.INK, 8); hand((Date.now() / 1000 % 60) * 6, 44, 1.5, N.SEAL, 10);
    ctx.beginPath(); ctx.arc(c.x, c.y, 4.5, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(c.x, c.y, R - 9, 3.6, 4.3); ctx.stroke(); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(c.x, c.y, R - 9, 4.45, 4.6); ctx.stroke(); ctx.lineCap = 'butt';
    // yuvarlak pencere ve kapı
    inkCircle(x, 415, 26, { fill: '#d9c7a3', w: 2.5 });
    inkCircle(x, 415, 20, { fill: aks ? '#f5c06a' : '#d7e1e4', w: 2.5 });
    ctx.beginPath(); ctx.moveTo(x - 20, 415); ctx.lineTo(x + 20, 415); ctx.moveTo(x, 395); ctx.lineTo(x, 435); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.stroke();
    if (!aks) { ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, 415, 14, 3.5, 4.3); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x - 34, GROUND); ctx.lineTo(x - 34, GROUND - 62); ctx.arc(x, GROUND - 62, 34, Math.PI, 0); ctx.lineTo(x + 34, GROUND); ctx.fillStyle = '#d9c7a3'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 26, GROUND); ctx.lineTo(x - 26, GROUND - 60); ctx.arc(x, GROUND - 60, 26, Math.PI, 0); ctx.lineTo(x + 26, GROUND); ctx.fillStyle = '#7b5a3c'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(23,20,17,.35)'; ctx.lineWidth = 1.4; ctx.beginPath(); for (let k = -18; k <= 18; k += 9) { ctx.moveTo(x + k, GROUND); ctx.lineTo(x + k, GROUND - 90); } ctx.stroke(); ctx.fillStyle = 'rgba(23,20,17,.2)'; ctx.fillRect(x - 26, GROUND - 90, 52, 12); ctx.restore();
    ctx.beginPath(); ctx.arc(x + 14, GROUND - 32, 3, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.2; ctx.stroke();
    for (let i = -3; i <= 3; i++) { const a = Math.PI + (i + 3.5) / 7 * Math.PI; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 26, GROUND - 60 + Math.sin(a) * 26); ctx.lineTo(x + Math.cos(a) * 34, GROUND - 60 + Math.sin(a) * 34); ctx.strokeStyle = 'rgba(23,20,17,.45)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    inkPoly([{ x: x - 44, y: GROUND + 1 }, { x: x + 44, y: GROUND + 1 }, { x: x + 52, y: GROUND + 9 }, { x: x - 52, y: GROUND + 9 }], { fill: '#cbbd9f', w: 2.5 });
  }
  function bunting(a, b, sag, n) {
    const P = (t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t + Math.sin(Math.PI * t) * sag });
    ctx.strokeStyle = N.INK; ctx.lineWidth = 1.8; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const p = P(i / 30); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.stroke();
    for (let i = 1; i < n; i++) { const p = P(i / n), q = P((i + .5) / n), w = Math.sin(st.t * 3 + i) * 3; ctx.beginPath(); ctx.moveTo(p.x - 9, p.y); ctx.lineTo(p.x + 9, p.y); ctx.lineTo((p.x + q.x) / 2 * 0 + p.x + w, p.y + 22); ctx.closePath(); ctx.fillStyle = [N.AMBER, N.SEAL, '#fffaf0', '#87a074'][i % 4]; ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  function laundry(a, b) {
    ctx.strokeStyle = N.INK; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 20, b.x, b.y); ctx.stroke();
    [.25, .5, .75].forEach((t, i) => {
      const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t + Math.sin(Math.PI * t) * 10, sw = Math.sin(st.t * 2.2 + i) * .12;
      ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.fillStyle = ['#fffaf0', N.AMBER, '#8fb0bd'][i];
      ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.lineTo(20, 10); ctx.lineTo(12, 12); ctx.lineTo(11, 32); ctx.lineTo(-11, 32); ctx.lineTo(-12, 12); ctx.lineTo(-20, 10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    });
  }
  function trafficLight(x) {
    groundShadow(x, 50); inkLine({ x, y: GROUND }, { x, y: 470 }, 5);
    inkRect(x - 12, 412, 24, 62, '#2f2a26', 2.5); inkRect(x - 15, 406, 30, 7, '#2f2a26', 2);
    const ph = st.t % 9, on = ph < 4 ? 2 : ph < 5 ? 1 : 0;
    ['#c4432b', '#e8a33d', '#6ba05b'].forEach((col, i) => { ctx.beginPath(); ctx.arc(x, 424 + i * 19, 7, 0, 7); ctx.fillStyle = i === on ? col : 'rgba(255,255,255,.12)'; ctx.fill(); if (i === on) { ctx.beginPath(); ctx.arc(x - 2, 422 + i * 19, 2.2, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); } ctx.beginPath(); ctx.moveTo(x - 9, 418 + i * 19); ctx.quadraticCurveTo(x, 413 + i * 19, x + 9, 418 + i * 19); ctx.strokeStyle = '#2f2a26'; ctx.lineWidth = 3; ctx.stroke(); });
    return on;
  }
  function car(x, y, k, col, back, lit) {
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.beginPath(); ctx.ellipse(4, 6, 44, 6, 0, 0, 7); ctx.fillStyle = 'rgba(23,20,17,.18)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(-36, -24); ctx.quadraticCurveTo(-30, -48, 0, -48); ctx.quadraticCurveTo(30, -48, 36, -24); ctx.lineTo(36, 0); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3 / Math.max(.5, k); ctx.stroke();
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(23,20,17,.16)'; ctx.fillRect(14, -50, 30, 52); ctx.restore();
    ctx.fillStyle = lit ? '#f5c06a' : '#d7e1e4'; ctx.fillRect(-24, -42, 48, 16); ctx.strokeRect(-24, -42, 48, 16);
    if (!lit) { ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-18, -29); ctx.lineTo(-12, -39); ctx.moveTo(-8, -29); ctx.lineTo(-4, -35); ctx.stroke(); ctx.strokeStyle = N.INK; }
    ctx.fillStyle = N.INK; ctx.fillRect(-34, -2, 14, 10); ctx.fillRect(20, -2, 14, 10);
    [-24, 24].forEach((lx) => { ctx.beginPath(); ctx.arc(lx, -14, 6, 0, 7); ctx.fillStyle = back ? N.SEAL : (st.hava === 'aksam' ? '#fff3c4' : '#fffaf0'); ctx.fill(); ctx.stroke(); });
    ctx.restore();
  }
  function crossroad() {
    ctx.beginPath(); ctx.moveTo(1600, GROUND); ctx.lineTo(1690, 470); ctx.lineTo(1730, 470); ctx.lineTo(1830, GROUND); ctx.closePath(); ctx.fillStyle = 'rgba(23,20,17,.12)'; ctx.fill();
    ctx.setLineDash([16, 14]); ctx.strokeStyle = 'rgba(255,250,240,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1715, GROUND); ctx.lineTo(1710, 474); ctx.stroke(); ctx.setLineDash([]);
    // yaya geçidi
    for (let k = 0; k < 6; k++) { ctx.fillStyle = 'rgba(255,250,240,.85)'; ctx.fillRect(1612 + k * 36, GROUND + 6, 22, 30); }
    // arabalar: biri uzaklaşır, biri yaklaşır (ışık kırmızıyken yaklaşan bekler)
    const on = trafficLight(1640);
    const cars = [];
    const ph1 = (st.t * .11) % 1; cars.push({ u: ph1, lane: 1, col: N.AMBER, back: true });
    carT += on === 0 && carU > .55 && carU < .62 ? 0 : 1 / 60 * .13; carU = 1 - (carT % 1); cars.push({ u: carU, lane: -1, col: '#5b7a8c', back: false });
    cars.sort((a, b) => b.u - a.u).forEach((C) => { const u = C.u, k = 1 - .82 * u; car(1714 - 4 * u + C.lane * 30 * (1 - u * .85), GROUND + 2 - 130 * u, k, C.col, C.back, st.hava === 'aksam'); });
    // yön tabelası
    groundShadow(1560, 50); inkLine({ x: 1560, y: GROUND }, { x: 1560, y: 420 }, 6);
    const arrowSign = (y, dir, txt, rot) => {
      ctx.save(); ctx.translate(1560, y); ctx.rotate(rot); ctx.beginPath();
      const ap = [{ x: 0, y: -14 }, { x: dir * 92, y: -14 }, { x: dir * 112, y: 0 }, { x: dir * 92, y: 14 }, { x: 0, y: 14 }];
      ctx.fillStyle = 'rgba(60,40,25,.18)'; ctx.fillRect(Math.min(0, dir * 100) + 3, 14, 100, 5);
      inkPoly(ap, { fill: '#f6ecd8', w: 2.5 }); ctx.strokeStyle = N.INK;
      ctx.font = `600 13px ${N.MONO}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, dir * 50, 1); ctx.restore();
    };
    arrowSign(440, 1, 'GÜL SK.', -.12); arrowSign(475, -1, 'ÇINAR SK.', .08);
    // harita panosu
    groundShadow(1840, 190); [1780, 1900].forEach((x) => inkLine({ x, y: GROUND }, { x, y: 420 }, 5));
    ctx.fillStyle = 'rgba(60,40,25,.2)'; ctx.fillRect(1766, 500, 158, 7);
    inkRect(1752, 382, 176, 126, '#9b7653', 3); inkRect(1760, 390, 160, 110, '#fffaf0', 3);
    ctx.save(); ctx.beginPath(); ctx.rect(1762, 392, 156, 106); ctx.clip();
    ctx.fillStyle = '#e4e8d4'; ctx.fillRect(1762, 392, 156, 106);
    const o = { x: 1840, y: 445 };
    const st2 = (deg, col, oo = o) => { const u = g.dir(g.rad(deg)); ctx.strokeStyle = col; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(oo.x - u.x * 120, oo.y - u.y * 120); ctx.lineTo(oo.x + u.x * 120, oo.y + u.y * 120); ctx.stroke(); };
    st2(20, '#cbbd9e'); st2(map.gul, '#cbbd9e'); if (map.laleOn) st2(map.lale, '#cbbd9e', { x: 1840, y: 408 });
    const blink = Math.sin(st.t * 4) > 0; ctx.beginPath(); ctx.arc(o.x, o.y, 5, 0, 7); ctx.fillStyle = blink ? N.SEAL : N.INK; ctx.fill();
    ctx.restore();
    ctx.font = `400 22px ${N.BRUSH}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.fillText('HARİTA', 1840, 380);
  }
  let carT = 0, carU = 1;
  /* güvercinler ve ördekler */
  const PIGEONS = [4610, 4660, 4700, 4930, 4975, 5015].map((x, i) => ({ x, fly: -99, i }));
  function pigeons() {
    PIGEONS.forEach((pg) => {
      if (Math.abs(nokta.x - pg.x) < 110 && st.t - pg.fly > 9) { pg.fly = st.t; }
      const f = (st.t - pg.fly) / 7, flying = f >= 0 && f < 1;
      const x = pg.x + (flying ? Math.sin(f * Math.PI) * 160 * (pg.i % 2 ? 1 : -1) : 0), y = GROUND + 16 - (flying ? Math.sin(f * Math.PI) * 300 : 0);
      ctx.save(); ctx.translate(x, y); if (pg.i % 2) ctx.scale(-1, 1);
      ctx.beginPath(); ctx.ellipse(0, -9, 13, 9, 0, 0, 7); ctx.fillStyle = '#9a9aa0'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
      if (flying) { const w = Math.sin(st.t * 18) * 12; ctx.beginPath(); ctx.moveTo(-4, -12); ctx.lineTo(-10, -26 - w); ctx.moveTo(4, -12); ctx.lineTo(10, -26 - w); ctx.stroke(); }
      const peck = !flying && Math.sin(st.t * 3 + pg.i * 2) > .7 ? 8 : 0;
      ctx.beginPath(); ctx.arc(11, -18 + peck, 6, 0, 7); ctx.fillStyle = '#7f7f88'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(16, -18 + peck); ctx.lineTo(22, -16 + peck); ctx.lineTo(16, -15 + peck); ctx.fillStyle = N.AMBER; ctx.fill();
      if (!flying) { ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-2, 4); ctx.moveTo(4, 0); ctx.lineTo(4, 4); ctx.strokeStyle = N.SEAL; ctx.stroke(); }
      ctx.restore();
    });
  }
  function ducks(cx, cy) {
    for (let k = 0; k < 2; k++) {
      const a = st.t * .28 + k * Math.PI, x = cx + Math.cos(a) * 128, y = cy - 4 + Math.sin(a) * 15, dir = -Math.sin(a) >= 0 ? 1 : -1;
      ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
      ctx.beginPath(); ctx.ellipse(0, -6, 15, 8, 0, 0, Math.PI * 2); ctx.fillStyle = k ? '#fffaf0' : '#f1d27a'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(11, -16, 6, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(16, -16); ctx.lineTo(23, -14); ctx.lineTo(16, -12); ctx.fillStyle = N.AMBER; ctx.fill();
      ctx.restore();
    }
  }
  function fountain() {
    const cx = FX, cy = 585, P = st.hava;
    ctx.beginPath(); ctx.ellipse(cx + 14, cy + 10, 196, 40, 0, 0, 7); ctx.fillStyle = 'rgba(23,20,17,.12)'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy, 190, 40, 0, 0, 7); ctx.fillStyle = '#d9cbb0'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(23,20,17,.28)'; ctx.lineWidth = 1.4; ctx.beginPath(); for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12; ctx.moveTo(cx + Math.cos(a) * 170, cy + Math.sin(a) * 30); ctx.lineTo(cx + Math.cos(a) * 192, cy + Math.sin(a) * 41); } ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(cx, cy, 190, 40, 0, 0, 7); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy - 6, 170, 30, 0, 0, 7); ctx.fillStyle = P === 'aksam' ? '#3f5a6b' : '#8fb0bd'; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
    const rings = P === 'yagmur' ? 10 : 4;
    for (let i = 0; i < rings; i++) {
      const per = 2.4, k = ((st.t / per + i * .37) % 1), seed = Math.floor(st.t / per + i * .37) * 13 + i * 7;
      const rx = P === 'yagmur' ? cx + ((seed * 53) % 280) - 140 : cx + [-70, 70, -30, 40][i], ry = cy - 6 + (P === 'yagmur' ? ((seed * 29) % 30) - 15 : 6);
      ctx.beginPath(); ctx.ellipse(rx, ry, 4 + k * 34, 1.5 + k * 7, 0, 0, 7); ctx.strokeStyle = `rgba(255,255,255,${.8 * (1 - k)})`; ctx.lineWidth = 2; ctx.stroke();
    }
    ducks(cx, cy);
    inkRect(cx - 14, cy - 110, 28, 104, '#e8dcc2'); hatch(rectPts(cx + 3, cy - 108, 11, 102), { gap: 5, alpha: .25 });
    ctx.beginPath(); ctx.ellipse(cx, cy - 112, 50, 12, 0, 0, 7); ctx.fillStyle = '#e8dcc2'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = P === 'aksam' ? 'rgba(170,200,215,.8)' : 'rgba(110,160,180,.85)'; ctx.lineWidth = 3;
    for (const sd of [-1, 1]) for (let j = 0; j < 3; j++) { const w = 40 + j * 22; ctx.beginPath(); ctx.moveTo(cx, cy - 130); ctx.quadraticCurveTo(cx + sd * w * .6, cy - 190 + j * 8 + Math.sin(st.t * 3 + j) * 3, cx + sd * w * 1.6, cy - 30); ctx.stroke(); }
    for (let i = 0; i < 10; i++) { const ph = (st.t * .9 + i / 10) % 1, sd = i % 2 ? 1 : -1, w = 40 + (i % 3) * 22; const x = cx + sd * w * 1.6 * ph, y = cy - 130 - Math.sin(ph * Math.PI) * 50 + ph * 100; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fillStyle = 'rgba(200,225,235,.9)'; ctx.fill(); }
    [cx - 300, cx + 240].forEach((bx) => { groundShadow(bx + 35, 90); [8, 62].forEach((lx) => inkLine({ x: bx + lx, y: GROUND - 25 }, { x: bx + lx, y: GROUND }, 3.5)); inkRect(bx, GROUND - 34, 70, 9, '#9b7653', 2.5); inkRect(bx, GROUND - 58, 70, 8, '#9b7653', 2.5); inkLine({ x: bx + 6, y: GROUND - 50 }, { x: bx + 6, y: GROUND - 34 }, 2.5); inkLine({ x: bx + 64, y: GROUND - 50 }, { x: bx + 64, y: GROUND - 34 }, 2.5); });
  }
  function fence() {
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.fillStyle = '#f6ecd8';
    groundShadow(1370, 180);
    inkRect(1294, GROUND - 56, 148, 7, '#e3d3b4', 2.5); inkRect(1294, GROUND - 26, 148, 7, '#e3d3b4', 2.5);
    for (let x = 1300; x <= 1430; x += 18) { const pk = [{ x, y: GROUND }, { x, y: GROUND - 66 }, { x: x + 4.5, y: GROUND - 74 }, { x: x + 9, y: GROUND - 66 }, { x: x + 9, y: GROUND }]; inkPoly(pk, { fill: '#f6ecd8', w: 2.5 }); hatch(rectPts(x + 5.5, GROUND - 66, 3.5, 66), { gap: 4, alpha: .25 }); }
    // çitin üstünde kedi
    const tail = Math.sin(st.t * 2) * .5, cx = 1395, cy = GROUND - 74;
    ctx.fillStyle = '#3b3530'; ctx.beginPath(); ctx.ellipse(cx, cy - 10, 16, 10, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(cx + 15, cy - 20, 8, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 9, cy - 25); ctx.lineTo(cx + 11, cy - 34); ctx.lineTo(cx + 15, cy - 27); ctx.moveTo(cx + 16, cy - 27); ctx.lineTo(cx + 20, cy - 34); ctx.lineTo(cx + 22, cy - 24); ctx.fill();
    ctx.save(); ctx.translate(cx - 14, cy - 8); ctx.rotate(tail); ctx.strokeStyle = '#3b3530'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-14, 4, -12, 22); ctx.stroke(); ctx.restore();
    const blink = (st.t % 4) < .15; if (!blink) { ctx.fillStyle = N.AMBER; ctx.beginPath(); ctx.arc(cx + 13, cy - 21, 1.8, 0, 7); ctx.arc(cx + 19, cy - 21, 1.8, 0, 7); ctx.fill(); }
  }
  function hexSign() {
    const c = { x: 2160, y: 448 }, sw = Math.sin(st.t * 1.5) * .05; ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c.x - 30, 380); ctx.lineTo(c.x + 4, 380); ctx.stroke();
    ctx.save(); ctx.translate(c.x, 380); ctx.rotate(sw); ctx.translate(-c.x, -380);
    ctx.beginPath(); ctx.moveTo(c.x, 380); ctx.lineTo(c.x, 414); ctx.stroke();
    const hx = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; hx.push({ x: c.x + Math.cos(a) * 34, y: c.y + Math.sin(a) * 34 }); }
    inkPoly(hx, { fill: N.AMBER, w: 3 }); hatch([hx[5], hx[0], hx[1], c], { gap: 5, alpha: .2 }); ctx.font = `400 20px ${N.BRUSH}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BAL', c.x, c.y + 1); ctx.restore();
    // arı
    const bx = c.x + Math.cos(st.t * 2.3) * 52, by = c.y + Math.sin(st.t * 3.1) * 30; ctx.beginPath(); ctx.ellipse(bx, by, 5, 3.5, 0, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(bx - 1, by - 5, 3, 4, 0, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill();
  }
  function bakerySign() { // fırın: simit tabelası (çember)
    const x = 905, y = 488, sw = Math.sin(st.t * 1.4) * .06;
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 50, 470); ctx.lineTo(x + 92, 470); ctx.stroke();
    ctx.save(); ctx.translate(x + 82, 470); ctx.rotate(sw);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 8); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 30, 22, 0, 7); ctx.arc(0, 30, 9, 0, 7, true); ctx.fillStyle = '#c98a3d'; ctx.fill('evenodd'); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 30, 9, 0, 7); ctx.stroke();
    ctx.fillStyle = '#fffaf0'; for (let i = 0; i < 9; i++) { const a = i * .7; ctx.fillRect(Math.cos(a) * 15 - 1, 30 + Math.sin(a) * 15 - 1, 2.5, 2.5); }
    ctx.restore();
  }
  /* kasabalılar */
  const WALKERS = [
    { a: 120, b: 560, sp: 30, col: N.AMBER, ph: .1 }, { a: 940, b: 1520, sp: 26, col: N.SEAL, ph: .5 },
    { a: 1960, b: 2500, sp: 36, col: '#5b7a8c', ph: .3 }, { a: 5000, b: 5370, sp: 24, col: '#87a074', ph: .7 }, { a: -1400, b: -380, sp: 32, col: N.DEEP, ph: .2 }, { a: 3180, b: 4300, sp: 34, col: N.SEAL, ph: .6 }, { a: 4150, b: 4560, sp: 27, col: '#5b7a8c', ph: .4 }, { a: 5450, b: 6200, sp: 29, col: N.AMBER, ph: .15 }, { a: 6500, b: 7500, sp: 25, col: '#87a074', ph: .55 }, { a: 6620, b: 7300, sp: 33, col: N.SEAL, ph: .85 },
  ];
  function person(x, y, dir, col, step, umbrella) {
    const lg = Math.sin(step) * 7;
    if (SK) { ctx.beginPath(); ctx.ellipse(x + 3, y + 1, 14, 3.5, 0, 0, 7); ctx.fillStyle = 'rgba(23,20,17,.15)'; ctx.fill(); }
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y - 20); ctx.lineTo(x + lg, y); ctx.moveTo(x, y - 20); ctx.lineTo(x - lg, y); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 34, 15, 0, 7); ctx.fillStyle = '#e9e1d3'; ctx.fill();
    if (SK) { ctx.save(); ctx.clip(); ctx.beginPath(); ctx.arc(x + 6, y - 28, 14, 0, 7); ctx.fillStyle = 'rgba(80,70,60,.18)'; ctx.fill(); ctx.restore(); }
    ctx.beginPath(); ctx.arc(x, y - 34, 15, 0, 7); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 34, 15, Math.PI * .15, Math.PI * .85); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = N.INK; ctx.beginPath(); ctx.arc(x + dir * 6, y - 38, 1.8, 0, 7); ctx.arc(x + dir * 11, y - 38, 1.8, 0, 7); ctx.fill();
    if (umbrella) { ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - dir * 4, y - 34); ctx.lineTo(x - dir * 4, y - 80); ctx.stroke(); ctx.beginPath(); ctx.arc(x - dir * 4, y - 80, 30, Math.PI, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); }
  }
  function walkers() {
    WALKERS.forEach((W) => {
      const L = W.b - W.a, dd = (st.t * W.sp + W.ph * 2 * L) % (2 * L), fwd = dd < L, x = fwd ? W.a + dd : W.b - (dd - L);
      person(x, GROUND + 26, fwd ? 1 : -1, W.col, st.t * W.sp * .25, st.hava === 'yagmur');
    });
  }
  const bikeAt = () => { const x = ((st.t * 95) % (WW - WMIN + 800)) + WMIN - 400; return { x, y: GROUND + 44 }; };
  function bike() {
    const { x, y } = bikeAt(), R = 21, rot = x / R;
    ctx.beginPath(); ctx.ellipse(x + 4, y + 1, 58, 5, 0, 0, 7); ctx.fillStyle = 'rgba(23,20,17,.13)'; ctx.fill();
    [x - 30, x + 30].forEach((wx, i) => {
      ctx.beginPath(); ctx.arc(wx, y - R, R, 0, 7); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.lineWidth = 1.4; ctx.strokeStyle = i === 0 && st.av.tekerlek ? N.DEEP : 'rgba(23,20,17,.7)';
      for (let k = 0; k < 8; k++) { const a = rot + k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(wx, y - R); ctx.lineTo(wx + Math.cos(a) * R, y - R + Math.sin(a) * R); ctx.stroke(); }
    });
    ctx.strokeStyle = N.SEAL; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x - 30, y - R); ctx.lineTo(x - 6, y - R - 26); ctx.lineTo(x + 20, y - R - 26); ctx.lineTo(x + 30, y - R); ctx.moveTo(x - 6, y - R - 26); ctx.lineTo(x, y - R); ctx.lineTo(x - 30, y - R); ctx.stroke();
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 20, y - R - 26); ctx.lineTo(x + 16, y - R - 40); ctx.lineTo(x + 26, y - R - 42); ctx.stroke();
    const pd = Math.sin(rot) * 8; ctx.beginPath(); ctx.moveTo(x - 6, y - R - 30); ctx.lineTo(x + pd, y - R + 2); ctx.stroke();
    person(x - 6, y - R - 28, 1, N.AMBER, 0, false);
  }
  function groundLayer() {
    layer(1); const P = PAL[st.hava];
    ctx.fillStyle = P.ground; ctx.fillRect(WMIN - 400, GROUND, WW - WMIN + 800, WH - GROUND + 10);
    SK = true; // el çizimi: bütün kasaba
    const vx0 = cam.x - vw / 2 - 60, vx1 = cam.x + vw / 2 + 60; // yalnızca görünen kısım
    for (let x = Math.floor(vx0 / 400) * 400; x < vx1; x += 400) inkLine({ x, y: GROUND }, { x: x + 400, y: GROUND }, 3);
    ctx.fillStyle = 'rgba(23,20,17,.07)'; ctx.fillRect(vx0, GROUND + 1, vx1 - vx0, 6);
    ctx.strokeStyle = 'rgba(23,20,17,.18)'; ctx.lineWidth = 1.5;
    for (let r = 0; r < 4; r++) { const y = GROUND + 18 + r * 22; ctx.beginPath(); for (let x = WMIN - 400 + (r % 2) * 22; x < WW + 400; x += 44) { ctx.moveTo(x, y); ctx.arc(x + 20, y, 20, Math.PI, 0); } ctx.stroke(); }
    if (st.hava === 'yagmur') for (let i = 0; i < 18; i++) { const k = ((st.t * .6 + i * .29) % 1), x = WMIN + (i * 263) % (WW - WMIN), y = GROUND + 30 + (i * 37) % 100; ctx.beginPath(); ctx.ellipse(x, y, 4 + k * 26, 1 + k * 5, 0, 0, 7); ctx.strokeStyle = `rgba(255,255,255,${.7 * (1 - k)})`; ctx.lineWidth = 1.5; ctx.stroke(); }
    trainStation();
    bunting({ x: 300, y: 395 }, { x: 588, y: 330 }, 40, 9);
    house(150, 150, 210, '#b8741a', { chimney: 105, box: true }); tree(370, .9);
    clockTower();
    house(840, 130, 170, '#c4432b', { rh: 80, awning: N.SEAL, sign: bakerySign }); house(1020, 150, 240, '#8a6a4a', { bay: true, chimney: 20 });
    tree(1220); fence();
    crossroad();
    house(1990, 140, 200, '#b8741a', { chimney: 96, shutters: '#87a074' }); hexSign(); house(2100, 120, 150, '#c4432b', { wall: '#efe2c8', box: true });
    laundry({ x: 2222, y: 470 }, { x: 2330, y: 432 });
    house(2330, 140, 190, '#8a6a4a', { shutters: '#5b7a8c' }); tree(2530, .95);
    tileShop(); house(3240, 140, 180, '#8a6a4a', { box: true, chimney: 100 }); tree(3500, .9);
    river(); bridge(); tree(4170, .95); house(4250, 150, 200, '#c4432b', { shutters: '#87a074' });
    fountain(); tree(5090, 1.05); house(5200, 160, 230, '#b8741a', { chimney: 30, box: true });
    tree(5470, .9); pastane(); tree(6200, .95); house(6290, 140, 190, '#8a6a4a', { shutters: '#e58b8b', box: true });
    pazar(); house(7420, 150, 210, '#c4432b', { chimney: 110, shutters: '#87a074' }); tree(7660, 1.05);
    LAMPS.forEach(lamp);
    walkers(); pigeons(); bike();
    SK = false;
  }
  /* ── Pastane ve Pazar (kesirler) ── */
  function pastane() {
    const x0 = 5760, w = 350, h = 240, top = GROUND - h, lit = st.hava === 'aksam';
    groundShadow(x0 + w / 2, w * 1.25);
    inkRect(x0 + 40, top - 70, 22, 56, '#b65a3f'); smoke(x0 + 51, top - 76);
    inkRect(x0, top, w, h, '#f7e6e0');
    ctx.save(); ctx.beginPath(); ctx.rect(x0, top, w, h); ctx.clip(); ctx.strokeStyle = 'rgba(196,67,43,.12)'; ctx.lineWidth = 9; for (let x = x0 + 8; x < x0 + w; x += 26) { ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, GROUND); ctx.stroke(); } ctx.restore();
    hatch(rectPts(x0 + w * .86, top + 2, w * .14 - 1.5, h - 2), { gap: 6, alpha: .16 });
    // kornişli çatı ve tabela
    inkPoly([{ x: x0 - 16, y: top }, { x: x0 + w + 16, y: top }, { x: x0 + w + 6, y: top - 22 }, { x: x0 - 6, y: top - 22 }], { fill: '#8a5a44', w: 3 });
    inkRect(x0 + 70, top - 66, w - 140, 44, '#fffaf0', 3);
    ctx.font = `400 30px ${N.BRUSH}`; ctx.fillStyle = N.SEAL; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PASTANE', x0 + w / 2 - 14, top - 43);
    // tabeladaki pasta: 3/4'ü kalmış
    const px = x0 + w - 92, py = top - 44; ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, 15, -Math.PI / 2, Math.PI, false); ctx.closePath(); ctx.fillStyle = '#d9a650'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(px, py, 15, Math.PI, Math.PI * 1.5); ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
    // tente
    const ap = [{ x: x0 - 10, y: top + 18 }, { x: x0 + w + 10, y: top + 18 }, { x: x0 + w + 26, y: top + 58 }, { x: x0 - 26, y: top + 58 }];
    ctx.save(); ctx.beginPath(); ap.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.clip(); for (let k = 0; k < 18; k++) { ctx.fillStyle = k % 2 ? '#fffaf0' : '#e58b8b'; ctx.fillRect(x0 - 30 + k * 23, top + 16, 23, 44); } ctx.restore();
    inkPoly(ap, { w: 2.5 });
    for (let k = 0; k < 17; k++) { ctx.beginPath(); ctx.arc(x0 - 18 + k * 23.2, top + 58, 11.6, 0, Math.PI); ctx.fillStyle = k % 2 ? '#fffaf0' : '#e58b8b'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.6; ctx.stroke(); }
    ctx.fillStyle = 'rgba(60,40,25,.16)'; ctx.fillRect(x0 + 2, top + 70, w - 4, 10);
    // vitrin: tepsi baklava (dilimli), pastalar
    const vx = x0 + 22, vy = top + 98, vw = 210, vh = 112;
    inkRect(vx - 6, vy + vh, vw + 12, 8, '#9b7653', 2.5);
    inkRect(vx, vy, vw, vh, lit ? '#f6dcae' : '#eef3f2', 3);
    // tepsi: 8 dilim, 6'sı dolu
    const tx = vx + 58, ty = vy + 64; ctx.beginPath(); ctx.ellipse(tx, ty, 44, 16, 0, 0, 7); ctx.fillStyle = '#c9b48d'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
    for (let k = 0; k < 8; k++) { const a0 = k * Math.PI / 4 - Math.PI / 2, a1 = a0 + Math.PI / 4; if (k >= 6) continue; ctx.beginPath(); ctx.moveTo(tx, ty - 2); ctx.ellipse(tx, ty - 2, 38, 13, 0, a0, a1); ctx.closePath(); ctx.fillStyle = k % 2 ? '#d9a650' : '#e2b464'; ctx.fill(); ctx.strokeStyle = 'rgba(23,20,17,.55)'; ctx.lineWidth = 1.2; ctx.stroke(); }
    // pasta katları
    const cx = vx + 150, cy = vy + vh - 14; inkRect(cx - 32, cy - 26, 64, 26, '#f3c9c9', 2); inkRect(cx - 22, cy - 46, 44, 20, '#fffaf0', 2); ctx.beginPath(); ctx.arc(cx, cy - 52, 5, 0, 7); ctx.fillStyle = N.SEAL; ctx.fill();
    ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(vx + vw / 2 + 6, vy); ctx.lineTo(vx + vw / 2 + 6, vy + vh); ctx.stroke();
    if (!lit) { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(vx + 10, vy + 30); ctx.lineTo(vx + 26, vy + 10); ctx.moveTo(vx + vw - 30, vy + vh - 12); ctx.lineTo(vx + vw - 12, vy + vh - 34); ctx.stroke(); }
    // kapı
    const dx = x0 + w - 92, dw = 56; ctx.beginPath(); ctx.moveTo(dx, GROUND); ctx.lineTo(dx, GROUND - 100); ctx.arc(dx + dw / 2, GROUND - 100, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw, GROUND); ctx.closePath(); ctx.fillStyle = '#7b5a3c'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke();
    inkRect(dx + 10, GROUND - 110, dw - 20, 40, lit ? '#f5c06a' : '#d7e1e4', 2); ctx.beginPath(); ctx.arc(dx + dw - 12, GROUND - 46, 3, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill();
    // dışarıda masa
    const mx = x0 - 70; groundShadow(mx, 70); inkLine({ x: mx, y: GROUND - 44 }, { x: mx, y: GROUND }, 3); inkLine({ x: mx - 14, y: GROUND }, { x: mx + 14, y: GROUND }, 3); inkPoly([{ x: mx - 30, y: GROUND - 48 }, { x: mx + 30, y: GROUND - 48 }, { x: mx + 30, y: GROUND - 42 }, { x: mx - 30, y: GROUND - 42 }], { fill: '#fffaf0', w: 2.5 });
    ctx.beginPath(); ctx.moveTo(mx - 8, GROUND - 48); ctx.arc(mx - 8, GROUND - 48, 9, Math.PI, Math.PI * 1.5); ctx.closePath(); ctx.fillStyle = '#d9a650'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(mx + 12, GROUND - 52, 7, 4, 0, 0, 7); ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.stroke(); if (!N.reduced) { ctx.strokeStyle = 'rgba(120,110,100,.4)'; ctx.beginPath(); for (let k = 0; k < 2; k++) { const sx = mx + 9 + k * 6; ctx.moveTo(sx, GROUND - 58); ctx.quadraticCurveTo(sx + Math.sin(st.t * 2 + k) * 4, GROUND - 66, sx, GROUND - 74); } ctx.stroke(); }
  }
  const STALLS = [{ x: 6690, col: '#87a074', fruit: '#c4432b', ad: 'ÇİLEK', tag: '1/2 kg' }, { x: 6890, col: N.SEAL, fruit: N.AMBER, ad: 'PORTAKAL', tag: '0,5 kg' }, { x: 7090, col: '#5b7a8c', fruit: '#9bb383', ad: 'ARMUT', tag: '%50' }]; // üçü de aynı: yarım
  function pazar() {
    ctx.strokeStyle = N.INK; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(6670, 420); ctx.quadraticCurveTo(6975, 460, 7280, 420); ctx.stroke();
    for (let i = 0; i < 14; i++) { const t = (i + .5) / 14, x = 6670 + 610 * t, y = 420 + Math.sin(Math.PI * t) * 40 * .5 * 2 * (1 - Math.abs(t - .5)) ; ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y); ctx.lineTo(x + Math.sin(st.t * 3 + i) * 3, y + 20); ctx.closePath(); ctx.fillStyle = [N.AMBER, N.SEAL, '#fffaf0', '#87a074'][i % 4]; ctx.fill(); ctx.lineWidth = 1.4; ctx.stroke(); }
    STALLS.forEach((S, i) => {
      const x = S.x, w = 170, tY = GROUND - 150;
      groundShadow(x + w / 2, w * 1.1);
      [x + 8, x + w - 8].forEach((px) => inkLine({ x: px, y: GROUND }, { x: px, y: tY }, 4, '#6b4f35'));
      const ap = [{ x: x - 12, y: tY }, { x: x + w + 12, y: tY }, { x: x + w + 22, y: tY + 34 }, { x: x - 22, y: tY + 34 }];
      ctx.save(); ctx.beginPath(); ap.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.clip(); for (let k = 0; k < 10; k++) { ctx.fillStyle = k % 2 ? '#fffaf0' : S.col; ctx.fillRect(x - 24 + k * 22, tY - 2, 22, 40); } ctx.restore();
      inkPoly(ap, { w: 2.5 }); ctx.fillStyle = 'rgba(60,40,25,.18)'; ctx.fillRect(x + 4, tY + 34, w - 8, 8);
      // tezgâh ve kasalar
      inkRect(x - 4, GROUND - 58, w + 8, 58, '#c9a27a', 2.5); hatch(rectPts(x + w * .8, GROUND - 58, w * .2 + 3, 58), { gap: 6, alpha: .2 });
      ctx.strokeStyle = 'rgba(23,20,17,.35)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 4, GROUND - 30); ctx.lineTo(x + w + 4, GROUND - 30); ctx.stroke();
      for (let k = 0; k < 2; k++) {
        const bx = x + 12 + k * 78, by = GROUND - 82; inkRect(bx, by, 66, 26, '#b08a63', 2);
        for (let f = 0; f < 9; f++) { const fx = bx + 9 + (f % 5) * 12 + (f > 4 ? 6 : 0), fy = by + 2 - (f > 4 ? 9 : 0); ctx.beginPath(); ctx.arc(fx, fy, 6.5, 0, 7); ctx.fillStyle = S.fruit; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.3; ctx.stroke(); ctx.beginPath(); ctx.arc(fx - 2, fy - 2, 1.6, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fill(); }
      }
      // fiyat etiketi (kesir!)
      const sx = x + w / 2, sy = tY + 52, sw = Math.sin(st.t * 1.6 + i) * .05;
      ctx.save(); ctx.translate(sx, tY + 34); ctx.rotate(sw); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(0, 12); ctx.lineTo(10, 0); ctx.stroke();
      inkRect(-38, 12, 76, 30, '#fffaf0', 2); ctx.font = `600 15px ${N.MONO}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(S.tag, 0, 28); ctx.restore(); void sy;
      ctx.font = `400 20px ${N.BRUSH}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.fillText(S.ad, sx, GROUND - 14);
    });
    // asma terazi
    const tx = 6975, ty = GROUND - 210; inkLine({ x: tx, y: GROUND - 150 }, { x: tx, y: ty }, 3, '#6b4f35');
    const tilt = Math.sin(st.t * 1.2) * .12; ctx.save(); ctx.translate(tx, ty + 12); ctx.rotate(tilt);
    inkLine({ x: -46, y: 0 }, { x: 46, y: 0 }, 3); [-46, 46].forEach((ex) => { ctx.strokeStyle = N.INK; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ex, 0); ctx.lineTo(ex - 12, 30); ctx.moveTo(ex, 0); ctx.lineTo(ex + 12, 30); ctx.stroke(); ctx.beginPath(); ctx.ellipse(ex, 31, 15, 4, 0, 0, 7); ctx.fillStyle = '#c9973f'; ctx.fill(); ctx.stroke(); });
    ctx.restore(); ctx.beginPath(); ctx.arc(tx, ty + 12, 4, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill();
  }
  /* ── Tren istasyonu ── */
  const TRACK = GROUND - 24, STOP = -260;
  function trainFront() {
    const p = st.t % 26;
    if (p < 7) { const e = 1 - Math.pow(1 - p / 7, 2); return { x: -2300 + (STOP + 2300) * e, moving: p < 6.6 }; }
    if (p < 15) return { x: STOP, moving: false };
    if (p < 22) { const e = Math.pow((p - 15) / 7, 2); return { x: STOP - (STOP + 2300) * e, moving: p > 15.3 }; }
    return { x: -2300, moving: false };
  }
  function wheel(x, y, r, rot) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = '#2f2a26'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = N.AMBER; ctx.lineWidth = 1.6; for (let k = 0; k < 6; k++) { const a = rot + k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2)); ctx.stroke(); }
  }
  function train() {
    const { x: f, moving } = trainFront(), lit = st.hava === 'aksam', rot = f / 16;
    ctx.fillStyle = 'rgba(23,20,17,.16)'; ctx.fillRect(f - 430, TRACK - 4, 452, 7);
    // vagonlar
    [[f - 290, N.SEAL], [f - 430, '#5b7a8c']].forEach(([x, col]) => {
      inkRect(x, TRACK - 86, 130, 70, col);
      ctx.fillStyle = 'rgba(23,20,17,.25)'; ctx.fillRect(x, TRACK - 86, 130, 8); hatch(rectPts(x + 108, TRACK - 78, 21, 61), { gap: 5, alpha: .25 });
      for (let k = 0; k < 3; k++) { ctx.fillStyle = lit ? '#f5c06a' : '#d7e1e4'; ctx.fillRect(x + 12 + k * 40, TRACK - 70, 28, 24); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.strokeRect(x + 12 + k * 40, TRACK - 70, 28, 24); }
      wheel(x + 26, TRACK - 12, 13, rot); wheel(x + 104, TRACK - 12, 13, rot);
      ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 130, TRACK - 30); ctx.lineTo(x + 140, TRACK - 30); ctx.stroke();
    });
    // lokomotif
    const L = f - 150;
    inkRect(L, TRACK - 108, 58, 92, '#2f2a26'); inkRect(L + 8, TRACK - 98, 40, 30, lit ? '#f5c06a' : '#d7e1e4', 2);
    ctx.fillStyle = '#c4432b'; ctx.fillRect(L - 4, TRACK - 116, 66, 10); ctx.strokeRect(L - 4, TRACK - 116, 66, 10);
    ctx.beginPath(); ctx.moveTo(L + 58, TRACK - 70); ctx.lineTo(f - 10, TRACK - 70); ctx.quadraticCurveTo(f, TRACK - 70, f, TRACK - 56); ctx.lineTo(f, TRACK - 26); ctx.lineTo(L + 58, TRACK - 26); ctx.closePath();
    ctx.fillStyle = '#3b3530'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = N.AMBER; ctx.fillRect(L + 58, TRACK - 52, f - L - 58, 6);
    inkRect(f - 44, TRACK - 98, 18, 28, '#2f2a26');
    ctx.beginPath(); ctx.moveTo(f, TRACK - 26); ctx.lineTo(f + 22, TRACK - 6); ctx.lineTo(f, TRACK - 6); ctx.closePath(); ctx.fillStyle = N.SEAL; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(f - 4, TRACK - 60, 6, 0, 7); ctx.fillStyle = lit ? '#fff3c4' : '#fffaf0'; ctx.fill(); ctx.stroke();
    wheel(L + 22, TRACK - 16, 16, rot); wheel(L + 70, TRACK - 16, 16, rot); wheel(f - 30, TRACK - 16, 16, rot);
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(L + 22 + Math.cos(rot) * 9, TRACK - 16 + Math.sin(rot) * 9); ctx.lineTo(f - 30 + Math.cos(rot) * 9, TRACK - 16 + Math.sin(rot) * 9); ctx.stroke();
    if (moving) for (let k = 0; k < 6; k++) { const ph = (st.t * 1.4 + k / 6) % 1; ctx.beginPath(); ctx.arc(f - 35 - ph * 70, TRACK - 104 - ph * 70, 8 + ph * 18, 0, 7); ctx.fillStyle = `rgba(${lit ? '210,210,220' : '130,120,110'},${.45 * (1 - ph)})`; ctx.fill(); }
  }
  function trainStation() {
    const x0 = -1080, w = 360, h = 230, top = GROUND - h, lit = st.hava === 'aksam';
    // telgraf direkleri ve teller
    const poles = [-1520, -1340, -1160];
    poles.forEach((px) => { groundShadow(px, 40); inkLine({ x: px, y: GROUND }, { x: px, y: GROUND - 210 }, 6, '#6b4f35'); inkLine({ x: px - 22, y: GROUND - 196 }, { x: px + 22, y: GROUND - 196 }, 4, '#6b4f35'); [-18, 18].forEach((dx) => { ctx.beginPath(); ctx.arc(px + dx, GROUND - 200, 3, 0, 7); ctx.fillStyle = '#d7e1e4'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.2; ctx.stroke(); }); });
    ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5;
    for (let i = 0; i + 1 < poles.length; i++) for (const dx of [-18, 18]) { ctx.beginPath(); ctx.moveTo(poles[i] + dx, GROUND - 198); ctx.quadraticCurveTo((poles[i] + poles[i + 1]) / 2 + dx, GROUND - 178, poles[i + 1] + dx, GROUND - 198); ctx.stroke(); }
    // gar binası
    groundShadow(x0 + w / 2, w * 1.25);
    inkRect(x0, top, w, h, '#efe0c2');
    ctx.save(); ctx.beginPath(); ctx.rect(x0, top, w, h); ctx.clip(); ctx.strokeStyle = 'rgba(23,20,17,.14)'; ctx.lineWidth = 1.3;
    for (let y = top + 60, r = 0; y < GROUND; y += 22, r++) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke(); }
    ctx.restore();
    hatch(rectPts(x0 + w * .86, top + 2, w * .14 - 1.5, h - 2), { gap: 6, alpha: .16 });
    ctx.fillStyle = 'rgba(60,40,25,.16)'; ctx.fillRect(x0 + 1.5, top + 1.5, w - 3, 10);
    inkRect(x0 - 8, GROUND - 22, w + 16, 22, '#d9c7a3', 2.5);
    const sr = [{ x: x0 - 18, y: top }, { x: x0 + 46, y: top - 64 }, { x: x0 + w - 46, y: top - 64 }, { x: x0 + w + 18, y: top }];
    inkPoly(sr, { fill: '#5b7a8c', noStroke: true });
    ctx.save(); ctx.beginPath(); sr.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.clip(); ctx.strokeStyle = 'rgba(23,20,17,.22)'; ctx.lineWidth = 1.4; for (let yy = top - 52; yy < top; yy += 10) { ctx.beginPath(); ctx.moveTo(x0 - 20, yy); ctx.lineTo(x0 + w + 20, yy); ctx.stroke(); } ctx.restore();
    hatch([sr[2], sr[3], { x: x0 + w - 46, y: top }], { gap: 6, alpha: .22 });
    inkPoly(sr, { w: 3 }); inkLine({ x: x0 - 22, y: top + 1 }, { x: x0 + w + 22, y: top + 1 }, 4.5);
    const cc = { x: x0 + w / 2, y: top - 32 }; inkCircle(cc.x, cc.y, 24, { fill: '#c9973f', w: 2.5 }); inkCircle(cc.x, cc.y, 19, { fill: '#fffaf0', w: 2 }); ctx.strokeStyle = N.INK; ctx.lineCap = 'round';
    const now = new Date(), mm = now.getMinutes() * 6, hh = (now.getHours() % 12) * 30 + now.getMinutes() / 2;
    [[hh, 11, 3.5], [mm, 16, 2]].forEach(([dg, L, lw]) => { const a = g.rad(dg); ctx.beginPath(); ctx.moveTo(cc.x, cc.y); ctx.lineTo(cc.x + Math.sin(a) * L, cc.y - Math.cos(a) * L); ctx.lineWidth = lw; ctx.stroke(); }); ctx.lineCap = 'butt';
    inkRect(x0 + w / 2 - 92, top + 14, 184, 34, '#fffaf0', 2.5); ctx.font = `400 26px ${N.BRUSH}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('İSTASYON', x0 + w / 2, top + 32);
    for (let k = 0; k < 4; k++) { const wx = x0 + 28 + k * 84, wy = top + 74; ctx.fillStyle = 'rgba(60,40,25,.16)'; ctx.fillRect(wx + 4, wy + 6, 48, 88); ctx.beginPath(); ctx.moveTo(wx, wy + 90); ctx.lineTo(wx, wy + 24); ctx.arc(wx + 24, wy + 24, 24, Math.PI, 0); ctx.lineTo(wx + 48, wy + 90); ctx.closePath(); ctx.fillStyle = lit ? '#f5c06a' : '#d7e1e4'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(wx + 24, wy); ctx.lineTo(wx + 24, wy + 90); ctx.moveTo(wx, wy + 46); ctx.lineTo(wx + 48, wy + 46); ctx.lineWidth = 1.5; ctx.stroke(); }
    // peron saçağı (üçgen saçak süsleri)
    ctx.fillStyle = 'rgba(23,20,17,.1)'; ctx.fillRect(-730, GROUND + 2, 350, 8);
    [-700, -560, -420].forEach((px) => { inkLine({ x: px, y: GROUND }, { x: px, y: GROUND - 146 }, 5); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, GROUND - 120); ctx.quadraticCurveTo(px + 4, GROUND - 140, px + 22, GROUND - 146); ctx.moveTo(px, GROUND - 120); ctx.quadraticCurveTo(px - 4, GROUND - 140, px - 22, GROUND - 146); ctx.stroke(); });
    inkPoly([{ x: -726, y: GROUND - 160 }, { x: -396, y: GROUND - 160 }, { x: -386, y: GROUND - 146 }, { x: -736, y: GROUND - 146 }], { fill: '#c4432b', w: 3 });
    ctx.fillStyle = '#fffaf0'; for (let x = -732; x < -390; x += 16) { ctx.beginPath(); ctx.moveTo(x, GROUND - 146); ctx.lineTo(x + 16, GROUND - 146); ctx.lineTo(x + 8, GROUND - 134); ctx.closePath(); ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke(); }
    // ray ve traversler
    ctx.fillStyle = '#8a6a4a'; for (let x = -1640; x < -196; x += 26) ctx.fillRect(x, TRACK - 1, 14, 10);
    ctx.strokeStyle = '#6f7078'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-1640, TRACK); ctx.lineTo(-200, TRACK); ctx.stroke();
    ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-1640, TRACK + 2.5); ctx.lineTo(-200, TRACK + 2.5); ctx.stroke();
    inkRect(-214, TRACK - 34, 18, 36, N.SEAL);
    train();
  }

  /* ── Çini atölyesi ── */
  const CINI_BLUE = '#2f5d8a', CINI_TURQ = '#3f8f8a';
  function tileMotif(x, y, s, k) {
    ctx.fillStyle = k % 2 ? CINI_BLUE : CINI_TURQ; ctx.fillRect(x, y, s, s); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.2; ctx.strokeRect(x, y, s, s);
    ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.moveTo(x + s / 2, y + 3); ctx.lineTo(x + s - 3, y + s / 2); ctx.lineTo(x + s / 2, y + s - 3); ctx.lineTo(x + 3, y + s / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k % 2 ? N.SEAL : CINI_BLUE; ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s / 7, 0, 7); ctx.fill();
  }
  function regPoly(cx, cy, r, n, rot) { ctx.beginPath(); for (let i = 0; i < n; i++) { const a = rot + i * 2 * Math.PI / n; const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
  function tileShop() {
    const x0 = 2790, w = 320, h = 236, top = GROUND - h, lit = st.hava === 'aksam';
    groundShadow(x0 + w / 2, w * 1.25);
    inkRect(x0 + w - 56, top - 76, 24, 60, '#b65a3f'); smoke(x0 + w - 44, top - 82);
    inkRect(x0, top, w, h, '#f3ecdc');
    hatch(rectPts(x0 + w * .86, top + 40, w * .14 - 1.5, h - 41), { gap: 6, alpha: .16 });
    ctx.fillStyle = 'rgba(60,40,25,.18)'; ctx.fillRect(x0 + 1.5, top + 40, w - 3, 8);
    inkRect(x0 - 12, top - 20, w + 24, 20, '#b8741a'); hatch(rectPts(x0 - 12, top - 20, w + 24, 20), { gap: 7, alpha: .18 });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 16; c++) tileMotif(x0 + c * 20, top + r * 20, 20, r + c);
    inkRect(x0 + 34, top + 54, 196, 30, '#fffaf0', 2.5); ctx.font = `400 22px ${N.BRUSH}`; ctx.fillStyle = CINI_BLUE; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ÇİNİ ATÖLYESİ', x0 + 132, top + 70);
    // vitrin
    const vx = x0 + 34, vy = top + 98, vw = 196, vh = 110;
    inkRect(vx - 6, vy + vh, vw + 12, 8, '#9b7653', 2.5);
    inkRect(vx, vy, vw, vh, lit ? '#f1d9a8' : '#e6eef0', 3); ctx.fillStyle = 'rgba(23,20,17,.1)'; ctx.fillRect(vx + 1.5, vy + 1.5, vw - 3, 8); ctx.strokeStyle = N.INK;
    regPoly(vx + 42, vy + 56, 30, 6, st.t * .3); ctx.fillStyle = CINI_TURQ; ctx.fill(); ctx.lineWidth = 2; ctx.stroke(); regPoly(vx + 42, vy + 56, 13, 6, st.t * .3); ctx.fillStyle = '#fffaf0'; ctx.fill();
    ctx.save(); ctx.translate(vx + 100, vy + 56); ctx.rotate(-st.t * .25); ctx.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? 14 : 32, a = i * Math.PI / 8; i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(r, 0); } ctx.closePath(); ctx.fillStyle = CINI_BLUE; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fillStyle = N.SEAL; ctx.fill(); ctx.restore();
    regPoly(vx + 160, vy + 60, 28, 3, -Math.PI / 2); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.stroke();
    ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(vx + vw / 2, vy); ctx.lineTo(vx + vw / 2, vy + vh); ctx.stroke();
    if (!lit) { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(vx + 10, vy + vh - 12); ctx.lineTo(vx + 34, vy + 14); ctx.moveTo(vx + vw / 2 + 12, vy + vh - 14); ctx.lineTo(vx + vw / 2 + 26, vy + 30); ctx.stroke(); }
    // kapı ve çini çerçeve
    const dx = x0 + 248, dy = GROUND - 100;
    for (let k = 0; k < 7; k++) { tileMotif(dx - 12, dy - 10 + k * 15, 12, k); tileMotif(dx + 54, dy - 10 + k * 15, 12, k + 1); }
    ctx.beginPath(); ctx.moveTo(dx, GROUND); ctx.lineTo(dx, dy + 24); ctx.arc(dx + 27, dy + 24, 27, Math.PI, 0); ctx.lineTo(dx + 54, GROUND); ctx.closePath(); ctx.fillStyle = '#7b5a3c'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke();
    // vazolar
    [[x0 - 46, CINI_BLUE], [x0 + w + 26, CINI_TURQ]].forEach(([px, col]) => { groundShadow(px, 50); ctx.beginPath(); ctx.moveTo(px - 10, GROUND); ctx.quadraticCurveTo(px - 26, GROUND - 30, px - 8, GROUND - 52); ctx.lineTo(px + 8, GROUND - 52); ctx.quadraticCurveTo(px + 26, GROUND - 30, px + 10, GROUND); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke(); ctx.beginPath(); ctx.arc(px, GROUND - 28, 6, 0, 7); ctx.fillStyle = '#fffaf0'; ctx.fill(); });
  }

  /* ── Dere ve köprü ── */
  const RX0 = 3640, RX1 = 4060;
  function river() {
    ctx.beginPath(); ctx.moveTo(RX0 - 36, GROUND); ctx.lineTo(RX0 + 24, WH + 10); ctx.lineTo(RX1 - 24, WH + 10); ctx.lineTo(RX1 + 36, GROUND); ctx.closePath();
    const gr = ctx.createLinearGradient(0, GROUND, 0, WH); gr.addColorStop(0, st.hava === 'aksam' ? '#3f5a6b' : '#8fb0bd'); gr.addColorStop(1, st.hava === 'aksam' ? '#2c4250' : '#6e93a2');
    ctx.fillStyle = gr; ctx.fill();
    inkLine({ x: RX0 - 36, y: GROUND }, { x: RX0 + 24, y: WH + 10 }, 3); inkLine({ x: RX1 + 36, y: GROUND }, { x: RX1 - 24, y: WH + 10 }, 3);
    hatch([{ x: RX0 - 36, y: GROUND }, { x: RX0 - 6, y: GROUND }, { x: RX0 + 44, y: WH + 10 }, { x: RX0 + 24, y: WH + 10 }], { gap: 5, alpha: .25 });
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2;
    for (let r = 0; r < 4; r++) { const y = GROUND + 60 + r * 26, off = (st.t * 30 + r * 17) % 40; ctx.beginPath(); for (let x = RX0 + off; x < RX1 - 10; x += 40) { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 10, y - 5, x + 20, y); } ctx.stroke(); }
    const bx = RX0 + 30 + ((st.t * 18) % (RX1 - RX0 - 60)), by = GROUND + 92 + Math.sin(st.t * 2) * 3; // kâğıt gemi
    ctx.beginPath(); ctx.moveTo(bx - 22, by); ctx.lineTo(bx + 22, by); ctx.lineTo(bx + 14, by + 10); ctx.lineTo(bx - 14, by + 10); ctx.closePath(); ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx - 10, by); ctx.lineTo(bx, by - 22); ctx.lineTo(bx + 10, by); ctx.closePath(); ctx.fill(); ctx.stroke();
    const fp = (st.t % 5) / 5; if (fp < .3) { const s = fp / .3, fx = RX0 + 300 - s * 90, fy = GROUND + 110 - Math.sin(s * Math.PI) * 60; ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.cos(s * Math.PI) * .8); ctx.beginPath(); ctx.ellipse(0, 0, 12, 5, 0, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(18, -5); ctx.lineTo(18, 5); ctx.closePath(); ctx.fill(); ctx.restore(); }
    [RX0 - 20, RX0 - 6, RX1 + 8, RX1 + 22].forEach((x, i) => { const sw = Math.sin(st.t * 1.5 + i) * 3; ctx.strokeStyle = '#5d7a4e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, GROUND + 30); ctx.quadraticCurveTo(x + sw, GROUND + 6, x + sw * 1.5, GROUND - 22); ctx.stroke(); ctx.fillStyle = '#7b5a3c'; ctx.beginPath(); ctx.ellipse(x + sw * 1.5, GROUND - 26, 3, 8, 0, 0, 7); ctx.fill(); });
  }
  function bridge() {
    const y0 = GROUND - 6, top = GROUND - 120, nodes = [];
    for (let k = 0; k <= 6; k++) nodes.push({ x: RX0 - 20 + k * 76, y: y0 });
    const tops = []; for (let k = 0; k < 6; k++) tops.push({ x: RX0 + 18 + k * 76, y: top });
    // üçgen dolgular
    for (let k = 0; k < 6; k++) { const a = nodes[k], b = nodes[k + 1], t = tops[k]; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(t.x, t.y); ctx.lineTo(b.x, b.y); ctx.closePath(); ctx.fillStyle = k % 2 ? 'rgba(232,163,61,.18)' : 'rgba(232,163,61,.08)'; ctx.fill(); }
    const bar = (p, q) => { ctx.lineCap = 'round'; ctx.strokeStyle = N.INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.strokeStyle = '#5b6b78'; ctx.lineWidth = 5; ctx.stroke(); ctx.strokeStyle = 'rgba(220,235,245,.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.x - 1.5, p.y - 1.5); ctx.lineTo(q.x - 1.5, q.y - 1.5); ctx.stroke(); ctx.lineCap = 'butt'; };
    for (let k = 0; k < 6; k++) { bar(nodes[k], tops[k]); bar(tops[k], nodes[k + 1]); }
    bar(tops[0], tops[5]);
    [...nodes, ...tops].forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.stroke(); });
    // tabliye
    inkRect(RX0 - 40, GROUND - 8, RX1 - RX0 + 80, 46, '#9b8f80');
    ctx.strokeStyle = 'rgba(23,20,17,.35)'; ctx.lineWidth = 1.5; for (let x = RX0 - 30; x < RX1 + 40; x += 22) { ctx.beginPath(); ctx.moveTo(x, GROUND - 8); ctx.lineTo(x - 6, GROUND + 38); ctx.stroke(); }
    hatch(rectPts(RX0 - 40, GROUND + 22, RX1 - RX0 + 80, 16), { gap: 6, alpha: .25 });
    [RX0 - 40, RX1 + 40].forEach((x) => { inkRect(x - 14, GROUND - 30, 28, 70, '#c9b48d'); hatch(rectPts(x + 2, GROUND - 30, 12, 70), { gap: 5, alpha: .25 }); inkRect(x - 18, GROUND - 36, 36, 8, '#b8a37b', 2.5); });
  }

  function foreground() {
    layer(1.15);
    for (let i = 0; i < 135; i++) {
      const x = i * 90 + (i % 3) * 23 - 2200, y = WH - 8, h = 22 + (i % 4) * 10, sw = Math.sin(st.t * 1.4 + i) * 3;
      ctx.strokeStyle = st.hava === 'aksam' ? '#3d4a3d' : '#5d7a4e'; ctx.lineWidth = 3;
      ctx.beginPath(); for (let k = -2; k <= 2; k++) { ctx.moveTo(x + k * 6, y); ctx.quadraticCurveTo(x + k * 8 + sw, y - h * .6, x + k * 11 + sw * 1.5, y - h + Math.abs(k) * 4); } ctx.stroke();
      if (i % 5 === 2 && st.hava !== 'aksam') { ctx.beginPath(); ctx.arc(x + 8 + sw * 1.5, y - h - 2, 5, 0, 7); ctx.fillStyle = i % 2 ? N.SEAL : N.AMBER; ctx.fill(); }
    }
    // kelebek
    if (st.hava === 'sabah') { layer(1); const bx = 2000 + Math.sin(st.t * .4) * 3000, by = 520 + Math.sin(st.t * 1.7) * 40, w = Math.abs(Math.sin(st.t * 12)); ctx.fillStyle = N.AMBER; ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.ellipse(bx + sd * 7 * w, by, 7 * w + 1, 9, 0, 0, 7); ctx.fill(); ctx.stroke(); }); }
  }
  /* Nokta: çizimle canlandırılan karakter (ortak.js) */
  const drawNoktaChar = (x, gy, o) => N.noktaChar(ctx, x, gy, o);
  function noktaDraw() {
    layer(1);
    const moving = Math.abs(nokta.tx - nokta.x) > 2, h = 112;
    if (moving) nokta.dir = nokta.tx < nokta.x ? -1 : 1;
    const happy = !moving && st.t < (nokta.happyUntil || 0), bob = moving ? Math.abs(Math.cos(st.t * 11)) * 5 : happy ? Math.abs(Math.sin(st.t * 9)) * 8 : 0;
    ctx.beginPath(); ctx.ellipse(nokta.x + 4, GROUND + 3, 26 - bob * .8, 5, 0, 0, 7); ctx.fillStyle = 'rgba(23,20,17,.17)'; ctx.fill();
    const rain = st.hava === 'yagmur', ux = nokta.x + 30, uy = GROUND - h - 4;
    if (rain) { // şemsiye
      ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(ux, uy + 58); ctx.arc(ux - 5, uy + 58, 5, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ux - 54, uy); ctx.quadraticCurveTo(ux - 50, uy - 42, ux, uy - 46); ctx.quadraticCurveTo(ux + 50, uy - 42, ux + 54, uy);
      for (let k = 2; k >= -2; k--) ctx.quadraticCurveTo(ux + k * 21.6 + 10.8, uy - 9, ux + k * 21.6 - 10.8, uy);
      ctx.closePath(); ctx.fillStyle = N.SEAL; ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(23,20,17,.45)'; ctx.lineWidth = 1.5; ctx.beginPath(); [-32, 0, 32].forEach((o) => { ctx.moveTo(ux, uy - 46); ctx.quadraticCurveTo(ux + o * .8, uy - 30, ux + o, uy - 3); }); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ux - 40, uy - 14); ctx.quadraticCurveTo(ux - 36, uy - 34, ux - 14, uy - 40); ctx.stroke(); ctx.lineCap = 'butt';
    }
    drawNoktaChar(nokta.x, GROUND, { moving, dir: nokta.dir || 1, t: st.t, happy, umbrella: rain ? { x: ux - 2, y: uy + 42 } : null });
    if (bubble && st.t < bubble.until && !moving) {
      ctx.font = `400 21px ${N.BRUSH}`; const words = bubble.text.split(' '), lines = []; let ln = '';
      words.forEach((wd) => { const tst = ln ? ln + ' ' + wd : wd; if (ctx.measureText(tst).width > 210 && ln) { lines.push(ln); ln = wd; } else ln = tst; }); lines.push(ln);
      const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 26, bh = lines.length * 24 + 16, bx = nokta.x + 20, by = GROUND - h - 30 - bh;
      const a = Math.min(1, (bubble.until - st.t) * 2, (st.t - bubble.from) * 4); ctx.globalAlpha = a;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 12) : ctx.rect(bx, by, bw, bh); ctx.fillStyle = N.SHEET; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + 14, by + bh - 1); ctx.lineTo(bx + 4, by + bh + 16); ctx.lineTo(bx + 30, by + bh - 1); ctx.fillStyle = N.SHEET; ctx.fill(); ctx.beginPath(); ctx.moveTo(bx + 14, by + bh); ctx.lineTo(bx + 4, by + bh + 16); ctx.lineTo(bx + 30, by + bh); ctx.stroke();
      ctx.fillStyle = N.INK; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; lines.forEach((l, i) => ctx.fillText(l, bx + 13, by + 9 + i * 24)); ctx.globalAlpha = 1;
    }
  }
  let bubble = null;
  const speak = (text, sec = 4.5) => { bubble = { text, from: st.t, until: st.t + sec }; };
  function markers() {
    layer(1);
    STS.forEach((S, i) => {
      const y = S.my, x = S.mx, b = Math.sin(st.t * 2.5 + i) * 6, done = stationDone(S), cur = i === st.cur;
      if (cur) { const ph = (st.t * .8) % 1; ctx.beginPath(); ctx.arc(x, y + b, 20 + ph * 22, 0, 7); ctx.strokeStyle = `rgba(232,163,61,${1 - ph})`; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x, y + b, 20, 0, 7); ctx.fillStyle = done ? N.AMBER : cur ? N.INK : N.SHEET; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = `400 24px ${N.BRUSH}`; ctx.fillStyle = cur && !done ? N.SHEET : N.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(done ? '✓' : String(i + 1), x, y + b + 1);
    });
    T.avlar.forEach((A) => {
      if (!st.av[A.id] || A.dyn) return;
      ctx.beginPath(); ctx.arc(A.x, A.y, A.r, 0, 7); ctx.strokeStyle = N.AMBER; ctx.lineWidth = 3; ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = `400 22px ${N.BRUSH}`; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,250,240,.95)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeText(A.ad, A.x, A.y - A.r - 12); ctx.fillStyle = N.DEEP; ctx.fillText(A.ad, A.x, A.y - A.r - 12);
    });
  }
  function overlayFx() {
    const P = PAL[st.hava]; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (P.tint) { ctx.fillStyle = P.tint; ctx.fillRect(0, 0, innerWidth, innerHeight); }
    if (st.hava === 'aksam') {
      layer(1); ctx.globalCompositeOperation = 'lighter'; LAMPS.forEach(lampGlow);
      for (let i = 0; i < 34; i++) { // ateş böcekleri
        const bx = [370, 1220, 2530, 5090, 4800, 3850, -600, 3500, 5470, 6200, 7660][i % 11] + Math.sin(st.t * .5 + i * 1.7) * 90, by = GROUND - 70 + Math.cos(st.t * .7 + i * 1.3) * 60, a = .5 + .5 * Math.sin(st.t * 3 + i);
        const gl = ctx.createRadialGradient(bx, by, 0, bx, by, 9); gl.addColorStop(0, `rgba(255,230,120,${a})`); gl.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(bx, by, 9, 0, 7); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (st.hava === 'yagmur') {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.strokeStyle = 'rgba(60,70,85,.35)'; ctx.lineWidth = 1.4; ctx.beginPath();
      const n = Math.round(innerWidth / 9);
      for (let i = 0; i < n; i++) { const x = ((i * 97.3) % innerWidth) + ((st.t * 160) % 40), y = ((i * 53.7 + st.t * 700) % (innerHeight + 40)) - 40; ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 18); }
      ctx.stroke();
    }
  }

  let last = performance.now();
  /* ══════════ ortam sesleri: uzaklığa göre kısılır, ses kapalıysa susar ══════════ */
  const amb = { ac: null, noise: null, rain: null, water: null, nextBird: 3, nextCricket: 1, lastBell: 0, trainP: 0 };
  const sesKapali = () => { try { return localStorage.getItem('nokta-ses') === 'kapali'; } catch (_) { return false; } };
  const near = (x, R = 900) => Math.max(0, 1 - Math.abs(cam.x - x) / R);
  function ambStart() {
    if (amb.ac) { if (amb.ac.state === 'suspended') amb.ac.resume(); return; }
    try {
      const ac = (amb.ac = new (window.AudioContext || window.webkitAudioContext)());
      const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const loop = (type, f, q) => { const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const gn = ac.createGain(); gn.gain.value = 0; s.connect(fl).connect(gn).connect(ac.destination); s.start(); return gn; };
      amb.rain = loop('lowpass', 1400, .4); amb.water = loop('bandpass', 900, .8);
    } catch (_) { amb.ac = null; }
  }
  addEventListener('pointerdown', ambStart, { passive: true }); addEventListener('keydown', ambStart);
  function blip(f0, f1, dur, vol, type = 'sine', delay = 0) {
    const ac = amb.ac; if (!ac || vol < .002) return;
    const t = ac.currentTime + delay, o = ac.createOscillator(), gn = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(vol, t + .012); gn.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(gn).connect(ac.destination); o.start(t); o.stop(t + dur + .05);
  }
  function whistle(vol) { // buharlı tren düdüğü: iki ses birlikte
    const ac = amb.ac; if (!ac || vol < .002) return;
    const t = ac.currentTime, lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800; lp.connect(ac.destination);
    [587, 740].forEach((f) => { const o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f * .96, t); o.frequency.linearRampToValueAtTime(f, t + .15);
      gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(vol, t + .08); gn.gain.setValueAtTime(vol, t + .9); gn.gain.exponentialRampToValueAtTime(.0001, t + 1.3); o.connect(gn).connect(lp); o.start(t); o.stop(t + 1.4); });
  }
  function ambTick(dt) {
    const ac = amb.ac; if (!ac) return;
    const off = sesKapali() || document.hidden, now = ac.currentTime;
    amb.rain.gain.setTargetAtTime(off || st.hava !== 'yagmur' ? 0 : .05, now, .4);
    amb.water.gain.setTargetAtTime(off ? 0 : .035 * near(FX, 700), now, .2);
    if (off) return;
    if (st.hava === 'sabah' && (amb.nextBird -= dt) < 0) { // kuş cıvıltısı
      amb.nextBird = 3 + Math.random() * 6; const v = .025 + .02 * Math.random(), f = 2400 + Math.random() * 1600, n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) blip(f, f * 1.35, .09, v, 'sine', i * .13);
    }
    if (st.hava === 'aksam' && (amb.nextCricket -= dt) < 0) { // cırcır böceği
      amb.nextCricket = 1.4 + Math.random() * 2; for (let i = 0; i < 3; i++) blip(4300, 4200, .04, .012, 'square', i * .07);
    }
    const p = st.t % 26; // tren gelirken ve kalkarken düdük çalar
    if ((amb.trainP < .2 && p >= .2) || (amb.trainP < 15.1 && p >= 15.1)) whistle(.05 * near(trainFront().x, 1300));
    amb.trainP = p;
    const m = Math.floor(st.t / 120); // iki dakikada bir kule çanı (kasabanın "saat başı")
    if (m > amb.lastBell) { amb.lastBell = m; const v = near(650, 1600); if (v > .05) { bellAmp = 1; [523, 392, 523, 392].forEach((f, i) => blip(f, f * .995, 1.2, .1 * v, 'sine', i * .38)); } }
  }
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; if (!N.reduced) st.t += dt; else st.t += dt * .25;
    const k = N.reduced ? 1 : 1 - Math.pow(.002, dt);
    if (!panning) cam.x += (cam.tx - cam.x) * k;
    ambTick(dt);
    const sp = (260 + Math.abs(nokta.tx - nokta.x) * 1.4) * dt, wasMoving = Math.abs(nokta.tx - nokta.x) > 2; nokta.x += Math.max(-sp, Math.min(sp, nokta.tx - nokta.x));
    if (wasMoving && Math.abs(nokta.tx - nokta.x) <= 2 && pendingSay) { speak(pendingSay); pendingSay = null; nokta.happyUntil = st.t + 2.2; }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    sky(); balloon(); birds(); farLayer(); midLayer(); groundLayer(); noktaDraw(); overlayFx(); markers(); foreground();
    if (zoomOpen) Z.render();
    requestAnimationFrame(frame);
  }
  let pendingSay = null;

  /* ══════════ dünyada gezinme ══════════ */
  let panning = false, pdown = null;
  cv.addEventListener('pointerdown', (e) => { pdown = { x: e.clientX, y: e.clientY, cam: cam.x, moved: false }; try { cv.setPointerCapture(e.pointerId); } catch (_) {} });
  cv.addEventListener('pointermove', (e) => {
    if (!pdown) { cv.style.cursor = hitWorld(e.clientX, e.clientY) ? 'pointer' : 'grab'; return; }
    const dx = e.clientX - pdown.x; if (Math.abs(dx) > 6) pdown.moved = true;
    if (pdown.moved && !panning && innerWidth <= 700 && !st.cardMin) { st.cardMin = true; renderCard(); } // telefonda gezerken kart şeride iner
    if (pdown.moved) { panning = true; cv.classList.add('grabbing'); cam.x = cam.tx = clampCam(pdown.cam - dx / s); }
  });
  const pup = (e) => {
    if (!pdown) return; const p = pdown; pdown = null; panning = false; cv.classList.remove('grabbing');
    if (!p.moved) { const h = hitWorld(e.clientX, e.clientY); if (h) onHit(h); }
  };
  cv.addEventListener('pointerup', pup); cv.addEventListener('pointercancel', () => { pdown = null; panning = false; });
  cv.addEventListener('wheel', (e) => { e.preventDefault(); cam.tx = clampCam(cam.tx + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / s); }, { passive: false });

  function hitWorld(cx, cy) {
    const w = toWorld(cx, cy);
    const av = (id) => T.avlar.find((A) => A.id === id);
    if (st.hava !== 'yagmur') { const b = birdsAt(), q = toLayer(cx, cy, .2); if (g.dist(q, { x: b.x - 45, y: b.y }) < 75) return { av: av('kuslar') }; }
    const bk = bikeAt(); if (g.dist(w, { x: bk.x - 30, y: bk.y - 21 }) < 30 || g.dist(w, { x: bk.x + 30, y: bk.y - 21 }) < 30) return { av: av('tekerlek') };
    for (const A of T.avlar) if (!A.dyn && g.dist(w, A) < A.r) return { av: A };
    if (g.dist(w, { x: 650, y: 140 }) < 36) return { bell: true };
    for (let k = 0; k < STS.length; k++) { const [x0, x1, y0, y1] = STS[k].hit; if (w.x > x0 && w.x < x1 && w.y > y0 && w.y < y1) return { st: k }; }
    if (Math.abs(w.x - nokta.x) < 50 && w.y > GROUND - 120 && w.y < GROUND) return { nokta: true };
    return null;
  }
  const NOKTA_SOZ = ['Kasabada 8 şekil sakladım. Bazıları hareket ediyor!', 'Sence bir doğru hiç biter mi?', 'Bir noktadan sonsuz doğru geçer. Ben de bir noktayım!', 'Kuşlar V biçiminde uçuyor. O V bir açı!', 'Bisikletin tekerleğine bak: teller birer yarıçap.', 'Güvercinleri ürkütmeden yürümek zor!'];
  let soz = 0;
  function ring() { bellAmp = 1; [523, 392, 523, 392].forEach((f, i) => setTimeout(() => N.sfx.tick && toneBell(f), i * 380)); }
  function toneBell(f) { try { const ac = toneBell.ac || (toneBell.ac = new (window.AudioContext || window.webkitAudioContext)()); if (localStorage.getItem('nokta-ses') === 'kapali') return; const o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(.0001, ac.currentTime); gn.gain.exponentialRampToValueAtTime(.12, ac.currentTime + .01); gn.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + 1.2); o.connect(gn).connect(ac.destination); o.start(); o.stop(ac.currentTime + 1.3); } catch (_) {} }
  function onHit(h) {
    if (h.av) {
      if (!st.av[h.av.id]) { st.av[h.av.id] = true; persist(); N.sfx.good(); addLog('av', `${h.av.ad}: ${h.av.metin.replace(/<[^>]+>/g, '')}`); }
      toast(h.av.metin); renderAv(); return;
    }
    if (h.bell) { ring(); speak('Dan, dan! Saat kaç acaba? Kolların arasındaki açıya bak.'); return; }
    if (h.nokta) { speak(NOKTA_SOZ[soz++ % NOKTA_SOZ.length]); N.sfx.tick(); return; }
    if (h.st != null) { if (h.st === st.cur) openZoom(); else go(h.st); }
  }

  /* ══════════ arayüz ══════════ */
  function renderStations() {
    $('#stations').innerHTML = STS.map((S, i) => `<button class="st-btn ${stationDone(S) ? 'done' : ''}" type="button" data-i="${i}" aria-current="${i === st.cur}"><b>${stationDone(S) ? '✓' : i + 1}</b><span>${S.ad}</span></button>`).join('');
    $('#stations').querySelectorAll('button').forEach((b) => (b.onclick = () => go(+b.dataset.i)));
  }
  function renderAv() { const n = T.avlar.filter((A) => st.av[A.id]).length; $('#avBtn').textContent = `şekil avı ${n}/${T.avlar.length}`; }
  function renderCard() {
    const S = STS[st.cur], el = $('#scard'), picked = st.sence[S.id];
    const allDone = stationDone(S);
    el.className = 'ui scard' + (st.cardMin ? ' min' : '');
    el.innerHTML = `<div class="head"><img src="../img/nokta.png" alt="" id="cardImg"><div><span class="code">${st.cur + 1} · ${S.kod}</span><h2>${S.ad}</h2></div>
      <button class="chip-btn fold" id="fold" type="button" aria-expanded="${!st.cardMin}">${st.cardMin ? 'aç' : 'küçült'}</button></div>
      ${st.cardMin ? `<div class="minrow"><button class="btn primary" id="zoomBtn" type="button">🔍 Yakından incele</button><span class="small">${S.gorevler.filter((t) => isDone(S.id, t.id)).length}/${S.gorevler.length} görev</span></div>` : `<div class="body">
        <p>${S.gozlem}</p>
        <span class="lbl">Sence?</span><div class="q">${S.soru}</div>
        ${picked == null ? '<div id="senceBox"></div>' : `<p class="picked">Tahminin: <b>${S.secenekler[picked]}</b>. ${allDone ? (picked === S.dogru ? 'Gözlemin tahminini doğruladı!' : 'Gözlemin farklı bir şey gösterdi; açıklamaya bak.') : 'Şimdi yakından inceleyip dene.'}</p>`}
        <div class="row2"><button class="btn primary big" id="zoomBtn" type="button">🔍 Yakından incele</button></div>
        <span class="lbl">Görevler</span>
        <ul class="tasks">${S.gorevler.map((t) => `<li class="${isDone(S.id, t.id) ? 'ok' : ''}"><i></i><span>${t.metin}</span></li>`).join('')}</ul>
        <span class="lbl">Açıklama</span>
        ${allDone || st.showExp === S.id ? `<div class="explain">${S.aciklama}</div>` : '<button class="btn" id="expBtn" type="button">Açıklamayı göster</button> <span class="small">Önce görevleri denemeni öneririm.</span>'}
        <div class="row2"><a class="btn" href="${S.oyun.url}">Pekiştir: ${S.oyun.ad} ↗</a>${st.cur < STS.length - 1 ? `<button class="btn" id="nextSt" type="button">Sonraki nokta →</button>` : ''}</div>
      </div>`}`;
    if (picked == null && !st.cardMin) N.choices(el.querySelector('#senceBox'), S.secenekler.map((t, i) => ({ t, i, ok: true })), (o) => { st.sence[S.id] = o.i; persist(); addLog(S.id, `Tahminim: ${o.t}`); N.sfx.tick(); setTimeout(renderCard, 350); }, 'one');
    $('#fold').onclick = () => { st.cardMin = !st.cardMin; renderCard(); };
    $('#zoomBtn').onclick = openZoom;
    const eb = $('#expBtn'); if (eb) eb.onclick = () => { st.showExp = S.id; renderCard(); };
    const nb = $('#nextSt'); if (nb) nb.onclick = () => go(st.cur + 1);
    $('#presentKod').textContent = `${st.cur + 1} · ${S.ad} · ${S.kod}`; $('#presentSoru').textContent = S.sunum;
  }
  function go(i) {
    if (i < 0 || i >= STS.length) return;
    st.cur = i; st.showExp = null; cam.tx = focusX(i); nokta.tx = STS[i].x + STS[i].nx;
    if (Math.abs(nokta.tx - nokta.x) <= 2) speak(STS[i].varis); else { pendingSay = STS[i].varis; bubble = null; }
    renderStations(); renderCard(); N.sfx.tick();
    const im = $('#cardImg'); if (im) { im.classList.remove('hop'); void im.offsetWidth; im.classList.add('hop'); }
  }

  /* ══════════ yakından bak ══════════ */
  const ZW = 900, ZH = 600;
  const Z = (N.stage = new N.Stage($('#zcv'), ZW, ZH));
  let zoomOpen = false;
  const clock = { h: 60, m: 0, prot: false, rot: 0, run: null };
  const hourTxt = () => { const a = Math.floor(clock.h / 30) || 12, b = a % 12 + 1; return clock.h % 30 ? `${a} ile ${b} arası` : String(a); };
  const map = { gul: 75, lale: 145, measures: false, rows: [], laleOn: false };
  const pool = { A: null, B: null, t: 0, delay: false, play: null };

  function openZoom() {
    zoomOpen = true; $('#zoom').classList.add('open'); const S = STS[st.cur];
    Z.onDown = Z.onMove = Z.onUp = null;
    ({ tren: setupTren, saat: setupClock, kavsak: setupMap, cini: setupCini, kopru: setupKopru, cesme: setupPool, pastane: setupPastane, pazar: setupPazar })[S.id]();
    renderZSide(); setTimeout(() => { Z.resize(); }, 30);
    addEventListener('keydown', zoomEsc);
  }
  function closeZoom() { stopClock(); zoomOpen = false; $('#zoom').classList.remove('open'); if (pool.play) { clearInterval(pool.play); pool.play = null; } removeEventListener('keydown', zoomEsc); renderCard(); }
  const zoomEsc = (e) => { if (e.key === 'Escape') closeZoom(); };
  $('#zoom').addEventListener('click', (e) => { if (e.target.id === 'zoom') closeZoom(); });
  function hint(html) { const h = $('#zhint'); if (!h) return; h.innerHTML = html; h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop'); }
  function renderZSide() {
    if (!zoomOpen) return;
    const S = STS[st.cur], el = $('#zside');
    el.innerHTML = `<div class="row" style="justify-content:space-between"><h3 id="zTitle">${S.ad}</h3><button class="chip-btn" id="zClose" type="button">kapat ✕</button></div>
      <div class="hint" id="zhint">${zhint || S.gozlem}</div><div id="zctl"></div>
      <span class="label" style="margin-top:4px">Görevler</span>
      <ul class="tasks">${S.gorevler.map((t) => `<li class="${isDone(S.id, t.id) ? 'ok' : ''}"><i></i><span>${t.metin}</span></li>`).join('')}</ul>`;
    $('#zClose').onclick = closeZoom;
    ({ tren: ctlTren, saat: ctlClock, kavsak: ctlMap, cini: ctlCini, kopru: ctlKopru, cesme: ctlPool, pastane: ctlPastane, pazar: ctlPazar })[S.id]($('#zctl'));
  }
  let zhint = '';
  const say = (html) => { zhint = html; hint(html); };

  /* yakın planda tek etkinlik: parçaya göre kaydır, büyüt; dokunuşu geri çevir */
  function partWrap(state, parts, bg) {
    const draw = Z.draw, down = Z.onDown, move = Z.onMove, up = Z.onUp, T = () => parts[state.part];
    const inv = (p) => { if (!p) return p; const t = T(); return { x: (p.x - t.dx) / t.k, y: (p.y - t.dy) / t.k }; };
    Z.draw = (c) => { c.fillStyle = bg; c.fillRect(0, 0, ZW, ZH); const t = T(); c.save(); c.translate(t.dx, t.dy); c.scale(t.k, t.k); draw(c); c.restore(); };
    Z.onDown = (p) => down && down(inv(p)); Z.onMove = (p) => move && move(inv(p)); Z.onUp = (p) => up && up(inv(p));
  }
  function partTabs(host, state, list, sid, onSwitch) {
    const firstOpen = list.findIndex(([, , tid]) => !isDone(sid, tid));
    const html = `<div class="row" style="gap:6px">${list.map(([k, ad, tid], i) => `<button class="btn ${state.part === k ? 'primary' : ''}" data-part="${k}" type="button" style="padding:8px 10px">${isDone(sid, tid) ? '✓ ' : i === firstOpen && state.part !== k ? '→ ' : ''}${i + 1}. ${ad}</button>`).join('')}</div>`;
    host.insertAdjacentHTML('afterbegin', html);
    host.querySelectorAll('[data-part]').forEach((b) => (b.onclick = () => { state.part = b.dataset.part; Z.dragK = null; onSwitch(); renderZSide(); Z.ask(); }));
  }
  const knob = (c, p, hot) => { c.beginPath(); c.arc(p.x, p.y, hot ? 15 : 12, 0, 7); c.fillStyle = hot ? N.AMBER : N.SHEET; c.fill(); c.lineWidth = 3; c.strokeStyle = N.DEEP; c.stroke(); };
  const turnDelta = (a, b) => { let dl = a - b; while (dl > Math.PI) dl -= 2 * Math.PI; while (dl < -Math.PI) dl += 2 * Math.PI; return dl; };

  /* ── kesir yardımcıları ── */
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  function frac(c, a, b, x, y, size = 40, color = N.INK) { // üst üste yazılmış kesir
    d.text(c, String(a), x, y - size * .52, { size, color, halo: false }); d.text(c, String(b), x, y + size * .58, { size, color, halo: false });
    const w = Math.max(String(a).length, String(b).length) * size * .42 + 10; c.strokeStyle = color; c.lineWidth = Math.max(2, size / 14); c.beginPath(); c.moveTo(x - w / 2, y + 2); c.lineTo(x + w / 2, y + 2); c.stroke();
  }
  const dec = (v) => N.fmt(v, 2);

  /* ── Pastane: tepsi (daire modeli), ölçü kabı (tam sayılı kesir + sayı doğrusu), yüzlük kart ── */
  const PAS_ORD = g.pick([[3, 4], [2, 3], [3, 5], [5, 6], [1, 2], [2, 5]]);
  const PAS_CUP = g.pick([[9, '2 1/4'], [7, '1 3/4'], [11, '2 3/4'], [5, '1 1/4']]); // çeyrek bardak cinsinden
  const PAS_YUZ = g.pick([{ t: '%25 indirim', v: 25 }, { t: '0,75 kg peynir', v: 75 }, { t: '3/5 kg kakao', v: 60 }, { t: '%40 şeker', v: 40 }]);
  const pas = { part: null, n: 4, sel: new Set(), firstN: 0, q: 0, grid: new Set(), paint: null };
  const PAS_LIST = [['tepsi', 'Tepsi', 'denk'], ['kap', 'Ölçü kabı', 'kap'], ['yuzluk', 'Yüzlük kart', 'yuzluk']];
  const PAS_HINT = {
    tepsi: `Sipariş: <b>${PAS_ORD[0]}/${PAS_ORD[1]} tepsi baklava</b>. Önce dilim sayısını seç, sonra dilimlere dokunarak siparişi göster.`,
    kap: `Tarif: <b>${PAS_CUP[1]} bardak un</b>. Bardaklara dokunarak doldur. Her bardak 4 eş parçaya bölünmüş.`,
    yuzluk: `Sipariş: <b>${PAS_YUZ.t}</b>. 100 kareden o kadarını boya (sürükleyerek de boyayabilirsin).`,
  };
  const TC = { x: 300, y: 320 }, TRAD = 200, CUPS = [{ x: 120 }, { x: 290 }, { x: 460 }], CUP_W = 120, CUP_TOP = 120, CUP_BOT = 400;
  const GX = 80, GY = 60, GC = 46;
  function sliceAt(p) { if (g.dist(p, TC) > TRAD + 10) return -1; const a = (Math.atan2(p.y - TC.y, p.x - TC.x) + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); return Math.floor(a / (2 * Math.PI / pas.n)); }
  function checkTepsi() {
    const k = pas.sel.size, [a, b] = PAS_ORD;
    if (k * b !== a * pas.n || !k) return;
    if (!isDone('pastane', 'model')) { pas.firstN = pas.n; N.sfx.good(); say(`Tam sipariş: <b>${k}/${pas.n}</b> tepsi. Şimdi dilim sayısını değiştir ve <b>aynı miktarı</b> başka sayıda dilimle göster.`); addLog('pastane', `Tepside ${k}/${pas.n} = ${a}/${b} gösterildi.`); markDone('pastane', 'model'); }
    else if (pas.n !== pas.firstN && !isDone('pastane', 'denk')) { N.sfx.good(); say(`<b>${k}/${pas.n}</b> ile <b>${a}/${b}</b> aynı miktar: bunlar <b>denk kesirler</b>. Dilimler ${pas.n > b ? 'küçüldü ama sayısı arttı' : 'büyüdü ama sayısı azaldı'}.`); addLog('pastane', `Denk kesir: ${k}/${pas.n} = ${a}/${b}`); markDone('pastane', 'denk'); }
  }
  function setupPastane() {
    const open = PAS_LIST.find(([, , tid]) => !isDone('pastane', tid)); pas.part = pas.part || (open ? open[0] : 'tepsi');
    zhint = PAS_HINT[pas.part];
    Z.draw = (c) => {
      c.fillStyle = '#f3e9d8'; c.fillRect(0, 0, ZW, ZH);
      const P = pas.part;
      if (P === 'tepsi') {
        c.beginPath(); c.ellipse(TC.x + 10, TC.y + 16, TRAD + 18, TRAD + 12, 0, 0, 7); c.fillStyle = 'rgba(60,40,25,.15)'; c.fill();
        d.circle(c, TC, TRAD + 14, { fill: '#c9973f', w: 3.5 });
        for (let i = 0; i < pas.n; i++) {
          const a0 = -Math.PI / 2 + i * 2 * Math.PI / pas.n, a1 = a0 + 2 * Math.PI / pas.n, on = pas.sel.has(i);
          c.beginPath(); c.moveTo(TC.x, TC.y); c.arc(TC.x, TC.y, TRAD, a0, a1); c.closePath(); c.fillStyle = on ? '#d9a650' : '#f6ecd6'; c.fill();
          if (on) { c.save(); c.clip(); c.strokeStyle = 'rgba(120,70,20,.35)'; c.lineWidth = 2; c.beginPath(); for (let k = -TRAD; k < TRAD; k += 22) { c.moveTo(TC.x + k, TC.y - TRAD); c.lineTo(TC.x + k + TRAD, TC.y); c.moveTo(TC.x + k + TRAD, TC.y - TRAD); c.lineTo(TC.x + k, TC.y); c.moveTo(TC.x + k, TC.y); c.lineTo(TC.x + k + TRAD, TC.y + TRAD); c.moveTo(TC.x + k + TRAD, TC.y); c.lineTo(TC.x + k, TC.y + TRAD); } c.stroke(); c.restore(); }
          d.seg(c, TC, g.polar(TC, TRAD, -a0), { w: 2.5 });
        }
        d.circle(c, TC, TRAD, { w: 3 });
        d.text(c, 'Sipariş', 700, 70, { size: 26, color: N.SOFT }); frac(c, PAS_ORD[0], PAS_ORD[1], 700, 140, 44, N.DEEP); d.text(c, 'tepsi', 700, 210, { size: 26, color: N.SOFT });
        d.seg(c, { x: 600, y: 255 }, { x: 800, y: 255 }, { w: 1.5, color: N.SOFT, dash: [5, 6] });
        d.text(c, 'Senin tepsin', 700, 300, { size: 26, color: N.SOFT }); frac(c, pas.sel.size, pas.n, 700, 375, 56);
        const eq = pas.sel.size * PAS_ORD[1] === PAS_ORD[0] * pas.n && pas.sel.size;
        d.text(c, eq ? '= sipariş ✓' : `${pas.n} eş dilim, ${pas.sel.size} tanesi seçili`, 700, 470, { size: 24, color: eq ? N.DEEP : N.SOFT });
      }
      if (P === 'kap') {
        const q = pas.q;
        CUPS.forEach((C, i) => {
          const f = Math.max(0, Math.min(4, q - i * 4)), x = C.x, w = CUP_W, hh = CUP_BOT - CUP_TOP;
          const cup = [{ x, y: CUP_TOP }, { x: x + w, y: CUP_TOP }, { x: x + w - 12, y: CUP_BOT }, { x: x + 12, y: CUP_BOT }];
          if (f) { c.save(); d.poly(c, cup, { noStroke: true, fill: 'transparent' }); c.clip(); c.fillStyle = '#f8f1e2'; c.fillRect(x, CUP_BOT - hh * f / 4, w, hh * f / 4); for (let k = 0; k < 40; k++) { c.fillStyle = 'rgba(184,116,26,.25)'; c.beginPath(); c.arc(x + 10 + (k * 37) % (w - 20), CUP_BOT - 6 - (k * 53) % Math.max(8, hh * f / 4 - 8), 1.6, 0, 7); c.fill(); } c.restore(); }
          d.poly(c, cup, { w: 3.5, fill: f ? null : 'rgba(255,255,255,.35)' });
          for (let k = 1; k < 4; k++) { const y = CUP_BOT - hh * k / 4; d.seg(c, { x: x + w - 12 - 2, y }, { x: x + w - 40, y }, { w: 2.5, color: N.DEEP }); d.text(c, `${k}/4`, x + w - 58, y, { size: 16, font: N.MONO, color: N.DEEP }); }
          c.strokeStyle = N.INK; c.lineWidth = 3; c.beginPath(); c.moveTo(x + w, CUP_TOP + 30); c.quadraticCurveTo(x + w + 34, CUP_TOP + 60, x + w - 6, CUP_TOP + 120); c.stroke();
          d.text(c, `${i + 1}. bardak`, x + w / 2, CUP_BOT + 26, { size: 22, color: N.SOFT });
        });
        const whole = Math.floor(q / 4), r = q % 4;
        d.text(c, 'Tarif', 760, 70, { size: 26, color: N.SOFT }); d.text(c, `${PAS_CUP[1]} bardak`, 760, 112, { size: 36, color: N.DEEP });
        d.text(c, 'Doldurduğun', 760, 175, { size: 24, color: N.SOFT });
        d.text(c, q ? (whole ? `${whole}${r ? ` ${r}/4` : ''}` : `${r}/4`) : '0', 760, 220, { size: 40 });
        d.text(c, `= ${q}/4 = ${dec(q / 4)}`, 760, 275, { size: 30, color: N.DEEP });
        // sayı doğrusu 0–3
        const L0 = 120, L1 = 700, LY = 520, X = (v) => L0 + (L1 - L0) * v / 3;
        d.seg(c, { x: L0 - 20, y: LY }, { x: L1 + 30, y: LY }, { w: 3 });
        for (let k = 0; k <= 12; k++) { const big = k % 4 === 0; d.seg(c, { x: X(k / 4), y: LY - (big ? 14 : 8) }, { x: X(k / 4), y: LY + (big ? 14 : 8) }, { w: big ? 3 : 2 }); if (big) d.text(c, String(k / 4), X(k / 4), LY + 34, { size: 24 }); }
        if (q) { const mx = X(q / 4); c.beginPath(); c.moveTo(mx, LY - 6); c.lineTo(mx - 10, LY - 26); c.lineTo(mx + 10, LY - 26); c.closePath(); c.fillStyle = N.AMBER; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke(); }
        d.text(c, 'sayı doğrusu', L1 + 70, LY, { size: 20, color: N.SOFT });
      }
      if (P === 'yuzluk') {
        for (let r = 0; r < 10; r++) for (let k = 0; k < 10; k++) { const on = pas.grid.has(r * 10 + k); c.fillStyle = on ? N.AMBER : '#fffaf0'; c.fillRect(GX + k * GC, GY + r * GC, GC, GC); }
        c.strokeStyle = 'rgba(23,20,17,.35)'; c.lineWidth = 1.2; c.beginPath(); for (let k = 0; k <= 10; k++) { c.moveTo(GX + k * GC, GY); c.lineTo(GX + k * GC, GY + 10 * GC); c.moveTo(GX, GY + k * GC); c.lineTo(GX + 10 * GC, GY + k * GC); } c.stroke();
        d.poly(c, [{ x: GX, y: GY }, { x: GX + 10 * GC, y: GY }, { x: GX + 10 * GC, y: GY + 10 * GC }, { x: GX, y: GY + 10 * GC }], { w: 3.5 });
        const n = pas.grid.size, gg = gcd(n, 100) || 1;
        d.text(c, 'Sipariş', 745, 70, { size: 26, color: N.SOFT }); d.text(c, PAS_YUZ.t, 745, 112, { size: 30, color: N.DEEP });
        d.text(c, 'Boyadığın', 745, 180, { size: 24, color: N.SOFT });
        frac(c, n, 100, 680, 260, 34); d.text(c, '=', 735, 262, { size: 34 }); d.text(c, dec(n / 100), 800, 262, { size: 34 });
        d.text(c, `%${n}`, 745, 345, { size: 44, color: N.DEEP });
        if (n && gg > 1) { d.text(c, 'sadeleşince', 745, 410, { size: 20, color: N.SOFT }); frac(c, n / gg, 100 / gg, 745, 470, 34, N.DEEP); }
      }
    };
    Z.onDown = (p) => {
      const P = pas.part;
      if (P === 'tepsi') { const i = sliceAt(p); if (i < 0) return; pas.sel.has(i) ? pas.sel.delete(i) : pas.sel.add(i); N.sfx.tick(); checkTepsi(); renderZSide(); Z.ask(); }
      if (P === 'kap') { Z.dragK = 'kap'; Z.onMove(p); }
      if (P === 'yuzluk') { const k = Math.floor((p.x - GX) / GC), r = Math.floor((p.y - GY) / GC); if (k < 0 || k > 9 || r < 0 || r > 9) return; const id = r * 10 + k; pas.paint = !pas.grid.has(id); Z.dragK = 'paint'; Z.onMove(p); }
    };
    Z.onMove = (p) => {
      if (!p || !Z.dragK || !Z.down) return;
      if (Z.dragK === 'kap') {
        const i = CUPS.findIndex((C) => p.x > C.x - 10 && p.x < C.x + CUP_W + 10); if (i < 0) return;
        const f = Math.max(0, Math.min(4, Math.ceil((CUP_BOT - p.y) / ((CUP_BOT - CUP_TOP) / 4) - .15))), q = i * 4 + f;
        if (q !== pas.q) { pas.q = q; N.sfx.tick(); Z.ask(); }
      }
      if (Z.dragK === 'paint') { const k = Math.floor((p.x - GX) / GC), r = Math.floor((p.y - GY) / GC); if (k < 0 || k > 9 || r < 0 || r > 9) return; const id = r * 10 + k; if (pas.grid.has(id) !== pas.paint) { pas.paint ? pas.grid.add(id) : pas.grid.delete(id); Z.ask(); } }
    };
    Z.onUp = () => {
      const k = Z.dragK; Z.dragK = null;
      if (k === 'kap' && pas.q === PAS_CUP[0] && !isDone('pastane', 'kap')) { N.sfx.good(); say(`<b>${PAS_CUP[1]}</b> bardak = <b>${pas.q}/4</b> bardak = <b>${dec(pas.q / 4)}</b> bardak. Tam sayılı kesir, bileşik kesir ve ondalık gösterim: hepsi aynı miktar. Sayı doğrusunda da işaretlendi.`); addLog('pastane', `${PAS_CUP[1]} = ${pas.q}/4 = ${dec(pas.q / 4)} bardak`); markDone('pastane', 'kap'); }
      else if (k === 'kap' && pas.q > PAS_CUP[0]) say(`Fazla doldu: ${pas.q}/4 bardak. Tarif <b>${PAS_CUP[1]}</b> bardak istiyor.`);
      if (k === 'paint') { const n = pas.grid.size; if (n === PAS_YUZ.v && !isDone('pastane', 'yuzluk')) { N.sfx.good(); const gg = gcd(n, 100); say(`Tam <b>${n}</b> kare: <b>${n}/100 = ${dec(n / 100)} = %${n}</b>${gg > 1 ? ` = <b>${n / gg}/${100 / gg}</b>` : ''}. Aynı miktarın dört kılığı!`); addLog('pastane', `Yüzlük kart: ${n}/100 = ${dec(n / 100)} = %${n}`); markDone('pastane', 'yuzluk'); } }
      Z.ask();
    };
    Z.ask();
  }
  function ctlPastane(host) {
    if (pas.part === 'tepsi') host.innerHTML = `<div class="row"><span>Dilim sayısı</span><button class="btn" id="pN-" type="button" aria-label="Dilim sayısını azalt">−</button><b style="font-family:var(--brush);font-size:28px;min-width:34px;text-align:center">${pas.n}</b><button class="btn" id="pN+" type="button" aria-label="Dilim sayısını artır">+</button><button class="btn" id="pClr" type="button">Seçimi sil</button></div>`;
    else if (pas.part === 'kap') host.innerHTML = '<div class="row"><button class="btn" id="pClr" type="button">Bardakları boşalt</button></div>';
    else host.innerHTML = '<div class="row"><button class="btn" id="pClr" type="button">Kartı temizle</button></div>';
    const setN = (n) => { n = Math.max(2, Math.min(12, n)); if (n === pas.n) return; pas.n = n; pas.sel.clear(); N.sfx.tick(); renderZSide(); Z.ask(); };
    const a = $('#pN-'), b = $('#pN\\+'); if (a) a.onclick = () => setN(pas.n - 1); if (b) b.onclick = () => setN(pas.n + 1);
    $('#pClr').onclick = () => { if (pas.part === 'tepsi') pas.sel.clear(); else if (pas.part === 'kap') pas.q = 0; else pas.grid.clear(); renderZSide(); Z.ask(); };
    partTabs(host, pas, PAS_LIST, 'pastane', () => say(PAS_HINT[pas.part]));
  }

  /* ── Pazar: şerit modeli ve sayı doğrusunda karşılaştırma ── */
  const paz = { part: null, s: [[2, 4], [2, 4]], touched: false, tags: [{ ad: 'Ali', t: '3/4 kg', v: .75, p: '%75' }, { ad: 'Ece', t: '0,7 kg', v: .7, p: '%70' }, { ad: 'Can', t: '%72', v: .72, p: '%72' }, { ad: 'Su', t: '2/3 kg', v: 2 / 3, p: '≈ %66,7' }].map((T, i) => ({ ...T, x: null, home: { x: 120 + i * 190, y: 110 } })), drag: -1, off: null, pct: false };
  const PAZ_LIST = [['serit', 'Şeritler', 'denk'], ['dogru', 'Sayı doğrusu', 'encok']];
  const PAZ_HINT = { serit: 'Manav: “Paydası büyük olan kesir büyüktür.” Şeritlerin paylarını ve paydalarını değiştir: iddiayı çürüten bir örnek bul. Şeride dokunarak da pay seçebilirsin.', dogru: 'Etiketleri sürükleyip sayı doğrusunda doğru yere bırak. Zorlanırsan “Yüzdeye çevir” düğmesi yardım eder.' };
  const SX0 = 120, SX1 = 780, SY = [190, 330], SH = 70, NL0 = 100, NL1 = 800, NLY = 430;
  const nlx = (v) => NL0 + (NL1 - NL0) * v;
  function checkSerit() {
    const [[a, b], [c2, d2]] = paz.s, v1 = a / b, v2 = c2 / d2;
    if (paz.touched && b !== d2 && !isDone('pazar', 'varsayim')) {
      const big = b > d2 ? 0 : 1, vb = big ? v2 : v1, vs = big ? v1 : v2;
      if (vb < vs - 1e-9) { N.sfx.good(); const [A, B] = paz.s[big], [C, D] = paz.s[1 - big]; say(`İşte karşı örnek! <b>${A}/${B}</b>’nin paydası daha büyük ama <b>${A}/${B} < ${C}/${D}</b>. Payda büyüyünce parçalar küçülür. Tek bir karşı örnek, iddianın her zaman doğru olmadığını gösterir.`); addLog('pazar', `Karşı örnek: ${A}/${B} < ${C}/${D} (paydası büyük olan daha küçük)`); markDone('pazar', 'varsayim'); return; }
    }
    if (b !== d2 && Math.abs(v1 - v2) < 1e-9 && a && !isDone('pazar', 'denk')) { N.sfx.good(); say(`<b>${a}/${b} = ${c2}/${d2}</b>: şeritler aynı yerde bitiyor. Paydaları farklı ama miktarları eşit: <b>denk kesirler</b>.`); addLog('pazar', `Denk kesirler: ${a}/${b} = ${c2}/${d2}`); markDone('pazar', 'denk'); }
  }
  function setupPazar() {
    const open = PAZ_LIST.find(([, , tid]) => !isDone('pazar', tid)); paz.part = paz.part || (open ? open[0] : 'serit');
    zhint = PAZ_HINT[paz.part];
    Z.draw = (c) => {
      c.fillStyle = '#eef0e6'; c.fillRect(0, 0, ZW, ZH);
      if (paz.part === 'serit') {
        d.text(c, 'Manav: “Paydası büyük olan kesir büyüktür.”', 450, 60, { size: 28, color: N.SEAL });
        paz.s.forEach(([a, b], i) => {
          const y = SY[i], w = (SX1 - SX0) / b;
          for (let k = 0; k < b; k++) { c.fillStyle = k < a ? (i ? '#9bb383' : N.AMBER) : '#fffaf0'; c.fillRect(SX0 + k * w, y, w, SH); }
          for (let k = 1; k < b; k++) d.seg(c, { x: SX0 + k * w, y }, { x: SX0 + k * w, y: y + SH }, { w: 2, sketch: false });
          d.poly(c, rectPts(SX0, y, SX1 - SX0, SH), { w: 3 });
          frac(c, a, b, 60, y + SH / 2, 30, i ? '#4d6b3d' : N.DEEP);
          d.seg(c, { x: SX0 + (SX1 - SX0) * a / b, y: y - 14 }, { x: SX0 + (SX1 - SX0) * a / b, y: y + SH + 14 }, { w: 3, color: N.SEAL });
        });
        const [[a, b], [c2, d2]] = paz.s, v1 = a / b, v2 = c2 / d2, sign = Math.abs(v1 - v2) < 1e-9 ? '=' : v1 > v2 ? '>' : '<';
        d.text(c, `${a}/${b}  ${sign}  ${c2}/${d2}`, 450, 490, { size: 48, color: N.INK });
        d.text(c, 'kırmızı çizgi: şeridin nerede bittiği', 450, 545, { size: 20, color: N.SOFT });
      } else {
        d.seg(c, { x: NL0 - 30, y: NLY }, { x: NL1 + 30, y: NLY }, { w: 3 });
        for (let k = 0; k <= 20; k++) { const big = k % 10 === 0, mid = k === 10; d.seg(c, { x: nlx(k / 20), y: NLY - (big || mid ? 16 : 8) }, { x: nlx(k / 20), y: NLY + (big || mid ? 16 : 8) }, { w: big ? 3 : 2 }); }
        d.text(c, '0', nlx(0), NLY + 38, { size: 28 }); d.text(c, '1', nlx(1), NLY + 38, { size: 28 }); frac(c, 1, 2, nlx(.5), NLY + 52, 22, N.SOFT);
        const placed = paz.tags.filter((T) => T.x != null).sort((p, q) => p.v - q.v);
        paz.tags.forEach((T, i) => {
          let pos;
          if (paz.drag === i) pos = T.cur; else if (T.x != null) { const lv = placed.indexOf(T); pos = { x: nlx(T.v), y: NLY - 70 - lv * 62 }; } else pos = T.home;
          if (T.x != null && paz.drag !== i) d.seg(c, { x: nlx(T.v), y: NLY }, { x: pos.x, y: pos.y + 24 }, { w: 1.6, color: N.DEEP, dash: [4, 4] });
          const w = 150, h = 50;
          c.fillStyle = 'rgba(60,40,25,.15)'; c.fillRect(pos.x - w / 2 + 4, pos.y - h / 2 + 5, w, h);
          d.poly(c, rectPts(pos.x - w / 2, pos.y - h / 2, w, h), { fill: T.x != null ? '#fff3dc' : '#fffaf0', w: 2.5 });
          c.beginPath(); c.arc(pos.x - w / 2 + 20, pos.y, 9, 0, 7); c.fillStyle = '#c4432b'; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 1.5; c.stroke();
          d.text(c, T.ad, pos.x - 22, pos.y, { size: 24, halo: false }); d.text(c, paz.pct ? T.p : T.t, pos.x + 36, pos.y, { size: 17, font: N.MONO, halo: false, color: N.DEEP });
          if (T.x != null) { c.beginPath(); c.arc(nlx(T.v), NLY, 6, 0, 7); c.fillStyle = N.SEAL; c.fill(); }
        });
        if (isDone('pazar', 'sirala')) d.text(c, 'küçükten büyüğe: ' + paz.tags.slice().sort((p, q) => p.v - q.v).map((T) => T.ad).join(' < '), 450, 555, { size: 24, color: N.DEEP });
      }
    };
    const tagPos = (T, i) => { if (T.x == null) return T.home; const placed = paz.tags.filter((q) => q.x != null).sort((p, q) => p.v - q.v); return { x: nlx(T.v), y: NLY - 70 - placed.indexOf(T) * 62 }; };
    Z.onDown = (p) => {
      if (paz.part === 'serit') { const i = SY.findIndex((y) => p.y > y - 6 && p.y < y + SH + 6); if (i < 0 || p.x < SX0 || p.x > SX1) return; const b = paz.s[i][1], k = Math.min(b, Math.floor((p.x - SX0) / ((SX1 - SX0) / b)) + 1); paz.s[i][0] = paz.s[i][0] === k ? k - 1 : k; paz.touched = true; N.sfx.tick(); checkSerit(); renderZSide(); Z.ask(); return; }
      const i = paz.tags.findIndex((T, k) => { const q = tagPos(T, k); return Math.abs(p.x - q.x) < 80 && Math.abs(p.y - q.y) < 30; });
      if (i < 0 || paz.tags[i].x != null) return;
      paz.drag = i; Z.dragK = 'tag'; paz.tags[i].cur = { x: p.x, y: p.y };
    };
    Z.onMove = (p) => { if (!p || Z.dragK !== 'tag' || !Z.down) return; paz.tags[paz.drag].cur = { x: p.x, y: p.y }; Z.ask(); };
    Z.onUp = (p) => {
      if (Z.dragK !== 'tag') return; Z.dragK = null; const T = paz.tags[paz.drag]; paz.drag = -1; const q = p || T.cur;
      if (q && Math.abs(q.y - NLY) < 160 && Math.abs(q.x - nlx(T.v)) < (NL1 - NL0) * .035) { T.x = nlx(T.v); N.sfx.snap(); say(`${T.ad}: <b>${T.t}</b> = ${T.p}. ${T.v > .5 ? 'Yarımdan büyük.' : 'Yarımdan küçük.'}`); addLog('pazar', `${T.ad} ${T.t} sayı doğrusunda ${T.p} yerine kondu.`); }
      else if (q && Math.abs(q.y - NLY) < 160) { N.sfx.bad(); const v = (q.x - NL0) / (NL1 - NL0); say(`${T.ad}’nin etiketi <b>${T.t}</b>. Bıraktığın yer yaklaşık ${N.fmt(Math.max(0, Math.min(1, v)), 2)}. ${T.v > v ? 'Biraz daha sağa' : 'Biraz daha sola'}. İpucu: ${T.t} = <b>${T.p}</b>.`); }
      if (paz.tags.every((t) => t.x != null) && !isDone('pazar', 'sirala')) { N.sfx.good(); say('Dördü de yerinde! Sayı doğrusunda <b>sağdaki daha büyük</b>. Şimdi söyle: en çok çileği kim aldı?'); addLog('pazar', 'Sıralama: ' + paz.tags.slice().sort((a, b) => a.v - b.v).map((t) => `${t.ad} ${t.t}`).join(' < ')); markDone('pazar', 'sirala'); }
      renderZSide(); Z.ask();
    };
    Z.ask();
  }
  function ctlPazar(host) {
    if (paz.part === 'serit') {
      const bs = 'padding:5px 11px;min-width:0', sp = (i, k, v, ad) => `<span class="small" style="width:42px">${ad}</span><button class="btn" style="${bs}" data-z="${i},${k},-1" type="button" aria-label="${ad} azalt">−</button><b style="min-width:22px;text-align:center">${v}</b><button class="btn" style="${bs}" data-z="${i},${k},1" type="button" aria-label="${ad} artır">+</button>`;
      host.innerHTML = paz.s.map(([a, b], i) => `<div style="margin:0 0 8px"><b style="color:${i ? '#4d6b3d' : 'var(--amber-deep)'}">${i ? 'Yeşil' : 'Turuncu'} şerit</b><div class="row" style="gap:6px;flex-wrap:nowrap;margin-top:4px">${sp(i, 0, a, 'pay')}<span style="width:8px"></span>${sp(i, 1, b, 'payda')}</div></div>`).join('');
      host.querySelectorAll('[data-z]').forEach((bt) => (bt.onclick = () => { const [i, k, s2] = bt.dataset.z.split(',').map(Number), f = paz.s[i]; if (k === 0) f[0] = Math.max(0, Math.min(f[1], f[0] + s2)); else { f[1] = Math.max(2, Math.min(12, f[1] + s2)); f[0] = Math.min(f[0], f[1]); } paz.touched = true; N.sfx.tick(); checkSerit(); renderZSide(); Z.ask(); }));
    } else {
      host.innerHTML = `<div class="row"><button class="btn ${paz.pct ? 'primary' : ''}" id="zPct" type="button">${paz.pct ? 'Asıl etiketleri göster' : 'Yüzdeye çevir'}</button><button class="btn" id="zRst" type="button">Etiketleri geri al</button></div>${isDone('pazar', 'sirala') && !isDone('pazar', 'encok') ? '<p class="small" style="margin:8px 0 4px">En çok çileği kim aldı?</p><div class="row" id="zWho"></div>' : ''}`;
      $('#zPct').onclick = () => { paz.pct = !paz.pct; if (paz.pct) addLog('pazar', 'Hepsi yüzdeye çevrildi: %75, %70, %72, %66,7'); renderZSide(); Z.ask(); };
      $('#zRst').onclick = () => { paz.tags.forEach((T) => (T.x = null)); renderZSide(); Z.ask(); };
      const wh = $('#zWho'); if (wh) paz.tags.forEach((T) => { const bt = document.createElement('button'); bt.className = 'btn'; bt.type = 'button'; bt.textContent = T.ad; bt.onclick = () => { if (T.ad === 'Ali') { N.sfx.good(); say('Evet, <b>Ali</b>: 3/4 kg = %75, en sağdaki etiket. Sonra Can (%72), Ece (%70) ve Su (≈ %66,7) geliyor.'); addLog('pazar', 'En çok: Ali (3/4 kg)'); markDone('pazar', 'encok'); } else { N.sfx.bad(); bt.disabled = true; say(`${T.ad}: ${T.t} = ${T.p}. Sayı doğrusunda daha sağda bir etiket var.`); } }; wh.appendChild(bt); });
    }
    partTabs(host, paz, PAZ_LIST, 'pazar', () => say(PAZ_HINT[paz.part]));
  }
  /* ── Tren istasyonu: paralel raylar, dik travers, iki noktadan bir doğru, döner platform ── */
  const R1Y = 110, R2Y = 200, GAUGE_M = 1.43, PX_M = (R2Y - R1Y) / GAUGE_M;
  const TA = { x: 120, y: 380 }, TB = { x: 390, y: 320 }, TT = { x: 690, y: 440 }, TR = 120, T1 = { x: 300, y: R1Y };
  const tren = { tx: 470, gauge: 150, seen: new Set(), lineA: 62, hitB: false, leftB: false, rot: .4, acc: 0, trail: [], moved: false, last: 0 };
  const angAB = () => g.deg(g.ang(TA, TB));
  const fmtM = (px) => N.fmt(px / PX_M, 2);
  const TREN_PARTS = { ray: { dx: 0, dy: 145, k: 1 }, travers: { dx: 0, dy: 145, k: 1 }, tel: { dx: 151, dy: -259, k: 1.3 }, cember: { dx: -412, dy: -250, k: 1.25 } };
  const TREN_LIST = [['ray', 'Raylar', 'paralel'], ['travers', 'Travers', 'travers'], ['tel', 'Telgraf', 'tel'], ['cember', 'Platform', 'cember']];
  const TREN_HINT = { ray: 'Ölçü gönyesini ray boyunca sürükle: iki ray arasındaki uzaklık değişiyor mu?', travers: 'Traversin alt ucundaki halkayı sürükle: travers ne zaman <b>en kısa</b> olur?', tel: 'Cetvelin halkasını A direği etrafında çevir: B’den de geçen kaç doğru bulabilirsin?', cember: 'Platformun ucundaki halkayı tutup <b>tam bir tur</b> çevir: uç nasıl bir iz bırakıyor?' };
  function setupTren() {
    const open = TREN_LIST.find(([, , tid]) => !isDone('tren', tid)); tren.part = tren.part || (open ? open[0] : 'ray');
    zhint = TREN_HINT[tren.part];
    Z.draw = (c) => {
      const P = tren.part;
      if (P === 'ray' || P === 'travers') {
        c.fillStyle = '#d3c8b1'; c.fillRect(-50, R1Y - 36, ZW + 100, R2Y - R1Y + 72);
        for (let i = 0; i < 140; i++) { c.fillStyle = 'rgba(23,20,17,.13)'; c.beginPath(); c.arc((i * 53) % ZW, R1Y - 32 + (i * 29) % (R2Y - R1Y + 64), 2, 0, 7); c.fill(); }
        for (let x = 22; x < ZW; x += 52) { if (P === 'travers' && Math.abs(x + 9 - T1.x) < 34) continue; c.fillStyle = '#9b7653'; c.fillRect(x, R1Y - 22, 18, R2Y - R1Y + 44); c.strokeStyle = 'rgba(23,20,17,.5)'; c.lineWidth = 1.5; c.strokeRect(x, R1Y - 22, 18, R2Y - R1Y + 44); }
        const T2 = { x: tren.tx, y: R2Y }, L = g.dist(T1, T2), perp = Math.abs(tren.tx - T1.x) < .5, ang = Math.atan2(T2.y - T1.y, T2.x - T1.x);
        if (P === 'travers') { c.save(); c.translate(T1.x, T1.y); c.rotate(ang); c.fillStyle = perp ? '#e8b25c' : '#b08a63'; c.fillRect(-22, -10, L + 44, 20); c.strokeStyle = N.INK; c.lineWidth = 2.5; c.strokeRect(-22, -10, L + 44, 20); c.restore(); }
        [R1Y, R2Y].forEach((y, i) => { c.fillStyle = '#8d8f97'; c.fillRect(-50, y - 5, ZW + 100, 10); c.strokeStyle = N.INK; c.lineWidth = 2; c.strokeRect(-52, y - 5, ZW + 104, 10); d.text(c, i ? 'd₂' : 'd₁', 26, y - 20, { size: 26 }); });
        if (P === 'travers') {
          d.seg(c, T1, T2, { w: 3 }); d.dot(c, T1, { r: 6 });
          if (perp) d.right(c, T2, { x: 0, y: -1 }, { x: 1, y: 0 }, 14, { w: 2.5 });
          d.text(c, `${fmtM(L)} m`, (T1.x + T2.x) / 2 + (perp ? -54 : 0), (T1.y + T2.y) / 2 + (perp ? 0 : -26), { size: 28, color: perp ? N.DEEP : N.INK });
          knob(c, T2, Z.dragK === 'trav');
          d.text(c, 'travers: rayların altındaki kalas', 450, R2Y + 80, { size: 22, color: N.SOFT });
        } else {
          const gx = tren.gauge;
          c.save(); c.translate(gx, R1Y); c.beginPath(); c.moveTo(0, -7); c.lineTo(0, -64); c.lineTo(46, -7); c.closePath(); c.fillStyle = 'rgba(232,163,61,.4)'; c.fill(); c.strokeStyle = N.DEEP; c.lineWidth = 2; c.stroke(); c.restore();
          d.seg(c, { x: gx, y: R1Y }, { x: gx, y: R2Y }, { color: N.DEEP, w: 3, dash: [6, 5] }); d.right(c, { x: gx, y: R2Y }, { x: 0, y: -1 }, { x: 1, y: 0 }, 12, { w: 2.5 });
          d.text(c, `${N.fmt(GAUGE_M, 2)} m`, gx + 50, (R1Y + R2Y) / 2, { size: 26, color: N.DEEP });
          knob(c, { x: gx, y: R1Y }, Z.dragK === 'gauge');
          d.text(c, `ölçülen yer: ${tren.seen.size} / 3`, 450, R2Y + 80, { size: 22, color: N.SOFT });
        }
      }
      if (P === 'tel') {
        [TA, TB].forEach((p) => { c.strokeStyle = '#6b4f35'; c.lineWidth = 8; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x, 800); c.stroke(); c.lineWidth = 5; c.beginPath(); c.moveTo(p.x - 22, p.y + 10); c.lineTo(p.x + 22, p.y + 10); c.stroke(); });
        const onB = Math.abs(tren.lineA - angAB()) < .01, u = g.dir(g.rad(tren.lineA));
        if (tren.hitB) d.seg(c, TA, TB, { w: 3.5 });
        d.seg(c, g.sub(TA, g.mul(u, 700)), g.add(TA, g.mul(u, 700)), { w: 2.5, color: onB ? N.DEEP : N.SOFT, dash: [10, 8] });
        d.dot(c, TA, { r: 7, label: 'A', lx: -20, ly: -16 }); d.dot(c, TB, { r: 7, label: 'B', lx: 18, ly: -16 });
        knob(c, g.polar(TA, 170, g.rad(tren.lineA)), Z.dragK === 'line');
      }
      if (P === 'cember') {
        c.beginPath(); c.arc(TT.x, TT.y, 26, 0, 7); c.fillStyle = '#cfc4ad'; c.fill();
        if (tren.trail.length > 1) { c.beginPath(); tren.trail.forEach((a, i) => { const p = g.polar(TT, TR, a); i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); }); c.strokeStyle = N.DEEP; c.lineWidth = 4; c.stroke(); }
        c.save(); c.translate(TT.x, TT.y); c.rotate(-tren.rot); c.fillStyle = '#9b8f80'; c.fillRect(-TR, -16, 2 * TR, 32); c.strokeStyle = N.INK; c.lineWidth = 2.5; c.strokeRect(-TR, -16, 2 * TR, 32);
        c.strokeStyle = '#6f7078'; c.lineWidth = 4; c.beginPath(); c.moveTo(-TR, -7); c.lineTo(TR, -7); c.moveTo(-TR, 7); c.lineTo(TR, 7); c.stroke(); c.restore();
        const e = g.polar(TT, TR, tren.rot); d.seg(c, TT, e, { color: N.DEEP, w: 2.5, dash: [5, 5] });
        d.dot(c, TT, { r: 7, label: 'M', lx: -20, ly: 22 });
        knob(c, e, Z.dragK === 'turn');
        if (isDone('tren', 'cember')) d.text(c, 'her yerde aynı uzaklık: r', 690, 600, { size: 22, color: N.DEEP });
      }
    };
    Z.onDown = (p) => {
      const own = { ray: 'gauge', travers: 'trav', tel: 'line', cember: 'turn' }[tren.part];
      const cand = [['gauge', { x: tren.gauge, y: R1Y }], ['trav', { x: tren.tx, y: R2Y }], ['line', g.polar(TA, 170, g.rad(tren.lineA))], ['turn', g.polar(TT, TR, tren.rot)]].filter(([k]) => k === own);
      const h = cand.find(([, q]) => g.dist(p, q) < Z.hit(28));
      if (h) Z.dragK = h[0]; else if (own === 'turn' && g.dist(p, TT) < TR + 30) Z.dragK = 'turn';
      if (Z.dragK === 'turn') tren.last = g.ang(TT, p);
    };
    Z.onMove = (p) => {
      if (!p || !Z.dragK || !Z.down) return;
      if (Z.dragK === 'gauge') tren.gauge = Math.max(50, Math.min(850, p.x));
      else if (Z.dragK === 'trav') { let x = Math.max(60, Math.min(860, p.x)); if (Math.abs(x - T1.x) < 9) { if (tren.tx !== T1.x) N.sfx.snap(); x = T1.x; } if (x !== tren.tx) tren.moved = true; tren.tx = x; }
      else if (Z.dragK === 'line') {
        let a = g.deg(g.ang(TA, p)); a = ((Math.round(a) + 90) % 180 + 180) % 180 - 90; const ab = angAB();
        if (Math.abs(a - ab) < 2.5) { a = ab; if (!tren.hitB) { tren.hitB = true; N.sfx.snap(); say('Cetvel B’den de geçti: <b>A ve B’den geçen bir doğru</b>. Çevirmeye devam et: B’den geçen başka bir doğru bulabilecek misin?'); addLog('tren', 'A ve B’den geçen doğru bulundu; başka doğru B’den geçmiyor.'); markDone('tren', 'tel'); } }
        else if (tren.hitB && !tren.leftB && Math.abs(a - ab) > 20) { tren.leftB = true; say('Gördün mü? Cetvel B’den ayrıldı. <b>İki noktadan yalnız bir doğru geçer.</b>'); }
        tren.lineA = a;
      } else if (Z.dragK === 'turn') {
        const a = g.ang(TT, p), dl = turnDelta(a, tren.last); tren.last = a; if (g.dist(p, TT) < 12) return;
        tren.rot += dl; tren.acc += dl; tren.trail.push(tren.rot); if (tren.trail.length > 900) tren.trail.shift();
        if (Math.abs(tren.acc) >= 2 * Math.PI - .05 && !isDone('tren', 'cember')) { N.sfx.good(); say('Platformun ucu bir <b>çember</b> çizdi! Uç, merkez M’ye hep aynı uzaklıkta: bu uzaklık <b>yarıçap</b>. Pergel de böyle çalışır.'); addLog('tren', 'Döner platformun ucu tam turda çember çizdi (yarıçap sabit).'); markDone('tren', 'cember'); }
      }
    };
    Z.onUp = () => {
      const k = Z.dragK; Z.dragK = null;
      if (k === 'gauge') {
        tren.seen.add(Math.floor(tren.gauge / 160));
        if (tren.seen.size >= 3 && !isDone('tren', 'paralel')) { say('Üç farklı yerde de <b>1,43 m</b>! Raylar arasındaki uzaklık hiç değişmiyor: raylar <b>paralel</b>, hiç kesişmez.'); addLog('tren', 'Raylar arası uzaklık her yerde 1,43 m → paralel'); markDone('tren', 'paralel'); }
        else if (!isDone('tren', 'paralel')) say(`${tren.seen.size}. ölçüm: <b>1,43 m</b>. Gönyeyi rayın <b>başka bir yerine</b> kaydır.`);
      }
      if (k === 'trav') {
        const L = g.dist(T1, { x: tren.tx, y: R2Y });
        if (tren.tx === T1.x && tren.moved && !isDone('tren', 'travers')) { say('Travers raylara <b>dik</b> oldu ve en kısa hâline geldi: 1,43 m. Bir noktadan bir doğruya en kısa yol <b>dikmedir</b>.'); addLog('tren', 'Dik travers en kısa: 1,43 m (dikme)'); markDone('tren', 'travers'); }
        else if (tren.tx !== T1.x) say(`Eğik travers <b>${fmtM(L)} m</b>. Daha kısa olabilir mi? Ucunu kaydırmaya devam et.`);
      }
    };
    partWrap(tren, TREN_PARTS, '#ece3cf');
    Z.ask();
  }
  function ctlTren(host) {
    host.innerHTML = tren.part === 'cember' ? '<div class="row"><button class="btn" id="trReset" type="button">Platform izini sil</button></div>' : '';
    const rb = $('#trReset'); if (rb) rb.onclick = () => { tren.trail = []; tren.acc = 0; Z.ask(); };
    partTabs(host, tren, TREN_LIST, 'tren', () => say(TREN_HINT[tren.part]));
  }

  /* ── Çini atölyesi: ardışık kesişen doğrular, düzgün çokgen, köşegen, döşeme ── */
  const CC2 = { x: 300, y: 300 }, CR2 = 165, PNAME = { 3: 'üçgen', 4: 'dörtgen', 5: 'beşgen', 6: 'altıgen', 7: 'yedigen', 8: 'sekizgen' };
  const cini = { mode: 'tezgah', n: 6, lines: 0, pts: null, base: null, made: new Set(), diag: [], sel: -1, tile: null, tileT: 0, tried: new Set(), anim: null };
  const regPts = (n) => { const rot = -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n); return Array.from({ length: n }, (_, i) => ({ x: CC2.x + Math.cos(rot + i * 2 * Math.PI / n) * CR2, y: CC2.y + Math.sin(rot + i * 2 * Math.PI / n) * CR2 })); };
  const intAngle = (P, i) => Math.round(g.angleAt(P[(i + P.length - 1) % P.length], P[i], P[(i + 1) % P.length]));
  function regular(P) {
    const s = P.map((p, i) => g.dist(p, P[(i + 1) % P.length])), a = P.map((_, i) => intAngle(P, i));
    return Math.max(...s) - Math.min(...s) < 1.5 && Math.max(...a) - Math.min(...a) <= 1;
  }
  function tilePath(c, pts) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); }
  function ciniTile(c, pts, k, strong) {
    tilePath(c, pts); c.fillStyle = [CINI_BLUE, CINI_TURQ, '#fffaf0'][k % 3]; c.globalAlpha = strong ? 1 : .85; c.fill(); c.globalAlpha = 1; c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
    const cen = pts.reduce((s, p) => ({ x: s.x + p.x / pts.length, y: s.y + p.y / pts.length }), { x: 0, y: 0 });
    tilePath(c, pts.map((p) => g.lerp(cen, p, .45))); c.fillStyle = k % 3 === 2 ? CINI_BLUE : '#fffaf0'; c.fill();
    c.beginPath(); c.arc(cen.x, cen.y, 4, 0, 7); c.fillStyle = N.SEAL; c.fill();
  }
  function startLines() {
    clearInterval(cini.anim); cini.pts = null; cini.diag = []; cini.sel = -1; cini.lines = 0; cini.base = regPts(cini.n);
    say(`Doğruları sırayla çiziyorum: her yeni doğru bir öncekini kesiyor. Bakalım <b>${cini.n}</b> doğrudan ne çıkacak?`);
    cini.anim = setInterval(() => {
      cini.lines++; N.sfx.tick();
      if (cini.lines >= cini.n) {
        clearInterval(cini.anim); cini.anim = null; cini.pts = cini.base.map((p) => ({ ...p })); N.sfx.good();
        const nm = PNAME[cini.n]; cini.made.add(nm); addLog('cini', `${cini.n} doğru → ${nm}: ${cini.n} kenar, ${cini.n} köşe, ${cini.n} iç açı`);
        say(`Son doğru ilk doğruyu kesti ve şekil kapandı: <b>düzgün ${nm}</b>! ${cini.n} doğru → ${cini.n} kenar, ${cini.n} köşe, ${cini.n} iç açı.`);
        if (cini.made.size >= 2) markDone('cini', 'kapat');
        renderZSide();
      }
    }, 420);
  }
  function setupCini() {
    zhint = 'İki tezgâh var: <b>Çokgen tezgâhı</b>nda doğrular kesişip çini olur; <b>Döşeme</b>de çinileri yan yana dizersin.';
    if (!cini.base) cini.base = regPts(cini.n);
    Z.draw = (c) => {
      c.fillStyle = '#efe5d0'; c.fillRect(0, 0, ZW, ZH); d.grid(c, ZW, ZH, 30, { color: 'rgba(23,20,17,.05)' });
      if (cini.mode === 'dose') return drawTiling(c);
      const B = cini.base, n = B.length;
      if (!cini.pts) {
        for (let i = 0; i < Math.min(cini.lines, n); i++) d.fullLine(c, B[i], B[(i + 1) % n], 600, ZH, { w: 2.2, color: 'rgba(23,20,17,.6)' });
        for (let i = 1; i < Math.min(cini.lines, n); i++) d.dot(c, B[i], { r: 6, color: N.DEEP });
        if (cini.lines >= n) d.dot(c, B[0], { r: 6, color: N.DEEP });
      } else {
        const P = cini.pts;
        for (let i = 0; i < n; i++) d.fullLine(c, P[i], P[(i + 1) % n], 600, ZH, { w: 1.4, color: 'rgba(23,20,17,.18)' });
        ciniTile(c, P, 0, true);
        cini.diag.forEach(([i, j]) => d.seg(c, P[i], P[j], { color: N.AMBER, w: 3.5, dash: [9, 7] }));
        const cen = P.reduce((s, p) => ({ x: s.x + p.x / n, y: s.y + p.y / n }), { x: 0, y: 0 });
        P.forEach((p, i) => {
          const q = P[(i + 1) % n], m = g.lerp(p, q, .5), o = g.unit(g.sub(m, cen));
          d.text(c, `${N.fmt(g.dist(p, q) / 40)} cm`, m.x + o.x * 26, m.y + o.y * 26, { size: 19, font: N.MONO, color: N.SOFT });
          const iw = g.unit(g.sub(cen, p)); d.text(c, `${intAngle(P, i)}°`, p.x + iw.x * 40, p.y + iw.y * 40, { size: 20, color: '#fffaf0', halo: false, font: N.MONO, weight: 600 });
          knob(c, p, i === cini.sel || Z.dragK === i);
        });
      }
      // sağdaki not
      c.fillStyle = 'rgba(255,250,240,.85)'; c.fillRect(612, 40, 260, 520); c.strokeStyle = N.INK; c.lineWidth = 2; c.strokeRect(612, 40, 260, 520);
      d.text(c, 'Çini defteri', 742, 72, { size: 28 });
      const nn = cini.pts ? n : Math.min(cini.lines, n);
      d.text(c, `doğru: ${cini.lines >= n ? n : cini.lines}`, 742, 130, { size: 26, color: N.INK });
      if (cini.pts) {
        const reg = regular(cini.pts);
        [`kenar: ${n}`, `köşe: ${n}`, `iç açı: ${n}`, `köşegen: ${cini.diag.length}`].forEach((t, i) => d.text(c, t, 742, 175 + i * 40, { size: 26 }));
        d.text(c, PNAME[n], 742, 360, { size: 38, color: N.DEEP });
        d.text(c, reg ? 'düzgün ✓' : 'düzgün değil', 742, 405, { size: 28, color: reg ? N.DEEP : N.SEAL });
        d.text(c, reg ? 'kenarlar eş, açılar eş' : 'kenarlar ya da açılar eş değil', 742, 445, { size: 18, font: N.SERIF, color: N.SOFT });
      } else d.text(c, nn ? 'son doğru ilkini kesince…' : '“Doğruları çiz”e bas', 742, 200, { size: 20, font: N.SERIF, color: N.SOFT });
    };
    let downAt = null;
    Z.onDown = (p) => {
      if (cini.mode !== 'tezgah' || !cini.pts) return;
      const i = cini.pts.findIndex((q) => g.dist(p, q) < Z.hit(26)); if (i < 0) return;
      Z.dragK = i; downAt = { ...p };
    };
    Z.onMove = (p) => {
      if (!p || Z.dragK == null || !Z.down || !downAt) return;
      if (g.dist(p, downAt) < 5 && !cini.dragging) return; cini.dragging = true;
      cini.pts[Z.dragK] = { x: Math.max(30, Math.min(580, p.x)), y: Math.max(30, Math.min(570, p.y)) };
    };
    Z.onUp = () => {
      const i = Z.dragK; Z.dragK = null; if (i == null) return;
      if (cini.dragging) {
        cini.dragging = false; downAt = null;
        if (!regular(cini.pts) && !isDone('cini', 'duzgun')) { say('Köşe kayınca kenarlar ve açılar artık eş değil: <b>düzgün değil</b>. Düzgün çokgende bütün kenarlar <b>ve</b> bütün açılar eştir. “Düzelt” ile geri al.'); addLog('cini', 'Köşe oynayınca çini düzgünlüğünü kaybetti (kenarlar/açılar eş değil).'); markDone('cini', 'duzgun'); }
        return;
      }
      downAt = null; const n = cini.pts.length;
      if (cini.sel < 0) { cini.sel = i; say('Bir köşe seçtin. Şimdi <b>yan yana olmayan</b> başka bir köşeye dokun.'); return; }
      const j = cini.sel; cini.sel = -1; if (i === j) return;
      if ((i - j + n) % n === 1 || (j - i + n) % n === 1) { say('Bu iki köşe yan yana: onları birleştiren doğru parçası bir <b>kenar</b>, köşegen değil.'); return; }
      if (!cini.diag.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) cini.diag.push([i, j]);
      N.sfx.tick(); say(`Köşegen çizildi: ardışık olmayan iki köşeyi birleştiren doğru parçası. (${cini.diag.length})`);
      if (cini.diag.length >= 2 && !isDone('cini', 'kosegen')) { addLog('cini', `${PNAME[n]} çiniye ${cini.diag.length} köşegen çizildi`); markDone('cini', 'kosegen'); }
    };
    Z.ask();
  }
  function tilingTiles(n, s, V) {
    const T = [];
    if (n === 4) for (let i = -8; i < 8; i++) for (let j = -6; j < 6; j++) T.push([{ x: V.x + i * s, y: V.y + j * s }, { x: V.x + (i + 1) * s, y: V.y + j * s }, { x: V.x + (i + 1) * s, y: V.y + (j + 1) * s }, { x: V.x + i * s, y: V.y + (j + 1) * s }]);
    if (n === 3) { const a = { x: s, y: 0 }, b = { x: s / 2, y: s * Math.sqrt(3) / 2 }, P = (i, j) => ({ x: V.x + i * a.x + j * b.x, y: V.y + i * a.y + j * b.y }); for (let i = -12; i < 12; i++) for (let j = -7; j < 7; j++) { T.push([P(i, j), P(i + 1, j), P(i, j + 1)]); T.push([P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)]); } }
    if (n === 6) { const r = s, O = { x: V.x, y: V.y + r }; for (let i = -7; i < 7; i++) for (let j = -5; j < 5; j++) { const cx = O.x + i * Math.sqrt(3) * r + j * Math.sqrt(3) / 2 * r, cy = O.y + j * 1.5 * r; T.push(Array.from({ length: 6 }, (_, k) => ({ x: cx + Math.cos(-Math.PI / 2 + k * Math.PI / 3) * r, y: cy + Math.sin(-Math.PI / 2 + k * Math.PI / 3) * r }))); } }
    return T.filter((t) => t.some((p) => p.x > -40 && p.x < ZW + 40 && p.y > -40 && p.y < ZH + 40));
  }
  function pentagonAt(V, s, alphaDeg) { const P = [V]; let p = V; for (let k = 0; k < 4; k++) { p = g.add(p, g.mul(g.dir(g.rad(alphaDeg + 72 * k)), s)); P.push(p); } return P; }
  function drawTiling(c) {
    const V = { x: 450, y: 300 }, n = cini.tile, t = cini.tileT;
    if (!n) { d.text(c, 'Bir çini seç: üçgen, kare, beşgen ya da altıgen', 450, 300, { size: 28, color: N.SOFT }); return; }
    if (n === 5) {
      const s = 120; for (let k = 0; k < 3; k++) { if (t * 3 < k) break; ciniTile(c, pentagonAt(V, s, 108 * k), k, true); }
      for (let k = 0; k < 3; k++) d.arc(c, V, g.rad(108 * k), g.rad(108 * k + 108), 34, { color: N.DEEP, w: 2.5 });
      if (t > .99) {
        c.beginPath(); c.moveTo(V.x, V.y); c.arc(V.x, V.y, 150, -g.rad(324), -g.rad(360), true); c.closePath(); c.fillStyle = 'rgba(196,67,43,.35)'; c.fill(); c.strokeStyle = N.SEAL; c.lineWidth = 2.5; c.stroke();
        d.text(c, '36° boşluk!', V.x + 210, V.y - 30, { size: 32, color: N.SEAL });
        d.text(c, '108° + 108° + 108° = 324°', 450, 560, { size: 30, color: N.SEAL });
      }
      d.dot(c, V, { r: 6 }); return;
    }
    const s = n === 6 ? 62 : n === 4 ? 92 : 100, tiles = tilingTiles(n, s, V);
    tiles.sort((A, B) => g.dist(V, A.reduce((m, p) => (g.dist(V, p) < g.dist(V, m) ? p : m))) - g.dist(V, B.reduce((m, p) => (g.dist(V, p) < g.dist(V, m) ? p : m))));
    const show = Math.ceil(tiles.length * t);
    tiles.slice(0, show).forEach((tl, i) => { const touch = tl.some((p) => g.dist(p, V) < 1); ciniTile(c, tl, i + (touch ? 0 : 1), touch); if (touch) { tilePath(c, tl); c.strokeStyle = N.AMBER; c.lineWidth = 3.5; c.stroke(); } });
    d.dot(c, V, { r: 7, color: N.SEAL });
    if (t > .99) { const a = { 3: 60, 4: 90, 6: 120 }[n], k = 360 / a; c.fillStyle = 'rgba(255,250,240,.9)'; c.fillRect(250, 530, 400, 52); d.text(c, `${k} × ${a}° = 360° · boşluk yok`, 450, 556, { size: 30, color: N.DEEP }); }
  }
  function ctlCini(host) {
    const tz = cini.mode === 'tezgah';
    host.innerHTML = `<div class="row"><button class="btn ${tz ? 'primary' : ''}" data-m="tezgah" type="button">Çokgen tezgâhı</button><button class="btn ${tz ? '' : 'primary'}" data-m="dose" type="button">Döşeme</button></div>
      ${tz ? `<div class="row"><span>Doğru sayısı</span><button class="btn" id="nMinus" type="button">−</button><span class="big-read" style="font-size:32px;min-width:30px;text-align:center">${cini.n}</span><button class="btn" id="nPlus" type="button">+</button></div>
        <div class="row"><button class="btn primary" id="cizBtn" type="button">Doğruları çiz</button><button class="btn" id="duzBtn" type="button">Düzelt</button></div>
        <p class="small" style="margin:0">Çini oluşunca köşeleri sürükleyebilir, iki köşeye dokunarak köşegen çizebilirsin.</p>`
      : `<div class="row">${[[3, 'üçgen'], [4, 'kare'], [5, 'beşgen'], [6, 'altıgen']].map(([k, t]) => `<button class="btn ${cini.tile === k ? 'primary' : ''}" data-t="${k}" type="button">${t}</button>`).join('')}</div>
        <p class="small" style="margin:0">Düzgün çinileri kırmızı noktanın etrafına diziyorum. Bir köşede açılar tam 360° etmeli.</p>`}`;
    host.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { cini.mode = b.dataset.m; renderZSide(); Z.ask(); }));
    if (tz) {
      $('#nMinus').onclick = () => { if (cini.anim) return; cini.n = Math.max(3, cini.n - 1); cini.pts = null; cini.lines = 0; cini.base = regPts(cini.n); renderZSide(); };
      $('#nPlus').onclick = () => { if (cini.anim) return; cini.n = Math.min(8, cini.n + 1); cini.pts = null; cini.lines = 0; cini.base = regPts(cini.n); renderZSide(); };
      $('#cizBtn').onclick = () => { if (!cini.anim) startLines(); };
      $('#duzBtn').onclick = () => { if (cini.pts) { cini.pts = cini.base.map((p) => ({ ...p })); say('Çini yeniden <b>düzgün</b>.'); } };
    } else host.querySelectorAll('[data-t]').forEach((b) => (b.onclick = () => {
      cini.tile = +b.dataset.t; cini.tileT = 0; cini.tried.add(cini.tile); renderZSide();
      N.tween(1600, (t) => { cini.tileT = t; }).then(() => {
        const nm = { 3: 'üçgen', 4: 'kare', 5: 'beşgen', 6: 'altıgen' }[cini.tile];
        if (cini.tile === 5) say('Düzgün beşgenler bir köşede <b>boşluk</b> bırakıyor: 108° + 108° + 108° = 324°, 360°’a 36° eksik.');
        else say(`Düzgün ${nm} çiniler bir köşede tam <b>360°</b> oluşturuyor: hiç boşluk yok!`);
        addLog('cini', cini.tile === 5 ? 'Beşgen çiniler: 3 × 108° = 324°, 36° boşluk' : `${nm} çiniler: ${360 / { 3: 60, 4: 90, 6: 120 }[cini.tile]} × ${{ 3: 60, 4: 90, 6: 120 }[cini.tile]}° = 360°, boşluk yok`);
        if (cini.tried.size >= 3 && cini.tried.has(5)) markDone('cini', 'dose');
        else if (cini.tried.size >= 3) say('Beşgeni de dene: o da boşluksuz döşer mi?');
      });
    }));
  }

  /* ── Köprü: üçgen sağlamdır, iç açılar toplamı 180° ── */
  const KA = { x: 500, y: 450 }, KB = { x: 860, y: 450 }, KM = { x: 680, y: 450 };
  const kopru = { load: 0, loaded: false, P: { x: 640, y: 200 }, shapes: [], tear: 0 };
  function triAngles(P) {
    const raw = [g.angleAt(P, KA, KB), g.angleAt(KA, KB, P), g.angleAt(KB, P, KA)], fl = raw.map(Math.floor); let rest = 180 - fl.reduce((s, x) => s + x, 0);
    raw.map((x, i) => [x - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0) { fl[i]++; rest--; } });
    return fl;
  }
  const KOPRU_PARTS = { yuk: { dx: 153, dy: -267, k: 1.35 }, aci: { dx: -298, dy: -63, k: 1.1 } };
  const KOPRU_LIST = [['yuk', 'Yük testi', 'yuk'], ['aci', 'Açılar', 'toplam']];
  const KOPRU_HINT = { yuk: 'İki çerçeve var: biri kare, biri üçgen. <b>Yük koy</b>’a bas ve izle.', aci: 'Üçgenin tepesini (C) sürükle: açılar değişiyor, peki toplamları?' };
  function setupKopru() {
    kopru.part = kopru.part || (isDone('kopru', 'yuk') ? 'aci' : 'yuk');
    zhint = KOPRU_HINT[kopru.part];
    Z.draw = (c) => {
      const YUK = kopru.part === 'yuk';
      if (YUK) {
      c.fillStyle = '#d7cdb6'; c.fillRect(-200, 470, 900, 300); c.strokeStyle = N.INK; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 470); c.lineTo(440, 470); c.stroke();
      const L = kopru.load, sh = 58 * L;
      // kare çerçeve
      const sq = [{ x: 60, y: 470 }, { x: 190, y: 470 }, { x: 190 + sh, y: 340 + 8 * L }, { x: 60 + sh, y: 340 + 8 * L }];
      const tr = [{ x: 250, y: 470 }, { x: 400, y: 470 }, { x: 325, y: 340 }];
      [sq, tr].forEach((F) => { for (let i = 0; i < F.length; i++) { const a = F[i], b = F[(i + 1) % F.length]; c.strokeStyle = N.INK; c.lineWidth = 11; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.strokeStyle = '#5b6b78'; c.lineWidth = 6; c.stroke(); } F.forEach((p) => { c.beginPath(); c.arc(p.x, p.y, 6, 0, 7); c.fillStyle = N.AMBER; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke(); }); });
      const wy = 340 - 46 - (1 - Math.min(1, L * 2)) * 140;
      [[(sq[2].x + sq[3].x) / 2, sq[2].y], [325, 340]].forEach(([x, y0]) => { const y = Math.min(wy, y0 - 46); c.fillStyle = '#3b3530'; c.fillRect(x - 28, y, 56, 44); c.strokeStyle = N.INK; c.lineWidth = 2; c.strokeRect(x - 28, y, 56, 44); d.text(c, '100 kg', x, y + 22, { size: 16, color: '#fffaf0', halo: false, font: N.MONO }); });
      if (L > .99) { d.text(c, 'kare yamuldu', 125, 520, { size: 24, color: N.SEAL }); d.text(c, 'üçgen dimdik', 325, 520, { size: 24, color: N.DEEP }); }
      return; }
      // açılar üçgeni
      const P = kopru.P, ang = triAngles(P), V = [KA, KB, P];
      c.beginPath(); c.moveTo(KA.x, KA.y); c.lineTo(KB.x, KB.y); c.lineTo(P.x, P.y); c.closePath(); c.fillStyle = 'rgba(232,163,61,.22)'; c.fill();
      [[KA, KB], [KB, P], [P, KA]].forEach(([a, b]) => { c.strokeStyle = N.INK; c.lineWidth = 10; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.strokeStyle = '#5b6b78'; c.lineWidth = 5; c.stroke(); });
      const COL = ['rgba(232,163,61,.85)', 'rgba(184,116,26,.8)', 'rgba(196,67,43,.7)'];
      V.forEach((v, i) => {
        const p = V[(i + 2) % 3], q = V[(i + 1) % 3]; let a1 = g.ang(v, q), a2 = g.ang(v, p); if (g.nd(g.deg(a2 - a1)) > 180) [a1, a2] = [a2, a1];
        if (ang[i] === 90) d.right(c, v, g.sub(q, v), g.sub(p, v), 22, { w: 3, color: N.DEEP }); else d.arc(c, v, a1, a2, 30, { fill: COL[i], color: N.INK, w: 2 });
        const mid = g.dir(a1 + g.rad(g.nd(g.deg(a2 - a1))) / 2), lp = g.add(v, g.mul(mid, ang[i] < 35 ? 82 : 60));
        d.text(c, `${ang[i]}°`, lp.x, lp.y, { size: 26, color: N.DEEP });
      });
      ['A', 'B', 'C'].forEach((n, i) => { const v = V[i]; d.dot(c, v, { r: 6, label: n, lx: i === 0 ? -20 : i === 1 ? 20 : 0, ly: i === 2 ? -24 : 22 }); });
      knob(c, P, Z.dragK === 'P');
      const kind = ang.some((a) => a > 90) ? 'geniş açılı' : ang.includes(90) ? 'dik açılı' : 'dar açılı';
      d.text(c, `${ang[0]}° + ${ang[1]}° + ${ang[2]}° = 180°`, 680, 500, { size: 28 }); d.text(c, `${kind} üçgen`, 680, 92, { size: 30, color: N.DEEP });
      if (kopru.tear) { // köşeleri yırt
        const Q = { x: 680, y: 575 }, R = 44; let acc = 0;
        V.forEach((v, i) => {
          const p = V[(i + 2) % 3], q = V[(i + 1) % 3]; let a1 = g.ang(v, q), a2 = g.ang(v, p); if (g.nd(g.deg(a2 - a1)) > 180) [a1, a2] = [a2, a1];
          const sw = g.rad(g.nd(g.deg(a2 - a1))); let s0 = a1; while (s0 > Math.PI) s0 -= 2 * Math.PI; while (s0 < -Math.PI) s0 += 2 * Math.PI;
          const t = kopru.tear, pos = g.lerp(v, Q, t), start = s0 + (acc - s0) * t; acc += sw;
          c.beginPath(); c.moveTo(pos.x, pos.y); c.arc(pos.x, pos.y, R, -start, -start - sw, true); c.closePath(); c.fillStyle = COL[i]; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
        });
        if (kopru.tear > .99) { d.seg(c, { x: 600, y: 575 }, { x: 760, y: 575 }, { w: 2.5, dash: [6, 6] }); d.text(c, 'doğru açı', 800, 560, { size: 24, color: N.DEEP }); }
      }
    };
    const snapP = (p) => {
      let q = { x: Math.max(470, Math.min(885, p.x)), y: Math.max(110, Math.min(420, p.y)) };
      const thales = g.add(KM, g.mul(g.unit(g.sub(q, KM)), 180)), cands = [{ x: KA.x, y: q.y }, { x: KB.x, y: q.y }, thales, { x: KM.x, y: q.y }];
      for (const c of cands) if (g.dist(c, q) < 9) { if (g.dist(c, kopru.P) > 1) N.sfx.snap(); return c; }
      return q;
    };
    Z.onDown = (p) => { if (kopru.part === 'aci' && g.dist(p, kopru.P) < Z.hit(30)) { Z.dragK = 'P'; kopru.tear = 0; } };
    Z.onMove = (p) => { if (!p || Z.dragK !== 'P' || !Z.down) return; kopru.P = snapP(p); };
    Z.onUp = () => {
      if (Z.dragK !== 'P') return; Z.dragK = null;
      const a = triAngles(kopru.P), key = a.join('-');
      if (!kopru.shapes.includes(key)) { kopru.shapes.push(key); addLog('kopru', `${a[0]}° + ${a[1]}° + ${a[2]}° = 180°`); }
      if (kopru.shapes.length >= 3 && !isDone('kopru', 'toplam')) { say('Üç farklı üçgen, üçünde de toplam <b>180°</b>! Üçgen büyüse de küçülse de değişmiyor. <b>Köşeleri yırt</b> ile nedenini gör.'); markDone('kopru', 'toplam'); }
      else if (!isDone('kopru', 'toplam')) say(`${a[0]}° + ${a[1]}° + ${a[2]}° = <b>180°</b>. Tepeyi başka bir yere sürükle ve yine topla.`);
      if (a.includes(90) && !isDone('kopru', 'dik')) { say('Bir açısı tam <b>90°</b>: <b>dik açılı üçgen</b>. Öbür iki açı birlikte 90° ediyor.'); addLog('kopru', `Dik açılı üçgen: ${a.join('°, ')}°`); markDone('kopru', 'dik'); }
      if (a.some((x) => x > 90) && !isDone('kopru', 'genis')) { say('Bir açısı 90°’den büyük: <b>geniş açılı üçgen</b>. İkinci bir geniş açı olamaz; iki geniş açı tek başına 180°’yi aşar.'); addLog('kopru', `Geniş açılı üçgen: ${a.join('°, ')}°`); markDone('kopru', 'genis'); }
    };
    partWrap(kopru, KOPRU_PARTS, '#e9e4d6');
    Z.ask();
  }
  function ctlKopru(host) {
    host.innerHTML = kopru.part === 'yuk' ? `<div class="row"><button class="btn primary" id="yukBtn" type="button">${kopru.loaded ? 'Yükü kaldır' : 'Yük koy'}</button></div>` : '<div class="row"><button class="btn" id="yirtBtn" type="button">✂ Köşeleri yırt</button></div>';
    partTabs(host, kopru, KOPRU_LIST, 'kopru', () => say(KOPRU_HINT[kopru.part]));
    const yb = $('#yukBtn'); if (yb) yb.onclick = () => {
      kopru.loaded = !kopru.loaded; const from = kopru.load, to = kopru.loaded ? 1 : 0; renderZSide();
      N.tween(1200, (t) => { kopru.load = from + (to - from) * t; }).then(() => {
        if (kopru.loaded && !isDone('kopru', 'yuk')) { N.sfx.bad(); say('Kare çerçeve yamuldu ama üçgen <b>biçimini korudu</b>! Üç kenarı belli olan üçgen değişemez. Köprüler bu yüzden üçgenlerle kurulur.'); addLog('kopru', 'Yükte kare yamuldu, üçgen biçimini korudu.'); markDone('kopru', 'yuk'); }
      });
    };
    const tb = $('#yirtBtn'); if (tb) tb.onclick = () => { kopru.tear = 0; N.sfx.draw(); N.tween(1500, (t) => { kopru.tear = t; }).then(() => say('Üç köşe yan yana bir <b>doğru açı</b> oluşturdu: <b>180°</b>.')); };
  }

  /* ── 1. Saat ── */
  const CC = { x: 450, y: 300 }, CR = 240;
  const cw2math = (deg) => g.rad(90 - deg);
  const between = () => { let df = Math.abs(clock.h - clock.m) % 360; return df > 180 ? 360 - df : df; };
  function setupClock() {
    zhint = 'Kolların ucundaki halkaları sürükle. Akrep bir rakamdan öbürüne, yelkovan dakika çizgilerine atlar.';
    Z.draw = (c) => {
      d.grid(c, ZW, ZH, 40);
      // kasa: pirinç halka, perçinler, gölge
      c.beginPath(); c.arc(CC.x + 8, CC.y + 12, CR + 26, 0, 7); c.fillStyle = 'rgba(60,40,25,.16)'; c.fill();
      const rim = c.createRadialGradient(CC.x - 90, CC.y - 110, 30, CC.x, CC.y, CR + 28); rim.addColorStop(0, '#f6dc9a'); rim.addColorStop(.7, '#d39f45'); rim.addColorStop(.92, '#a8701f'); rim.addColorStop(1, '#7d5214');
      c.beginPath(); c.arc(CC.x, CC.y, CR + 26, 0, 7); c.fillStyle = rim; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 4; c.stroke();
      for (let i = 0; i < 24; i++) { const p = g.polar(CC, CR + 13, i * Math.PI / 12 + .13); c.beginPath(); c.arc(p.x, p.y, 3, 0, 7); c.fillStyle = '#7d5214'; c.fill(); c.beginPath(); c.arc(p.x - .8, p.y - .8, 1.1, 0, 7); c.fillStyle = '#ffe9b0'; c.fill(); }
      const face = c.createRadialGradient(CC.x - 60, CC.y - 70, 20, CC.x, CC.y, CR); face.addColorStop(0, '#fffdf7'); face.addColorStop(.8, '#f6eedb'); face.addColorStop(1, '#e6d6b4');
      c.beginPath(); c.arc(CC.x, CC.y, CR, 0, 7); c.fillStyle = face; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 3; c.stroke();
      c.beginPath(); c.arc(CC.x, CC.y, CR - 6, 0, 7); c.strokeStyle = 'rgba(23,20,17,.25)'; c.lineWidth = 1; c.stroke();
      c.beginPath(); c.arc(CC.x, CC.y, 100, 0, 7); c.setLineDash([2, 7]); c.strokeStyle = 'rgba(184,116,26,.55)'; c.lineWidth = 2; c.stroke(); c.setLineDash([]);
      for (let i = 0; i < 60; i++) { const a = cw2math(i * 6), L = i % 5 ? 10 : 22; d.seg(c, g.polar(CC, CR - 4, a), g.polar(CC, CR - 4 - L, a), { w: i % 5 ? 1.6 : 4 }); }
      for (let i = 0; i < 4; i++) { const p = g.polar(CC, CR - 14, cw2math(i * 90)); c.beginPath(); c.arc(p.x, p.y, 4, 0, 7); c.fillStyle = N.SEAL; c.fill(); }
      for (let i = 1; i <= 12; i++) { const p = g.polar(CC, CR - 50, cw2math(i * 30)); d.text(c, String(i), p.x, p.y + 2, { size: 38, halo: false }); }
      // aradaki açı
      const ah = cw2math(clock.h), am = cw2math(clock.m), b = between();
      let a1 = ah, a2 = am; if (g.nd(g.deg(a2 - a1)) > 180) [a1, a2] = [a2, a1];
      if (b > 0 && b < 180) d.arc(c, CC, a1, a2, 70, { fill: 'rgba(232,163,61,.28)', w: 3 });
      if (b === 90) d.right(c, CC, g.dir(ah), g.dir(am), 34, { w: 3 });
      if (clock.prot) drawProt(c);
      // kollar
      const ph = g.polar(CC, 140, ah), pm = g.polar(CC, 205, am);
      const handShape = (a, L, kind) => { // akrep: kürek uçlu; yelkovan: ince, karşı ağırlıklı
        const u = g.dir(a), n = { x: -u.y, y: u.x }, P = (t, w) => ({ x: CC.x + u.x * t + n.x * w, y: CC.y + u.y * t + n.y * w });
        c.beginPath();
        if (kind === 'h') { const q = [P(-26, 0), P(-14, 8), P(0, 9), P(L - 46, 5), P(L - 30, 13), P(L - 12, 4), P(L, 0), P(L - 12, -4), P(L - 30, -13), P(L - 46, -5), P(0, -9), P(-14, -8)]; q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); }
        else { const q = [P(-30, 0), P(-14, 4.5), P(0, 6), P(L - 10, 2.5), P(L, 0), P(L - 10, -2.5), P(0, -6), P(-14, -4.5)]; q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); const t = P(-32, 0); c.moveTo(t.x + 9, t.y); c.arc(t.x, t.y, 9, 0, 7); }
      };
      c.save(); c.translate(6, 9); c.fillStyle = 'rgba(40,30,20,.2)'; handShape(ah, 140, 'h'); c.fill(); handShape(am, 205, 'm'); c.fill(); c.restore();
      [[ah, 140, 'h'], [am, 205, 'm']].forEach(([a, L, k]) => { handShape(a, L, k); c.fillStyle = N.INK; c.fill(); const u = g.dir(a); c.beginPath(); c.moveTo(CC.x + u.x * 14, CC.y + u.y * 14); c.lineTo(CC.x + u.x * (L - 40), CC.y + u.y * (L - 40)); c.strokeStyle = 'rgba(255,240,210,.35)'; c.lineWidth = 1.5; c.stroke(); });
      [[ph, 'akrep'], [pm, 'yelkovan']].forEach(([p, k]) => { c.beginPath(); c.arc(p.x, p.y, 15, 0, 7); c.fillStyle = Z.dragK === k ? N.AMBER : N.SHEET; c.fill(); c.lineWidth = 3; c.strokeStyle = N.DEEP; c.stroke(); });
      const cap = c.createRadialGradient(CC.x - 4, CC.y - 4, 1, CC.x, CC.y, 14); cap.addColorStop(0, '#ffe7a8'); cap.addColorStop(1, '#a8701f');
      c.beginPath(); c.arc(CC.x, CC.y, 14, 0, 7); c.fillStyle = cap; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2.5; c.stroke(); d.dot(c, CC, { r: 4 });
      // cam yansıması
      c.lineCap = 'round'; c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 10; c.beginPath(); c.arc(CC.x, CC.y, CR - 22, 3.55, 4.25); c.stroke(); c.lineWidth = 5; c.beginPath(); c.arc(CC.x, CC.y, CR - 22, 4.4, 4.6); c.stroke(); c.lineCap = 'butt';
      d.text(c, `akrep: ${hourTxt()} · yelkovan: ${clock.m === 0 ? '12' : `${clock.m / 6}. dakika`}`, 450, 585, { size: 24, color: N.SOFT, font: N.SERIF });
    };
    Z.onDown = (p) => {
      if (clock.prot) { const kn = g.polar(CC, 235, clock.rot + Math.PI / 2); if (g.dist(p, kn) < Z.hit(26)) { Z.dragK = 'prot'; return; } }
      const ph = g.polar(CC, 140, cw2math(clock.h)), pm = g.polar(CC, 205, cw2math(clock.m));
      const dh = Math.min(g.dist(p, ph), g.distSeg(p, CC, ph) + 6), dm = Math.min(g.dist(p, pm), g.distSeg(p, CC, pm) + 6);
      if (Math.min(dh, dm) < Z.hit(30)) { Z.dragK = dm <= dh ? 'yelkovan' : 'akrep'; stopClock(); }
    };
    Z.onMove = (p) => {
      if (!p || !Z.dragK || !Z.down) return;
      if (Z.dragK === 'prot') { clock.rot = g.ang(CC, p) - Math.PI / 2; snapProt(); Z.ask(); return; }
      let cw = g.nd(90 - g.deg(g.ang(CC, p)));
      if (Z.dragK === 'akrep') cw = (Math.round(cw / 30) * 30) % 360; else cw = (Math.round(cw / 6) * 6) % 360;
      const k = Z.dragK === 'akrep' ? 'h' : 'm'; if (clock[k] !== cw) { clock[k] = cw; N.sfx.tick(); snapProt(); } Z.ask();
    };
    Z.onUp = () => { Z.dragK = null; Z.ask(); checkClock(); };
    Z.ask();
  }
  function drawProt(c) {
    const R = 200; c.save(); c.translate(CC.x, CC.y); c.rotate(-clock.rot);
    c.beginPath(); c.moveTo(R + 10, 0); c.arc(0, 0, R, 0, -Math.PI, true); c.lineTo(-R - 10, 0); c.lineTo(-R - 10, 18); c.lineTo(R + 10, 18); c.closePath();
    const pg = c.createLinearGradient(0, -R, 0, 18); pg.addColorStop(0, 'rgba(215,235,240,.62)'); pg.addColorStop(1, 'rgba(255,252,240,.5)');
    c.fillStyle = pg; c.fill(); c.strokeStyle = '#3d4a50'; c.lineWidth = 2.2; c.stroke();
    c.beginPath(); c.arc(0, 0, R - 4, -.15, -Math.PI + .15, true); c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.arc(0, 0, R - 62, 0, -Math.PI, true); c.strokeStyle = 'rgba(61,74,80,.35)'; c.lineWidth = 1; c.stroke();
    c.beginPath(); c.arc(0, 0, 6, 0, 7); c.strokeStyle = N.SEAL; c.lineWidth = 2; c.stroke();
    for (let i = 0; i <= 180; i++) { const t = g.rad(i), L = i % 10 === 0 ? 16 : i % 5 === 0 ? 10 : 5; c.beginPath(); c.moveTo(Math.cos(t) * R, -Math.sin(t) * R); c.lineTo(Math.cos(t) * (R - L), -Math.sin(t) * (R - L)); c.strokeStyle = N.DEEP; c.lineWidth = i % 10 ? 1 : 1.8; c.stroke(); }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 0; i <= 180; i += 10) { const t = g.rad(i); c.save(); c.translate(Math.cos(t) * (R - 28), -Math.sin(t) * (R - 28)); c.rotate(Math.PI / 2 - t); c.font = `600 13px ${N.MONO}`; c.fillStyle = N.DEEP; c.fillText(String(i), 0, 0); c.restore();
      c.save(); c.translate(Math.cos(t) * (R - 45), -Math.sin(t) * (R - 45)); c.rotate(Math.PI / 2 - t); c.font = `500 11px ${N.MONO}`; c.fillStyle = 'rgba(23,20,17,.6)'; c.fillText(String(180 - i), 0, 0); c.restore(); }
    c.beginPath(); c.moveTo(-R, 0); c.lineTo(R, 0); c.strokeStyle = N.INK; c.lineWidth = 1.2; c.stroke();
    c.beginPath(); c.arc(0, -235, 15, 0, 7); c.fillStyle = Z.dragK === 'prot' ? N.AMBER : N.INK; c.fill();
    c.beginPath(); c.moveTo(0, -R); c.lineTo(0, -221); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.arc(0, -235, 7, -2.6, .9); c.strokeStyle = N.SHEET; c.lineWidth = 2; c.stroke();
    c.restore();
  }
  function snapProt() {
    if (!clock.prot) return;
    for (const a of [cw2math(clock.h), cw2math(clock.m)]) for (const k of [0, Math.PI]) { let df = g.nd(g.deg(clock.rot - a - k)); if (df > 180) df -= 360; if (Math.abs(df) < 3) { if (clock.rot !== a + k) N.sfx.snap(); clock.rot = a + k; } }
  }
  function stopClock() { if (clock.run) { clearInterval(clock.run); clock.run = null; const b = $('#runBtn'); if (b) b.textContent = '▶ Zamanı akıt'; } }
  function checkClock() {
    if (clock.h === 90 && clock.m === 0 && !isDone('saat', 'uc')) { say('Saat 3:00! Kollar arasında <b>3 rakam aralığı</b> var. Sence kaç derece? Açıölçerle ölç.'); markDone('saat', 'uc'); }
    if (between() === 180 && !isDone('saat', 'dogru')) { say('Kollar bir doğru oluşturdu: <b>doğru açı</b>, 180°. Saat 6:00 gibi!'); addLog('saat', `Akrep ${hourTxt()}, yelkovan ${clock.m / 6 || 60}. dk: 180° (doğru açı)`); markDone('saat', 'dogru'); }
  }
  function ctlClock(host) {
    host.innerHTML = `<div class="row"><button class="btn" id="runBtn" type="button">${clock.run ? '❚❚ Zamanı durdur' : '▶ Zamanı akıt'}</button></div>
      <div class="row"><button class="btn ${clock.prot ? 'primary' : ''}" id="protBtn" type="button">${clock.prot ? 'Açıölçeri kaldır' : 'Açıölçeri koy'}</button>
      ${clock.prot ? '<button class="btn" data-r="1" type="button">↺ 1°</button><button class="btn" data-r="-1" type="button">↻ 1°</button>' : ''}</div>
      <div class="row" style="margin-top:6px"><span>Ölçtüğüm açı:</span><input class="num-in" id="aci" inputmode="numeric" style="width:90px;font-size:26px"><span class="big-read" style="font-size:26px">°</span></div>
      <button class="btn primary" id="yaz" type="button" style="margin-top:6px">Deftere yaz</button>`;
    $('#runBtn').onclick = () => {
      if (clock.run) { stopClock(); return; }
      say('Zaman akıyor: yelkovan bir tur dönerken akrep bir rakam ilerliyor. Kollar arasındaki açının nasıl değiştiğini izle; <b>dik</b> ve <b>doğru açıları</b> yakala!');
      let lastB = between();
      clock.run = setInterval(() => {
        clock.m = (clock.m + 6) % 360; clock.h = (clock.h + .5) % 360; const b = between();
        if (b === 90 && lastB !== 90) { N.sfx.snap(); say(`Şimdi <b>dik açı</b>! akrep: ${hourTxt()}, yelkovan: ${clock.m / 6 || 60}. dakika.`); }
        if (b === 180 && lastB !== 180) { N.sfx.snap(); say('Şimdi <b>doğru açı</b>: kollar bir doğru oluşturdu!'); }
        if (b === 0 && lastB !== 0) say('Kollar üst üste: aralarında açı yok (0°).');
        lastB = b; snapProt(); checkClock();
      }, 90);
      renderZSide();
    };
    $('#protBtn').onclick = () => { clock.prot = !clock.prot; if (clock.prot) { clock.rot = cw2math(clock.m) - .3; say('Açıölçerin merkezi saatin merkezinde. Siyah tutamaktan çevirip <b>sıfır çizgisini</b> bir kolun üstüne getir.'); } renderZSide(); Z.ask(); };
    host.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => { clock.rot += g.rad(+b.dataset.r); snapProt(); Z.ask(); }));
    const inp = $('#aci');
    const run = () => {
      const v = N.num(inp.value), b = between(); if (v == null) return;
      inp.classList.remove('ok', 'no'); void inp.offsetWidth;
      if (Math.abs(v - b) <= 1) {
        inp.classList.add('ok'); const tur = b < 90 ? 'dar açı' : b === 90 ? 'dik açı' : b < 180 ? 'geniş açı' : 'doğru açı';
        addLog('saat', `Akrep ${hourTxt()}, yelkovan ${clock.m / 6 || 60}. dk: ${b}° (${tur})`);
        say(`Doğru ölçtün: <b>${b}°</b>, ${tur}. Deftere yazdım.`);
        if (!clock.prot) say(`<b>${b}°</b> doğru! Ama bu görev için açıölçeri kullanmayı dene.`); else markDone('saat', 'olc');
        if (b > 90 && b < 180 && clock.prot) markDone('saat', 'genis');
      } else { inp.classList.add('no'); N.sfx.bad(); say(Math.abs(v - (180 - b)) <= 1 ? 'Öbür ölçeği okudun! Kolun üstündeki <b>0</b>’dan başlayan ölçeği takip et.' : clock.prot ? 'Sıfır çizgisi bir kolun üstünde mi? Öbür kolun kestiği yeri, sıfırdan başlayan ölçekte oku.' : 'Önce <b>açıölçeri koy</b> ve sıfır çizgisini bir kola hizala.'); }
    };
    $('#yaz').onclick = run; inp.onkeydown = (e) => { if (e.key === 'Enter') run(); };
  }

  /* ── 2. Kavşak ── */
  const MO = { x: 450, y: 310 }, CINAR = 20, LQ = { x: 450, y: 110 };
  const secs = () => { const a = Math.round(map.gul - CINAR); return { a, b: 180 - a, c: a, d: 180 - a }; };
  function setupMap() {
    zhint = 'Gül Sokağı’nın ucundaki halkayı sürükleyerek sokağı döndür. <b>Ölçümleri göster</b>’e basarsan köşelerdeki açılar görünür ve her bırakışında tabloya yazılır.';
    Z.draw = (c) => {
      c.fillStyle = '#e4e8d4'; c.fillRect(0, 0, ZW, ZH);
      for (let i = 0; i < 40; i++) { const x = (i * 211) % ZW, y = (i * 137) % ZH; c.beginPath(); c.arc(x, y, 9 + (i % 3) * 3, 0, 7); c.fillStyle = 'rgba(110,140,90,.35)'; c.fill(); }
      const sc = secs();
      street(c, MO, CINAR, 'Çınar Sokağı');
      street(c, MO, map.gul, 'Gül Sokağı', true);
      if (map.laleOn) street(c, LQ, map.lale, 'Lale Sokağı', true, true);
      [[MO, CINAR, 0, '#c4432b'], [MO, map.gul, .37, '#5b7a8c'], [MO, CINAR, .62, '#e8a33d'], [MO, map.gul, .85, '#87a074']].concat(map.laleOn ? [[LQ, map.lale, .2, '#9b7653']] : []).forEach(([o, deg, off, col], i) => {
        const dir = i % 2 ? 1 : -1, sPos = (((st.t * .06 + off) % 1) * 1300 - 650) * dir, u = g.dir(g.rad(deg)), n = { x: -u.y, y: u.x };
        const p = g.add(g.add(o, g.mul(u, sPos)), g.mul(n, 13 * dir));
        c.save(); c.translate(p.x, p.y); c.rotate(-g.rad(deg) + (dir < 0 ? Math.PI : 0));
        c.fillStyle = col; c.strokeStyle = N.INK; c.lineWidth = 2; c.beginPath(); c.roundRect ? c.roundRect(-17, -9, 34, 18, 5) : c.rect(-17, -9, 34, 18); c.fill(); c.stroke();
        c.fillStyle = 'rgba(215,225,228,.95)'; c.fillRect(4, -6, 7, 12); c.fillRect(-12, -6, 5, 12); c.restore();
      });
      // açılar
      if (map.measures) {
        const lab = [['a', CINAR, map.gul], ['b', map.gul, CINAR + 180], ['c', CINAR + 180, map.gul + 180], ['d', map.gul + 180, CINAR + 360]];
        const pairCol = isDone('kavsak', 'tablo');
        lab.forEach(([n, f, t], i) => {
          let from = g.nd(f), to = g.nd(t); let sw = g.nd(to - from); if (sw === 0) sw = 360;
          const v = i % 2 ? sc.b : sc.a, col = pairCol ? (i % 2 ? 'rgba(196,67,43,.22)' : 'rgba(232,163,61,.35)') : 'rgba(23,20,17,.08)';
          if (v === 90) d.right(c, MO, g.dir(g.rad(from)), g.dir(g.rad(from + 90)), 30, { w: 3, color: N.DEEP });
          else d.arc(c, MO, g.rad(from), g.rad(from + sw), 52, { fill: col, color: pairCol ? (i % 2 ? N.SEAL : N.AMBER) : N.SOFT, w: 2.5 });
          const m = g.polar(MO, 96, g.rad(from + sw / 2)); d.text(c, `${n} = ${v}°`, m.x, m.y, { size: 28, color: N.INK });
        });
      } else ['a', 'b', 'c', 'd'].forEach((n, i) => { const f = [CINAR, map.gul, CINAR + 180, map.gul + 180][i]; let sw = g.nd([map.gul, CINAR + 180, map.gul + 180, CINAR][i] - f); const m = g.polar(MO, 90, g.rad(f + sw / 2)); d.text(c, n, m.x, m.y, { size: 34 }); });
      d.dot(c, MO, { r: 7 });
      // tutamaçlar
      handles().forEach((h) => { c.beginPath(); c.arc(h.p.x, h.p.y, 15, 0, 7); c.fillStyle = Z.dragK === h.k ? N.AMBER : N.SHEET; c.fill(); c.lineWidth = 3; c.strokeStyle = N.DEEP; c.stroke(); });
      if (map.laleOn) {
        const X = g.meet(MO, g.polar(MO, 10, g.rad(CINAR)), LQ, g.polar(LQ, 10, g.rad(map.lale)));
        if (!X || Math.abs(g.nd(map.lale - CINAR) % 180) < .5) { d.text(c, 'Lale ve Çınar paralel: hiç kesişmiyor', 450, 40, { size: 30, color: N.DEEP }); for (const t of [-220, 0, 220]) { const a = g.polar(MO, t, g.rad(CINAR)), q = g.meet(a, g.add(a, g.dir(g.rad(CINAR + 90))), LQ, g.polar(LQ, 10, g.rad(map.lale))); if (q) d.seg(c, a, q, { color: N.DEEP, w: 2, dash: [6, 6] }); } }
        else if (X.x > 0 && X.x < ZW && X.y > 0 && X.y < ZH) d.dot(c, X, { r: 7, color: N.SEAL });
      }
    };
    Z.onDown = (p) => { const h = handles().find((x) => g.dist(p, x.p) < Z.hit(28)); if (h) Z.dragK = h.k; };
    Z.onMove = (p) => {
      if (!p || !Z.dragK || !Z.down) return;
      if (Z.dragK.startsWith('gul')) { let rel = Math.round(g.nd(g.deg(g.ang(MO, p)) - CINAR)) % 180; if (Math.abs(rel - 90) <= 2) rel = 90; if (rel < 8 || rel > 172) return; if (CINAR + rel !== map.gul) { map.gul = CINAR + rel; N.sfx.tick(); } }
      else { let a = Math.round(g.nd(g.deg(g.ang(LQ, p)))) % 180; if (Math.abs(((g.nd(a - CINAR) + 90) % 180) - 90) <= 2) a = CINAR; if (a !== map.lale % 180) { map.lale = a; N.sfx.tick(); } }
      Z.ask();
    };
    Z.onUp = () => { if (!Z.dragK) return; Z.dragK = null; Z.ask(); checkMap(); };
    Z.ask();
  }
  function handles() {
    const H = [{ k: 'gul1', p: g.polar(MO, 230, g.rad(map.gul)) }, { k: 'gul2', p: g.polar(MO, -230, g.rad(map.gul)) }];
    if (map.laleOn) H.push({ k: 'lale1', p: g.polar(LQ, 250, g.rad(map.lale)) }, { k: 'lale2', p: g.polar(LQ, -250, g.rad(map.lale)) });
    return H;
  }
  function street(c, o, deg, name, movable, flat) {
    const u = g.dir(g.rad(deg)), a = g.sub(o, g.mul(u, 1200)), b = g.add(o, g.mul(u, 1200));
    c.lineCap = 'butt';
    c.strokeStyle = N.INK; c.lineWidth = 58; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
    c.strokeStyle = movable ? '#ddd3bf' : '#d4c9b2'; c.lineWidth = 52; c.stroke();
    c.setLineDash([16, 14]); c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 3; c.stroke(); c.setLineDash([]); c.lineCap = 'round';
    const t = g.polar(o, flat ? -120 : 245, g.rad(deg)); c.save(); c.translate(t.x, t.y); let r = -g.rad(deg); if (Math.cos(r) < 0) r += Math.PI; c.rotate(r);
    c.font = `400 22px ${N.BRUSH}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = N.INK; c.fillText(name, 0, -40); c.restore();
  }
  function checkMap() {
    const sc = secs();
    if (map.measures && Math.abs(map.gul - 75) >= 15) { if (!isDone('kavsak', 'dondur')) { say(`Döndürdün: şimdi a = ${sc.a}°, c = ${sc.c}°. Bir daha döndür ve a ile c’ye bak.`); markDone('kavsak', 'dondur'); } }
    if (sc.a === 90 && !isDone('kavsak', 'dik')) { say('Dört köşe de <b>90°</b>! Çınar ve Gül Sokağı artık <b>dik</b> kesişiyor. Şimdi Lale Sokağı’nı aç.'); addLog('kavsak', 'Sokaklar dik: a = b = c = d = 90°'); markDone('kavsak', 'dik'); map.laleOn = true; renderZSide(); }
    if (map.measures && map.rows.length < 3 && !map.rows.some((r) => r.a === sc.a)) {
      map.rows.push(sc); addLog('kavsak', `a = ${sc.a}°, b = ${sc.b}°, c = ${sc.c}°, d = ${sc.d}°`); N.sfx.tick();
      if (map.rows.length >= 3) { say('Tabloya bak: her satırda <b>a = c</b> ve <b>b = d</b>. Ayrıca <b>a + b = 180°</b>. Karşılıklı köşeler eş!'); markDone('kavsak', 'tablo'); }
      else if (!isDone('kavsak', 'dik') || sc.a !== 90) say(`Tabloya ${map.rows.length}. satır yazıldı: a = ${sc.a}°, c = ${sc.c}°. Gül Sokağı’nı <b>başka bir yöne</b> çevir.`);
      renderZSide(); Z.ask();
    }
    if (map.laleOn && Math.abs(((g.nd(map.lale - CINAR) + 90) % 180) - 90) < .5 && !isDone('kavsak', 'paralel')) { say('Lale ile Çınar <b>paralel</b>: hiç kesişmiyorlar, açı da oluşmuyor. Aralarındaki uzaklık her yerde aynı.'); addLog('kavsak', 'Lale Sokağı ∥ Çınar Sokağı: kesişme yok, açı yok'); markDone('kavsak', 'paralel'); }
  }
  function ctlMap(host) {
    const sc = secs();
    host.innerHTML = `<div class="row"><button class="btn ${map.measures ? 'primary' : ''}" id="msr" type="button">${map.measures ? 'Ölçümleri gizle' : 'Ölçümleri göster'}</button>
      ${map.laleOn ? '' : '<button class="btn" id="lale" type="button">Lale Sokağı’nı aç</button>'}</div>
      <span class="label" style="margin:8px 0 0">Tablo · sokağı her bırakışında dolar</span>
      <table class="mini-table" style="margin-top:6px"><tr><th>#</th><th>a</th><th>b</th><th>c</th><th>d</th></tr>${map.rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r.a}°</td><td>${r.b}°</td><td>${r.c}°</td><td>${r.d}°</td></tr>`).join('') || `<tr><td colspan="5">${map.measures ? 'Gül Sokağı’nı çevirip bırak' : 'önce ölçümleri göster'}</td></tr>`}</table>`;
    $('#msr').onclick = () => { map.measures = !map.measures; renderZSide(); Z.ask(); checkMap(); };
    const lb = $('#lale'); if (lb) lb.onclick = () => { map.laleOn = true; say('Lale Sokağı açıldı. Uçlarındaki halkalarla çevir: Çınar Sokağı’nı hiç kesmesin.'); renderZSide(); Z.ask(); };
  }

  /* ── 3. Çeşme ── */
  const PC = { x: 450, y: 300 }, PR = 272, UNIT = 22;
  const r1 = () => pool.t / 10, r2 = () => (pool.delay ? Math.max(0, pool.t / 10 - 2) : pool.t / 10);
  const ab = () => (pool.A && pool.B ? Math.round(g.dist(pool.A, pool.B) / UNIT * 10) / 10 : 0);
  function triInfo() {
    if (!pool.A || !pool.B) return null;
    const R1 = r1() * UNIT, R2 = r2() * UNIT, pts = g.circles(pool.A, R1, pool.B, R2);
    if (!pts.length || g.dist(pts[0], pts[1]) < 2) return null;
    const s = [Math.round(ab() * 10), Math.round(r1() * 10), Math.round(r2() * 10)];
    const e = (s[0] === s[1]) + (s[1] === s[2]) + (s[0] === s[2]);
    return { C: pts[0], C2: pts[1], kind: e >= 2 ? 'eşkenar' : e === 1 ? 'ikizkenar' : 'çeşitkenar' };
  }
  function setupPool() {
    zhint = 'Havuza dokunarak iki taş at: önce <b>A</b>, sonra <b>B</b>. Sonra zamanı ilerlet ve halkaları izle.';
    Z.draw = (c) => {
      c.fillStyle = '#e8dcc2'; c.fillRect(0, 0, ZW, ZH);
      for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; c.save(); c.translate(PC.x + Math.cos(a) * (PR + 16), PC.y + Math.sin(a) * (PR + 16)); c.rotate(a); c.fillStyle = '#d6c6a6'; c.fillRect(-14, -12, 28, 24); c.strokeStyle = 'rgba(23,20,17,.45)'; c.lineWidth = 1.5; c.strokeRect(-14, -12, 28, 24); c.restore(); }
      const gr = c.createRadialGradient(PC.x, PC.y, 20, PC.x, PC.y, PR); gr.addColorStop(0, '#a9c6cf'); gr.addColorStop(1, '#7ea3b0');
      c.beginPath(); c.arc(PC.x, PC.y, PR, 0, 7); c.fillStyle = gr; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 3.5; c.stroke();
      c.save(); c.beginPath(); c.arc(PC.x, PC.y, PR - 2, 0, 7); c.clip();
      if (st.hava === 'yagmur') for (let i = 0; i < 10; i++) { const k = ((st.t * .5 + i * .31) % 1), x = PC.x - 230 + (i * 151) % 460, y = PC.y - 200 + (i * 97) % 400; c.beginPath(); c.arc(x, y, 3 + k * 26, 0, 7); c.strokeStyle = `rgba(255,255,255,${.55 * (1 - k)})`; c.lineWidth = 1.5; c.stroke(); }
      for (let k = 0; k < 4; k++) { // balıklar
        const sg = k % 2 ? 1 : -1, a = st.t * .35 * sg + k * 1.7, rr = 150 + Math.sin(st.t * .3 + k) * 50, x = PC.x + Math.cos(a) * rr, y = PC.y + Math.sin(a) * rr * .8;
        const vx = -Math.sin(a) * sg, vy = Math.cos(a) * .8 * sg; c.save(); c.translate(x, y); c.rotate(Math.atan2(vy, vx)); c.globalAlpha = .75;
        c.beginPath(); c.ellipse(0, 0, 17, 7, 0, 0, 7); c.fillStyle = k % 2 ? '#e8a33d' : '#d9603f'; c.fill();
        c.beginPath(); c.moveTo(-14, 0); c.lineTo(-26, -7 + Math.sin(st.t * 9 + k) * 3); c.lineTo(-26, 7 + Math.sin(st.t * 9 + k) * 3); c.closePath(); c.fill(); c.restore(); c.globalAlpha = 1;
      }
      [[205, .5], [230, 2.3], [190, 4.1]].forEach(([r, a], i) => { const p = g.polar(PC, r, a); c.beginPath(); c.moveTo(p.x, p.y); c.arc(p.x, p.y, 26 - i * 3, .3 + i, Math.PI * 2 - .3 + i); c.closePath(); c.fillStyle = '#7fa06a'; c.fill(); c.strokeStyle = 'rgba(23,20,17,.5)'; c.lineWidth = 1.5; c.stroke(); if (i === 0) { c.beginPath(); c.arc(p.x + 6, p.y - 4, 7, 0, 7); c.fillStyle = '#eaa9b6'; c.fill(); } });
      pool.splash = (pool.splash || []).filter((sp) => st.t - sp.t0 < .7);
      pool.splash.forEach((sp) => { const k = (st.t - sp.t0) / .7; for (let j = 0; j < 10; j++) { const a = j / 10 * Math.PI * 2, r = 8 + k * 40, h = Math.sin(k * Math.PI) * 26; c.beginPath(); c.arc(sp.p.x + Math.cos(a) * r, sp.p.y + Math.sin(a) * r * .6 - h, 3 * (1 - k) + 1, 0, 7); c.fillStyle = 'rgba(235,245,250,.9)'; c.fill(); } c.beginPath(); c.arc(sp.p.x, sp.p.y, 6 + k * 30, 0, 7); c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 2.5; c.stroke(); });
      const ripple = (p, r) => { if (r <= 0) return; for (let j = 0; j < 3; j++) { const rr = (r - j * .7) * UNIT; if (rr <= 0) continue; c.beginPath(); c.arc(p.x, p.y, rr, 0, 7); c.strokeStyle = j ? `rgba(255,255,255,${.5 - j * .15})` : 'rgba(23,40,52,.9)'; c.lineWidth = j ? 2 : 3; c.stroke(); } };
      if (pool.A) ripple(pool.A, r1()); if (pool.B) ripple(pool.B, r2());
      const ti = triInfo();
      if (ti) {
        d.poly(c, [pool.A, pool.B, ti.C], { fill: 'rgba(232,163,61,.4)', w: 4 });
        const sides = [[pool.A, pool.B, ab()], [pool.A, ti.C, r1()], [pool.B, ti.C, r2()]], cen = g.mul(g.add(g.add(pool.A, pool.B), ti.C), 1 / 3);
        const vals = sides.map((x) => x[2]);
        sides.forEach(([p, q, v]) => { if (vals.filter((x) => Math.abs(x - v) < .05).length > 1) d.ticks(c, p, q, 1, { size: 10 }); const m = g.lerp(p, q, .5), o = g.unit(g.sub(m, cen)); d.text(c, N.fmt(v), m.x + o.x * 28, m.y + o.y * 28, { size: 28 }); });
        d.dot(c, ti.C, { r: 7, label: 'C', lx: 0, ly: -24 }); d.dot(c, ti.C2, { r: 4, color: 'rgba(23,20,17,.4)' });
      }
      c.restore();
      [['A', pool.A], ['B', pool.B]].forEach(([n, p]) => { if (!p) return; c.beginPath(); c.ellipse(p.x, p.y, 11, 8, .3, 0, 7); c.fillStyle = '#8c8577'; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2.5; c.stroke(); d.text(c, n, p.x - 18, p.y + 22, { size: 30 }); });
      if (ti) d.text(c, `${ti.kind} üçgen`, 450, 26, { size: 34, color: N.DEEP });
      d.text(c, `zaman: ${N.fmt(pool.t / 10)} · A halkası ${N.fmt(r1())} · B halkası ${N.fmt(r2())} birim`, 450, 588, { size: 21, color: N.SOFT, font: N.SERIF });
    };
    Z.onDown = (p) => {
      if (g.dist(p, PC) > PR - 20) return;
      if (pool.A && pool.B) { say('İki taş zaten havuzda. Yeniden denemek için <b>taşları topla</b>.'); return; }
      if (!pool.A) { pool.A = p; pool.t = 0; N.sfx.draw(); pool.splash = [{ p, t0: st.t }]; say('A taşı suda! Şimdi biraz uzağa <b>B</b> taşını at.'); }
      else {
        let L = g.dist(pool.A, p) / UNIT; if (L < 4) { say('B taşını A’dan biraz <b>daha uzağa</b> at.'); return; }
        L = Math.min(10, Math.round(L * 2) / 2); pool.B = g.add(pool.A, g.mul(g.unit(g.sub(p, pool.A)), L * UNIT));
        if (g.dist(pool.B, PC) > PR - 16) { pool.B = null; say('B taşı havuzun dışına düşecekti. Biraz içeriye at.'); return; }
        N.sfx.draw(); (pool.splash = pool.splash || []).push({ p: pool.B, t0: st.t }); say(`İki taş da suda! |AB| = <b>${N.fmt(L)} birim</b>. Şimdi <b>zamanı ilerlet</b> ya da ▶ ile oynat.`); markDone('cesme', 'ikitas');
      }
      renderZSide(); Z.ask();
    };
    Z.ask();
  }
  function poolChanged() {
    const ti = triInfo(); Z.ask(); const sl = $('#zt'); if (sl) sl.value = pool.t;
    if (!ti) return;
    if (!pool.delay && !isDone('cesme', 'bulus')) { say(`Halkalar C’de buluştu! |AC| = |BC| = ${N.fmt(r1())} birim, çünkü ikisi de aynı zamanda büyüdü: <b>ikizkenar</b>.`); addLog('cesme', `Aynı anda: |AB| = ${N.fmt(ab())}, |AC| = |BC| = ${N.fmt(r1())} → ikizkenar`); markDone('cesme', 'bulus'); }
    if (!pool.delay && Math.round(r1() * 10) === Math.round(ab() * 10) && !isDone('cesme', 'eskenar')) { say(`Halkalar tam |AB| = ${N.fmt(ab())} birim oldu: üç kenar eşit, <b>eşkenar üçgen</b>!`); addLog('cesme', `|AB| = |AC| = |BC| = ${N.fmt(ab())} → eşkenar`); markDone('cesme', 'eskenar'); stopPlay(); }
    if (pool.delay && ti.kind === 'çeşitkenar' && !isDone('cesme', 'gecikme')) { say(`B geç atıldı: |AB| = ${N.fmt(ab())}, |AC| = ${N.fmt(r1())}, |BC| = ${N.fmt(r2())}. Üçü de farklı: <b>çeşitkenar</b>.`); addLog('cesme', `B geç: ${N.fmt(ab())}, ${N.fmt(r1())}, ${N.fmt(r2())} → çeşitkenar`); markDone('cesme', 'gecikme'); }
  }
  function stopPlay() { if (pool.play) { clearInterval(pool.play); pool.play = null; const b = $('#play'); if (b) b.textContent = '▶ Oynat'; } }
  function ctlPool(host) {
    host.innerHTML = `<label class="small" for="zt">Zaman (halkaların büyüklüğü)</label><input type="range" id="zt" min="0" max="120" step="1" value="${pool.t}">
      <div class="row"><button class="btn primary" id="play" type="button">${pool.play ? '❚❚ Durdur' : '▶ Oynat'}</button><button class="btn" id="minus" type="button">−</button><button class="btn" id="plus" type="button">+</button><button class="btn" id="topla" type="button">Taşları topla</button></div>
      <label style="display:flex;gap:8px;align-items:center;margin-top:6px;cursor:pointer"><input type="checkbox" id="gec" ${pool.delay ? 'checked' : ''} style="width:20px;height:20px;accent-color:#171411"> B taşını 2 birim geç at</label>`;
    const sl = $('#zt'); sl.oninput = () => { pool.t = +sl.value; poolChanged(); };
    $('#minus').onclick = () => { pool.t = Math.max(0, pool.t - 1); poolChanged(); }; $('#plus').onclick = () => { pool.t = Math.min(120, pool.t + 1); poolChanged(); };
    $('#play').onclick = () => {
      if (!pool.A || !pool.B) { say('Önce havuza <b>iki taş</b> at.'); return; }
      if (pool.play) return stopPlay();
      if (pool.t >= 120) pool.t = 0;
      $('#play').textContent = '❚❚ Durdur';
      pool.play = setInterval(() => { pool.t++; poolChanged(); if (pool.t >= 120) stopPlay(); }, 60);
    };
    $('#topla').onclick = () => { stopPlay(); pool.A = pool.B = null; pool.t = 0; say('Taşları topladım. Yeniden iki taş at.'); renderZSide(); Z.ask(); };
    $('#gec').onchange = (e) => { pool.delay = e.target.checked; say(pool.delay ? 'Artık B taşı A’dan biraz sonra düşüyor: B halkası hep <b>2 birim küçük</b>.' : 'İki taş yine aynı anda düşüyor.'); poolChanged(); };
  }

  /* ══════════ defter, öğretmen, sunum ══════════ */
  function openSheet(id) { $('#' + id).classList.add('open'); }
  function closeSheets() { document.querySelectorAll('.sheet').forEach((x) => x.classList.remove('open')); }
  document.querySelectorAll('.sheet').forEach((x) => x.addEventListener('click', (e) => { if (e.target === x) closeSheets(); }));
  function renderDefter() {
    const box = $('#defterBox');
    box.innerHTML = `<button class="chip-btn close" type="button" data-close>kapat ✕</button><h2>Gözlem defterim</h2>
      <label class="small">Adım</label><input type="text" id="adIn" value="${(st.ad || '').replace(/"/g, '&quot;')}" placeholder="Adın ve sınıfın">
      ${STS.map((S) => `<h3>${S.ad} <span class="code" style="font-family:var(--mono);font-size:12px;color:var(--amber-deep)">${S.kod}</span></h3>
        <p class="small"><b>Soru:</b> ${S.soru}<br><b>Tahminim:</b> ${st.sence[S.id] != null ? S.secenekler[st.sence[S.id]] : '—'}</p>
        <ul>${(st.log[S.id] || []).filter((l) => !l.startsWith('Tahminim')).map((l) => `<li>${l}</li>`).join('') || '<li class="small">Henüz gözlem yok.</li>'}</ul>
        <label class="small">Son düşüncem</label><textarea data-son="${S.id}" placeholder="Ne fark ettin? Tahminin doğru çıktı mı?">${st.son[S.id] || ''}</textarea>`).join('')}
      <h3>Kasabada bulduğum şekiller (${T.avlar.filter((A) => st.av[A.id]).length}/${T.avlar.length})</h3>
      <ul>${T.avlar.filter((A) => st.av[A.id]).map((A) => `<li>${A.metin}</li>`).join('') || '<li class="small">Henüz yok. Kasabada dolaşıp şekillere dokun.</li>'}</ul>
      <div class="row2"><button class="btn primary" id="rapor" type="button">Raporu indir</button><a class="btn" href="../ilerleme.html">Benim ilerlemem ↗</a><button class="btn" id="sifirla" type="button">Defteri temizle</button></div>`;
    box.querySelector('[data-close]').onclick = closeSheets;
    $('#adIn').oninput = (e) => { st.ad = e.target.value; persist(); };
    box.querySelectorAll('[data-son]').forEach((t) => (t.oninput = () => { st.son[t.dataset.son] = t.value; persist(); }));
    $('#rapor').onclick = report;
    $('#sifirla').onclick = () => { if (!confirm('Defterdeki bütün tahmin ve gözlemler silinsin mi?')) return; st.done = {}; st.sence = {}; st.log = {}; st.son = {}; st.av = {}; persist(); renderAll(); renderDefter(); };
  }
  function report() {
    const esc = (x) => String(x).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Gözlem raporu · Nokta'nın Kasabası</title>
<style>body{font-family:Georgia,serif;max-width:760px;margin:32px auto;padding:0 18px;color:#171411;background:#fffaf0;line-height:1.5}h1{font-size:30px;margin:0}h2{font-size:22px;border-bottom:2px solid #e8a33d;padding-bottom:4px;margin-top:28px}.k{font-family:monospace;color:#b8741a;font-size:13px}.q{background:#f1eadc;padding:8px 12px;border-radius:8px}</style></head><body>
<h1>Gözlem raporu: Nokta'nın Kasabası</h1><p class="k">${esc(st.ad || 'İsimsiz')} · ${new Date().toLocaleDateString('tr-TR')}</p>
${STS.map((S) => `<h2>${esc(S.ad)} <span class="k">${S.kod}</span></h2><p class="q"><b>Soru:</b> ${esc(S.soru)}<br><b>Tahminim:</b> ${st.sence[S.id] != null ? esc(S.secenekler[st.sence[S.id]]) : '—'}</p>
<p><b>Gözlemlerim:</b></p><ul>${(st.log[S.id] || []).filter((l) => !l.startsWith('Tahminim')).map((l) => `<li>${esc(l)}</li>`).join('') || '<li>—</li>'}</ul>
<p><b>Görevler:</b> ${S.gorevler.filter((t) => isDone(S.id, t.id)).length} / ${S.gorevler.length}</p>
<p><b>Son düşüncem:</b> ${esc(st.son[S.id] || '—')}</p>`).join('')}
<h2>Kasabada bulduğum şekiller</h2><ul>${T.avlar.filter((A) => st.av[A.id]).map((A) => `<li>${A.metin.replace(/<[^>]+>/g, '')}</li>`).join('') || '<li>—</li>'}</ul>
</body></html>`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'nokta-kasaba-gozlem-raporu.html';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function renderOgretmen() {
    $('#ogretmenBox').innerHTML = `<button class="chip-btn close" type="button" data-close>kapat ✕</button><h2>Öğretmen notları</h2>
      <ul>${T.ogretmenGenel.map((x) => `<li>${x}</li>`).join('')}</ul>
      ${STS.map((S) => `<h3>${S.ad} · ${S.kod}</h3><p>${S.ogretmen}</p>`).join('')}
      <h3>Kısayollar</h3><p class="small">1–6 gözlem noktaları · ← → kaydır · Z yakından incele · D defter · O öğretmen · P sunum modu · H arayüzü gizle · Esc kapat</p>
      <h3>Metinleri düzenlemek</h3><p class="small">Nokta’nın bütün metinleri, görevler ve bu notlar <code>js/kasaba-metinleri.js</code> dosyasındaki <code>KASABA_METINLERI</code> nesnesindedir.</p>`;
    $('#ogretmenBox').querySelector('[data-close]').onclick = closeSheets;
  }
  function togglePresent() { st.present = !st.present; $('#present').classList.toggle('on', st.present); $('#sunumBtn').setAttribute('aria-pressed', String(st.present)); }

  /* ══════════ tanıtım ══════════ */
  let ci = -1, hl, cbox;
  function coach(i) {
    ci = i; if (!hl) { hl = document.createElement('div'); hl.className = 'coach-hl'; cbox = document.createElement('div'); cbox.className = 'coach'; document.body.append(hl, cbox); }
    if (i >= T.tanitim.length) { hl.remove(); cbox.remove(); hl = cbox = null; try { localStorage.setItem(KEY + '-tanitim', '1'); } catch (_) {} return; }
    const step = T.tanitim[i], el = step.hedef ? $(step.hedef) : null;
    let r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    if (step.hedef === '#world') r = { left: innerWidth * .15, top: innerHeight * .25, width: innerWidth * .7, height: innerHeight * .45 };
    Object.assign(hl.style, { left: r.left - 6 + 'px', top: r.top - 6 + 'px', width: r.width + 12 + 'px', height: r.height + 12 + 'px', opacity: el || step.hedef ? 1 : 0 });
    cbox.innerHTML = `<div class="who"><img src="../img/nokta.png" alt=""><p>${step.metin}</p></div><div class="row2"><span class="n">${i + 1} / ${T.tanitim.length}</span><span><button class="btn" id="cSkip" type="button">Geç</button> <button class="btn primary" id="cNext" type="button">${i === T.tanitim.length - 1 ? 'Başla' : 'İleri →'}</button></span></div>`;
    const bw = Math.min(380, innerWidth - 24), bh = cbox.offsetHeight || 150;
    let x = r.left + r.width / 2 - bw / 2, y = r.top + r.height + 16;
    if (y + bh > innerHeight - 8) y = r.top - bh - 16; if (y < 8) y = Math.max(8, innerHeight / 2 - bh / 2);
    x = Math.max(12, Math.min(innerWidth - bw - 12, x));
    Object.assign(cbox.style, { left: x + 'px', top: y + 'px' });
    $('#cNext').onclick = () => coach(i + 1); $('#cSkip').onclick = () => coach(T.tanitim.length); $('#cNext').focus();
  }

  /* ══════════ bağlantılar ══════════ */
  function renderAll() { renderStations(); renderCard(); renderAv(); document.querySelectorAll('[data-hava]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.hava === st.hava))); }
  document.querySelectorAll('[data-hava]').forEach((b) => (b.onclick = () => { st.hava = b.dataset.hava; persist(); renderAll(); if (zoomOpen) Z.ask(); toast({ sabah: 'Günaydın kasaba!', aksam: 'Akşam oldu: pencereler ve fenerler yandı.', yagmur: 'Yağmur başladı: havuza ve su birikintilerine bak. Her damla bir <b>çember</b> çiziyor!' }[st.hava]); }));
  $('#avBtn').onclick = () => { const n = T.avlar.filter((A) => st.av[A.id]).length; toast(n === T.avlar.length ? 'Bütün şekilleri buldun! Defterine bak.' : `Kasabada saklı <b>${T.avlar.length - n}</b> şekil daha var. Çatılara, pencerelere, tabelalara ve çitlere dokun!`); };
  $('#defterBtn').onclick = () => { renderDefter(); openSheet('defter'); };
  $('#ogretmenBtn').onclick = () => { renderOgretmen(); openSheet('ogretmen'); };
  $('#sunumBtn').onclick = togglePresent;
  $('#yardimBtn').onclick = () => coach(0);
  addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (zoomOpen && e.key !== 'Escape') return;
    const k = e.key.toLowerCase();
    if (/^[1-9]$/.test(k) && +k <= STS.length) go(+k - 1);
    else if (k === 'pagedown') go(Math.min(STS.length - 1, st.cur + 1)); else if (k === 'pageup') go(Math.max(0, st.cur - 1));
    else if (k === 'arrowleft') cam.tx = clampCam(cam.tx - 300); else if (k === 'arrowright') cam.tx = clampCam(cam.tx + 300);
    else if (k === 'z') openZoom(); else if (k === 'd') $('#defterBtn').click(); else if (k === 'o') $('#ogretmenBtn').click();
    else if (k === 'p') togglePresent(); else if (k === 'h') document.body.classList.toggle('hide-ui'); else if (k === 'escape') closeSheets();
  });

  renderAll(); go(0); cam.x = cam.tx;
  requestAnimationFrame(frame);
  let seen = false; try { seen = !!localStorage.getItem(KEY + '-tanitim'); } catch (_) {}
  const q = new URLSearchParams(location.search);
  if (q.get('hava') && PAL[q.get('hava')]) { st.hava = q.get('hava'); renderAll(); }
  if (q.get('nokta')) { go(+q.get('nokta') - 1); nokta.x = nokta.tx; cam.x = cam.tx; }
  if (!seen && !q.has('tanitimsiz')) setTimeout(() => coach(0), 600);
})();
