# Dünya motoru: yeni dünya ve istasyon eklemek

## Dosyalar
```
oyunlar/<dunya>.html         kasaba.html'in kopyası; yalnız metin dosyası ve başlık değişir
js/<dunya>-metinleri.js      window.DUNYALAR.<id> = { dunya, tanitim, istasyonlar, avlar, ogretmenGenel }
js/kasaba.js                 ortak motor (bütün dünyalar)
css/kasaba.css               arayüz
```
Sayfada sıra: `ortak.js` → `<dunya>-metinleri.js` → `kasaba.js`. Metin dosyasının sonunda `var KASABA_METINLERI = window.DUNYALAR.<id>;`.

## Dünya ayarı
```js
dunya: { id: 'carsi', ad: 'Nokta’nın Çarşısı', yer: 'Çarşı', key: 'nokta-carsi',   // localStorage anahtarı
  tema: '5. sınıf · Sayılar ve Nicelikler (MAT.5.1)', WMIN: 3250, WW: 7800,          // dünyanın sol/sağ sınırı
  LAMPS: [3600, 4330, 5560], avAd: 'sayı avı', avYer: 'Çarşıda', avIpucu: 'Tabelalara … dokun!',
  soz: ['Nokta’ya dokununca söylediği sözler', '…'] }
```
Motor `DW.id`’ye göre zemini çizer: `if (DW.id === 'carsi') carsiGround(); else kasabaGround();` — yeni dünya için `<id>Ground()` yaz ve buraya ekle.

## İstasyon nesnesi
```js
{ id: 'otogar', ad: 'Otogar', kod: 'MAT.5.1.2',
  x: 4980, mx: 4980, my: 330, nx: -330,          // kamera merkezi, gökyüzündeki numara işareti, Nokta'nın duracağı yer (x+nx)
  hit: [x0, x1, y0, y1],                          // dünyada dokununca istasyona gidilen dikdörtgen
  varis: 'Nokta varınca söyler',
  gozlem: 'Kartta ilk paragraf: ne görüyoruz?',
  soru: 'Sence? sorusu', secenekler: ['…', '…', '…'], dogru: 1,
  gorevler: [ { id: 'topla', metin: 'Listede görünen kısa ad',
                part: 'sekme-adı (varsa)',
                yonerge: 'Yakın planda büyük kutuda: NEYE, NASIL dokunacağını söyle.',
                ipucu: ['1. ipucu: düşünme yolu', '2. ipucu: daha somut', '3. ipucu: “ok şimdi yeri gösteriyor”'] } ],
  aciklama: 'Görevler bitince açılan kavram özeti (kalın terimlerle).',
  sunum: 'Sunum modunda tahtaya büyük yazılan soru',
  oyun: { ad: 'Pekiştirme oyunu', url: 'oyun.html' }  // ya da film: { ad, id }
  ogretmen: 'Öğrenme çıktısı + süreç bileşenleri + sınıfta kullanım notu' }
```

## Yakın plan (zoom) kalıbı
```js
function setupX() {
  zhint = '';                              // yönerge kutusu var; Nokta yalnız geri bildirim verir: say('…')
  Z.draw = (c) => { … };                   // 900 × 600 mantıksal tahta
  Z.onDown = (p) => { … }; Z.onMove = (p) => { if (!p || !Z.down) return; … }; Z.onUp = () => { … };
  Z.ask();
}
function ctlX(host) { host.innerHTML = '…düğmeler…'; partTabs(host, durum, LISTE, 'id', () => say(HINT[durum.part])); }
```
- Görev başarıldığında: `say('Neden doğru olduğunu anlatan cümle'); addLog(sid, 'deftere satır'); markDone(sid, tid);`
- Birden çok etkinlik varsa **sekmeler** (`partWrap` + `partTabs`): aynı anda tek etkinlik. Rehber doğru sekmeye kendisi geçer (`part` alanı).
- Kaydırma/ölçek gerekmiyorsa `partWrap` kullanma; tahta 900 × 600’e sığsın.
- Dispatch tabloları: `openZoom` içindeki `setup…` ve `renderZSide` içindeki `ctl…` tablosuna ekle; `partState()`’e durum nesnesini ekle.

## Rehber hedefi (guideFor)
```js
if (k === 'gozlemevi.bolukle') return {
  how: { x, y, t: 'ayırma düğmeleri', box: [x0, x1] },   // başta: neyle yapılacağı (çerçeve ya da ok)
  pt:  { x, y, t: 'buraya ayır', below: true } };        // bütün ipuçlarından sonra: nerede
if (S.id === 'otogar') return { sel: '#otTop' };           // yan paneldeki öğe parlar (nudge)
```

## Dünya nesneleri
- Binalar: `house(x, w, h, çatıRengi, { chimney, box, shutters, bay, awning, sign })`, `tree(x, ölçek)`, `lamp(x)`; özel yapılar için `inkRect/inkPoly/hatch/groundShadow` ile yeni fonksiyon.
- Hareketliler: yürüyen kasabalılar (`WALKERS`), bisiklet, güvercinler, tren, kuş sürüsü, balon.
- Şekil/sayı avı: metin dosyasındaki `avlar` (x, y, r) — dünyada dokununca bulunur, deftere yazılır.
