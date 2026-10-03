/* Kesir Yarışı · MAT.5.1.4
   Farklı gösterimlerle ifade edilen kesirleri karşılaştır: tahmin et → dene → gerekçelendir.
   1) Varsayım: “Paydası büyük olan kesir büyüktür.” Şeritleri hizala, karşı örnekle çürüt.
   2) Şerit karşılaştır: hangisi büyük (ya da eşit)? Şeritlerle doğrula (eşit pay, denk kesir…).
   3) Yarıma göre: kesirleri “yarımdan küçük / yarıma eşit / yarımdan büyük” kutularına sürükle.
   4) Sayı doğrusu: kesir, ondalık, yüzde ve şekil kartlarını 0–1 doğrusuna yerleştir; yakınlaştır, yüzdeye çevir.
   5) Önermeler: doğru olanları seç. */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640;
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));

  const STEPS = ['varsayim', 'serit', 'serit', 'serit', 'yarim', 'yarim', 'dogru', 'dogru', 'onerme'];
  N.max = 30 + 3 * 20 + 2 * 4 * 10 + 2 * (4 * 10 + 20) + 60; // 350
  const st = { si: -1, view: null, h: null };
  const NAMES = g.shuffle(['Ada', 'Can', 'Ela', 'Mert', 'Defne', 'Kerem']).slice(0, 4);
  const NCOL = [N.DEEP, N.SEAL, N.INK, '#6f5a2c'];
  const SHADE = 'rgba(232,163,61,.82)';

  /* ── sayı yardımcıları ── */
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const fr = (n, dd) => ({ kind: 'frac', n, d: dd, v: n / dd });
  /** HTML içinde üst üste kesir */
  const fh = (n, dd) => `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1;font-size:.82em;margin:0 .1em"><span>${n}</span><span style="border-top:1.6px solid currentColor;padding:0 .18em;margin-top:1px">${dd}</span></span>`;
  const decStr = (h) => N.fmt(h / 100, 2);
  function pctStr(it) {
    if (it.kind === 'pct') return '%' + it.p;
    if (it.kind === 'dec') return '%' + it.h;
    const x = (100 * it.n) / it.d;
    if ((100 * it.n) % it.d === 0) return '%' + x;
    if ((1000 * it.n) % it.d === 0) return '%' + N.fmt(x, 1);
    return '%' + String(Math.floor(x * 10) / 10).replace('.', ',') + '…';
  }
  function valHtml(it) {
    if (it.kind === 'frac') return fh(it.n, it.d);
    if (it.kind === 'pie') return `${fh(it.n, it.d)} <small>(şekil)</small>`;
    if (it.kind === 'dec') return decStr(it.h);
    return '%' + it.p;
  }
  const tok = (it) => (it.kind === 'frac' || it.kind === 'pie' ? { n: it.n, d: it.d } : it.kind === 'dec' ? decStr(it.h) : '%' + it.p);

  /* ── çizim yardımcıları ── */
  const font = (s, f = N.BRUSH) => `400 ${s}px ${f}`;
  function fracW(c, n, dd, s) { c.font = font(s); return Math.max(c.measureText(String(n)).width, c.measureText(String(dd)).width) + s * .34; }
  function drawFrac(c, n, dd, x, y, s, col = N.INK) {
    const w = fracW(c, n, dd, s);
    d.text(c, String(n), x, y - s * .52, { size: s, color: col });
    d.text(c, String(dd), x, y + s * .6, { size: s, color: col });
    c.save(); c.strokeStyle = col; c.lineWidth = Math.max(2, s / 13); c.beginPath(); c.moveTo(x - w / 2, y + s * .04); c.lineTo(x + w / 2, y + s * .04); c.stroke(); c.restore();
    return w;
  }
  function drawPie(c, x, y, r, n, dd) {
    for (let i = 0; i < dd; i++) {
      const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / dd, a1 = a0 + (2 * Math.PI) / dd;
      c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, a0, a1); c.closePath();
      c.fillStyle = i < n ? SHADE : N.SHEET; c.fill(); c.strokeStyle = 'rgba(23,20,17,.7)'; c.lineWidth = 1.5; c.stroke();
    }
    d.circle(c, { x, y }, r, { w: 2.6 });
  }
  /** s: yazı boyu; kesir s*.8, pasta yarıçapı s*.75 */
  function drawVal(c, it, x, y, s, col = N.INK) {
    if (it.kind === 'frac') return drawFrac(c, it.n, it.d, x, y, s * .8, col);
    if (it.kind === 'pie') return drawPie(c, x, y, s * .75, it.n, it.d);
    d.text(c, it.kind === 'dec' ? decStr(it.h) : '%' + it.p, x, y, { size: s, color: col });
  }
  /** ifade: dizgiler ve {n,d} kesirleri yan yana, ortalı */
  function drawExpr(c, toks, cx, y, s, col = N.INK) {
    const fs = s * .74;
    const ws = toks.map((t) => (typeof t === 'string' ? (c.font = font(s), c.measureText(t).width) : fracW(c, t.n, t.d, fs) + 4));
    let x = cx - ws.reduce((a, b) => a + b, 0) / 2;
    toks.forEach((t, i) => {
      if (typeof t === 'string') d.text(c, t, x, y, { size: s, color: col, align: 'left' });
      else drawFrac(c, t.n, t.d, x + ws[i] / 2, y, fs, col);
      x += ws[i];
    });
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
  function drawCard(c, r, o = {}) {
    c.save();
    if (o.shadow) { c.fillStyle = 'rgba(60,40,10,.2)'; rr(c, r.x + 5, r.y + 8, r.w, r.h, 12); c.fill(); }
    rr(c, r.x, r.y, r.w, r.h, 12); c.fillStyle = o.fill || N.SHEET; c.globalAlpha = o.alpha == null ? 1 : o.alpha; c.fill();
    c.lineWidth = o.w || 2.6; c.strokeStyle = o.stroke || N.INK; c.setLineDash(o.dash || []); c.stroke(); c.setLineDash([]);
    if (!o.dash) { c.globalAlpha = .28; c.lineWidth = 1.2; rr(c, r.x + 1.5, r.y - 1.2, r.w - 1, r.h + 1.8, 13); c.stroke(); }
    c.globalAlpha = 1;
    if (o.hot) { c.strokeStyle = N.AMBER; c.lineWidth = 4; rr(c, r.x - 5, r.y - 5, r.w + 10, r.h + 10, 16); c.stroke(); }
    c.restore();
  }
  /** kesir şeridi: x,y sol üst, L boy (bütün), n/dd boyalı; t boyama ilerlemesi */
  function drawStrip(c, x, y, L, h, n, dd, o = {}) {
    const t = o.t == null ? 1 : o.t, pw = L / dd;
    if (o.shadow) { c.fillStyle = 'rgba(60,40,10,.18)'; c.fillRect(x + 5, y + 8, L, h); }
    c.fillStyle = N.SHEET; c.fillRect(x, y, L, h);
    c.fillStyle = o.fill || SHADE; c.fillRect(x, y, pw * n * t, h);
    c.strokeStyle = 'rgba(23,20,17,.55)'; c.lineWidth = 1.6; c.beginPath();
    for (let i = 1; i < dd; i++) { c.moveTo(x + i * pw, y); c.lineTo(x + i * pw, y + h); } c.stroke();
    d.poly(c, [{ x, y }, { x: x + L, y }, { x: x + L, y: y + h }, { x, y: y + h }], { w: 3 });
    if (o.hot) { c.strokeStyle = N.AMBER; c.lineWidth = 4; c.strokeRect(x - 5, y - 5, L + 10, h + 10); }
    if (o.label !== false) drawFrac(c, n, dd, x - 46, y + h / 2, o.ls || 30, o.lcol || N.INK);
    if (o.name) d.text(c, o.name, x + L + 16, y + h / 2, { size: 26, color: o.ncol || N.SOFT, align: 'left' });
  }
  const inR = (p, r, pad = 0) => p && p.x >= r.x - pad && p.x <= r.x + r.w + pad && p.y >= r.y - pad && p.y <= r.y + r.h + pad;
  const PAD = () => S.hit(10) - 6;

  /* ── olay yönlendirme ── */
  S.onDown = (p, e) => st.h && st.h.down && st.h.down(p, e);
  S.onMove = (p, e) => st.h && st.h.move && st.h.move(p, e);
  S.onUp = (p, e) => st.h && st.h.up && st.h.up(p, e);
  S.draw = (c) => { d.grid(c, W, H, 40); if (st.view) st.view(c); };

  /* ════ veri üretimi: her yüklemede yeni sayılar ════ */
  function genClaim() { // A: küçük payda, büyük kesir; B: büyük payda, küçük kesir
    if (Math.random() < .5) { const a = g.rnd(2, 5), b = g.rnd(a + 2, 9); return { A: fr(1, a), B: fr(1, b) }; }
    for (;;) {
      const d1 = g.rnd(3, 6), n1 = g.rnd(Math.ceil(d1 / 2), d1 - 1), d2 = g.rnd(d1 + 2, 12), n2 = g.rnd(1, Math.max(1, Math.floor(d2 / 2) - 1));
      if (gcd(n1, d1) === 1 && gcd(n2, d2) === 1 && n1 / d1 - n2 / d2 >= .15) return { A: fr(n1, d1), B: fr(n2, d2) };
    }
  }
  function genPair(type) {
    if (type === 'esitPay') { const a = g.rnd(2, 4), b = g.rnd(a + 1, 7), c2 = g.rnd(b + 2, 12); return { type, A: fr(a, b), B: fr(a, c2) }; }
    if (type === 'denk') {
      for (;;) { const b = g.rnd(2, 6), a = g.rnd(1, b - 1), k = g.rnd(2, Math.floor(12 / b)); if (gcd(a, b) === 1) return { type, A: fr(a, b), B: fr(a * k, b * k), k }; }
    }
    for (;;) {
      const d1 = g.rnd(3, 12), d2 = g.rnd(3, 12), n1 = g.rnd(1, d1 - 1), n2 = g.rnd(1, d2 - 1);
      if (d1 === d2 || n1 === n2 || lcm(d1, d2) > 24 || Math.abs(n1 / d1 - n2 / d2) < .06 || gcd(n1, d1) > 1 || gcd(n2, d2) > 1) continue;
      return { type: 'farkli', A: fr(n1, d1), B: fr(n2, d2) };
    }
  }
  const PAIRS = g.shuffle(['esitPay', 'denk', 'farkli']).map(genPair).map((P) => (Math.random() < .5 ? P : { ...P, A: P.B, B: P.A, swap: true }));

  function genHalf(k) {
    const less = (dd) => fr(g.rnd(1, Math.ceil(dd / 2) - 1), dd), more = (dd) => fr(g.rnd(Math.floor(dd / 2) + 1, dd - 1), dd);
    const eq = () => { const dd = g.pick([4, 6, 8, 10, 12]); return fr(dd / 2, dd); };
    for (;;) {
      let L;
      if (k === 0) L = [eq(), less(g.rnd(3, 12)), more(g.rnd(3, 12)), g.pick([less, more])(g.rnd(3, 12))];
      else { const o1 = g.pick([5, 7, 9, 11]), o2 = g.pick([5, 7, 9, 11]); L = [fr((o1 - 1) / 2, o1), fr((o2 + 1) / 2, o2), eq(), g.pick([less, more])(g.rnd(3, 12))]; }
      const keys = L.map((f) => f.n / f.d);
      if (new Set(keys).size === L.length) return g.shuffle(L);
    }
  }
  const HALVES = [genHalf(0), genHalf(1)];

  const FRP = [[2, 3], [3, 4], [5, 8], [7, 10], [5, 7], [7, 9], [4, 5], [3, 5], [7, 11], [8, 11], [9, 12], [6, 10]];
  const PIEP = [[2, 3], [3, 4], [5, 8], [3, 5], [4, 5], [5, 7], [4, 6], [5, 6]];
  function genLine() {
    for (;;) {
      const forms = g.shuffle(['frac', 'dec', 'pct', 'pie']);
      const its = forms.map((k) => {
        if (k === 'frac') { const [n, dd] = g.pick(FRP); return { kind: k, n, d: dd, v: n / dd }; }
        if (k === 'pie') { const [n, dd] = g.pick(PIEP); return { kind: k, n, d: dd, v: n / dd }; }
        if (k === 'dec') { const h = g.pick([g.rnd(6, 8) * 10, g.rnd(60, 80)]); return { kind: k, h, v: h / 100 }; }
        const p = g.rnd(60, 80); return { kind: k, p, v: p / 100 };
      });
      const vs = its.map((x) => x.v).sort((a, b) => a - b), gaps = vs.slice(1).map((x, i) => x - vs[i]);
      if (vs[0] < .6 || vs[3] > .8 + 1e-9 || Math.min(...gaps) < .015 || Math.min(...gaps) > .035) continue;
      return its.map((x, i) => ({ ...x, name: NAMES[i], col: NCOL[i] }));
    }
  }
  const LINES = [genLine(), genLine()];

  /* ── akış ── */
  function nextBtn(host, label) {
    host.innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">${label || (st.si === STEPS.length - 1 ? 'Bitir →' : 'Devam →')}</button>`;
    const b = host.querySelector('button'); b.onclick = next; b.focus();
  }
  let kPair = 0, kHalf = 0, kLine = 0;
  function next() {
    st.si++; st.h = null; S.cursor('default'); N.dots(STEPS.length, st.si);
    if (st.si >= STEPS.length) return N.finish({ id: 'kesir-yarisi', title: 'Kesir Şampiyonu!', film: 'hangisi-buyuk', text: '“Paydası büyük olan büyüktür” bir kural değil: şeritler gösterdi. Yarım iyi bir <b>tahmin aracı</b>; kesir, ondalık gösterim ve yüzdeyi karşılaştırmak için hepsini <b>aynı gösterime</b> çevir.' });
    const s = STEPS[st.si];
    if (s === 'varsayim') return stepClaim();
    if (s === 'serit') return stepPair(kPair++);
    if (s === 'yarim') return stepHalf(kHalf++);
    if (s === 'dogru') return stepLine(kLine++);
    return stepOnerme();
  }

  /* ════ 1. varsayım ════ */
  const SX = 200, SL = 600, SH = 62;
  function stepClaim() {
    const { A, B } = genClaim();
    const AY = 200, BY = 300, pos = { x: 330, y: 450 };
    let phase = 'tahmin', grow = 0, drag = null, hot = false, pred = null;
    st.view = (c) => {
      d.text(c, 'Mert’in kuralı:', 500, 40, { size: 26, color: N.SOFT });
      d.text(c, '“Paydası büyük olan kesir büyüktür.”', 500, 82, { size: 38, color: N.SEAL });
      if (phase === 'tahmin') {
        drawExpr(c, ['Örnek: ', B, ' > ', A, ',  çünkü ' + B.d + ' > ' + A.d], 500, 250, 40);
        d.text(c, 'Sence bu kural doğru mu?', 500, 380, { size: 32, color: N.DEEP });
        return;
      }
      // bütün
      const by = AY - 22; d.seg(c, { x: SX, y: by }, { x: SX + SL, y: by }, { w: 2, color: N.SOFT, sketch: false });
      d.seg(c, { x: SX, y: by - 8 }, { x: SX, y: by + 8 }, { w: 2, color: N.SOFT }); d.seg(c, { x: SX + SL, y: by - 8 }, { x: SX + SL, y: by + 8 }, { w: 2, color: N.SOFT });
      d.text(c, '1 bütün (aynı boy)', 500, by - 18, { size: 22, color: N.SOFT, font: N.MONO });
      drawStrip(c, SX, AY, SL, SH, A.n, A.d, { t: grow });
      if (phase === 'hizala') {
        c.save(); c.setLineDash([8, 8]); c.strokeStyle = 'rgba(184,116,26,.7)'; c.lineWidth = 2.5; c.strokeRect(SX, BY, SL, SH); c.restore();
        d.text(c, 'buraya hizala', 500, BY + SH / 2, { size: 26, color: 'rgba(184,116,26,.85)' });
      }
      drawStrip(c, pos.x, pos.y, SL, SH, B.n, B.d, { t: grow, hot: phase === 'hizala' && (hot || !!drag), shadow: !!drag });
      if (phase === 'hizala' && !drag) d.text(c, '↕ sürükle', pos.x + SL / 2, pos.y + SH + 26, { size: 22, color: N.DEEP, font: N.MONO });
      if (phase === 'sonuc') {
        const xa = SX + SL * A.v, xb = SX + SL * B.v;
        d.seg(c, { x: xa, y: AY - 6 }, { x: xa, y: BY + SH + 14 }, { color: N.DEEP, w: 2.5, dash: [6, 6] });
        d.seg(c, { x: xb, y: BY - 4 }, { x: xb, y: BY + SH + 14 }, { color: N.DEEP, w: 2.5, dash: [6, 6] });
        c.fillStyle = 'rgba(196,67,43,.22)'; c.fillRect(xb, BY, xa - xb, SH);
        d.text(c, 'fark', (xa + xb) / 2, BY + SH + 26, { size: 24, color: N.SEAL });
        drawExpr(c, [A, '  >  ', B], 500, 480, 48, N.INK);
        d.text(c, 'Paydası büyük olan daha KÜÇÜK çıktı!', 500, 570, { size: 32, color: N.SEAL });
      }
    };
    st.h = {
      down(p) { if (phase !== 'hizala') return; if (inR(p, { x: pos.x - 60, y: pos.y, w: SL + 60, h: SH }, PAD())) { drag = { dx: p.x - pos.x, dy: p.y - pos.y }; S.cursor('grabbing'); S.ask(); } },
      move(p) {
        if (!p || phase !== 'hizala') return;
        if (drag) { pos.x = Math.max(110, Math.min(W - SL - 20, p.x - drag.dx)); pos.y = Math.max(120, Math.min(H - SH - 30, p.y - drag.dy)); S.ask(); return; }
        const h = inR(p, { x: pos.x - 60, y: pos.y, w: SL + 60, h: SH }, PAD()); if (h !== hot) { hot = h; S.cursor(h ? 'grab' : 'default'); S.ask(); }
      },
      up() {
        if (!drag) return; drag = null; S.cursor('default');
        if (Math.abs(pos.x - SX) < 50 && Math.abs(pos.y - BY) < 50) {
          const from = { ...pos }; phase = 'snap'; N.sfx.snap();
          N.tween(260, (t) => { pos.x = from.x + (SX - from.x) * t; pos.y = from.y + (BY - from.y) * t; S.ask(); }).then(conclude);
        } else { N.say('Şeridi, kesikli çerçevenin içine getir: <b>sol uçlar</b> aynı hizada olsun. Ancak öyle boylarını karşılaştırabiliriz.'); }
        S.ask();
      },
    };
    S.ask();
    N.say(`Arkadaşım Mert bir kural buldu: <em>“Paydası büyük olan kesir büyüktür.”</em> Ona göre ${fh(B.n, B.d)} &gt; ${fh(A.n, A.d)}. Önce <b>tahmin et</b>: Mert haklı mı?`);
    const el = N.panel(`<div class="card"><span class="label">Varsayım · tahmin et</span><p>“Paydası büyük olan kesir büyüktür.”</p><div id="cb"></div><div id="cn"></div></div>`);
    N.choices(el.querySelector('#cb'), [{ t: 'Her zaman doğru', ok: true, k: 'd' }, { t: 'Yanlış', ok: true, k: 'y' }, { t: 'Bazen doğru', ok: true, k: 'b' }], async (o) => {
      pred = o.k; N.sfx.tick(); phase = 'hizala';
      N.say('Tahminini not ettim. Şimdi <b>deneyelim</b>! İki şerit de aynı bütün, boyları eş. Alttaki şeridi sürükleyip üsttekinin altına <em>hizala</em>.');
      el.querySelector('.label').textContent = 'Varsayım · dene';
      await N.tween(700, (t) => { grow = t; S.ask(); });
    }, 'three');
    function conclude() {
      phase = 'sonuc'; N.sfx.good(); S.ask();
      el.querySelector('.label').textContent = 'Varsayım · gerekçelendir';
      N.say(`Şeritler hizalandı! ${fh(A.n, A.d)} şeridi daha uzun. Peki Mert’in kuralı için ne diyebiliriz?`);
      const host = document.createElement('div'); host.style.marginTop = '10px'; el.querySelector('#cb').replaceWith(host);
      N.choices(host, [
        { t: `${fh(A.n, A.d)} &gt; ${fh(B.n, B.d)}. Bu tek örnek bile kuralın <b>yanlış</b> olduğunu gösterir.`, ok: true },
        { t: `Mert haklı; bu örnek bir istisnadır, kural yine doğrudur.`, ok: false },
        { t: `Şeritler kesirleri karşılaştırmaya yaramaz.`, ok: false },
      ], (o, b, first) => {
        if (!o.ok) { N.sfx.bad(); N.say('Bir kural <b>her zaman</b> doğru olmalı. Kuralın tutmadığı tek bir örnek (karşı örnek) bulduysak kural çürür.', 'bad'); return; }
        N.sfx.good(); N.splash({ x: 500, y: 480 });
        const ps = pred !== 'd' ? 10 : 0, cs = first ? 20 : 0; if (ps + cs) N.addScore(ps + cs, { x: 500, y: 430 });
        const why = `Payda büyüdükçe bütün <b>daha çok parçaya</b> bölünür, parçalar küçülür. ${A.n === 1 ? `${fh(1, A.d)} parçası ${fh(1, B.d)} parçasından büyük.` : ''}`;
        const pm = pred === 'b' ? ` “Bazen doğru” demen de akıllıca: ${fh(3, 4)} &gt; ${fh(1, 2)} gibi örneklerde paydası büyük olan büyük. Ama bunun nedeni payda değil; bu bir kural olamaz.` : pred === 'y' ? ' Tahminin doğruydu!' : ' Tahminin tutmadı ama artık nedenini biliyorsun.';
        N.say(`<b>Karşı örnek</b> buldun: ${fh(A.n, A.d)} &gt; ${fh(B.n, B.d)}. ${why}${pm}`, 'good');
        nextBtn(el.querySelector('#cn'));
      }, 'one');
    }
  }

  /* ════ 2. şerit karşılaştır ════ */
  function stepPair(k) {
    const P = PAIRS[k], { A, B } = P, nm = g.shuffle(NAMES).slice(0, 2);
    const RA = { x: 110, y: 46, w: 280, h: 160 }, RE = { x: 430, y: 86, w: 140, h: 80 }, RB = { x: 610, y: 46, w: 280, h: 160 };
    let reveal = 0, hot = null, done = false, picked = null;
    const bigger = Math.abs(A.v - B.v) < 1e-9 ? 'E' : A.v > B.v ? 'A' : 'B';
    st.view = (c) => {
      [[RA, A, nm[0], 'A'], [RB, B, nm[1], 'B']].forEach(([r, f, n, key]) => {
        drawCard(c, r, { hot: hot === key && !done, fill: done && bigger === key ? 'rgba(232,163,61,.22)' : N.SHEET, stroke: picked === key ? N.DEEP : N.INK, w: picked === key ? 4 : 2.6 });
        d.text(c, n, r.x + r.w / 2, r.y + 24, { size: 16, color: N.SOFT, font: N.MONO });
        drawFrac(c, f.n, f.d, r.x + r.w / 2, r.y + 80, 42);
      });
      drawCard(c, RE, { hot: hot === 'E' && !done, fill: done && bigger === 'E' ? 'rgba(232,163,61,.22)' : N.SHEET, stroke: picked === 'E' ? N.DEEP : N.INK, w: picked === 'E' ? 4 : 2.6 });
      d.text(c, 'eşit', RE.x + RE.w / 2, RE.y + RE.h / 2, { size: 34 });
      d.text(c, 'okudu', RA.x + RA.w / 2, RA.y + RA.h - 12, { size: 14, color: N.SOFT, font: N.MONO }); d.text(c, 'okudu', RB.x + RB.w / 2, RB.y + RB.h - 12, { size: 14, color: N.SOFT, font: N.MONO });
      if (!reveal) { d.text(c, 'Tahmin et: kim daha çok okudu? Kartlardan birine dokun.', 500, 330, { size: 30, color: N.DEEP }); return; }
      c.globalAlpha = Math.min(1, reveal * 2);
      drawStrip(c, SX, 270, SL, 58, A.n, A.d, { t: reveal, name: nm[0] });
      drawStrip(c, SX, 360, SL, 58, B.n, B.d, { t: reveal, name: nm[1] });
      c.globalAlpha = 1;
      if (reveal > .99) {
        const xa = SX + SL * A.v, xb = SX + SL * B.v;
        d.seg(c, { x: xa, y: 262 }, { x: xa, y: 430 }, { color: N.DEEP, w: 2.5, dash: [6, 6] });
        if (Math.abs(xa - xb) > 1) d.seg(c, { x: xb, y: 262 }, { x: xb, y: 430 }, { color: N.DEEP, w: 2.5, dash: [6, 6] });
        else d.text(c, 'aynı yerde bitiyor!', xa, 448, { size: 24, color: N.DEEP });
        if (done) drawExpr(c, exprToks(), 500, 530, 44);
      }
    };
    function exprToks() {
      const [big, sm] = A.v >= B.v ? [A, B] : [B, A];
      if (P.type === 'denk') return [{ n: P.swap ? B.n : A.n, d: P.swap ? B.d : A.d }, ' = ', { n: P.swap ? A.n : B.n, d: P.swap ? A.d : B.d }, '   (denk kesir)'];
      if (P.type === 'esitPay') return [big, ' > ', sm, '   (paylar eşit)'];
      const L = lcm(big.d, sm.d), e = (f) => (f.d === L ? [f] : [f, ' = ', { n: f.n * L / f.d, d: L }]);
      return [...e(big), '  >  ', ...e(sm)];
    }
    function explain() {
      const [big, sm] = A.v >= B.v ? [A, B] : [B, A];
      if (P.type === 'denk') { const [s, l] = A.d < B.d ? [A, B] : [B, A]; return `Şeritler aynı yerde bitiyor: ${fh(s.n, s.d)} ile ${fh(l.n, l.d)} <b>denk kesir</b>. ${fh(s.n, s.d)} kesrinin payını ve paydasını ${P.k} ile çarparsan ${fh(l.n, l.d)} olur.`; }
      if (P.type === 'esitPay') return `Paylar eşit: ikisinde de ${big.n} parça var. Paydası küçük olanın parçaları <b>daha büyük</b>, o yüzden ${fh(big.n, big.d)} &gt; ${fh(sm.n, sm.d)}.`;
      const L = lcm(big.d, sm.d);
      return `Paydaları eşitle: ${L} eş parçada ${fh(big.n, big.d)} = ${fh(big.n * L / big.d, L)} ve ${fh(sm.n, sm.d)} = ${fh(sm.n * L / sm.d, L)}. ${big.n * L / big.d} parça, ${sm.n * L / sm.d} parçadan çok: ${fh(big.n, big.d)} büyük.`;
    }
    const hitKey = (p) => (inR(p, RA, PAD()) ? 'A' : inR(p, RB, PAD()) ? 'B' : inR(p, RE, PAD()) ? 'E' : null);
    st.h = {
      down(p) { if (done) return; const k2 = hitKey(p); if (k2 && btns[k2] && !btns[k2].disabled) btns[k2].click(); },
      move(p) { if (done) return; const k2 = hitKey(p); if (k2 !== hot) { hot = k2; S.cursor(k2 ? 'pointer' : 'default'); S.ask(); } },
    };
    S.ask();
    N.say(`Şerit ${k + 1} / 3: <b>${nm[0]}</b> kitabının ${fh(A.n, A.d)} kadarını, <b>${nm[1]}</b> ${fh(B.n, B.d)} kadarını okudu. Kitaplar aynı kalınlıkta. Kim daha çok okudu? Önce <em>tahmin et</em>!`);
    const el = N.panel(`<div class="card"><span class="label">Şerit karşılaştır ${k + 1} / 3</span><p class="small">Bir karta dokun ya da buradan seç. Sonra şerit model tahminini sınayacak.</p><div id="cb"></div><div id="cn"></div></div>`);
    const box = N.choices(el.querySelector('#cb'), [
      { t: `${nm[0]} ${fh(A.n, A.d)}`, ok: bigger === 'A', key: 'A' }, { t: 'Eşit', ok: bigger === 'E', key: 'E' }, { t: `${nm[1]} ${fh(B.n, B.d)}`, ok: bigger === 'B', key: 'B' },
    ], async (o, b, first) => {
      picked = o.key; S.ask();
      if (!reveal) await N.tween(900, (t) => { reveal = Math.max(.001, t); S.ask(); });
      if (!o.ok) {
        N.sfx.bad();
        N.say(`Şeritlere bak: ${bigger === 'E' ? 'ikisi de <b>aynı yerde</b> bitiyor.' : `<b>${bigger === 'A' ? nm[0] : nm[1]}</b> şeridinin boyalı kısmı daha uzun.`} Bir daha seç.`, 'bad');
        return;
      }
      done = true; hot = null; S.cursor('default'); N.sfx.good(); S.ask();
      if (first) N.addScore(20, { x: 500, y: 480 }); else N.addScore(5, { x: 500, y: 480 });
      N.say(explain(), 'good'); nextBtn(el.querySelector('#cn'));
    }, 'three');
    const bs = box.querySelectorAll('.choice'); const btns = { A: bs[0], E: bs[1], B: bs[2] };
  }

  /* ════ 3. yarıma göre ════ */
  function stepHalf(k) {
    const F = HALVES[k], n = F.length;
    const BINS = [{ x: 24, t: 'yarımdan küçük', s: '<' }, { x: 352, t: 'yarıma eşit', s: '=' }, { x: 680, t: 'yarımdan büyük', s: '>' }].map((b) => ({ ...b, y: 280, w: 296, h: 344 }));
    const binOf = (f) => (2 * f.n < f.d ? 0 : 2 * f.n === f.d ? 1 : 2);
    const CW = 150, CH = 110, home = (i) => ({ x: 500 + (i - (n - 1) / 2) * 200 - CW / 2, y: 60 });
    const pos = F.map((_, i) => home(i)), where = F.map(() => -1), tries = F.map(() => 0), inBin = [[], [], []];
    let drag = null, hot = -1, hotBin = -1, busy = false;
    const slot = (b, j) => ({ x: BINS[b].x + 12 + (j % 2) * 142, y: BINS[b].y + 108 + Math.floor(j / 2) * 116, w: 130, h: 104 });
    st.view = (c) => {
      BINS.forEach((b, i) => {
        drawCard(c, b, { fill: hotBin === i ? 'rgba(232,163,61,.2)' : 'rgba(255,250,240,.55)', dash: [10, 8], w: 2.4, stroke: hotBin === i ? N.DEEP : N.SOFT });
        d.text(c, b.t, b.x + b.w / 2, b.y + 30, { size: 30, color: N.DEEP });
        drawExpr(c, [b.s + ' ', { n: 1, d: 2 }], b.x + b.w / 2, b.y + 72, 34, N.SOFT);
      });
      d.text(c, 'Kartları sürükle', 500, 24, { size: 22, color: N.SOFT, font: N.MONO });
      const order = F.map((_, i) => i).filter((i) => i !== (drag && drag.i)); if (drag) order.push(drag.i);
      order.forEach((i) => {
        const f = F[i];
        if (where[i] >= 0) {
          const r = pos[i]; drawCard(c, r, { fill: 'rgba(232,163,61,.14)' });
          drawFrac(c, f.n, f.d, r.x + r.w / 2, r.y + 38, 26);
          const sx = r.x + 12, sw = r.w - 24, sy = r.y + 76; drawStrip(c, sx, sy, sw, 14, f.n, f.d, { label: false });
          d.seg(c, { x: sx + sw / 2, y: sy - 7 }, { x: sx + sw / 2, y: sy + 21 }, { color: N.SEAL, w: 2.5, sketch: false });
          return;
        }
        drawCard(c, { ...pos[i], w: CW, h: CH }, { hot: hot === i || (drag && drag.i === i), shadow: drag && drag.i === i });
        drawFrac(c, f.n, f.d, pos[i].x + CW / 2, pos[i].y + CH / 2, 40);
      });
    };
    const binAt = (p) => (p.y > 250 ? BINS.findIndex((b) => p.x >= b.x && p.x <= b.x + b.w) : -1);
    const cardAt = (p) => { for (let i = n - 1; i >= 0; i--) if (where[i] < 0 && inR(p, { ...pos[i], w: CW, h: CH }, PAD())) return i; return -1; };
    st.h = {
      down(p) { if (busy) return; const i = cardAt(p); if (i < 0) return; drag = { i, dx: p.x - pos[i].x, dy: p.y - pos[i].y }; S.cursor('grabbing'); N.sfx.tick(); S.ask(); },
      move(p) {
        if (!p) return;
        if (drag) { pos[drag.i] = { x: Math.max(0, Math.min(W - CW, p.x - drag.dx)), y: Math.max(0, Math.min(H - CH, p.y - drag.dy)) }; const b = binAt(p); if (b !== hotBin) hotBin = b; S.ask(); return; }
        const i = cardAt(p); if (i !== hot) { hot = i; S.cursor(i >= 0 ? 'grab' : 'default'); S.ask(); }
      },
      up(p) {
        if (!drag) return; const i = drag.i, f = F[i]; drag = null; hotBin = -1; S.cursor('default');
        const b = p ? binAt(p) : -1, half = N.fmt(f.d / 2), cmp = 2 * f.n < f.d ? '<' : 2 * f.n === f.d ? '=' : '>';
        if (b < 0) { back(i); return; }
        if (b !== binOf(f)) {
          tries[i]++; N.sfx.bad(); back(i);
          N.say(`${fh(f.n, f.d)}: önce paydanın yarısını bul. Payda ${f.d}, yarısı ${half}. Pay ${f.n} bundan ${cmp === '<' ? 'küçük' : cmp === '=' ? 'farklı değil, eşit' : 'büyük'}. Hangi kutu?`, 'bad');
          return;
        }
        where[i] = b; inBin[b].push(i); const target = slot(b, inBin[b].length - 1), from = { ...pos[i], w: CW, h: CH };
        busy = true; N.sfx.snap();
        N.tween(260, (t) => { pos[i] = { x: from.x + (target.x - from.x) * t, y: from.y + (target.y - from.y) * t, w: from.w + (target.w - from.w) * t, h: from.h + (target.h - from.h) * t }; S.ask(); }).then(() => { busy = false; S.ask(); });
        N.addScore(tries[i] ? 4 : 10, { x: target.x + 65, y: target.y });
        const left = where.filter((x) => x < 0).length;
        N.say(`${fh(f.n, f.d)}: payda ${f.d}, yarısı ${half}; pay ${f.n} ${cmp} ${half} → <b>${BINS[b].t}</b>.`, 'good');
        el.querySelector('#cnt').textContent = `${n - left} / ${n}`;
        if (!left) finishHalf();
      },
    };
    function back(i) {
      const from = { ...pos[i] }, to = home(i); busy = true;
      N.tween(320, (t) => { pos[i] = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }; S.ask(); }).then(() => { busy = false; });
    }
    function finishHalf() {
      N.sfx.good(); N.splash({ x: 500, y: 420 });
      const lo = F.find((f) => binOf(f) === 0), hi = F.find((f) => binOf(f) === 2);
      N.say(lo && hi ? `Hepsi yerinde! Yarım bir <b>tahmin aracı</b>: ${fh(lo.n, lo.d)} &lt; ${fh(1, 2)} &lt; ${fh(hi.n, hi.d)} ise, şeride bakmadan ${fh(lo.n, lo.d)} &lt; ${fh(hi.n, hi.d)} diyebiliriz.` : 'Hepsi yerinde! Yarım, kesirleri karşılaştırırken harika bir <b>tahmin aracı</b>.', 'good');
      nextBtn(el.querySelector('#cn'));
    }
    S.ask();
    N.say(k === 0 ? 'Bir kesir <b>yarımdan</b> büyük mü, küçük mü? Şerit çizmeden anlamanın kısa yolu: <em>pay, paydanın yarısından büyük mü?</em> Kartları doğru kutuya sürükle.' : 'Şimdi daha yakın olanlar! Payda tek sayıysa yarısı buçuklu çıkar: 7’nin yarısı 3,5. Kartları kutulara sürükle.');
    const el = N.panel(`<div class="card"><span class="label">Yarıma göre ${k + 1} / 2</span>
      <p>Kesrin <b>payı</b>, <b>paydanın yarısından</b>…</p>
      <p class="small">küçükse → yarımdan küçük<br>eşitse → yarıma eşit<br>büyükse → yarımdan büyük</p>
      <div class="row"><span class="small">Yerleşen:</span> <b id="cnt">0 / ${n}</b></div><div id="cn"></div></div>`);
  }

  /* ════ 4. sayı doğrusu ════ */
  const LX0 = 80, LX1 = 920, LY = 480, TY = 384;
  function lineX(v, lo, hi) { return LX0 + ((v - lo) / (hi - lo)) * (LX1 - LX0); }
  function drawNumLine(c, lo, hi, zt) {
    const span = hi - lo, per = (LX1 - LX0) / (span * 100); // 0,01 başına piksel
    if (zt < 1) { c.fillStyle = `rgba(232,163,61,${.16 * (1 - zt)})`; const a = lineX(.6, lo, hi), b = lineX(.8, lo, hi); c.fillRect(a, LY - 26, b - a, 52); }
    const zoomed = span < .9;
    d.seg(c, { x: zoomed ? LX0 - 50 : LX0, y: LY }, { x: zoomed ? LX1 + 50 : LX1, y: LY }, { w: 3.2 });
    if (zoomed) { d.arrow(c, { x: LX1 + 52, y: LY }, { x: 1, y: 0 }, { w: 3 }); d.arrow(c, { x: LX0 - 52, y: LY }, { x: -1, y: 0 }, { w: 3 }); }
    for (let k = 0; k <= 100; k++) {
      const v = k / 100; if (v < lo - 1e-9 || v > hi + 1e-9) continue;
      const major = k % 10 === 0, mid = k % 5 === 0; if (!major && !mid && per < 9) continue;
      const x = lineX(v, lo, hi), len = major ? 15 : mid ? 10 : 6;
      c.strokeStyle = N.INK; c.lineWidth = major ? 2.6 : 1.6; c.beginPath(); c.moveTo(x, LY - len); c.lineTo(x, LY + len); c.stroke();
      const lab = k === 0 ? '0' : k === 100 ? '1' : N.fmt(v, 2);
      if (major && per * 10 >= 50) d.text(c, lab, x, LY + 34, { size: 26 });
      else if (mid && !major && per * 5 >= 60) d.text(c, lab, x, LY + 34, { size: 24, color: N.SOFT });
      else if (!mid && per >= 34 && (S.css || 1) > .55) d.text(c, lab, x, LY + 30, { size: 12, color: N.SOFT, font: N.MONO });
    }
  }
  /** yerleşen kartların etiketleri: çakışmasın diye yatayda aralanır */
  function tagXs(xs) {
    const o = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x), G = 112;
    const t = o.map((e) => Math.max(64, Math.min(W - 64, e.x)));
    for (let it = 0; it < 30; it++) {
      for (let j = 1; j < t.length; j++) if (t[j] - t[j - 1] < G) { const m = (t[j] + t[j - 1]) / 2; t[j - 1] = m - G / 2; t[j] = m + G / 2; }
      for (let j = 0; j < t.length; j++) t[j] = Math.max(64, Math.min(W - 64, t[j]));
    }
    const res = []; o.forEach((e, j) => { res[e.i] = t[j]; }); return res;
  }
  function drawTags(c, items, lo, hi, showPct) {
    const xs = items.map((it) => lineX(it.v, lo, hi)), tx = tagXs(xs);
    items.forEach((it, i) => { d.seg(c, { x: tx[i], y: TY + 28 }, { x: xs[i], y: LY - 6 }, { color: it.col, w: 2.2 }); });
    items.forEach((it, i) => {
      const r = { x: tx[i] - 50, y: TY - 28, w: 100, h: 56 };
      drawCard(c, r, { stroke: it.col, w: 2.6 });
      d.text(c, it.name, tx[i], r.y - 13, { size: 14, color: it.col, font: N.MONO });
      drawVal(c, it, tx[i], TY, 27);
      if (showPct && it.kind !== 'pct') d.text(c, '= ' + pctStr(it), tx[i], r.y + r.h + 13, { size: 13, color: N.DEEP, font: N.MONO });
      d.dot(c, { x: xs[i], y: LY }, { r: 6.5, color: it.col });
    });
  }
  function sortedExpr(c, items, showPct) {
    const s = items.slice().sort((a, b) => a.v - b.v), toks = [];
    s.forEach((it, i) => { if (i) toks.push('  <  '); toks.push(tok(it)); });
    drawExpr(c, toks, 500, 572, 32);
    if (showPct) d.text(c, s.map(pctStr).join('  <  '), 500, 618, { size: 22, color: N.DEEP, font: N.MONO });
  }
  function stepLine(k) {
    const items = LINES[k], n = items.length;
    const slot = (i) => ({ x: 30 + i * 240, y: 20, w: 200, h: 140 });
    const pos = items.map((_, i) => slot(i)), placed = items.map(() => false), tries = items.map(() => 0);
    let drag = null, hot = -1, guide = null, busy = false, asked = false, busyI = -1;
    st.lo = 0; st.hi = 1; st.zt = 0; st.pct = false;
    st.view = (c) => {
      drawNumLine(c, st.lo, st.hi, st.zt);
      const pl = items.filter((_, i) => placed[i]); drawTags(c, pl, st.lo, st.hi, st.pct);
      if (placed.every(Boolean)) sortedExpr(c, items, st.pct);
      items.forEach((it, i) => { if (!placed[i] && !(drag && drag.i === i) && busyI !== i) drawTray(c, it, pos[i], i === hot); });
      if (busyI >= 0 && !placed[busyI]) drawTray(c, items[busyI], pos[busyI], false);
      items.forEach((it, i) => { if (placed[i]) drawCard(c, slot(i), { dash: [8, 8], stroke: N.FAINT, fill: 'rgba(255,250,240,.3)', w: 2 }); });
      if (guide) {
        d.seg(c, { x: guide.x, y: guide.y }, { x: guide.x, y: LY - 4 }, { color: N.DEEP, w: 2, dash: [5, 6] });
        c.fillStyle = N.DEEP; c.beginPath(); c.moveTo(guide.x, LY - 2); c.lineTo(guide.x - 8, LY - 16); c.lineTo(guide.x + 8, LY - 16); c.closePath(); c.fill();
      }
      if (drag) drawTray(c, items[drag.i], pos[drag.i], true, true);
    };
    function drawTray(c, it, r, hotC, shadow) {
      drawCard(c, r, { hot: hotC, shadow });
      d.text(c, it.name, r.x + r.w / 2, r.y + 17, { size: 14, color: it.col, font: N.MONO });
      drawVal(c, it, r.x + r.w / 2, r.y + 72, 44);
      if (st.pct && it.kind !== 'pct') d.text(c, '= ' + pctStr(it), r.x + r.w / 2, r.y + r.h - 14, { size: 15, color: N.DEEP, font: N.MONO });
    }
    const cardAt = (p) => { for (let i = n - 1; i >= 0; i--) if (!placed[i] && inR(p, pos[i], PAD())) return i; return -1; };
    st.h = {
      down(p) { if (busy) return; const i = cardAt(p); if (i < 0) return; drag = { i, dx: p.x - pos[i].x, dy: p.y - pos[i].y }; S.cursor('grabbing'); N.sfx.tick(); S.ask(); },
      move(p) {
        if (!p) return;
        if (drag) {
          const r = pos[drag.i]; r.x = Math.max(0, Math.min(W - r.w, p.x - drag.dx)); r.y = Math.max(0, Math.min(H - r.h, p.y - drag.dy));
          guide = p.y > 200 && p.x > LX0 - 30 && p.x < LX1 + 30 ? { x: Math.max(LX0, Math.min(LX1, p.x)), y: r.y + r.h } : null; S.ask(); return;
        }
        const i = cardAt(p); if (i !== hot) { hot = i; S.cursor(i >= 0 ? 'grab' : 'default'); S.ask(); }
      },
      up(p) {
        if (!drag) return; const i = drag.i, it = items[i]; drag = null; guide = null; S.cursor('default');
        if (!p || p.y < 200 || p.x < LX0 - 30 || p.x > LX1 + 30) { back(i); return; }
        const x = Math.max(LX0, Math.min(LX1, p.x)), v = st.lo + ((x - LX0) / (LX1 - LX0)) * (st.hi - st.lo), tol = (st.hi - st.lo) * .035;
        if (Math.abs(v - it.v) > tol) {
          tries[i]++; N.sfx.bad(); back(i);
          const dir = it.v > v ? 'biraz daha <b>sağda</b>' : 'biraz daha <b>solda</b>';
          N.say(`${it.name}: ${valHtml(it)} ${dir} olmalı. ${tries[i] >= 2 || it.kind === 'pie' ? `İpucu: ${valHtml(it)} = ${pctStr(it)}, yani ${N.fmt(it.v, 3)} civarı.` : 'Yüzdeye çevirmek işe yarayabilir.'}${st.zt < 1 ? ' Değerler çok yakınsa <em>yakınlaştır</em>.' : ''}`, 'bad');
          return;
        }
        placed[i] = true; N.sfx.snap(); N.addScore(tries[i] ? 4 : 10, { x: lineX(it.v, st.lo, st.hi), y: LY - 30 });
        const left = placed.filter((b) => !b).length; el.querySelector('#cnt').textContent = `${n - left} / ${n}`;
        N.say(`${it.name}: ${valHtml(it)} = ${it.kind === 'pct' ? decStr(it.p) : pctStr(it)}. Sayı doğrusunda yerini buldu!`, 'good');
        S.ask();
        if (!left) finishLine();
      },
    };
    function back(i) {
      const from = { ...pos[i] }, to = slot(i); busy = true; busyI = i;
      N.tween(320, (t) => { pos[i].x = from.x + (to.x - from.x) * t; pos[i].y = from.y + (to.y - from.y) * t; S.ask(); }).then(() => { busy = false; busyI = -1; S.ask(); });
    }
    function finishLine() {
      if (asked) return; asked = true;
      const most = k === 0, s = items.slice().sort((a, b) => a.v - b.v), ans = most ? s[n - 1] : s[0];
      N.say(`Hepsi sayı doğrusunda, soldan sağa küçükten büyüğe sıralandılar. Şimdi söyle: kim <b>en ${most ? 'çok' : 'az'}</b> okudu?`);
      const q = el.querySelector('#q'); q.innerHTML = `<p style="margin:10px 0 6px"><b>Kim en ${most ? 'çok' : 'az'} okudu?</b></p>`;
      N.choices(q, items.map((it) => ({ t: `${it.name} <small>${valHtml(it)}</small>`, ok: it === ans })), (o, b, first) => {
        if (!o.ok) { N.sfx.bad(); N.say(`Sayı doğrusunda en ${most ? '<b>sağdaki</b>' : '<b>soldaki</b>'} kim? Yüzdeye çevir düğmesi de yardım eder.`, 'bad'); return; }
        N.sfx.good(); N.splash({ x: lineX(ans.v, st.lo, st.hi), y: LY }); if (first) N.addScore(20, { x: 500, y: 560 });
        st.pct = true; S.ask(); el.querySelector('#pct').disabled = true;
        N.say(`Evet, <b>${ans.name}</b>! Hepsini yüzdeye çevirince sıralamak kolay: ${s.map(pctStr).join(' &lt; ')}.`, 'good');
        nextBtn(el.querySelector('#cn'));
      });
    }
    S.ask();
    N.say(k === 0 ? 'Dört arkadaş aynı kitabı okuyor, ama okudukları kısmı <b>farklı gösterimlerle</b> söylüyorlar: kesir, ondalık gösterim, yüzde, şekil. Kartları <em>sayı doğrusuna</em> sürükle!' : 'Yeni yarış, yeni sayılar! Kartları sayı doğrusuna sürükle. Çok yakın olanlar için <em>yakınlaştır</em>.');
    const el = N.panel(`<div class="card"><span class="label">Sayı doğrusu ${k + 1} / 2</span>
      <p class="small">Her kartı 0 ile 1 arasındaki yerine sürükle. Yakın bırakırsan kart tam yerine oturur.</p>
      <div class="row"><button class="btn" id="zoom" type="button" aria-pressed="false">⌕ Yakınlaştır (0,6–0,8)</button><button class="btn" id="pct" type="button" aria-pressed="false">% Hepsini yüzdeye çevir</button></div>
      <div class="row" style="margin-top:8px"><span class="small">Yerleşen:</span> <b id="cnt">0 / ${n}</b></div><div id="q"></div><div id="cn"></div></div>`);
    const zb = el.querySelector('#zoom'), pb = el.querySelector('#pct');
    let zooming = false;
    zb.onclick = async () => {
      if (zooming) return; zooming = true;
      const on = st.zt < .5, a = { lo: st.lo, hi: st.hi }, b = on ? { lo: .6, hi: .8 } : { lo: 0, hi: 1 }, z0 = st.zt;
      zb.textContent = on ? '⌕ Uzaklaştır (0–1)' : '⌕ Yakınlaştır (0,6–0,8)'; zb.setAttribute('aria-pressed', String(on)); N.sfx.tick();
      await N.tween(700, (t) => { st.lo = a.lo + (b.lo - a.lo) * t; st.hi = a.hi + (b.hi - a.hi) * t; st.zt = z0 + ((on ? 1 : 0) - z0) * t; S.ask(); });
      zooming = false;
      if (on) N.say('0,6 ile 0,8 arasını büyüttüm. Artık her küçük çentik <b>0,01</b>: yüzde birlik adımlar!');
    };
    pb.onclick = () => {
      st.pct = !st.pct; pb.setAttribute('aria-pressed', String(st.pct)); pb.textContent = st.pct ? '% Yüzdeleri gizle' : '% Hepsini yüzdeye çevir'; N.sfx.tick(); S.ask();
      if (st.pct) N.say(`Hepsini aynı gösterime çevirdim: ${items.map((it) => `${valHtml(it)} = ${pctStr(it)}`).join(', ')}. Yüzde, “100 eş parçadan kaçı?” demek.`);
    };
  }

  /* ════ 5. önermeler ════ */
  function drawLanes(c, items, o = {}) {
    const X0 = 300, X1 = 880, L = X1 - X0;
    d.text(c, o.title || 'Okuma yarışı: kitabın ne kadarını okudular?', 500, 42, { size: 32, color: N.DEEP });
    d.seg(c, { x: X1, y: 82 }, { x: X1, y: 534 }, { color: N.SEAL, w: 3, dash: [10, 7] });
    d.text(c, 'bitiş: 1 kitap', X1, 76, { size: 20, color: N.SEAL, font: N.MONO, base: 'bottom' });
    items.forEach((it, i) => {
      const y = 140 + i * 110;
      d.text(c, it.name, 40, y, { size: 32, color: it.col, align: 'left' });
      drawVal(c, it, 200, y, 40);
      c.save(); c.setLineDash([6, 6]); c.strokeStyle = 'rgba(23,20,17,.3)'; c.lineWidth = 1.5; c.strokeRect(X0, y - 20, L, 40); c.restore();
      const t = o.t == null ? 0 : o.t;
      if (t > 0) {
        c.fillStyle = SHADE; c.fillRect(X0, y - 20, L * it.v * t, 40);
        d.poly(c, [{ x: X0, y: y - 20 }, { x: X0 + L * it.v * t, y: y - 20 }, { x: X0 + L * it.v * t, y: y + 20 }, { x: X0, y: y + 20 }], { w: 2.6 });
        if (t > .99 && o.pct) d.text(c, pctStr(it), X0 + L * it.v + 12, y, { size: 16, color: N.DEEP, font: N.MONO, align: 'left' });
      } else d.text(c, '?', X0 + L / 2, y, { size: 40, color: N.SEAL });
    });
    const ay = 566; d.seg(c, { x: X0, y: ay }, { x: X1, y: ay }, { w: 2.6 });
    [[0, '0'], [.5, null], [1, '1']].forEach(([v, s]) => {
      const x = X0 + L * v; d.seg(c, { x, y: ay - 9 }, { x, y: ay + 9 }, { w: 2.6 });
      if (s) d.text(c, s, x, ay + 30, { size: 26 }); else drawFrac(c, 1, 2, x, ay + 36, 20);
    });
    c.save(); c.setLineDash([4, 7]); c.strokeStyle = 'rgba(23,20,17,.35)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X0 + L / 2, 90); c.lineTo(X0 + L / 2, ay - 10); c.stroke(); c.restore();
  }
  function stepOnerme() {
    const items = LINES[1]; st.lane = 0;
    st.view = (c) => drawLanes(c, items, { t: st.lane, pct: true, title: 'Son yarış: kim nerede?' });
    N.tween(900, (t) => { st.lane = t; S.ask(); });
    N.say('Son olarak bir kesir şampiyonu gibi <em>önermelerini</em> yaz: hangileri doğru? Doğru olanların hepsini işaretle.');
    const CL = g.shuffle([
      { t: 'Payları eşit kesirlerden paydası küçük olan büyüktür.', ok: true, why: 'Paylar eşitse parça sayısı aynı; paydası küçük olanın parçaları daha büyük.' },
      { t: 'Paydası büyük olan kesir her zaman büyüktür.', ok: false, why: `Mert’in kuralını hatırla: ${fh(1, 3)} &gt; ${fh(1, 5)}. Bir karşı örnek yeter.` },
      { t: 'Farklı gösterimleri karşılaştırmak için hepsini aynı gösterime (yüzde ya da ondalık) çevirebiliriz.', ok: true, why: 'Sayı doğrusunda yaptığımız gibi: hepsini yüzdeye çevirince sıralamak kolaylaştı.' },
      { t: '0,7 ile %70 aynı miktardır.', ok: true, why: '0,7 = 70/100 = %70.' },
      { t: `${fh(2, 3)} &gt; ${fh(3, 4)}`, ok: false, why: `${fh(2, 3)} = ${fh(8, 12)}, ${fh(3, 4)} = ${fh(9, 12)}. Yani ${fh(2, 3)} daha küçük.` },
    ]);
    const el = N.panel(`<div class="card"><span class="label">Önermeler</span>
      ${CL.map((c, i) => `<label style="display:flex;gap:10px;align-items:flex-start;margin:0 0 9px;font-size:15.5px;cursor:pointer"><input type="checkbox" data-i="${i}" style="width:20px;height:20px;accent-color:#171411;margin-top:2px;flex:none"> <span>${c.t}</span></label>`).join('')}
      <button class="btn primary big" id="chk" type="button">Kontrol et</button><div id="cn"></div></div>`);
    let tries = 0;
    el.querySelector('#chk').onclick = () => {
      const picked = [...el.querySelectorAll('[data-i]')].map((b) => b.checked), wrong = CL.map((c, i) => c.ok !== picked[i]);
      el.querySelectorAll('label').forEach((l, i) => { l.style.color = wrong[i] ? 'var(--seal)' : ''; });
      const w = wrong.findIndex(Boolean);
      if (w >= 0) { tries++; N.sfx.bad(); return N.say(`Kırmızı olanlara bir daha bak. ${CL[w].why}`, 'bad'); }
      N.sfx.good(); N.splash({ x: 500, y: 300 }); N.addScore(tries ? 30 : 60, { x: 500, y: 200 }); el.querySelector('#chk').remove();
      el.querySelectorAll('input').forEach((b) => { b.disabled = true; });
      N.say('Tam bir kesir şampiyonu! Kesirleri <b>şeritle</b>, <b>yarımla</b> ve <b>sayı doğrusunda</b> karşılaştırdın. Gösterimler farklıysa hepsini aynı gösterime çevir.', 'good');
      nextBtn(el.querySelector('#cn'), 'Bitir →');
    };
  }

  /* ── başla ── */
  N.dots(STEPS.length, 0);
  st.view = (c) => drawLanes(c, LINES[0], { t: 0 });
  N.say('Ben <b>Nokta</b>. Arkadaşlarım kitap okuma yarışında! Herkes ne kadar okuduğunu başka türlü söylüyor: kesir, ondalık, yüzde, şekil… <em>Kim daha çok okudu?</em>');
  const el = N.panel(`<div class="card"><span class="label">Nasıl oynanır?</span>
    <p>Her turda önce <b>tahmin et</b>, sonra <b>dene</b>: şeritleri hizala, kartları kutulara ya da sayı doğrusuna sürükle. En sonda <b>gerekçelendir</b>.</p>
    <p class="small">Beş bölüm: Varsayım · Şerit karşılaştır · Yarıma göre · Sayı doğrusu · Önermeler. Kartları parmağınla ya da klavyeyle (ok tuşları + boşluk) sürükleyebilirsin.</p>
    <button class="btn primary big" id="go" type="button">Başla →</button></div>`);
  el.querySelector('#go').addEventListener('click', next);
  S.ask();

  if (/onizleme/.test(location.search)) { // ana sayfa görseli: hizalı şeritler + sayı doğrusunda dört kart
    const its = [{ kind: 'frac', n: 3, d: 4, v: .75 }, { kind: 'dec', h: 70, v: .7 }, { kind: 'pct', p: 72, v: .72 }, { kind: 'pie', n: 2, d: 3, v: 2 / 3 }].map((x, i) => ({ ...x, name: NAMES[i], col: NCOL[i] }));
    st.view = (c) => {
      drawStrip(c, SX, 40, SL, 56, 3, 4, { name: its[0].name }); drawStrip(c, SX, 112, SL, 56, 2, 3, { name: its[3].name });
      [.75, 2 / 3].forEach((v) => d.seg(c, { x: SX + SL * v, y: 32 }, { x: SX + SL * v, y: 178 }, { color: N.DEEP, w: 2.5, dash: [6, 6] }));
      drawNumLine(c, 0, 1, 0); drawTags(c, its, 0, 1, true); sortedExpr(c, its, false);
      d.text(c, 'Kim en çok okudu?', 500, 240, { size: 34, color: N.SEAL });
    };
    S.ask();
  }
})();
