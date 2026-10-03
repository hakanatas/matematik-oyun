/* Çok oyunculu kasaba: giriş, sınıf odası, birlikte dolaşma, hazır mesajlar. */
(() => {
  const Ag = N.Ag, A = window.COK_AYAR || {}, MSJ = A.mesajlar || [];
  const $ = (s) => document.querySelector(s), esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const kisa = (ad) => { const p = String(ad || '').trim().split(/\s+/); return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : p[0] || '?'; };
  const RENK = ['#c4432b', '#2f5d8a', '#3f8f8a', '#b8741a', '#7a5a9a', '#4d7a3d', '#c25b8c', '#5b6b78'];
  const renk = (uid) => { let h = 0; for (const ch of String(uid)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return RENK[h % RENK.length]; };
  const W = () => window.__dunya;
  const kay = (uid) => { let h = 7; for (const ch of String(uid)) h = (h * 17 + ch.charCodeAt(0)) >>> 0; const k = (h % 6) + 1; return (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 52; }; // aynı yerde duranlar yan yana
  let oyuncular = {}, gor = {}, balon = {}, sonGonder = 0, sonMesaj = 0, zipSay = 0;

  /* ── giriş ve oda ekranı ── */
  const kutu = document.createElement('div'); kutu.className = 'cok-perde'; kutu.innerHTML = '<div class="cok-kart" id="cokKart"></div>'; document.body.appendChild(kutu);
  const kart = (html) => { $('#cokKart').innerHTML = html; kutu.hidden = false; };
  const testRozet = Ag.mod === 'yerel' ? '<p class="cok-test">Test modu: sunucu bağlı değil. Aynı bilgisayarda birkaç sekme açıp birlikte dolaşmayı deneyebilirsin.</p>' : '';
  function girisEkrani(hata) {
    kart(`<img src="../img/nokta.png" alt="" class="cok-nokta"><h2>Birlikte gezelim!</h2>
      <p>Arkadaşlarınla aynı kasabada dolaş, hazır mesajlarla konuş.</p><p class="small">Yürümek için <b>← →</b>, zıplamak için <b>boşluk</b> ya da <b>↑</b> (ekranda ◀ ▶ ⤒ düğmeleri de var). Çanın, ağaçların, çeşmenin yanında zıplamayı dene!</p>
      ${hata ? `<p class="cok-hata">${hata}</p>` : ''}
      ${Ag.mod === 'yerel' ? `<p class="small">Test için bir kişi seç:</p><div class="cok-liste">${Ag.testKisileri.map((a) => `<button class="btn" data-test="${esc(a)}" type="button">${esc(a)}</button>`).join('')}</div>`
        : `<button class="btn primary big cok-google" id="cokGiris" type="button"><span class="g">G</span> Okul hesabınla gir</button>${Ag.alanlar.length ? `<p class="small">Yalnız ${Ag.alanlar.map((x) => `<b>@${esc(x)}</b>`).join(' ve ')} hesapları girebilir.</p>` : ''}`}
      ${testRozet}<p class="small"><a href="kasaba.html">Tek başıma gezmek istiyorum →</a></p>`);
    const g = $('#cokGiris'); if (g) g.onclick = () => Ag.giris().catch((e) => girisEkrani(e && e.code === 'auth/popup-closed-by-user' ? '' : 'Giriş yapılamadı. Bir daha dene.'));
    document.querySelectorAll('[data-test]').forEach((b) => (b.onclick = () => Ag.giris(b.dataset.test)));
  }
  function odaEkrani(hata) {
    const q = new URLSearchParams(location.search).get('oda') || '';
    kart(`<h2>Merhaba ${esc(kisa(Ag.me.ad))}!</h2>
      <p>Öğretmeninin verdiği <b>oda kodunu</b> yaz.</p>
      <div class="row" style="justify-content:center"><input class="num-in cok-kod" id="cokKod" maxlength="6" autocomplete="off" placeholder="KOD" value="${esc(q)}"><button class="btn primary big" id="cokGir" type="button">Gir →</button></div>
      ${hata ? `<p class="cok-hata">${esc(hata)}</p>` : ''}
      ${Ag.ogretmen ? '<hr><p><b>Öğretmen:</b> sınıfın için yeni bir oda aç.</p><div class="row" style="justify-content:center"><input class="num-in" id="cokOdaAd" placeholder="ör. 5-A" style="width:120px"><button class="btn" id="cokAc" type="button">Oda aç</button></div>' : ''}
      ${testRozet}<p class="small"><button class="chip-btn" id="cokCik" type="button">Çıkış yap (${esc(Ag.me.eposta)})</button></p>`);
    const gir = () => odayaGir($('#cokKod').value);
    $('#cokGir').onclick = gir; $('#cokKod').onkeydown = (e) => { if (e.key === 'Enter') gir(); }; $('#cokKod').focus();
    $('#cokCik').onclick = () => Ag.cikis();
    const ac = $('#cokAc'); if (ac) ac.onclick = async () => { try { const kod = await Ag.odaAc($('#cokOdaAd').value.trim()); await odayaGir(kod); } catch (e) { odaEkrani('Oda açılamadı.'); } };
  }
  async function odayaGir(kod) {
    const n = W().nokta;
    try { await Ag.odayaGir(kod, { x: n.x, tx: n.tx, yon: n.dir || 1 }); } catch (e) { return odaEkrani(e.message); }
    kutu.hidden = true; panel(); const fold = document.querySelector('#fold'); if (fold && fold.getAttribute('aria-expanded') === 'true') fold.click(); // kasabada dolaşmaya yer aç
    Ag.oyuncular((o) => { oyuncular = o; listele(); }); Ag.mesajlar(gelenMesaj);
    history.replaceState(null, '', `?oda=${Ag.oda.kod}`);
  }

  /* ── oda paneli ve mesaj çubuğu ── */
  const pn = document.createElement('aside'); pn.className = 'ui cok-panel'; pn.hidden = true; document.body.appendChild(pn);
  const bar = document.createElement('div'); bar.className = 'ui cok-bar'; bar.hidden = true; document.body.appendChild(bar);
  function panel() {
    pn.hidden = false; bar.hidden = false;
    pn.innerHTML = `<div class="cok-ust"><span>Oda <b>${esc(Ag.oda.kod)}</b>${Ag.oda.ad && Ag.oda.ad !== Ag.oda.kod ? ' · ' + esc(Ag.oda.ad) : ''}</span><button class="chip-btn" id="cokKucult" type="button" aria-expanded="true">–</button></div><ul id="cokOy"></ul><button class="chip-btn" id="cokAyril" type="button">Odadan çık</button>`;
    $('#cokAyril').onclick = async () => { await Ag.ayril(); oyuncular = {}; pn.hidden = true; bar.hidden = true; history.replaceState(null, '', location.pathname); odaEkrani(); };
    $('#cokKucult').onclick = () => pn.classList.toggle('kapali');
    bar.innerHTML = `<div class="cok-yon"><button class="btn" data-yon="-1" type="button" aria-label="Sola yürü">◀</button><button class="btn primary" id="cokMsjAc" type="button" aria-expanded="false">💬 Mesaj</button><button class="btn" data-yon="1" type="button" aria-label="Sağa yürü">▶</button><button class="btn" id="cokZip" type="button" aria-label="Zıpla">⤒ Zıpla</button></div><div class="cok-msj" id="cokMsj" hidden>${MSJ.map((m, i) => `<button class="chip-btn" data-m="${i}" type="button">${esc(m)}</button>`).join('')}</div>`;
    bar.querySelectorAll('[data-yon]').forEach((b) => { const bas = (e) => { e.preventDefault(); W().yuru.d = +b.dataset.yon; }, birak = () => { W().yuru.d = 0; }; b.addEventListener('pointerdown', bas); ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, birak)); });
    $('#cokZip').onclick = () => W().zipla();
    $('#cokMsjAc').onclick = () => { const k = $('#cokMsj'); k.hidden = !k.hidden; $('#cokMsjAc').setAttribute('aria-expanded', String(!k.hidden)); };
    bar.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { if (Date.now() - sonMesaj < 1500) return; sonMesaj = Date.now(); Ag.mesaj(+b.dataset.m); $('#cokMsj').hidden = true; $('#cokMsjAc').setAttribute('aria-expanded', 'false'); }));
    listele();
  }
  function listele() {
    const ul = $('#cokOy'); if (!ul) return; const D = W(), ids = Object.keys(oyuncular);
    ul.innerHTML = ids.sort((a, b) => (a === Ag.me.uid ? -1 : b === Ag.me.uid ? 1 : 0)).map((u) => {
      const o = oyuncular[u], S = D && D.STS.reduce((best, s, i) => (Math.abs(s.x - o.x) < Math.abs(D.STS[best].x - o.x) ? i : best), 0);
      return `<li><i style="background:${renk(u)}"></i><b>${esc(kisa(o.ad))}</b>${u === Ag.me.uid ? ' <span class="small">(sen)</span>' : ''}<span class="small">${D ? esc(D.STS[S].ad) : ''}</span>${u !== Ag.me.uid ? `<button class="chip-btn" data-git="${u}" type="button" title="Yanına git">→</button>` : ''}</li>`;
    }).join('') + (ids.length < 2 ? '<li class="small">Arkadaşların bekleniyor…</li>' : '');
    ul.querySelectorAll('[data-git]').forEach((b) => (b.onclick = () => { const o = oyuncular[b.dataset.git], n = W().nokta; n.tx = o.x - 60; W().cam.tx = o.x; }));
  }
  function gelenMesaj(v) { if (!v || !(v.m >= 0 && v.m < MSJ.length)) return; balon[v.uid] = { metin: MSJ[v.m], t: performance.now() }; if (v.uid !== (Ag.me && Ag.me.uid)) N.sfx.tick(); }

  /* ── kendi konumunu paylaş ── */
  const gonder = (zorla) => { if (!Ag.oda || !W()) return; const n = W().nokta, sig = `${Math.round(n.x)}|${Math.round(n.tx)}|${zipSay}`; if (sig === sonGonder && !zorla) return; sonGonder = sig; Ag.konum({ x: n.x, tx: n.tx, yon: n.dir || 1, z: zipSay }); };
  setInterval(() => gonder(), 250);

  /* ── diğer çocukları çiz (kasaba her karede çağırır) ── */
  function etiket(c, x, y, ad, col) {
    c.font = `600 14px ${N.MONO}`; const w = c.measureText(ad).width + 16;
    c.fillStyle = 'rgba(255,250,240,.92)'; c.beginPath(); c.roundRect ? c.roundRect(x - w / 2, y - 11, w, 22, 11) : c.rect(x - w / 2, y - 11, w, 22); c.fill(); c.strokeStyle = col; c.lineWidth = 2; c.stroke();
    c.fillStyle = N.INK; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(ad, x, y + 1);
  }
  function balonCiz(c, x, y, metin, a) {
    c.globalAlpha = a; c.font = `400 22px ${N.BRUSH}`; const w = c.measureText(metin).width + 26, h = 36, bx = x - w / 2, by = y - h;
    c.fillStyle = N.SHEET; c.beginPath(); c.roundRect ? c.roundRect(bx, by, w, h, 12) : c.rect(bx, by, w, h); c.fill(); c.strokeStyle = N.INK; c.lineWidth = 2.5; c.stroke();
    c.beginPath(); c.moveTo(x - 8, y - 1); c.lineTo(x, y + 12); c.lineTo(x + 8, y - 1); c.fillStyle = N.SHEET; c.fill(); c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x, y + 12); c.lineTo(x + 8, y); c.stroke();
    c.fillStyle = N.INK; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(metin, x, by + h / 2 + 1); c.globalAlpha = 1;
  }
  window.CokOyuncu = {
    zipladi() { zipSay++; gonder(true); },
    xler() { return Object.keys(oyuncular).filter((u) => Ag.me && u !== Ag.me.uid).map((u) => (gor[u] ? gor[u].x + kay(u) : oyuncular[u].x)); },
    ciz(c, t) {
      if (!Ag.oda) return; const D = W(), G = D.GROUND, now = performance.now();
      Object.keys(oyuncular).forEach((u) => {
        const o = oyuncular[u], me = u === Ag.me.uid, col = renk(u);
        let x;
        if (me) x = D.nokta.x;
        else { const g = (gor[u] = gor[u] || { x: o.x }); const hedef = Math.abs(o.tx - g.x) > 2 ? o.tx : o.x; g.x += Math.max(-9, Math.min(9, hedef - g.x)); g.mv = Math.abs(hedef - g.x) > 2; g.yon = hedef < g.x ? -1 : hedef > g.x ? 1 : g.yon || o.yon || 1; x = g.x + kay(u); }
        let jy = me ? D.zipY(D.nokta.jT) : 0;
        if (!me) {
          const g = gor[u];
          if (g.z == null) g.z = o.z || 0; else if ((o.z || 0) > g.z) { g.z = o.z; g.jT = D.st.t; D.zipEtki(x); } // arkadaş zıpladı
          jy = D.zipY(g.jT);
          c.beginPath(); c.ellipse(x + 4, G + 3, 24 - jy * .08, 5, 0, 0, 7); c.fillStyle = 'rgba(23,20,17,.15)'; c.fill();
          c.save(); c.translate(0, -jy);
          N.noktaChar(c, x, G, { t: t + (u.length % 7), moving: g.mv && !jy, dir: g.yon, happy: jy > 0 || (balon[u] && now - balon[u].t < 1500) });
          c.beginPath(); c.ellipse(x, G - 29, 21, 5, 0, 0, 7); c.fillStyle = col; c.fill(); c.strokeStyle = N.INK; c.lineWidth = 1.5; c.stroke(); // atkı
          c.restore();
        }
        etiket(c, x, G - 128 - jy, me ? 'sen' : kisa(o.ad), col);
        const b = balon[u]; if (b) { const age = (now - b.t) / 1000; if (age > 5) delete balon[u]; else balonCiz(c, x, G - 205 - (me ? 0 : 0), b.metin, Math.min(1, (5 - age) * 2, age * 6)); }
      });
    },
  };

  /* ── başlat ── */
  kutu.hidden = false; kart('<p>Bağlanıyor…</p>');
  const bekle = () => (W() ? Ag.oturum((me, hata) => { if (!me) { pn.hidden = true; bar.hidden = true; girisEkrani(hata); } else if (!Ag.oda) { const q = new URLSearchParams(location.search).get('oda'); q ? odayaGir(q) : odaEkrani(); } }) : setTimeout(bekle, 50));
  bekle();
})();
