---
name: nokta-dunyasi
description: Nokta'nın Kasabası tarzında öğretici "gözlem dünyası" ve mürekkep oyunları tasarlar ve kodlar. Kâğıt üstüne el çizimi mürekkep görünümü, yan kaydırmalı 2.5D dünya, istasyonlar (gözlem → "Sence?" tahmini → yakından incele → görevler → açıklama), öğrenciyi tek başına adım adım götüren rehber (yönerge, kademeli ipucu, tahtada nasıl/nerede işareti), canlı animasyonlar, ortam sesleri, öğretmen notları, isteğe bağlı çok oyunculu katman. Bir ders konusu, ünite ya da tema için etkileşimli öğrenme ortamı, eğitsel oyun, tema sonu gözlem ortamı, "kasaba gibi bir şey", "Nokta tarzında", "polen vadisi gibi" istendiğinde ya da bu depodaki kasaba/çarşı/oyunlara yeni istasyon veya dünya eklenirken kullan.
---

# Nokta'nın Dünyası: tasarım ve yapım rehberi

Bu skill, `hakanatas/matematik-oyun` deposundaki **Nokta'nın Kasabası**nın (oyunlar/kasaba.html) kıvamını başka konulara ve projelere taşımak içindir. Amaç: puan değil **gözlem**; çocuk tek başına, bir öğretmen yanında yokmuş gibi rahatça ilerleyebilmeli.

## Ne zaman hangi belgeyi oku

| İhtiyaç | Oku |
|---|---|
| Görsel dil: renkler, yazı tipleri, el çizimi, gölge, Nokta karakteri | `references/gorsel-dil.md` |
| Yeni bir dünya ya da istasyon kurmak (motor, dosya düzeni, metin dosyası) | `references/dunya-motoru.md` |
| Öğrenciyi yönlendirmek: görev tasarımı, yönerge, ipucu, işaret | `references/rehber.md` |
| Animasyon ve canlılık (tekdüze olmasın) | `references/canlilik.md` |
| Doğrulama: rehberi izleyen "öğrenci" testi, ekran görüntüleri | `references/test.md` |
| Çok oyunculu katman (Google okul hesabı, odalar, hazır mesajlar) | `references/cok-oyunculu.md` |

Taşınabilir çizim seti: `assets/murekkep.js` (el çizimi kenar, tarama, yer gölgesi, Nokta karakteri). Tek başına bir sayfaya eklenip `N.murekkep(ctx, { GROUND })` ile kullanılır.

## Değişmez ilkeler

1. **Tahmin → dene → gerekçelendir.** Her istasyon bir “Sence?” sorusuyla başlar, deneme yakın planda yapılır, açıklama en sonda açılır.
2. **Her an tek görev.** Yakın planda “Görev 2 / 4” kutusu, tek bir açık yönerge (“neye, nasıl dokunacağını” söyler), istenince kademeli ipuçları. Görev bitince yeşil “Aferin! Sıradaki görev →”.
3. **Cevabı hemen gösterme.** Tahtadaki işaret önce yalnız **nasıl** (hangi araç/düğme) gösterir; çocuk denemeye başlayınca kaybolur; **nerede** olduğunu ancak bütün ipuçları açılınca gösterir.
4. **Etkileşim nesnesi görünür olsun.** İnce kesikli çizgiye dokundurma; yuvarlak düğme, tutamak, halka kullan.
5. **Matematik/kavram gözle görülsün.** Bölme → kalabalık gruplara yürür; kesir → tepsi dilimlenir; açı → kollar döner. Sonucu yazıyla değil sahneyle doğrula.
6. **Puan yok, defter var.** Gözlemler deftere yazılır, rapor indirilir; öğretmen notları ve öğrenme çıktısı kodu her istasyonda.
7. **Sayılar her açılışta değişir** (rastgele ama uygun aralıkta), “Yeniden” yeni bir deneme olur.
8. **Herkes için:** dokunmatik, fare ve klavye (ok + boşluk sanal imleç); `prefers-reduced-motion`; telefon görünümü (araçlar menüde, kart şeride iner).
9. **Metinler ayrı dosyada.** Öğretmen kod bilmeden metinleri değiştirebilmeli (`js/<dunya>-metinleri.js`).
10. **Kendin dene.** Her değişiklikten sonra rehberi izleyen öğrenci testini çalıştır ve ekran görüntülerine bak (`references/test.md`).

## Hızlı başlangıç: yeni bir tema sonu dünyası

1. `references/dunya-motoru.md`’deki iskeleti izleyerek `js/<dunya>-metinleri.js` oluştur (dünya ayarı + istasyonlar + şekil/sayı avı + öğretmen notları).
2. `oyunlar/kasaba.html`’i `oyunlar/<dunya>.html` olarak kopyala, metin dosyasını değiştir.
3. `js/kasaba.js` içinde dünyanın binalarını (`<dunya>Ground()`), istasyon yakın planlarını (`setup<X>` + `ctl<X>`) ve rehber hedeflerini (`guideFor`) ekle.
4. Her görev için `yonerge` ve `ipucu` yaz; `guideFor` içinde `how` ve `pt`/`sel` döndür.
5. Öğrenci testini çalıştır, ekran görüntülerine bak, sıkışan görevi düzelt.
6. Ana sayfaya kart, README’ye istasyon listesi.

## Kaynak dosyalar (bu depoda)

- `js/ortak.js` — tuval (N.Stage), geometri (N.g), mürekkep çizimleri (N.d, kalem izi), Nokta karakteri (N.noktaChar, N.avatar), ses, puan, klavye imleci.
- `js/kasaba.js` — dünya motoru (paralaks katmanlar, hava, ortam sesleri, istasyonlar, yakın plan, rehber, defter, rapor, tanıtım).
- `js/kasaba-metinleri.js`, `js/carsi-metinleri.js` — iki örnek dünyanın bütün metinleri.
- `css/kasaba.css`, `css/oyun.css` — arayüz.
- `js/cok/`, `firebase/database.rules.json`, `COK-OYUNCULU.md` — çok oyunculu katman.
