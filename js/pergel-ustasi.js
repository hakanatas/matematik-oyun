/* Pergel Ustası · MAT.5.3.7
   A ve B merkezli iki çember, bir kesişim noktası C: ABC üçgeni.
   |AC| A'nın yarıçapı, |BC| B'nin yarıçapı: hiç ölçmeden çeşitkenar, ikizkenar, eşkenar üçgen kur. */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640, CM = 50, A = { x: 330, y: 430 };
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));
  const KIND = ['çeşitkenar', 'ikizkenar', 'eşkenar'];

  // her açılışta yeni sayılar: tahmin edilecek üçgen türü, |AB| ve başlangıç açıklıkları değişir
  const tk = g.pick([2, 2, 1, 0]), tab = g.pick([4, 5, 6]);
  const tr = tk === 2 ? [tab, tab] : tk === 1 ? (() => { const k = tab + g.pick([-1, 1, 1.5]); return [k, k]; })() : [tab - 1, tab + 1.5];
  const kurAb = () => g.pick([5, 6, 7]);
  const kurM = (goal) => { const ab = kurAb(); let r; do { r = [g.pick([3, 3.5, 4, 4.5, 5]), g.pick([4, 4.5, 5, 5.5])]; } while (((s) => { const e = (s[0] === s[1]) + (s[1] === s[2]) + (s[0] === s[2]); return e >= 2 ? 2 : e === 1 ? 1 : 0; })([ab, r[0], r[1]]) === goal || r[0] + r[1] <= ab || Math.abs(r[0] - r[1]) >= ab); return { type: 'kur', ab, r, goal }; };
  const kab = g.pick([6, 7]), kr0 = g.pick([2, 2.5, 3]);
  const MISSIONS = [
    { type: 'tahmin', ab: tab, r: tr, kind: tk },
    ...g.shuffle([kurM(2), kurM(1), kurM(0)]),
    { type: 'kesis', ab: kab, r: [kr0, Math.max(1.5, kab - kr0 - g.pick([1, 1.5, 2]))] },
    { type: 'onerme' },
  ];
  N.max = 40 + 3 * 80 + 60 + 60;
  const st = { mi: -1, ab: 6, r: [4, 5], show: [1, 1], lock: [false, false], drag: -1, flower: 0, sweep: [1, 1] };

  const B = () => ({ x: A.x + st.ab * CM, y: A.y });
  const centers = () => [A, B()];
  const HANDLE_ANG = [g.rad(205), g.rad(-25)];
  const handle = (i) => g.polar(centers()[i], st.r[i] * CM, HANDLE_ANG[i]);
  const tri = () => { const [a, b] = centers(), pts = g.circles(a, st.r[0] * CM, b, st.r[1] * CM); return pts.length && Math.abs(pts[0].y - pts[1].y) > 1 ? pts : null; };
  const kindOf = () => { const s = [st.ab, st.r[0], st.r[1]]; const e = (s[0] === s[1]) + (s[1] === s[2]) + (s[0] === s[2]); return e >= 2 ? 2 : e === 1 ? 1 : 0; };

  /* ── çizim ── */
  function drawCompass(c, i) {
    const ctr = centers()[i], h = handle(i), m = g.lerp(ctr, h, .5), L = g.dist(ctr, h);
    const n = g.unit({ x: -(h.y - ctr.y), y: h.x - ctr.x }); const up = n.y < 0 ? n : g.mul(n, -1);
    const hinge = g.add(m, g.mul(up, Math.max(60, L * .55)));
    c.globalAlpha = .9;
    d.seg(c, ctr, hinge, { w: 5, color: N.INK }); d.seg(c, hinge, h, { w: 5, color: N.INK });
    d.seg(c, g.lerp(hinge, h, .82), h, { w: 6, color: N.AMBER });
    d.seg(c, hinge, g.add(hinge, g.mul(up, 24)), { w: 6, color: N.INK });
    c.beginPath(); c.arc(hinge.x, hinge.y, 7, 0, Math.PI * 2); c.fillStyle = N.SHEET; c.fill(); c.lineWidth = 3; c.strokeStyle = N.INK; c.stroke();
    c.globalAlpha = 1;
  }

  S.draw = (c) => {
    d.grid(c, W, H, CM, { ox: A.x, oy: A.y, color: 'rgba(23,20,17,.06)' });
    if (st.flower) return drawFlower(c, st.flower);
    const [a, b] = centers(), T = st.show[0] && st.show[1] && st.sweep[0] > .99 && st.sweep[1] > .99 ? tri() : null;
    const cols = [N.DEEP, '#5b4a3a'];
    [0, 1].forEach((i) => { if (st.show[i]) d.circle(c, centers()[i], st.r[i] * CM, { color: cols[i], w: 2.6, t: st.sweep[i], start: HANDLE_ANG[i] }); });
    if (T) {
      const C = T[0], k = kindOf();
      d.poly(c, [a, b, C], { fill: 'rgba(232,163,61,.24)', w: 4 });
      const sides = [[a, b, st.ab], [a, C, st.r[0]], [b, C, st.r[1]]], cnt = (v) => sides.filter((s) => s[2] === v).length;
      sides.forEach(([p, q, v], j) => {
        if (cnt(v) > 1) d.ticks(c, p, q, 1, { size: 10 });
        const mm = g.lerp(p, q, .5), cen = g.mul(g.add(g.add(a, b), C), 1 / 3), out = g.unit(g.sub(mm, cen));
        d.text(c, `${N.fmt(v)} cm`, mm.x + out.x * 34, mm.y + out.y * 34 + (j === 0 ? 4 : 0), { size: 28, color: j ? cols[j - 1] : N.INK });
      });
      d.dot(c, T[1], { r: 4.5, color: 'rgba(23,20,17,.35)', label: 'C′', lx: 14, ly: 18, lcolor: N.SOFT, size: 24 });
      d.dot(c, C, { r: 7, label: 'C', lx: 0, ly: -26 });
      if (st.showKind) d.text(c, `${KIND[k]} üçgen`, 500, 46, { size: 38, color: N.DEEP });
    } else {
      d.seg(c, a, b, { w: 4 });
      d.text(c, `${N.fmt(st.ab)} cm`, (a.x + b.x) / 2, a.y + 30, { size: 28 });
      if (st.show[0] && st.show[1] && st.sweep[0] > .99 && st.sweep[1] > .99) d.text(c, 'çemberler kesişmiyor: üçgen yok', 500, 46, { size: 34, color: N.SEAL });
    }
    [0, 1].forEach((i) => { if (st.show[i] && !st.lock[i] && st.sweep[i] > .99) { const h = handle(i); d.dot(c, h, { r: st.drag === i || st.hot === i ? 13 : 10, color: cols[i], ring: st.drag === i || st.hot === i ? N.AMBER : null }); } });
    if (st.active != null && st.show[st.active]) drawCompass(c, st.active);
    d.dot(c, a, { r: 7, label: 'A', lx: -22, ly: 20 }); d.dot(c, b, { r: 7, label: 'B', lx: 22, ly: 20 });
  };

  function drawFlower(c, t) {
    const O = { x: 500, y: 330 }, R = 92, cs = [O]; for (let k = 0; k < 6; k++) cs.push(g.polar(O, R, g.rad(90 + k * 60)));
    for (let k = 0; k < 6; k++) cs.push(g.polar(O, 2 * R, g.rad(90 + k * 60)), g.polar(O, R * Math.sqrt(3), g.rad(120 + k * 60)));
    const n = cs.length;
    cs.forEach((p, k) => { const lt = Math.max(0, Math.min(1, t * n - k)); if (lt > 0) d.circle(c, p, R, { color: k < 7 ? N.INK : N.DEEP, w: k < 7 ? 2.6 : 1.8, t: lt, start: g.rad(90) }); });
    if (t > .55) { c.globalAlpha = Math.min(1, (t - .55) * 3); const p = [O, cs[1], cs[2]]; d.poly(c, p, { fill: 'rgba(232,163,61,.35)', w: 3 }); c.globalAlpha = 1; }
    if (t > .99) d.text(c, 'yaşam çiçeği: hep aynı pergel açıklığı', 500, 610, { size: 30, color: N.DEEP });
  }

  /* ── yarıçap sürükleme ── */
  const setR = (i, v) => { v = Math.max(1, Math.min(10, Math.round(v * 2) / 2)); if (v !== st.r[i]) { st.r[i] = v; N.sfx.tick(); syncPanel(); } S.ask(); };
  S.onDown = (p) => { for (const i of [0, 1]) if (st.show[i] && !st.lock[i] && g.dist(p, handle(i)) < S.hit(26)) { st.drag = i; st.active = i; S.cursor('grabbing'); S.ask(); return; } };
  S.onMove = (p) => {
    if (!p) return;
    if (st.drag >= 0) { setR(st.drag, g.dist(centers()[st.drag], p) / CM); return; }
    const h = [0, 1].find((i) => st.show[i] && !st.lock[i] && g.dist(p, handle(i)) < S.hit(26)); const hv = h == null ? -1 : h;
    if (hv !== st.hot) { st.hot = hv; S.ask(); } S.cursor(hv >= 0 ? 'grab' : 'default');
  };
  S.onUp = () => { if (st.drag >= 0) { st.drag = -1; S.cursor('default'); S.ask(); } };

  function syncPanel() { [0, 1].forEach((i) => { const el = N.$(`#rv${i}`); if (el) el.textContent = N.fmt(st.r[i]); }); }
  function stepper(i, name) {
    return `<div class="row" style="margin-bottom:8px"><span style="width:118px;font-size:15px">${name} merkezli<br><span class="small">pergel açıklığı</span></span>
      <button class="btn" data-dr="${i},-1" type="button" aria-label="${name} yarıçapını azalt" ${st.lock[i] ? 'disabled' : ''}>−</button>
      <span class="big-read" style="font-size:34px;min-width:64px;text-align:center"><span id="rv${i}">${N.fmt(st.r[i])}</span><small style="font-size:18px"> cm</small></span>
      <button class="btn" data-dr="${i},1" type="button" aria-label="${name} yarıçapını artır" ${st.lock[i] ? 'disabled' : ''}>+</button></div>`;
  }
  function bindSteppers(el) { el.querySelectorAll('[data-dr]').forEach((b) => b.addEventListener('click', () => { const [i, s] = b.dataset.dr.split(',').map(Number); st.active = i; setR(i, st.r[i] + s * .5); })); }

  async function sweepIn(i) { st.show[i] = 1; st.active = i; st.sweep[i] = 0; N.sfx.draw(); await N.tween(900, (t) => { st.sweep[i] = t; S.ask(); }, (t) => t); }

  /* ── görevler ── */
  function setup(M) {
    st.ab = M.ab; st.r = M.r.slice(); st.lock = [false, false]; st.showKind = false; st.active = null; st.sweep = [1, 1]; st.show = [1, 1];
  }

  function mTahmin(M) {
    setup(M); st.show = [0, 0]; st.lock = [true, true]; S.ask();
    const same = M.r[0] === M.r[1];
    N.say(`|AB| = ${M.ab} cm. Pergeli <b>${N.fmt(M.r[0])} cm</b> açıp A merkezli, sonra ${same ? 'aynı açıklıkla' : `<b>${N.fmt(M.r[1])} cm</b> açıp`} B merkezli çember çizeceğim. Kesişim noktası C ise <em>ABC üçgeni nasıl olur?</em> Önce tahmin et!`);
    const el = N.panel('<div class="card"><span class="label">Görev 1 · Tahmin</span><div id="cb"></div><div id="cn"></div></div>');
    let guessed = false;
    N.choices(el.querySelector('#cb'), ['Çeşitkenar', 'İkizkenar', 'Eşkenar'].map((t, i) => ({ t, ok: i === M.kind, i })), async (o) => {
      if (guessed) return; guessed = true;
      const right = o.i === M.kind;
      el.querySelectorAll('.choice').forEach((b, i) => { b.disabled = true; if (i === M.kind) b.classList.add('ok'); });
      await sweepIn(0); await sweepIn(1); st.active = null; st.showKind = true; S.ask();
      N.addScore(right ? 40 : 10, { x: 500, y: 200 }); right ? N.sfx.good() : N.sfx.bad();
      const tail = M.kind === 2 ? `ikisi de ${N.fmt(M.r[0])} cm. |AB| de ${M.ab} cm. Üç kenar eşit: <b>eşkenar üçgen</b>.` : M.kind === 1 ? `ikisi de ${N.fmt(M.r[0])} cm ama |AB| = ${M.ab} cm. İki kenar eşit: <b>ikizkenar üçgen</b>.` : `${N.fmt(M.r[0])} cm ve ${N.fmt(M.r[1])} cm, |AB| = ${M.ab} cm. Üç kenar da farklı: <b>çeşitkenar üçgen</b>.`;
      N.say(`${right ? 'Tahminin doğru!' : 'Tahminin tutmadı ama bak:'} |AC| A’nın yarıçapı, |BC| B’nin yarıçapı: ${tail} Hiç cetvel kullanmadık!`, right ? 'good' : 'bad');
      nextBtn(el.querySelector('#cn'));
    }, 'three');
  }

  function mKur(M) {
    setup(M); S.ask();
    const goalTxt = ['bir <em>çeşitkenar</em> üçgen', '<em>ikizkenar</em> ama eşkenar olmayan bir üçgen', 'bir <em>eşkenar</em> üçgen'][M.goal];
    N.say(`|AB| = ${M.ab} cm. Pergel açıklıklarını ayarlayarak ${goalTxt} kur. Çemberin üstündeki tutamacı sürükle ya da − / + düğmelerini kullan.`);
    const el = N.panel(`<div class="card"><span class="label">Görev ${st.mi + 1} · ${KIND[M.goal]} kur</span>${stepper(0, 'A')}${stepper(1, 'B')}
      <button class="btn primary big" id="chk" type="button">Üçgenimi kontrol et</button><div id="cn"></div></div>`);
    bindSteppers(el); let tries = 0;
    el.querySelector('#chk').onclick = () => {
      const T = tri();
      if (!T) { tries++; N.sfx.bad(); return N.say('Çemberler kesişmiyor (ya da sadece değiyor), C noktası yok! Yarıçapları değiştir.', 'bad'); }
      const k = kindOf();
      if (k !== M.goal) {
        tries++; N.sfx.bad(); st.showKind = true; S.ask();
        const hint = M.goal === 2 ? 'Eşkenar için iki yarıçap da |AB| kadar olmalı.' : M.goal === 1 ? 'İkizkenar için iki kenar eşit olsun, üçü değil: örneğin iki yarıçap eşit ama |AB|’den farklı.' : 'Çeşitkenar için üç uzunluk da farklı olmalı: |AB|, r₁ ve r₂.';
        return N.say(`Bu bir <b>${KIND[k]}</b> üçgen. ${hint}`, 'bad');
      }
      st.showKind = true; st.lock = [true, true]; st.active = null; S.ask();
      N.sfx.good(); N.addScore(tries === 0 ? 80 : tries === 1 ? 55 : 30, T[0]); N.splash(T[0]);
      const why = M.goal === 2 ? `r₁ = r₂ = |AB| = ${M.ab} cm: üç kenar da eşit.` : M.goal === 1 ? `${st.r[0] === st.r[1] ? `r₁ = r₂ = ${N.fmt(st.r[0])} cm: |AC| = |BC|.` : `Bir yarıçap |AB|’ye eşit: iki kenar eşit.`}` : 'Üç uzunluk da farklı.';
      N.say(`İşte <b>${KIND[M.goal]}</b> üçgen! ${why} Ölçmeden, sadece çemberin yarıçapıyla.`, 'good');
      el.querySelector('#chk').remove(); el.querySelectorAll('[data-dr]').forEach((b) => (b.disabled = true)); nextBtn(el.querySelector('#cn'));
    };
  }

  function mKesis(M) {
    setup(M); st.lock = [true, false]; S.ask();
    N.say(`|AB| = ${M.ab} cm, A merkezli çemberin yarıçapı <b>${N.fmt(M.r[0])} cm</b> ve değişmiyor. B’nin yarıçapı ${N.fmt(M.r[1])} cm iken üçgen oluşmuyor! B’nin pergel açıklığını ayarlayıp <em>üçgeni kurtar</em>.`);
    const el = N.panel(`<div class="card"><span class="label">Görev ${st.mi + 1} · Kesiştir</span>${stepper(0, 'A')}${stepper(1, 'B')}
      <button class="btn primary big" id="chk" type="button">Üçgen oldu mu?</button><div id="cn"></div></div>`);
    bindSteppers(el); let tries = 0;
    el.querySelector('#chk').onclick = () => {
      const T = tri();
      if (!T) { tries++; N.sfx.bad(); const s = st.r[0] + st.r[1]; return N.say(s <= st.ab ? `${N.fmt(st.r[0])} + ${N.fmt(st.r[1])} = ${N.fmt(s)} cm; |AB| = ${st.ab} cm. Yarıçaplar toplamı |AB|’den <b>büyük</b> olmalı ki çemberler kesişsin.` : 'Bu kez B’nin çemberi A’nınkini içine aldı. Biraz küçült.', 'bad'); }
      st.lock = [true, true]; st.showKind = true; S.ask(); N.sfx.good(); N.addScore(tries ? 35 : 60, T[0]); N.splash(T[0]);
      N.say(`Kurtardın! ${N.fmt(st.r[0])} + ${N.fmt(st.r[1])} > ${st.ab}: çemberler iki noktada kesişti, C doğdu. Yarıçaplar çok kısa olursa çemberler buluşmaz, üçgen de olmaz.`, 'good');
      el.querySelector('#chk').remove(); el.querySelectorAll('[data-dr]').forEach((b) => (b.disabled = true)); nextBtn(el.querySelector('#cn'));
    };
  }

  function mOnerme() {
    setup({ ab: 6, r: [6, 6] }); st.lock = [true, true]; st.showKind = true; S.ask();
    N.say('Son olarak bir pergel ustası gibi <em>önermelerini</em> yaz: hangileri doğru? Hepsini işaretle.');
    const CL = [
      { t: 'İki çemberin yarıçapları eşitse ABC ikizkenardır (ya da eşkenardır).', ok: true },
      { t: 'İki yarıçap da |AB|’ye eşitse ABC eşkenardır.', ok: true },
      { t: '|AB|, r₁ ve r₂ birbirinden farklıysa ABC çeşitkenardır.', ok: true },
      { t: 'İki çember her zaman kesişir.', ok: false },
      { t: 'Eşkenar üçgen kurmak için cetvelle üç kenarı da ölçmek gerekir.', ok: false },
    ];
    const el = N.panel(`<div class="card"><span class="label">Görev ${st.mi + 1} · Önermeler</span>
      ${CL.map((c, i) => `<label style="display:flex;gap:10px;align-items:flex-start;margin:0 0 9px;font-size:15.5px;cursor:pointer"><input type="checkbox" data-i="${i}" style="width:20px;height:20px;accent-color:#171411;margin-top:2px"> <span>${c.t}</span></label>`).join('')}
      <button class="btn primary big" id="chk" type="button">Kontrol et</button><div id="cn"></div></div>`);
    let tries = 0;
    el.querySelector('#chk').onclick = () => {
      const picked = [...el.querySelectorAll('[data-i]')].map((b) => b.checked), wrong = CL.map((c, i) => c.ok !== picked[i]);
      el.querySelectorAll('label').forEach((l, i) => { l.style.color = wrong[i] ? 'var(--seal)' : ''; });
      if (wrong.some(Boolean)) { tries++; N.sfx.bad(); return N.say(`Kırmızı olanlara bir daha bak. ${wrong[3] ? 'Görev 5’te çemberler kesişmemişti!' : wrong[4] ? 'Biz hiç ölçmeden kurduk!' : 'Yarıçap = kenar uzunluğu: |AC| = r₁, |BC| = r₂.'}`, 'bad'); }
      N.sfx.good(); N.addScore(tries ? 30 : 60, { x: 500, y: 200 }); el.querySelector('#chk').remove();
      N.say('Tam bir pergel ustası! Kenarlarına göre üçgen kurmanın en kolay yolu <b>çemberin yarıçapı</b>. Öklid de “Elemanlar”ın ilk önermesinde eşkenar üçgeni böyle kurmuştu.', 'good');
      const host = el.querySelector('#cn'); host.innerHTML = '<button class="btn primary big" type="button" style="margin-top:10px">Ödülü gör →</button>';
      host.querySelector('button').onclick = finale;
    };
  }

  async function finale() {
    N.panel('<div class="card"><span class="label">Ödül</span><p>Aynı pergel açıklığıyla çizilen çemberler: <b>yaşam çiçeği</b>. İçinde kaç eşkenar üçgen saklı?</p></div>');
    N.say('Bak, aynı pergel açıklığıyla bir süsleme çiziyorum…', 'good');
    await N.tween(4200, (t) => { st.flower = Math.max(.001, t); S.ask(); }, (t) => t);
    N.say('<b>Yaşam çiçeği</b>: hepsi aynı pergel açıklığıyla. Turuncu eşkenar üçgeni gördün mü?', 'good');
    await N.wait(2200);
    N.dots(MISSIONS.length, MISSIONS.length);
    N.finish({ id: 'pergel-ustasi', title: 'Pergel Ustası!', film: 'cemberlerle-ucgen', text: 'İki çember, bir kesişim: kenarlar yarıçaplardan gelir. Geometrik Şekiller temasının bütün oyunlarını bitirdin!' });
  }

  function nextBtn(host) {
    host.innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">Sonraki görev →</button>`;
    const b = host.querySelector('button'); b.onclick = next; b.focus();
  }
  function next() {
    st.mi++; N.dots(MISSIONS.length, st.mi);
    const M = MISSIONS[st.mi];
    if (M.type === 'tahmin') return mTahmin(M);
    if (M.type === 'kur') return mKur(M);
    if (M.type === 'kesis') return mKesis(M);
    return mOnerme();
  }

  N.dots(MISSIONS.length, 0);
  st.ab = 6; st.r = [6, 4.5]; st.lock = [true, true]; st.active = 0; S.ask();
  N.say('Ben <b>Nokta</b>, bu da pergelim. Cetvelle hiç ölçmeden <em>eşkenar</em>, <em>ikizkenar</em> ve <em>çeşitkenar</em> üçgen kurabilir miyiz? Sırrı çemberlerde!');
  const el = N.panel(`<div class="card"><span class="label">Nasıl oynanır?</span>
    <p>A ve B merkezli iki çember çiz; üstteki kesişim noktası <b>C</b>. ABC üçgeninin kenarları: |AB|, A’nın yarıçapı ve B’nin yarıçapı.</p>
    <p class="small">Pergel açıklığını çemberin tutamacını sürükleyerek ya da − / + ile değiştir.</p>
    <button class="btn primary big" id="go" type="button">Pergeli al →</button></div>`);
  el.querySelector('#go').addEventListener('click', next);
  if (/onizleme/.test(location.search)) { st.r = [6, 6]; st.showKind = true; st.active = 1; S.ask(); }
  if (/cicek/.test(location.search)) { st.flower = 1; S.ask(); }
})();
