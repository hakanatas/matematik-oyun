/* Şekli Kapat · MAT.5.3.5
   Doğruları sırayla çiz; her doğru bir öncekini kessin, son doğru ilkini kessin.
   Ardışık kesişimler köşe olur, şekil kapanır: çokgen. Kaç doğru, o kadar kenar. */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640;
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));
  const NAMES = { 3: 'üçgen', 4: 'dörtgen', 5: 'beşgen', 6: 'altıgen', 7: 'yedigen', 8: 'sekizgen' };
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const cap = (w) => w.charAt(0).toLocaleUpperCase('tr') + w.slice(1);
  const lname = (i) => 'd' + String(i + 1).split('').map((c) => SUB[c]).join('');

  const LEVELS = [
    { n: 3 }, { n: 4, predict: true }, { n: 5, predict: true }, { n: 6, predict: true },
    { broken: true }, { general: true },
  ];
  N.max = 4 * 100 + 3 * 20 + 40 + 60 + 60;
  const st = { li: -1, lines: [], drag: null, draft: null, closed: null, tries: 0, locked: false };

  /* ── geometri ── */
  function analyse(lines) {
    const n = lines.length, out = { n, verts: [], ok: false, why: '' };
    if (n < 2) return out;
    for (let i = 0; i + 1 < n; i++) out.verts[i + 1] = g.meet(lines[i].a, lines[i].b, lines[i + 1].a, lines[i + 1].b);
    if (n < 3) return out;
    out.verts[0] = g.meet(lines[n - 1].a, lines[n - 1].b, lines[0].a, lines[0].b);
    const V = out.verts;
    if (!V[0]) { out.why = 'last'; return out; }
    if (V.some((v) => !v)) { out.why = 'par'; return out; }
    if (V.some((v) => v.x < 4 || v.x > W - 4 || v.y < 4 || v.y > H - 4)) { out.why = 'out'; return out; }
    // dışbükey ve basit mi? (V0, V1, ..., V(n-1))
    let sign = 0, turn = 0;
    for (let i = 0; i < n; i++) {
      const a = V[i], b = V[(i + 1) % n], c = V[(i + 2) % n];
      const u = g.sub(b, a), w = g.sub(c, b);
      if (g.len(u) < 14) { out.why = 'tiny'; return out; }
      const cr = g.cross(u, w); if (Math.abs(cr) < 1e-6) { out.why = 'flat'; return out; }
      const s = Math.sign(cr); if (sign && s !== sign) { out.why = 'convex'; return out; }
      sign = s; turn += Math.atan2(cr, g.dot(u, w));
    }
    if (Math.abs(Math.abs(turn) - 2 * Math.PI) > .1) { out.why = 'convex'; return out; }
    out.ok = true; return out;
  }

  /* ── çizim ── */
  S.draw = (c) => {
    d.grid(c, W, H, 40);
    const L = st.lines, A = analyse(L), closed = A.ok;
    if (closed) { // dolgu
      const t = st.fillT == null ? 1 : st.fillT;
      d.poly(c, A.verts, { fill: `rgba(232,163,61,${.08 + .22 * t})`, noStroke: true });
    }
    L.forEach((l, i) => {
      d.fullLine(c, l.a, l.b, W, H, { w: 2, color: closed ? 'rgba(23,20,17,.35)' : 'rgba(23,20,17,.55)' });
      const u = g.unit(g.sub(l.b, l.a)), t = g.exitT(l.b, u, W, H), e = g.add(l.b, g.mul(u, Math.max(0, t - 34)));
      d.text(c, lname(i), e.x + u.y * 20, e.y - u.x * 20, { size: 26, color: N.SOFT });
    });
    // kenarlar: Li üzerinde V(i) ile V(i+1) arası
    const n = L.length;
    for (let i = 0; i < n; i++) {
      const p = A.verts[i], q = A.verts[i + 1 === n && n >= 3 ? 0 : i + 1];
      if (i + 1 === n && n < 3) continue;
      if (p && q && (closed || (i > 0 && i < n - 1))) d.seg(c, p, q, { w: 4.5, color: N.INK });
    }
    if (!closed && n >= 3 && A.verts[0] && A.verts[1] && A.verts[n - 1]) { // kapanış önizlemesi
      d.seg(c, A.verts[n - 1], A.verts[0], { w: 2.5, color: N.DEEP, dash: [8, 8] }); d.seg(c, A.verts[0], A.verts[1], { w: 2.5, color: N.DEEP, dash: [8, 8] });
    }
    const mid = closed ? centroid(A.verts) : null;
    A.verts.forEach((v, i) => {
      if (!v || (i === 0 && !closed)) return;
      const u = mid ? g.unit(g.sub(v, mid)) : { x: 0, y: -1 };
      d.dot(c, v, { r: 6.5, color: closed ? N.INK : N.DEEP, label: closed ? 'ABCDEFGH'[i] : '', lx: u.x * 26, ly: u.y * 26 });
    });
    if (closed && st.showAngles) A.verts.forEach((v, i) => {
      const pv = A.verts[(i + n - 1) % n], nx = A.verts[(i + 1) % n];
      let a1 = g.ang(v, nx), a2 = g.ang(v, pv); if (g.nd(g.deg(a2 - a1)) > 180) [a1, a2] = [a2, a1];
      d.arc(c, v, a1, a2, 22, { color: N.DEEP, w: 2.5 });
    });
    // tutamaçlar
    if (!st.locked) L.forEach((l, i) => ['a', 'b'].forEach((k) => {
      const hot = st.drag && st.drag.i === i && st.drag.k === k;
      d.dot(c, l[k], { r: hot ? 9 : 6.5, color: N.SHEET });
      c.beginPath(); c.arc(l[k].x, l[k].y, hot ? 9 : 6.5, 0, Math.PI * 2); c.strokeStyle = hot ? N.DEEP : N.INK; c.lineWidth = 2.2; c.stroke();
    }));
    if (st.draft) { d.fullLine(c, st.draft.a, st.draft.b, W, H, { w: 2, color: N.DEEP, dash: [10, 8] }); d.seg(c, st.draft.a, st.draft.b, { w: 3, color: N.DEEP }); }
  };

  /* ── dokunma ── */
  const handleAt = (p) => { for (let i = st.lines.length - 1; i >= 0; i--) for (const k of ['a', 'b']) if (g.dist(p, st.lines[i][k]) < S.hit(18)) return { i, k }; return null; };
  S.onDown = (p) => {
    if (st.locked) return;
    const h = handleAt(p); if (h) { st.drag = h; S.cursor('grabbing'); return; }
    if (st.lines.length >= 8) { N.say('Bu tahtaya en çok <b>8 doğru</b> sığar. Geri alıp yeniden dene.', 'bad'); return; }
    st.draft = { a: p, b: p };
  };
  S.onMove = (p) => {
    if (!p) return;
    if (st.drag) { st.lines[st.drag.i][st.drag.k] = { x: Math.max(6, Math.min(W - 6, p.x)), y: Math.max(6, Math.min(H - 6, p.y)) }; changed(); }
    else if (st.draft && S.down) { st.draft.b = p; S.ask(); }
    else if (!st.locked) S.cursor(handleAt(p) ? 'grab' : 'crosshair');
  };
  S.onUp = () => {
    if (st.drag) { st.drag = null; S.cursor('crosshair'); changed(true); return; }
    const dr = st.draft; st.draft = null;
    if (dr && g.dist(dr.a, dr.b) >= 40) { st.lines.push(dr); N.sfx.draw(); changed(true); }
    else if (dr) { S.ask(); N.say('Doğru çizmek için tahtada <b>sürükle</b>: bastığın yerden bıraktığın yere.'); }
  };

  let wasClosed = false;
  function changed(final) {
    const A = analyse(st.lines);
    if (A.ok && !wasClosed) { N.sfx.snap(); st.fillT = 0; N.tween(400, (t) => { st.fillT = t; S.ask(); }); }
    wasClosed = A.ok; S.ask();
    if (final) updateInfo(A);
  }
  function updateInfo(A) {
    const box = N.$('#info'); if (!box) return;
    const n = st.lines.length, k = A.verts.filter(Boolean).length;
    box.innerHTML = `Çizilen doğru: <b>${n}</b> · kesişim noktası: <b>${k}</b>${A.ok ? ` · <b style="color:var(--amber-deep)">şekil kapandı!</b>` : ''}`;
    if (!st.lv || st.lv.general) return;
    if (n === 1) N.say('İlk doğru tamam. Şimdi <b>ilkini kesen</b> ikinci bir doğru çiz.');
    else if (n >= 2 && !A.verts[n - 1]) N.say(`${lname(n - 1)}, ${lname(n - 2)}’yi kesmiyor (paraleller). Bir tutamacı sürükleyip çevir.`, 'bad');
    else if (n === 2) N.say('Kesiştiler: ilk köşe! Sıradaki doğru <b>son çizdiğini</b> kessin.');
    else if (A.ok) N.say(`Kapandı: <b>${n} doğru</b>, ${n} kenarlı bir şekil. Hazırsan <em>Kontrol et</em>.`, 'good');
    else if (A.why === 'last') N.say(`Son doğru (${lname(n - 1)}) ilk doğruyu (${lname(0)}) kesmiyor, şekil açık kaldı.`);
    else if (A.why === 'out') N.say('Bir köşe tahtanın dışına taştı. Tutamaçlarla doğruları biraz çevir.');
    else if (A.why === 'convex') N.say('Kenarlar birbirini kesiyor ya da şekil içe göçmüş. Doğruları şeklin <b>etrafında dolaşarak</b> sırayla çiz.');
    else N.say(`${n} doğru oldu. Son doğru ilkini düzgünce kesince şekil kapanacak.`);
  }

  /* ── seviyeler ── */
  function buildPanel(target) {
    const el = N.panel(`<div class="card"><span class="label">Seviye ${st.li + 1} · Hedef: ${NAMES[target]}</span>
      <p id="info" class="small" style="font-size:16px">Çizilen doğru: <b>0</b></p>
      <div class="row"><button class="btn primary" id="chk" type="button">Kontrol et</button><button class="btn" id="undo" type="button">↶ Geri al</button><button class="btn" id="clr" type="button">Temizle</button></div>
      <p class="small" style="margin:10px 0 0">Tahtada sürükle: yeni doğru. Uçlardaki halkaları sürükle: doğruyu çevir.</p><div id="cn"></div></div>`);
    el.querySelector('#undo').onclick = () => { if (st.locked) return; st.lines.pop(); changed(true); };
    el.querySelector('#clr').onclick = () => { if (st.locked) return; st.lines = []; changed(true); };
    el.querySelector('#chk').onclick = () => check(target);
  }

  function check(target) {
    if (st.locked) return;
    const A = analyse(st.lines), n = st.lines.length;
    if (n < 3) { N.sfx.bad(); return N.say('Kapalı bir şekil için <b>en az 3 doğru</b> gerekir.', 'bad'); }
    if (!A.ok) { N.sfx.bad(); st.tries++; updateInfo(A); N.$('#noktaImg').classList.add('shake'); return; }
    if (n !== target) {
      N.sfx.bad(); st.tries++;
      return N.say(`Güzel bir <b>${NAMES[n] || n + ' kenarlı çokgen'}</b> oldu ama hedef <b>${NAMES[target]}</b>. ${cap(NAMES[target])} için kaç doğru gerek?`, 'bad');
    }
    st.locked = true; st.showAngles = true; S.ask();
    N.sfx.good(); N.addScore(st.tries === 0 ? 100 : st.tries === 1 ? 70 : 40, centroid(A.verts)); N.splash(centroid(A.verts));
    N.say(`Bir <b>${NAMES[n]}</b>! ${n} doğru ardışık kesişti: <em>${n} kenar, ${n} köşe, ${n} iç açı</em>. Köşeler: ${'ABCDEFGH'.slice(0, n).split('').join(', ')}.`, 'good');
    N.$('#chk').closest('.row').remove();
    const host = N.$('#cn'); host.innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">Sonraki seviye →</button>`;
    host.querySelector('button').onclick = next; host.querySelector('button').focus();
  }
  const centroid = (V) => V.reduce((s, v) => ({ x: s.x + v.x / V.length, y: s.y + v.y / V.length }), { x: 0, y: 0 });

  function levelBuild(lv) {
    st.lines = []; st.locked = false; st.showAngles = false; st.tries = 0; wasClosed = false; S.cursor('crosshair');
    const go = () => {
      st.locked = false; buildPanel(lv.n); S.ask();
      N.say(`Bir <b>${NAMES[lv.n]}</b> oluştur. Doğruları sırayla çiz: her biri bir öncekini kessin, <em>son doğru ilk doğruyu</em> kessin.`);
    };
    if (!lv.predict) return go();
    st.locked = true; S.ask();
    N.say(`Sıradaki hedef: <b>${NAMES[lv.n]}</b>. Önce tahmin et: kaç doğru çizmelisin?`);
    const el = N.panel(`<div class="card"><span class="label">Seviye ${st.li + 1} · Tahmin</span><div id="cb"></div></div>`);
    N.choices(el.querySelector('#cb'), [lv.n - 1, lv.n, lv.n + 1].map((k) => ({ t: `${k} doğru`, ok: k === lv.n })), (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say('Hmm. Her doğru şeklin <b>bir kenarı</b> oluyor. Kaç kenar lazım?', 'bad'); return; }
      N.sfx.good(); if (first) N.addScore(20, { x: 500, y: 320 }); setTimeout(go, 500);
    }, 'three');
  }

  function levelBroken() {
    st.locked = true; st.showAngles = false; st.tries = 0;
    st.lines = [{ a: { x: 200, y: 470 }, b: { x: 780, y: 470 } }, { a: { x: 300, y: 560 }, b: { x: 560, y: 140 } }, { a: { x: 360, y: 230 }, b: { x: 860, y: 230 } }];
    wasClosed = false; S.ask();
    N.say('Ben de 3 doğru çizdim: her biri bir öncekini kesiyor. Ama <b>üçgen olmadı</b>! Neden?');
    const el = N.panel(`<div class="card"><span class="label">Seviye ${st.li + 1} · Dedektiflik</span><div id="cb"></div><div id="cn"></div></div>`);
    N.choices(el.querySelector('#cb'), [
      { t: `Son doğru (${lname(2)}) ilk doğruyu (${lname(0)}) kesmiyor.`, ok: true },
      { t: 'Doğrular çok kısa çizilmiş.' },
      { t: 'Üç doğruyla hiçbir zaman kapalı şekil olmaz.' },
    ], (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say(o.t.startsWith('Doğrular') ? 'Doğrular sonsuza gider; kısa olmaları önemli değil.' : 'İlk seviyede üç doğruyla üçgen yaptın!', 'bad'); return; }
      N.sfx.good(); if (first) N.addScore(40, { x: 500, y: 300 });
      N.say(`Evet: ${lname(0)} ile ${lname(2)} paralel, hiç kesişmiyor. <em>Düzelt</em>: ${lname(2)}’nin bir ucundaki halkayı sürükleyip çevir, şekil kapansın.`, 'good');
      st.locked = false; S.cursor('crosshair');
      const host = el.querySelector('#cn');
      host.innerHTML = '<p id="info" class="small" style="font-size:16px;margin-top:10px"></p><button class="btn primary" id="chk" type="button">Kontrol et</button>';
      host.querySelector('#chk').onclick = () => {
        const A = analyse(st.lines);
        if (!A.ok || st.lines.length !== 3) { N.sfx.bad(); N.say(`Henüz kapanmadı. ${lname(2)} hem ${lname(1)}’yi hem ${lname(0)}’i tahtanın içinde kesmeli.`, 'bad'); st.tries++; return; }
        st.locked = true; st.showAngles = true; S.ask(); N.sfx.good(); N.addScore(st.tries ? 40 : 60, centroid(A.verts)); N.splash(centroid(A.verts));
        N.say('Kapandı, bir üçgen! Kural: <b>son doğru ilk doğruyu kesmeli</b>.', 'good');
        host.innerHTML = '<button class="btn primary big" type="button" style="margin-top:10px">Sonraki seviye →</button>'; host.querySelector('button').onclick = next;
      };
    }, 'one');
  }

  function levelGeneral() {
    st.locked = true; st.showAngles = true; S.cursor('default');
    const R = 230, C = { x: 500, y: 320 }, pts = Array.from({ length: 8 }, (_, i) => g.polar(C, R, g.rad(90 + i * 45 + 22.5)));
    st.lines = pts.map((p, i) => { const q = pts[(i + 1) % 8]; return { a: g.lerp(p, q, .2), b: g.lerp(p, q, .8) }; });
    // köşelerin ardışık kesişim olması için doğruları sırala: Li, V(i)–V(i+1) kenarında
    wasClosed = true; st.fillT = 1; S.ask();
    N.say('Genelleme zamanı! 8 doğru, son doğru ilkini keserek ardışık kesişirse ne olur?');
    const el = N.panel(`<div class="card"><span class="label">Seviye ${st.li + 1} · Genelle</span>
      ${[['kenar', 'Kenar sayısı'], ['kose', 'Köşe sayısı'], ['aci', 'İç açı sayısı']].map(([k, t]) => `<div class="row" style="margin-bottom:6px"><span style="width:130px">${t}</span><input class="num-in" data-k="${k}" inputmode="numeric"></div>`).join('')}
      <div class="row" style="margin-bottom:6px"><span style="width:130px">Adı</span><input class="num-in" data-k="ad" style="width:150px;font-size:24px" placeholder="…gen"></div>
      <button class="btn primary big" id="chk" type="button">Kontrol et</button><div id="cn"></div></div>`);
    let tries = 0;
    el.querySelector('#chk').onclick = () => {
      let ok = true;
      el.querySelectorAll('[data-k]').forEach((inp) => {
        const v = inp.value.trim().toLocaleLowerCase('tr'), good = inp.dataset.k === 'ad' ? /^sekizgen$/.test(v) : N.num(v) === 8;
        inp.classList.remove('ok', 'no'); void inp.offsetWidth; inp.classList.add(good ? 'ok' : 'no'); if (!good) ok = false;
      });
      if (!ok) { tries++; N.sfx.bad(); N.say('İpucu: her doğru bir kenar, her ardışık kesişim bir köşe; her köşede bir iç açı var. Adı: sekiz + gen.', 'bad'); return; }
      N.sfx.good(); N.addScore(tries ? 30 : 60, C); el.querySelector('#chk').remove();
      N.say('<b>Sekizgen</b>: 8 kenar, 8 köşe, 8 iç açı. <em>n doğru → n kenarlı çokgen.</em>', 'good');
      const host = el.querySelector('#cn'); host.innerHTML = '<button class="btn primary big" type="button" style="margin-top:10px">Bitir →</button>'; host.querySelector('button').onclick = next;
    };
  }

  function next() {
    st.li++; N.dots(LEVELS.length, st.li);
    if (st.li >= LEVELS.length) return N.finish({ id: 'sekli-kapat', title: 'Şekil Ustası!', film: 'dogrulardan-cokgene', text: 'Çokgen: düzlemde ardışık kesişen ve son doğrusu ilkini kesen doğruların oluşturduğu kapalı şekil. Sıradaki oyun: <b>Üçgenin Sırrı</b>.' });
    const lv = (st.lv = LEVELS[st.li]);
    if (lv.broken) return levelBroken();
    if (lv.general) return levelGeneral();
    levelBuild(lv);
  }

  N.dots(LEVELS.length, 0);
  st.locked = true;
  st.lines = [{ a: { x: 260, y: 470 }, b: { x: 760, y: 500 } }, { a: { x: 700, y: 560 }, b: { x: 560, y: 120 } }, { a: { x: 640, y: 150 }, b: { x: 250, y: 300 } }, { a: { x: 230, y: 230 }, b: { x: 300, y: 560 } }];
  wasClosed = true; S.ask();
  N.say('Ben <b>Nokta</b>. Doğrular sonsuza gider ama bir aradayken bir şeyi <em>kapatabilirler</em>. Doğrulardan çokgen yapmaya ne dersin?');
  const el = N.panel(`<div class="card"><span class="label">Nasıl oynanır?</span>
    <p>Tahtada <b>sürükleyerek</b> doğru çiz. Her yeni doğru bir öncekini kessin. Son doğru ilkini kesince şekil kapanır.</p>
    <p class="small">Uçlardaki halkaları sürükleyerek doğruları sonradan da çevirebilirsin.</p>
    <button class="btn primary big" id="go" type="button">Başla →</button></div>`);
  el.querySelector('#go').addEventListener('click', next);
  if (/onizleme/.test(location.search)) { st.showAngles = true; S.ask(); }
})();
