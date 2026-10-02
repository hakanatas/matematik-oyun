/* Kesişme Dedektifi · MAT.5.3.4
   1) İki doğrunun durumu: paralel, kesişen, dik, çakışık.
   2) Açı bulmacası: ters açılar eş, doğru üstündeki komşu açılar bütünler, dik açıyı paylaşanlar tümler.
   3) Yap bakalım: doğruları çevirerek istenen açıları oluştur. */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640, O = { x: 500, y: 320 };
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));

  const KIND = ['Paralel', 'Kesişen', 'Dik', 'Çakışık'];
  const rounds = [
    ...g.shuffle([0, 1, 2, 3]).map((k) => ({ part: 'konum', k })),
    { part: 'bulmaca', n: 2 }, { part: 'bulmaca', n: 3 }, { part: 'bulmaca', n: 'tumler' },
    { part: 'yap', n: 2, goal: 'dort', say: 'İki doğruyu çevirerek <em>dört eş açı</em> oluştur.' },
    { part: 'yap', n: 3, goal: 'altiDar', say: 'Üç doğruyla <em>altı dar açı</em> oluşturabilir misin?' },
    { part: 'yap', n: 3, goal: 'ikiDik', say: 'Üç doğruyla <em>2 dik açı ve 4 dar açı</em> oluştur.' },
    { part: 'yap', n: 3, goal: 'ikiGenis', say: 'Üç doğruyla <em>2 geniş açı ve 4 dar açı</em> oluştur.' },
    { part: 'onerme' },
  ];
  N.max = 4 * 40 + 90 + 110 + 70 + 4 * 80 + 50;
  const st = { ri: -1, view: null, drag: -1, tries: 0 };

  /* ── yardımcılar ── */
  const sectors = (dirs) => { // doğru yönleri (derece) → ışın yönleri ve aradaki açılar
    const rays = []; dirs.forEach((t) => { rays.push(g.nd(t)); rays.push(g.nd(t + 180)); });
    rays.sort((a, b) => a - b);
    return rays.map((a, i) => ({ from: a, size: g.nd((rays[(i + 1) % rays.length] - a) || 360) }));
  };
  const linePts = (c, t, L = 2000) => [g.polar(c, -L, g.rad(t)), g.polar(c, L, g.rad(t))];
  const drawFull = (c, p, t, o = {}) => { const [a, b] = linePts(p, t); d.fullLine(c, a, b, W, H, { w: 3.4, ...o }); };
  const edgeLabel = (c, p, t, txt, side = 1, col = N.INK) => { // doğrunun tuval kenarına yakın etiketi
    const u = g.dir(g.rad(t)), q = g.add(p, g.mul(u, side * Math.min(g.exitT(p, g.mul(u, side), W, H) - 30, 420)));
    const n = { x: -u.y, y: u.x }; d.text(c, txt, q.x + n.x * 22, q.y + n.y * 22, { size: 34, color: col });
  };

  /* ── çizim ── */
  S.draw = (c) => { d.grid(c, W, H, 40); if (st.view) st.view(c); };

  /* ── 1. durumlar ── */
  function roundKonum(R) {
    const phi = g.rnd(-25, 25) + (Math.random() < .5 ? 0 : 90), ang = g.pick([g.rnd(35, 62), g.rnd(118, 145)]);
    const nrm = g.dir(g.rad(phi + 90));
    const L = { d: { p: O, t: phi }, e: { p: O, t: phi } };
    if (R.k === 0) { L.d.p = g.add(O, g.mul(nrm, 75)); L.e.p = g.sub(O, g.mul(nrm, 75)); }
    if (R.k === 1) L.e.t = phi + ang;
    if (R.k === 2) L.e.t = phi + 90;
    st.reveal = 0;
    st.view = (c) => {
      if (R.k === 3) { drawFull(c, L.d.p, L.d.t, { w: 6 }); drawFull(c, L.e.p, L.e.t, { w: 3, color: N.AMBER, dash: [16, 12] }); }
      else { drawFull(c, L.d.p, L.d.t); drawFull(c, L.e.p, L.e.t); }
      edgeLabel(c, L.d.p, L.d.t, 'd', -1); edgeLabel(c, L.e.p, L.e.t, 'e', 1, R.k === 3 ? N.DEEP : N.INK);
      const r = st.reveal; if (!r) return;
      c.globalAlpha = r;
      if (R.k === 0) for (const s of [-260, 0, 260]) { const a = g.add(L.d.p, g.mul(g.dir(g.rad(phi)), s)), b = g.add(L.e.p, g.mul(g.dir(g.rad(phi)), s)); d.seg(c, a, b, { color: N.DEEP, w: 2.5, dash: [6, 6] }); d.text(c, 'eşit', (a.x + b.x) / 2 + 34, (a.y + b.y) / 2, { size: 24, color: N.DEEP }); }
      if (R.k === 1) { d.arc(c, O, g.rad(phi), g.rad(phi + ang), 48, { fill: N.WASH }); const m = g.polar(O, 86, g.rad(phi + ang / 2)); d.text(c, `${ang}°`, m.x, m.y, { size: 30, color: N.DEEP }); }
      if (R.k === 2) d.right(c, O, g.dir(g.rad(phi)), g.dir(g.rad(phi + 90)), 26, { w: 3 });
      if (R.k === 3) d.text(c, 'tüm noktaları ortak', O.x, O.y - 50, { size: 30, color: N.DEEP });
      c.globalAlpha = 1;
    };
    S.ask();
    N.say('<b>d</b> ve <b>e</b> doğruları birbirine göre nasıl duruyor? Dedektif gözüyle bak.');
    const el = N.panel(`<div class="card"><span class="label">Tur ${st.ri + 1} · Doğruların durumu</span><div id="cb"></div><div id="cn"></div></div>`);
    const WHY = [
      '<b>Paralel</b>: hiç ortak noktaları yok, aralarındaki uzaklık her yerde aynı. Açı oluşturmazlar.',
      '<b>Kesişen</b>: yalnız bir ortak noktaları var ve açı oluşturuyorlar.',
      '<b>Dik</b>: kesişiyorlar ve aralarındaki açı 90°. Gösterimi: d ⟂ e.',
      '<b>Çakışık</b>: üst üste binmişler, tüm noktaları ortak.',
    ];
    N.choices(el.querySelector('#cb'), KIND.map((t, i) => ({ t, i, ok: i === R.k })), (o, b, first) => {
      if (!o.ok) {
        N.sfx.bad();
        N.say(R.k === 2 && o.i === 1 ? 'Kesişiyorlar, doğru! Ama bunların <b>daha özel</b> bir adı var. Aradaki açıya iyi bak.' : `Hmm, ${o.t.toLowerCase()} değil. ${o.i === 0 ? 'Paralel doğrular hiç kesişmez.' : o.i === 3 ? 'Çakışık doğrular üst üste biner.' : o.i === 2 ? 'Dik doğrular 90° yapar.' : 'Kesişen doğruların tek ortak noktası olur.'}`, 'bad');
        return;
      }
      N.sfx.good(); if (first) N.addScore(40, O); N.say(WHY[R.k], 'good');
      N.tween(600, (t) => { st.reveal = t; S.ask(); });
      nextBtn(el.querySelector('#cn'));
    });
  }

  /* ── 2. açı bulmacası ── */
  function roundPuzzle(R) {
    const base = g.rnd(5, 35);
    let dirs, known, names, ask;
    if (R.n === 2) {
      const x = g.pick([g.rnd(36, 74), g.rnd(106, 144)]); dirs = [base, base + x];
      names = ['1', '2', '3', '4']; known = { 0: true };
      ask = { q: '∠1 ile ∠3 nasıl açılardır?', o: ['Ters açılar', 'Komşu bütünler', 'Tümler açılar'], ok: 0, why: 'Ters açılar: kolları birbirinin uzantısı. <em>Ters açıların ölçüleri eşittir.</em> ∠1 ile ∠2 ise komşu bütünler: toplamları 180°.' };
    } else if (R.n === 3) {
      let p, q; do { p = g.rnd(32, 80); q = g.rnd(32, 80); } while (180 - p - q < 30);
      dirs = [base, base + p, base + p + q]; names = ['1', '2', '3', '4', '5', '6']; known = { 0: true, 1: true };
      ask = { q: '∠1 + ∠2 + ∠3 kaç derecedir?', o: ['90°', '180°', '360°'], ok: 1, why: 'Üçü yan yana bir <b>doğru açı</b> oluşturuyor: toplamları 180°. Hepsi birlikte ise tam açı: 360°.' };
    } else {
      const x = g.rnd(22, 68); dirs = [base, base + 90]; st.extraRay = base + x;
      names = ['a', 'b', 'c', '']; known = { 0: true };
      ask = { q: 'd ⟂ e. <b>∠a</b> ile <b>∠b</b> nasıl açılardır?', o: ['Komşu tümler', 'Komşu bütünler', 'Ters açılar'], ok: 0, why: 'Ortak kolları var ve birlikte bir dik açı oluşturuyorlar: toplamları 90°. Bunlar <b>komşu tümler</b> açılar.' };
    }
    let secs = sectors(dirs);
    if (R.n === 'tumler') { const x = g.nd(st.extraRay - base); secs = [{ from: base, size: x }, { from: base + x, size: 90 - x }, { from: base + 90, size: 90 }, { from: base + 180, size: 180 }]; }
    const sec0 = secs.findIndex((s) => Math.abs(g.nd(s.from - base)) < .01 || Math.abs(g.nd(s.from - base) - 360) < .01);
    const order = secs.slice(sec0).concat(secs.slice(0, sec0)).map((s) => ({ ...s, size: Math.round(s.size) }));
    const slots = order.map((s, i) => ({ ...s, name: names[i], known: !!known[i], val: known[i] ? s.size : null, state: known[i] ? 'given' : '' })).filter((s) => s.name);
    st.view = (c) => {
      dirs.forEach((t, i) => { drawFull(c, O, t); edgeLabel(c, O, t, R.n === 'tumler' ? 'de'[i] : 'def'[i], 1); });
      if (R.n === 'tumler') { d.ray(c, O, g.polar(O, 260, g.rad(st.extraRay)), { w: 3.4, ext: 20 }); d.right(c, O, g.dir(g.rad(base + 90)), g.dir(g.rad(base + 180)), 24, { w: 3 }); }
      slots.forEach((s, i) => {
        const r = s.size < 40 ? 125 : 96, m = g.polar(O, r, g.rad(s.from + s.size / 2));
        if (s.name !== 'c' || R.n !== 'tumler') d.arc(c, O, g.rad(s.from), g.rad(s.from + s.size), 36 + (i % 2) * 8, { fill: s.known ? N.WASH : 'rgba(23,20,17,.04)', color: s.known ? N.AMBER : N.FAINT, w: 2.5 });
        const label = s.val != null ? `${s.val}°` : '?';
        d.text(c, `∠${s.name}`, m.x, m.y - 17, { size: 22, color: N.SOFT, font: N.SERIF });
        d.text(c, label, m.x, m.y + 12, { size: 32, color: s.state === 'no' ? N.SEAL : s.known ? N.DEEP : N.INK });
      });
      d.dot(c, O, { r: 6 });
    };
    S.ask();
    const given = slots.filter((s) => s.known).map((s) => `m(∠${s.name}) = ${s.size}°`).join(', ');
    N.say(`${R.n === 'tumler' ? '<b>d ⟂ e</b>. ' : ''}Bilinen: <em>${given}</em>. Ölçmeden, sadece doğruların özellikleriyle diğer açıları bul!`);
    const unknown = slots.filter((s) => !s.known);
    const el = N.panel(`<div class="card"><span class="label">Tur ${st.ri + 1} · Açı bulmacası</span>
      ${unknown.map((s) => `<div class="row" style="margin-bottom:6px"><span style="font-family:var(--brush);font-size:28px;width:58px">∠${s.name} =</span><input class="num-in" data-s="${s.name}" inputmode="numeric" aria-label="∠${s.name} kaç derece"><span class="big-read" style="font-size:30px">°</span></div>`).join('')}
      <button class="btn primary big" id="chk" type="button" style="margin-top:6px">Kontrol et</button><div id="cn"></div></div>`);
    let tries = 0;
    const check = () => {
      let allOk = true, pts = 0;
      el.querySelectorAll('[data-s]').forEach((inp) => {
        const s = slots.find((x) => x.name === inp.dataset.s), v = N.num(inp.value);
        inp.classList.remove('ok', 'no'); void inp.offsetWidth;
        if (v === s.size) { if (s.state !== 'ok') { s.state = 'ok'; s.val = s.size; pts += tries === 0 ? 20 : 10; } inp.classList.add('ok'); inp.disabled = true; }
        else { allOk = false; s.state = 'no'; s.val = v == null ? null : v; inp.classList.add('no'); }
      });
      tries++; S.ask(); if (pts) N.addScore(pts, O);
      if (!allOk) {
        N.sfx.bad();
        N.say(R.n === 'tumler' ? 'İpucu: ∠a ile ∠b birlikte <b>90°</b> (dik açı) yapıyor; ∠c ise d ile e arasındaki açı.' : 'İpucu: <b>ters açılar eşittir</b>; bir doğrunun üstünde yan yana duran açıların toplamı <b>180°</b>.', 'bad');
        return;
      }
      N.sfx.good(); N.splash(O); el.querySelector('#chk').remove();
      N.say(`Hepsi doğru! Şimdi bir soru: ${ask.q}`, 'good');
      const box = el.querySelector('#cn'); box.innerHTML = '<span class="label" style="margin-top:10px">Adını koy</span><div id="nb"></div><div id="nn"></div>';
      N.choices(box.querySelector('#nb'), ask.o.map((t, k) => ({ t, ok: k === ask.ok })), (o, b, first) => {
        if (!o.ok) { N.sfx.bad(); return; }
        N.sfx.good(); if (first) N.addScore(30, O); N.say(ask.why, 'good'); nextBtn(box.querySelector('#nn'));
      }, 'one');
    };
    el.querySelector('#chk').addEventListener('click', check);
    el.querySelectorAll('[data-s]').forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); }));
  }

  /* ── 3. yap bakalım ── */
  const GOALS = {
    dort: (c) => c.dik === 4,
    altiDar: (c) => c.dar === 6,
    ikiDik: (c) => c.dik === 2 && c.dar === 4,
    ikiGenis: (c) => c.genis === 2 && c.dar === 4,
  };
  function roundBuild(R) {
    const starts = { dort: [15, 70], altiDar: [10, 40, 130], ikiDik: [20, 75, 150], ikiGenis: [5, 70, 115] };
    const dirs = starts[R.goal].slice(); st.dirs = dirs; st.done = false; st.tries = 0;
    const count = () => { const s = sectors(dirs).map((x) => Math.round(x.size)); return { s, dar: s.filter((a) => a > 0 && a < 90).length, dik: s.filter((a) => a === 90).length, genis: s.filter((a) => a > 90 && a < 180).length, zero: s.some((a) => a === 0) }; };
    st.view = (c) => {
      const cnt = count();
      sectors(dirs).forEach((s) => {
        const sz = Math.round(s.size); if (!sz) return;
        const col = sz === 90 ? N.DEEP : sz < 90 ? N.AMBER : N.SEAL;
        if (sz === 90) d.right(c, O, g.dir(g.rad(s.from)), g.dir(g.rad(s.from + 90)), 26, { color: N.DEEP, w: 3 });
        else d.arc(c, O, g.rad(s.from), g.rad(s.from + s.size), 52, { fill: sz < 90 ? N.WASH : 'rgba(196,67,43,.08)', color: col, w: 2.5 });
        const m = g.polar(O, sz < 30 ? 140 : 100, g.rad(s.from + s.size / 2)); d.text(c, `${sz}°`, m.x, m.y, { size: 30, color: sz > 90 ? N.SEAL : N.DEEP });
      });
      dirs.forEach((t, i) => {
        drawFull(c, O, t, { w: 3.4 });
        const h = g.polar(O, 250, g.rad(t)), hot = st.drag === i || st.hot === i;
        d.dot(c, h, { r: hot ? 14 : 11, color: N.INK, ring: hot ? N.AMBER : null });
        d.text(c, 'def'[i], h.x + 26, h.y - 22, { size: 32 });
      });
      d.dot(c, O, { r: 6, label: 'O', lx: -18, ly: 22 });
      const box = N.$('#cnt'); if (box) box.innerHTML = `dar: <b>${cnt.dar}</b> · dik: <b>${cnt.dik}</b> · geniş: <b>${cnt.genis}</b>${cnt.zero ? ' · <b style="color:var(--seal)">çakışık doğru var!</b>' : ''}`;
    };
    S.ask();
    N.say(`${R.say} Siyah tutamaçları sürükleyerek doğruları <b>O</b> etrafında çevir.`);
    const el = N.panel(`<div class="card"><span class="label">Tur ${st.ri + 1} · Yap bakalım</span><p id="cnt" class="small" style="font-size:16px"></p>
      <p class="small">Kehribar yay: dar açı · köşe işareti: dik açı · kırmızı yay: geniş açı</p><div id="cn"></div></div>`);
    S.ask();
    st.onRelease = () => {
      if (st.done) return; const cnt = count();
      if (!cnt.zero && GOALS[R.goal](cnt)) {
        st.done = true; N.sfx.good(); N.addScore(80, O); N.splash(O);
        const msg = { dort: 'Dört eş açı: hepsi <b>90°</b>! Bu doğrular <b>dik</b> kesişiyor. Ters açılar yine eş, değil mi?', altiDar: 'Altı dar açı! Üç doğru aynı noktada kesişince hepsi dar olabiliyor.', ikiDik: '2 dik, 4 dar: dik açıyı bölen doğru iki tümler açı yarattı.', ikiGenis: '2 geniş, 4 dar! Geniş açılar da birbirinin <b>ters açısı</b>, ölçüleri eşit.' }[R.goal];
        N.say(msg, 'good'); nextBtn(el.querySelector('#cn'));
      }
    };
  }
  const handleAt = (p) => { if (!st.dirs) return -1; let best = -1, bd = S.hit(34); st.dirs.forEach((t, i) => { for (const s of [1, -1]) { const h = g.polar(O, 250 * s, g.rad(t)), dd = g.dist(p, h); if (dd < bd) { bd = dd; best = i; } } }); return best; };
  S.onDown = (p) => { if (rounds[st.ri] && rounds[st.ri].part === 'yap' && !st.done) { st.drag = handleAt(p); if (st.drag >= 0) S.cursor('grabbing'); } };
  S.onMove = (p) => {
    if (!p) return;
    if (st.drag >= 0 && st.dirs) {
      let t = Math.round(g.nd(g.deg(g.ang(O, p)))) % 180;
      for (let j = 0; j < st.dirs.length; j++) if (j !== st.drag) { // dik olmaya mıknatıs
        const df = g.nd(t - st.dirs[j]) % 180; if (Math.abs(df - 90) <= 2) t = g.nd(st.dirs[j] + 90) % 180;
      }
      if (t !== st.dirs[st.drag]) N.sfx.tick(); st.dirs[st.drag] = t; S.ask();
    } else if (st.dirs && rounds[st.ri] && rounds[st.ri].part === 'yap') { const h = handleAt(p); if (h !== st.hot) { st.hot = h; S.ask(); } S.cursor(h >= 0 ? 'grab' : 'default'); }
  };
  S.onUp = () => { if (st.drag >= 0) { st.drag = -1; S.cursor('default'); S.ask(); st.onRelease && st.onRelease(); } };

  /* ── 4. önerme ── */
  function roundClaim() {
    st.dirs = null;
    st.view = (c) => { drawFull(c, O, 20); drawFull(c, O, 80); drawFull(c, O, 140); d.dot(c, O, { r: 6 }); };
    S.ask();
    N.say('Son soru, dedektif. Gördüklerinden hangisi <em>her zaman</em> doğrudur?');
    const el = N.panel(`<div class="card"><span class="label">Önerme</span><div id="cb"></div><div id="cn"></div></div>`);
    N.choices(el.querySelector('#cb'), [
      { t: 'Ters açıların ölçüleri eşittir.', ok: true },
      { t: 'Kesişen iki doğru hep dört dik açı oluşturur.' },
      { t: 'Üç doğru aynı noktada kesişirse mutlaka bir geniş açı oluşur.' },
      { t: 'Paralel doğrular bir yerde mutlaka kesişir.' },
    ], (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say('Bunu çürütecek bir örnek gördük! Yap-bakalım turlarını hatırla.', 'bad'); return; }
      N.sfx.good(); if (first) N.addScore(50, O); N.say('Evet! Hangi doğruları çizersen çiz, <b>ters açılar eşittir</b>. Diğerlerinin hepsine karşı örnek bulduk.', 'good');
      nextBtn(el.querySelector('#cn'));
    }, 'one');
  }

  /* ── akış ── */
  function nextBtn(host) {
    host.innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">${st.ri === rounds.length - 1 ? 'Bitir →' : 'Sonraki tur →'}</button>`;
    const b = host.querySelector('button'); b.addEventListener('click', next); b.focus();
  }
  function next() {
    st.ri++; st.dirs = null; st.onRelease = null; st.hot = -1; N.dots(rounds.length, st.ri);
    if (st.ri >= rounds.length) return N.finish({ id: 'kesisme-dedektifi', title: 'Usta Dedektif!', film: 'dogrular-kesisince', text: 'Ters açılar eş; bir doğrunun üstündeki komşu açılar bütünler; dik açıyı paylaşanlar tümler. Sıradaki oyun: <b>Şekli Kapat</b>.' });
    const R = rounds[st.ri];
    if (R.part === 'konum') return roundKonum(R);
    if (R.part === 'bulmaca') return roundPuzzle(R);
    if (R.part === 'yap') return roundBuild(R);
    return roundClaim();
  }

  N.dots(rounds.length, 0);
  st.view = (c) => { drawFull(c, O, 25); drawFull(c, O, 105); d.dot(c, O, { r: 6 }); d.text(c, '?', 560, 240, { size: 60, color: N.DEEP }); };
  N.say('Ben <b>Nokta</b>. Düzlemde doğrular buluşunca açılar doğuyor ve aralarında gizli ilişkiler var. Dedektif olmaya hazır mısın?');
  const el = N.panel(`<div class="card"><span class="label">Üç bölüm</span>
    <p><b>1.</b> Doğruların durumu &nbsp; <b>2.</b> Açı bulmacası &nbsp; <b>3.</b> Yap bakalım</p>
    <p class="small">Önce tahmin et, sonra gerekçeni sına. Her bölüm bir öncekinin ipucunu taşıyor.</p>
    <button class="btn primary big" id="go" type="button">Soruşturmayı başlat →</button></div>`);
  el.querySelector('#go').addEventListener('click', next);
  S.ask();

  if (/onizleme/.test(location.search)) { st.ri = 9; st.dirs = null; roundBuild({ goal: 'ikiGenis', say: '' }); st.dirs.splice(0, 3, 10, 40, 70); S.ask(); }
})();
