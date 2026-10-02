/* Açı Avcısı · MAT.5.3.3
   Tahmin et → açıölçeri köşeye oturt, sıfır çizgisini bir kola hizala → oku → açıyı sınıflandır.
   Sonra açıölçerle verilen ölçüde ve verilen açıya eş açı kur. */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640, PR = 190;
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));

  /* ── turlar ── */
  const pickDeg = (lo, hi) => { let v; do { v = g.rnd(lo, hi); } while (v % 10 === 0); return v; };
  const ROUNDS = [
    ...g.shuffle([pickDeg(18, 38), 90, pickDeg(112, 138), pickDeg(52, 78), pickDeg(142, 168)]).map((deg) => ({ type: 'olc', deg })),
    { type: 'kur', deg: g.pick([35, 45, 65, 70, 115, 125, 140]) },
    { type: 'es', deg: pickDeg(38, 142) },
    { type: 'quiz' },
  ];
  N.max = 5 * 170 + 2 * 100 + 3 * 30;

  const st = { ri: -1, phase: 'intro', fig: null, ref: null, prot: null, drag: null, guess: 90, tries: 0 };

  /* ── açıölçer ── */
  const protHome = () => ({ c: { x: 790, y: 590 }, rot: 0, show: true, snapC: false, snapR: false });
  const toLocal = (p) => { const P = st.prot, dx = p.x - P.c.x, dy = p.y - P.c.y, cr = Math.cos(P.rot), sr = Math.sin(P.rot); return { x: dx * cr - dy * sr, y: dx * sr + dy * cr }; };
  const knobLocal = { x: 0, y: -PR - 28 };

  function drawProt(c) {
    const P = st.prot; if (!P || !P.show) return;
    c.save(); c.translate(P.c.x, P.c.y); c.rotate(-P.rot);
    // gövde
    c.beginPath(); c.moveTo(PR + 12, 0); c.arc(0, 0, PR, 0, -Math.PI, true); c.lineTo(-PR - 12, 0); c.lineTo(-PR - 12, 20); c.lineTo(PR + 12, 20); c.closePath();
    c.fillStyle = 'rgba(255,250,236,.62)'; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.arc(0, 0, PR - 62, 0, -Math.PI, true); c.strokeStyle = 'rgba(184,116,26,.35)'; c.lineWidth = 1; c.stroke();
    // çentikler
    for (let i = 0; i <= 180; i++) {
      const t = g.rad(i), L = i % 10 === 0 ? 18 : i % 5 === 0 ? 12 : 6, cs = Math.cos(t), sn = -Math.sin(t);
      c.beginPath(); c.moveTo(cs * PR, sn * PR); c.lineTo(cs * (PR - L), sn * (PR - L));
      c.strokeStyle = N.DEEP; c.lineWidth = i % 10 === 0 ? 1.8 : 1; c.stroke();
    }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 0; i <= 180; i += 10) {
      const t = g.rad(i), cs = Math.cos(t), sn = -Math.sin(t);
      c.save(); c.translate(cs * (PR - 31), sn * (PR - 31)); c.rotate(Math.PI / 2 - t);
      c.font = `600 14px ${N.MONO}`; c.fillStyle = N.DEEP; c.fillText(String(i), 0, 0); c.restore();
      c.save(); c.translate(cs * (PR - 50), sn * (PR - 50)); c.rotate(Math.PI / 2 - t);
      c.font = `500 11.5px ${N.MONO}`; c.fillStyle = 'rgba(23,20,17,.62)'; c.fillText(String(180 - i), 0, 0); c.restore();
    }
    // taban çizgisi ve merkez
    c.beginPath(); c.moveTo(-PR, 0); c.lineTo(PR, 0); c.strokeStyle = N.INK; c.lineWidth = 1.2; c.stroke();
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -16); c.stroke();
    c.beginPath(); c.arc(0, 0, 5, 0, Math.PI * 2); c.strokeStyle = P.snapC ? N.DEEP : N.INK; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.arc(0, 0, 1.8, 0, Math.PI * 2); c.fillStyle = N.SEAL; c.fill();
    // çevirme tutamacı
    c.beginPath(); c.moveTo(0, -PR); c.lineTo(0, knobLocal.y + 14); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.arc(knobLocal.x, knobLocal.y, 15, 0, Math.PI * 2); c.fillStyle = st.drag === 'rot' ? N.AMBER : N.INK; c.fill();
    c.beginPath(); c.arc(knobLocal.x, knobLocal.y, 7.5, -2.6, .9); c.strokeStyle = N.SHEET; c.lineWidth = 2.2; c.stroke();
    c.beginPath(); c.moveTo(knobLocal.x + 6.8, knobLocal.y - 3.5 + 7); c.lineTo(knobLocal.x + 4.6, knobLocal.y + 6.5); c.lineTo(knobLocal.x + 9, knobLocal.y + 3.4); c.stroke();
    c.restore();
    if (P.snapR) { // hizalama ışığı
      const u = g.dir(P.rot); d.seg(c, g.sub(P.c, g.mul(u, PR + 40)), g.add(P.c, g.mul(u, PR + 40)), { color: N.AMBER, w: 2, alpha: .7, dash: [4, 6] });
    }
  }

  /* ── açı figürleri ── */
  const mk = (v, a1, deg, len, labels) => ({ v, a1, a2: a1 + g.rad(deg), len, labels, deg });
  function drawFig(c, F, opt = {}) {
    if (!F) return;
    const p1 = g.polar(F.v, F.len, F.a1), p2 = g.polar(F.v, F.len, F.a2);
    const deg = Math.round(g.angleAt(p1, F.v, p2));
    const A = Math.abs(deg - 90) < .5;
    if (A) d.right(c, F.v, g.sub(p1, F.v), g.sub(p2, F.v), 26, { color: N.AMBER, w: 3 });
    else d.arc(c, F.v, ccwStart(F), ccwStart(F) + g.rad(deg), 34, { fill: N.WASH });
    d.ray(c, F.v, p1, { w: 3.6, ext: 40 }); d.ray(c, F.v, p2, { w: 3.6, ext: 40, color: opt.moveColor || N.INK });
    const [la, lb, lc] = F.labels;
    d.dot(c, p1, { r: 6, label: la, ...lab(F.v, p1) }); d.dot(c, F.v, { r: 6.5, label: lb, ...lab(g.add(F.v, g.dir(mid(F))), F.v) });
    d.dot(c, p2, { r: opt.handle ? 11 : 6, color: opt.handle ? N.DEEP : N.INK, ring: opt.handle && opt.hot ? N.AMBER : null, label: lc, ...lab(F.v, p2) });
  }
  // iç açının saat yönü tersindeki başlangıç kolu
  const ccwStart = (F) => { const s = g.nd(g.deg(F.a2 - F.a1)); return s <= 180 ? F.a1 : F.a2; };
  const mid = (F) => { const p1 = g.polar(F.v, 10, F.a1), p2 = g.polar(F.v, 10, F.a2); return ccwStart(F) + g.rad(g.angleAt(p1, F.v, p2)) / 2; };
  const lab = (from, p) => { const u = g.unit(g.sub(p, from)); return { lx: u.x * 22 + (Math.abs(u.y) > .7 ? 14 : 0), ly: u.y * 22 }; };

  S.draw = (c) => {
    d.grid(c, W, H, 40);
    drawFig(c, st.ref);
    drawFig(c, st.fig, st.build ? { handle: true, hot: st.drag === 'arm' || st.hotArm, moveColor: N.DEEP } : {});
    drawProt(c);
    if (st.show != null && st.fig) { // sonucu göster
      const F = st.fig, u = g.dir(mid(F)); d.text(c, `${st.show}°`, F.v.x + u.x * 82, F.v.y + u.y * 82, { size: 40, color: N.DEEP });
    }
  };

  /* ── sürükleme ── */
  const armEnd = () => g.polar(st.fig.v, st.fig.len, st.fig.a2);
  S.onDown = (p) => {
    if (!st.prot || !st.prot.show || st.phase === 'wait') return;
    const L = toLocal(p);
    if (g.dist(L, knobLocal) < S.hit(26)) { st.drag = 'rot'; st.grab = g.ang(st.prot.c, p) - st.prot.rot; S.cursor('grabbing'); return; }
    if (st.build && g.dist(p, armEnd()) < S.hit(30)) { st.drag = 'arm'; S.cursor('grabbing'); return; }
    const inArc = L.y <= 0 && Math.hypot(L.x, L.y) <= PR + 4, inBase = L.y >= 0 && L.y <= 22 && Math.abs(L.x) <= PR + 14;
    if (inArc || inBase) { st.drag = 'move'; st.off = g.sub(st.prot.c, p); S.cursor('grabbing'); return; }
    if (st.build && g.dist(p, st.fig.v) > 60) { st.drag = 'arm'; moveArm(p); }
  };
  S.onMove = (p) => {
    if (!p) { st.hotArm = false; S.ask(); return; }
    const P = st.prot;
    if (st.drag === 'move') {
      let c = g.add(p, st.off); c.x = Math.max(0, Math.min(W, c.x)); c.y = Math.max(0, Math.min(H, c.y));
      const target = nearVertex(c); P.snapC = !!target; if (target) { if (!st.wasC) N.sfx.snap(); c = { ...target }; } st.wasC = !!target;
      P.c = c; checkRot(false);
    } else if (st.drag === 'rot') { P.rot = g.ang(P.c, p) - st.grab; checkRot(true); }
    else if (st.drag === 'arm') moveArm(p);
    else if (P && P.show) {
      const L = toLocal(p), onKnob = g.dist(L, knobLocal) < S.hit(26), onBody = (L.y <= 0 && Math.hypot(L.x, L.y) <= PR) || (L.y >= 0 && L.y <= 22 && Math.abs(L.x) <= PR + 14);
      st.hotArm = st.build && g.dist(p, armEnd()) < S.hit(30);
      S.cursor(onKnob ? 'grab' : st.hotArm ? 'grab' : onBody ? 'move' : 'default');
    }
    S.ask();
  };
  S.onUp = () => { st.drag = null; S.cursor('default'); S.ask(); };

  const figs = () => [st.fig, st.ref].filter(Boolean);
  const nearVertex = (c) => { for (const F of figs()) if (g.dist(c, F.v) < 16) return F.v; return null; };
  function checkRot(sound) {
    const P = st.prot; P.snapR = false;
    if (!P.snapC) return;
    const F = figs().find((f) => g.dist(f.v, P.c) < .5); if (!F) return;
    for (const a of [F.a1, F.a2]) for (const k of [0, Math.PI]) {
      let df = g.nd(g.deg(P.rot - a - k)); if (df > 180) df -= 360;
      if (Math.abs(df) < 2.5) { P.rot = a + k; P.snapR = true; }
    }
    if (P.snapR && !st.wasR && sound) N.sfx.snap(); st.wasR = P.snapR;
  }
  function moveArm(p) {
    const F = st.fig; let a = g.deg(g.ang(F.v, p)); a = Math.round(a);
    const prev = Math.round(g.deg(F.a2)); F.a2 = g.rad(a); if (prev !== a) N.sfx.tick();
  }
  const rotateBy = (deg) => { if (!st.prot) return; st.prot.rot += g.rad(deg); checkRot(true); S.ask(); };
  const nudge = (dx, dy) => { const P = st.prot; if (!P) return; P.c = { x: P.c.x + dx, y: P.c.y + dy }; const t = nearVertex(P.c); P.snapC = !!t; if (t) P.c = { ...t }; checkRot(false); S.ask(); };

  /* ── tur akışı ── */
  function next() {
    st.ri++; st.tries = 0; st.show = null; st.build = false; st.ref = null; st.fig = null; st.prot = null;
    N.dots(ROUNDS.length, st.ri);
    if (st.ri >= ROUNDS.length) return N.finish({ id: 'aci-avcisi', title: 'Açı Avcısı!', film: 'kac-derece', text: 'Açıölçerin merkezi köşeye, sıfır çizgisi bir kola; sonra sıfırdan başlayan ölçeği oku. Sıradaki oyun: <b>Kesişme Dedektifi</b>.' });
    const R = ROUNDS[st.ri];
    if (R.type === 'olc') return roundMeasure(R);
    if (R.type === 'kur') return roundBuild(R);
    if (R.type === 'es') return roundCopy(R);
    return roundQuiz();
  }

  const names = [['A', 'B', 'C'], ['K', 'L', 'M'], ['P', 'R', 'S'], ['X', 'Y', 'Z'], ['D', 'E', 'F']];
  function roundMeasure(R) {
    const a1 = g.rad(g.rnd(0, 359)), nm = names[st.ri % names.length];
    st.fig = mk({ x: 400, y: 330 }, a1, R.deg, 235, nm); st.phase = 'tahmin'; S.ask();
    N.say(`<b>m(${nm.join('')})</b> kaç derece? Önce <em>ölçmeden tahmin et</em>. Yakın tahmin bonus puan getirir!`);
    const el = N.panel(`<div class="card"><span class="label">Tur ${st.ri + 1} · Tahmin</span>
      <div class="big-read" id="gv">${st.guess}<small>°</small></div>
      <input type="range" min="0" max="180" step="1" value="${st.guess}" id="gr" aria-label="Tahmin (derece)">
      <div class="row small" style="justify-content:space-between"><span>0°</span><span>90°</span><span>180°</span></div>
      <button class="btn primary big" id="gok" type="button" style="margin-top:10px">Tahminim bu →</button></div>`);
    const r = el.querySelector('#gr'); r.addEventListener('input', () => { st.guess = +r.value; el.querySelector('#gv').innerHTML = `${r.value}<small>°</small>`; });
    el.querySelector('#gok').addEventListener('click', () => startMeasure(R, nm));
  }

  function startMeasure(R, nm) {
    st.phase = 'olc'; st.prot = protHome(); S.ask();
    N.say(`Tahminin <b>${st.guess}°</b>. Şimdi ölç: açıölçerin <em>merkezini ${nm[1]} köşesine</em> sürükle, siyah tutamaktan çevirip <em>sıfır çizgisini bir kola</em> oturt.`);
    measurePanel('Tur ' + (st.ri + 1) + ' · Ölç', (v) => {
      const ok = Math.abs(v - R.deg) <= 1;
      if (ok) {
        const pts = st.tries === 0 ? 100 : st.tries === 1 ? 60 : 30, bonus = Math.max(0, 50 - 2 * Math.abs(st.guess - R.deg));
        N.sfx.good(); N.addScore(pts + bonus, st.fig.v); st.show = R.deg; S.ask(); N.splash(st.fig.v);
        N.say(`Evet, <b>${R.deg}°</b>! Tahminin ${st.guess}° idi: ${Math.abs(st.guess - R.deg)}° fark${bonus ? `, <em>+${bonus} tahmin bonusu</em>` : ''}.`, 'good');
        return classify(R);
      }
      st.tries++; N.sfx.bad(); N.addScore(0);
      if (Math.abs(v - (180 - R.deg)) <= 1) N.say('Dikkat, <b>öbür ölçeği</b> okudun! Kolun üstündeki <em>0</em>’dan başlayan ölçeği takip et.', 'bad');
      else if (!st.prot.snapC) N.say('Önce açıölçerin <b>merkezi</b> tam köşede olmalı. Yaklaşınca kendiliğinden oturur.', 'bad');
      else if (!st.prot.snapR) N.say('Merkez yerinde. Şimdi tutamaktan çevir: <b>sıfır çizgisi</b> bir kolun üstüne gelsin.', 'bad');
      else N.say('Az kaldı! Diğer kolun açıölçerin kenarını kestiği yere bak ve <b>sıfırdan başlayan</b> ölçeği say.', 'bad');
      if (st.tries >= 3) { st.show = R.deg; S.ask(); N.say(`Bu sefer olmadı: açı <b>${R.deg}°</b>. Açıölçerin nasıl durduğuna bak, sonraki turda yaparsın!`, 'bad'); classify(R); }
      return false;
    });
  }

  function measurePanel(label, onCheck, build) {
    const el = N.panel(`<div class="card"><span class="label">${label}</span>
      ${build ? '' : `<div class="row"><input class="num-in" id="mv" inputmode="numeric" placeholder="?" aria-label="Ölçtüğün açı (derece)"><span class="big-read" style="font-size:34px">°</span>
      <button class="btn primary" id="mok" type="button">Kontrol et</button></div>`}
      ${build ? '<button class="btn primary big" id="mok" type="button">Açım hazır, kontrol et</button>' : ''}
      </div>
      <div class="card"><span class="label">Açıölçer</span>
      <div class="row"><button class="btn" data-r="1" type="button" title="Saat yönünün tersine 1°">↺ 1°</button><button class="btn" data-r="-1" type="button" title="Saat yönünde 1°">↻ 1°</button>
      <button class="btn" data-r="10" type="button">↺ 10°</button><button class="btn" data-r="-10" type="button">↻ 10°</button></div>
      <div class="row" style="margin-top:8px"><button class="btn" data-n="0,-4" type="button" aria-label="yukarı">↑</button><button class="btn" data-n="0,4" type="button" aria-label="aşağı">↓</button><button class="btn" data-n="-4,0" type="button" aria-label="sola">←</button><button class="btn" data-n="4,0" type="button" aria-label="sağa">→</button>
      <button class="btn" id="home" type="button">Kenara al</button></div>
      <p class="small" style="margin:8px 0 0">Gövdeden tut: taşı. Siyah tutamaktan tut: çevir. Köşeye ve kola yaklaşınca kendiliğinden oturur.</p></div>`);
    el.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => rotateBy(+b.dataset.r)));
    el.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => { const [x, y] = b.dataset.n.split(',').map(Number); nudge(x, y); }));
    el.querySelector('#home').addEventListener('click', () => { st.prot = protHome(); S.ask(); });
    const inp = el.querySelector('#mv'), go = el.querySelector('#mok');
    const run = () => {
      if (build) return onCheck();
      const v = N.num(inp.value); if (v == null) { inp.focus(); return; }
      const r = onCheck(v); inp.classList.remove('ok', 'no'); void inp.offsetWidth; inp.classList.add(r === false ? 'no' : 'ok');
    };
    go.addEventListener('click', run); if (inp) inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); });
  }

  function classify(R) {
    st.phase = 'wait';
    const kind = R.deg < 90 ? 0 : R.deg === 90 ? 1 : 2;
    const el = N.panel(`<div class="card"><span class="label">Bu açı hangisi?</span><div id="cb"></div><div id="cn"></div></div>`);
    const why = ['Dar açı 90°’den küçüktür.', 'Dik açı tam 90°’dir.', 'Geniş açı 90° ile 180° arasındadır.'];
    N.choices(el.querySelector('#cb'), ['Dar açı', 'Dik açı', 'Geniş açı'].map((t, i) => ({ t, i, ok: i === kind })), (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say(`${why[o.i]} Bu açı ${R.deg}°. Bir daha bak.`, 'bad'); return; }
      N.sfx.good(); if (first) N.addScore(20, { x: 160, y: 80 });
      N.say(`${R.deg}° ${['90°’den küçük: <b>dar açı</b>.', 'tam 90°: <b>dik açı</b>.', '90° ile 180° arasında: <b>geniş açı</b>.'][kind]}`, 'good');
      nextBtn(el.querySelector('#cn'));
    }, 'three');
  }
  function nextBtn(host) {
    host.innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">${st.ri === ROUNDS.length - 1 ? 'Bitir →' : 'Sonraki tur →'}</button>`;
    const b = host.querySelector('button'); b.addEventListener('click', next); b.focus();
  }

  function roundBuild(R) {
    st.build = true; st.phase = 'kur';
    st.fig = mk({ x: 380, y: 360 }, 0, 100, 230, ['D', 'E', 'F']); st.prot = protHome(); S.ask();
    N.say(`Şimdi tersine: <em>m(DEF) = ${R.deg}°</em> olan bir açı kur. [ED sabit; <b>F</b>’yi sürükleyerek [EF’yi çevir. Açıölçerle kontrol etmeyi unutma!`);
    measurePanel(`Tur ${st.ri + 1} · Açı kur`, () => checkBuild(R.deg), true);
  }
  function roundCopy(R) {
    st.build = true; st.phase = 'kur';
    st.ref = mk({ x: 215, y: 360 }, g.rad(g.rnd(10, 40)), R.deg, 165, ['K', 'L', 'M']);
    st.fig = mk({ x: 560, y: 380 }, 0, 60, 210, ['D', 'E', 'F']); st.prot = protHome(); S.ask();
    N.say('Soldaki <b>KLM</b> açısına <em>eş</em> bir <b>DEF</b> açısı kur. Eş açıların ölçüleri eşittir: önce KLM’yi ölç, sonra F’yi sürükle.');
    measurePanel(`Tur ${st.ri + 1} · Eş açı`, () => checkBuild(R.deg), true);
  }
  function checkBuild(target) {
    const F = st.fig, p1 = g.polar(F.v, 10, F.a1), p2 = g.polar(F.v, 10, F.a2), have = Math.round(g.angleAt(p1, F.v, p2));
    if (Math.abs(have - target) <= 2) {
      N.sfx.good(); N.addScore(st.tries === 0 ? 100 : st.tries === 1 ? 60 : 30, F.v); st.show = have; st.build = false; st.phase = 'wait'; S.ask(); N.splash(F.v);
      N.say(`Harika! Senin açın <b>${have}°</b>, hedef ${target}°.${st.ref ? ' Ölçüleri eşit olan açılara <em>eş açılar</em> denir.' : ''}`, 'good');
      const el = N.panel('<div class="card"><span class="label">Tamam</span><div id="cn"></div></div>'); nextBtn(el.querySelector('#cn'));
      return true;
    }
    st.tries++; N.sfx.bad();
    N.say(`Senin açın <b>${have}°</b>, hedef ${target}°. ${have < target ? 'Biraz daha <b>aç</b>.' : 'Biraz <b>kapat</b>.'} Açıölçerle kontrol et.`, 'bad');
    if (st.tries >= 3) { N.addScore(0); st.show = have; S.ask(); }
    return false;
  }

  function roundQuiz() {
    st.phase = 'wait'; st.fig = null; S.ask();
    const Q = [
      { q: 'Bir ışın kendi etrafında <b>tam bir tur</b> dönerse oluşan <em>tam açı</em> kaç derecedir?', o: ['90°', '180°', '360°'], ok: 2 },
      { q: 'Tam açının yarısı <em>doğru açıdır</em>. Doğru açı kaç derecedir?', o: ['90°', '180°', '360°'], ok: 1 },
      { q: '<b>1 derece</b>, tam açının kaç eş parçasından biridir?', o: ['100', '180', '360'], ok: 2 },
    ];
    let i = 0;
    const ask = () => {
      const q = Q[i]; drawTurn(i);
      N.say(`<span class="label">Hızlı soru ${i + 1} / 3</span>${q.q}`);
      const el = N.panel('<div class="card"><span class="label">Derece nedir?</span><div id="cb"></div><div id="cn"></div></div>');
      N.choices(el.querySelector('#cb'), q.o.map((t, k) => ({ t, ok: k === q.ok })), (o, b, first) => {
        if (!o.ok) { N.sfx.bad(); return; }
        N.sfx.good(); if (first) N.addScore(30, { x: 500, y: 300 });
        i++; if (i < Q.length) { el.querySelector('#cn').innerHTML = '<button class="btn primary big" type="button" style="margin-top:10px">Sonraki →</button>'; el.querySelector('#cn button').onclick = ask; }
        else nextBtn(el.querySelector('#cn'));
      }, 'three');
    };
    ask();
  }
  function drawTurn(i) {
    const v = { x: 500, y: 330 }, sweep = [2 * Math.PI, Math.PI, 2 * Math.PI][i];
    st.turn = 0; N.tween(1400, (t) => { st.turn = t; S.ask(); });
    S.draw = (c) => {
      d.grid(c, W, H, 40);
      const a = sweep * st.turn;
      if (i === 2) for (let k = 0; k < 360; k += 1) { const L = k % 10 === 0 ? 26 : 12; if (k / 360 > st.turn) break; d.seg(c, g.polar(v, 190 - L, g.rad(k)), g.polar(v, 190, g.rad(k)), { color: N.DEEP, w: k % 10 ? 1 : 2 }); }
      else d.arc(c, v, 0, a, 70, { fill: N.WASH });
      d.ray(c, v, g.polar(v, 220, 0), { w: 3.5, ext: 20 }); d.ray(c, v, g.polar(v, 220, a), { w: 3.5, ext: 20, color: N.DEEP });
      d.dot(c, v, { r: 7 });
      if (st.turn > .99) d.text(c, ['360° · tam açı', '180° · doğru açı', '360 eş parça: her biri 1°'][i], 500, 590, { size: 40, color: N.DEEP });
    };
  }

  /* ── başla ── */
  N.dots(ROUNDS.length, 0);
  N.say('Ben <b>Nokta</b>, sen de açı avcısı! Her açıda önce <em>tahmin et</em>, sonra açıölçerle <em>ölç</em>. Bakalım gözün ne kadar keskin?');
  const el = N.panel(`<div class="card"><span class="label">Nasıl oynanır?</span>
    <p>1. Kaydırıcıyla tahmin et. 2. Açıölçeri köşeye taşı, sıfır çizgisini bir kola çevir. 3. Ölçümü yaz.</p>
    <p class="small">Doğru ölçüm 100 puan; tahminin ne kadar yakınsa o kadar bonus (en çok 50). Son turlarda açıyı sen kuracaksın.</p>
    <button class="btn primary big" id="go" type="button">Avlanmaya başla →</button></div>`);
  el.querySelector('#go').addEventListener('click', next);

  if (/onizleme/.test(location.search)) {
    st.fig = mk({ x: 400, y: 330 }, g.rad(20), 118, 235, ['A', 'B', 'C']);
    st.prot = { c: { x: 400, y: 330 }, rot: g.rad(20), show: true, snapC: true, snapR: true }; S.ask();
  }
})();
