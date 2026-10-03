/* Nokta'nın Kasabası · geometri gözlem ortamı (deneme: 3 istasyon)
   Polen'in Vadisi'nden esinlenildi: puan yok; gözlem, "Sence?", yakından inceleme, defter.

   ÖĞRETMENLER İÇİN: Nokta'nın bütün metinleri, görevler ve öğretmen notları
   aşağıdaki KASABA_METINLERI nesnesindedir. Metinleri burada değiştirmeniz yeterli. */
const KASABA_METINLERI = {
  tanitim: [
    { hedef: null, metin: 'Merhaba, ben <b>Nokta</b>! Bu kasabanın her köşesinde geometri saklı. Birlikte gözlem yapalım mı?' },
    { hedef: '#world', metin: 'Tahtayı <b>sürükleyerek</b> kasabada gezebilirsin. Fare tekerleği de sağa sola kaydırır.' },
    { hedef: '#stations', metin: 'Üç gözlem noktası var. Numaraya dokununca oraya giderim.' },
    { hedef: '#scard', metin: 'Her noktada önce bir gözlem, sonra bir <b>“Sence?”</b> sorusu ve görevler var. Tahminini seç, sonra dene.' },
    { hedef: '#zoomBtn', metin: '<b>Yakından incele</b> ile saatin kollarını, sokakları ya da havuzdaki taşları kendin değiştirirsin.' },
    { hedef: '#avBtn', metin: 'Kasabada <b>8 şekil</b> saklı: üçgen çatı, paralel çit… İkisi hareket ediyor! Gördüğünde üstüne dokun.' },
    { hedef: '#defterBtn', metin: 'Tahminlerin ve gözlemlerin <b>deftere</b> yazılır. Sonunda raporunu indirebilirsin.' },
    { hedef: '#havaBtns', metin: 'Havayı değiştir: akşam pencereler yanar, yağmurda havuzda çemberler oluşur. Hadi başlayalım!' },
  ],
  istasyonlar: [
    {
      id: 'saat', ad: 'Saat Kulesi', kod: 'MAT.5.3.3', x: 650, varis: 'Tik tak! Kolların arasında hangi açı saklı?',
      gozlem: 'Kule saatinin iki kolu var: kısa olan akrep, uzun olan yelkovan. Kollar döndükçe aralarında bir açı oluşuyor ve bu açı sürekli değişiyor.',
      soru: 'Saat tam 3:00 iken kollar arasındaki açı nasıl bir açıdır?',
      secenekler: ['Dar açı', 'Dik açı', 'Geniş açı'], dogru: 1,
      gorevler: [
        { id: 'uc', metin: 'Saati 3:00’e ayarla: akrep 3’te, yelkovan 12’de.' },
        { id: 'olc', metin: 'Açıölçeri koy, bir kolu sıfıra hizala, açıyı ölç ve deftere yaz.' },
        { id: 'genis', metin: 'Kolları geniş açı yapacak biçimde çevir, ölç ve yaz.' },
        { id: 'dogru', metin: 'Kolları bir doğru açı oluşturacak biçimde ayarla.' },
      ],
      aciklama: 'Saatin kadranı tam açıdır: <b>360°</b>. 12 eş parçaya bölündüğü için iki rakam arası <b>360 ÷ 12 = 30°</b>. Saat 3:00’te kollar arasında 3 parça var: <b>90°, dik açı</b>. Saat 6:00’da 180°: <b>doğru açı</b>. Açıölçerin merkezi köşeye, sıfır çizgisi bir kola konur; sıfırdan başlayan ölçek okunur.',
      sunum: 'Saat 3:00 iken kollar arasında kaç derece var?',
      oyun: { ad: 'Açı Avcısı', url: 'aci-avcisi.html' },
      ogretmen: 'MAT.5.3.3 Açıları ölçmek için matematiksel araç ve teknolojiden yararlanabilme. Süreç: açıölçeri tanır, uygun aracı belirler ve kullanır; dik açı 90°, doğru açı 180°, tam açı 360°. Saatin 12 eş parçası derece birimine köprü kurar.',
    },
    {
      id: 'kavsak', ad: 'Kavşak', kod: 'MAT.5.3.4', x: 1700, varis: 'İki sokak kesişince dört köşe olur. Say bakalım!',
      gozlem: 'Kasabanın ortasında Çınar Sokağı ile Gül Sokağı kesişiyor. Kesiştikleri yerde dört köşe, yani dört açı oluşuyor. Panodaki haritaya bakalım.',
      soru: 'Gül Sokağı’nı döndürürsek karşılıklı köşelerdeki a ve c açıları ne olur?',
      secenekler: ['Her zaman eşit kalır', 'Biri büyür, öbürü küçülür', 'Hiçbir kural yok'], dogru: 0,
      gorevler: [
        { id: 'dondur', metin: 'Ölçümleri göster ve Gül Sokağı’nı döndür.' },
        { id: 'tablo', metin: 'Üç farklı durumu deftere yaz (a, b, c, d).' },
        { id: 'dik', metin: 'Sokakları dört dik açı oluşacak biçimde kesiştir.' },
        { id: 'paralel', metin: 'Lale Sokağı’nı Çınar Sokağı’na paralel yap: hiç kesişmesinler.' },
      ],
      aciklama: 'Karşılıklı köşeler <b>ters açılardır</b>; sokak nasıl dönerse dönsün <b>a = c</b> ve <b>b = d</b>. Yan yana iki köşe bir doğru üstünde durur: <b>a + b = 180°</b> (komşu bütünler). Dört açı da 90° ise sokaklar <b>diktir</b>. Hiç kesişmeyen, açı oluşturmayan sokaklar <b>paraleldir</b>.',
      sunum: 'Karşılıklı köşelerdeki açılar arasında nasıl bir ilişki var?',
      oyun: { ad: 'Kesişme Dedektifi', url: 'kesisme-dedektifi.html' },
      ogretmen: 'MAT.5.3.4 Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşabilecek açılara dair çıkarım yapabilme. Süreç: varsayım (Sence?), açıları belirleyip tablo temsilinde listeleme (deftere yaz), varsayımla karşılaştırma, önerme sunma (açıklama). Paralel, kesişen ve dik doğrular.',
    },
    {
      id: 'cesme', ad: 'Çeşme Meydanı', kod: 'MAT.5.3.7', x: 2750, varis: 'Taş atınca su halka halka açılır. Çember!',
      gozlem: 'Havuza bir taş atınca su yüzeyinde halkalar yayılıyor. Her halka, taşın düştüğü noktadan eşit uzaklıktaki noktalardan oluşuyor: bir çember!',
      soru: 'İki taşı aynı anda atarsak, halkaların buluştuğu C noktası nerede olur?',
      secenekler: ['A’ya daha yakın', 'B’ye daha yakın', 'İkisine eşit uzaklıkta'], dogru: 2,
      gorevler: [
        { id: 'ikitas', metin: 'Havuza iki taş at: A ve B.' },
        { id: 'bulus', metin: 'Zamanı ilerlet: halkalar buluşunca ABC üçgeni oluşsun.' },
        { id: 'eskenar', metin: 'Halkaları tam |AB| kadar büyüt: eşkenar üçgen.' },
        { id: 'gecikme', metin: 'B taşını geç at ve çeşitkenar bir üçgen bul.' },
      ],
      aciklama: 'Halkalar birer <b>çember</b>; |AC| A halkasının, |BC| B halkasının <b>yarıçapıdır</b>. Taşlar aynı anda atılınca halkalar aynı büyür: |AC| = |BC|, üçgen <b>ikizkenar</b>. Halkalar |AB| kadar büyüyünce üç kenar eşit: <b>eşkenar</b>. Biri geç atılınca üç uzunluk farklı olabilir: <b>çeşitkenar</b>. Hiç cetvel kullanmadık!',
      sunum: 'İki halka nerede buluşur? Oluşan üçgenin kenarları neden eşit?',
      oyun: { ad: 'Pergel Ustası', url: 'pergel-ustasi.html' },
      ogretmen: 'MAT.5.3.7 İki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilen üçgenlerin kenar özelliklerine yönelik çıkarım yapabilme. Su halkaları dinamik bir çember modelidir; zaman kaydırıcısı yarıçapı değiştirir. Yağmurlu havada damlaların halkaları da çember gözlemine bağlanabilir.',
    },
  ],
  avlar: [
    { id: 'cati', ad: 'Üçgen', metin: 'Çatı bir <b>üçgen</b>: 3 kenar, 3 köşe, 3 iç açı.', x: 905, y: 392, r: 46 },
    { id: 'pencere', ad: 'Çember', metin: 'Yuvarlak pencere bir <b>çember</b>: her noktası merkeze eşit uzaklıkta.', x: 650, y: 415, r: 30 },
    { id: 'cit', ad: 'Paralel doğrular', metin: 'Çitin çubukları <b>paralel</b>: hiç kesişmez, aralarındaki uzaklık hep aynı.', x: 1360, y: 562, r: 60 },
    { id: 'tabela', ad: 'Işın', metin: 'Yön tabelasındaki ok bir <b>ışın</b> gibi: bir noktadan başlar, bir yöne doğru gider.', x: 1560, y: 452, r: 40 },
    { id: 'petek', ad: 'Düzgün altıgen', metin: 'Bal dükkânının tabelası <b>düzgün altıgen</b>: 6 eş kenar, 6 eş açı. Arı peteği gibi!', x: 2160, y: 448, r: 36 },
    { id: 'kuslar', ad: 'Açı', metin: 'Kuş sürüsü <b>V</b> biçiminde uçuyor: iki kol öndeki kuşta birleşiyor. Bu bir <b>açı</b>, köşesi öndeki kuş!', dyn: true },
    { id: 'tekerlek', ad: 'Çember', metin: 'Bisiklet tekerleği bir <b>çember</b>. Teller merkezden çembere gidiyor: hepsi eşit uzunlukta <b>yarıçaplar</b>!', dyn: true },
    { id: 'kapi', ad: 'Dik açı', metin: 'Kapının köşesi <b>dik açı</b>: 90°. Gönyeyle kontrol edebilirsin.', x: 2392, y: 598, r: 30 },
  ],
  ogretmenGenel: [
    'Bu bir oyun değil, <b>gözlem ortamı</b>: puan yok. Öğrenci tahmin eder, dener, gözlemini deftere yazar.',
    'Sınıfta: akıllı tahtada <b>sunum modu</b> (P) ile istasyonun sorusunu büyük gösterin; öğrencilere tahmin ettirin; sonra “Yakından incele”de birlikte deneyin.',
    'Her istasyonun sonunda ilgili <b>oyuna</b> bağlantı var; pekiştirme ödevi olarak verilebilir.',
    'Defter ve şekil avı yalnızca o tarayıcıda saklanır. Rapor HTML dosyası olarak iner; yazdırılabilir.',
  ],
};

(() => {
  const { g, d } = N;
  const T = KASABA_METINLERI, STS = T.istasyonlar;
  const WH = 760, GROUND = 600, WW = 3400;
  const $ = (s) => document.querySelector(s);
  const KEY = 'nokta-kasaba';

  /* ══════════ durum ══════════ */
  const save0 = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; } })();
  const st = {
    cur: 0, hava: save0.hava || 'sabah', t: 0,
    done: save0.done || {}, // 'saat.uc': true
    sence: save0.sence || {}, // saat: 1
    log: save0.log || {}, // saat: [..]
    son: save0.son || {}, ad: save0.ad || '',
    av: save0.av || {}, cardMin: false, present: false,
  };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify({ hava: st.hava, done: st.done, sence: st.sence, log: st.log, son: st.son, ad: st.ad, av: st.av })); } catch (_) {} };
  const isDone = (sid, tid) => !!st.done[sid + '.' + tid];
  const stationDone = (S) => S.gorevler.every((t) => isDone(S.id, t.id));
  function markDone(sid, tid) {
    if (isDone(sid, tid)) return;
    st.done[sid + '.' + tid] = true; persist(); N.sfx.good();
    const S = STS.find((x) => x.id === sid), task = S.gorevler.find((x) => x.id === tid);
    toast(`Görev tamam: <b>${task.metin}</b>`);
    renderCard(); renderStations(); if (zoomOpen) renderZSide();
    if (stationDone(S)) setTimeout(() => { toast(`<b>${S.ad}</b> tamamlandı! Açıklamayı oku ya da sonraki noktaya geç.`); N.sfx.win(); }, 900);
  }
  function addLog(sid, line) { const L = (st.log[sid] = st.log[sid] || []); if (!L.includes(line)) { L.push(line); persist(); } }
  let toastT; function toast(html) { const el = $('#toast'); el.innerHTML = html; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 3200); }

  /* ══════════ dünya tuvali ══════════ */
  const cv = $('#world'), ctx = cv.getContext('2d');
  const img = new Image(); img.src = '../img/nokta.png';
  let dpr = 1, s = 1, vw = 1000;
  const cam = { x: STS[0].x, tx: STS[0].x };
  const nokta = { x: STS[0].x - 150, tx: STS[0].x - 150, hop: 0 };
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    s = innerHeight / WH; vw = innerWidth / s;
  }
  addEventListener('resize', resize); resize();
  const clampCam = (x) => (vw >= WW ? WW / 2 : Math.max(vw / 2, Math.min(WW - vw / 2, x)));
  function focusX(i) { const off = innerWidth > 900 ? (Math.min(410, innerWidth * .4) / 2 + 20) / s : 0; return clampCam(STS[i].x - off); }
  const layer = (p) => ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (innerWidth / 2 - cam.x * p * s), 0);
  const toWorld = (cx, cy) => ({ x: (cx - innerWidth / 2) / s + cam.x, y: cy / s });

  const PAL = {
    sabah: { sky: ['#efe4cc', '#f8ecd2'], far: 'rgba(23,20,17,.09)', mid: 'rgba(23,20,17,.12)', ground: '#e6d9bd', tint: null },
    aksam: { sky: ['#2c3650', '#7d6f88'], far: 'rgba(15,18,30,.35)', mid: 'rgba(15,18,30,.4)', ground: '#cdbfa3', tint: 'rgba(28,36,66,.42)' },
    yagmur: { sky: ['#bdbbb5', '#dcd7cc'], far: 'rgba(23,20,17,.12)', mid: 'rgba(23,20,17,.14)', ground: '#d7cfbf', tint: 'rgba(70,80,92,.16)' },
  };

  // ── çizim yardımcıları
  const wobble = (x) => Math.sin(x * .013) * 40 + Math.sin(x * .031 + 1) * 18 + Math.sin(x * .007 + 2) * 30;
  function sky() {
    const P = PAL[st.hava]; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gr = ctx.createLinearGradient(0, 0, 0, innerHeight); gr.addColorStop(0, P.sky[0]); gr.addColorStop(1, P.sky[1]);
    ctx.fillStyle = gr; ctx.fillRect(0, 0, innerWidth, innerHeight);
    layer(.05);
    if (st.hava === 'sabah') { const sx = 900, sy = 120; const gl = ctx.createRadialGradient(sx, sy, 10, sx, sy, 130); gl.addColorStop(0, 'rgba(232,163,61,.55)'); gl.addColorStop(1, 'rgba(232,163,61,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(sx, sy, 130, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(sx, sy, 42, 0, 7); ctx.fillStyle = '#ecae4f'; ctx.fill(); }
    if (st.hava === 'aksam') {
      ctx.fillStyle = 'rgba(255,248,230,.85)'; for (let i = 0; i < 60; i++) { const x = (i * 197) % 2200 - 300, y = (i * 83) % 330 + 20, r = (i % 3) * .5 + .8; ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(st.t * .8 + i)); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(980, 110, 34, 0, 7); ctx.fillStyle = '#f3e7c4'; ctx.fill(); ctx.beginPath(); ctx.arc(994, 102, 30, 0, 7); ctx.fillStyle = PAL.aksam.sky[0]; ctx.fill();
    }
    layer(.15);
    const cc = st.hava === 'yagmur' ? 'rgba(120,120,125,.55)' : st.hava === 'aksam' ? 'rgba(90,95,120,.5)' : 'rgba(255,252,244,.9)';
    const n = st.hava === 'yagmur' ? 12 : 6;
    for (let i = 0; i < n; i++) { const x = ((i * 430 + st.t * (8 + i % 3 * 4)) % 1900) - 200, y = 60 + (i * 47) % 140; cloud(x, y, .8 + (i % 3) * .3, cc); }
  }
  function cloud(x, y, k, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.beginPath();
    ctx.arc(0, 0, 24, Math.PI * .9, Math.PI * 1.95); ctx.arc(34, -12, 30, Math.PI * 1.05, Math.PI * 1.9); ctx.arc(70, 0, 22, Math.PI * 1.2, Math.PI * .1); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(23,20,17,.18)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }
  const toLayer = (cx, cy, p) => ({ x: (cx - innerWidth / 2) / s + cam.x * p, y: cy / s });

  /* ── uzak katman: tepeler, cami, yel değirmeni ── */
  function farLayer() {
    layer(.3); const P = PAL[st.hava];
    ctx.beginPath(); ctx.moveTo(-800, WH);
    for (let x = -800; x <= 2200; x += 20) ctx.lineTo(x, 420 - wobble(x) * .9 - 30);
    ctx.lineTo(2200, WH); ctx.closePath(); ctx.fillStyle = P.far; ctx.fill();
    const cx = 760, by = 420 - wobble(760) * .9 - 30;
    ctx.fillStyle = P.far;
    ctx.fillRect(cx - 70, by - 50, 140, 50); ctx.beginPath(); ctx.arc(cx, by - 50, 52, Math.PI, 0); ctx.fill();
    [cx - 92, cx + 92].forEach((mx) => { ctx.fillRect(mx - 6, by - 150, 12, 150); ctx.beginPath(); ctx.moveTo(mx - 8, by - 150); ctx.lineTo(mx, by - 182); ctx.lineTo(mx + 8, by - 150); ctx.fill(); });
    // uzak ağaçlar
    for (let i = 0; i < 26; i++) { const x = -500 + i * 105 + (i % 4) * 17, y = 420 - wobble(x) * .9 - 26; ctx.beginPath(); ctx.arc(x, y - 14, 13 + (i % 3) * 4, 0, 7); ctx.fill(); }
    // yel değirmeni: kanatlar hep dik açıyla
    const wx = 1460, wy = 420 - wobble(1460) * .9 - 30;
    ctx.fillStyle = P.mid; ctx.beginPath(); ctx.moveTo(wx - 20, wy + 4); ctx.lineTo(wx - 11, wy - 92); ctx.lineTo(wx + 11, wy - 92); ctx.lineTo(wx + 20, wy + 4); ctx.fill();
    ctx.save(); ctx.translate(wx, wy - 92); ctx.rotate(st.t * .6);
    for (let k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); ctx.fillRect(-2, 0, 4, 70); ctx.fillRect(2, 18, 13, 50); }
    ctx.restore(); ctx.beginPath(); ctx.arc(wx, wy - 92, 6, 0, 7); ctx.fill();
  }
  function balloon() {
    if (st.hava === 'yagmur') return;
    layer(.1); const x = ((st.t * 7) % 2000) - 400, y = 160 + Math.sin(st.t * .5) * 14;
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.clip();
    for (let k = -3; k <= 3; k++) { ctx.fillStyle = k % 2 ? N.AMBER : N.SEAL; ctx.fillRect(x + k * 11 - 5.5, y - 40, 11, 80); }
    ctx.restore(); ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 20, y + 27); ctx.lineTo(x - 8, y + 52); ctx.moveTo(x + 20, y + 27); ctx.lineTo(x + 8, y + 52); ctx.stroke();
    ctx.fillStyle = '#9b7653'; ctx.fillRect(x - 9, y + 52, 18, 13); ctx.strokeRect(x - 9, y + 52, 18, 13);
  }
  /* kuş sürüsü (V = açı) */
  const birdsAt = () => ({ x: ((st.t * 55) % 2600) - 500, y: 200 + Math.sin(st.t * .3) * 20 });
  function birds() {
    if (st.hava === 'yagmur') return;
    layer(.2); const b = birdsAt(), pts = [{ x: b.x, y: b.y }];
    for (let k = 1; k <= 3; k++) { pts.push({ x: b.x - 30 * k, y: b.y - 17 * k }); pts.push({ x: b.x - 30 * k, y: b.y + 17 * k }); }
    if (st.av.kuslar) { ctx.setLineDash([6, 6]); ctx.strokeStyle = N.AMBER; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(pts[5].x, pts[5].y); ctx.lineTo(b.x, b.y); ctx.lineTo(pts[6].x, pts[6].y); ctx.stroke(); ctx.setLineDash([]); }
    ctx.strokeStyle = st.hava === 'aksam' ? '#e9e2d0' : N.INK; ctx.lineWidth = 2.6;
    pts.forEach((p, i) => { const f = Math.sin(st.t * 9 + i) * 6; ctx.beginPath(); ctx.moveTo(p.x - 11, p.y - 2 + f); ctx.quadraticCurveTo(p.x - 5, p.y - 7 - f * .3, p.x, p.y); ctx.quadraticCurveTo(p.x + 5, p.y - 7 - f * .3, p.x + 11, p.y - 2 + f); ctx.stroke(); });
  }
  function midLayer() {
    layer(.6); const P = PAL[st.hava];
    for (let i = 0; i < 22; i++) {
      const x = -400 + i * 145 + (i % 3) * 20, w = 90 + (i % 4) * 18, h = 110 + ((i * 37) % 70), base = 560;
      ctx.fillStyle = P.mid; ctx.fillRect(x, base - h, w, h);
      ctx.beginPath(); ctx.moveTo(x - 8, base - h); ctx.lineTo(x + w / 2, base - h - 46 - (i % 2) * 14); ctx.lineTo(x + w + 8, base - h); ctx.fill();
      if (i % 3 === 0) ctx.fillRect(x + w * .7, base - h - 40, 12, 30);
      const lit = st.hava === 'aksam';
      for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) {
        const on = lit && (i + k + j) % 3 && Math.sin(st.t * .2 + i * 3 + k) > -.85;
        ctx.fillStyle = on ? 'rgba(244,190,96,.85)' : lit ? 'rgba(255,240,200,.18)' : 'rgba(255,250,240,.35)';
        ctx.fillRect(x + 16 + j * (w - 48), base - h + 22 + k * 40, 16, 22);
      }
    }
  }

  /* ── ana katman nesneleri ── */
  function inkRect(x, y, w, h, fill, lw = 3) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); ctx.strokeStyle = N.INK; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h); }
  function smoke(x, y) {
    for (let k = 0; k < 5; k++) { const ph = (st.t * .3 + k / 5) % 1; ctx.beginPath(); ctx.arc(x + ph * 26 + Math.sin(st.t + k) * 4, y - ph * 90, 6 + ph * 14, 0, 7); ctx.fillStyle = `rgba(${st.hava === 'aksam' ? '200,200,215' : '120,110,100'},${.32 * (1 - ph)})`; ctx.fill(); }
  }
  function house(x, w, h, roof, opts = {}) {
    const top = GROUND - h, rh = opts.rh || 70, lit = st.hava === 'aksam';
    if (opts.chimney != null) { const cx = x + opts.chimney; inkRect(cx, top - rh * .62, 18, rh * .45, '#b65a3f'); smoke(cx + 9, top - rh * .62 - 6); }
    inkRect(x, top, w, h, opts.wall || '#f6ecd8');
    // kiremit çizgileri
    ctx.beginPath(); ctx.moveTo(x - 14, top); ctx.lineTo(x + w / 2, top - rh); ctx.lineTo(x + w + 14, top); ctx.closePath();
    ctx.fillStyle = roof; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(23,20,17,.22)'; ctx.lineWidth = 1.5;
    for (let yy = top - rh + 14; yy < top; yy += 13) { ctx.beginPath(); for (let xx = x - 20 + ((yy / 13) % 2) * 8; xx < x + w + 20; xx += 16) { ctx.moveTo(xx, yy); ctx.arc(xx + 8, yy, 8, Math.PI, 0); } ctx.stroke(); }
    ctx.restore(); ctx.beginPath(); ctx.moveTo(x - 14, top); ctx.lineTo(x + w / 2, top - rh); ctx.lineTo(x + w + 14, top); ctx.closePath(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    const win = (wx, wy, ww, wh) => {
      const on = lit && Math.sin(st.t * .15 + wx * .7) > -.6;
      ctx.fillStyle = on ? '#f5c06a' : lit ? '#55607a' : '#d7e1e4'; ctx.fillRect(wx, wy, ww, wh); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.strokeRect(wx, wy, ww, wh);
      ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.lineWidth = 1.5; ctx.stroke();
      if (opts.shutters) { ctx.fillStyle = opts.shutters; [wx - 12, wx + ww].forEach((sx) => { ctx.fillRect(sx, wy, 12, wh); ctx.strokeRect(sx, wy, 12, wh); }); }
      if (opts.box) { ctx.fillStyle = '#9b7653'; ctx.fillRect(wx - 4, wy + wh, ww + 8, 8); ctx.strokeRect(wx - 4, wy + wh, ww + 8, 8); for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.arc(wx + 3 + f * (ww / 3), wy + wh - 2 + Math.sin(st.t * 2 + f + wx) * .8, 4, 0, 7); ctx.fillStyle = f % 2 ? N.SEAL : N.AMBER; ctx.fill(); } }
    };
    const rows = Math.max(1, Math.floor((h - 70) / 60));
    for (let r = 0; r < rows; r++) { if (opts.bay && r === rows - 1 && rows > 1) continue; win(x + 18, top + 22 + r * 60, 30, 34); if (w > 110) win(x + w - 48, top + 22 + r * 60, 30, 34); }
    if (opts.bay) { // cumba
      const by = top + 18, bw = w + 24; inkRect(x - 12, by, bw, 64, opts.wall || '#f6ecd8'); ctx.fillStyle = '#9b7653'; ctx.fillRect(x - 16, by + 64, bw + 8, 8); ctx.strokeRect(x - 16, by + 64, bw + 8, 8);
      for (let k = 0; k < 3; k++) win(x - 2 + k * (bw - 20) / 3, by + 12, 30, 40);
      [0, 1, 2].forEach((k) => { ctx.beginPath(); ctx.moveTo(x - 6 + k * bw / 2.6, by + 72); ctx.lineTo(x + 6 + k * bw / 2.6, by + 92); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke(); });
    }
    const dx = x + w / 2 - 20; ctx.fillStyle = '#7b5a3c'; ctx.fillRect(dx, GROUND - 62, 40, 62); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.strokeRect(dx, GROUND - 62, 40, 62);
    ctx.beginPath(); ctx.arc(dx + 31, GROUND - 30, 2.5, 0, 7); ctx.fillStyle = N.INK; ctx.fill();
    if (opts.awning) { ctx.save(); ctx.beginPath(); ctx.moveTo(dx - 26, GROUND - 92); ctx.lineTo(dx + 66, GROUND - 92); ctx.lineTo(dx + 76, GROUND - 70); ctx.lineTo(dx - 36, GROUND - 70); ctx.closePath(); ctx.clip(); for (let k = 0; k < 9; k++) { ctx.fillStyle = k % 2 ? '#fffaf0' : opts.awning; ctx.fillRect(dx - 36 + k * 13, GROUND - 92, 13, 24); } ctx.restore(); ctx.beginPath(); ctx.moveTo(dx - 26, GROUND - 92); ctx.lineTo(dx + 66, GROUND - 92); ctx.lineTo(dx + 76, GROUND - 70); ctx.lineTo(dx - 36, GROUND - 70); ctx.closePath(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke(); }
    if (opts.sign) opts.sign();
  }
  function tree(x, k = 1) {
    ctx.fillStyle = '#6b4f35'; ctx.fillRect(x - 7 * k, GROUND - 90 * k, 14 * k, 90 * k); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.strokeRect(x - 7 * k, GROUND - 90 * k, 14 * k, 90 * k);
    const sway = Math.sin(st.t * 1.2 + x) * 2.5;
    [[0, -120, 46], [-34, -98, 34], [34, -100, 36], [0, -158, 34]].forEach(([dx, dy, r], i) => { ctx.beginPath(); ctx.arc(x + dx * k + sway * (1 + i * .3), GROUND + dy * k, r * k, 0, 7); ctx.fillStyle = st.hava === 'aksam' ? '#4f6150' : i === 3 ? '#9bb383' : '#87a074'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke(); });
    if (st.hava !== 'yagmur') for (let i = 0; i < 3; i++) { // düşen yapraklar
      const ph = (st.t * .12 + i / 3 + x * .001) % 1, lx = x + Math.sin(st.t * 1.3 + i * 2) * 34 + (i - 1) * 24, ly = GROUND - 150 * k + ph * 150 * k;
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(st.t * 2 + i); ctx.beginPath(); ctx.ellipse(0, 0, 6, 3, 0, 0, 7); ctx.fillStyle = i % 2 ? N.AMBER : '#87a074'; ctx.globalAlpha = 1 - ph * .6; ctx.fill(); ctx.restore(); ctx.globalAlpha = 1;
    }
  }
  function lamp(x) {
    ctx.strokeStyle = N.INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x, GROUND - 150); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 14, GROUND - 150); ctx.lineTo(x + 14, GROUND - 150); ctx.lineTo(x + 9, GROUND - 176); ctx.lineTo(x - 9, GROUND - 176); ctx.closePath();
    ctx.fillStyle = st.hava === 'aksam' ? '#ffd27a' : '#f6ecd8'; ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke();
  }
  function lampGlow(x) {
    const gl = ctx.createRadialGradient(x, GROUND - 163, 4, x, GROUND - 163, 120); gl.addColorStop(0, 'rgba(255,200,110,.55)'); gl.addColorStop(1, 'rgba(255,200,110,0)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, GROUND - 163, 120, 0, 7); ctx.fill();
  }
  let bellAmp = 0;
  function clockTower() {
    const x = 650, cl = clock;
    inkRect(x - 62, 170, 124, GROUND - 170, '#efe0c2');
    ctx.strokeStyle = 'rgba(23,20,17,.25)'; ctx.lineWidth = 1.5;
    for (let y = 196; y < GROUND; y += 26) { ctx.beginPath(); ctx.moveTo(x - 62, y); ctx.lineTo(x + 62, y); ctx.stroke(); for (let xx = x - 62 + ((y / 26) % 2) * 20; xx < x + 62; xx += 40) { ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx, y + 26); ctx.stroke(); } }
    // çan
    ctx.fillStyle = '#3b3530'; ctx.fillRect(x - 40, 106, 80, 64); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.strokeRect(x - 40, 106, 80, 64);
    const sw = Math.sin(st.t * 7) * .45 * bellAmp; bellAmp *= .985;
    ctx.save(); ctx.translate(x, 112); ctx.rotate(sw); ctx.beginPath(); ctx.moveTo(-16, 40); ctx.quadraticCurveTo(-16, 6, 0, 6); ctx.quadraticCurveTo(16, 6, 16, 40); ctx.lineTo(20, 46); ctx.lineTo(-20, 46); ctx.closePath(); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 48, 4, 0, 7); ctx.fillStyle = N.INK; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(x - 84, 108); ctx.lineTo(x, 34); ctx.lineTo(x + 84, 108); ctx.closePath(); ctx.fillStyle = '#c4432b'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, 34); ctx.lineTo(x, 8); ctx.stroke(); const fl = Math.sin(st.t * 5) * 3; ctx.beginPath(); ctx.moveTo(x, 10); ctx.quadraticCurveTo(x + 12, 12 + fl, x + 24, 15 + fl); ctx.lineTo(x, 22); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.stroke();
    // saat (yelkovan ve akrep yakın plandaki ayarı gösterir; saniye kolu gerçek zamanla döner)
    const c = { x, y: 250 }, R = 50;
    ctx.beginPath(); ctx.arc(c.x, c.y, R + 6, 0, 7); ctx.fillStyle = '#c9b48d'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = N.INK; ctx.stroke();
    ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, 7); ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(c.x + Math.sin(a) * (R - 4), c.y - Math.cos(a) * (R - 4)); ctx.lineTo(c.x + Math.sin(a) * (R - 11), c.y - Math.cos(a) * (R - 11)); ctx.lineWidth = 2.5; ctx.stroke(); }
    const hand = (deg, L, w, col) => { const a = g.rad(deg); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.sin(a) * L, c.y - Math.cos(a) * L); ctx.lineWidth = w; ctx.strokeStyle = col || N.INK; ctx.stroke(); };
    hand(cl.h, 28, 6); hand(cl.m, 40, 3.5); hand((Date.now() / 1000 % 60) * 6, 44, 1.5, N.SEAL);
    ctx.beginPath(); ctx.arc(c.x, c.y, 4, 0, 7); ctx.fillStyle = N.INK; ctx.fill();
    ctx.beginPath(); ctx.arc(x, 415, 22, 0, 7); ctx.fillStyle = st.hava === 'aksam' ? '#f5c06a' : '#d7e1e4'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = N.INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 22, 415); ctx.lineTo(x + 22, 415); ctx.moveTo(x, 393); ctx.lineTo(x, 437); ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 26, GROUND); ctx.lineTo(x - 26, GROUND - 60); ctx.arc(x, GROUND - 60, 26, Math.PI, 0); ctx.lineTo(x + 26, GROUND); ctx.fillStyle = '#7b5a3c'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
  }
  function bunting(a, b, sag, n) {
    const P = (t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t + Math.sin(Math.PI * t) * sag });
    ctx.strokeStyle = N.INK; ctx.lineWidth = 1.8; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const p = P(i / 30); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.stroke();
    for (let i = 1; i < n; i++) { const p = P(i / n), q = P((i + .5) / n), w = Math.sin(st.t * 3 + i) * 3; ctx.beginPath(); ctx.moveTo(p.x - 9, p.y); ctx.lineTo(p.x + 9, p.y); ctx.lineTo((p.x + q.x) / 2 * 0 + p.x + w, p.y + 22); ctx.closePath(); ctx.fillStyle = [N.AMBER, N.SEAL, '#fffaf0', '#87a074'][i % 4]; ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  function laundry(a, b) {
    ctx.strokeStyle = N.INK; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 20, b.x, b.y); ctx.stroke();
    [.25, .5, .75].forEach((t, i) => {
      const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t + Math.sin(Math.PI * t) * 10, sw = Math.sin(st.t * 2.2 + i) * .12;
      ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.fillStyle = ['#fffaf0', N.AMBER, '#8fb0bd'][i];
      ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.lineTo(20, 10); ctx.lineTo(12, 12); ctx.lineTo(11, 32); ctx.lineTo(-11, 32); ctx.lineTo(-12, 12); ctx.lineTo(-20, 10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    });
  }
  function trafficLight(x) {
    ctx.strokeStyle = N.INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x, 470); ctx.stroke();
    inkRect(x - 12, 412, 24, 62, '#2f2a26', 2.5);
    const ph = st.t % 9, on = ph < 4 ? 2 : ph < 5 ? 1 : 0;
    ['#c4432b', '#e8a33d', '#6ba05b'].forEach((col, i) => { ctx.beginPath(); ctx.arc(x, 424 + i * 19, 7, 0, 7); ctx.fillStyle = i === on ? col : 'rgba(255,255,255,.12)'; ctx.fill(); });
    return on;
  }
  function car(x, y, k, col, back, lit) {
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(-36, -24); ctx.quadraticCurveTo(-30, -48, 0, -48); ctx.quadraticCurveTo(30, -48, 36, -24); ctx.lineTo(36, 0); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3 / Math.max(.5, k); ctx.stroke();
    ctx.fillStyle = lit ? '#f5c06a' : '#d7e1e4'; ctx.fillRect(-24, -42, 48, 16); ctx.strokeRect(-24, -42, 48, 16);
    ctx.fillStyle = N.INK; ctx.fillRect(-34, -2, 14, 10); ctx.fillRect(20, -2, 14, 10);
    [-24, 24].forEach((lx) => { ctx.beginPath(); ctx.arc(lx, -14, 6, 0, 7); ctx.fillStyle = back ? N.SEAL : (st.hava === 'aksam' ? '#fff3c4' : '#fffaf0'); ctx.fill(); ctx.stroke(); });
    ctx.restore();
  }
  function crossroad() {
    ctx.beginPath(); ctx.moveTo(1600, GROUND); ctx.lineTo(1690, 470); ctx.lineTo(1730, 470); ctx.lineTo(1830, GROUND); ctx.closePath(); ctx.fillStyle = 'rgba(23,20,17,.12)'; ctx.fill();
    ctx.setLineDash([16, 14]); ctx.strokeStyle = 'rgba(255,250,240,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1715, GROUND); ctx.lineTo(1710, 474); ctx.stroke(); ctx.setLineDash([]);
    // yaya geçidi
    for (let k = 0; k < 6; k++) { ctx.fillStyle = 'rgba(255,250,240,.85)'; ctx.fillRect(1612 + k * 36, GROUND + 6, 22, 30); }
    // arabalar: biri uzaklaşır, biri yaklaşır (ışık kırmızıyken yaklaşan bekler)
    const on = trafficLight(1640);
    const cars = [];
    const ph1 = (st.t * .11) % 1; cars.push({ u: ph1, lane: 1, col: N.AMBER, back: true });
    carT += on === 0 && carU > .55 && carU < .62 ? 0 : 1 / 60 * .13; carU = 1 - (carT % 1); cars.push({ u: carU, lane: -1, col: '#5b7a8c', back: false });
    cars.sort((a, b) => b.u - a.u).forEach((C) => { const u = C.u, k = 1 - .82 * u; car(1714 - 4 * u + C.lane * 30 * (1 - u * .85), GROUND + 2 - 130 * u, k, C.col, C.back, st.hava === 'aksam'); });
    // yön tabelası
    ctx.strokeStyle = N.INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1560, GROUND); ctx.lineTo(1560, 420); ctx.stroke();
    const arrowSign = (y, dir, txt, rot) => {
      ctx.save(); ctx.translate(1560, y); ctx.rotate(rot); ctx.beginPath();
      ctx.moveTo(0, -14); ctx.lineTo(dir * 92, -14); ctx.lineTo(dir * 112, 0); ctx.lineTo(dir * 92, 14); ctx.lineTo(0, 14); ctx.closePath();
      ctx.fillStyle = '#f6ecd8'; ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke();
      ctx.font = `600 13px ${N.MONO}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, dir * 50, 1); ctx.restore();
    };
    arrowSign(440, 1, 'GÜL SK.', -.12); arrowSign(475, -1, 'ÇINAR SK.', .08);
    // harita panosu
    ctx.lineWidth = 5; [1780, 1900].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x, 420); ctx.stroke(); });
    inkRect(1760, 390, 160, 110, '#fffaf0', 3.5);
    ctx.save(); ctx.beginPath(); ctx.rect(1762, 392, 156, 106); ctx.clip();
    ctx.fillStyle = '#e4e8d4'; ctx.fillRect(1762, 392, 156, 106);
    const o = { x: 1840, y: 445 };
    const st2 = (deg, col, oo = o) => { const u = g.dir(g.rad(deg)); ctx.strokeStyle = col; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(oo.x - u.x * 120, oo.y - u.y * 120); ctx.lineTo(oo.x + u.x * 120, oo.y + u.y * 120); ctx.stroke(); };
    st2(20, '#cbbd9e'); st2(map.gul, '#cbbd9e'); if (map.laleOn) st2(map.lale, '#cbbd9e', { x: 1840, y: 408 });
    const blink = Math.sin(st.t * 4) > 0; ctx.beginPath(); ctx.arc(o.x, o.y, 5, 0, 7); ctx.fillStyle = blink ? N.SEAL : N.INK; ctx.fill();
    ctx.restore();
    ctx.font = `400 22px ${N.BRUSH}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.fillText('HARİTA', 1840, 380);
  }
  let carT = 0, carU = 1;
  /* güvercinler ve ördekler */
  const PIGEONS = [2560, 2610, 2650, 2880, 2925, 2965].map((x, i) => ({ x, fly: -99, i }));
  function pigeons() {
    PIGEONS.forEach((pg) => {
      if (Math.abs(nokta.x - pg.x) < 110 && st.t - pg.fly > 9) { pg.fly = st.t; }
      const f = (st.t - pg.fly) / 7, flying = f >= 0 && f < 1;
      const x = pg.x + (flying ? Math.sin(f * Math.PI) * 160 * (pg.i % 2 ? 1 : -1) : 0), y = GROUND + 16 - (flying ? Math.sin(f * Math.PI) * 300 : 0);
      ctx.save(); ctx.translate(x, y); if (pg.i % 2) ctx.scale(-1, 1);
      ctx.beginPath(); ctx.ellipse(0, -9, 13, 9, 0, 0, 7); ctx.fillStyle = '#9a9aa0'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
      if (flying) { const w = Math.sin(st.t * 18) * 12; ctx.beginPath(); ctx.moveTo(-4, -12); ctx.lineTo(-10, -26 - w); ctx.moveTo(4, -12); ctx.lineTo(10, -26 - w); ctx.stroke(); }
      const peck = !flying && Math.sin(st.t * 3 + pg.i * 2) > .7 ? 8 : 0;
      ctx.beginPath(); ctx.arc(11, -18 + peck, 6, 0, 7); ctx.fillStyle = '#7f7f88'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(16, -18 + peck); ctx.lineTo(22, -16 + peck); ctx.lineTo(16, -15 + peck); ctx.fillStyle = N.AMBER; ctx.fill();
      if (!flying) { ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-2, 4); ctx.moveTo(4, 0); ctx.lineTo(4, 4); ctx.strokeStyle = N.SEAL; ctx.stroke(); }
      ctx.restore();
    });
  }
  function ducks(cx, cy) {
    for (let k = 0; k < 2; k++) {
      const a = st.t * .28 + k * Math.PI, x = cx + Math.cos(a) * 128, y = cy - 4 + Math.sin(a) * 15, dir = -Math.sin(a) >= 0 ? 1 : -1;
      ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
      ctx.beginPath(); ctx.ellipse(0, -6, 15, 8, 0, 0, Math.PI * 2); ctx.fillStyle = k ? '#fffaf0' : '#f1d27a'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(11, -16, 6, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(16, -16); ctx.lineTo(23, -14); ctx.lineTo(16, -12); ctx.fillStyle = N.AMBER; ctx.fill();
      ctx.restore();
    }
  }
  function fountain() {
    const cx = 2750, cy = 585, P = st.hava;
    ctx.beginPath(); ctx.ellipse(cx, cy, 190, 40, 0, 0, 7); ctx.fillStyle = '#d9cbb0'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy - 6, 170, 30, 0, 0, 7); ctx.fillStyle = P === 'aksam' ? '#3f5a6b' : '#8fb0bd'; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
    const rings = P === 'yagmur' ? 10 : 4;
    for (let i = 0; i < rings; i++) {
      const per = 2.4, k = ((st.t / per + i * .37) % 1), seed = Math.floor(st.t / per + i * .37) * 13 + i * 7;
      const rx = P === 'yagmur' ? cx + ((seed * 53) % 280) - 140 : cx + [-70, 70, -30, 40][i], ry = cy - 6 + (P === 'yagmur' ? ((seed * 29) % 30) - 15 : 6);
      ctx.beginPath(); ctx.ellipse(rx, ry, 4 + k * 34, 1.5 + k * 7, 0, 0, 7); ctx.strokeStyle = `rgba(255,255,255,${.8 * (1 - k)})`; ctx.lineWidth = 2; ctx.stroke();
    }
    ducks(cx, cy);
    inkRect(cx - 14, cy - 110, 28, 104, '#e8dcc2');
    ctx.beginPath(); ctx.ellipse(cx, cy - 112, 50, 12, 0, 0, 7); ctx.fillStyle = '#e8dcc2'; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = P === 'aksam' ? 'rgba(170,200,215,.8)' : 'rgba(110,160,180,.85)'; ctx.lineWidth = 3;
    for (const sd of [-1, 1]) for (let j = 0; j < 3; j++) { const w = 40 + j * 22; ctx.beginPath(); ctx.moveTo(cx, cy - 130); ctx.quadraticCurveTo(cx + sd * w * .6, cy - 190 + j * 8 + Math.sin(st.t * 3 + j) * 3, cx + sd * w * 1.6, cy - 30); ctx.stroke(); }
    for (let i = 0; i < 10; i++) { const ph = (st.t * .9 + i / 10) % 1, sd = i % 2 ? 1 : -1, w = 40 + (i % 3) * 22; const x = cx + sd * w * 1.6 * ph, y = cy - 130 - Math.sin(ph * Math.PI) * 50 + ph * 100; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fillStyle = 'rgba(200,225,235,.9)'; ctx.fill(); }
    [cx - 300, cx + 240].forEach((bx) => { ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.fillStyle = '#9b7653'; ctx.fillRect(bx, GROUND - 34, 70, 9); ctx.strokeRect(bx, GROUND - 34, 70, 9); ctx.fillRect(bx, GROUND - 58, 70, 8); ctx.strokeRect(bx, GROUND - 58, 70, 8); ctx.beginPath(); ctx.moveTo(bx + 8, GROUND - 25); ctx.lineTo(bx + 8, GROUND); ctx.moveTo(bx + 62, GROUND - 25); ctx.lineTo(bx + 62, GROUND); ctx.stroke(); });
  }
  function fence() {
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.fillStyle = '#f6ecd8';
    for (let x = 1300; x <= 1430; x += 18) { ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x, GROUND - 66); ctx.lineTo(x + 4.5, GROUND - 74); ctx.lineTo(x + 9, GROUND - 66); ctx.lineTo(x + 9, GROUND); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(1294, GROUND - 52); ctx.lineTo(1442, GROUND - 52); ctx.moveTo(1294, GROUND - 22); ctx.lineTo(1442, GROUND - 22); ctx.stroke();
    // çitin üstünde kedi
    const tail = Math.sin(st.t * 2) * .5, cx = 1395, cy = GROUND - 74;
    ctx.fillStyle = '#3b3530'; ctx.beginPath(); ctx.ellipse(cx, cy - 10, 16, 10, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(cx + 15, cy - 20, 8, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 9, cy - 25); ctx.lineTo(cx + 11, cy - 34); ctx.lineTo(cx + 15, cy - 27); ctx.moveTo(cx + 16, cy - 27); ctx.lineTo(cx + 20, cy - 34); ctx.lineTo(cx + 22, cy - 24); ctx.fill();
    ctx.save(); ctx.translate(cx - 14, cy - 8); ctx.rotate(tail); ctx.strokeStyle = '#3b3530'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-14, 4, -12, 22); ctx.stroke(); ctx.restore();
    const blink = (st.t % 4) < .15; if (!blink) { ctx.fillStyle = N.AMBER; ctx.beginPath(); ctx.arc(cx + 13, cy - 21, 1.8, 0, 7); ctx.arc(cx + 19, cy - 21, 1.8, 0, 7); ctx.fill(); }
  }
  function hexSign() {
    const c = { x: 2160, y: 448 }, sw = Math.sin(st.t * 1.5) * .05; ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c.x - 30, 380); ctx.lineTo(c.x + 4, 380); ctx.stroke();
    ctx.save(); ctx.translate(c.x, 380); ctx.rotate(sw); ctx.translate(-c.x, -380);
    ctx.beginPath(); ctx.moveTo(c.x, 380); ctx.lineTo(c.x, 414); ctx.stroke();
    ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; const p = { x: c.x + Math.cos(a) * 34, y: c.y + Math.sin(a) * 34 }; i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.closePath();
    ctx.fillStyle = N.AMBER; ctx.fill(); ctx.stroke(); ctx.font = `400 20px ${N.BRUSH}`; ctx.fillStyle = N.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BAL', c.x, c.y + 1); ctx.restore();
    // arı
    const bx = c.x + Math.cos(st.t * 2.3) * 52, by = c.y + Math.sin(st.t * 3.1) * 30; ctx.beginPath(); ctx.ellipse(bx, by, 5, 3.5, 0, 0, 7); ctx.fillStyle = N.AMBER; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(bx - 1, by - 5, 3, 4, 0, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill();
  }
  function bakerySign() { // fırın: simit tabelası (çember)
    const x = 905, y = 488, sw = Math.sin(st.t * 1.4) * .06;
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 50, 470); ctx.lineTo(x + 92, 470); ctx.stroke();
    ctx.save(); ctx.translate(x + 82, 470); ctx.rotate(sw);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 8); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 30, 22, 0, 7); ctx.arc(0, 30, 9, 0, 7, true); ctx.fillStyle = '#c98a3d'; ctx.fill('evenodd'); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 30, 9, 0, 7); ctx.stroke();
    ctx.fillStyle = '#fffaf0'; for (let i = 0; i < 9; i++) { const a = i * .7; ctx.fillRect(Math.cos(a) * 15 - 1, 30 + Math.sin(a) * 15 - 1, 2.5, 2.5); }
    ctx.restore();
  }
  /* kasabalılar */
  const WALKERS = [
    { a: 120, b: 560, sp: 30, col: N.AMBER, ph: .1 }, { a: 940, b: 1520, sp: 26, col: N.SEAL, ph: .5 },
    { a: 1960, b: 2500, sp: 36, col: '#5b7a8c', ph: .3 }, { a: 2950, b: 3320, sp: 24, col: '#87a074', ph: .7 },
  ];
  function person(x, y, dir, col, step, umbrella) {
    const lg = Math.sin(step) * 7;
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y - 20); ctx.lineTo(x + lg, y); ctx.moveTo(x, y - 20); ctx.lineTo(x - lg, y); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 34, 15, 0, 7); ctx.fillStyle = '#e9e1d3'; ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 34, 15, Math.PI * .15, Math.PI * .85); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = N.INK; ctx.beginPath(); ctx.arc(x + dir * 6, y - 38, 1.8, 0, 7); ctx.arc(x + dir * 11, y - 38, 1.8, 0, 7); ctx.fill();
    if (umbrella) { ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - dir * 4, y - 34); ctx.lineTo(x - dir * 4, y - 80); ctx.stroke(); ctx.beginPath(); ctx.arc(x - dir * 4, y - 80, 30, Math.PI, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); }
  }
  function walkers() {
    WALKERS.forEach((W) => {
      const L = W.b - W.a, dd = (st.t * W.sp + W.ph * 2 * L) % (2 * L), fwd = dd < L, x = fwd ? W.a + dd : W.b - (dd - L);
      person(x, GROUND + 26, fwd ? 1 : -1, W.col, st.t * W.sp * .25, st.hava === 'yagmur');
    });
  }
  const bikeAt = () => { const x = ((st.t * 95) % (WW + 800)) - 400; return { x, y: GROUND + 44 }; };
  function bike() {
    const { x, y } = bikeAt(), R = 21, rot = x / R;
    [x - 30, x + 30].forEach((wx, i) => {
      ctx.beginPath(); ctx.arc(wx, y - R, R, 0, 7); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.lineWidth = 1.4; ctx.strokeStyle = i === 0 && st.av.tekerlek ? N.DEEP : 'rgba(23,20,17,.7)';
      for (let k = 0; k < 8; k++) { const a = rot + k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(wx, y - R); ctx.lineTo(wx + Math.cos(a) * R, y - R + Math.sin(a) * R); ctx.stroke(); }
    });
    ctx.strokeStyle = N.SEAL; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x - 30, y - R); ctx.lineTo(x - 6, y - R - 26); ctx.lineTo(x + 20, y - R - 26); ctx.lineTo(x + 30, y - R); ctx.moveTo(x - 6, y - R - 26); ctx.lineTo(x, y - R); ctx.lineTo(x - 30, y - R); ctx.stroke();
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 20, y - R - 26); ctx.lineTo(x + 16, y - R - 40); ctx.lineTo(x + 26, y - R - 42); ctx.stroke();
    const pd = Math.sin(rot) * 8; ctx.beginPath(); ctx.moveTo(x - 6, y - R - 30); ctx.lineTo(x + pd, y - R + 2); ctx.stroke();
    person(x - 6, y - R - 28, 1, N.AMBER, 0, false);
  }
  function groundLayer() {
    layer(1); const P = PAL[st.hava];
    ctx.fillStyle = P.ground; ctx.fillRect(-200, GROUND, WW + 400, WH - GROUND + 10);
    ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-200, GROUND); ctx.lineTo(WW + 200, GROUND); ctx.stroke();
    ctx.strokeStyle = 'rgba(23,20,17,.18)'; ctx.lineWidth = 1.5;
    for (let r = 0; r < 4; r++) { const y = GROUND + 18 + r * 22; ctx.beginPath(); for (let x = -200 + (r % 2) * 22; x < WW + 200; x += 44) { ctx.moveTo(x, y); ctx.arc(x + 20, y, 20, Math.PI, 0); } ctx.stroke(); }
    if (st.hava === 'yagmur') for (let i = 0; i < 18; i++) { const k = ((st.t * .6 + i * .29) % 1), x = (i * 263) % WW, y = GROUND + 30 + (i * 37) % 100; ctx.beginPath(); ctx.ellipse(x, y, 4 + k * 26, 1 + k * 5, 0, 0, 7); ctx.strokeStyle = `rgba(255,255,255,${.7 * (1 - k)})`; ctx.lineWidth = 1.5; ctx.stroke(); }
    bunting({ x: 300, y: 395 }, { x: 588, y: 330 }, 40, 9);
    house(150, 150, 210, '#b8741a', { chimney: 105, box: true }); tree(370, .9);
    clockTower();
    house(840, 130, 170, '#c4432b', { rh: 80, awning: N.SEAL, sign: bakerySign }); house(1020, 150, 240, '#8a6a4a', { bay: true, chimney: 20 });
    tree(1220); fence();
    crossroad();
    house(1990, 140, 200, '#b8741a', { chimney: 96, shutters: '#87a074' }); hexSign(); house(2100, 120, 150, '#c4432b', { wall: '#efe2c8', box: true });
    laundry({ x: 2222, y: 470 }, { x: 2330, y: 432 });
    house(2330, 140, 190, '#8a6a4a', { shutters: '#5b7a8c' }); tree(2530, .95);
    fountain(); tree(3040, 1.05); house(3150, 160, 230, '#b8741a', { chimney: 30, box: true });
    [470, 1120, 1480, 2240, 2980].forEach(lamp);
    walkers(); pigeons(); bike();
  }
  function foreground() {
    layer(1.15);
    for (let i = 0; i < 46; i++) {
      const x = i * 90 + (i % 3) * 23 - 200, y = WH - 8, h = 22 + (i % 4) * 10, sw = Math.sin(st.t * 1.4 + i) * 3;
      ctx.strokeStyle = st.hava === 'aksam' ? '#3d4a3d' : '#5d7a4e'; ctx.lineWidth = 3;
      ctx.beginPath(); for (let k = -2; k <= 2; k++) { ctx.moveTo(x + k * 6, y); ctx.quadraticCurveTo(x + k * 8 + sw, y - h * .6, x + k * 11 + sw * 1.5, y - h + Math.abs(k) * 4); } ctx.stroke();
      if (i % 5 === 2 && st.hava !== 'aksam') { ctx.beginPath(); ctx.arc(x + 8 + sw * 1.5, y - h - 2, 5, 0, 7); ctx.fillStyle = i % 2 ? N.SEAL : N.AMBER; ctx.fill(); }
    }
    // kelebek
    if (st.hava === 'sabah') { layer(1); const bx = 1000 + Math.sin(st.t * .4) * 900, by = 520 + Math.sin(st.t * 1.7) * 40, w = Math.abs(Math.sin(st.t * 12)); ctx.fillStyle = N.AMBER; ctx.strokeStyle = N.INK; ctx.lineWidth = 1.5; [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.ellipse(bx + sd * 7 * w, by, 7 * w + 1, 9, 0, 0, 7); ctx.fill(); ctx.stroke(); }); }
  }
  /* Nokta ve konuşma balonu */
  function noktaDraw() {
    layer(1);
    const moving = Math.abs(nokta.tx - nokta.x) > 2, bob = moving ? Math.abs(Math.sin(st.t * 9)) * 16 : Math.abs(Math.sin(st.t * 2)) * 3;
    const h = 112, w = h * 280 / 347;
    ctx.beginPath(); ctx.ellipse(nokta.x, GROUND + 4, 30 - bob * .6, 6, 0, 0, 7); ctx.fillStyle = 'rgba(23,20,17,.15)'; ctx.fill();
    if (img.complete) { ctx.save(); if (moving && nokta.tx < nokta.x) { ctx.translate(nokta.x * 2, 0); ctx.scale(-1, 1); } ctx.drawImage(img, nokta.x - w / 2, GROUND - h + 6 - bob, w, h); ctx.restore(); }
    if (st.hava === 'yagmur') {
      const ux = nokta.x + 6, uy = GROUND - h - 10 - bob;
      ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(ux, uy + 64); ctx.stroke();
      ctx.beginPath(); ctx.arc(ux, uy, 56, Math.PI, 0); ctx.closePath(); ctx.fillStyle = N.SEAL; ctx.fill(); ctx.stroke();
    }
    if (bubble && st.t < bubble.until && !moving) {
      ctx.font = `400 21px ${N.BRUSH}`; const words = bubble.text.split(' '), lines = []; let ln = '';
      words.forEach((wd) => { const tst = ln ? ln + ' ' + wd : wd; if (ctx.measureText(tst).width > 210 && ln) { lines.push(ln); ln = wd; } else ln = tst; }); lines.push(ln);
      const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 26, bh = lines.length * 24 + 16, bx = nokta.x + 20, by = GROUND - h - 30 - bh;
      const a = Math.min(1, (bubble.until - st.t) * 2, (st.t - bubble.from) * 4); ctx.globalAlpha = a;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 12) : ctx.rect(bx, by, bw, bh); ctx.fillStyle = N.SHEET; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + 14, by + bh - 1); ctx.lineTo(bx + 4, by + bh + 16); ctx.lineTo(bx + 30, by + bh - 1); ctx.fillStyle = N.SHEET; ctx.fill(); ctx.beginPath(); ctx.moveTo(bx + 14, by + bh); ctx.lineTo(bx + 4, by + bh + 16); ctx.lineTo(bx + 30, by + bh); ctx.stroke();
      ctx.fillStyle = N.INK; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; lines.forEach((l, i) => ctx.fillText(l, bx + 13, by + 9 + i * 24)); ctx.globalAlpha = 1;
    }
  }
  let bubble = null;
  const speak = (text, sec = 4.5) => { bubble = { text, from: st.t, until: st.t + sec }; };
  function markers() {
    layer(1);
    STS.forEach((S, i) => {
      const y = i === 0 ? 150 : i === 1 ? 300 : 400, x = i === 0 ? 770 : i === 1 ? 1840 : S.x, b = Math.sin(st.t * 2.5 + i) * 6, done = stationDone(S), cur = i === st.cur;
      if (cur) { const ph = (st.t * .8) % 1; ctx.beginPath(); ctx.arc(x, y + b, 20 + ph * 22, 0, 7); ctx.strokeStyle = `rgba(232,163,61,${1 - ph})`; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x, y + b, 20, 0, 7); ctx.fillStyle = done ? N.AMBER : cur ? N.INK : N.SHEET; ctx.fill(); ctx.strokeStyle = N.INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = `400 24px ${N.BRUSH}`; ctx.fillStyle = cur && !done ? N.SHEET : N.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(done ? '✓' : String(i + 1), x, y + b + 1);
    });
    T.avlar.forEach((A) => {
      if (!st.av[A.id] || A.dyn) return;
      ctx.beginPath(); ctx.arc(A.x, A.y, A.r, 0, 7); ctx.strokeStyle = N.AMBER; ctx.lineWidth = 3; ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = `400 22px ${N.BRUSH}`; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,250,240,.95)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.strokeText(A.ad, A.x, A.y - A.r - 12); ctx.fillStyle = N.DEEP; ctx.fillText(A.ad, A.x, A.y - A.r - 12);
    });
  }
  function overlayFx() {
    const P = PAL[st.hava]; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (P.tint) { ctx.fillStyle = P.tint; ctx.fillRect(0, 0, innerWidth, innerHeight); }
    if (st.hava === 'aksam') {
      layer(1); ctx.globalCompositeOperation = 'lighter'; [470, 1120, 1480, 2240, 2980].forEach(lampGlow);
      for (let i = 0; i < 34; i++) { // ateş böcekleri
        const bx = [370, 1220, 2530, 3040, 2750][i % 5] + Math.sin(st.t * .5 + i * 1.7) * 90, by = GROUND - 70 + Math.cos(st.t * .7 + i * 1.3) * 60, a = .5 + .5 * Math.sin(st.t * 3 + i);
        const gl = ctx.createRadialGradient(bx, by, 0, bx, by, 9); gl.addColorStop(0, `rgba(255,230,120,${a})`); gl.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(bx, by, 9, 0, 7); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (st.hava === 'yagmur') {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.strokeStyle = 'rgba(60,70,85,.35)'; ctx.lineWidth = 1.4; ctx.beginPath();
      const n = Math.round(innerWidth / 9);
      for (let i = 0; i < n; i++) { const x = ((i * 97.3) % innerWidth) + ((st.t * 160) % 40), y = ((i * 53.7 + st.t * 700) % (innerHeight + 40)) - 40; ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 18); }
      ctx.stroke();
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; if (!N.reduced) st.t += dt; else st.t += dt * .25;
    const k = N.reduced ? 1 : 1 - Math.pow(.002, dt);
    if (!panning) cam.x += (cam.tx - cam.x) * k;
    const sp = 260 * dt, wasMoving = Math.abs(nokta.tx - nokta.x) > 2; nokta.x += Math.max(-sp, Math.min(sp, nokta.tx - nokta.x));
    if (wasMoving && Math.abs(nokta.tx - nokta.x) <= 2 && pendingSay) { speak(pendingSay); pendingSay = null; }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    sky(); balloon(); birds(); farLayer(); midLayer(); groundLayer(); noktaDraw(); overlayFx(); markers(); foreground();
    if (zoomOpen) Z.render();
    requestAnimationFrame(frame);
  }
  let pendingSay = null;

  /* ══════════ dünyada gezinme ══════════ */
  let panning = false, pdown = null;
  cv.addEventListener('pointerdown', (e) => { pdown = { x: e.clientX, y: e.clientY, cam: cam.x, moved: false }; try { cv.setPointerCapture(e.pointerId); } catch (_) {} });
  cv.addEventListener('pointermove', (e) => {
    if (!pdown) { cv.style.cursor = hitWorld(e.clientX, e.clientY) ? 'pointer' : 'grab'; return; }
    const dx = e.clientX - pdown.x; if (Math.abs(dx) > 6) pdown.moved = true;
    if (pdown.moved) { panning = true; cv.classList.add('grabbing'); cam.x = cam.tx = clampCam(pdown.cam - dx / s); }
  });
  const pup = (e) => {
    if (!pdown) return; const p = pdown; pdown = null; panning = false; cv.classList.remove('grabbing');
    if (!p.moved) { const h = hitWorld(e.clientX, e.clientY); if (h) onHit(h); }
  };
  cv.addEventListener('pointerup', pup); cv.addEventListener('pointercancel', () => { pdown = null; panning = false; });
  cv.addEventListener('wheel', (e) => { e.preventDefault(); cam.tx = clampCam(cam.tx + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / s); }, { passive: false });

  function hitWorld(cx, cy) {
    const w = toWorld(cx, cy);
    const av = (id) => T.avlar.find((A) => A.id === id);
    if (st.hava !== 'yagmur') { const b = birdsAt(), q = toLayer(cx, cy, .2); if (g.dist(q, { x: b.x - 45, y: b.y }) < 75) return { av: av('kuslar') }; }
    const bk = bikeAt(); if (g.dist(w, { x: bk.x - 30, y: bk.y - 21 }) < 30 || g.dist(w, { x: bk.x + 30, y: bk.y - 21 }) < 30) return { av: av('tekerlek') };
    for (const A of T.avlar) if (!A.dyn && g.dist(w, A) < A.r) return { av: A };
    if (g.dist(w, { x: 650, y: 140 }) < 36) return { bell: true };
    if (w.x > 580 && w.x < 720 && w.y > 60 && w.y < GROUND) return { st: 0 };
    if (w.x > 1540 && w.x < 1930 && w.y > 360 && w.y < GROUND + 30) return { st: 1 };
    if (w.x > 2550 && w.x < 2950 && w.y > 440 && w.y < GROUND + 50) return { st: 2 };
    if (Math.abs(w.x - nokta.x) < 50 && w.y > GROUND - 120 && w.y < GROUND) return { nokta: true };
    return null;
  }
  const NOKTA_SOZ = ['Kasabada 8 şekil sakladım. Bazıları hareket ediyor!', 'Sence bir doğru hiç biter mi?', 'Bir noktadan sonsuz doğru geçer. Ben de bir noktayım!', 'Kuşlar V biçiminde uçuyor. O V bir açı!', 'Bisikletin tekerleğine bak: teller birer yarıçap.', 'Güvercinleri ürkütmeden yürümek zor!'];
  let soz = 0;
  function ring() { bellAmp = 1; [523, 392, 523, 392].forEach((f, i) => setTimeout(() => N.sfx.tick && toneBell(f), i * 380)); }
  function toneBell(f) { try { const ac = toneBell.ac || (toneBell.ac = new (window.AudioContext || window.webkitAudioContext)()); if (localStorage.getItem('nokta-ses') === 'kapali') return; const o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(.0001, ac.currentTime); gn.gain.exponentialRampToValueAtTime(.12, ac.currentTime + .01); gn.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + 1.2); o.connect(gn).connect(ac.destination); o.start(); o.stop(ac.currentTime + 1.3); } catch (_) {} }
  function onHit(h) {
    if (h.av) {
      if (!st.av[h.av.id]) { st.av[h.av.id] = true; persist(); N.sfx.good(); addLog('av', `${h.av.ad}: ${h.av.metin.replace(/<[^>]+>/g, '')}`); }
      toast(h.av.metin); renderAv(); return;
    }
    if (h.bell) { ring(); speak('Dan, dan! Saat kaç acaba? Kolların arasındaki açıya bak.'); return; }
    if (h.nokta) { speak(NOKTA_SOZ[soz++ % NOKTA_SOZ.length]); N.sfx.tick(); return; }
    if (h.st != null) { if (h.st === st.cur) openZoom(); else go(h.st); }
  }

  /* ══════════ arayüz ══════════ */
  function renderStations() {
    $('#stations').innerHTML = STS.map((S, i) => `<button class="st-btn ${stationDone(S) ? 'done' : ''}" type="button" data-i="${i}" aria-current="${i === st.cur}"><b>${stationDone(S) ? '✓' : i + 1}</b><span>${S.ad}</span></button>`).join('');
    $('#stations').querySelectorAll('button').forEach((b) => (b.onclick = () => go(+b.dataset.i)));
  }
  function renderAv() { const n = T.avlar.filter((A) => st.av[A.id]).length; $('#avBtn').textContent = `şekil avı ${n}/${T.avlar.length}`; }
  function renderCard() {
    const S = STS[st.cur], el = $('#scard'), picked = st.sence[S.id];
    const allDone = stationDone(S);
    el.className = 'ui scard' + (st.cardMin ? ' min' : '');
    el.innerHTML = `<div class="head"><img src="../img/nokta.png" alt="" id="cardImg"><div><span class="code">${st.cur + 1} · ${S.kod}</span><h2>${S.ad}</h2></div>
      <button class="chip-btn fold" id="fold" type="button" aria-expanded="${!st.cardMin}">${st.cardMin ? 'aç' : 'küçült'}</button></div>
      <div class="body">
        <p>${S.gozlem}</p>
        <span class="lbl">Sence?</span><div class="q">${S.soru}</div>
        ${picked == null ? '<div id="senceBox"></div>' : `<p class="picked">Tahminin: <b>${S.secenekler[picked]}</b>. ${allDone ? (picked === S.dogru ? 'Gözlemin tahminini doğruladı!' : 'Gözlemin farklı bir şey gösterdi; açıklamaya bak.') : 'Şimdi yakından inceleyip dene.'}</p>`}
        <div class="row2"><button class="btn primary big" id="zoomBtn" type="button">🔍 Yakından incele</button></div>
        <span class="lbl">Görevler</span>
        <ul class="tasks">${S.gorevler.map((t) => `<li class="${isDone(S.id, t.id) ? 'ok' : ''}"><i></i><span>${t.metin}</span></li>`).join('')}</ul>
        <span class="lbl">Açıklama</span>
        ${allDone || st.showExp === S.id ? `<div class="explain">${S.aciklama}</div>` : '<button class="btn" id="expBtn" type="button">Açıklamayı göster</button> <span class="small">Önce görevleri denemeni öneririm.</span>'}
        <div class="row2"><a class="btn" href="${S.oyun.url}">Pekiştir: ${S.oyun.ad} ↗</a>${st.cur < STS.length - 1 ? `<button class="btn" id="nextSt" type="button">Sonraki nokta →</button>` : ''}</div>
      </div>`;
    if (picked == null) N.choices(el.querySelector('#senceBox'), S.secenekler.map((t, i) => ({ t, i, ok: true })), (o) => { st.sence[S.id] = o.i; persist(); addLog(S.id, `Tahminim: ${o.t}`); N.sfx.tick(); setTimeout(renderCard, 350); }, 'one');
    $('#fold').onclick = () => { st.cardMin = !st.cardMin; renderCard(); };
    $('#zoomBtn').onclick = openZoom;
    const eb = $('#expBtn'); if (eb) eb.onclick = () => { st.showExp = S.id; renderCard(); };
    const nb = $('#nextSt'); if (nb) nb.onclick = () => go(st.cur + 1);
    $('#presentKod').textContent = `${st.cur + 1} · ${S.ad} · ${S.kod}`; $('#presentSoru').textContent = S.sunum;
  }
  function go(i) {
    if (i < 0 || i >= STS.length) return;
    st.cur = i; st.showExp = null; cam.tx = focusX(i); nokta.tx = STS[i].x + [-150, 195, -265][i];
    if (Math.abs(nokta.tx - nokta.x) <= 2) speak(STS[i].varis); else { pendingSay = STS[i].varis; bubble = null; }
    renderStations(); renderCard(); N.sfx.tick();
    const im = $('#cardImg'); if (im) { im.classList.remove('hop'); void im.offsetWidth; im.classList.add('hop'); }
  }

  /* ══════════ yakından bak ══════════ */
  const ZW = 900, ZH = 600;
  const Z = (N.stage = new N.Stage($('#zcv'), ZW, ZH));
  let zoomOpen = false;
  const clock = { h: 60, m: 0, prot: false, rot: 0, run: null };
  const hourTxt = () => { const a = Math.floor(clock.h / 30) || 12, b = a % 12 + 1; return clock.h % 30 ? `${a} ile ${b} arası` : String(a); };
  const map = { gul: 75, lale: 145, measures: false, rows: [], laleOn: false };
  const pool = { A: null, B: null, t: 0, delay: false, play: null };

  function openZoom() {
    zoomOpen = true; $('#zoom').classList.add('open'); const S = STS[st.cur];
    Z.onDown = Z.onMove = Z.onUp = null;
    ({ saat: setupClock, kavsak: setupMap, cesme: setupPool })[S.id]();
    renderZSide(); setTimeout(() => { Z.resize(); }, 30);
    addEventListener('keydown', zoomEsc);
  }
  function closeZoom() { stopClock(); zoomOpen = false; $('#zoom').classList.remove('open'); if (pool.play) { clearInterval(pool.play); pool.play = null; } removeEventListener('keydown', zoomEsc); renderCard(); }
  const zoomEsc = (e) => { if (e.key === 'Escape') closeZoom(); };
  $('#zoom').addEventListener('click', (e) => { if (e.target.id === 'zoom') closeZoom(); });
  function hint(html) { const h = $('#zhint'); if (!h) return; h.innerHTML = html; h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop'); }
  function renderZSide() {
    if (!zoomOpen) return;
    const S = STS[st.cur], el = $('#zside');
    el.innerHTML = `<div class="row" style="justify-content:space-between"><h3 id="zTitle">${S.ad}</h3><button class="chip-btn" id="zClose" type="button">kapat ✕</button></div>
      <div class="hint" id="zhint">${zhint || S.gozlem}</div><div id="zctl"></div>
      <span class="label" style="margin-top:4px">Görevler</span>
      <ul class="tasks">${S.gorevler.map((t) => `<li class="${isDone(S.id, t.id) ? 'ok' : ''}"><i></i><span>${t.metin}</span></li>`).join('')}</ul>`;
    $('#zClose').onclick = closeZoom;
    ({ saat: ctlClock, kavsak: ctlMap, cesme: ctlPool })[S.id]($('#zctl'));
  }
  let zhint = '';
  const say = (html) => { zhint = html; hint(html); };

  /* ── 1. Saat ── */
  const CC = { x: 450, y: 300 }, CR = 240;
  const cw2math = (deg) => g.rad(90 - deg);
  const between = () => { let df = Math.abs(clock.h - clock.m) % 360; return df > 180 ? 360 - df : df; };
  function setupClock() {
    zhint = 'Kolların ucundaki halkaları sürükle. Akrep bir rakamdan öbürüne, yelkovan dakika çizgilerine atlar.';
    Z.draw = (c) => {
      d.grid(c, ZW, ZH, 40);
      c.beginPath(); c.arc(CC.x, CC.y, CR + 18, 0, 7); c.fillStyle = '#efe0c2'; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 4; c.stroke();
      c.beginPath(); c.arc(CC.x, CC.y, CR, 0, 7); c.fillStyle = N.SHEET; c.fill(); c.lineWidth = 3; c.stroke();
      for (let i = 0; i < 60; i++) { const a = cw2math(i * 6), L = i % 5 ? 10 : 22; d.seg(c, g.polar(CC, CR - 4, a), g.polar(CC, CR - 4 - L, a), { w: i % 5 ? 1.6 : 4 }); }
      for (let i = 1; i <= 12; i++) { const p = g.polar(CC, CR - 50, cw2math(i * 30)); d.text(c, String(i), p.x, p.y + 2, { size: 38, halo: false }); }
      // aradaki açı
      const ah = cw2math(clock.h), am = cw2math(clock.m), b = between();
      let a1 = ah, a2 = am; if (g.nd(g.deg(a2 - a1)) > 180) [a1, a2] = [a2, a1];
      if (b > 0 && b < 180) d.arc(c, CC, a1, a2, 70, { fill: 'rgba(232,163,61,.28)', w: 3 });
      if (b === 90) d.right(c, CC, g.dir(ah), g.dir(am), 34, { w: 3 });
      if (clock.prot) drawProt(c);
      // kollar
      const ph = g.polar(CC, 140, ah), pm = g.polar(CC, 205, am);
      d.seg(c, CC, ph, { w: 13 }); d.seg(c, CC, pm, { w: 7 });
      [[ph, 'akrep'], [pm, 'yelkovan']].forEach(([p, k]) => { c.beginPath(); c.arc(p.x, p.y, 15, 0, 7); c.fillStyle = Z.dragK === k ? N.AMBER : N.SHEET; c.fill(); c.lineWidth = 3; c.strokeStyle = N.DEEP; c.stroke(); });
      d.dot(c, CC, { r: 9 });
      d.text(c, `akrep: ${hourTxt()} · yelkovan: ${clock.m === 0 ? '12' : `${clock.m / 6}. dakika`}`, 450, 585, { size: 24, color: N.SOFT, font: N.SERIF });
    };
    Z.onDown = (p) => {
      if (clock.prot) { const kn = g.polar(CC, 235, clock.rot + Math.PI / 2); if (g.dist(p, kn) < Z.hit(26)) { Z.dragK = 'prot'; return; } }
      const ph = g.polar(CC, 140, cw2math(clock.h)), pm = g.polar(CC, 205, cw2math(clock.m));
      const dh = Math.min(g.dist(p, ph), g.distSeg(p, CC, ph) + 6), dm = Math.min(g.dist(p, pm), g.distSeg(p, CC, pm) + 6);
      if (Math.min(dh, dm) < Z.hit(30)) { Z.dragK = dm <= dh ? 'yelkovan' : 'akrep'; stopClock(); }
    };
    Z.onMove = (p) => {
      if (!p || !Z.dragK || !Z.down) return;
      if (Z.dragK === 'prot') { clock.rot = g.ang(CC, p) - Math.PI / 2; snapProt(); Z.ask(); return; }
      let cw = g.nd(90 - g.deg(g.ang(CC, p)));
      if (Z.dragK === 'akrep') cw = (Math.round(cw / 30) * 30) % 360; else cw = (Math.round(cw / 6) * 6) % 360;
      const k = Z.dragK === 'akrep' ? 'h' : 'm'; if (clock[k] !== cw) { clock[k] = cw; N.sfx.tick(); snapProt(); } Z.ask();
    };
    Z.onUp = () => { Z.dragK = null; Z.ask(); checkClock(); };
    Z.ask();
  }
  function drawProt(c) {
    const R = 200; c.save(); c.translate(CC.x, CC.y); c.rotate(-clock.rot);
    c.beginPath(); c.moveTo(R + 10, 0); c.arc(0, 0, R, 0, -Math.PI, true); c.lineTo(-R - 10, 0); c.lineTo(-R - 10, 18); c.lineTo(R + 10, 18); c.closePath();
    c.fillStyle = 'rgba(255,248,230,.6)'; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
    for (let i = 0; i <= 180; i++) { const t = g.rad(i), L = i % 10 === 0 ? 16 : i % 5 === 0 ? 10 : 5; c.beginPath(); c.moveTo(Math.cos(t) * R, -Math.sin(t) * R); c.lineTo(Math.cos(t) * (R - L), -Math.sin(t) * (R - L)); c.strokeStyle = N.DEEP; c.lineWidth = i % 10 ? 1 : 1.8; c.stroke(); }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 0; i <= 180; i += 10) { const t = g.rad(i); c.save(); c.translate(Math.cos(t) * (R - 28), -Math.sin(t) * (R - 28)); c.rotate(Math.PI / 2 - t); c.font = `600 13px ${N.MONO}`; c.fillStyle = N.DEEP; c.fillText(String(i), 0, 0); c.restore();
      c.save(); c.translate(Math.cos(t) * (R - 45), -Math.sin(t) * (R - 45)); c.rotate(Math.PI / 2 - t); c.font = `500 11px ${N.MONO}`; c.fillStyle = 'rgba(23,20,17,.6)'; c.fillText(String(180 - i), 0, 0); c.restore(); }
    c.beginPath(); c.moveTo(-R, 0); c.lineTo(R, 0); c.strokeStyle = N.INK; c.lineWidth = 1.2; c.stroke();
    c.beginPath(); c.arc(0, -235, 15, 0, 7); c.fillStyle = Z.dragK === 'prot' ? N.AMBER : N.INK; c.fill();
    c.beginPath(); c.moveTo(0, -R); c.lineTo(0, -221); c.strokeStyle = N.INK; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.arc(0, -235, 7, -2.6, .9); c.strokeStyle = N.SHEET; c.lineWidth = 2; c.stroke();
    c.restore();
  }
  function snapProt() {
    if (!clock.prot) return;
    for (const a of [cw2math(clock.h), cw2math(clock.m)]) for (const k of [0, Math.PI]) { let df = g.nd(g.deg(clock.rot - a - k)); if (df > 180) df -= 360; if (Math.abs(df) < 3) { if (clock.rot !== a + k) N.sfx.snap(); clock.rot = a + k; } }
  }
  function stopClock() { if (clock.run) { clearInterval(clock.run); clock.run = null; const b = $('#runBtn'); if (b) b.textContent = '▶ Zamanı akıt'; } }
  function checkClock() {
    if (clock.h === 90 && clock.m === 0 && !isDone('saat', 'uc')) { say('Saat 3:00! Kollar arasında <b>3 rakam aralığı</b> var. Sence kaç derece? Açıölçerle ölç.'); markDone('saat', 'uc'); }
    if (between() === 180 && !isDone('saat', 'dogru')) { say('Kollar bir doğru oluşturdu: <b>doğru açı</b>, 180°. Saat 6:00 gibi!'); addLog('saat', `Akrep ${hourTxt()}, yelkovan ${clock.m / 6 || 60}. dk: 180° (doğru açı)`); markDone('saat', 'dogru'); }
  }
  function ctlClock(host) {
    host.innerHTML = `<div class="row"><button class="btn" id="runBtn" type="button">${clock.run ? '❚❚ Zamanı durdur' : '▶ Zamanı akıt'}</button></div>
      <div class="row"><button class="btn ${clock.prot ? 'primary' : ''}" id="protBtn" type="button">${clock.prot ? 'Açıölçeri kaldır' : 'Açıölçeri koy'}</button>
      ${clock.prot ? '<button class="btn" data-r="1" type="button">↺ 1°</button><button class="btn" data-r="-1" type="button">↻ 1°</button>' : ''}</div>
      <div class="row" style="margin-top:6px"><span>Ölçtüğüm açı:</span><input class="num-in" id="aci" inputmode="numeric" style="width:90px;font-size:26px"><span class="big-read" style="font-size:26px">°</span></div>
      <button class="btn primary" id="yaz" type="button" style="margin-top:6px">Deftere yaz</button>`;
    $('#runBtn').onclick = () => {
      if (clock.run) { stopClock(); return; }
      say('Zaman akıyor: yelkovan bir tur dönerken akrep bir rakam ilerliyor. Kollar arasındaki açının nasıl değiştiğini izle; <b>dik</b> ve <b>doğru açıları</b> yakala!');
      let lastB = between();
      clock.run = setInterval(() => {
        clock.m = (clock.m + 6) % 360; clock.h = (clock.h + .5) % 360; const b = between();
        if (b === 90 && lastB !== 90) { N.sfx.snap(); say(`Şimdi <b>dik açı</b>! akrep: ${hourTxt()}, yelkovan: ${clock.m / 6 || 60}. dakika.`); }
        if (b === 180 && lastB !== 180) { N.sfx.snap(); say('Şimdi <b>doğru açı</b>: kollar bir doğru oluşturdu!'); }
        if (b === 0 && lastB !== 0) say('Kollar üst üste: aralarında açı yok (0°).');
        lastB = b; snapProt(); checkClock();
      }, 90);
      renderZSide();
    };
    $('#protBtn').onclick = () => { clock.prot = !clock.prot; if (clock.prot) { clock.rot = cw2math(clock.m) - .3; say('Açıölçerin merkezi saatin merkezinde. Siyah tutamaktan çevirip <b>sıfır çizgisini</b> bir kolun üstüne getir.'); } renderZSide(); Z.ask(); };
    host.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => { clock.rot += g.rad(+b.dataset.r); snapProt(); Z.ask(); }));
    const inp = $('#aci');
    const run = () => {
      const v = N.num(inp.value), b = between(); if (v == null) return;
      inp.classList.remove('ok', 'no'); void inp.offsetWidth;
      if (Math.abs(v - b) <= 1) {
        inp.classList.add('ok'); const tur = b < 90 ? 'dar açı' : b === 90 ? 'dik açı' : b < 180 ? 'geniş açı' : 'doğru açı';
        addLog('saat', `Akrep ${hourTxt()}, yelkovan ${clock.m / 6 || 60}. dk: ${b}° (${tur})`);
        say(`Doğru ölçtün: <b>${b}°</b>, ${tur}. Deftere yazdım.`);
        if (!clock.prot) say(`<b>${b}°</b> doğru! Ama bu görev için açıölçeri kullanmayı dene.`); else markDone('saat', 'olc');
        if (b > 90 && b < 180 && clock.prot) markDone('saat', 'genis');
      } else { inp.classList.add('no'); N.sfx.bad(); say(Math.abs(v - (180 - b)) <= 1 ? 'Öbür ölçeği okudun! Kolun üstündeki <b>0</b>’dan başlayan ölçeği takip et.' : clock.prot ? 'Sıfır çizgisi bir kolun üstünde mi? Öbür kolun kestiği yeri, sıfırdan başlayan ölçekte oku.' : 'Önce <b>açıölçeri koy</b> ve sıfır çizgisini bir kola hizala.'); }
    };
    $('#yaz').onclick = run; inp.onkeydown = (e) => { if (e.key === 'Enter') run(); };
  }

  /* ── 2. Kavşak ── */
  const MO = { x: 450, y: 310 }, CINAR = 20, LQ = { x: 450, y: 110 };
  const secs = () => { const a = Math.round(map.gul - CINAR); return { a, b: 180 - a, c: a, d: 180 - a }; };
  function setupMap() {
    zhint = 'Gül Sokağı’nın ucundaki halkayı sürükleyerek sokağı döndür. <b>Ölçümleri göster</b>’e basarsan köşelerdeki açılar görünür.';
    Z.draw = (c) => {
      c.fillStyle = '#e4e8d4'; c.fillRect(0, 0, ZW, ZH);
      for (let i = 0; i < 40; i++) { const x = (i * 211) % ZW, y = (i * 137) % ZH; c.beginPath(); c.arc(x, y, 9 + (i % 3) * 3, 0, 7); c.fillStyle = 'rgba(110,140,90,.35)'; c.fill(); }
      const sc = secs();
      street(c, MO, CINAR, 'Çınar Sokağı');
      street(c, MO, map.gul, 'Gül Sokağı', true);
      if (map.laleOn) street(c, LQ, map.lale, 'Lale Sokağı', true, true);
      [[MO, CINAR, 0, '#c4432b'], [MO, map.gul, .37, '#5b7a8c'], [MO, CINAR, .62, '#e8a33d'], [MO, map.gul, .85, '#87a074']].concat(map.laleOn ? [[LQ, map.lale, .2, '#9b7653']] : []).forEach(([o, deg, off, col], i) => {
        const dir = i % 2 ? 1 : -1, sPos = (((st.t * .06 + off) % 1) * 1300 - 650) * dir, u = g.dir(g.rad(deg)), n = { x: -u.y, y: u.x };
        const p = g.add(g.add(o, g.mul(u, sPos)), g.mul(n, 13 * dir));
        c.save(); c.translate(p.x, p.y); c.rotate(-g.rad(deg) + (dir < 0 ? Math.PI : 0));
        c.fillStyle = col; c.strokeStyle = N.INK; c.lineWidth = 2; c.beginPath(); c.roundRect ? c.roundRect(-17, -9, 34, 18, 5) : c.rect(-17, -9, 34, 18); c.fill(); c.stroke();
        c.fillStyle = 'rgba(215,225,228,.95)'; c.fillRect(4, -6, 7, 12); c.fillRect(-12, -6, 5, 12); c.restore();
      });
      // açılar
      if (map.measures) {
        const lab = [['a', CINAR, map.gul], ['b', map.gul, CINAR + 180], ['c', CINAR + 180, map.gul + 180], ['d', map.gul + 180, CINAR + 360]];
        const pairCol = isDone('kavsak', 'tablo');
        lab.forEach(([n, f, t], i) => {
          let from = g.nd(f), to = g.nd(t); let sw = g.nd(to - from); if (sw === 0) sw = 360;
          const v = i % 2 ? sc.b : sc.a, col = pairCol ? (i % 2 ? 'rgba(196,67,43,.22)' : 'rgba(232,163,61,.35)') : 'rgba(23,20,17,.08)';
          if (v === 90) d.right(c, MO, g.dir(g.rad(from)), g.dir(g.rad(from + 90)), 30, { w: 3, color: N.DEEP });
          else d.arc(c, MO, g.rad(from), g.rad(from + sw), 52, { fill: col, color: pairCol ? (i % 2 ? N.SEAL : N.AMBER) : N.SOFT, w: 2.5 });
          const m = g.polar(MO, 96, g.rad(from + sw / 2)); d.text(c, `${n} = ${v}°`, m.x, m.y, { size: 28, color: N.INK });
        });
      } else ['a', 'b', 'c', 'd'].forEach((n, i) => { const f = [CINAR, map.gul, CINAR + 180, map.gul + 180][i]; let sw = g.nd([map.gul, CINAR + 180, map.gul + 180, CINAR][i] - f); const m = g.polar(MO, 90, g.rad(f + sw / 2)); d.text(c, n, m.x, m.y, { size: 34 }); });
      d.dot(c, MO, { r: 7 });
      // tutamaçlar
      handles().forEach((h) => { c.beginPath(); c.arc(h.p.x, h.p.y, 15, 0, 7); c.fillStyle = Z.dragK === h.k ? N.AMBER : N.SHEET; c.fill(); c.lineWidth = 3; c.strokeStyle = N.DEEP; c.stroke(); });
      if (map.laleOn) {
        const X = g.meet(MO, g.polar(MO, 10, g.rad(CINAR)), LQ, g.polar(LQ, 10, g.rad(map.lale)));
        if (!X || Math.abs(g.nd(map.lale - CINAR) % 180) < .5) { d.text(c, 'Lale ve Çınar paralel: hiç kesişmiyor', 450, 40, { size: 30, color: N.DEEP }); for (const t of [-220, 0, 220]) { const a = g.polar(MO, t, g.rad(CINAR)), q = g.meet(a, g.add(a, g.dir(g.rad(CINAR + 90))), LQ, g.polar(LQ, 10, g.rad(map.lale))); if (q) d.seg(c, a, q, { color: N.DEEP, w: 2, dash: [6, 6] }); } }
        else if (X.x > 0 && X.x < ZW && X.y > 0 && X.y < ZH) d.dot(c, X, { r: 7, color: N.SEAL });
      }
    };
    Z.onDown = (p) => { const h = handles().find((x) => g.dist(p, x.p) < Z.hit(28)); if (h) Z.dragK = h.k; };
    Z.onMove = (p) => {
      if (!p || !Z.dragK || !Z.down) return;
      if (Z.dragK.startsWith('gul')) { let rel = Math.round(g.nd(g.deg(g.ang(MO, p)) - CINAR)) % 180; if (Math.abs(rel - 90) <= 2) rel = 90; if (rel < 8 || rel > 172) return; if (CINAR + rel !== map.gul) { map.gul = CINAR + rel; N.sfx.tick(); } }
      else { let a = Math.round(g.nd(g.deg(g.ang(LQ, p)))) % 180; if (Math.abs(((g.nd(a - CINAR) + 90) % 180) - 90) <= 2) a = CINAR; if (a !== map.lale % 180) { map.lale = a; N.sfx.tick(); } }
      Z.ask();
    };
    Z.onUp = () => { if (!Z.dragK) return; Z.dragK = null; Z.ask(); checkMap(); };
    Z.ask();
  }
  function handles() {
    const H = [{ k: 'gul1', p: g.polar(MO, 230, g.rad(map.gul)) }, { k: 'gul2', p: g.polar(MO, -230, g.rad(map.gul)) }];
    if (map.laleOn) H.push({ k: 'lale1', p: g.polar(LQ, 250, g.rad(map.lale)) }, { k: 'lale2', p: g.polar(LQ, -250, g.rad(map.lale)) });
    return H;
  }
  function street(c, o, deg, name, movable, flat) {
    const u = g.dir(g.rad(deg)), a = g.sub(o, g.mul(u, 1200)), b = g.add(o, g.mul(u, 1200));
    c.lineCap = 'butt';
    c.strokeStyle = N.INK; c.lineWidth = 58; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
    c.strokeStyle = movable ? '#ddd3bf' : '#d4c9b2'; c.lineWidth = 52; c.stroke();
    c.setLineDash([16, 14]); c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 3; c.stroke(); c.setLineDash([]); c.lineCap = 'round';
    const t = g.polar(o, flat ? -120 : 245, g.rad(deg)); c.save(); c.translate(t.x, t.y); let r = -g.rad(deg); if (Math.cos(r) < 0) r += Math.PI; c.rotate(r);
    c.font = `400 22px ${N.BRUSH}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = N.INK; c.fillText(name, 0, -40); c.restore();
  }
  function checkMap() {
    const sc = secs();
    if (map.measures && Math.abs(map.gul - 75) >= 15) { if (!isDone('kavsak', 'dondur')) { say(`Döndürdün: şimdi a = ${sc.a}°, c = ${sc.c}°. Bir daha döndür ve a ile c’ye bak.`); markDone('kavsak', 'dondur'); } }
    if (sc.a === 90 && !isDone('kavsak', 'dik')) { say('Dört köşe de <b>90°</b>! Çınar ve Gül Sokağı artık <b>dik</b> kesişiyor. Şimdi Lale Sokağı’nı aç.'); addLog('kavsak', 'Sokaklar dik: a = b = c = d = 90°'); markDone('kavsak', 'dik'); map.laleOn = true; renderZSide(); }
    if (map.laleOn && Math.abs(((g.nd(map.lale - CINAR) + 90) % 180) - 90) < .5 && !isDone('kavsak', 'paralel')) { say('Lale ile Çınar <b>paralel</b>: hiç kesişmiyorlar, açı da oluşmuyor. Aralarındaki uzaklık her yerde aynı.'); addLog('kavsak', 'Lale Sokağı ∥ Çınar Sokağı: kesişme yok, açı yok'); markDone('kavsak', 'paralel'); }
  }
  function ctlMap(host) {
    const sc = secs();
    host.innerHTML = `<div class="row"><button class="btn ${map.measures ? 'primary' : ''}" id="msr" type="button">${map.measures ? 'Ölçümleri gizle' : 'Ölçümleri göster'}</button>
      ${map.laleOn ? '' : '<button class="btn" id="lale" type="button">Lale Sokağı’nı aç</button>'}</div>
      <button class="btn primary" id="row" type="button" style="margin-top:6px">Bu durumu deftere yaz</button>
      <table class="mini-table" style="margin-top:6px"><tr><th>#</th><th>a</th><th>b</th><th>c</th><th>d</th></tr>${map.rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r.a}°</td><td>${r.b}°</td><td>${r.c}°</td><td>${r.d}°</td></tr>`).join('') || '<tr><td colspan="5">henüz kayıt yok</td></tr>'}</table>`;
    $('#msr').onclick = () => { map.measures = !map.measures; renderZSide(); Z.ask(); checkMap(); };
    const lb = $('#lale'); if (lb) lb.onclick = () => { map.laleOn = true; say('Lale Sokağı açıldı. Uçlarındaki halkalarla çevir: Çınar Sokağı’nı hiç kesmesin.'); renderZSide(); Z.ask(); };
    $('#row').onclick = () => {
      if (!map.measures) { say('Önce <b>ölçümleri göster</b>; sonra değerleri deftere yazalım.'); return; }
      if (map.rows.some((r) => r.a === sc.a)) { say('Bu durumu zaten yazdın. Gül Sokağı’nı <b>başka bir yöne</b> çevir.'); return; }
      map.rows.push(sc); addLog('kavsak', `a = ${sc.a}°, b = ${sc.b}°, c = ${sc.c}°, d = ${sc.d}°`); N.sfx.tick();
      if (map.rows.length >= 3) { say('Tabloya bak: her satırda <b>a = c</b> ve <b>b = d</b>. Ayrıca <b>a + b = 180°</b>. Karşılıklı köşeler eş!'); markDone('kavsak', 'tablo'); Z.ask(); }
      else say(`${map.rows.length}. durum yazıldı. Sokağı çevirip bir tane daha yaz.`);
      renderZSide();
    };
  }

  /* ── 3. Çeşme ── */
  const PC = { x: 450, y: 300 }, PR = 272, UNIT = 22;
  const r1 = () => pool.t / 10, r2 = () => (pool.delay ? Math.max(0, pool.t / 10 - 2) : pool.t / 10);
  const ab = () => (pool.A && pool.B ? Math.round(g.dist(pool.A, pool.B) / UNIT * 10) / 10 : 0);
  function triInfo() {
    if (!pool.A || !pool.B) return null;
    const R1 = r1() * UNIT, R2 = r2() * UNIT, pts = g.circles(pool.A, R1, pool.B, R2);
    if (!pts.length || g.dist(pts[0], pts[1]) < 2) return null;
    const s = [Math.round(ab() * 10), Math.round(r1() * 10), Math.round(r2() * 10)];
    const e = (s[0] === s[1]) + (s[1] === s[2]) + (s[0] === s[2]);
    return { C: pts[0], C2: pts[1], kind: e >= 2 ? 'eşkenar' : e === 1 ? 'ikizkenar' : 'çeşitkenar' };
  }
  function setupPool() {
    zhint = 'Havuza dokunarak iki taş at: önce <b>A</b>, sonra <b>B</b>. Sonra zamanı ilerlet ve halkaları izle.';
    Z.draw = (c) => {
      c.fillStyle = '#e8dcc2'; c.fillRect(0, 0, ZW, ZH);
      for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; c.save(); c.translate(PC.x + Math.cos(a) * (PR + 16), PC.y + Math.sin(a) * (PR + 16)); c.rotate(a); c.fillStyle = '#d6c6a6'; c.fillRect(-14, -12, 28, 24); c.strokeStyle = 'rgba(23,20,17,.45)'; c.lineWidth = 1.5; c.strokeRect(-14, -12, 28, 24); c.restore(); }
      const gr = c.createRadialGradient(PC.x, PC.y, 20, PC.x, PC.y, PR); gr.addColorStop(0, '#a9c6cf'); gr.addColorStop(1, '#7ea3b0');
      c.beginPath(); c.arc(PC.x, PC.y, PR, 0, 7); c.fillStyle = gr; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 3.5; c.stroke();
      c.save(); c.beginPath(); c.arc(PC.x, PC.y, PR - 2, 0, 7); c.clip();
      if (st.hava === 'yagmur') for (let i = 0; i < 10; i++) { const k = ((st.t * .5 + i * .31) % 1), x = PC.x - 230 + (i * 151) % 460, y = PC.y - 200 + (i * 97) % 400; c.beginPath(); c.arc(x, y, 3 + k * 26, 0, 7); c.strokeStyle = `rgba(255,255,255,${.55 * (1 - k)})`; c.lineWidth = 1.5; c.stroke(); }
      for (let k = 0; k < 4; k++) { // balıklar
        const sg = k % 2 ? 1 : -1, a = st.t * .35 * sg + k * 1.7, rr = 150 + Math.sin(st.t * .3 + k) * 50, x = PC.x + Math.cos(a) * rr, y = PC.y + Math.sin(a) * rr * .8;
        const vx = -Math.sin(a) * sg, vy = Math.cos(a) * .8 * sg; c.save(); c.translate(x, y); c.rotate(Math.atan2(vy, vx)); c.globalAlpha = .75;
        c.beginPath(); c.ellipse(0, 0, 17, 7, 0, 0, 7); c.fillStyle = k % 2 ? '#e8a33d' : '#d9603f'; c.fill();
        c.beginPath(); c.moveTo(-14, 0); c.lineTo(-26, -7 + Math.sin(st.t * 9 + k) * 3); c.lineTo(-26, 7 + Math.sin(st.t * 9 + k) * 3); c.closePath(); c.fill(); c.restore(); c.globalAlpha = 1;
      }
      [[205, .5], [230, 2.3], [190, 4.1]].forEach(([r, a], i) => { const p = g.polar(PC, r, a); c.beginPath(); c.moveTo(p.x, p.y); c.arc(p.x, p.y, 26 - i * 3, .3 + i, Math.PI * 2 - .3 + i); c.closePath(); c.fillStyle = '#7fa06a'; c.fill(); c.strokeStyle = 'rgba(23,20,17,.5)'; c.lineWidth = 1.5; c.stroke(); if (i === 0) { c.beginPath(); c.arc(p.x + 6, p.y - 4, 7, 0, 7); c.fillStyle = '#eaa9b6'; c.fill(); } });
      pool.splash = (pool.splash || []).filter((sp) => st.t - sp.t0 < .7);
      pool.splash.forEach((sp) => { const k = (st.t - sp.t0) / .7; for (let j = 0; j < 10; j++) { const a = j / 10 * Math.PI * 2, r = 8 + k * 40, h = Math.sin(k * Math.PI) * 26; c.beginPath(); c.arc(sp.p.x + Math.cos(a) * r, sp.p.y + Math.sin(a) * r * .6 - h, 3 * (1 - k) + 1, 0, 7); c.fillStyle = 'rgba(235,245,250,.9)'; c.fill(); } c.beginPath(); c.arc(sp.p.x, sp.p.y, 6 + k * 30, 0, 7); c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 2.5; c.stroke(); });
      const ripple = (p, r) => { if (r <= 0) return; for (let j = 0; j < 3; j++) { const rr = (r - j * .7) * UNIT; if (rr <= 0) continue; c.beginPath(); c.arc(p.x, p.y, rr, 0, 7); c.strokeStyle = j ? `rgba(255,255,255,${.5 - j * .15})` : 'rgba(23,40,52,.9)'; c.lineWidth = j ? 2 : 3; c.stroke(); } };
      if (pool.A) ripple(pool.A, r1()); if (pool.B) ripple(pool.B, r2());
      const ti = triInfo();
      if (ti) {
        d.poly(c, [pool.A, pool.B, ti.C], { fill: 'rgba(232,163,61,.4)', w: 4 });
        const sides = [[pool.A, pool.B, ab()], [pool.A, ti.C, r1()], [pool.B, ti.C, r2()]], cen = g.mul(g.add(g.add(pool.A, pool.B), ti.C), 1 / 3);
        const vals = sides.map((x) => x[2]);
        sides.forEach(([p, q, v]) => { if (vals.filter((x) => Math.abs(x - v) < .05).length > 1) d.ticks(c, p, q, 1, { size: 10 }); const m = g.lerp(p, q, .5), o = g.unit(g.sub(m, cen)); d.text(c, N.fmt(v), m.x + o.x * 28, m.y + o.y * 28, { size: 28 }); });
        d.dot(c, ti.C, { r: 7, label: 'C', lx: 0, ly: -24 }); d.dot(c, ti.C2, { r: 4, color: 'rgba(23,20,17,.4)' });
      }
      c.restore();
      [['A', pool.A], ['B', pool.B]].forEach(([n, p]) => { if (!p) return; c.beginPath(); c.ellipse(p.x, p.y, 11, 8, .3, 0, 7); c.fillStyle = '#8c8577'; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2.5; c.stroke(); d.text(c, n, p.x - 18, p.y + 22, { size: 30 }); });
      if (ti) d.text(c, `${ti.kind} üçgen`, 450, 26, { size: 34, color: N.DEEP });
      d.text(c, `zaman: ${N.fmt(pool.t / 10)} · A halkası ${N.fmt(r1())} · B halkası ${N.fmt(r2())} birim`, 450, 588, { size: 21, color: N.SOFT, font: N.SERIF });
    };
    Z.onDown = (p) => {
      if (g.dist(p, PC) > PR - 20) return;
      if (pool.A && pool.B) { say('İki taş zaten havuzda. Yeniden denemek için <b>taşları topla</b>.'); return; }
      if (!pool.A) { pool.A = p; pool.t = 0; N.sfx.draw(); pool.splash = [{ p, t0: st.t }]; say('A taşı suda! Şimdi biraz uzağa <b>B</b> taşını at.'); }
      else {
        let L = g.dist(pool.A, p) / UNIT; if (L < 4) { say('B taşını A’dan biraz <b>daha uzağa</b> at.'); return; }
        L = Math.min(10, Math.round(L * 2) / 2); pool.B = g.add(pool.A, g.mul(g.unit(g.sub(p, pool.A)), L * UNIT));
        if (g.dist(pool.B, PC) > PR - 16) { pool.B = null; say('B taşı havuzun dışına düşecekti. Biraz içeriye at.'); return; }
        N.sfx.draw(); (pool.splash = pool.splash || []).push({ p: pool.B, t0: st.t }); say(`İki taş da suda! |AB| = <b>${N.fmt(L)} birim</b>. Şimdi <b>zamanı ilerlet</b> ya da ▶ ile oynat.`); markDone('cesme', 'ikitas');
      }
      renderZSide(); Z.ask();
    };
    Z.ask();
  }
  function poolChanged() {
    const ti = triInfo(); Z.ask(); const sl = $('#zt'); if (sl) sl.value = pool.t;
    if (!ti) return;
    if (!pool.delay && !isDone('cesme', 'bulus')) { say(`Halkalar C’de buluştu! |AC| = |BC| = ${N.fmt(r1())} birim, çünkü ikisi de aynı zamanda büyüdü: <b>ikizkenar</b>.`); addLog('cesme', `Aynı anda: |AB| = ${N.fmt(ab())}, |AC| = |BC| = ${N.fmt(r1())} → ikizkenar`); markDone('cesme', 'bulus'); }
    if (!pool.delay && Math.round(r1() * 10) === Math.round(ab() * 10) && !isDone('cesme', 'eskenar')) { say(`Halkalar tam |AB| = ${N.fmt(ab())} birim oldu: üç kenar eşit, <b>eşkenar üçgen</b>!`); addLog('cesme', `|AB| = |AC| = |BC| = ${N.fmt(ab())} → eşkenar`); markDone('cesme', 'eskenar'); stopPlay(); }
    if (pool.delay && ti.kind === 'çeşitkenar' && !isDone('cesme', 'gecikme')) { say(`B geç atıldı: |AB| = ${N.fmt(ab())}, |AC| = ${N.fmt(r1())}, |BC| = ${N.fmt(r2())}. Üçü de farklı: <b>çeşitkenar</b>.`); addLog('cesme', `B geç: ${N.fmt(ab())}, ${N.fmt(r1())}, ${N.fmt(r2())} → çeşitkenar`); markDone('cesme', 'gecikme'); }
  }
  function stopPlay() { if (pool.play) { clearInterval(pool.play); pool.play = null; const b = $('#play'); if (b) b.textContent = '▶ Oynat'; } }
  function ctlPool(host) {
    host.innerHTML = `<label class="small" for="zt">Zaman (halkaların büyüklüğü)</label><input type="range" id="zt" min="0" max="120" step="1" value="${pool.t}">
      <div class="row"><button class="btn primary" id="play" type="button">${pool.play ? '❚❚ Durdur' : '▶ Oynat'}</button><button class="btn" id="minus" type="button">−</button><button class="btn" id="plus" type="button">+</button><button class="btn" id="topla" type="button">Taşları topla</button></div>
      <label style="display:flex;gap:8px;align-items:center;margin-top:6px;cursor:pointer"><input type="checkbox" id="gec" ${pool.delay ? 'checked' : ''} style="width:20px;height:20px;accent-color:#171411"> B taşını 2 birim geç at</label>`;
    const sl = $('#zt'); sl.oninput = () => { pool.t = +sl.value; poolChanged(); };
    $('#minus').onclick = () => { pool.t = Math.max(0, pool.t - 1); poolChanged(); }; $('#plus').onclick = () => { pool.t = Math.min(120, pool.t + 1); poolChanged(); };
    $('#play').onclick = () => {
      if (!pool.A || !pool.B) { say('Önce havuza <b>iki taş</b> at.'); return; }
      if (pool.play) return stopPlay();
      if (pool.t >= 120) pool.t = 0;
      $('#play').textContent = '❚❚ Durdur';
      pool.play = setInterval(() => { pool.t++; poolChanged(); if (pool.t >= 120) stopPlay(); }, 60);
    };
    $('#topla').onclick = () => { stopPlay(); pool.A = pool.B = null; pool.t = 0; say('Taşları topladım. Yeniden iki taş at.'); renderZSide(); Z.ask(); };
    $('#gec').onchange = (e) => { pool.delay = e.target.checked; say(pool.delay ? 'Artık B taşı A’dan biraz sonra düşüyor: B halkası hep <b>2 birim küçük</b>.' : 'İki taş yine aynı anda düşüyor.'); poolChanged(); };
  }

  /* ══════════ defter, öğretmen, sunum ══════════ */
  function openSheet(id) { $('#' + id).classList.add('open'); }
  function closeSheets() { document.querySelectorAll('.sheet').forEach((x) => x.classList.remove('open')); }
  document.querySelectorAll('.sheet').forEach((x) => x.addEventListener('click', (e) => { if (e.target === x) closeSheets(); }));
  function renderDefter() {
    const box = $('#defterBox');
    box.innerHTML = `<button class="chip-btn close" type="button" data-close>kapat ✕</button><h2>Gözlem defterim</h2>
      <label class="small">Adım</label><input type="text" id="adIn" value="${(st.ad || '').replace(/"/g, '&quot;')}" placeholder="Adın ve sınıfın">
      ${STS.map((S) => `<h3>${S.ad} <span class="code" style="font-family:var(--mono);font-size:12px;color:var(--amber-deep)">${S.kod}</span></h3>
        <p class="small"><b>Soru:</b> ${S.soru}<br><b>Tahminim:</b> ${st.sence[S.id] != null ? S.secenekler[st.sence[S.id]] : '—'}</p>
        <ul>${(st.log[S.id] || []).filter((l) => !l.startsWith('Tahminim')).map((l) => `<li>${l}</li>`).join('') || '<li class="small">Henüz gözlem yok.</li>'}</ul>
        <label class="small">Son düşüncem</label><textarea data-son="${S.id}" placeholder="Ne fark ettin? Tahminin doğru çıktı mı?">${st.son[S.id] || ''}</textarea>`).join('')}
      <h3>Kasabada bulduğum şekiller (${T.avlar.filter((A) => st.av[A.id]).length}/${T.avlar.length})</h3>
      <ul>${T.avlar.filter((A) => st.av[A.id]).map((A) => `<li>${A.metin}</li>`).join('') || '<li class="small">Henüz yok. Kasabada dolaşıp şekillere dokun.</li>'}</ul>
      <div class="row2"><button class="btn primary" id="rapor" type="button">Raporu indir</button><button class="btn" id="sifirla" type="button">Defteri temizle</button></div>`;
    box.querySelector('[data-close]').onclick = closeSheets;
    $('#adIn').oninput = (e) => { st.ad = e.target.value; persist(); };
    box.querySelectorAll('[data-son]').forEach((t) => (t.oninput = () => { st.son[t.dataset.son] = t.value; persist(); }));
    $('#rapor').onclick = report;
    $('#sifirla').onclick = () => { if (!confirm('Defterdeki bütün tahmin ve gözlemler silinsin mi?')) return; st.done = {}; st.sence = {}; st.log = {}; st.son = {}; st.av = {}; persist(); renderAll(); renderDefter(); };
  }
  function report() {
    const esc = (x) => String(x).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Gözlem raporu · Nokta'nın Kasabası</title>
<style>body{font-family:Georgia,serif;max-width:760px;margin:32px auto;padding:0 18px;color:#171411;background:#fffaf0;line-height:1.5}h1{font-size:30px;margin:0}h2{font-size:22px;border-bottom:2px solid #e8a33d;padding-bottom:4px;margin-top:28px}.k{font-family:monospace;color:#b8741a;font-size:13px}.q{background:#f1eadc;padding:8px 12px;border-radius:8px}</style></head><body>
<h1>Gözlem raporu: Nokta'nın Kasabası</h1><p class="k">${esc(st.ad || 'İsimsiz')} · ${new Date().toLocaleDateString('tr-TR')}</p>
${STS.map((S) => `<h2>${esc(S.ad)} <span class="k">${S.kod}</span></h2><p class="q"><b>Soru:</b> ${esc(S.soru)}<br><b>Tahminim:</b> ${st.sence[S.id] != null ? esc(S.secenekler[st.sence[S.id]]) : '—'}</p>
<p><b>Gözlemlerim:</b></p><ul>${(st.log[S.id] || []).filter((l) => !l.startsWith('Tahminim')).map((l) => `<li>${esc(l)}</li>`).join('') || '<li>—</li>'}</ul>
<p><b>Görevler:</b> ${S.gorevler.filter((t) => isDone(S.id, t.id)).length} / ${S.gorevler.length}</p>
<p><b>Son düşüncem:</b> ${esc(st.son[S.id] || '—')}</p>`).join('')}
<h2>Kasabada bulduğum şekiller</h2><ul>${T.avlar.filter((A) => st.av[A.id]).map((A) => `<li>${A.metin.replace(/<[^>]+>/g, '')}</li>`).join('') || '<li>—</li>'}</ul>
</body></html>`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'nokta-kasaba-gozlem-raporu.html';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function renderOgretmen() {
    $('#ogretmenBox').innerHTML = `<button class="chip-btn close" type="button" data-close>kapat ✕</button><h2>Öğretmen notları</h2>
      <ul>${T.ogretmenGenel.map((x) => `<li>${x}</li>`).join('')}</ul>
      ${STS.map((S) => `<h3>${S.ad} · ${S.kod}</h3><p>${S.ogretmen}</p>`).join('')}
      <h3>Kısayollar</h3><p class="small">1–3 gözlem noktaları · ← → kaydır · Z yakından incele · D defter · O öğretmen · P sunum modu · H arayüzü gizle · Esc kapat</p>
      <h3>Metinleri düzenlemek</h3><p class="small">Nokta’nın bütün metinleri, görevler ve bu notlar <code>js/kasaba.js</code> dosyasının başındaki <code>KASABA_METINLERI</code> nesnesindedir.</p>`;
    $('#ogretmenBox').querySelector('[data-close]').onclick = closeSheets;
  }
  function togglePresent() { st.present = !st.present; $('#present').classList.toggle('on', st.present); $('#sunumBtn').setAttribute('aria-pressed', String(st.present)); }

  /* ══════════ tanıtım ══════════ */
  let ci = -1, hl, cbox;
  function coach(i) {
    ci = i; if (!hl) { hl = document.createElement('div'); hl.className = 'coach-hl'; cbox = document.createElement('div'); cbox.className = 'coach'; document.body.append(hl, cbox); }
    if (i >= T.tanitim.length) { hl.remove(); cbox.remove(); hl = cbox = null; try { localStorage.setItem(KEY + '-tanitim', '1'); } catch (_) {} return; }
    const step = T.tanitim[i], el = step.hedef ? $(step.hedef) : null;
    let r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    if (step.hedef === '#world') r = { left: innerWidth * .15, top: innerHeight * .25, width: innerWidth * .7, height: innerHeight * .45 };
    Object.assign(hl.style, { left: r.left - 6 + 'px', top: r.top - 6 + 'px', width: r.width + 12 + 'px', height: r.height + 12 + 'px', opacity: el || step.hedef ? 1 : 0 });
    cbox.innerHTML = `<div class="who"><img src="../img/nokta.png" alt=""><p>${step.metin}</p></div><div class="row2"><span class="n">${i + 1} / ${T.tanitim.length}</span><span><button class="btn" id="cSkip" type="button">Geç</button> <button class="btn primary" id="cNext" type="button">${i === T.tanitim.length - 1 ? 'Başla' : 'İleri →'}</button></span></div>`;
    const bw = Math.min(380, innerWidth - 24), bh = cbox.offsetHeight || 150;
    let x = r.left + r.width / 2 - bw / 2, y = r.top + r.height + 16;
    if (y + bh > innerHeight - 8) y = r.top - bh - 16; if (y < 8) y = Math.max(8, innerHeight / 2 - bh / 2);
    x = Math.max(12, Math.min(innerWidth - bw - 12, x));
    Object.assign(cbox.style, { left: x + 'px', top: y + 'px' });
    $('#cNext').onclick = () => coach(i + 1); $('#cSkip').onclick = () => coach(T.tanitim.length); $('#cNext').focus();
  }

  /* ══════════ bağlantılar ══════════ */
  function renderAll() { renderStations(); renderCard(); renderAv(); document.querySelectorAll('[data-hava]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.hava === st.hava))); }
  document.querySelectorAll('[data-hava]').forEach((b) => (b.onclick = () => { st.hava = b.dataset.hava; persist(); renderAll(); if (zoomOpen) Z.ask(); toast({ sabah: 'Günaydın kasaba!', aksam: 'Akşam oldu: pencereler ve fenerler yandı.', yagmur: 'Yağmur başladı: havuza ve su birikintilerine bak. Her damla bir <b>çember</b> çiziyor!' }[st.hava]); }));
  $('#avBtn').onclick = () => { const n = T.avlar.filter((A) => st.av[A.id]).length; toast(n === T.avlar.length ? 'Bütün şekilleri buldun! Defterine bak.' : `Kasabada saklı <b>${T.avlar.length - n}</b> şekil daha var. Çatılara, pencerelere, tabelalara ve çitlere dokun!`); };
  $('#defterBtn').onclick = () => { renderDefter(); openSheet('defter'); };
  $('#ogretmenBtn').onclick = () => { renderOgretmen(); openSheet('ogretmen'); };
  $('#sunumBtn').onclick = togglePresent;
  $('#yardimBtn').onclick = () => coach(0);
  addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (zoomOpen && e.key !== 'Escape') return;
    const k = e.key.toLowerCase();
    if (['1', '2', '3'].includes(k)) go(+k - 1);
    else if (k === 'arrowleft') cam.tx = clampCam(cam.tx - 300); else if (k === 'arrowright') cam.tx = clampCam(cam.tx + 300);
    else if (k === 'z') openZoom(); else if (k === 'd') $('#defterBtn').click(); else if (k === 'o') $('#ogretmenBtn').click();
    else if (k === 'p') togglePresent(); else if (k === 'h') document.body.classList.toggle('hide-ui'); else if (k === 'escape') closeSheets();
  });

  renderAll(); go(0); cam.x = cam.tx;
  requestAnimationFrame(frame);
  let seen = false; try { seen = !!localStorage.getItem(KEY + '-tanitim'); } catch (_) {}
  const q = new URLSearchParams(location.search);
  if (q.get('hava') && PAL[q.get('hava')]) { st.hava = q.get('hava'); renderAll(); }
  if (q.get('nokta')) go(+q.get('nokta') - 1);
  if (!seen && !q.has('tanitimsiz')) setTimeout(() => coach(0), 600);
})();
