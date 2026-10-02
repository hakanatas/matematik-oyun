/* Araç Ustası · MAT.5.3.1 – 5.3.2
   Her adımda önce doğru aracı seç (ölçüsüz cetvel, pergel, gönye, açıölçer), sonra tahtada çiz.
   Parçalar birleşince Nokta'nın yelkenlisi ortaya çıkar; sonunda çizimlerden çıkarım soruları. */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640, SEA = 470;
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));

  const P = {
    D: { x: 70, y: SEA, lx: -4, ly: -22 }, E: { x: 930, y: SEA, lx: 4, ly: -22 },
    A: { x: 500, y: 440, lx: -18, ly: 2 }, B: { x: 500, y: 170, lx: -16, ly: -14 }, C: { x: 652, y: 412, lx: 18, ly: -6 },
    O: { x: 820, y: 130, lx: -16, ly: -16 }, R: { x: 870, y: 130, lx: 16, ly: -10 },
    T: { x: 845, y: 173.3, lx: -14, ly: 14 }, S: { x: 895, y: 260, lx: -16, ly: 4 },
    M: { x: 240, y: 214, lx: 0, ly: 26 }, U: { x: 160, y: 168, lx: -10, ly: -16 }, V: { x: 320, y: 168, lx: 10, ly: -16 },
    W: { x: 150, y: 570, lx: -18, ly: -14 },
  };
  const HULL = [{ x: 352, y: 440 }, { x: 668, y: 440 }, { x: 622, y: 492 }, { x: 398, y: 492 }];
  const FOOT = { x: P.M.x, y: SEA };

  const TOOLS = {
    cetvel: { ad: 'Ölçüsüz cetvel', alt: 'çizgeç', svg: '<rect x="3" y="15" width="58" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M10 21.5h44" stroke="currentColor" stroke-width="1.2" opacity=".35"/>' },
    pergel: { ad: 'Pergel', alt: 'çember', svg: '<circle cx="32" cy="7" r="3.4" fill="currentColor"/><path d="M32 9 L19 40 M32 9 L45 38" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M45 38 l1.5 4" stroke="#e8a33d" stroke-width="3" stroke-linecap="round"/><circle cx="19" cy="40" r="1.6" fill="currentColor"/>' },
    gonye: { ad: 'Gönye', alt: 'dik açı', svg: '<path d="M12 40 L12 5 L56 40 Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M19 33 L19 22 L33 33 Z" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".55"/><path d="M12 33 h7 v7" fill="none" stroke="#e8a33d" stroke-width="2.2"/>' },
    aciolcer: { ad: 'Açıölçer', alt: 'derece', svg: '<path d="M7 38 A25 25 0 0 1 57 38 Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M32 38 L32 31 M14 21 l4 4 M50 21 l-4 4 M32 13 v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="32" cy="38" r="2.2" fill="#e8a33d"/>' },
  };

  /* görevler: önce araç, sonra çizim */
  const TASKS = [
    { tool: 'cetvel', kind: 'line', pts: ['D', 'E'], name: 'Deniz',
      say: 'Yelkenlimin gövdesi hazır, gerisi sende! Önce deniz: <b>D</b> ve <b>E</b> noktalarından geçen <em>DE doğrusu</em>. Hangi araçla çizersin?',
      done: 'Doğrunun iki yanı da sonsuza gider; uçlardaki oklar bunu anlatır. Adını küçük harfle de verebiliriz: <b>d doğrusu</b>.' },
    { tool: 'cetvel', kind: 'seg', pts: ['A', 'B'], name: 'Direk',
      say: 'Şimdi direk: <em>[AB] doğru parçası</em>. Doğrudan farkı ne? İki ucu da belli!',
      done: '[AB] iki uç noktası olan, ölçülebilen bir parça. Uzunluğu |AB| diye yazılır.' },
    { tool: 'cetvel', kind: 'segs', pts: ['B', 'C', 'A'], pairs: [['B', 'C'], ['C', 'A']], name: 'Yelken',
      say: 'Rüzgâr esiyor, yelken lazım: önce <em>[BC]</em>, sonra <em>[CA]</em> doğru parçası.',
      done: 'Üç doğru parçası birleşti, yelken bir üçgen oldu.' },
    { tool: 'pergel', kind: 'circle', pts: ['O', 'R'], name: 'Güneş',
      say: 'Güneş doğuyor: merkezi <b>O</b> olan ve <b>R</b>’den geçen <em>çember</em>. O’ya eşit uzaklıktaki tüm noktalar…',
      done: 'Çemberin her noktası merkeze eşit uzaklıkta. |OR| bu çemberin <b>yarıçapı</b>.' },
    { tool: 'cetvel', kind: 'ray', pts: ['T', 'S'], name: 'Işık',
      say: 'Güneşten bir ışık huzmesi: <b>T</b>’den başlayıp <b>S</b>’den geçen <em>[TS ışını</em>.',
      done: 'Işının bir başlangıç noktası var, öbür yanı sonsuza gider.' },
    { tool: 'cetvel', kind: 'angle', pts: ['M', 'U', 'V'], name: 'Martı',
      say: 'Bir martı uçuyor! Kanatları bir <em>açı</em>: köşesi <b>M</b>, kolları <b>[MU</b> ve <b>[MV</b> ışınları.',
      done: 'Aynı noktadan çıkan iki ışın bir açı oluşturdu: <b>UMV</b> açısı, köşesi M.' },
    { tool: 'gonye', kind: 'perp', pts: ['M'], name: 'Dalış',
      say: 'Martı balık gördü, denize <em>en kısa yoldan</em> dalacak. M’den denize bir <em>dikme</em> çizelim.',
      done: 'Dikme denizle 90° yapar ve M’den denize giden en kısa yoldur.' },
    { tool: 'gonye', kind: 'par', pts: ['W'], name: 'Deniz dibi',
      say: 'Son olarak deniz dibi: <b>W</b>’dan geçen ve denize <em>paralel</em> bir doğru. Önce denize eşit uzaklıkta noktalar bulmalıyız.',
      done: 'Doğru W’dan da geçti! Paralel doğrular hiç kesişmez; aralarındaki uzaklık her yerde aynı.' },
  ];

  const QUIZ = [
    { q: '<b>A</b> ve <b>B</b> noktalarından kaç farklı doğru geçer?', opts: ['1', '2', 'Sonsuz'], ok: 0, demo: 'twoPts',
      why: 'İki noktadan yalnız <b>bir</b> doğru geçer. Başka bir doğru denersen ya noktalardan birini kaçırır ya da aynı doğru olur.' },
    { q: 'Tek bir <b>O</b> noktasından kaç farklı doğru geçebilir?', opts: ['1', '2', 'Sonsuz'], ok: 2, demo: 'onePt',
      why: 'Bir noktadan <b>sonsuz</b> doğru geçer; döndürdükçe yenisi çıkar.' },
    { q: 'Güneşin merkezi O’dan çemberin üstündeki noktalara çizilen doğru parçaları için ne söylenir?', opts: ['Hepsi eşit uzunlukta', 'Hepsi farklı uzunlukta', 'Bazıları eşit'], ok: 0, demo: 'radii', one: true,
      why: 'Hepsi birer <b>yarıçap</b>, hepsi eşit. Çemberi bu yüzden pergelle çizeriz.' },
    { q: 'M’den denize kaç farklı <b>dikme</b> çizilebilir?', opts: ['1', '2', 'Sonsuz'], ok: 0, demo: 'perps',
      why: 'Bir doğruya dışındaki bir noktadan <b>yalnız bir</b> dikme çizilir. Diğer yollar eğik ve daha uzun.' },
    { q: 'Hangisinin <b>hiç uç noktası yoktur</b>?', opts: ['Doğru parçası', 'Işın', 'Doğru'], ok: 2, demo: 'kinds',
      why: 'Doğru parçasının iki, ışının bir uç noktası var; doğru ise iki yana sonsuza gider.' },
    { q: 'Pergelin açıklığını hiç değiştirmeden iki çember çizdin. Yarıçapları için ne söylenir?', opts: ['Eşittir', 'Farklıdır'], ok: 0, demo: 'twoCircles',
      why: 'Pergel açıklığı yarıçaptır. Açıklık aynıysa yarıçaplar <b>eşit</b>.' },
  ];

  N.max = TASKS.length * 100 + QUIZ.length * 50;
  const st = { ti: 0, phase: 'intro', tool: null, pen: 100, clicks: [], pair: 0, extra: {}, objs: [], shown: new Set(), ghost: null, finale: 0, overlay: null };

  /* ── çizim ── */
  const pt = (k) => P[k] || st.extra[k];
  S.draw = (c) => {
    // gövde (hazır)
    d.poly(c, HULL, { fill: st.finale ? `rgba(23,20,17,${.12 + .6 * st.finale})` : 'rgba(23,20,17,.1)', color: N.INK, w: 3 });
    if (st.finale) {
      const sail = [P.B, P.C, P.A];
      d.poly(c, sail, { fill: `rgba(232,163,61,${.45 * st.finale})`, noStroke: true });
      d.circle(c, P.O, 50, { fill: `rgba(232,163,61,${.7 * st.finale})`, noStroke: true });
      c.globalAlpha = st.finale;
      for (let i = 0; i < 4; i++) { // dalgalar
        c.strokeStyle = 'rgba(23,20,17,.35)'; c.lineWidth = 2.5; c.beginPath();
        const y = SEA + 22 + i * 18, x0 = 30 + (i % 2) * 40;
        for (let x = x0; x < 980; x += 60) { c.moveTo(x, y); c.quadraticCurveTo(x + 15, y - 8, x + 30, y); }
        c.stroke();
      }
      c.globalAlpha = 1;
    }
    for (const o of st.objs) drawObj(c, o);
    // lastik bant (çizim sürerken)
    const h = S.hover;
    if (st.phase === 'draw' && st.clicks.length && h) {
      const T = TASKS[st.ti], a = T.kind === 'angle' && !st.subPar ? P.M : pt(st.clicks[st.clicks.length - 1]);
      if (T.kind === 'circle') d.circle(c, a, g.dist(a, h), { color: N.SOFT, w: 2, dash: [8, 8] });
      else if (T.kind !== 'perp') d.seg(c, a, h, { color: N.SOFT, w: 2, dash: [8, 8] });
    }
    if (st.ghost) drawGhost(c, st.ghost);
    if (st.parHover != null) { // gönye denizin üstünde: dik ve 100 birim aşağı
      const x = st.parHover; c.save(); c.translate(x, SEA); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 130); c.lineTo(x < 500 ? 90 : -90, 0); c.closePath();
      c.fillStyle = 'rgba(232,163,61,.14)'; c.fill(); c.strokeStyle = N.DEEP; c.lineWidth = 2; c.stroke(); c.restore();
      d.seg(c, { x, y: SEA }, { x, y: SEA + 100 }, { color: N.DEEP, w: 2, dash: [6, 6] }); d.dot(c, { x, y: SEA + 100 }, { r: 4, color: N.DEEP });
    }
    // noktalar
    for (const k of st.shown) {
      const p = pt(k); if (!p) continue;
      const hot = st.phase === 'draw' && h && g.dist(h, p) < S.hit(26);
      d.dot(c, p, { r: 6, label: k.replace(/\d/, (m) => '₁₂'[m - 1]), lx: p.lx, ly: p.ly, ring: hot ? N.AMBER : st.clicks.includes(k) ? N.DEEP : null, color: p.amber ? N.DEEP : N.INK });
    }
    if (st.shown.has('D')) d.text(c, 'd', 960, SEA + 26, { size: 30, color: N.SOFT });
    if (st.overlay) st.overlay(c);
  };

  function drawObj(c, o) {
    const t = o.t;
    const st2 = { color: o.color || N.INK, w: o.w || 3.2, t, dash: o.dash };
    if (o.k === 'seg') d.seg(c, o.a, o.b, st2);
    else if (o.k === 'ray') d.ray(c, o.a, o.b, { ...st2, ext: o.ext });
    else if (o.k === 'line') d.line(c, o.a, o.b, { ...st2, ext: o.ext == null ? 40 : o.ext });
    else if (o.k === 'circle') d.circle(c, o.c, o.r, { ...st2, start: o.start || 0 });
    else if (o.k === 'arc') { c.globalAlpha = t; d.arc(c, o.v, o.a1, o.a2, o.r, { fill: N.WASH }); c.globalAlpha = 1; }
    else if (o.k === 'right') { c.globalAlpha = t; d.right(c, o.v, o.u, o.w2, 16); c.globalAlpha = 1; }
  }

  function drawGhost(c, gh) {
    // gönye: dik köşesi denizde, bir dik kenarı denizin üstünde, öbürü M'ye doğru
    const f = gh.f, ok = gh.ok, col = ok ? N.DEEP : N.SOFT;
    c.save(); c.translate(f.x, f.y);
    const side = gh.side || 1;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -150); c.lineTo(110 * side, 0); c.closePath();
    c.fillStyle = ok ? 'rgba(232,163,61,.16)' : 'rgba(255,250,240,.5)'; c.fill();
    c.strokeStyle = col; c.lineWidth = 2; c.stroke();
    c.restore();
    d.seg(c, P.M, f, { color: ok ? N.INK : N.SEAL, w: 3, dash: ok ? [] : [10, 8] });
    if (ok) d.right(c, f, { x: 0, y: -1 }, { x: side, y: 0 }, 16);
    else {
      const a = Math.round(g.angleAt(P.M, f, { x: f.x + 100, y: f.y }));
      d.text(c, `${Math.min(a, 180 - a)}°`, f.x + (f.x > P.M.x ? -44 : 44), f.y - 22, { size: 26, color: N.SEAL });
    }
    d.text(c, `${N.fmt(g.dist(P.M, f) / 40, 1)} birim`, (P.M.x + f.x) / 2 + 52, (P.M.y + f.y) / 2, { size: 24, color: ok ? N.DEEP : N.SEAL });
  }

  const add = async (o, ms = 650) => { o.t = 0; st.objs.push(o); N.sfx.draw(); await N.tween(ms, (t) => { o.t = t; S.ask(); }); };

  /* ── arayüz ── */
  function toolPanel() {
    const T = TASKS[st.ti];
    const el = N.panel(`<div class="card"><span class="label">${st.ti + 1}. adım · ${T.name}</span><h3>Hangi araç?</h3>
      <div class="tools">${Object.entries(TOOLS).map(([k, t]) => `<button class="tool" type="button" data-tool="${k}"><svg viewBox="0 0 64 44" aria-hidden="true">${t.svg}</svg>${t.ad}<small>${t.alt}</small></button>`).join('')}</div></div>`);
    el.querySelectorAll('.tool').forEach((b) => b.addEventListener('click', () => pickTool(b.dataset.tool, b)));
  }

  function wrongTool(need, got) {
    if (got === 'aciolcer') return 'Açıölçer açıları <b>ölçer</b>; çizgi ya da çember çizmez.';
    if (need === 'cetvel') return got === 'pergel' ? 'Pergel bir merkeze eşit uzaklıktaki noktaları, yani <b>çember</b> çizer. Burada dümdüz bir çizgi lazım.' : 'Gönyenin asıl işi <b>dik açı</b>. Düz bir çizgi için ölçüsüz cetvel yeter.';
    if (need === 'pergel') return 'Cetvelle düz çizilir. O’ya <b>eşit uzaklıktaki</b> tüm noktalar için hangi araç?';
    return got === 'pergel' ? 'Pergel çember çizer. Bize köşesi <b>dik açı</b> olan bir araç lazım.' : 'Cetvel düz çizer ama dik açıyı garanti etmez. Köşesi <b>dik açı</b> olan araç hangisi?';
  }

  function pickTool(k, btn) {
    if (st.phase !== 'tool') return;
    const need = st.needTool || TASKS[st.ti].tool;
    if (k !== need) {
      btn.classList.remove('no'); void btn.offsetWidth; btn.classList.add('no');
      st.pen = Math.max(30, st.pen - 25); N.sfx.bad(); N.say(wrongTool(need, k), 'bad'); return;
    }
    btn.classList.add('on'); N.sfx.good(); st.tool = k; st.phase = 'draw'; st.clicks = [];
    N.$('#panel').querySelectorAll('.tool').forEach((b) => (b.disabled = true));
    N.say(drawHint(), 'good'); S.cursor('crosshair'); S.ask();
  }

  function drawHint() {
    const T = TASKS[st.ti];
    if (st.subPar) return 'Cetvelle iki işaretli noktayı birleştir: <b>P₁</b> ve <b>P₂</b>’ye dokun.';
    switch (T.kind) {
      case 'line': case 'seg': return `Doğru seçim! Şimdi tahtada <b>${T.pts[0]}</b> ve <b>${T.pts[1]}</b> noktalarına dokun.`;
      case 'segs': { const [a, b] = T.pairs[st.pair]; return `${st.pair ? 'Şimdi ikinci parça' : 'Doğru seçim!'}: <b>${a}</b> ve <b>${b}</b> noktalarına dokun.`; }
      case 'circle': return 'Pergelin sivri ucu merkeze: önce <b>O</b>’ya, sonra açıklığı ayarlamak için <b>R</b>’ye dokun.';
      case 'ray': return 'Işın başlangıç noktasından çizilir: önce <b>T</b>’ye, sonra <b>S</b>’ye dokun.';
      case 'angle': return st.clicks.length ? 'Şimdi ikinci kolun noktası.' : 'Önce köşeye, <b>M</b>’ye dokun; sonra kolların noktalarına (<b>U</b>, <b>V</b>).';
      case 'perp': return 'Gönyenin bir kenarını M’ye dayayalım: önce <b>M</b>’ye dokun.';
      case 'par': return 'Gönyeyi denizin üstünde kaydır: denizin <b>iki farklı yerine</b> dokun. Her dokunuşta denize dik, W kadar uzakta bir nokta işaretleriz.';
    }
    return '';
  }

  /* ── tahtaya dokunma ── */
  const hitPt = (p) => { let best = null, bd = S.hit(28); for (const k of st.shown) { const q = pt(k); if (!q) continue; const dd = g.dist(p, q); if (dd < bd) { bd = dd; best = k; } } return best; };
  const miss = (msg) => { st.pen = Math.max(30, st.pen - 15); N.sfx.bad(); N.say(msg, 'bad'); };

  S.onMove = (p) => {
    const T = TASKS[st.ti];
    if (st.phase === 'draw' && T && T.kind === 'perp' && st.clicks.length && p) {
      const x = Math.max(60, Math.min(940, p.x)), ok = Math.abs(x - FOOT.x) < 16;
      st.ghost = { f: ok ? FOOT : { x, y: SEA }, ok, side: 1 };
      if (ok && !st.wasOk) N.sfx.snap(); st.wasOk = ok;
    } else if (st.phase === 'draw' && T && T.kind === 'par' && !st.subPar && p && Math.abs(p.y - SEA) < 60) {
      st.parHover = Math.max(80, Math.min(920, p.x));
    } else st.parHover = null;
    S.ask();
  };

  S.onDown = async (p) => {
    if (st.phase !== 'draw' || st.busy) return;
    const T = TASKS[st.ti];
    if (st.subPar || ['line', 'seg', 'segs', 'ray', 'circle', 'angle'].includes(T.kind)) return clickPoints(T, p);
    if (T.kind === 'perp') {
      if (!st.clicks.length) { const k = hitPt(p); if (k === 'M') { st.clicks = ['M']; N.sfx.tick(); N.say('Şimdi gönyeyi denizin üstünde kaydır. Dik köşe tam yerine oturunca kehribar olur; o zaman dokun.'); } else if (k) miss(`Bu ${k}. Dikme <b>M</b>’den inecek.`); return; }
      const gh = st.ghost; if (!gh) return;
      if (!gh.ok) { const a = Math.round(g.angleAt(P.M, gh.f, { x: gh.f.x + 100, y: gh.f.y })); return miss(`Bu yol eğik: denizle ${Math.min(a, 180 - a)}° yapıyor ve daha uzun. Dikme denizle <b>90°</b> yapmalı.`); }
      st.ghost = null; st.busy = true;
      await add({ k: 'seg', a: P.M, b: FOOT, w: 3.2 });
      await add({ k: 'right', v: FOOT, u: { x: 0, y: -1 }, w2: { x: 1, y: 0 } }, 300);
      st.extra.H = { ...FOOT, lx: -18, ly: 22 }; st.shown.add('H');
      st.busy = false; return taskDone();
    }
    if (T.kind === 'par') {
      if (Math.abs(p.y - SEA) > 60) return miss('Gönyeyi <b>denizin (d doğrusunun) üstüne</b> koy: denizin çizgisine yakın bir yere dokun.');
      const x = Math.max(80, Math.min(920, p.x)), marks = st.parMarks || (st.parMarks = []);
      if (marks.some((m) => Math.abs(m - x) < 110)) return miss('İkinci noktayı ilkinden biraz <b>uzağa</b> koy; yoksa doğru belirsiz olur.');
      marks.push(x); st.busy = true;
      const top = { x, y: SEA }, bot = { x, y: SEA + 100 };
      await add({ k: 'seg', a: top, b: bot, color: N.DEEP, w: 2.2, dash: [7, 7] }, 450);
      await add({ k: 'right', v: top, u: { x: 0, y: 1 }, w2: { x: x < 500 ? 1 : -1, y: 0 } }, 200);
      const key = 'P' + marks.length; st.extra[key] = { ...bot, lx: 18, ly: 18, amber: true }; st.shown.add(key);
      st.busy = false; S.ask();
      if (marks.length === 1) N.say('Bir nokta işaretlendi: denize dik ve W kadar uzakta (100 birim). Denizin <b>başka bir yerine</b> daha dokun.', 'good');
      else {
        st.subPar = true; st.phase = 'tool'; st.needTool = 'cetvel'; st.clicks = [];
        N.say('İki nokta da denize aynı uzaklıkta. Şimdi bunları birleştirecek aracı seç.', 'good'); toolPanel();
      }
    }
  };

  async function clickPoints(T, p) {
    const k = hitPt(p); if (!k) return;
    if (st.clicks.includes(k)) return;
    let need;
    if (st.subPar) need = ['P1', 'P2'];
    else if (T.kind === 'segs') need = T.pairs[st.pair];
    else need = T.pts;
    if (!need.includes(k)) return miss(`Bu <b>${k}</b> noktası. Bize ${need.map((x) => `<b>${x}</b>`).join(' ve ')} lazım.`);
    const first = st.clicks.length === 0;
    if (first && T.kind === 'ray' && !st.subPar && k !== 'T') return miss('Işın <b>başlangıç noktasından</b> çizilir. Önce T’ye dokun.');
    if (first && T.kind === 'circle' && k !== 'O') return miss('Pergelin sivri ucu <b>merkeze</b> konur. Önce O’ya dokun.');
    if (first && T.kind === 'angle' && k !== 'M') return miss('Açı çizerken önce <b>köşeden</b> başla: M.');
    st.clicks.push(k); N.sfx.tick(); S.ask();
    if (T.kind === 'angle' && !st.subPar) {
      if (st.clicks.length >= 2) {
        st.busy = true; await add({ k: 'ray', a: P.M, b: pt(k), ext: 60 }); st.busy = false;
        if (st.clicks.length === 3) {
          const a1 = g.ang(P.M, P.V), a2 = g.ang(P.M, P.U);
          await add({ k: 'arc', v: P.M, a1, a2, r: 34 }, 300); return taskDone();
        }
        st.clicks = ['M', k]; N.say('Bir kol tamam. Şimdi öbür kolun noktasına dokun.');
      }
      return;
    }
    if (st.clicks.length < 2) return;
    const [a, b] = st.clicks.map(pt); st.busy = true;
    if (st.subPar) { await add({ k: 'line', a: pt('P1'), b: pt('P2'), ext: 900 }, 800); st.busy = false; return taskDone(); }
    if (T.kind === 'line') await add({ k: 'line', a, b, ext: 26 }, 800);
    else if (T.kind === 'seg' || T.kind === 'segs') await add({ k: 'seg', a, b });
    else if (T.kind === 'ray') await add({ k: 'ray', a, b, ext: 150 });
    else if (T.kind === 'circle') await add({ k: 'circle', c: a, r: g.dist(a, b), start: 0 }, 900);
    st.busy = false;
    if (T.kind === 'segs' && st.pair < T.pairs.length - 1) { st.pair++; st.clicks = []; N.say(drawHint(), 'good'); S.ask(); return; }
    taskDone();
  }

  async function taskDone() {
    const T = TASKS[st.ti]; st.phase = 'wait'; st.clicks = []; S.cursor('default');
    N.sfx.good(); N.addScore(st.pen, lastPoint(T)); N.splash(lastPoint(T));
    N.say(`<b>${T.name} tamam!</b> ${T.done}`, 'good');
    N.dots(TASKS.length + 1, st.ti + 1);
    const el = N.panel(`<div class="card"><span class="label">${st.ti + 1}. adım tamam</span><p class="small">${st.pen === 100 ? 'Hiç hata yok, tam puan!' : 'Araç ya da nokta seçiminde biraz şaşırdın, sorun değil.'}</p>
      <button class="btn primary big" id="next" type="button">${st.ti === TASKS.length - 1 ? 'Yelkenliyi gör →' : 'Sonraki adım →'}</button></div>`);
    el.querySelector('#next').addEventListener('click', nextTask); el.querySelector('#next').focus();
  }
  const lastPoint = (T) => (T.kind === 'perp' ? FOOT : T.kind === 'par' ? pt('P2') : pt(T.pts[T.pts.length - 1]));

  function nextTask() {
    st.ti++; st.pen = 100; st.pair = 0; st.subPar = false; st.needTool = null;
    if (st.ti >= TASKS.length) return finale();
    startTask();
  }

  function startTask() {
    const T = TASKS[st.ti]; st.phase = 'tool';
    T.pts.forEach((k) => st.shown.add(k));
    N.dots(TASKS.length + 1, st.ti); N.say(T.say); toolPanel(); S.ask();
  }

  async function finale() {
    st.phase = 'wait'; N.say('Bak! Doğru, doğru parçası, ışın, açı, çember, dikme ve paralel: hepsi bir arada. <b>Yelkenli hazır!</b>', 'good');
    await N.tween(1200, (t) => { st.finale = t; S.ask(); }); N.sfx.win(); N.splash({ x: 520, y: 320 });
    const el = N.panel(`<div class="card"><span class="label">Sıra sende, usta</span><h3>Çizimlerinden ne öğrendin?</h3>
      <p class="small">Altı kısa soru. Her doğru cevap 50 puan. Cevap verince tahtada küçük bir gösteri var.</p>
      <button class="btn primary big" id="qgo" type="button">Sorulara geç →</button></div>`);
    el.querySelector('#qgo').addEventListener('click', () => quiz(0));
  }

  /* ── 5.3.2 çıkarım soruları ── */
  const DEMOS = {
    twoPts(c, t) {
      const a = { x: 330, y: 300 }, b = { x: 640, y: 300 };
      d.line(c, a, b, { color: N.DEEP, w: 3.5, ext: 200, t: Math.min(1, t * 1.4) });
      for (let i = 0; i < 3; i++) { const ang = (i - 1) * .35 * Math.min(1, t * 2); const u = g.dir(ang); d.seg(c, g.sub(a, g.mul(u, 160)), g.add(a, g.mul(u, 500)), { color: N.SEAL, w: 2, dash: [6, 8], alpha: .55 }); }
      d.dot(c, a, { r: 7, label: 'A', ly: 26 }); d.dot(c, b, { r: 7, label: 'B', ly: 26 });
    },
    onePt(c, t) {
      const o = { x: 480, y: 300 }, n = Math.round(t * 18);
      for (let i = 0; i < n; i++) { const u = g.dir(g.rad(i * 10)); d.seg(c, g.sub(o, g.mul(u, 230)), g.add(o, g.mul(u, 230)), { color: i % 2 ? N.DEEP : N.INK, w: 2, alpha: .7 }); }
      d.dot(c, o, { r: 7, label: 'O' });
    },
    radii(c, t) { const n = Math.round(t * 12); for (let i = 0; i < n; i++) d.seg(c, P.O, g.polar(P.O, 50, g.rad(i * 30)), { color: N.DEEP, w: 2.5 }); },
    perps(c, t) {
      [-170, -90, 110, 190].forEach((dx) => d.seg(c, P.M, { x: P.M.x + dx * t, y: SEA }, { color: N.SEAL, w: 2, dash: [6, 8] }));
      d.seg(c, P.M, FOOT, { color: N.DEEP, w: 5 });
    },
    kinds(c, t) {
      c.fillStyle = 'rgba(255,250,240,.86)'; c.fillRect(250, 250, 520, 190);
      d.seg(c, { x: 300, y: 290 }, { x: 520, y: 290 }, { t }); d.dot(c, { x: 300, y: 290 }, { r: 5 }); d.dot(c, { x: 520, y: 290 }, { r: 5 }); d.text(c, 'doğru parçası: 2 uç', 650, 290, { size: 24 });
      d.ray(c, { x: 300, y: 345 }, { x: 470, y: 345 }, { t, ext: 50 }); d.dot(c, { x: 300, y: 345 }, { r: 5 }); d.text(c, 'ışın: 1 uç', 650, 345, { size: 24 });
      d.line(c, { x: 330, y: 400 }, { x: 490, y: 400 }, { t, ext: 30, color: N.DEEP }); d.text(c, 'doğru: uç yok', 650, 400, { size: 24, color: N.DEEP });
    },
    twoCircles(c, t) {
      const a = { x: 380, y: 310 }, b = { x: 600, y: 310 };
      d.circle(c, a, 80, { t, color: N.DEEP }); d.circle(c, b, 80, { t, color: N.DEEP });
      d.seg(c, a, g.polar(a, 80, .6), { color: N.INK, w: 2 }); d.seg(c, b, g.polar(b, 80, 2.4), { color: N.INK, w: 2 });
      d.dot(c, a, { r: 5 }); d.dot(c, b, { r: 5 }); d.text(c, 'r', 420, 285, { size: 26 }); d.text(c, 'r', 565, 285, { size: 26 });
    },
  };

  function quiz(i) {
    if (i >= QUIZ.length) {
      st.overlay = null; S.ask(); N.dots(TASKS.length + 1, TASKS.length + 1);
      return N.finish({ id: 'arac-ustasi', title: 'Araç Ustası!', film: 'noktadan-cembere',
        text: 'Ölçüsüz cetvel düz çizer, pergel eşit uzaklıkları, gönye dik açıyı garanti eder. Sıradaki oyun: <b>Açı Avcısı</b>.' });
    }
    const Q = QUIZ[i]; st.overlay = null; S.ask();
    N.say(`<span class="label">Soru ${i + 1} / ${QUIZ.length}</span>${Q.q}`);
    const el = N.panel(`<div class="card"><span class="label">Çıkarım yap</span><div id="qbox"></div><div id="qnext"></div></div>`);
    N.choices(el.querySelector('#qbox'), Q.opts.map((t, k) => ({ t, ok: k === Q.ok })), async (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say(`Hmm, emin misin? ${Q.q}`, 'bad'); return; }
      N.sfx.good(); N.addScore(first ? 50 : 20, { x: 500, y: 300 }); N.say(Q.why, 'good');
      const fn = DEMOS[Q.demo], sheet = !['radii', 'perps'].includes(Q.demo); st.dt = 0;
      st.overlay = (c) => { if (sheet) { c.fillStyle = 'rgba(255,250,240,.9)'; c.fillRect(0, 0, W, H); } fn(c, st.dt || 0); };
      N.tween(1300, (t) => { st.dt = t; S.ask(); });
      el.querySelector('#qnext').innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">${i === QUIZ.length - 1 ? 'Bitir →' : 'Sonraki soru →'}</button>`;
      el.querySelector('#qnext button').addEventListener('click', () => quiz(i + 1));
    }, Q.one ? 'one' : Q.opts.length === 3 ? 'three' : '');
  }

  /* ── başla ── */
  N.dots(TASKS.length + 1, 0);
  N.say('Merhaba, ben <b>Nokta</b>! Bir yelkenli çizmek istiyorum ama hangi işi hangi araçla yapacağımı karıştırıyorum. Bana yardım eder misin?');
  const el = N.panel(`<div class="card"><span class="label">Nasıl oynanır?</span>
    <p>Her adımda önce <b>doğru aracı</b> seç, sonra tahtadaki noktalara dokunarak çiz.</p>
    <p class="small">İlk denemede doğru araç ve doğru çizim: 100 puan. Sonunda 6 çıkarım sorusu var.</p>
    <button class="btn primary big" id="go" type="button">Başla →</button></div>`);
  el.querySelector('#go').addEventListener('click', startTask);

  if (/onizleme/.test(location.search)) { // ana sayfa görseli için bitmiş hâl
    TASKS.forEach((T) => T.pts.forEach((k) => st.shown.add(k)));
    st.objs = [
      { k: 'line', a: P.D, b: P.E, ext: 26, t: 1 }, { k: 'seg', a: P.A, b: P.B, t: 1 }, { k: 'seg', a: P.B, b: P.C, t: 1 }, { k: 'seg', a: P.C, b: P.A, t: 1 },
      { k: 'circle', c: P.O, r: 50, t: 1 }, { k: 'ray', a: P.T, b: P.S, ext: 150, t: 1 }, { k: 'ray', a: P.M, b: P.U, ext: 60, t: 1 }, { k: 'ray', a: P.M, b: P.V, ext: 60, t: 1 },
      { k: 'arc', v: P.M, a1: g.ang(P.M, P.V), a2: g.ang(P.M, P.U), r: 34, t: 1 }, { k: 'seg', a: P.M, b: FOOT, t: 1 }, { k: 'right', v: FOOT, u: { x: 0, y: -1 }, w2: { x: 1, y: 0 }, t: 1 },
      { k: 'line', a: { x: 150, y: 570 }, b: { x: 700, y: 570 }, ext: 900, t: 1 },
    ];
    st.shown.delete('W'); st.finale = 1; S.ask();
  }
})();
