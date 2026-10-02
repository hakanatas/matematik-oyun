/* Araç Ustası · MAT.5.3.1 – 5.3.2
   Her adımda önce doğru aracı seç, sonra aracı gerçekten kullan:
   cetvelle sürükleyerek çiz, pergeli merkeze batırıp tam tur döndür, gönyeyi denizde kaydır.
   Her çizim sahnede canlanır (deniz dalgalanır, yelken şişer, güneş parlar, martı kanat çırpar…).
   Sonunda çizimlerden çıkarım soruları. */
(() => {
  const { g, d } = N;
  const W = 1000, H = 640, SEA = 470, FLOOR = 570;
  const S = (N.stage = new N.Stage(N.$('#cv'), W, H));
  const WOOD = '#6b4f35', WATER = 'rgba(52,78,96,', SAND = 'rgba(232,163,61,';

  const P = {
    D: { x: 70, y: SEA, lx: -4, ly: -22 }, E: { x: 930, y: SEA, lx: 4, ly: -22 },
    A: { x: 500, y: 440, lx: -20, ly: 4 }, B: { x: 500, y: 170, lx: -18, ly: -14 }, C: { x: 652, y: 412, lx: 20, ly: -4 },
    O: { x: 820, y: 130, lx: -18, ly: -18 }, R: { x: 870, y: 130, lx: 18, ly: -12 },
    T: { x: 845, y: 173.3, lx: -16, ly: 14 }, S: { x: 895, y: 260, lx: -18, ly: 4 },
    M: { x: 240, y: 214, lx: -2, ly: 28 }, U: { x: 160, y: 168, lx: -10, ly: -18 }, V: { x: 320, y: 168, lx: 10, ly: -18 },
    W: { x: 150, y: FLOOR, lx: -20, ly: -14 },
  };
  const FOOT = { x: P.M.x, y: SEA };
  const BOAT = new Set(['A', 'B', 'C']);

  const TOOLS = {
    cetvel: { ad: 'Ölçüsüz cetvel', alt: 'çizgeç', svg: '<rect x="3" y="15" width="58" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M10 21.5h44" stroke="currentColor" stroke-width="1.2" opacity=".35"/>' },
    pergel: { ad: 'Pergel', alt: 'çember', svg: '<circle cx="32" cy="7" r="3.4" fill="currentColor"/><path d="M32 9 L19 40 M32 9 L45 38" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M45 38 l1.5 4" stroke="#e8a33d" stroke-width="3" stroke-linecap="round"/><circle cx="19" cy="40" r="1.6" fill="currentColor"/>' },
    gonye: { ad: 'Gönye', alt: 'dik açı', svg: '<path d="M12 40 L12 5 L56 40 Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M19 33 L19 22 L33 33 Z" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".55"/><path d="M12 33 h7 v7" fill="none" stroke="#e8a33d" stroke-width="2.2"/>' },
    aciolcer: { ad: 'Açıölçer', alt: 'derece', svg: '<path d="M7 38 A25 25 0 0 1 57 38 Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M32 38 L32 31 M14 21 l4 4 M50 21 l-4 4 M32 13 v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="32" cy="38" r="2.2" fill="#e8a33d"/>' },
  };

  const TASKS = [
    { id: 'deniz', tool: 'cetvel', kind: 'line', pts: ['D', 'E'], name: 'Deniz',
      say: 'Önce deniz lazım: <b>D</b> ve <b>E</b>’den geçen <em>DE doğrusu</em>. Hangi araçla?',
      go: 'Cetvel hazır! <b>D</b>’ye bas, parmağını kaldırmadan <b>E</b>’ye kadar sürükle.',
      done: 'Deniz dalgalandı! Doğrunun iki yanı sonsuza gider; oklar bunu anlatır.' },
    { id: 'direk', tool: 'cetvel', kind: 'seg', pts: ['A', 'B'], name: 'Direk',
      say: 'Teknenin direği: <em>[AB] doğru parçası</em>. İki ucu da belli, sonsuza gitmez.',
      go: '<b>A</b>’dan <b>B</b>’ye sürükle.',
      done: 'Ahşap direk dikildi. [AB]’nin iki uç noktası var; uzunluğu |AB| diye yazılır.' },
    { id: 'yelken', tool: 'cetvel', kind: 'segs', pts: ['B', 'C', 'A'], pairs: [['B', 'C'], ['C', 'A']], name: 'Yelken',
      say: 'Rüzgâr esiyor! Yelken için iki doğru parçası: <em>[BC]</em> ve <em>[CA]</em>.',
      go: 'Önce <b>B</b>’den <b>C</b>’ye sürükle.',
      done: 'Yelken rüzgârla şişti! Üç doğru parçası bir üçgen oluşturdu.' },
    { id: 'gunes', tool: 'pergel', kind: 'circle', pts: ['O', 'R'], name: 'Güneş',
      say: 'Güneş doğsun: merkezi <b>O</b>, <b>R</b>’den geçen bir <em>çember</em>.',
      go: 'Pergelin sivri ucunu <b>O</b>’ya batır, kalemi <b>R</b>’ye kadar aç, sonra <em>tam bir tur döndür</em>!',
      done: 'Güneş parladı! Çemberin her noktası O’ya eşit uzaklıkta; |OR| <b>yarıçap</b>.' },
    { id: 'isik', tool: 'cetvel', kind: 'ray', pts: ['T', 'S'], name: 'Işık',
      say: 'Güneşten bir ışık huzmesi: <b>T</b>’den başlayıp <b>S</b>’den geçen <em>[TS ışını</em>.',
      go: 'Işın başlangıç noktasından çizilir: <b>T</b>’den <b>S</b>’ye sürükle.',
      done: 'Işık yayıldı! Işının bir başlangıç noktası var, öbür yanı sonsuza gider.' },
    { id: 'marti', tool: 'cetvel', kind: 'angle', pts: ['M', 'U', 'V'], name: 'Martı',
      say: 'Bir martı geliyor! Kanatları bir <em>açı</em>: köşesi <b>M</b>, kolları <b>[MU</b> ve <b>[MV</b>.',
      go: 'Köşeden başla: <b>M</b>’den <b>U</b>’ya, sonra yine <b>M</b>’den <b>V</b>’ye sürükle.',
      done: 'Martı kanat çırpıyor! Aynı noktadan çıkan iki ışın <b>UMV açısını</b> oluşturdu.' },
    { id: 'dalis', tool: 'gonye', kind: 'perp', pts: ['M'], name: 'Dalış',
      say: 'Martı balık gördü! Denize <em>en kısa yoldan</em> dalacak: M’den denize bir <em>dikme</em>.',
      go: '<b>M</b>’ye bas ve gönyeyi denize doğru sürükle. Dik köşe yerine oturunca kehribar olur; orada bırak.',
      done: 'Hop, balık! Dikme denizle 90° yapar ve M’den denize giden <b>en kısa</b> yoldur.' },
    { id: 'dip', tool: 'gonye', kind: 'par', pts: ['W'], name: 'Deniz dibi',
      say: 'Son olarak deniz dibi: <b>W</b>’dan geçen ve denize <em>paralel</em> bir doğru.',
      go: 'Gönyeyi denizin üstünde kaydır ve <b>iki farklı yere</b> dokun: her dokunuşta denizden W kadar uzakta bir nokta işaretleriz.',
      done: 'Deniz dibi hazır, yosunlar sallanıyor! Paralel doğrular hiç kesişmez; aradaki uzaklık her yerde aynı.' },
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
  const st = {
    ti: 0, phase: 'intro', pen: 100, pair: 0, extra: {}, objs: [], shown: new Set(), alive: {}, stars: [], streak: 0,
    drag: null, comp: null, gon: null, parMarks: [], subPar: false, needTool: null, done: new Set(['M_U']), finale: 0, overlay: null, t: 0,
  };
  const pt = (k) => P[k] || st.extra[k];
  const A = (id) => st.alive[id] || 0;
  const bob = () => (st.finale ? Math.sin(st.t * 1.6) * 5 * st.finale : 0);

  /* ══════════ SAHNE ══════════ */
  function cloud(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.arc(0, 0, 22, Math.PI * .9, Math.PI * 1.95); c.arc(30, -10, 28, Math.PI * 1.05, Math.PI * 1.9); c.arc(62, 0, 20, Math.PI * 1.2, Math.PI * .1); c.closePath();
    c.fillStyle = 'rgba(255,252,244,.85)'; c.fill(); c.strokeStyle = 'rgba(23,20,17,.22)'; c.lineWidth = 2; c.stroke(); c.restore();
  }
  function drawSky(c) {
    const t = st.t;
    [[120, 70, 1], [470, 50, .8], [640, 110, .7]].forEach(([x, y, s], i) => cloud(c, ((x + t * (6 + i * 3)) % 1140) - 90, y, s));
  }
  function drawSun(c) {
    const a = A('gunes'); if (!a) return;
    const o = P.O, t = st.t;
    const gl = c.createRadialGradient(o.x, o.y, 20, o.x, o.y, 120); gl.addColorStop(0, `rgba(232,163,61,${.45 * a})`); gl.addColorStop(1, 'rgba(232,163,61,0)');
    c.fillStyle = gl; c.beginPath(); c.arc(o.x, o.y, 120, 0, Math.PI * 2); c.fill();
    d.circle(c, o, 50, { fill: `rgba(232,163,61,${.85 * a})`, noStroke: true });
    for (let i = 0; i < 12; i++) { const ang = t * .25 + i * Math.PI / 6, r1 = 60 + (i % 2) * 4; d.seg(c, g.polar(o, r1, ang), g.polar(o, r1 + 14 * a, ang), { color: N.DEEP, w: 3, alpha: a }); }
    // gülen güneş
    c.globalAlpha = a; c.fillStyle = N.INK;
    c.beginPath(); c.arc(o.x - 15, o.y - 6, 3.2, 0, Math.PI * 2); c.arc(o.x + 15, o.y - 6, 3.2, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(o.x, o.y + 6, 13, .2 * Math.PI, .8 * Math.PI); c.strokeStyle = N.INK; c.lineWidth = 2.5; c.stroke(); c.globalAlpha = 1;
  }
  function drawBeam(c) {
    const a = A('isik'); if (!a) return;
    const u = g.unit(g.sub(P.S, P.T)), n = { x: -u.y, y: u.x }, L = 520;
    const tip = g.add(P.T, g.mul(u, L));
    c.beginPath(); c.moveTo(P.T.x, P.T.y); c.lineTo(tip.x + n.x * 46, tip.y + n.y * 46); c.lineTo(tip.x - n.x * 46, tip.y - n.y * 46); c.closePath();
    const gr = c.createLinearGradient(P.T.x, P.T.y, tip.x, tip.y); gr.addColorStop(0, `rgba(232,163,61,${.38 * a})`); gr.addColorStop(1, 'rgba(232,163,61,0)');
    c.fillStyle = gr; c.fill();
    for (let i = 0; i < 4; i++) { const k = ((st.t * .35 + i / 4) % 1), p = g.add(P.T, g.mul(u, 40 + k * 300)); c.globalAlpha = a * (1 - k); d.dot(c, p, { r: 3, color: N.AMBER }); c.globalAlpha = 1; }
  }
  function drawSea(c) {
    const a = A('deniz'); if (!a) return;
    const gr = c.createLinearGradient(0, SEA, 0, H); gr.addColorStop(0, `${WATER}${.12 * a})`); gr.addColorStop(1, `${WATER}${.26 * a})`);
    c.fillStyle = gr; c.fillRect(0, SEA, W, H - SEA);
    c.strokeStyle = `${WATER}${.45 * a})`; c.lineWidth = 2.2;
    for (let r = 0; r < 7; r++) {
      const y = SEA + 16 + r * 22, sp = st.t * (r % 2 ? 26 : -20), off = (r % 3) * 23;
      c.beginPath();
      for (let x = -60 + ((sp + off) % 60); x < W + 60; x += 60) { c.moveTo(x, y); c.quadraticCurveTo(x + 15, y - 7, x + 30, y); }
      c.stroke();
    }
  }
  function drawFloor(c) {
    const a = A('dip'); if (!a) return;
    c.fillStyle = `${SAND}${.32 * a})`; c.fillRect(0, FLOOR, W, H - FLOOR);
    c.fillStyle = `rgba(184,116,26,${.35 * a})`;
    for (let i = 0; i < 70; i++) { const x = (i * 137) % W, y = FLOOR + 10 + ((i * 53) % 60); c.beginPath(); c.arc(x, y, 1.6, 0, Math.PI * 2); c.fill(); }
    [60, 110, 300, 420, 690, 760, 880, 940].forEach((x, i) => { // yosunlar
      const h = (40 + (i % 3) * 18) * a; c.beginPath(); c.moveTo(x, FLOOR + 2);
      for (let k = 1; k <= 6; k++) { const yy = FLOOR + 2 - h * k / 6, sw = Math.sin(st.t * 1.6 + i + k * .7) * 7 * k / 6; c.lineTo(x + sw, yy); }
      c.strokeStyle = `rgba(60,92,64,${.8 * a})`; c.lineWidth = 4; c.stroke();
    });
    [[230, 610], [560, 600], [820, 618]].forEach(([x, y]) => { c.globalAlpha = a; c.beginPath(); c.arc(x, y, 11, Math.PI, 0); c.closePath(); c.fillStyle = 'rgba(255,240,220,.9)'; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
      for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + k * 5, y - 10 + Math.abs(k) * 2); c.stroke(); } c.globalAlpha = 1; });
  }
  function drawHull(c) {
    c.beginPath(); c.moveTo(338, 438);
    c.lineTo(684, 438); c.quadraticCurveTo(660, 470, 616, 494); c.lineTo(404, 494); c.quadraticCurveTo(360, 470, 338, 438); c.closePath();
    const f = st.finale ? .9 : .55;
    c.fillStyle = `rgba(107,79,53,${f})`; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 3.5; c.stroke();
    c.strokeStyle = 'rgba(23,20,17,.35)'; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(352, 456); c.lineTo(670, 456); c.moveTo(372, 476); c.lineTo(648, 476); c.stroke();
    [420, 470, 550, 600].forEach((x) => { c.beginPath(); c.arc(x, 450, 5, 0, Math.PI * 2); c.fillStyle = 'rgba(255,250,236,.9)'; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 1.6; c.stroke(); });
    d.text(c, 'NOKTA', 510, 478, { size: 20, color: 'rgba(255,250,236,.9)', halo: false });
  }
  function drawMastSail(c) {
    const am = A('direk'), as = A('yelken'), t = st.t;
    if (as) {
      const mid = g.lerp(P.B, P.C, .5), n = g.unit({ x: P.C.y - P.B.y, y: -(P.C.x - P.B.x) }), puff = (34 + Math.sin(t * 2.2) * 6) * as;
      const ctl = g.add(mid, g.mul(n, -puff)), foot = g.add(g.lerp(P.C, P.A, .5), { x: 0, y: 10 * as });
      c.beginPath(); c.moveTo(P.B.x, P.B.y); c.quadraticCurveTo(ctl.x, ctl.y, P.C.x, P.C.y); c.quadraticCurveTo(foot.x, foot.y, P.A.x, P.A.y); c.closePath();
      c.fillStyle = `rgba(255,248,232,${.95 * as})`; c.fill();
      c.fillStyle = `rgba(232,163,61,${.45 * as})`; c.fill();
      c.strokeStyle = `rgba(23,20,17,${.7 * as})`; c.lineWidth = 2; c.stroke();
      c.save(); c.clip(); c.strokeStyle = `rgba(184,116,26,${.35 * as})`; c.lineWidth = 2;
      for (let k = 1; k < 4; k++) { const y = P.B.y + (P.A.y - P.B.y) * k / 4; c.beginPath(); c.moveTo(P.B.x, y); c.lineTo(P.C.x + 40, y + 20); c.stroke(); }
      c.restore();
    }
    if (am) {
      d.seg(c, P.A, P.B, { color: WOOD, w: 9 * am }); d.seg(c, P.A, P.B, { color: 'rgba(255,255,255,.25)', w: 2 * am });
      const fl = Math.sin(t * 5) * 6; // bayrak
      c.globalAlpha = am; c.beginPath(); c.moveTo(P.B.x, P.B.y - 2); c.quadraticCurveTo(P.B.x - 26, P.B.y - 8 + fl, P.B.x - 48, P.B.y + 4 + fl * .6); c.quadraticCurveTo(P.B.x - 24, P.B.y + 10 - fl * .5, P.B.x, P.B.y + 22);
      c.closePath(); c.fillStyle = N.SEAL; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke(); c.globalAlpha = 1;
    }
  }
  function drawGull(c) {
    const a = A('marti'); if (!a) return;
    const flap = Math.sin(st.t * 6) * 14 * a, m = P.M;
    c.globalAlpha = a; c.strokeStyle = N.INK; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(m.x, m.y); c.quadraticCurveTo(m.x - 34, m.y - 50 - flap, P.U.x, P.U.y - flap * .8); c.stroke();
    c.beginPath(); c.moveTo(m.x, m.y); c.quadraticCurveTo(m.x + 34, m.y - 50 - flap, P.V.x, P.V.y - flap * .8); c.stroke();
    c.beginPath(); c.ellipse(m.x, m.y + 4, 13, 8, 0, 0, Math.PI * 2); c.fillStyle = N.SHEET; c.fill(); c.lineWidth = 2.5; c.stroke();
    c.beginPath(); c.moveTo(m.x + 11, m.y + 3); c.lineTo(m.x + 22, m.y + 6); c.lineTo(m.x + 11, m.y + 8); c.fillStyle = N.AMBER; c.fill();
    c.beginPath(); c.arc(m.x + 6, m.y + 1, 1.8, 0, Math.PI * 2); c.fillStyle = N.INK; c.fill();
    c.globalAlpha = 1;
  }
  function drawFish(c) {
    const a = A('dalis'); if (!a) return;
    const per = 3.2, k = (st.t % per) / per, f = FOOT;
    if (k < .5) { // zıplayan balık
      const s = k / .5, x = f.x - 70 + s * 140, y = f.y - Math.sin(s * Math.PI) * 90, ang = Math.atan2(-Math.cos(s * Math.PI) * 90 * Math.PI, 140);
      c.save(); c.translate(x, y); c.rotate(-ang); c.globalAlpha = a;
      c.beginPath(); c.ellipse(0, 0, 18, 8, 0, 0, Math.PI * 2); c.fillStyle = N.AMBER; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
      c.beginPath(); c.moveTo(-16, 0); c.lineTo(-28, -8); c.lineTo(-28, 8); c.closePath(); c.fillStyle = N.DEEP; c.fill(); c.stroke();
      c.beginPath(); c.arc(9, -2, 1.8, 0, Math.PI * 2); c.fillStyle = N.INK; c.fill(); c.restore(); c.globalAlpha = 1;
    }
    for (const s0 of [0, .5]) { const r = ((k + s0) % 1); c.beginPath(); c.ellipse(f.x + (s0 ? 70 : -70), f.y, 10 + r * 40, 3 + r * 10, 0, 0, Math.PI * 2); c.strokeStyle = `${WATER}${.6 * (1 - r) * a})`; c.lineWidth = 2; c.stroke(); }
  }

  /* ══════════ ÇİZİM DÖNGÜSÜ ══════════ */
  S.draw = (c) => {
    drawSky(c); drawSun(c); drawBeam(c); drawSea(c); drawFloor(c);
    c.save(); c.translate(0, bob());
    drawHull(c); drawMastSail(c);
    for (const o of st.objs) if (o.boat) drawObj(c, o);
    c.restore();
    for (const o of st.objs) if (!o.boat) drawObj(c, o);
    drawGull(c); drawFish(c);
    drawTools(c);
    if (!st.finale) for (const k of st.shown) {
      const p = pt(k); if (!p) continue;
      const hot = st.phase === 'draw' && S.hover && g.dist(S.hover, p) < S.hit(26);
      const target = st.drag && st.drag.snap === k;
      d.dot(c, p, { r: 6.5, label: k.replace(/\d/, (m) => '₁₂'[m - 1]), lx: p.lx, ly: p.ly, ring: target ? N.DEEP : hot ? N.AMBER : null, color: p.amber ? N.DEEP : N.INK });
    }
    if (A('deniz') && !st.finale) d.text(c, 'd', 962, SEA + 26, { size: 30, color: N.SOFT });
    if (st.overlay) st.overlay(c);
  };
  function drawObj(c, o) {
    const s = { color: o.color || N.INK, w: o.w || 3.2, t: o.t, dash: o.dash };
    if (o.k === 'seg') d.seg(c, o.a, o.b, s);
    else if (o.k === 'ray') d.ray(c, o.a, o.b, { ...s, ext: o.ext });
    else if (o.k === 'line') d.line(c, o.a, o.b, { ...s, ext: o.ext == null ? 40 : o.ext });
    else if (o.k === 'circle') d.circle(c, o.c, o.r, { ...s, start: o.start || 0 });
    else if (o.k === 'arc') { c.globalAlpha = o.t; d.arc(c, o.v, o.a1, o.a2, o.r, { fill: N.WASH }); c.globalAlpha = 1; }
    else if (o.k === 'right') { c.globalAlpha = o.t; d.right(c, o.v, o.u, o.w2, 16); c.globalAlpha = 1; }
  }

  // araçların hayaleti: cetvel, pergel, gönye
  function drawRuler(c, a, b) {
    const L = g.dist(a, b); if (L < 4) return;
    const u = g.unit(g.sub(b, a)), n = { x: -u.y, y: u.x }, s = g.sub(a, g.mul(u, 46)), e = g.add(b, g.mul(u, 46));
    c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(e.x, e.y); c.lineTo(e.x + n.x * 30, e.y + n.y * 30); c.lineTo(s.x + n.x * 30, s.y + n.y * 30); c.closePath();
    c.fillStyle = 'rgba(255,250,236,.78)'; c.fill(); c.strokeStyle = 'rgba(23,20,17,.55)'; c.lineWidth = 2; c.stroke();
    d.text(c, 'ölçüsüz cetvel', (s.x + e.x) / 2 + n.x * 16, (s.y + e.y) / 2 + n.y * 16, { size: 15, font: N.MONO, color: 'rgba(23,20,17,.4)', halo: false });
  }
  function drawCompass(c, ctr, tip) {
    const m = g.lerp(ctr, tip, .5), L = g.dist(ctr, tip), n = g.unit({ x: -(tip.y - ctr.y), y: tip.x - ctr.x }), up = n.y < 0 ? n : g.mul(n, -1);
    const hinge = g.add(m, g.mul(up, Math.max(54, L * .7)));
    d.seg(c, ctr, hinge, { w: 5, color: N.INK }); d.seg(c, hinge, tip, { w: 5, color: N.INK }); d.seg(c, g.lerp(hinge, tip, .8), tip, { w: 6, color: N.AMBER });
    d.seg(c, hinge, g.add(hinge, g.mul(up, 22)), { w: 6, color: N.INK });
    c.beginPath(); c.arc(hinge.x, hinge.y, 7, 0, Math.PI * 2); c.fillStyle = N.SHEET; c.fill(); c.lineWidth = 3; c.strokeStyle = N.INK; c.stroke();
  }
  function drawGonye(c, f, ok, side = 1, up = true) {
    c.save(); c.translate(f.x, f.y); const k = up ? -1 : 1;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 150 * k); c.lineTo(110 * side, 0); c.closePath();
    c.fillStyle = ok ? 'rgba(232,163,61,.22)' : 'rgba(255,250,236,.6)'; c.fill(); c.strokeStyle = ok ? N.DEEP : 'rgba(23,20,17,.55)'; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.moveTo(14 * side, 34 * k); c.lineTo(14 * side, 100 * k); c.lineTo(62 * side, 34 * k); c.closePath(); c.strokeStyle = 'rgba(23,20,17,.25)'; c.stroke();
    c.restore();
  }
  function drawTools(c) {
    const dr = st.drag;
    if (dr) { const a = pt(dr.from), b = dr.snap ? pt(dr.snap) : dr.cur; drawRuler(c, a, b); d.seg(c, a, b, { w: 3.4, color: N.INK }); }
    const cp = st.comp;
    if (cp) {
      const o = P.O, r = cp.r || g.dist(o, cp.cur || o);
      if (cp.stage === 'sweep') {
        const a0 = cp.a0, acc = cp.acc;
        c.beginPath(); c.arc(o.x, o.y, r, -a0, -(a0 + acc), acc > 0); c.strokeStyle = N.INK; c.lineWidth = 3.2; c.stroke();
        drawCompass(c, o, g.polar(o, r, a0 + acc));
        const pct = Math.min(100, Math.round(Math.abs(acc) / (2 * Math.PI) * 100));
        d.text(c, `%${pct}`, o.x - 110, o.y + 70, { size: 26, color: N.DEEP });
      } else if (cp.cur) { d.circle(c, o, r, { color: N.SOFT, w: 1.5, dash: [6, 8] }); drawCompass(c, o, cp.cur); }
    }
    const gn = st.gon;
    if (gn && gn.f) {
      drawGonye(c, gn.f, gn.ok, 1);
      d.seg(c, P.M, gn.f, { color: gn.ok ? N.INK : N.SEAL, w: 3.2, dash: gn.ok ? [] : [10, 8] });
      if (gn.ok) d.right(c, gn.f, { x: 0, y: -1 }, { x: 1, y: 0 }, 16);
      else { const a = Math.round(g.angleAt(P.M, gn.f, { x: gn.f.x + 100, y: gn.f.y })); d.text(c, `${Math.min(a, 180 - a)}°`, gn.f.x + (gn.f.x > P.M.x ? -46 : 46), gn.f.y - 24, { size: 28, color: N.SEAL }); }
    }
    if (st.parHover != null) {
      const x = st.parHover; drawGonye(c, { x, y: SEA }, true, x < 500 ? 1 : -1, false);
      d.seg(c, { x, y: SEA }, { x, y: FLOOR }, { color: N.DEEP, w: 2, dash: [6, 6] }); d.dot(c, { x, y: FLOOR }, { r: 4, color: N.DEEP });
    }
  }

  // sürekli canlı sahne
  let last = performance.now();
  const loop = (now) => { if (!N.reduced) st.t += Math.min(.05, (now - last) / 1000); last = now; S.render(); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);

  const add = async (o, ms = 450) => { o.t = 0; st.objs.push(o); N.sfx.draw(); await N.tween(ms, (t) => { o.t = t; }); };
  const wake = (id) => N.tween(1100, (t) => { st.alive[id] = t; });

  /* ══════════ ARAYÜZ ══════════ */
  function stepsHtml() {
    return `<div class="row" style="gap:6px;margin-top:10px">${TASKS.map((T, i) => {
      const s = st.stars[i], now = i === st.ti && st.phase !== 'quiz';
      return `<span style="font-family:var(--mono);font-size:11.5px;padding:4px 7px;border-radius:999px;border:1.5px solid ${now ? 'var(--ink)' : 'var(--ink-faint)'};${s ? 'background:var(--amber-wash);' : ''}${!s && !now ? 'opacity:.55;' : ''}">${T.name}${s ? ' ' + '★'.repeat(s) : ''}</span>`;
    }).join('')}</div>`;
  }
  function toolPanel() {
    const T = TASKS[st.ti];
    const el = N.panel(`<div class="card"><span class="label">${st.ti + 1} / ${TASKS.length} · ${st.subPar ? 'Birleştir' : T.name}${st.streak >= 2 ? ` · seri ×${st.streak}` : ''}</span><h3>Hangi araç?</h3>
      <div class="tools">${Object.entries(TOOLS).map(([k, t]) => `<button class="tool" type="button" data-tool="${k}"><svg viewBox="0 0 64 44" aria-hidden="true">${t.svg}</svg>${t.ad}<small>${t.alt}</small></button>`).join('')}</div>
      ${stepsHtml()}</div>`);
    el.querySelectorAll('.tool').forEach((b) => b.addEventListener('click', () => pickTool(b.dataset.tool, b)));
  }
  function wrongTool(need, got) {
    if (got === 'aciolcer') return 'Açıölçer açıları <b>ölçer</b>; çizgi ya da çember çizmez.';
    if (need === 'cetvel') return got === 'pergel' ? 'Pergel <b>çember</b> çizer. Burada dümdüz bir çizgi lazım.' : 'Gönyenin işi <b>dik açı</b>. Düz bir çizgi için ölçüsüz cetvel yeter.';
    if (need === 'pergel') return 'Cetvelle düz çizilir. O’ya <b>eşit uzaklıktaki</b> tüm noktalar için hangi araç?';
    return got === 'pergel' ? 'Pergel çember çizer. Bize köşesi <b>dik açı</b> olan bir araç lazım.' : 'Cetvel dik açıyı garanti etmez. Köşesi <b>dik açı</b> olan araç hangisi?';
  }
  function pickTool(k, btn) {
    if (st.phase !== 'tool') return;
    const need = st.needTool || TASKS[st.ti].tool;
    if (k !== need) { btn.classList.remove('no'); void btn.offsetWidth; btn.classList.add('no'); st.pen = Math.max(30, st.pen - 25); N.sfx.bad(); N.say(wrongTool(need, k), 'bad'); return; }
    btn.classList.add('on'); N.sfx.good(); st.phase = 'draw';
    N.$('#panel').querySelectorAll('.tool').forEach((b) => (b.disabled = true));
    N.say(st.subPar ? 'Cetvelle <b>P₁</b>’den <b>P₂</b>’ye sürükle.' : TASKS[st.ti].go, 'good');
  }

  /* ══════════ DOKUNMA ══════════ */
  const hitPt = (p) => { let best = null, bd = S.hit(28); for (const k of st.shown) { const q = pt(k); if (!q) continue; const dd = g.dist(p, q); if (dd < bd) { bd = dd; best = k; } } return best; };
  const miss = (msg) => { st.pen = Math.max(30, st.pen - 15); N.sfx.bad(); N.say(msg, 'bad'); };

  // düz çizimler için: hangi uçtan başlanabilir, nereye gidilir
  function straightRule() {
    const T = TASKS[st.ti];
    if (st.subPar) return { pairs: [['P1', 'P2'], ['P2', 'P1']] };
    if (T.kind === 'segs') { const [a, b] = T.pairs[st.pair]; return { pairs: [[a, b], [b, a]] }; }
    if (T.kind === 'ray') return { pairs: [['T', 'S']], wrongStart: { S: 'Işın <b>başlangıç noktasından</b> çizilir. T’den başla.' } };
    if (T.kind === 'angle') { const p = []; if (!st.done.has('MU')) p.push(['M', 'U']); if (!st.done.has('MV')) p.push(['M', 'V']); return { pairs: p, wrongStart: { U: 'Açı çizerken <b>köşeden</b> başla: M.', V: 'Açı çizerken <b>köşeden</b> başla: M.' } }; }
    return { pairs: [[T.pts[0], T.pts[1]], [T.pts[1], T.pts[0]]] };
  }

  S.onDown = async (p) => {
    if (st.phase !== 'draw' || st.busy) return;
    const T = TASKS[st.ti], k = hitPt(p);
    if (st.subPar || ['line', 'seg', 'segs', 'ray', 'angle'].includes(T.kind)) {
      if (!k) return;
      const R = straightRule();
      if (R.pairs.some(([a]) => a === k)) { st.drag = { from: k, cur: p }; N.sfx.tick(); return; }
      if (R.wrongStart && R.wrongStart[k]) return miss(R.wrongStart[k]);
      const need = [...new Set(R.pairs.flat())];
      return miss(`Bu <b>${k}</b> noktası. Bize ${need.map((x) => `<b>${x}</b>`).join(' ve ')} lazım.`);
    }
    if (T.kind === 'circle') {
      if (st.comp && st.comp.stage === 'sweep') { st.comp.last = g.ang(P.O, p); st.comp.going = true; return; }
      if (k === 'O') { st.comp = { stage: 'open', cur: p }; N.sfx.tick(); N.say('İğne O’da! Şimdi kalemi <b>R</b>’ye kadar aç.'); return; }
      if (k) return miss('Pergelin sivri ucu <b>merkeze</b> batırılır: önce O.');
      return;
    }
    if (T.kind === 'perp') {
      if (k === 'M') { st.gon = { f: null, ok: false }; N.sfx.tick(); return; }
      if (k) return miss(`Bu ${k}. Dikme <b>M</b>’den inecek.`);
      return;
    }
    if (T.kind === 'par') {
      if (Math.abs(p.y - SEA) > 60) return miss('Gönyeyi <b>denizin (d doğrusunun) üstüne</b> koy: deniz çizgisine yakın bir yere dokun.');
      const x = Math.max(80, Math.min(920, p.x));
      if (st.parMarks.some((m) => Math.abs(m - x) < 110)) return miss('İkinci noktayı ilkinden biraz <b>uzağa</b> koy.');
      st.parMarks.push(x); st.busy = true;
      const top = { x, y: SEA }, bot = { x, y: FLOOR };
      await add({ k: 'seg', a: top, b: bot, color: N.DEEP, w: 2.2, dash: [7, 7] }, 400);
      await add({ k: 'right', v: top, u: { x: 0, y: 1 }, w2: { x: x < 500 ? 1 : -1, y: 0 } }, 200);
      const key = 'P' + st.parMarks.length; st.extra[key] = { ...bot, lx: 18, ly: 20, amber: true }; st.shown.add(key);
      st.busy = false;
      if (st.parMarks.length === 1) N.say('Bir nokta: denize dik ve W kadar uzakta. Denizin <b>başka bir yerine</b> daha dokun.', 'good');
      else { st.subPar = true; st.phase = 'tool'; st.needTool = 'cetvel'; st.parHover = null; N.say('İki nokta da denize aynı uzaklıkta. Bunları birleştirecek aracı seç.', 'good'); toolPanel(); }
    }
  };

  S.onMove = (p) => {
    if (!p) { st.parHover = null; return; }
    const T = TASKS[st.ti];
    if (st.drag) {
      st.drag.cur = p; const k = hitPt(p), R = straightRule();
      const ok = k && R.pairs.some(([a, b]) => a === st.drag.from && b === k);
      if (ok && st.drag.snap !== k) N.sfx.snap(); st.drag.snap = ok ? k : null; return;
    }
    if (st.comp && S.down) {
      const cp = st.comp;
      if (cp.stage === 'open') {
        cp.cur = p;
        if (g.dist(p, P.R) < S.hit(24)) { cp.stage = 'sweep'; cp.r = g.dist(P.O, P.R); cp.a0 = g.ang(P.O, P.R); cp.acc = 0; cp.last = g.ang(P.O, p); N.sfx.snap(); N.say('Açıklık tamam! Şimdi kalemi O’nun etrafında <em>tam bir tur</em> döndür.'); }
      } else {
        const a = g.ang(P.O, p); let dl = a - cp.last; while (dl > Math.PI) dl -= 2 * Math.PI; while (dl < -Math.PI) dl += 2 * Math.PI;
        if (g.dist(p, P.O) > 12) { cp.acc += dl; cp.last = a; if (Math.floor(Math.abs(cp.acc) / .5) !== Math.floor(Math.abs(cp.acc - dl) / .5)) N.sfx.tick(); }
        if (Math.abs(cp.acc) >= 2 * Math.PI - .04) finishCircle();
      }
      return;
    }
    if (st.gon && S.down) {
      const x = Math.max(60, Math.min(940, p.x)), near = p.y > SEA - 120, ok = near && Math.abs(x - FOOT.x) < 18;
      st.gon.f = near ? (ok ? FOOT : { x, y: SEA }) : null; if (ok && !st.gon.ok) N.sfx.snap(); st.gon.ok = ok; return;
    }
    st.parHover = st.phase === 'draw' && T && T.kind === 'par' && !st.subPar && Math.abs(p.y - SEA) < 60 ? Math.max(80, Math.min(920, p.x)) : null;
  };

  S.onUp = async () => {
    if (st.drag) {
      const dr = st.drag; st.drag = null;
      if (!dr.snap) { const k = hitPt(dr.cur); if (k && k !== dr.from) miss(`<b>${k}</b> değil! Çizgiyi doğru noktaya götür.`); else if (g.dist(pt(dr.from), dr.cur) > 30) N.say('Mürekkep noktaya ulaşmadı. Parmağını <b>hedef noktanın üstünde</b> kaldır.'); return; }
      await commitStraight(dr.from, dr.snap); return;
    }
    if (st.comp) { const cp = st.comp; if (cp.stage === 'open') { st.comp = null; N.say('Kalem R’ye ulaşmadı. Yeniden <b>O</b>’ya bas ve <b>R</b>’ye kadar aç.'); } else if (!cp.finished) N.say(`Pergel %${Math.round(Math.abs(cp.acc) / (2 * Math.PI) * 100)} döndü. Tahtaya basıp <b>dönmeye devam</b> et!`); return; }
    if (st.gon) {
      const gn = st.gon; st.gon = null;
      if (!gn.f) return N.say('Gönyeyi <b>denize kadar</b> sürükle.');
      if (!gn.ok) { const a = Math.round(g.angleAt(P.M, gn.f, { x: gn.f.x + 100, y: gn.f.y })); return miss(`Bu yol eğik: denizle ${Math.min(a, 180 - a)}° yapıyor ve daha uzun. Dikme denizle <b>90°</b> yapmalı.`); }
      st.busy = true;
      await add({ k: 'seg', a: P.M, b: FOOT, w: 3.2 }, 300);
      await add({ k: 'right', v: FOOT, u: { x: 0, y: -1 }, w2: { x: 1, y: 0 } }, 200);
      st.extra.H = { ...FOOT, lx: -20, ly: 22 }; st.shown.add('H'); st.busy = false; taskDone();
    }
  };

  async function commitStraight(a, b) {
    const T = TASKS[st.ti], pa = pt(a), pb = pt(b); st.busy = true;
    if (st.subPar) { await add({ k: 'line', a: pt('P1'), b: pt('P2'), ext: 900 }); st.busy = false; return taskDone(); }
    if (T.kind === 'line') await add({ k: 'line', a: pa, b: pb, ext: 26 });
    else if (T.kind === 'seg' || T.kind === 'segs') await add({ k: 'seg', a: pa, b: pb, boat: true });
    else if (T.kind === 'ray') await add({ k: 'ray', a: pa, b: pb, ext: 150 });
    else if (T.kind === 'angle') {
      await add({ k: 'ray', a: P.M, b: pb, ext: 50, w: 2.4, color: 'rgba(23,20,17,.6)' }); st.done.add('M' + b);
      st.busy = false;
      if (st.done.has('MU') && st.done.has('MV')) { await add({ k: 'arc', v: P.M, a1: g.ang(P.M, P.V), a2: g.ang(P.M, P.U), r: 34 }, 250); return taskDone(); }
      N.say(`Bir kol tamam! Şimdi yine <b>M</b>’den <b>${b === 'U' ? 'V' : 'U'}</b>’ye sürükle.`, 'good'); return;
    }
    st.busy = false;
    if (T.kind === 'segs' && st.pair < T.pairs.length - 1) { st.pair++; const [x, y] = T.pairs[st.pair]; N.say(`Şimdi <b>${x}</b>’dan <b>${y}</b>’ya sürükle.`, 'good'); return; }
    taskDone();
  }

  async function finishCircle() {
    const cp = st.comp; if (cp.finished) return; cp.finished = true; st.busy = true;
    st.objs.push({ k: 'circle', c: P.O, r: cp.r, start: cp.a0, t: 1 }); st.comp = null; N.sfx.draw(); st.busy = false; taskDone();
  }

  /* ══════════ AKIŞ ══════════ */
  async function taskDone() {
    const T = TASKS[st.ti]; st.phase = 'wait'; S.cursor('default');
    const stars = st.pen === 100 ? 3 : st.pen >= 70 ? 2 : 1; st.stars[st.ti] = stars;
    st.streak = stars === 3 ? st.streak + 1 : 0;
    const at = T.kind === 'perp' ? FOOT : T.kind === 'par' ? pt('P2') : T.kind === 'circle' ? P.O : pt(T.pts[T.pts.length - 1]);
    N.sfx.good(); N.addScore(st.pen, at); N.splash(at);
    if (st.streak >= 2) setTimeout(() => { N.float(`Seri ×${st.streak}!`, { x: 500, y: 90 }); N.addScore(10 * st.streak); }, 500);
    N.say(T.done, 'good'); N.dots(TASKS.length + 1, st.ti + 1);
    wake(T.id);
    const el = N.panel(`<div class="card"><span class="label">${T.name} · ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>
      <p class="small">${stars === 3 ? 'Hatasız! Tam puan.' : 'Biraz şaşırdın ama başardın.'}${st.streak >= 2 ? ` <b>Seri ×${st.streak}</b>: +${10 * st.streak} bonus!` : ''}</p>
      <button class="btn primary big" id="next" type="button">${st.ti === TASKS.length - 1 ? 'Yelkenliyi gör →' : 'Sonraki adım →'}</button>${stepsHtml()}</div>`);
    el.querySelector('#next').addEventListener('click', nextTask); el.querySelector('#next').focus();
  }
  function nextTask() {
    st.ti++; st.pen = 100; st.pair = 0; st.subPar = false; st.needTool = null; st.parMarks = st.parMarks || [];
    if (st.ti >= TASKS.length) return finale();
    startTask();
  }
  function startTask() {
    const T = TASKS[st.ti]; st.phase = 'tool';
    T.pts.forEach((k) => st.shown.add(k));
    N.dots(TASKS.length + 1, st.ti); N.say(T.say); toolPanel();
  }

  async function finale() {
    st.phase = 'wait';
    N.say('Doğru, doğru parçası, ışın, açı, çember, dikme ve paralel: hepsi bir arada. <b>Yelkenli denizde!</b>', 'good');
    await N.tween(1200, (t) => { st.finale = t; }); N.sfx.win(); N.splash({ x: 520, y: 320 });
    const total = st.stars.reduce((s, x) => s + (x || 0), 0);
    const el = N.panel(`<div class="card"><span class="label">Resim tamam · ${total} / 24 yıldız</span><h3>Çizimlerinden ne öğrendin?</h3>
      <p class="small">Altı kısa soru, her biri 50 puan. Cevaplayınca tahtada küçük bir gösteri var.</p>
      <button class="btn primary big" id="qgo" type="button">Sorulara geç →</button>${stepsHtml()}</div>`);
    el.querySelector('#qgo').addEventListener('click', () => { st.phase = 'quiz'; quiz(0); });
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
    radii(c, t) { const n = Math.round(t * 12); for (let i = 0; i < n; i++) d.seg(c, P.O, g.polar(P.O, 50, g.rad(i * 30)), { color: N.INK, w: 2.5 }); d.dot(c, P.O, { r: 5 }); },
    perps(c, t) {
      [-170, -90, 110, 190].forEach((dx) => d.seg(c, P.M, { x: P.M.x + dx * t, y: SEA }, { color: N.SEAL, w: 2.5, dash: [6, 8] }));
      d.seg(c, P.M, FOOT, { color: N.DEEP, w: 5 }); d.right(c, FOOT, { x: 0, y: -1 }, { x: 1, y: 0 }, 16);
    },
    kinds(c, t) {
      d.seg(c, { x: 300, y: 290 }, { x: 520, y: 290 }, { t }); d.dot(c, { x: 300, y: 290 }, { r: 5 }); d.dot(c, { x: 520, y: 290 }, { r: 5 }); d.text(c, 'doğru parçası: 2 uç', 660, 290, { size: 26 });
      d.ray(c, { x: 300, y: 350 }, { x: 470, y: 350 }, { t, ext: 50 }); d.dot(c, { x: 300, y: 350 }, { r: 5 }); d.text(c, 'ışın: 1 uç', 660, 350, { size: 26 });
      d.line(c, { x: 330, y: 410 }, { x: 490, y: 410 }, { t, ext: 30, color: N.DEEP }); d.text(c, 'doğru: uç yok', 660, 410, { size: 26, color: N.DEEP });
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
      st.overlay = null; N.dots(TASKS.length + 1, TASKS.length + 1);
      return N.finish({ id: 'arac-ustasi', title: 'Araç Ustası!', film: 'noktadan-cembere',
        text: 'Ölçüsüz cetvel düz çizer, pergel eşit uzaklıkları, gönye dik açıyı garanti eder. Sıradaki oyun: <b>Açı Avcısı</b>.' });
    }
    const Q = QUIZ[i]; st.overlay = null;
    N.say(`<span class="label">Soru ${i + 1} / ${QUIZ.length}</span>${Q.q}`);
    const el = N.panel(`<div class="card"><span class="label">Çıkarım yap</span><div id="qbox"></div><div id="qnext"></div></div>`);
    N.choices(el.querySelector('#qbox'), Q.opts.map((t, k) => ({ t, ok: k === Q.ok })), (o, b, first) => {
      if (!o.ok) { N.sfx.bad(); N.say(`Hmm, emin misin? ${Q.q}`, 'bad'); return; }
      N.sfx.good(); N.addScore(first ? 50 : 20, { x: 500, y: 300 }); N.say(Q.why, 'good');
      const fn = DEMOS[Q.demo], sheet = !['radii', 'perps'].includes(Q.demo); st.dt = 0;
      st.overlay = (c) => { if (sheet) { c.fillStyle = 'rgba(255,250,240,.92)'; c.fillRect(0, 0, W, H); } fn(c, st.dt || 0); };
      N.tween(1300, (t) => { st.dt = t; });
      el.querySelector('#qnext').innerHTML = `<button class="btn primary big" type="button" style="margin-top:10px">${i === QUIZ.length - 1 ? 'Bitir →' : 'Sonraki soru →'}</button>`;
      el.querySelector('#qnext button').addEventListener('click', () => quiz(i + 1));
    }, Q.one ? 'one' : Q.opts.length === 3 ? 'three' : '');
  }

  /* ── başla ── */
  st.done.delete('M_U');
  N.dots(TASKS.length + 1, 0);
  N.say('Merhaba, ben <b>Nokta</b>! Teknemin gövdesi hazır ama denizi, direği, yelkeni… hepsi eksik. Araçlarımla bana yardım eder misin?');
  const el = N.panel(`<div class="card"><span class="label">Nasıl oynanır?</span>
    <p>Her adımda önce <b>doğru aracı</b> seç, sonra aracı kullan: cetvelle <b>sürükle</b>, pergeli <b>döndür</b>, gönyeyi <b>kaydır</b>. Her çizim sahnede canlanır!</p>
    <p class="small">Hatasız adım = 3 yıldız. Art arda hatasız adımlar seri bonusu getirir.</p>
    <button class="btn primary big" id="go" type="button">Başla →</button></div>`);
  el.querySelector('#go').addEventListener('click', startTask);

  if (/onizleme/.test(location.search)) { // ana sayfa görseli: bitmiş, canlı sahne
    TASKS.forEach((T) => { T.pts.forEach((k) => st.shown.add(k)); st.alive[T.id] = 1; });
    st.objs = [
      { k: 'line', a: P.D, b: P.E, ext: 26, t: 1 }, { k: 'seg', a: P.B, b: P.C, t: 1, boat: true }, { k: 'seg', a: P.C, b: P.A, t: 1, boat: true },
      { k: 'circle', c: P.O, r: 50, t: 1 }, { k: 'ray', a: P.T, b: P.S, ext: 150, t: 1 }, { k: 'seg', a: P.M, b: FOOT, t: 1 }, { k: 'right', v: FOOT, u: { x: 0, y: -1 }, w2: { x: 1, y: 0 }, t: 1 },
      { k: 'line', a: { x: 150, y: FLOOR }, b: { x: 700, y: FLOOR }, ext: 900, t: 1 },
    ];
    st.t = 1.3; st.finale = 1;
  }
})();
