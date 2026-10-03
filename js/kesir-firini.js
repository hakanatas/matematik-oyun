/* Kesir Fırını · MAT.5.1.3
   Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme.
   Nokta'nın fırınına siparişler gelir; her miktar başka bir kılıkta gösterilir:
   1) Modelle göster: pastayı / tepsiyi eş parçalara kes, dilim seç (denk kesirler de kabul).
   2) Tam sayılı kesir: ölçü kaplarını doldur → bileşik kesir → ondalık gösterim.
   3) Sayı doğrusu: önce aralığı tahmin et, sonra işaretçiyi 0–3 doğrusunda yerine sürükle.
   4) Yüzlük kart: kareleri boya; x/100 = ondalık = yüzde.
   5) Dört kılık: aynı miktarı gösteren bütün kartları seç. */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640;
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));

  const STEPS = ['model', 'model', 'model', 'karisik', 'dogru', 'dogru', 'yuzluk', 'yuzluk', 'dort'];
  // model 3 × 30 + gerekçe 10 · tam sayılı kesir 20 + 15 + 15 · sayı doğrusu 2 × (10 + 20) · yüzlük 2 × 25 · dört kılık 40
  N.max = 3 * 30 + 10 + 50 + 2 * 30 + 2 * 25 + 40;
  const st = { si: -1, view: null, down: null, move: null, up: null };

  const CREAM = '#f6e4c0', JAM = 'rgba(232,163,61,.86)', RIM = '#dcb67c';
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const fmt = (x) => N.fmt(x, 4);
  const fr = (a, b) => `${a}/${b}`;
  const sum = (a) => a.reduce((s, x) => s + x, 0);

  /* ── yazı: kesir, tam sayılı kesir, eşitlik satırı ── */
  function fracW(c, a, b, s, whole) {
    c.font = `400 ${s}px ${N.BRUSH}`;
    let w = Math.max(c.measureText(String(a)).width, c.measureText(String(b)).width) + s * .3;
    if (whole) { c.font = `400 ${s * 1.45}px ${N.BRUSH}`; w += c.measureText(String(whole)).width + s * .15; }
    return w;
  }
  function frac(c, a, b, x, y, o = {}) {
    const s = o.size || 44, col = o.color || N.INK, wh = o.whole;
    c.font = `400 ${s}px ${N.BRUSH}`;
    const bw = Math.max(c.measureText(String(a)).width, c.measureText(String(b)).width) + s * .3;
    let fx = x;
    if (wh) {
      const tot = fracW(c, a, b, s, wh); c.font = `400 ${s * 1.45}px ${N.BRUSH}`;
      const ww = c.measureText(String(wh)).width, left = x - tot / 2;
      d.text(c, String(wh), left + ww / 2, y + s * .04, { size: s * 1.45, color: col });
      fx = left + ww + s * .15 + bw / 2;
    }
    d.text(c, String(a), fx, y - s * .5, { size: s, color: col });
    d.seg(c, { x: fx - bw / 2, y }, { x: fx + bw / 2, y }, { w: Math.max(2.4, s / 15), color: col });
    d.text(c, String(b), fx, y + s * .6, { size: s, color: col });
  }
  /** items: {f:[a,b], w} kesir · '0,75' / '%75' / '=' yazı */
  function eqRow(c, items, cx, y, s, col) {
    const ws = items.map((it) => (typeof it === 'string' ? (c.font = `400 ${s * 1.3}px ${N.BRUSH}`, c.measureText(it).width) : fracW(c, it.f[0], it.f[1], s, it.w)));
    const gap = s * .35, tot = sum(ws) + gap * (items.length - 1);
    let x = cx - tot / 2;
    items.forEach((it, i) => {
      const m = x + ws[i] / 2;
      if (typeof it === 'string') d.text(c, it, m, y, { size: s * 1.3, color: it === '=' ? N.SOFT : col || N.INK });
      else frac(c, it.f[0], it.f[1], m, y, { size: s, whole: it.w, color: col });
      x += ws[i] + gap;
    });
  }
  const qHtml = (q) => (typeof q === 'string' ? q : `${q.w ? q.w + ' ' : ''}${fr(q.f[0], q.f[1])}`);

  /* ── sipariş fişi (sol üst) ── */
  function ticket(c, q, item, o = {}) {
    const w = 250, h = 184, x = 24, y = 22;
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(-.03);
    c.save(); c.shadowColor = 'rgba(60,40,10,.28)'; c.shadowBlur = 14; c.shadowOffsetY = 5; c.fillStyle = N.SHEET; c.fillRect(-w / 2, -h / 2, w, h); c.restore();
    d.poly(c, [{ x: -w / 2, y: -h / 2 }, { x: w / 2, y: -h / 2 }, { x: w / 2, y: h / 2 }, { x: -w / 2, y: h / 2 }], { w: 2.2 });
    d.text(c, o.label || 'SİPARİŞ', -w / 2 + 16, -h / 2 + 21, { size: 13, font: N.MONO, weight: 500, align: 'left', color: N.DEEP, halo: false });
    if (o.no) d.text(c, `no. ${o.no}`, w / 2 - 14, -h / 2 + 21, { size: 13, font: N.MONO, weight: 500, align: 'right', color: N.SOFT, halo: false });
    d.seg(c, { x: -w / 2 + 10, y: -h / 2 + 37 }, { x: w / 2 - 10, y: -h / 2 + 37 }, { w: 1.5, dash: [5, 5], color: N.SOFT });
    eqRow(c, [q], 0, 2, 42);
    d.text(c, item, 0, h / 2 - 27, { size: 30 });
    d.dot(c, { x: 0, y: -h / 2 + 1 }, { r: 7, color: N.SEAL });
    c.restore();
  }

  /* ── modeller: pasta (daire dilimleri), tepsi (şeritler) ── */
  const CK = { x: 615, y: 352 }, CR = 200, TR = { x0: 350, y0: 185, x1: 880, y1: 520 };
  const turn = (f) => -Math.PI / 2 + f * 2 * Math.PI;
  function pie(c, C, R, n, sel, o = {}) {
    const cuts = o.cuts || Array.from({ length: n }, (_, i) => i / n), nx = (i) => (i + 1 < n ? cuts[i + 1] : 1);
    if (o.plate) {
      c.beginPath(); c.ellipse(C.x + 4, C.y + R * .1, R * 1.12, R * 1.1, 0, 0, 7); c.fillStyle = 'rgba(23,20,17,.08)'; c.fill();
      d.circle(c, C, R * 1.1, { fill: '#fffdf6', w: 2, color: 'rgba(23,20,17,.4)' });
    }
    c.beginPath(); c.arc(C.x, C.y, R, 0, 2 * Math.PI); c.fillStyle = CREAM; c.fill();
    for (let i = 0; i < n; i++) if (sel[i]) {
      c.beginPath(); c.moveTo(C.x, C.y); c.arc(C.x, C.y, R, turn(cuts[i]), turn(nx(i))); c.closePath(); c.fillStyle = o.selFill || JAM; c.fill();
    }
    if (o.hot != null && o.hot >= 0 && !sel[o.hot]) { const i = o.hot; c.beginPath(); c.moveTo(C.x, C.y); c.arc(C.x, C.y, R, turn(cuts[i]), turn(nx(i))); c.closePath(); c.fillStyle = 'rgba(232,163,61,.22)'; c.fill(); }
    d.circle(c, C, R * .86, { w: 1.3, color: 'rgba(23,20,17,.28)', dash: [4, 7] });
    if (o.deco && n > 1) for (let i = 0; i < n; i++) {
      const m = turn((cuts[i] + nx(i)) / 2), p = { x: C.x + Math.cos(m) * R * .72, y: C.y + Math.sin(m) * R * .72 };
      d.dot(c, p, { r: Math.max(3, R * .04), color: sel[i] ? N.SEAL : 'rgba(196,67,43,.45)' });
    }
    if (n > 1) for (let i = 0; i < n; i++) d.seg(c, C, { x: C.x + Math.cos(turn(cuts[i])) * R, y: C.y + Math.sin(turn(cuts[i])) * R }, { w: o.cw || 2.6 });
    d.circle(c, C, R, { w: o.w || 3.6 });
  }
  function pieHit(C, R, n, p) {
    if (g.dist(p, C) > R + 8) return -1;
    let f = (Math.atan2(p.y - C.y, p.x - C.x) + Math.PI / 2) / (2 * Math.PI); f = ((f % 1) + 1) % 1;
    return Math.min(n - 1, Math.floor(f * n));
  }
  const rect = (x0, y0, x1, y1) => [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
  function tray(c, n, sel, hot) {
    const { x0, y0, x1, y1 } = TR, sw = (x1 - x0) / n;
    c.beginPath(); c.ellipse((x0 + x1) / 2 + 6, y1 + 26, (x1 - x0) / 2 + 30, 14, 0, 0, 7); c.fillStyle = 'rgba(23,20,17,.08)'; c.fill();
    d.poly(c, rect(x0 - 16, y0 - 16, x1 + 16, y1 + 16), { fill: RIM, w: 3.4 });
    d.poly(c, rect(x0, y0, x1, y1), { fill: CREAM, w: 2 });
    for (let i = 0; i < n; i++) {
      const a = x0 + i * sw;
      if (sel[i] || i === hot) { c.fillStyle = sel[i] ? JAM : 'rgba(232,163,61,.22)'; c.fillRect(a, y0, sw, y1 - y0); }
      // baklava dilimi deseni
      c.save(); c.beginPath(); c.rect(a, y0, sw, y1 - y0); c.clip();
      c.strokeStyle = sel[i] ? 'rgba(120,70,10,.5)' : 'rgba(23,20,17,.1)'; c.lineWidth = 1.4; c.beginPath();
      for (let k = -400; k < 700; k += 38) { c.moveTo(x0 + k, y0); c.lineTo(x0 + k + (y1 - y0), y1); c.moveTo(x0 + k, y1); c.lineTo(x0 + k + (y1 - y0), y0); }
      c.stroke(); c.restore();
    }
    for (let i = 1; i < n; i++) d.seg(c, { x: x0 + i * sw, y: y0 }, { x: x0 + i * sw, y: y1 }, { w: 2.6 });
    d.poly(c, rect(x0, y0, x1, y1), { w: 3 });
  }
  function trayHit(n, p) {
    if (p.x < TR.x0 || p.x > TR.x1 || p.y < TR.y0 || p.y > TR.y1) return -1;
    return Math.min(n - 1, Math.floor((p.x - TR.x0) / (TR.x1 - TR.x0) * n));
  }

  /* ── sayı doğrusu (0–3) ── */
  function numLine(c, L) {
    const { X0, U, Y, div, m } = L, X = (k) => X0 + k * U / div, end = X(3 * div);
    if (m > 0) d.seg(c, { x: X0, y: Y }, { x: X(m), y: Y }, { w: 10, color: N.AMBER, alpha: .75, sketch: false });
    d.seg(c, { x: X0 - 24, y: Y }, { x: end + 40, y: Y }, { w: 3.4 });
    d.arrow(c, { x: end + 44, y: Y }, { x: 1, y: 0 }, { w: 3.4 });
    for (let k = 0; k <= 3 * div; k++) {
      const big = k % div === 0, x = X(k);
      d.seg(c, { x, y: Y - (big ? 24 : 13) }, { x, y: Y + (big ? 24 : 13) }, { w: big ? 3.4 : 2, sketch: big });
      if (big) d.text(c, String(k / div), x, Y + 52, { size: 40 });
    }
    if (m == null) return;
    const x = X(m), fy = Y - 124;
    d.seg(c, { x, y: Y - 14 }, { x, y: fy }, { w: 3 });
    d.poly(c, [{ x, y: fy }, { x: x + 92, y: fy }, { x: x + 78, y: fy + 23 }, { x: x + 92, y: fy + 46 }, { x, y: fy + 46 }], { fill: L.done ? N.AMBER : N.SHEET, w: 2.6 });
    if (L.flag) eqRow(c, [L.flag], x + 40, fy + 23, typeof L.flag === 'string' ? 16 : 17);
    else d.text(c, '?', x + 40, fy + 24, { size: 34, color: N.SEAL });
    d.circle(c, { x, y: Y }, 13, { fill: N.AMBER, w: 3 });
  }

  /* ── yüzlük kart çizimi ── */
  function hundred(c, x0, y0, cs, filled, o = {}) {
    for (let i = 0; i < 100; i++) if (filled[i]) { c.fillStyle = JAM; c.fillRect(x0 + (i % 10) * cs, y0 + Math.floor(i / 10) * cs, cs, cs); }
    c.strokeStyle = 'rgba(23,20,17,.32)'; c.lineWidth = 1; c.beginPath();
    for (let k = 1; k < 10; k++) { c.moveTo(x0 + k * cs, y0); c.lineTo(x0 + k * cs, y0 + 10 * cs); c.moveTo(x0, y0 + k * cs); c.lineTo(x0 + 10 * cs, y0 + k * cs); }
    c.stroke();
    d.poly(c, rect(x0, y0, x0 + 10 * cs, y0 + 10 * cs), { w: o.w || 3 });
  }

  /* ── vitrin: giriş ve önizleme ── */
  function showcase(c) {
    pie(c, { x: 290, y: 262 }, 165, 4, [true, true, true, false], { plate: true, deco: true });
    hundred(c, 640, 56, 25, Array.from({ length: 100 }, (_, i) => i < 75), { w: 3 });
    eqRow(c, [{ f: [3, 4] }, '=', '0,75', '=', '%75'], 765, 392, 36, N.DEEP);
    numLine(c, { X0: 110, U: 260, Y: 560, div: 4, m: 3, flag: { f: [3, 4] }, done: true });
  }

  /* ── ortak olaylar ── */
  S.onDown = (p) => { st.down && st.down(p); };
  S.onMove = (p) => { if (st.move) st.move(p, S.down); };
  S.onUp = (p) => { st.up && st.up(p); };
  S.draw = (c) => { d.grid(c, W, H, 40); if (st.view) st.view(c); };

  function nextBtn(host) {
    host.innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">${st.si === STEPS.length - 1 ? 'Bitir →' : 'Sonraki sipariş →'}</button>`;
    const b = host.querySelector('button'); b.onclick = next; b.focus();
  }

  /* ══ 1. modelle göster ══ */
  const ITEMS_CAKE = ['pasta', 'pizza', 'turta'], ITEMS_TRAY = ['tepsi baklava', 'tepsi börek', 'tepsi revani'];
  const FR = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [3, 8], [5, 8], [7, 8], [3, 10], [7, 10]];
  const MODELS = (() => {
    const pool = g.shuffle(FR), f1 = pool[0], f2 = pool.find((f) => f[1] !== f1[1]);
    const f3 = g.shuffle(FR.filter((f) => f[1] <= 5)).find((f) => f[1] !== f1[1] && f[1] !== f2[1]) || [3, 4];
    const shape3 = g.pick(['cake', 'tray']);
    return [
      { a: f1[0], b: f1[1], shape: 'cake', item: g.pick(ITEMS_CAKE) },
      { a: f2[0], b: f2[1], shape: 'tray', item: g.pick(ITEMS_TRAY) },
      { a: f3[0], b: f3[1], shape: shape3, item: g.pick(shape3 === 'cake' ? ITEMS_CAKE : ITEMS_TRAY), fixed: f3[1] * g.pick(f3[1] * 3 <= 12 ? [2, 3] : [2]) },
    ];
  })();

  function stepModel(k) {
    const M = MODELS[k], q = { f: [M.a, M.b] }, hitM = (p) => (M.shape === 'cake' ? pieHit(CK, CR, st.n, p) : trayHit(st.n, p));
    const center = M.shape === 'cake' ? CK : { x: (TR.x0 + TR.x1) / 2, y: (TR.y0 + TR.y1) / 2 };
    st.n = M.fixed || 1; st.sel = Array(st.n).fill(false); st.hot = -1;
    let tries = 0, done = false, painting = false, mode = true;
    const cnt = () => st.sel.filter(Boolean).length;
    st.view = (c) => {
      ticket(c, q, M.item, { no: st.si + 1 });
      if (M.shape === 'cake') pie(c, CK, CR, st.n, st.sel, { plate: true, deco: true, hot: done ? -1 : st.hot });
      else tray(c, st.n, st.sel, done ? -1 : st.hot);
      d.text(c, 'seçtiğin', 150, 286, { size: 16, font: N.MONO, weight: 500, color: N.SOFT });
      frac(c, cnt(), st.n, 150, 372, { size: 58, color: done ? N.DEEP : N.INK });
      d.text(c, `${st.n} eş parça`, 150, 470, { size: 17, font: N.MONO, weight: 500, color: N.SOFT });
    };
    st.down = (p) => {
      if (done) return; const i = hitM(p); painting = i >= 0; if (!painting) return;
      mode = !st.sel[i]; st.sel[i] = mode; N.sfx.tick(); syncPanel(); S.ask();
    };
    st.move = (p, held) => {
      if (done || !p) { if (st.hot !== -1) { st.hot = -1; S.ask(); } return; }
      const i = hitM(p); S.cursor(i >= 0 ? 'pointer' : 'default');
      if (i !== st.hot) { st.hot = i; S.ask(); }
      if (!held || !painting || i < 0 || st.sel[i] === mode) return;
      st.sel[i] = mode; N.sfx.tick(); syncPanel(); S.ask();
    };
    st.up = () => { painting = false; };

    const fixedTxt = M.fixed ? `<p class="small">Bu ${M.item} zaten <b>${M.fixed} eş parçaya</b> kesilmiş. Kesimi değiştiremezsin; sadece dilim seç.</p>` : '';
    const el = N.panel(`<div class="card"><span class="label">Modelle göster · ${k + 1} / 3</span>
      <p>Sipariş: <b style="font-family:var(--brush);font-size:26px;font-weight:400">${fr(M.a, M.b)} ${M.item}</b></p>
      ${fixedTxt || `<p class="small">1) Bütünü kaç <b>eş parçaya</b> keseceğini seç. 2) Dilimlere dokun ya da üzerlerinde sürükle.</p>`}
      <div class="row"><button class="btn" id="mn" type="button" aria-label="Bir parça az">−</button><span class="big-read" id="nv" style="min-width:52px;text-align:center">${st.n}</span><button class="btn" id="pl" type="button" aria-label="Bir parça çok">+</button><span class="small">eş parça</span></div>
      <div class="row" style="margin-top:10px"><button class="btn primary big" id="chk" type="button">Kontrol et</button><button class="btn" id="clr" type="button">Seçimi sil</button></div><div id="cn"></div></div>`);
    const $ = (s) => el.querySelector(s);
    function syncPanel() {
      $('#nv').textContent = st.n;
      $('#mn').disabled = done || !!M.fixed || st.n <= 1; $('#pl').disabled = done || !!M.fixed || st.n >= 12;
    }
    const setN = (n) => { st.n = Math.max(1, Math.min(12, n)); st.sel = Array(st.n).fill(false); st.hot = -1; N.sfx.snap(); syncPanel(); S.ask(); };
    $('#mn').onclick = () => setN(st.n - 1);
    $('#pl').onclick = () => setN(st.n + 1);
    $('#clr').onclick = () => { st.sel = Array(st.n).fill(false); S.ask(); };
    syncPanel();

    $('#chk').onclick = () => {
      const kk = cnt(), n = st.n;
      if (!kk) { N.say(n === 1 ? 'Önce <b>+</b> ile bütünü eş parçalara kes, sonra dilimlere dokunarak seç.' : 'Şimdi dilimlere dokunarak seç. Sürükleyerek birden çok dilimi boyayabilirsin.'); return; }
      if (kk * M.b === M.a * n) {
        done = true; st.hot = -1; N.sfx.good(); N.splash(center); N.addScore(tries ? 15 : 30, center);
        const m = n / M.b;
        N.say(n === M.b
          ? `Tam sipariş! Bütünü <b>${M.b} eş parçaya</b> böldün, <b>${M.a}</b> tanesini seçtin: <b>${fr(M.a, M.b)}</b>. <em>Payda</em> bütünün kaç eş parçaya bölündüğünü, <em>pay</em> kaç parça alındığını söyler.`
          : `<b>${fr(kk, n)}</b> ile <b>${fr(M.a, M.b)}</b> aynı miktar: <em>denk kesir</em>! Pay ve paydayı ${m} ile çarptık: ${M.a} × ${m} = ${kk}, ${M.b} × ${m} = ${n}.`, 'good');
        ['#chk', '#clr'].forEach((s) => { $(s).disabled = true; }); syncPanel(); S.ask();
        if (k === 0) { const b = document.createElement('button'); b.className = 'btn primary big'; b.type = 'button'; b.style.marginTop = '10px'; b.textContent = 'Çırağın kesimine bak →'; b.onclick = () => askUnequal(); $('#cn').appendChild(b); b.focus(); }
        else nextBtn($('#cn'));
        return;
      }
      tries++; N.sfx.bad();
      if ((M.a * n) % M.b) {
        N.say(`Bütünü <b>${n}</b> eş parçaya böldün. Bu parçalarla <b>${fr(M.a, M.b)}</b> tam olarak gösterilemez. Parça sayısı ${M.b}, ${M.b * 2}, ${M.b * 3}… gibi olmalı.`, 'bad');
      } else {
        const need = (M.a * n) / M.b;
        N.say(`Seçtiğin <b>${fr(kk, n)}</b>, sipariş <b>${fr(M.a, M.b)}</b>. Seçtiğin miktar ${kk * M.b > M.a * n ? 'fazla' : 'az'}. ${tries > 1 ? `İpucu: ${n} eş parçanın <b>${need}</b> tanesi gerekir.` : n === M.b ? `Pay kaç parça alındığını söyler.` : `${n} parça, ${M.b} parçanın ${n / M.b} katı; seçeceğin dilim de ${n / M.b} katı olmalı.`}`, 'bad');
      }
    };
    N.say(M.fixed
      ? `Bu ${M.item} zaten <b>${M.fixed} eş dilime</b> kesilmiş. Müşteri <b>${fr(M.a, M.b)} ${M.item}</b> istiyor. Kaç dilim vermeliyiz?`
      : k === 0 ? `İlk sipariş geldi: <b>${fr(M.a, M.b)} ${M.item}</b>! Önce bütünü <em>eş parçalara</em> kes, sonra siparişi seç.` : `Sıradaki: <b>${fr(M.a, M.b)} ${M.item}</b>. Bu kez dikdörtgen bir tepsi; şeritlere bölünür.`);
    S.ask();
  }

  /** gerekçelendir: eş olmayan parçalar */
  function askUnequal() {
    st.down = st.move = st.up = null; S.cursor('default');
    st.view = (c) => {
      ticket(c, { f: [1, 4] }, 'pasta', { label: 'ÇIRAĞIN NOTU' });
      pie(c, CK, CR, 4, [true, false, false, false], { cuts: [0, .42, .64, .83], plate: true, deco: true });
      d.text(c, '“1/4 aldım!”', CK.x + 210, CK.y - 190, { size: 36, color: N.SEAL });
    };
    S.ask();
    N.say('Çırağım bir pastayı <b>4 parçaya</b> kesti, işaretli dilimi aldı ve “pastanın 1/4’ünü aldım” dedi. Haklı mı?');
    const el = N.panel('<div class="card"><span class="label">Gerekçelendir</span><p class="small">Dilimlere dikkatle bak.</p><div id="cb"></div><div id="cn"></div></div>');
    N.choices(el.querySelector('#cb'), [{ t: 'Hayır, parçalar eş değil.', ok: true }, { t: 'Evet, 4 parçadan 1 tanesini aldı.', ok: false }], (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say('Dilimlerin büyüklüğüne bak: biri öbürlerinden çok büyük! 1/4 için bütün <b>4 eş parçaya</b> bölünmeli.', 'bad'); return; }
      N.sfx.good(); if (first) N.addScore(10, CK);
      N.say('Aynen! <b>Parçalar eş değil</b>; işaretli dilim neredeyse pastanın yarısı. Kesir göstermek için bütün <em>eş parçalara</em> bölünmeli.', 'good');
      nextBtn(el.querySelector('#cn'));
    }, 'one');
  }

  /* ══ 2. tam sayılı kesir: ölçü kapları ══ */
  const MIX = g.pick([[1, 1, 2], [1, 1, 4], [1, 3, 4], [2, 1, 4], [2, 1, 2], [2, 3, 4], [1, 2, 5], [1, 3, 5], [2, 1, 5], [2, 2, 5]]);
  function stepMix() {
    const [w, a, b] = MIX, T = w * b + a, item = g.pick(['bardak un', 'bardak süt', 'bardak şeker']), q = { f: [a, b], w }, V = w + a / b;
    const nc = w + 2, lv = Array(nc).fill(0), CUP = { top: 272, bot: 548, tw: 138, bw: 112 }, ph = (CUP.bot - CUP.top) / b;
    const cx = (i) => 565 + (i - (nc - 1) / 2) * 185, hw = (y) => CUP.bw / 2 + (CUP.tw - CUP.bw) / 2 * (CUP.bot - y) / (CUP.bot - CUP.top);
    let phase = 'fill', cntT = 0, eq = 0, tries = 0, dcur = -1;
    const mixed = `${w} ${fr(a, b)}`;
    const den = 10 % b === 0 ? 10 : 100, decHint = `${fr(a, b)} = ${fr(a * den / b, den)} = ${fmt(a / b)}`;
    const cupAt = (p) => { for (let i = 0; i < nc; i++) if (Math.abs(p.x - cx(i)) < CUP.tw / 2 + 10 && p.y > CUP.top - 30 && p.y < CUP.bot + 16) return i; return -1; };
    const levelAt = (p) => Math.max(0, Math.min(b, Math.ceil((CUP.bot - p.y) / ph)));

    st.view = (c) => {
      ticket(c, q, item, { label: 'TARİF', no: st.si + 1 });
      if (eq) eqRow(c, eq >= 2 ? [q, '=', { f: [T, b] }, '=', fmt(V)] : [q, '=', { f: [T, b] }], 640, 132, 38, N.DEEP);
      let base = 0;
      for (let i = 0; i < nc; i++) {
        const x = cx(i), L = lv[i], yl = CUP.bot - L * ph;
        c.beginPath(); c.ellipse(x + 4, CUP.bot + 6, CUP.bw / 2 + 12, 8, 0, 0, 7); c.fillStyle = 'rgba(23,20,17,.08)'; c.fill();
        if (L) d.poly(c, [{ x: x - hw(CUP.bot), y: CUP.bot }, { x: x + hw(CUP.bot), y: CUP.bot }, { x: x + hw(yl), y: yl }, { x: x - hw(yl), y: yl }], { fill: JAM, noStroke: true });
        for (let j = 1; j < b; j++) {
          const yj = CUP.bot - j * ph;
          d.seg(c, { x: x - hw(yj) + 5, y: yj }, { x: x + hw(yj) - 5, y: yj }, { w: 1.6, color: 'rgba(23,20,17,.5)', dash: [6, 5] });
          d.text(c, fr(j, b), x - hw(yj) + 9, yj - 10, { size: 12, font: N.MONO, weight: 500, align: 'left', color: N.SOFT, haloW: 4 });
        }
        c.beginPath(); c.ellipse(x + CUP.tw / 2 - 6, CUP.top + 104, 26, 50, 0, -Math.PI / 2, Math.PI / 2); c.strokeStyle = N.INK; c.lineWidth = 3.6; c.stroke();
        d.poly(c, [{ x: x - hw(CUP.top) - 5, y: CUP.top - 4 }, { x: x - hw(CUP.top), y: CUP.top }, { x: x - hw(CUP.bot), y: CUP.bot }, { x: x + hw(CUP.bot), y: CUP.bot }, { x: x + hw(CUP.top), y: CUP.top }, { x: x + hw(CUP.top) + 5, y: CUP.top - 4 }], { open: true, w: 3.6 });
        if (cntT) for (let j = 0; j < L; j++) { const nn = base + j + 1; if (nn <= cntT) d.text(c, String(nn), x + 6, CUP.bot - (j + .5) * ph, { size: Math.min(30, ph * .75), color: N.INK }); }
        d.text(c, L === 0 ? 'boş' : L === b ? '1 tam' : fr(L, b), x, CUP.bot + 40, { size: 30, color: L ? N.INK : N.SOFT });
        base += L;
      }
    };
    st.down = (p) => {
      if (phase !== 'fill') return; const i = cupAt(p); dcur = i; if (i < 0) return;
      let L = levelAt(p); if (L === lv[i]) L--; lv[i] = Math.max(0, L); N.sfx.tick(); S.ask();
    };
    st.move = (p, held) => {
      if (phase !== 'fill' || !p) return; const i = cupAt(p); S.cursor(i >= 0 ? 'pointer' : 'default');
      if (!held || i < 0 || i !== dcur) return;
      const L = levelAt(p); if (L !== lv[i]) { lv[i] = L; N.sfx.tick(); S.ask(); }
    };
    st.up = () => { dcur = -1; };

    N.say(`Tarifte <b>${mixed} ${item}</b> var. Ölçü kaplarının her biri <b>${b} eş parçaya</b> bölünmüş. Kapları doldur!`);
    let el = N.panel(`<div class="card"><span class="label">Tam sayılı kesir · ölç</span>
      <p>Tarif: <b style="font-family:var(--brush);font-size:26px;font-weight:400">${mixed} ${item}</b></p>
      <p class="small">Kabın içine dokun: o çizgiye kadar dolar. Aynı yere yine dokunursan bir parça azalır. Yukarı sürükleyerek de doldurabilirsin.</p>
      <div class="row"><button class="btn primary big" id="chk" type="button">Kontrol et</button><button class="btn" id="clr" type="button">Boşalt</button></div></div>`);
    el.querySelector('#clr').onclick = () => { lv.fill(0); S.ask(); };
    el.querySelector('#chk').onclick = async () => {
      const tot = sum(lv);
      if (!tot) { N.say('Önce kaplara dokunarak doldur.'); return; }
      if (tot !== T) {
        tries++; N.sfx.bad();
        N.say(`Kaplarda toplam <b>${tot}</b> tane 1/${b} bardak var. Tarif: ${w} tam bardak ve ${fr(a, b)} bardak. ${tot > T ? 'Biraz fazla oldu.' : 'Biraz eksik.'} Bir tam bardak ${b} tane 1/${b} bardak eder.`, 'bad');
        return;
      }
      phase = 'count'; S.cursor('default'); N.sfx.good(); N.addScore(tries ? 10 : 20, { x: cx(0), y: 400 });
      const std = lv.filter((l) => l === b).length === w && lv.filter((l) => l > 0).length === w + 1;
      N.say(std ? `Tam ölçü! <b>${w} tam</b> bardak ve <b>${fr(a, b)}</b> bardak: <em>tam sayılı kesir</em> ${mixed}. Şimdi hepsini 1/${b}’lik parçalarla sayalım…`
        : `Toplam miktar doğru! Parçaları farklı kaplara dağıttın ama hepsi bir arada ${mixed} bardak eder. Şimdi 1/${b}’lik parçaları sayalım…`, 'good');
      el.querySelector('#chk').disabled = true; el.querySelector('#clr').disabled = true;
      await N.tween(Math.min(2400, T * 220), (t) => { const v = Math.ceil(t * T); if (v !== cntT) { cntT = v; N.sfx.tick(); S.ask(); } }, (t) => t);
      cntT = T; S.ask(); pickPhase();
    };

    function pickPhase() {
      const pool = [[w + a, b], [w * a + b, b], [Number(`${w}${a}`), b], [T + 1, b], [T - 1, b], [a, w * b]];
      const seen = new Set([fr(T, b)]), opts = [{ t: fr(T, b), ok: true }];
      pool.forEach(([x, y]) => { const t = fr(x, y); if (opts.length < 4 && x > 0 && !seen.has(t) && x * b !== T * y) { seen.add(t); opts.push({ t, ok: false, cat: x === Number(`${w}${a}`) && y === b }); } });
      N.say(`Kaplarda kaç tane <b>1/${b}</b> bardak var? Bu miktarı <em>bileşik kesir</em> olarak hangisi gösterir?`);
      el = N.panel(`<div class="card"><span class="label">Bileşik kesir</span><p><b style="font-family:var(--brush);font-size:26px;font-weight:400">${mixed}</b> = ?</p><div id="cb"></div></div><div id="dc"></div>`);
      let ptries = 0;
      N.choices(el.querySelector('#cb'), g.shuffle(opts), (o, btn, first) => {
        if (!o.ok) {
          ptries++; N.sfx.bad();
          N.say(o.cat ? `${o.t} çok büyük! Tam sayıyı paya yan yana yazamayız. ${w} tam bardak = ${w * b} tane 1/${b} bardak.` : `Kapları say: ${w} tam bardak = <b>${w * b}</b> tane 1/${b} bardak. Onlara ${a} tane daha ekle.`, 'bad');
          return;
        }
        eq = 1; S.ask(); N.sfx.good(); if (first) N.addScore(15, { x: 640, y: 132 });
        N.say(`${w} tam bardak = ${w * b} tane 1/${b}; artı ${a} tane daha: ${w * b} + ${a} = ${T}. Yani ${mixed} = <b>${fr(T, b)}</b>. Payı paydasından büyük bu kesre <em>bileşik kesir</em> denir.`, 'good');
        decPhase();
      });
    }

    function decPhase() {
      const host = el.querySelector('#dc');
      host.innerHTML = `<div class="card"><span class="label">Ondalık gösterim</span><p class="small">Aynı miktarı ondalık gösterimle yaz (virgül kullan).</p>
        <div class="row"><span style="font-family:var(--brush);font-size:28px">${mixed} =</span><input class="num-in" id="dv" inputmode="decimal" autocomplete="off" aria-label="Ondalık gösterim"></div>
        <button class="btn primary big" id="dchk" type="button" style="margin-top:10px">Kontrol et</button><div id="cn"></div></div>`;
      const inp = host.querySelector('#dv'); let dt = 0; inp.focus();
      const run = () => {
        const v = N.num(inp.value); if (v == null) return;
        inp.classList.remove('ok', 'no'); void inp.offsetWidth;
        if (Math.abs(v - V) < 1e-9) {
          inp.classList.add('ok'); inp.disabled = true; eq = 2; S.ask(); N.sfx.good(); N.splash({ x: 640, y: 132 }); N.addScore(dt ? 8 : 15, { x: 820, y: 132 });
          N.say(`${mixed} = ${fr(T, b)} = <b>${fmt(V)}</b>. Çünkü ${decHint}: virgülün solunda tam kısım, sağında kesir kısmı. Aynı miktar, üç kılık!`, 'good');
          host.querySelector('#dchk').remove(); nextBtn(host.querySelector('#cn'));
          return;
        }
        dt++; inp.classList.add('no'); N.sfx.bad();
        const concat = [w + a / 10, w + (a * 10 + b) / 100, w + a / 100, w + (a * 10 + b) / 1000, Number(`${w}.${a}${b}`)].some((x) => Math.abs(v - x) < 1e-9);
        if (concat) N.say(`Pay ile paydayı virgülden sonra yan yana yazamayız. ${decHint}.`, 'bad');
        else if (Math.floor(v + 1e-9) !== w) N.say(`Tam kısım <b>${w}</b> olmalı: virgülün soluna ${w} yaz, sağına ${fr(a, b)} kesrinin ondalık gösterimini.`, 'bad');
        else N.say(dt > 1 ? `İpucu: ${decHint}.` : `${fr(a, b)} kesrini paydası ${den} olan denk kesre çevir: ${fr(a, b)} = ?/${den}.`, 'bad');
      };
      host.querySelector('#dchk').onclick = run; inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); });
    }
    S.ask();
  }

  /* ══ 3. sayı doğrusu ══ */
  const LINES = [
    (() => { const b = g.pick([2, 3, 4, 5, 6]); let n; do { n = g.rnd(b + 1, 3 * b - 1); } while (gcd(n, b) !== 1); return { q: { f: [n, b] }, v: n / b, div: b, item: g.pick(['litre süt', 'litre ayran', 'kg tereyağı']) }; })(),
    (() => { const [v, div] = g.pick([[.75, 4], [1.25, 4], [1.75, 4], [2.25, 4], [2.75, 4], [.3, 10], [.7, 10], [1.4, 10], [1.9, 10], [2.6, 10], [1.5, 2], [2.5, 2]]); return { q: fmt(v), v, div, item: g.pick(['kg peynir', 'kg un', 'kg şeker']) }; })(),
  ];
  function stepLine(k) {
    const Lq = LINES[k], div = Lq.div, v = Lq.v, tm = Math.round(v * div), whole = Math.floor(v), isDec = typeof Lq.q === 'string';
    const L = { X0: 120, U: 250, Y: 440, div, m: 0, flag: null, done: false }, X = (m) => L.X0 + m * L.U / div;
    let phase = 'guess', tries = 0, grab = false;
    const qs = qHtml(Lq.q);
    const exactDec = [2, 4, 5, 10].includes(div);
    const chain = isDec
      ? (() => { const gc = gcd(tm, div); return [Lq.q, '=', { f: [tm, div] }, ...(gc > 1 ? ['=', { f: [tm / gc, div / gc] }] : [])]; })()
      : [Lq.q, '=', { f: [tm % div, div], w: whole }, ...(exactDec ? ['=', fmt(v)] : [])];
    st.view = (c) => {
      ticket(c, Lq.q, Lq.item, { no: st.si + 1 });
      numLine(c, L);
      if (L.done) eqRow(c, chain, 640, 140, 38, N.DEEP);
      else if (phase === 'place') d.text(c, 'işaretçiyi sürükle →', X(L.m) + 50, L.Y + 104, { size: 16, font: N.MONO, weight: 500, color: N.SOFT, align: 'left' });
    };
    const setFrom = (p) => { const m = Math.max(0, Math.min(3 * div, Math.round((p.x - L.X0) / (L.U / div)))); if (m !== L.m) { L.m = m; N.sfx.snap(); S.ask(); } };
    st.down = (p) => { if (phase !== 'place') return; grab = Math.abs(p.y - L.Y) < 150 && p.x > L.X0 - 50 && p.x < X(3 * div) + 50; if (grab) setFrom(p); };
    st.move = (p, held) => { if (phase !== 'place' || !p) return; const near = Math.abs(p.y - L.Y) < 150; S.cursor(near ? 'grab' : 'default'); if (held && grab) setFrom(p); };
    st.up = () => { grab = false; };

    N.say(k === 0
      ? `Süt kasası geldi: <b>${qs} ${Lq.item}</b>. Önce <em>tahmin et</em>: bu miktar sayı doğrusunda hangi iki tam sayı arasında?`
      : `Peynir terazisi <b>${qs} ${Lq.item}</b> gösteriyor. Bu bir <em>ondalık gösterim</em>. Önce tahmin et: hangi iki tam sayı arasında?`);
    const el = N.panel(`<div class="card"><span class="label">Sayı doğrusu · ${k + 1} / 2</span><p>Miktar: <b style="font-family:var(--brush);font-size:26px;font-weight:400">${qs} ${Lq.item}</b></p><div id="cb"></div><div id="pl"></div></div>`);
    N.choices(el.querySelector('#cb'), [0, 1, 2].map((i) => ({ t: `${i} ile ${i + 1} arasında`, ok: i === whole })), (o, btn, first) => {
      if (!o.ok) {
        N.sfx.bad();
        N.say(isDec ? `${qs}: virgülün solundaki sayı <b>tam kısmı</b> gösterir.` : `${b1(Lq)} Kaç bütün eder, ne kadar artar?`, 'bad');
        return;
      }
      N.sfx.good(); if (first) N.addScore(10, { x: X(whole) + L.U / 2, y: L.Y });
      N.say(`Evet! ${qs}, ${whole} ile ${whole + 1} arasında. Şimdi işaretçiyi <b>tam yerine</b> sürükle. Her bütün <b>${div} eş parçaya</b> bölünmüş.`, 'good');
      phase = 'place'; S.ask(); placePanel();
    }, 'one');
    function b1(Q) { const [n, b] = Q.q.f; return `${b} tane 1/${b} bir bütün eder. ${n} tane 1/${b} var.`; }
    function placePanel() {
      const host = el.querySelector('#pl');
      host.innerHTML = `<p class="small" style="margin-top:10px">Turuncu düğmeyi sürükle; çentiklere oturur. Klavyede: ok tuşlarıyla gel, boşlukla tut.</p><button class="btn primary big" id="chk" type="button">Kontrol et</button><div id="cn"></div>`;
      host.querySelector('#chk').onclick = () => {
        if (L.m === 0) { N.say('İşaretçi hâlâ 0’da. Turuncu düğmeyi sağa sürükle.'); return; }
        if (L.m === tm) {
          phase = 'done'; L.done = true; L.flag = Lq.q; S.cursor('default'); N.sfx.good(); N.splash({ x: X(tm), y: L.Y }); N.addScore(tries ? 10 : 20, { x: X(tm), y: L.Y - 170 });
          N.say(isDec
            ? `Tam yerinde! ${qs} = <b>${fr(tm, div)}</b>${gcd(tm, div) > 1 ? ` = ${fr(tm / gcd(tm, div), div / gcd(tm, div))}` : ''}. Ondalık gösterim de sayı doğrusunda bir noktadır.`
            : `Doğru yer! ${qs}: ${whole} bütün ve ${fr(tm % div, div)} daha. ${qs} = <b>${whole} ${fr(tm % div, div)}</b>${exactDec ? ` = ${fmt(v)}` : ''}. Payı paydasından büyük kesir 1’den büyüktür.`, 'good');
          host.querySelector('#chk').remove(); nextBtn(host.querySelector('#cn')); S.ask();
          return;
        }
        tries++; N.sfx.bad();
        N.say(`İşaretin şu an <b>${fr(L.m, div)}</b> noktasında. ${L.m < tm ? 'Biraz daha sağa.' : 'Biraz sola.'} ${tries > 1 ? `İpucu: ${qs} = ${fr(tm, div)}; 0’dan başlayıp ${tm} parça say.` : `Her bütün ${div} eş parça; 0’dan başlayıp parçaları say.`}`, 'bad');
      };
    }
    S.ask();
  }

  /* ══ 4. yüzlük kart ══ */
  const HUND = [
    g.pick(['pct', 'dec']) === 'pct'
      ? (() => { const t = g.pick([15, 20, 25, 30, 35, 40, 45, 60, 65, 75, 80]); return { kind: 'pct', t, q: `%${t}`, item: 'indirim', label: 'KAMPANYA' }; })()
      : (() => { const t = g.pick([25, 75, 40, 60, 35, 85, 30, 45]); return { kind: 'dec', t, q: fmt(t / 100), item: 'kg peynir' }; })(),
    (() => { const [a, b] = g.pick([[1, 4], [3, 4], [2, 5], [3, 5], [1, 2], [7, 20], [9, 20], [3, 25], [8, 25], [1, 5], [4, 5], [7, 10]]); return { kind: 'frac', a, b, t: a * 100 / b, q: { f: [a, b] }, item: g.pick(['kg tereyağı', 'kg ceviz', 'kg kakao']) }; })(),
  ];
  function stepHundred(k) {
    const Q = HUND[k], GX = 330, GY = 128, CS = 42, cells = Array(100).fill(false), RX = 875;
    let tries = 0, done = false, painting = false, mode = true;
    const qs = qHtml(Q.q), cnt = () => cells.filter(Boolean).length;
    const cellAt = (p) => { const i = Math.floor((p.x - GX) / CS), j = Math.floor((p.y - GY) / CS); return i >= 0 && i < 10 && j >= 0 && j < 10 ? j * 10 + i : -1; };
    const tabAt = (p) => (p.x >= GX - 38 && p.x < GX - 4 && p.y >= GY && p.y < GY + 10 * CS ? Math.floor((p.y - GY) / CS) : -1);
    st.view = (c) => {
      ticket(c, Q.q, Q.item, { label: Q.label || 'SİPARİŞ', no: st.si + 1 });
      d.text(c, 'yüzlük kart', GX + 5 * CS, GY - 24, { size: 15, font: N.MONO, weight: 500, color: N.SOFT });
      for (let r = 0; r < 10; r++) {
        const full = cells.slice(r * 10, r * 10 + 10).every(Boolean), y = GY + r * CS + 4;
        c.beginPath(); c.roundRect ? c.roundRect(GX - 36, y, 30, CS - 8, 6) : c.rect(GX - 36, y, 30, CS - 8);
        c.fillStyle = full ? N.AMBER : 'rgba(255,250,240,.9)'; c.fill(); c.lineWidth = 1.5; c.strokeStyle = 'rgba(23,20,17,.45)'; c.stroke();
        d.text(c, '10', GX - 21, y + (CS - 8) / 2 + 1, { size: 12, font: N.MONO, weight: 500, color: N.SOFT, halo: false });
      }
      hundred(c, GX, GY, CS, cells, { w: 3.4 });
      const n = cnt(), col = done ? N.DEEP : N.INK;
      d.text(c, 'kartta', RX, 150, { size: 16, font: N.MONO, weight: 500, color: N.SOFT });
      frac(c, n, 100, RX, 232, { size: 44, color: col });
      d.text(c, '=', RX, 318, { size: 40, color: N.SOFT });
      d.text(c, fmt(n / 100), RX, 378, { size: 58, color: col });
      d.text(c, '=', RX, 438, { size: 40, color: N.SOFT });
      d.text(c, `%${n}`, RX, 498, { size: 58, color: col });
      d.text(c, 'sürükleyerek boya · soldaki “10” bütün sırayı boyar', GX + 5 * CS - 20, GY + 10 * CS + 34, { size: 14, font: N.MONO, weight: 500, color: N.SOFT });
    };
    st.down = (p) => {
      if (done) return; painting = false;
      const r = tabAt(p);
      if (r >= 0) { const row = cells.slice(r * 10, r * 10 + 10), f = !row.every(Boolean); for (let i = 0; i < 10; i++) cells[r * 10 + i] = f; N.sfx.snap(); S.ask(); return; }
      const i = cellAt(p); if (i < 0) return; painting = true; mode = !cells[i]; cells[i] = mode; N.sfx.tick(); S.ask();
    };
    st.move = (p, held) => {
      if (done || !p) return; const i = cellAt(p); S.cursor(i >= 0 || tabAt(p) >= 0 ? 'pointer' : 'default');
      if (!held || !painting || i < 0 || cells[i] === mode) return; cells[i] = mode; N.sfx.tick(); S.ask();
    };
    st.up = () => { painting = false; };

    const intro = { pct: `Kampanya! Bugün her şeyde <b>%${Q.t} indirim</b>. Yüzde, 100 eş parçadan kaç tanesi demek. Yüzlük kartta göster!`,
      dec: `Terazide <b>${qs} kg peynir</b>. Bu <em>ondalık gösterimi</em> yüzlük kartta göster.`,
      frac: `Tarifte <b>${qs} ${Q.item}</b> var. Bu kesri <b>100 eş kareli</b> kartta göster. 100 kareyi ${Q.b} eş gruba ayırmayı düşün.` }[Q.kind];
    N.say(intro);
    const el = N.panel(`<div class="card"><span class="label">Yüzlük kart · ${k + 1} / 2</span><p>Göster: <b style="font-family:var(--brush);font-size:26px;font-weight:400">${qs} ${Q.item}</b></p>
      <p class="small">Karelere dokun ya da üzerlerinde sürükle. Sağda kesir, ondalık gösterim ve yüzde birlikte değişir.</p>
      <div class="row"><button class="btn primary big" id="chk" type="button">Kontrol et</button><button class="btn" id="clr" type="button">Temizle</button></div><div id="cn"></div></div>`);
    el.querySelector('#clr').onclick = () => { if (!done) { cells.fill(false); S.ask(); } };
    el.querySelector('#chk').onclick = () => {
      const n = cnt(), t = Q.t;
      if (!n) { N.say('Önce karelere dokunarak boya.'); return; }
      if (n === t) {
        done = true; S.cursor('default'); N.sfx.good(); N.splash({ x: GX + 5 * CS, y: GY + 5 * CS }); N.addScore(tries ? 12 : 25, { x: GX + 5 * CS, y: GY + 5 * CS });
        N.say({ pct: `%${t} = ${fr(t, 100)} = ${fmt(t / 100)}: 100 kareden <b>${t}</b> tanesi. İndirim çoğu zaman <em>yüzde</em> ile söylenir.`,
          dec: `${fmt(t / 100)} = <b>${fr(t, 100)}</b> = %${t}. Ondalık gösterimdeki yüzde birler, kartın karelerini sayar.`,
          frac: `${fr(Q.a, Q.b)} = <b>${fr(t, 100)}</b> = ${fmt(t / 100)} = %${t}. Pay ve paydayı ${100 / Q.b} ile çarptık: <em>denk kesir</em>!` }[Q.kind], 'good');
        el.querySelector('#chk').disabled = true; el.querySelector('#clr').disabled = true; nextBtn(el.querySelector('#cn')); S.ask();
        return;
      }
      tries++; N.sfx.bad();
      const hint = { pct: `%${t}, 100 karenin <b>${t}</b> tanesi demek.`,
        dec: tries > 1 ? `${fmt(t / 100)} = ${fr(t, 100)}.` : `${fmt(t / 100)} kaç yüzde bir eder?`,
        frac: tries > 1 ? `${fr(Q.a, Q.b)} = ${fr(t, 100)}.` : `100 kareyi ${Q.b} eş gruba ayırırsan her grup ${100 / Q.b} kare olur. ${Q.a} grup boya.` }[Q.kind];
      N.say(`Kartta <b>${n}</b> kare boyalı: ${fr(n, 100)} = %${n}. ${n > t ? 'Fazla.' : 'Eksik.'} ${hint}`, 'bad');
    };
    S.ask();
  }

  /* ══ 5. dört kılık ══ */
  const FOUR = (() => {
    const [a, b] = g.pick([[1, 2], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [1, 5]]), m = g.pick(b * 3 <= 15 ? [2, 3] : [2]), p = a * 100 / b;
    const good = [
      { kind: 'frac', f: [a * m, b * m], ok: true }, { kind: 'text', s: fmt(a / b), ok: true }, { kind: 'text', s: `%${p}`, ok: true },
      { kind: 'pie', n: b, k: a, ok: true }, { kind: 'grid', k: p, ok: true },
    ];
    const wcuts = (() => { const ws = [1.9, .7, 1.2, .55, 1.4].slice(0, b), t = sum(ws); let acc = 0; return ws.map((x) => { const r = acc / t; acc += x; return r; }); })();
    const bad = g.shuffle([
      { kind: 'text', s: `0,${a}${b}`, why: `0,${a}${b} pay ile paydanın yan yana yazılmışı; ${fr(a, b)} = ${fmt(a / b)}.` },
      { kind: 'frac', f: [b, a], why: `${fr(b, a)} kesrinde pay ile payda yer değiştirmiş; bu bir bütünden ${b === a ? 'farklı' : 'büyük'}.` },
      { kind: 'text', s: `%${a}${b}`, why: `%${a}${b}, 100 parçadan ${a}${b} tanesi; ${fr(a, b)} ise %${p}.` },
      { kind: 'grid', k: a * 10, why: `Bu kartta ${a * 10} kare boyalı: %${a * 10}. ${fr(a, b)} için ${p} kare gerekir.` },
    ]).slice(0, 3);
    bad.push({ kind: 'pie', n: b, k: a, cuts: wcuts, why: 'Pastanın <b>parçaları eş değil</b>! Eş olmayan parçalarla kesir gösterilmez.' });
    return { a, b, m, p, cards: g.shuffle([...good, ...bad]) };
  })();
  function stepFour() {
    const { a, b, m, p, cards } = FOUR, CW = 212, CH = 180, X0 = 306, Y0 = 34, GAP = 12;
    const pos = (i) => ({ x: X0 + (i % 3) * (CW + GAP), y: Y0 + Math.floor(i / 3) * (CH + GAP) });
    const sel = new Set(); let flag = -1, done = false, tries = 0, hot = -1;
    const item = g.pick(['kg peynir', 'kg tereyağı', 'tepsi baklava']);
    const at = (pt) => cards.findIndex((_, i) => { const P = pos(i); return pt.x >= P.x && pt.x <= P.x + CW && pt.y >= P.y && pt.y <= P.y + CH; });
    st.view = (c) => {
      ticket(c, { f: [a, b] }, item, { no: st.si + 1 });
      ['Aynı miktarı', 'gösteren', 'bütün kartları', 'seç!'].forEach((s, i) => d.text(c, s, 150, 290 + i * 40, { size: 32, color: i === 2 ? N.DEEP : N.INK }));
      cards.forEach((C, i) => {
        const P = pos(i), on = sel.has(i), mx = P.x + CW / 2, my = P.y + CH / 2, dim = done && !C.ok;
        c.globalAlpha = dim ? .35 : 1;
        c.fillStyle = on ? 'rgba(232,163,61,.18)' : i === hot && !done ? 'rgba(255,250,240,1)' : 'rgba(255,250,240,.85)'; c.fillRect(P.x, P.y, CW, CH);
        if (C.kind === 'frac') frac(c, C.f[0], C.f[1], mx, my - 6, { size: 52 });
        else if (C.kind === 'text') d.text(c, C.s, mx, my, { size: 66 });
        else if (C.kind === 'pie') pie(c, { x: mx, y: my }, 66, C.n, Array.from({ length: C.n }, (_, j) => j < C.k), { cuts: C.cuts, w: 3, cw: 2.2 });
        else { const cs = 14; hundred(c, mx - 5 * cs, my - 5 * cs, cs, Array.from({ length: 100 }, (_, j) => j < C.k), { w: 2.4 }); }
        d.poly(c, rect(P.x, P.y, P.x + CW, P.y + CH), { w: on ? 5 : 2, color: i === flag ? N.SEAL : on ? N.DEEP : N.INK });
        if (on) {
          const q = { x: P.x + CW - 20, y: P.y + 20 }; d.circle(c, q, 14, { fill: N.AMBER, w: 2.4, color: N.DEEP });
          c.strokeStyle = N.INK; c.lineWidth = 3; c.beginPath(); c.moveTo(q.x - 6, q.y); c.lineTo(q.x - 1, q.y + 5); c.lineTo(q.x + 7, q.y - 6); c.stroke();
        }
        c.globalAlpha = 1;
      });
    };
    st.down = (pt) => { if (done) return; const i = at(pt); if (i < 0) return; if (sel.has(i)) sel.delete(i); else sel.add(i); if (i === flag) flag = -1; N.sfx.tick(); upd(); S.ask(); };
    st.move = (pt) => { if (done || !pt) return; const i = at(pt); S.cursor(i >= 0 ? 'pointer' : 'default'); if (i !== hot) { hot = i; S.ask(); } };
    st.up = null;

    N.say(`Son sipariş: <b>${fr(a, b)} ${item}</b>. Ama müşteriler aynı miktarı farklı biçimlerde yazıyor! <em>Aynı miktarı</em> gösteren bütün kartları seç: kesir, ondalık gösterim, yüzde, model…`);
    const el = N.panel(`<div class="card"><span class="label">Dört kılık</span><p><b style="font-family:var(--brush);font-size:26px;font-weight:400">${fr(a, b)}</b> ile aynı miktarı gösteren bütün kartlara dokun.</p>
      <p class="small">Seçili kart: <b id="ns">0</b> · Dikkat: bazı kartlar tuzak!</p>
      <button class="btn primary big" id="chk" type="button">Kontrol et</button><div id="cn"></div></div>`);
    function upd() { el.querySelector('#ns').textContent = sel.size; }
    el.querySelector('#chk').onclick = () => {
      if (!sel.size) { N.say('Önce kartlara dokunarak seç.'); return; }
      const extra = [...sel].filter((i) => !cards[i].ok), miss = cards.map((C, i) => (C.ok && !sel.has(i) ? i : -1)).filter((i) => i >= 0);
      if (!extra.length && !miss.length) {
        done = true; flag = -1; hot = -1; S.cursor('default'); N.sfx.good(); N.splash({ x: 640, y: 320 }); N.addScore(tries === 0 ? 40 : tries === 1 ? 25 : 15, { x: 640, y: 320 });
        N.say(`${fr(a, b)} = ${fr(a * m, b * m)} = ${fmt(a / b)} = %${p}: <b>bir kesir, dört kılık!</b> Duruma göre uygun gösterimi seçeriz: pasta için model, indirim için yüzde, terazi için ondalık gösterim.`, 'good');
        el.querySelector('#chk').disabled = true; nextBtn(el.querySelector('#cn')); S.ask();
        return;
      }
      tries++; N.sfx.bad();
      if (extra.length) { flag = extra[0]; N.say(`Kırmızı çerçeveli kart aynı miktar değil. ${cards[flag].why}`, 'bad'); }
      else N.say(`Seçtiklerin doğru ama <b>${miss.length}</b> kılık daha var! Her biçime bak: kesir, ondalık gösterim, yüzde, resim.`, 'bad');
      S.ask();
    };
    S.ask();
  }

  /* ── akış ── */
  let kModel = 0, kLine = 0, kHund = 0;
  function next() {
    st.si++; st.down = st.move = st.up = null; st.hot = -1; S.cursor('default'); N.dots(STEPS.length, st.si);
    if (st.si >= STEPS.length) {
      return N.finish({ id: 'kesir-firini', title: 'Kesir Ustası!', film: 'bir-kesir-dort-kilik',
        text: 'Aynı miktarı model, ölçü kabı, sayı doğrusu, yüzlük kart, kesir, ondalık gösterim ve yüzde ile gösterdin: 3/4 = 0,75 = %75. Sıradaki oyun: <b>Kesir Yarışı</b>.' });
    }
    const s = STEPS[st.si];
    if (s === 'model') return stepModel(kModel++);
    if (s === 'karisik') return stepMix();
    if (s === 'dogru') return stepLine(kLine++);
    if (s === 'yuzluk') return stepHundred(kHund++);
    return stepFour();
  }

  /* ── başla ── */
  N.dots(STEPS.length, 0);
  st.view = showcase;
  N.say('Ben <b>Nokta</b>, bugün fırıncıyım! Siparişler kesirle geliyor: <em>3/4 tepsi</em>, <em>2 1/4 bardak</em>, <em>%25 indirim</em>, <em>0,75 kg</em>… Hepsini birlikte gösterelim mi?');
  const el = N.panel(`<div class="card"><span class="label">Nasıl oynanır?</span>
    <p>Her siparişteki miktarı <b>farklı biçimlerde</b> göster: pasta ve tepsi dilimleri, ölçü kapları, sayı doğrusu, yüzlük kart.</p>
    <p class="small">Önce tahmin et, sonra dene, sonra nedenini söyle. Dokun ya da sürükle; klavyede ok tuşları ve boşluk da çalışır.</p>
    <button class="btn primary big" id="go" type="button">Başla →</button></div>`);
  el.querySelector('#go').addEventListener('click', next);
  S.ask();
  if (/onizleme/.test(location.search)) { st.view = showcase; S.ask(); }
})();
