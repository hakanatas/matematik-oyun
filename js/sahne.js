/* Oyun sahnesi · her oyun kasabada ya da çarşıda bir yerde geçer.
   Sayfanın altında el çizimi, canlı bir sokak: oyunun yapısı (saat kulesi, pastane…), yürüyen kasabalılar, güvercinler.
   Doğru cevapta sahne sevinir, yanlışta biri "Hmm…" der, oyun bitince herkes kutlar. Dünyaya dönüş bağlantısı da ekler.
   ortak.js'ten sonra yüklenir; oyunun koduna dokunmaz (N.say, N.addScore, N.finish'i sarar). */
(() => {
  const YER = {
    'arac-ustasi': { ad: 'Tren İstasyonu', ek: 'nda', dunya: 'kasaba', no: 1, yapi: 'tren' },
    'aci-avcisi': { ad: 'Saat Kulesi', ek: 'nde', dunya: 'kasaba', no: 2, yapi: 'saat' },
    'kesisme-dedektifi': { ad: 'Kavşak', ek: 'ta', dunya: 'kasaba', no: 3, yapi: 'kavsak' },
    'sekli-kapat': { ad: 'Çini Atölyesi', ek: 'nde', dunya: 'kasaba', no: 4, yapi: 'cini' },
    'ucgenin-sirri': { ad: 'Köprü', ek: 'de', dunya: 'kasaba', no: 5, yapi: 'kopru' },
    'pergel-ustasi': { ad: 'Çeşme Meydanı', ek: 'nda', dunya: 'kasaba', no: 6, yapi: 'cesme' },
    'kesir-firini': { ad: 'Pastane', ek: 'de', dunya: 'carsi', no: 3, yapi: 'pastane' },
    'kesir-yarisi': { ad: 'Pazar', ek: 'da', dunya: 'carsi', no: 4, yapi: 'pazar' },
  };
  const id = (location.pathname.split('/').pop() || '').replace('.html', ''), Y = YER[id];
  if (!Y || new URLSearchParams(location.search).has('sahnesiz')) return;
  const DUNYA = Y.dunya === 'carsi' ? { ad: 'çarşının', url: 'carsi.html' } : { ad: 'kasabanın', url: 'kasaba.html' };

  /* ── tuval ve yerleşim ── */
  const cv = document.createElement('canvas'); cv.className = 'sahne'; cv.setAttribute('aria-hidden', 'true');
  document.body.prepend(cv); document.body.classList.add('sahneli');
  const ctx = cv.getContext('2d'), H = 300, GY = H - 50; // GY: kaldırım çizgisi
  let W = 0, dpr = 1, LX = 0;
  function resize() { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; LX = W > 900 ? Math.min(W - 230, (W + 1280) / 2 - 200) : W / 2; place(); }
  addEventListener('resize', resize);

  // dünyaya dönüş bağlantısı
  const yerKart = () => { const bar = document.querySelector('.topbar'); if (!bar || bar.querySelector('.yer')) return;
    const a = document.createElement('a'); a.className = 'yer'; a.href = `${DUNYA.url}?nokta=${Y.no}`;
    a.innerHTML = `<span>Bu oyun ${DUNYA.ad} <b>${Y.ad}</b>’${Y.ek} geçiyor.</span><span class="git">Oraya git →</span>`; bar.insertBefore(a, bar.querySelector('.hud')); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', yerKart) : yerKart();

  /* ── el çizimi yardımcıları (titremesi sabit: N.nz) ── */
  const INK = N.INK, nz = N.nz;
  function edge(a, b, seed, amp = 1.4) { const n = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 26)); for (let i = 1; i <= n; i++) { const t = i / n, j = i === n ? 0 : (nz(seed + i * 1.7) - .5) * 2 * amp; ctx.lineTo(a.x + (b.x - a.x) * t + j, a.y + (b.y - a.y) * t + j * .6); } }
  function poly(pts, fill, lw = 2.5, seed = 1, closed = true) {
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) edge(pts[i - 1], pts[i], seed + i * 11); if (closed) edge(pts[pts.length - 1], pts[0], seed + 99);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke();
  }
  const rp = (x, y, w, h) => [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  const rect = (x, y, w, h, fill, lw = 2.2, seed = x) => poly(rp(x, y, w, h), fill, lw, seed);
  function hatch(x, y, w, h, gap = 6, a = .16) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = `rgba(23,20,17,${a})`; ctx.lineWidth = 1.2; ctx.beginPath(); for (let k = -h; k < w; k += gap) { ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h, y); } ctx.stroke(); ctx.restore(); }
  const line = (a, b, w = 2.5, col = INK) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); edge(a, b, a.x + b.y); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); };
  const shadow = (cx, w) => { ctx.beginPath(); ctx.ellipse(cx + 6, GY + 3, w / 2, 5, 0, 0, 7); ctx.fillStyle = 'rgba(23,20,17,.12)'; ctx.fill(); };
  function windowBox(x, y, w, h) { rect(x, y, w, h, '#d7e1e4', 1.8); ctx.strokeStyle = INK; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke(); }
  function house(x, w, h, roof, seed) {
    const top = GY - h; shadow(x + w / 2, w * 1.2); rect(x, top, w, h, '#f6efe1', 2.4, seed); hatch(x + w * .8, top, w * .2, h);
    poly([{ x: x - 10, y: top }, { x: x + w / 2, y: top - h * .42 }, { x: x + w + 10, y: top }], roof, 2.4, seed + 5);
    const nw = Math.max(1, Math.floor(w / 44)); for (let r = 0; r < Math.floor(h / 56); r++) for (let k = 0; k < nw; k++) windowBox(x + (w - nw * 30 + 10) / 2 + k * 30, top + 14 + r * 46, 20, 24);
    rect(x + w / 2 - 11, GY - 34, 22, 34, '#8a6a4a', 2, seed + 3);
  }
  function tree(x, k = 1) { line({ x, y: GY }, { x: x + 2, y: GY - 50 * k }, 6 * k, '#6b4f35'); [[0, -70, 28], [-20, -54, 22], [20, -56, 22]].forEach(([dx, dy, r], i) => { ctx.beginPath(); ctx.arc(x + dx * k, GY + dy * k, r * k, 0, 7); ctx.fillStyle = i ? '#9bb383' : '#87a074'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke(); }); }
  function lamp(x) { line({ x, y: GY }, { x, y: GY - 92 }, 3); poly([{ x: x - 9, y: GY - 92 }, { x: x + 9, y: GY - 92 }, { x: x + 6, y: GY - 112 }, { x: x - 6, y: GY - 112 }], '#f3e7c4', 2, x); }
  function person(x, y, dir, col, step, hop = 0) {
    y -= hop; const lg = Math.sin(step) * 6;
    ctx.beginPath(); ctx.ellipse(x + 2, y + hop + 1, 11, 3, 0, 0, 7); ctx.fillStyle = 'rgba(23,20,17,.14)'; ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y - 17); ctx.lineTo(x + lg, y); ctx.moveTo(x, y - 17); ctx.lineTo(x - lg, y); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 29, 13, 0, 7); ctx.fillStyle = '#e9e1d3'; ctx.fill(); ctx.lineWidth = 2.2; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 21, 9, .15 * Math.PI, .85 * Math.PI); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + dir * 5, y - 32, 1.6, 0, 7); ctx.arc(x + dir * 9.5, y - 32, 1.6, 0, 7); ctx.fill(); ctx.lineCap = 'butt';
  }

  /* ── canlılar ── */
  let t = 0; const COLS = [N.AMBER, N.SEAL, '#5b7a8c', '#87a074', N.DEEP, '#e58b8b'];
  let WALK = [], PIG = [], HOUSES = [];
  function place() {
    const n = Math.max(3, Math.round(W / 260));
    WALK = Array.from({ length: n }, (_, i) => ({ a: 20 + (i * W / n) * .7, b: Math.min(W - 20, 20 + (i * W / n) * .7 + W * .45), sp: 22 + (i * 7) % 15, ph: (i * .37) % 1, col: COLS[i % COLS.length], hop: -9, say: null }));
    PIG = [-70, -40, 60, 90, 120].map((dx, i) => ({ x: LX + dx, fly: -99, i }));
    HOUSES = []; let x = -40, s = 3; const roofs = ['#c4432b', '#b8741a', '#8a6a4a', '#5b7a8c'];
    while (x < W + 40) { const w = 110 + (nz(s) * 60 | 0), h = 120 + (nz(s + 2) * 70 | 0); if (Math.abs(x + w / 2 - LX) > w / 2 + 170) HOUSES.push({ x, w, h, roof: roofs[s % 4], s, tree: nz(s + 5) > .45 }); x += w + 50 + nz(s + 9) * 50; s++; }
  }
  const walkerX = (W0) => { const L = W0.b - W0.a, dd = (t * W0.sp + W0.ph * 2 * L) % (2 * L); return dd < L ? { x: W0.a + dd, dir: 1 } : { x: W0.b - (dd - L), dir: -1 }; };
  const BUB = []; const bubble = (x, y, text) => { BUB.push({ x, y, text, t0: t }); };
  const FX = []; function stars(x, y, n = 10) { for (let i = 0; i < n; i++) FX.push({ x: x + (Math.random() - .5) * 120, y: y + (Math.random() - .5) * 50, vy: -14 - Math.random() * 20, t0: t + i * .05, life: 1.4 }); }

  /* ── yapılar ── */
  const YAPI = {
    saat(cx) { // saat kulesi: kollar gerçek saati gösterir
      const w = 74, h = 168, top = GY - h; shadow(cx, 110); rect(cx - w / 2, top, w, h, '#efe2c8', 2.6, 7); hatch(cx + w * .25, top, w * .25, h);
      for (let r = top + 20; r < GY; r += 22) { ctx.strokeStyle = 'rgba(23,20,17,.14)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx - w / 2, r); ctx.lineTo(cx + w / 2, r); ctx.stroke(); }
      poly([{ x: cx - w / 2 - 12, y: top }, { x: cx, y: top - 56 }, { x: cx + w / 2 + 12, y: top }], '#c4432b', 2.6, 8);
      const sw = Math.sin(t * 3) * (bell > t ? .4 : .04); ctx.save(); ctx.translate(cx, top - 20); ctx.rotate(sw); ctx.beginPath(); ctx.moveTo(-9, 10); ctx.quadraticCurveTo(-9, -6, 0, -8); ctx.quadraticCurveTo(9, -6, 9, 10); ctx.closePath(); ctx.fillStyle = '#d9a650'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      const cy = top + 42, R = 25, d = new Date(), m = d.getMinutes() + d.getSeconds() / 60, hh = (d.getHours() % 12) + m / 60;
      ctx.beginPath(); ctx.arc(cx, cy, R + 4, 0, 7); ctx.fillStyle = '#b8741a'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.stroke();
      for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R - 3), cy + Math.sin(a) * (R - 3)); ctx.lineTo(cx + Math.cos(a) * (R - (k % 3 ? 6 : 9)), cy + Math.sin(a) * (R - (k % 3 ? 6 : 9))); ctx.lineWidth = k % 3 ? 1.2 : 2; ctx.stroke(); }
      const hand = (ang, L, w) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ang) * L, cy - Math.cos(ang) * L); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt'; };
      hand(hh / 12 * 2 * Math.PI, 13, 3); hand(m / 60 * 2 * Math.PI, 19, 2); ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, 7); ctx.fillStyle = N.SEAL; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - 14, GY); ctx.lineTo(cx - 14, GY - 34); ctx.arc(cx, GY - 34, 14, Math.PI, 0); ctx.lineTo(cx + 14, GY); ctx.fillStyle = '#7b5a3c'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    },
    tren(cx) { // istasyon binası ve geçen tren
      shadow(cx, 200); rect(cx - 80, GY - 96, 160, 96, '#efe2c8', 2.5, 21); hatch(cx + 50, GY - 96, 30, 96);
      poly([{ x: cx - 96, y: GY - 96 }, { x: cx + 96, y: GY - 96 }, { x: cx + 80, y: GY - 122 }, { x: cx - 80, y: GY - 122 }], '#8a6a4a', 2.5, 22);
      rect(cx - 40, GY - 140, 80, 22, '#fffaf0', 2, 23); ctx.font = `400 15px ${N.BRUSH}`; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('İSTASYON', cx, GY - 129);
      [-50, 30].forEach((dx) => windowBox(cx + dx, GY - 76, 22, 28)); rect(cx - 12, GY - 50, 24, 50, '#7b5a3c', 2, 24);
    },
    kavsak(cx) { // trafik ışığı ve yaya geçidi
      const ph = t % 12, isik = ph < 5 ? 2 : ph < 6 ? 1 : 0; // ışığın sırası: 0 kırmızı, 1 sarı, 2 yeşil
      for (let k = -3; k <= 3; k++) { ctx.fillStyle = 'rgba(255,250,240,.85)'; ctx.fillRect(cx + k * 20 - 7, GY + 8, 14, 34); }
      line({ x: cx + 70, y: GY }, { x: cx + 70, y: GY - 120 }, 4); rect(cx + 58, GY - 170, 24, 58, '#2f2a26', 2, 31);
      ['#c4432b', '#e8a33d', '#87a074'].forEach((c, i) => { ctx.beginPath(); ctx.arc(cx + 70, GY - 160 + i * 19, 7, 0, 7); ctx.fillStyle = i === isik ? c : 'rgba(255,255,255,.15)'; ctx.fill(); });
      // yön tabelası (ışın)
      line({ x: cx - 80, y: GY }, { x: cx - 80, y: GY - 100 }, 3); poly([{ x: cx - 80, y: GY - 100 }, { x: cx - 20, y: GY - 100 }, { x: cx - 8, y: GY - 89 }, { x: cx - 20, y: GY - 78 }, { x: cx - 80, y: GY - 78 }], '#5b7a8c', 2, 32);
      ctx.font = `400 14px ${N.BRUSH}`; ctx.fillStyle = '#fffaf0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ÇARŞI', cx - 46, GY - 89);
    },
    cini(cx) { // çini atölyesi: altıgen çinili cephe
      const w = 170, h = 140, top = GY - h; shadow(cx, 220); rect(cx - w / 2, top, w, h, '#eef3f2', 2.5, 41);
      ctx.save(); ctx.beginPath(); ctx.rect(cx - w / 2 + 8, top + 30, w - 16, 52); ctx.clip();
      for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) { const hx = cx - w / 2 + 8 + k * 21 + (r % 2) * 10.5, hy = top + 38 + r * 18; ctx.beginPath(); for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3 + Math.PI / 6; ctx.lineTo(hx + Math.cos(a) * 11, hy + Math.sin(a) * 11); } ctx.closePath(); ctx.fillStyle = (k + r) % 3 ? '#2f5d8a' : '#3f8f8a'; ctx.fill(); ctx.strokeStyle = '#fffaf0'; ctx.lineWidth = 1.5; ctx.stroke(); }
      ctx.restore(); rect(cx - w / 2 + 8, top + 30, w - 16, 52, null, 2, 42);
      poly([{ x: cx - w / 2 - 10, y: top }, { x: cx + w / 2 + 10, y: top }, { x: cx + w / 2, y: top - 20 }, { x: cx - w / 2, y: top - 20 }], '#3f8f8a', 2.4, 43);
      ctx.font = `400 18px ${N.BRUSH}`; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ÇİNİ ATÖLYESİ', cx, top + 15);
      rect(cx + 30, GY - 48, 26, 48, '#7b5a3c', 2, 44); windowBox(cx - 60, GY - 50, 50, 34);
    },
    kopru(cx) { // nehir ve kafes köprü (üçgenler)
      ctx.fillStyle = '#9fbccb'; ctx.beginPath(); ctx.moveTo(cx - 150, GY); ctx.lineTo(cx + 150, GY); ctx.lineTo(cx + 170, H); ctx.lineTo(cx - 170, H); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; for (let k = 0; k < 6; k++) { const wx = cx - 130 + ((k * 53 + t * 18) % 260), wy = GY + 14 + (k % 3) * 12; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + 8, wy - 4, wx + 16, wy); ctx.stroke(); }
      const L = cx - 150, R = cx + 150, dy = GY - 6, n = 6, sw = (R - L) / n; line({ x: L, y: dy }, { x: R, y: dy }, 4); line({ x: L + sw * .5, y: dy - 50 }, { x: R - sw * .5, y: dy - 50 }, 3.5);
      for (let k = 0; k < n; k++) { line({ x: L + k * sw, y: dy }, { x: L + (k + .5) * sw, y: dy - 50 }, 2.5, '#5b7a8c'); line({ x: L + (k + .5) * sw, y: dy - 50 }, { x: L + (k + 1) * sw, y: dy }, 2.5, '#5b7a8c'); }
      [cx - 70, cx + 40].forEach((dx, i) => { const by = GY + 30 + Math.sin(t * 2 + i) * 2; ctx.beginPath(); ctx.ellipse(dx, by, 12, 6, 0, 0, 7); ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke(); ctx.beginPath(); ctx.arc(dx + 9, by - 7, 5, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = N.AMBER; ctx.fillRect(dx + 13, by - 8, 5, 2.5); });
    },
    cesme(cx) { // çeşme: suyun yayları
      shadow(cx, 200); poly([{ x: cx - 80, y: GY }, { x: cx - 90, y: GY - 34 }, { x: cx + 90, y: GY - 34 }, { x: cx + 80, y: GY }], '#d8cbb3', 2.5, 51);
      ctx.beginPath(); ctx.ellipse(cx, GY - 34, 90, 9, 0, 0, 7); ctx.fillStyle = '#9fbccb'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      rect(cx - 8, GY - 92, 16, 58, '#d8cbb3', 2, 52); ctx.beginPath(); ctx.ellipse(cx, GY - 92, 30, 6, 0, 0, 7); ctx.fillStyle = '#d8cbb3'; ctx.fill(); ctx.stroke();
      for (let k = 0; k < 14; k++) { const s = k % 2 ? 1 : -1, u = ((t * .9 + k / 14) % 1), x = cx + s * u * 70, y = GY - 96 - Math.sin(u * Math.PI) * 30 + u * 60; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fillStyle = 'rgba(95,140,165,.85)'; ctx.fill(); }
    },
    pastane(cx) {
      const w = 190, h = 150, top = GY - h; shadow(cx, 240); rect(cx - w / 2, top, w, h, '#f7e6e0', 2.5, 61);
      ctx.save(); ctx.beginPath(); ctx.rect(cx - w / 2 - 12, top + 14, w + 24, 26); ctx.clip(); for (let k = 0; k < 12; k++) { ctx.fillStyle = k % 2 ? '#fffaf0' : '#e58b8b'; ctx.fillRect(cx - w / 2 - 12 + k * 18, top + 14, 18, 26); } ctx.restore(); rect(cx - w / 2 - 12, top + 14, w + 24, 26, null, 2, 62);
      rect(cx - 60, top - 30, 120, 28, '#fffaf0', 2.2, 63); ctx.font = `400 20px ${N.BRUSH}`; ctx.fillStyle = N.SEAL; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PASTANE', cx, top - 16);
      rect(cx - 80, top + 56, 100, 64, '#eef3f2', 2.2, 64); ctx.beginPath(); ctx.ellipse(cx - 30, top + 100, 30, 10, 0, 0, 7); ctx.fillStyle = '#d9a650'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(cx - 30, top + 100); ctx.lineTo(cx - 30 + Math.cos(a) * 30, top + 100 + Math.sin(a) * 10); ctx.strokeStyle = 'rgba(23,20,17,.5)'; ctx.lineWidth = 1; ctx.stroke(); }
      rect(cx + 40, GY - 62, 30, 62, '#7b5a3c', 2, 65);
      for (let k = 0; k < 3; k++) { const ph = (t * .5 + k / 3) % 1; ctx.beginPath(); ctx.arc(cx + 70 + Math.sin(ph * 6) * 4, top - 10 - ph * 50, 5 + ph * 8, 0, 7); ctx.fillStyle = `rgba(120,110,100,${.3 * (1 - ph)})`; ctx.fill(); }
    },
    pazar(cx) {
      [[-95, '#87a074', '#c4432b', '1/2 kg'], [20, N.SEAL, N.AMBER, '0,5 kg']].forEach(([dx, col, fr, tag], i) => {
        const x = cx + dx, w = 110, tY = GY - 110; shadow(x + w / 2, 130); line({ x: x + 6, y: GY }, { x: x + 6, y: tY }, 3, '#6b4f35'); line({ x: x + w - 6, y: GY }, { x: x + w - 6, y: tY }, 3, '#6b4f35');
        ctx.save(); ctx.beginPath(); ctx.rect(x - 10, tY, w + 20, 24); ctx.clip(); for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#fffaf0' : col; ctx.fillRect(x - 10 + k * 17, tY, 17, 24); } ctx.restore(); rect(x - 10, tY, w + 20, 24, null, 2, 71 + i);
        rect(x - 2, GY - 42, w + 4, 42, '#c9a27a', 2, 73 + i); for (let f = 0; f < 8; f++) { ctx.beginPath(); ctx.arc(x + 14 + f * 12, GY - 48 - (f % 2) * 6, 6, 0, 7); ctx.fillStyle = fr; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.stroke(); }
        const sw = Math.sin(t * 1.5 + i) * .06; ctx.save(); ctx.translate(x + w / 2, tY + 24); ctx.rotate(sw); rect(-28, 6, 56, 22, '#fffaf0', 1.8, 75 + i); ctx.font = `600 12px ${N.MONO}`; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tag, 0, 17); ctx.restore();
      });
    },
  };

  /* hareketli şeyler: tren ve araba kendi şeridinde geçer */
  const car = { x: -200, k: 0 };
  function movers(dt) {
    if (Y.yapi === 'tren') {
      ctx.strokeStyle = 'rgba(23,20,17,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, GY + 34); ctx.lineTo(W, GY + 34); ctx.moveTo(0, GY + 40); ctx.lineTo(W, GY + 40); ctx.stroke();
      for (let x = 6; x < W; x += 22) { ctx.fillStyle = 'rgba(107,79,53,.45)'; ctx.fillRect(x, GY + 32, 7, 11); }
      const P = 34, p = t % P, x = (p / P) * (W + 700) - 600; if (p < P) {
        [[0, '#c4432b', 1], [-150, '#5b7a8c', 0], [-290, '#87a074', 0]].forEach(([dx, col, loco]) => { const bx = x + dx; rect(bx, GY - 18, loco ? 120 : 130, 48, col, 2.4, 81 + dx); for (let k = 0; k < 3; k++) windowBox(bx + 12 + k * 34, GY - 10, 22, 18); [bx + 22, bx + 98].forEach((wx) => { ctx.beginPath(); ctx.arc(wx, GY + 32, 9, 0, 7); ctx.fillStyle = '#2f2a26'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke(); }); if (loco) { rect(bx + 90, GY - 44, 16, 26, '#2f2a26', 2, 85); for (let k = 0; k < 4; k++) { const ph = (t * 1.6 + k / 4) % 1; ctx.beginPath(); ctx.arc(bx + 98 - ph * 60, GY - 50 - ph * 40, 5 + ph * 10, 0, 7); ctx.fillStyle = `rgba(150,140,130,${.4 * (1 - ph)})`; ctx.fill(); } } });
        if (Math.abs(x - LX) < 8) ses.duduk();
      }
    }
    if (Y.yapi === 'kavsak') { // araba kırmızıda durur
      const isik = (t % 12) < 5 ? 2 : (t % 12) < 6 ? 1 : 0, stopX = LX - 110;
      if (!(isik === 0 && car.x + 80 > stopX - 14 && car.x + 80 < stopX)) car.x += dt * 130;
      if (car.x > W + 60) { car.x = -260; car.k++; }
      const x = car.x, col = ['#5b7a8c', N.SEAL, N.AMBER][car.k % 3]; rect(x, GY + 6, 80, 22, col, 2.2, 91); poly([{ x: x + 14, y: GY + 6 }, { x: x + 22, y: GY - 10 }, { x: x + 58, y: GY - 10 }, { x: x + 68, y: GY + 6 }], '#d7e1e4', 2, 92);
      [x + 18, x + 62].forEach((wx) => { ctx.beginPath(); ctx.arc(wx, GY + 30, 8, 0, 7); ctx.fillStyle = '#2f2a26'; ctx.fill(); });
    }
  }

  /* ── tepkiler ── */
  const SEVINC = ['Bravo!', 'Aferin!', 'Süper!', 'Harika!', 'Evet!', 'Çok iyi!'], HMM = ['Hmm…', 'Bir daha dene!', 'Neredeyse!', 'Sakin, yine dene.'];
  let son = -9, bell = 0, kutlama = 0, bunt = 0;
  function sevin() {
    if (t - son < 1) return; son = t; bunt = t + 2.5;
    const near = WALK.map((w) => ({ w, x: walkerX(w).x })).sort((a, b) => Math.abs(a.x - LX) - Math.abs(b.x - LX));
    near.slice(0, 2).forEach(({ w }) => { w.hop = t; }); const k = near[0]; if (k) bubble(k.x, GY - 50, SEVINC[(Math.random() * SEVINC.length) | 0]);
    PIG.forEach((p) => { if (t - p.fly > 4) p.fly = t; }); stars(LX, GY - 150, 7);
    if (Y.yapi === 'saat') bell = t + 1.5;
  }
  function uz() { if (t - son < 1) return; son = t; const w = WALK[(Math.random() * WALK.length) | 0]; const x = walkerX(w).x; bubble(x, GY - 50, HMM[(Math.random() * HMM.length) | 0]); }
  function kutla() { kutlama = t + 6; bunt = t + 8; WALK.forEach((w, i) => { w.hop = t + i * .15; }); PIG.forEach((p) => { p.fly = t; }); for (let k = 0; k < 4; k++) setTimeout(() => stars(LX + (Math.random() - .5) * 300, GY - 140, 12), k * 500); if (Y.yapi === 'saat') bell = t + 4; ses.zil(); }
  const oSay = N.say, oAdd = N.addScore, oFin = N.finish;
  N.say = (html, mood) => { if (mood === 'good') sevin(); else if (mood === 'bad') uz(); return oSay(html, mood); };
  N.addScore = (n, at, bad) => { if (n > 0) sevin(); else if (n < 0 || bad) uz(); return oAdd(n, at, bad); };
  N.finish = (o) => { kutla(); return oFin(o); };
  window.__sahne = { sevin, uz, kutla, yer: Y };

  /* ── ortam sesi: ara sıra kuş, yere göre su ya da çarşı uğultusu; ses kapalıysa sessiz ── */
  const ses = (() => {
    let ac = null, loop = null, nextBird = 2;
    const kapali = () => { try { return localStorage.getItem('nokta-ses') === 'kapali' || document.hidden; } catch (_) { return false; } };
    const blip = (f0, f1, dur, vol, type = 'sine', delay = 0) => { if (!ac || kapali()) return; const s = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, s); o.frequency.exponentialRampToValueAtTime(f1, s + dur); g.gain.setValueAtTime(.0001, s); g.gain.exponentialRampToValueAtTime(vol, s + .012); g.gain.exponentialRampToValueAtTime(.0001, s + dur); o.connect(g).connect(ac.destination); o.start(s); o.stop(s + dur + .05); };
    function start() {
      if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
      try { ac = new (window.AudioContext || window.webkitAudioContext)();
        const kind = Y.yapi === 'cesme' || Y.yapi === 'kopru' ? ['bandpass', 900, .8, .02] : Y.dunya === 'carsi' ? ['bandpass', 480, 1.6, .025] : null;
        if (kind) { const b = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), ch = b.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(); s.buffer = b; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = kind[0]; fl.frequency.value = kind[1]; fl.Q.value = kind[2]; loop = ac.createGain(); loop.gain.value = 0; loop.v = kind[3]; s.connect(fl).connect(loop).connect(ac.destination); s.start(); }
      } catch (_) { ac = null; }
    }
    addEventListener('pointerdown', start, { passive: true }); addEventListener('keydown', start);
    return {
      tick(dt) { if (!ac) return; if (loop) loop.gain.setTargetAtTime(kapali() ? 0 : loop.v, ac.currentTime, .4); if ((nextBird -= dt) < 0) { nextBird = 5 + Math.random() * 8; const f = 2400 + Math.random() * 1500, v = .012 + Math.random() * .01; for (let i = 0; i < 2 + (Math.random() * 3 | 0); i++) blip(f, f * 1.3, .09, v, 'sine', i * .13); } },
      duduk() { [587, 740].forEach((f) => blip(f, f, .9, .02, 'sawtooth')); },
      zil() { if (Y.yapi === 'saat') [523, 392, 523, 392].forEach((f, i) => blip(f, f * .995, 1.2, .05, 'sine', i * .38)); },
    };
  })();

  /* ── çizim döngüsü ── */
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; t += N.reduced ? dt * .25 : dt; ses.tick(dt);
    if (document.hidden) return requestAnimationFrame(frame);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    // gökyüzü: bulut ve kuşlar
    for (let i = 0; i < 4; i++) { const x = ((i * 410 + t * (6 + i * 2)) % (W + 300)) - 150, y = 18 + (i * 23) % 40; ctx.beginPath(); ctx.arc(x, y, 14, Math.PI * .9, Math.PI * 1.95); ctx.arc(x + 20, y - 7, 18, Math.PI * 1.05, Math.PI * 1.9); ctx.arc(x + 42, y, 13, Math.PI * 1.2, Math.PI * .1); ctx.closePath(); ctx.fillStyle = 'rgba(255,252,244,.85)'; ctx.fill(); ctx.strokeStyle = 'rgba(23,20,17,.15)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    { const bx = ((t * 40) % (W + 400)) - 200, by = 40 + Math.sin(t * .4) * 8; ctx.strokeStyle = INK; ctx.lineWidth = 1.8; [[0, 0], [-20, -11], [-20, 11], [-40, -22], [-40, 22]].forEach(([dx, dy], i) => { const f = Math.sin(t * 9 + i) * 4, x = bx + dx, y = by + dy; ctx.beginPath(); ctx.moveTo(x - 8, y - 1 + f); ctx.quadraticCurveTo(x - 4, y - 5, x, y); ctx.quadraticCurveTo(x + 4, y - 5, x + 8, y - 1 + f); ctx.stroke(); }); }
    // uzak siluet
    ctx.fillStyle = 'rgba(23,20,17,.07)'; for (let x = -30, i = 0; x < W; x += 95, i++) { const h = 50 + (nz(i) * 50 | 0); ctx.fillRect(x, GY - 60 - h, 70, h + 60); ctx.beginPath(); ctx.moveTo(x - 6, GY - 60 - h); ctx.lineTo(x + 35, GY - 90 - h); ctx.lineTo(x + 76, GY - 60 - h); ctx.fill(); }
    // zemin
    ctx.fillStyle = '#e6d9bd'; ctx.fillRect(0, GY, W, H - GY); ctx.strokeStyle = 'rgba(23,20,17,.16)'; ctx.lineWidth = 1.3;
    for (let r = 0; r < 2; r++) { ctx.beginPath(); for (let x = (r % 2) * 20; x < W; x += 40) { ctx.moveTo(x, GY + 16 + r * 18); ctx.arc(x + 18, GY + 16 + r * 18, 18, Math.PI, 0); } ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(0, GY); edge({ x: 0, y: GY }, { x: W, y: GY }, 5, 1); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
    // evler, ağaçlar, fenerler, yapı
    HOUSES.forEach((h, i) => { house(h.x, h.w, h.h, h.roof, h.s); if (h.tree) tree(h.x + h.w + 24, .8); if (i % 2) lamp(h.x - 22); });
    // bayrak süsü: yapıdan sağa
    { const a = { x: LX - 150, y: GY - 120 }, b = { x: LX + 150, y: GY - 120 }, k = bunt > t ? 1 : .25; ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo(LX, a.y + 26, b.x, b.y); ctx.stroke();
      for (let i = 0; i < 11; i++) { const u = (i + .5) / 11, x = a.x + (b.x - a.x) * u, y = a.y + 26 * 2 * u * (1 - u) * 1, s = Math.sin(t * (k > .5 ? 9 : 2.5) + i) * 4 * k; ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x + 7, y); ctx.lineTo(x + s, y + 16); ctx.closePath(); ctx.fillStyle = [N.AMBER, N.SEAL, '#fffaf0', '#87a074'][i % 4]; ctx.fill(); ctx.lineWidth = 1.1; ctx.stroke(); } }
    YAPI[Y.yapi](LX);
    movers(dt);
    // güvercinler
    PIG.forEach((p) => { const f = (t - p.fly) / 4, fl = f >= 0 && f < 1, x = p.x + (fl ? Math.sin(f * Math.PI) * 120 * (p.i % 2 ? 1 : -1) : 0), y = GY + 10 - (fl ? Math.sin(f * Math.PI) * 140 : 0);
      ctx.save(); ctx.translate(x, y); if (p.i % 2) ctx.scale(-1, 1); ctx.beginPath(); ctx.ellipse(0, -7, 10, 7, 0, 0, 7); ctx.fillStyle = '#9a9aa0'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
      if (fl) { const w = Math.sin(t * 18) * 9; ctx.beginPath(); ctx.moveTo(-3, -9); ctx.lineTo(-8, -20 - w); ctx.moveTo(3, -9); ctx.lineTo(8, -20 - w); ctx.stroke(); }
      const pk = !fl && Math.sin(t * 3 + p.i * 2) > .7 ? 6 : 0; ctx.beginPath(); ctx.arc(9, -14 + pk, 4.5, 0, 7); ctx.fillStyle = '#7f7f88'; ctx.fill(); ctx.stroke(); ctx.fillStyle = N.AMBER; ctx.fillRect(13, -15 + pk, 4, 2); ctx.restore(); });
    // kasabalılar
    WALK.forEach((w) => { const { x, dir } = walkerX(w), a = t - w.hop, hop = a >= 0 && a < (kutlama > t ? 5 : .6) ? Math.abs(Math.sin(a / .6 * Math.PI)) * 14 : 0; person(x, GY + 22, dir, w.col, t * w.sp * .25, hop); });
    // efektler ve balonlar
    for (let i = FX.length - 1; i >= 0; i--) { const p = FX[i], a = t - p.t0; if (a < 0) continue; if (a > p.life) { FX.splice(i, 1); continue; } ctx.save(); ctx.translate(p.x, p.y + p.vy * a); ctx.rotate(a * 2); ctx.globalAlpha = Math.sin((1 - a / p.life) * Math.PI); ctx.fillStyle = N.AMBER; ctx.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 4 : 9, an = j * Math.PI / 5; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); }
    for (let i = BUB.length - 1; i >= 0; i--) { const b = BUB[i], a = t - b.t0; if (a > 2.2) { BUB.splice(i, 1); continue; } ctx.globalAlpha = Math.min(1, (2.2 - a) * 3, a * 8); ctx.font = `400 19px ${N.BRUSH}`; const w = ctx.measureText(b.text).width + 20, x = Math.max(w / 2 + 4, Math.min(W - w / 2 - 4, b.x)), y = b.y - a * 6;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y - 30, w, 28, 10) : ctx.rect(x - w / 2, y - 30, w, 28); ctx.fillStyle = N.SHEET; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.text, x, y - 16); ctx.globalAlpha = 1; }
    requestAnimationFrame(frame);
  }
  resize(); requestAnimationFrame(frame);
})();
