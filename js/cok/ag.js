/* Çok oyunculu ağ katmanı: Firebase (Google okul hesabı + Realtime Database) ya da test modu.
   Arayüz (cok.js) yalnız N.Ag'ı kullanır; iki mod aynı biçimde davranır. */
(() => {
  const A = window.COK_AYAR || {}, F = A.firebase || {};
  const yerel = /[?&]yerel/.test(location.search) || !F.apiKey || typeof firebase === 'undefined';
  const alanlar = (A.okulAlanAdlari || []).map((a) => a.toLowerCase()), ogrAlan = (A.ogretmenAlanAdi || '').toLowerCase();
  const alanOf = (e) => (e || '').toLowerCase().split('@')[1] || '';
  const okulMu = (e) => !alanlar.length || alanlar.includes(alanOf(e));
  const ogretmenMi = (e) => !!ogrAlan && alanOf(e) === ogrAlan;
  const kodTemiz = (k) => String(k || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  const Ag = { mod: yerel ? 'yerel' : 'firebase', me: null, oda: null, ogretmen: false, alanlar };

  if (!yerel) {
    firebase.initializeApp(F);
    const auth = firebase.auth(), db = firebase.database();
    let presRef = null, offs = [];
    Ag.oturum = (cb) => auth.onAuthStateChanged(async (u) => {
      if (!u) { Ag.me = null; return cb(null); }
      if (!u.emailVerified || !okulMu(u.email)) { await auth.signOut(); return cb(null, `Bu hesapla girilemez. Yalnız ${alanlar.map((a) => `<b>@${a}</b>`).join(' ve ')} okul hesapları girebilir.`); }
      Ag.me = { uid: u.uid, ad: u.displayName || u.email, eposta: u.email };
      Ag.ogretmen = ogretmenMi(u.email);
      cb(Ag.me);
    });
    Ag.giris = async () => { const p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account', ...(alanlar.length === 1 ? { hd: alanlar[0] } : alanlar.length ? { hd: '*' } : {}) }); await auth.signInWithPopup(p); };
    Ag.cikis = async () => { await Ag.ayril(); await auth.signOut(); };
    Ag.odaAc = async (ad) => { const kod = Math.random().toString(36).slice(2, 7).toUpperCase(); await db.ref(`odalar/${kod}/bilgi`).set({ sahip: Ag.me.uid, ad: ad || kod, acik: true, t: firebase.database.ServerValue.TIMESTAMP }); return kod; };
    Ag.odayaGir = async (k, durum) => {
      const kod = kodTemiz(k); let b;
      try { b = (await db.ref(`odalar/${kod}/bilgi`).get()).val(); } catch (_) { b = null; }
      if (!b) throw new Error('Bu kodla açılmış bir oda yok. Kodu öğretmenine sor.');
      if (!b.acik) throw new Error('Bu oda kapatılmış.');
      Ag.oda = { kod, ad: b.ad, sahip: b.sahip };
      presRef = db.ref(`odalar/${kod}/oyuncular/${Ag.me.uid}`);
      await presRef.onDisconnect().remove();
      await presRef.set({ ad: Ag.me.ad, x: durum.x, tx: durum.tx, yon: durum.yon || 1, t: firebase.database.ServerValue.TIMESTAMP });
      return Ag.oda;
    };
    Ag.konum = (d) => { if (presRef) presRef.update({ x: Math.round(d.x), tx: Math.round(d.tx), yon: d.yon, t: firebase.database.ServerValue.TIMESTAMP }).catch(() => {}); };
    Ag.oyuncular = (cb) => { const r = db.ref(`odalar/${Ag.oda.kod}/oyuncular`), f = (s) => cb(s.val() || {}); r.on('value', f); offs.push(() => r.off('value', f)); };
    Ag.mesaj = (m) => db.ref(`odalar/${Ag.oda.kod}/mesajlar`).push({ uid: Ag.me.uid, m, t: firebase.database.ServerValue.TIMESTAMP });
    Ag.mesajlar = (cb) => { const t0 = Date.now() - 5000, r = db.ref(`odalar/${Ag.oda.kod}/mesajlar`).orderByChild('t').startAt(t0), f = (s) => cb(s.val()); r.on('child_added', f); offs.push(() => r.off('child_added', f)); };
    Ag.ayril = async () => { offs.forEach((f) => f()); offs = []; if (presRef) { try { await presRef.remove(); } catch (_) {} presRef = null; } Ag.oda = null; };
  } else {
    // test modu: aynı tarayıcıdaki sekmeler BroadcastChannel ile konuşur, sunucu yok
    const bc = new BroadcastChannel('nokta-cok-test'), dinle = { oy: [], ms: [] }, oy = {};
    let dur = null, kalp = null;
    const ODALAR = () => { try { return JSON.parse(localStorage.getItem('nokta-cok-odalar')) || {}; } catch (_) { return {}; } };
    bc.onmessage = (e) => {
      const d = e.data; if (!Ag.oda || d.oda !== Ag.oda.kod) return;
      if (d.tur === 'oy') { if (d.cik) delete oy[d.uid]; else oy[d.uid] = { ...d.v, _s: Date.now() }; yayOy(); }
      if (d.tur === 'ms') dinle.ms.forEach((f) => f(d.v));
    };
    const yayOy = () => { const now = Date.now(), out = {}; Object.keys(oy).forEach((u) => { if (now - oy[u]._s < 4000) out[u] = oy[u]; else delete oy[u]; }); if (Ag.me && dur) out[Ag.me.uid] = dur; dinle.oy.forEach((f) => f(out)); };
    let oturumCb = null;
    Ag.oturum = (cb) => { oturumCb = cb; const s = sessionStorage.getItem('nokta-cok-test-me'); if (s) { Ag.me = JSON.parse(s); Ag.ogretmen = /öğretmen/i.test(Ag.me.ad); } cb(Ag.me); };
    Ag.testKisileri = ['Ayşe Yılmaz', 'Mehmet Demir', 'Zeynep Kaya', 'Can Öztürk', 'Ela Şahin', 'Öğretmen Hakan Bey'];
    Ag.giris = async (ad) => { const uid = 'test-' + Math.random().toString(36).slice(2, 9); Ag.me = { uid, ad, eposta: ad.split(' ')[0].toLowerCase() + '@okul.test' }; Ag.ogretmen = /öğretmen/i.test(ad); sessionStorage.setItem('nokta-cok-test-me', JSON.stringify(Ag.me)); oturumCb && oturumCb(Ag.me); };
    Ag.cikis = async () => { await Ag.ayril(); sessionStorage.removeItem('nokta-cok-test-me'); Ag.me = null; oturumCb && oturumCb(null); };
    Ag.odaAc = async (ad) => { const kod = Math.random().toString(36).slice(2, 7).toUpperCase(), o = ODALAR(); o[kod] = { sahip: Ag.me.uid, ad: ad || kod, acik: true }; localStorage.setItem('nokta-cok-odalar', JSON.stringify(o)); return kod; };
    Ag.odayaGir = async (k, d) => {
      const kod = kodTemiz(k), b = ODALAR()[kod]; if (!b) throw new Error('Bu kodla açılmış bir oda yok. Kodu öğretmenine sor.');
      Ag.oda = { kod, ad: b.ad, sahip: b.sahip }; dur = { ad: Ag.me.ad, x: d.x, tx: d.tx, yon: d.yon || 1 };
      const gonder = () => bc.postMessage({ tur: 'oy', oda: kod, uid: Ag.me.uid, v: dur });
      gonder(); kalp = setInterval(() => { gonder(); yayOy(); }, 1000);
      addEventListener('pagehide', () => bc.postMessage({ tur: 'oy', oda: kod, uid: Ag.me.uid, cik: true }));
      return Ag.oda;
    };
    Ag.konum = (d) => { if (!dur) return; dur = { ...dur, x: Math.round(d.x), tx: Math.round(d.tx), yon: d.yon }; bc.postMessage({ tur: 'oy', oda: Ag.oda.kod, uid: Ag.me.uid, v: dur }); yayOy(); };
    Ag.oyuncular = (cb) => { dinle.oy.push(cb); yayOy(); };
    Ag.mesaj = async (m) => { const v = { uid: Ag.me.uid, m, t: Date.now() }; bc.postMessage({ tur: 'ms', oda: Ag.oda.kod, v }); dinle.ms.forEach((f) => f(v)); };
    Ag.mesajlar = (cb) => dinle.ms.push(cb);
    Ag.ayril = async () => { if (Ag.oda && Ag.me) bc.postMessage({ tur: 'oy', oda: Ag.oda.kod, uid: Ag.me.uid, cik: true }); clearInterval(kalp); dinle.oy = []; dinle.ms = []; dur = null; Ag.oda = null; };
  }
  N.Ag = Ag;
})();
