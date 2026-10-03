/* Mürekkep çizim seti: Nokta'nın Oyunları / Kasaba görsel dilinin taşınabilir çekirdeği.
   Kullanım: bir <canvas> 2D bağlamıyla (ctx) çalışır. SK = true iken kenarlar el çizimi gibi titrer,
   tarama (hatch) ve yer gölgesi (groundShadow) devreye girer.
   Bağımlılık: N.INK, N.AMBER, N.SEAL, N.nz (sabit gürültü) — aşağıda tanımlı. GROUND: zemin çizgisinin y'si.
   Kaynak: github.com/hakanatas/matematik-oyun (js/kasaba.js, js/ortak.js). */
(function () {
const N = window.N = window.N || {};
N.INK = N.INK || '#171411'; N.AMBER = N.AMBER || '#e8a33d'; N.DEEP = N.DEEP || '#b8741a'; N.SEAL = N.SEAL || '#c4432b'; N.SHEET = N.SHEET || '#fffaf0';
N.nz = N.nz || ((a) => { const v = Math.sin(a * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); });
N.murekkep = function (ctx, opts = {}) {
  const GROUND = opts.GROUND || 600, st = opts.st || { t: 0, hava: 'sabah' };
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


  return { set SK(v) { SK = v; }, get SK() { return SK; }, sketchEdge, inkPoly, inkCircle, inkLine, rectPts, hatch, groundShadow };
};
/* Nokta karakteri: N.noktaChar(ctx, x, zeminY, { t, moving, dir, happy, sad }) */
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

})();
