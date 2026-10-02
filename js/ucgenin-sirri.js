/* Üçgenin Sırrı · MAT.5.3.6
   1) Sır: köşeleri yırt, yan yana koy: iç açılar toplamı 180°.
   2) Kayıp açı: iki açı verilen üçgende üçüncüyü bul.
   3) Üçgen tablosu: açılarına ve kenarlarına göre 3 × 3 tabloyu doldur; imkânsız hücreleri yakala.
   4) Düzgün mü? Kenarları ve açıları eş olan çokgenler.  5) Olabilir mi? */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640, CM = 40;
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));

  const STEPS = ['sir', 'kayip', 'kayip', 'kayip', 'kayip', 'tablo', 'duzgun', 'duzgun', 'duzgun', 'duzgun', 'olabilir', 'olabilir'];
  N.max = 30 + 4 * 30 + 9 * 20 + 4 * 15 + 2 * 20;
  const st = { si: -1, tri: null, drag: -1, view: null, tear: null };

  /* ── üçgen ölçüleri ── */
  const sideCm = (a, b) => Math.round(g.dist(a, b) / CM * 10) / 10;
  function measure(T) {
    const [A, B, C] = T;
    const raw = [g.angleAt(C, A, B), g.angleAt(A, B, C), g.angleAt(B, C, A)];
    // toplam tam 180 olacak biçimde yuvarla (en büyük kalan yöntemi)
    const fl = raw.map(Math.floor); let rest = 180 - fl.reduce((s, x) => s + x, 0);
    raw.map((x, i) => [x - fl[i], i]).sort((p, q) => q[0] - p[0]).forEach(([, i]) => { if (rest > 0) { fl[i]++; rest--; } });
    const sides = [sideCm(B, C), sideCm(C, A), sideCm(A, B)]; // a, b, c (karşı kenarlar)
    const eq = (x, y) => x === y;
    const nEq = (eq(sides[0], sides[1]) ? 1 : 0) + (eq(sides[1], sides[2]) ? 1 : 0) + (eq(sides[0], sides[2]) ? 1 : 0);
    const side = nEq >= 2 ? 2 : nEq === 1 ? 1 : 0; // 0 çeşitkenar, 1 ikizkenar, 2 eşkenar
    const ang = fl.some((a) => a > 90) ? 2 : fl.some((a) => a === 90) ? 1 : 0; // 0 dar, 1 dik, 2 geniş
    return { ang: fl, sides, side, angK: ang };
  }
  const SIDE = ['Çeşitkenar', 'İkizkenar', 'Eşkenar'], ANG = ['Dar açılı', 'Dik açılı', 'Geniş açılı'];

  /* ── mıknatıs: sürüklenen köşeyi özel konumlara çeker ── */
  function snap(P, A, B) {
    const ab = g.dist(A, B), u = g.unit(g.sub(B, A)), n = { x: -u.y, y: u.x }, M = g.lerp(A, B, .5);
    const rot = (p, c, t) => { const v = g.sub(p, c), cs = Math.cos(t), sn = Math.sin(t); return { x: c.x + v.x * cs - v.y * sn, y: c.y + v.x * sn + v.y * cs }; };
    const pts = [rot(B, A, Math.PI / 3), rot(B, A, -Math.PI / 3), g.add(M, g.mul(n, ab / 2)), g.sub(M, g.mul(n, ab / 2)),
      g.add(A, g.mul(n, ab)), g.sub(A, g.mul(n, ab)), g.add(B, g.mul(n, ab)), g.sub(B, g.mul(n, ab))];
    for (const q of pts) if (g.dist(P, q) < 14) return q;
    const onCircle = (c, r) => g.add(c, g.mul(g.unit(g.sub(P, c)), r));
    const curves = [g.proj(P, M, g.add(M, n)), onCircle(A, ab), onCircle(B, ab), onCircle(M, ab / 2), g.proj(P, A, g.add(A, n)), g.proj(P, B, g.add(B, n))];
    let best = null, bd = 9; for (const q of curves) { const dd = g.dist(P, q); if (dd < bd) { bd = dd; best = q; } }
    return best || P;
  }

  /* ── üçgen çizimi ── */
  function drawTri(c, T, o = {}) {
    const m = measure(T), [A, B, C] = T, V = [A, B, C], names = o.names || ['A', 'B', 'C'];
    d.poly(c, V, { fill: o.fill || 'rgba(232,163,61,.14)', w: 3.6 });
    if (o.ticks !== false) { // eş kenar çentikleri
      const s = m.sides, pairs = [[B, C], [C, A], [A, B]];
      const groups = s.map((x, i) => s.filter((y) => y === x).length > 1 ? s.indexOf(x) : -1);
      pairs.forEach(([p, q], i) => { if (groups[i] >= 0) d.ticks(c, p, q, m.side === 2 ? 1 : 1); });
    }
    V.forEach((v, i) => {
      const p = V[(i + 2) % 3], q = V[(i + 1) % 3], angle = o.angles ? o.angles[i] : m.ang[i];
      let a1 = g.ang(v, q), a2 = g.ang(v, p); if (g.nd(g.deg(a2 - a1)) > 180) [a1, a2] = [a2, a1];
      if (angle === 90) d.right(c, v, g.sub(q, v), g.sub(p, v), 20, { w: 3 });
      else d.arc(c, v, a1, a2, 30, { fill: N.WASH, w: 2.5 });
      const mid = g.dir((a1 + a1 + g.rad(g.nd(g.deg(a2 - a1)))) / 2), lp = g.add(v, g.mul(mid, angle < 40 ? 72 : 56));
      if (o.showAngles !== false) d.text(c, angle === '?' ? '?' : `${angle}°`, lp.x, lp.y, { size: angle === '?' ? 40 : 27, color: angle === '?' ? N.SEAL : N.DEEP });
      const out = g.unit(g.sub(v, g.mul(g.add(g.add(A, B), C), 1 / 3)));
      d.dot(c, v, { r: o.handles ? 10 : 6, color: o.handles ? N.INK : N.INK, ring: o.handles && st.hot === i ? N.AMBER : null, label: names[i], lx: out.x * 28, ly: out.y * 28 });
    });
    if (o.sides) [[B, C], [C, A], [A, B]].forEach(([p, q], i) => {
      const mm = g.lerp(p, q, .5), cen = g.mul(g.add(g.add(A, B), C), 1 / 3), out = g.unit(g.sub(mm, cen));
      d.text(c, `${N.fmt(m.sides[i])} cm`, mm.x + out.x * 28, mm.y + out.y * 28, { size: 22, color: N.SOFT, font: N.MONO });
    });
    return m;
  }

  /* ── sürükleme ── */
  S.onDown = (p) => { if (!st.tri || !st.dragOk) return; st.drag = st.tri.findIndex((v) => g.dist(v, p) < S.hit(26)); if (st.drag >= 0) S.cursor('grabbing'); };
  S.onMove = (p) => {
    if (!p || !st.tri || !st.dragOk) return;
    if (st.drag >= 0) {
      const lim = st.limit || { x0: 30, x1: W - 30, y0: 40, y1: H - 30 };
      let q = { x: Math.max(lim.x0, Math.min(lim.x1, p.x)), y: Math.max(lim.y0, Math.min(lim.y1, p.y)) };
      const o = st.tri.filter((_, i) => i !== st.drag); q = snap(q, o[0], o[1]);
      if (g.dist(q, p) > .5 && !st.wasSnap) N.sfx.snap(); st.wasSnap = g.dist(q, p) > .5;
      st.tri[st.drag] = q; st.onChange && st.onChange(); S.ask();
    } else { const h = st.tri.findIndex((v) => g.dist(v, p) < S.hit(26)); if (h !== st.hot) { st.hot = h; S.ask(); } S.cursor(h >= 0 ? 'grab' : 'default'); }
  };
  S.onUp = () => { if (st.drag >= 0) { st.drag = -1; S.cursor('default'); S.ask(); } };

  S.draw = (c) => { d.grid(c, W, H, CM); if (st.view) st.view(c); };

  /* ── 1. sır ── */
  function stepSecret() {
    st.tri = [{ x: 260, y: 400 }, { x: 640, y: 420 }, { x: 430, y: 130 }]; st.dragOk = true; st.tear = null; st.limit = { x0: 40, x1: 960, y0: 50, y1: 440 };
    const COL = ['rgba(232,163,61,.85)', 'rgba(184,116,26,.8)', 'rgba(196,67,43,.7)'];
    st.view = (c) => {
      const m = drawTri(c, st.tri, { handles: !st.tear, showAngles: true });
      const sum = m.ang.reduce((s, x) => s + x, 0);
      d.text(c, `${m.ang[0]}° + ${m.ang[1]}° + ${m.ang[2]}° = ${st.tear && st.tear.t > .99 ? sum + '°' : '?'}`, 760, 90, { size: 30, color: N.INK });
      if (!st.tear) return;
      const T = st.tear, Q = { x: 500, y: 570 }, R = 64;
      c.globalAlpha = Math.min(1, T.t * 2); d.seg(c, { x: 330, y: Q.y }, { x: 670, y: Q.y }, { color: N.INK, w: 2.5, dash: [8, 8] }); c.globalAlpha = 1;
      let acc = 0;
      T.w.forEach((w, i) => {
        const pos = g.lerp(w.v, Q, T.t), start = w.s + (acc - w.s) * T.t; acc += w.a;
        c.beginPath(); c.moveTo(pos.x, pos.y); c.arc(pos.x, pos.y, R, -start, -start - w.a, true); c.closePath();
        c.fillStyle = COL[i]; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
      });
      if (T.t > .99) { d.arc(c, Q, 0, Math.PI, R + 16, { color: N.INK, w: 2.5 }); d.text(c, '180° · doğru açı', Q.x, Q.y - R - 40, { size: 32, color: N.DEEP }); }
    };
    S.ask();
    N.say('Üçgenimin bir sırrı var! Köşeleri sürükleyip istediğin üçgeni yap, sonra <em>köşeleri yırt</em> ve yan yana koy.');
    const el = N.panel(`<div class="card"><span class="label">Sır</span><p class="small">Siyah köşeleri sürükle. Hazır olunca köşeleri yırt.</p>
      <div class="row"><button class="btn primary big" id="tear" type="button">✂ Köşeleri yırt</button><button class="btn" id="again" type="button" disabled>↺ Başka üçgen</button></div><div id="cn"></div></div>`);
    let count = 0;
    el.querySelector('#tear').onclick = async () => {
      if (st.tear) return;
      const [A, B, C] = st.tri, V = [A, B, C];
      st.tear = { t: 0, w: V.map((v, i) => { const p = V[(i + 2) % 3], q = V[(i + 1) % 3]; let a1 = g.ang(v, q), a2 = g.ang(v, p); if (g.nd(g.deg(a2 - a1)) > 180) [a1, a2] = [a2, a1]; return { v, s: a1, a: g.rad(g.nd(g.deg(a2 - a1))) }; }) };
      st.tear.w.forEach((w) => { while (w.s > Math.PI) w.s -= 2 * Math.PI; while (w.s < -Math.PI) w.s += 2 * Math.PI; });
      st.dragOk = false; N.sfx.draw(); el.querySelector('#tear').disabled = true;
      await N.tween(1600, (t) => { st.tear.t = t; S.ask(); }, (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      count++; N.sfx.good(); N.splash({ x: 500, y: 540 });
      N.say(count === 1 ? 'Üç köşe yan yana bir <b>doğru açı</b> oluşturdu: <em>180°</em>! Bu sadece bu üçgende mi olur? Başka bir üçgenle dene.' : 'Yine 180°! <b>Her üçgenin iç açılarının ölçüleri toplamı 180°’dir.</b>', 'good');
      el.querySelector('#again').disabled = false;
      if (count === 2) { N.addScore(30, { x: 500, y: 480 }); nextBtn(el.querySelector('#cn')); }
    };
    el.querySelector('#again').onclick = () => {
      st.tear = null; st.dragOk = true; el.querySelector('#tear').disabled = false; el.querySelector('#again').disabled = true;
      st.tri = [{ x: g.rnd(120, 360), y: g.rnd(330, 430) }, { x: g.rnd(620, 880), y: g.rnd(330, 430) }, { x: g.rnd(300, 700), y: g.rnd(70, 200) }]; S.ask();
      N.say('Köşeleri istediğin gibi sürükle; geniş açılı ya da dik açılı bir üçgen de olabilir. Sonra yine yırt!');
    };
  }

  /* ── 2. kayıp açı ── */
  const SETS = g.shuffle([[50, 60, 70], [90, 35, 55], [112, 40, 28], [66, 66, 48], [30, 45, 105], [90, 62, 28]]).slice(0, 4);
  function triFromAngles(a, b) { // AB tabanı, A'da a, B'de b
    const A = { x: 0, y: 0 }, B = { x: 1, y: 0 }, C = g.meet(A, g.polar(A, 1, g.rad(a)), B, g.polar(B, 1, g.rad(180 - b)));
    const pts = [A, B, C], xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys), k = Math.min(620 / w, 400 / h);
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    return pts.map((p) => ({ x: 500 + (p.x - cx) * k, y: 330 + (p.y - cy) * k }));
  }
  function stepMissing(k) {
    const set = g.shuffle(SETS[k]), hide = g.rnd(0, 2), names = [['K', 'L', 'M'], ['D', 'E', 'F'], ['P', 'R', 'S'], ['X', 'Y', 'Z']][k];
    st.tri = triFromAngles(set[0], set[1]); st.dragOk = false;
    const angles = set.map((a, i) => (i === hide ? '?' : a));
    st.view = (c) => drawTri(c, st.tri, { angles, names, ticks: false });
    S.ask();
    N.say(`Kayıp açı ${k + 1} / 4: <b>m(${names[hide]})</b> kaç derece? Açıölçer yok, sır var!`);
    const el = N.panel(`<div class="card"><span class="label">Kayıp açı</span><div class="row"><span style="font-family:var(--brush);font-size:28px">m(${names[hide]}) =</span><input class="num-in" id="mv" inputmode="numeric"><span class="big-read" style="font-size:30px">°</span></div>
      <button class="btn primary big" id="chk" type="button" style="margin-top:10px">Kontrol et</button><div id="cn"></div></div>`);
    let tries = 0; const inp = el.querySelector('#mv'); inp.focus();
    const run = () => {
      const v = N.num(inp.value); if (v == null) return;
      inp.classList.remove('ok', 'no'); void inp.offsetWidth;
      if (v === set[hide]) {
        inp.classList.add('ok'); inp.disabled = true; angles[hide] = set[hide]; S.ask(); N.sfx.good(); N.addScore(tries ? 15 : 30, st.tri[hide]);
        const kn = set.filter((_, i) => i !== hide);
        N.say(`180° − ${kn[0]}° − ${kn[1]}° = <b>${set[hide]}°</b>. ${set.includes(90) ? 'Bu bir <em>dik açılı</em> üçgen.' : set.some((a) => a > 90) ? 'Bir açısı 90°’den büyük: <em>geniş açılı</em> üçgen.' : 'Üç açısı da dar: <em>dar açılı</em> üçgen.'}`, 'good');
        el.querySelector('#chk').remove(); nextBtn(el.querySelector('#cn'));
      } else { tries++; inp.classList.add('no'); N.sfx.bad(); N.say('Üç açının toplamı <b>180°</b> olmalı. Bilinen iki açıyı topla, 180’den çıkar.', 'bad'); }
    };
    el.querySelector('#chk').onclick = run; inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); });
  }

  /* ── 3. üçgen tablosu ── */
  function stepTable() {
    st.tri = [{ x: 300, y: 470 }, { x: 640, y: 470 }, { x: 420, y: 200 }]; st.dragOk = true; st.limit = { x0: 40, x1: 960, y0: 50, y1: 600 };
    const cells = {}; // 'a,s' → 'ok' | 'x'
    const IMP = { '1,2': 'Eşkenar üçgenin her açısı 60°; dik açısı olamaz.', '2,2': 'Eşkenar üçgenin her açısı 60°; geniş açısı olamaz.' };
    st.view = (c) => {
      const m = drawTri(c, st.tri, { handles: true, sides: true });
      d.text(c, `${ANG[m.angK]} · ${SIDE[m.side].toLocaleLowerCase('tr')}`, 500, 40, { size: 34, color: N.DEEP });
    };
    st.onChange = () => {};
    S.ask();
    N.say('Büyük görev: <b>3 × 3 tabloyu</b> doldur! Köşeleri sürükleyerek üçgen kur, <em>Tabloya ekle</em> ile yerleştir. Kurulamayan hücreleri bul ve <em>imkânsız</em> diye işaretle.');
    const el = N.panel(`<div class="card"><span class="label">Üçgen tablosu</span>
      <table style="width:100%;border-collapse:separate;border-spacing:4px;font-size:13px">
        <tr><th></th>${SIDE.map((s) => `<th style="font-family:var(--mono);font-weight:500;font-size:10.5px;letter-spacing:.02em">${s}</th>`).join('')}</tr>
        ${ANG.map((a, ai) => `<tr><th style="font-family:var(--mono);font-weight:500;font-size:10.5px;text-align:left">${a.replace(' ', '<br>')}</th>${SIDE.map((_, si) => `<td><button class="choice" data-c="${ai},${si}" type="button" style="width:100%;height:58px;padding:2px;font-size:15px" title="Boş hücre: imkânsız diye işaretlemek için dokun">·</button></td>`).join('')}</tr>`).join('')}
      </table>
      <div class="row" style="margin-top:8px"><button class="btn primary" id="add" type="button">＋ Tabloya ekle</button><span class="small" id="cnt">0 / 9</span></div>
      <p class="small" style="margin:8px 0 0">Boş bir hücreye dokunmak: “bu üçgen kurulamaz” demek.</p><div id="cn"></div></div>`);
    const btn = (k) => el.querySelector(`[data-c="${k}"]`);
    const mini = (T) => { const xs = T.map((p) => p.x), ys = T.map((p) => p.y), x0 = Math.min(...xs), y0 = Math.min(...ys), s = 44 / Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0);
      return `<svg viewBox="-3 -3 50 50" width="46" height="46" aria-hidden="true"><path d="M${T.map((p) => `${((p.x - x0) * s).toFixed(1)} ${((p.y - y0) * s).toFixed(1)}`).join(' L')} Z" fill="rgba(232,163,61,.5)" stroke="#171411" stroke-width="2" stroke-linejoin="round"/></svg>`; };
    const progress = () => {
      const n = Object.keys(cells).length; el.querySelector('#cnt').textContent = `${n} / 9`;
      if (n === 9) { N.sfx.win(); N.say('Tablo tamam! 7 çeşit üçgen var; <b>eşkenar üçgen</b> ne dik ne geniş açılı olabilir, hep <em>dar açılı</em>dır (her açısı 60°).', 'good'); el.querySelector('#add').disabled = true; st.dragOk = false; nextBtn(el.querySelector('#cn')); }
    };
    el.querySelector('#add').onclick = () => {
      const m = measure(st.tri), k = `${m.angK},${m.side}`;
      if (cells[k]) { N.sfx.bad(); N.say(`<b>${ANG[m.angK]} ${SIDE[m.side].toLocaleLowerCase('tr')}</b> zaten tabloda. Başka bir tür dene!`, 'bad'); return; }
      cells[k] = 'ok'; const b = btn(k); b.innerHTML = mini(st.tri); b.classList.add('ok'); b.disabled = true;
      N.sfx.good(); N.addScore(20, g.mul(g.add(g.add(st.tri[0], st.tri[1]), st.tri[2]), 1 / 3));
      N.say(`<b>${ANG[m.angK]} ${SIDE[m.side].toLocaleLowerCase('tr')}</b> üçgen eklendi! ${m.side === 1 ? 'Eş kenarları gören açılar da eş, fark ettin mi?' : m.side === 2 ? 'Bütün açıları 60°.' : ''}`, 'good');
      progress();
    };
    el.querySelectorAll('[data-c]').forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.c; if (cells[k]) return;
      if (IMP[k]) { cells[k] = 'x'; b.innerHTML = '<span style="font-family:var(--brush);font-size:17px;color:#c4432b;transform:rotate(-8deg);display:inline-block">imkânsız</span>'; b.disabled = true; N.sfx.good(); N.addScore(20, { x: 500, y: 320 }); N.say(`Doğru yakaladın! ${IMP[k]}`, 'good'); progress(); }
      else { b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 600); N.sfx.bad(); N.addScore(-10); const [ai, si] = k.split(',').map(Number); N.say(`Hayır, <b>${ANG[ai].toLocaleLowerCase('tr')} ${SIDE[si].toLocaleLowerCase('tr')}</b> üçgen kurulabilir! Köşeleri sürükle; özel konumlarda köşe yerine oturur.`, 'bad'); }
    }));
  }

  /* ── 4. düzgün mü? ── */
  const POLYS = g.shuffle([
    { ad: 'eşkenar dörtgen', n: 4, sides: [4, 4, 4, 4], angles: [60, 120, 60, 120], ok: false, why: 'Kenarları eş ama açıları eş değil (60° ve 120°). <b>Düzgün değil.</b>' },
    { ad: 'altıgen', n: 6, sides: [3, 3, 3, 3, 3, 3], angles: [120, 120, 120, 120, 120, 120], ok: true, why: 'Bütün kenarları 3 cm, bütün açıları 120°: <b>düzgün altıgen</b>.' },
    { ad: 'dikdörtgen', n: 4, sides: [6, 3, 6, 3], angles: [90, 90, 90, 90], ok: false, why: 'Açıları eş (hepsi 90°) ama kenarları eş değil. <b>Düzgün değil.</b>' },
    { ad: 'beşgen', n: 5, sides: [3.5, 3.5, 3.5, 3.5, 3.5], angles: [108, 108, 108, 108, 108], ok: true, why: 'Kenarlar eş, açılar eş (108°): <b>düzgün beşgen</b>.' },
  ]);
  function polyPts(P) {
    let pts;
    if (P.ad === 'dikdörtgen') pts = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 3 }, { x: 0, y: 3 }];
    else if (P.ad === 'eşkenar dörtgen') pts = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 6, y: 3.464 }, { x: 2, y: 3.464 }];
    else pts = Array.from({ length: P.n }, (_, i) => ({ x: Math.cos(2 * Math.PI * i / P.n + Math.PI / 2 + Math.PI / P.n), y: Math.sin(2 * Math.PI * i / P.n + Math.PI / 2 + Math.PI / P.n) }));
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y), k = Math.min(520 / (Math.max(...xs) - Math.min(...xs)), 380 / (Math.max(...ys) - Math.min(...ys)));
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    return pts.map((p) => ({ x: 500 + (p.x - cx) * k, y: 335 + (p.y - cy) * k }));
  }
  function stepRegular(k) {
    const P = POLYS[k], pts = polyPts(P); st.tri = null;
    // açıları köşe sırasına göre gerçek şekilden al
    st.view = (c) => {
      d.poly(c, pts, { fill: 'rgba(232,163,61,.14)', w: 3.6 });
      const cen = pts.reduce((s, p) => ({ x: s.x + p.x / pts.length, y: s.y + p.y / pts.length }), { x: 0, y: 0 });
      pts.forEach((v, i) => {
        const nx = pts[(i + 1) % pts.length], pv = pts[(i + pts.length - 1) % pts.length];
        const ang = Math.round(g.angleAt(pv, v, nx));
        let a1 = g.ang(v, nx), a2 = g.ang(v, pv); if (g.nd(g.deg(a2 - a1)) > 180) [a1, a2] = [a2, a1];
        if (ang === 90) d.right(c, v, g.sub(nx, v), g.sub(pv, v), 20, { w: 3 }); else d.arc(c, v, a1, a2, 28, { fill: N.WASH, w: 2.5 });
        const inw = g.unit(g.sub(cen, v)); d.text(c, `${ang}°`, v.x + inw.x * 62, v.y + inw.y * 62, { size: 26, color: N.DEEP });
        const mm = g.lerp(v, nx, .5), out = g.unit(g.sub(mm, cen)), len = Math.round(g.dist(v, nx) / g.dist(pts[0], pts[1]) * P.sides[0] * 10) / 10;
        d.text(c, `${N.fmt(len)} cm`, mm.x + out.x * 30, mm.y + out.y * 30, { size: 22, color: N.SOFT, font: N.MONO });
        d.dot(c, v, { r: 5.5 });
      });
    };
    S.ask();
    N.say(`Düzgün mü? ${k + 1} / 4: Bu ${P.n === 4 ? 'dörtgenin' : P.n === 5 ? 'beşgenin' : 'altıgenin'} kenarlarına ve açılarına bak. <em>Düzgün çokgen</em>: bütün kenarları eş <b>ve</b> bütün açıları eş.`);
    const el = N.panel('<div class="card"><span class="label">Düzgün mü?</span><div id="cb"></div><div id="cn"></div></div>');
    N.choices(el.querySelector('#cb'), [{ t: 'Düzgün çokgen', ok: P.ok }, { t: 'Düzgün değil', ok: !P.ok }], (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say('Hem kenarlara hem açılara bak: <b>ikisi de</b> eş olmalı.', 'bad'); return; }
      N.sfx.good(); if (first) N.addScore(15, { x: 500, y: 335 }); N.say(P.why, 'good'); nextBtn(el.querySelector('#cn'));
    });
  }

  /* ── 5. olabilir mi? ── */
  const CLAIMS = [
    { q: 'Bir üçgenin <b>iki dik açısı</b> olabilir mi?', o: ['Evet', 'Hayır'], ok: 1, why: '90° + 90° = 180° olur; üçüncü açıya hiç yer kalmaz. <b>Olamaz.</b> Aynı nedenle iki geniş açısı da olamaz.', draw: 'twoRight' },
    { q: 'Bir <b>ikizkenar</b> üçgen <b>geniş açılı</b> olabilir mi?', o: ['Evet', 'Hayır'], ok: 0, why: 'Olabilir! Tepe açısı 120°, taban açıları 30° ve 30° olan ikizkenar üçgen gibi. Tabloda da kurmuştun.', draw: 'obtuseIso' },
  ];
  function stepClaim(k) {
    const Q = CLAIMS[k]; st.tri = null;
    st.view = (c) => {
      if (Q.draw === 'obtuseIso') { drawTri(c, triFromAngles(30, 30), { names: ['A', 'B', 'C'] }); return; }
      const A = { x: 300, y: 470 }, B = { x: 700, y: 470 };
      d.seg(c, A, B, { w: 3.6 }); d.seg(c, A, { x: 300, y: 80 }, { w: 3.6 }); d.seg(c, B, { x: 700, y: 80 }, { w: 3.6 });
      d.right(c, A, { x: 1, y: 0 }, { x: 0, y: -1 }, 22, { w: 3 }); d.right(c, B, { x: -1, y: 0 }, { x: 0, y: -1 }, 22, { w: 3 });
      d.text(c, 'paralel: hiç kesişmez!', 500, 140, { size: 32, color: N.SEAL }); d.text(c, '?', 500, 60, { size: 50, color: N.SEAL });
    };
    S.ask();
    N.say(`Olabilir mi? ${Q.q}`);
    const el = N.panel('<div class="card"><span class="label">Olabilir mi?</span><div id="cb"></div><div id="cn"></div></div>');
    N.choices(el.querySelector('#cb'), Q.o.map((t, i) => ({ t, ok: i === Q.ok })), (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say('Açıların toplamı 180° kuralını düşün.', 'bad'); return; }
      N.sfx.good(); if (first) N.addScore(20, { x: 500, y: 320 }); N.say(Q.why, 'good'); nextBtn(el.querySelector('#cn'));
    });
  }

  /* ── akış ── */
  function nextBtn(host) {
    host.innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">${st.si === STEPS.length - 1 ? 'Bitir →' : 'Devam →'}</button>`;
    const b = host.querySelector('button'); b.onclick = next; b.focus();
  }
  let kMiss = 0, kReg = 0, kClaim = 0;
  function next() {
    st.si++; st.dragOk = false; st.onChange = null; st.hot = -1; N.dots(STEPS.length, st.si);
    if (st.si >= STEPS.length) return N.finish({ id: 'ucgenin-sirri', title: 'Sır Çözüldü!', film: 'ucgenin-sirri', text: 'Üçgenin iç açıları toplamı 180°. Düzgün çokgende kenarlar da açılar da eş. Sıradaki oyun: <b>Pergel Ustası</b>.' });
    const s = STEPS[st.si];
    if (s === 'sir') return stepSecret();
    if (s === 'kayip') return stepMissing(kMiss++);
    if (s === 'tablo') return stepTable();
    if (s === 'duzgun') return stepRegular(kReg++);
    return stepClaim(kClaim++);
  }

  N.dots(STEPS.length, 0);
  st.tri = [{ x: 250, y: 470 }, { x: 760, y: 470 }, { x: 420, y: 150 }];
  st.view = (c) => drawTri(c, st.tri, { ticks: false });
  N.say('Ben <b>Nokta</b>. Üçgenlerin hepsi farklı görünür ama hepsinin ortak bir <em>sırrı</em> var. Onu bulup sonra üçgen avına çıkalım mı?');
  const el = N.panel(`<div class="card"><span class="label">Beş bölüm</span>
    <p><b>Sır</b> · <b>Kayıp açı</b> · <b>Üçgen tablosu</b> · <b>Düzgün mü?</b> · <b>Olabilir mi?</b></p>
    <p class="small">Köşeleri sürükleyebildiğin yerlerde özel konumlara gelince köşe kendiliğinden oturur: dik açı, eş kenarlar…</p>
    <button class="btn primary big" id="go" type="button">Sırrı ara →</button></div>`);
  el.querySelector('#go').addEventListener('click', next);
  S.ask();
  if (/onizleme/.test(location.search)) { st.view = (c) => drawTri(c, [{ x: 250, y: 470 }, { x: 760, y: 470 }, { x: 505, y: 28.3 }], { sides: true }); S.ask(); }
})();
