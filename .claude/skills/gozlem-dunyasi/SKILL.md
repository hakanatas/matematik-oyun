---
name: gozlem-dunyasi
description: Her ders ve konu için (fen, sosyal bilgiler, tarih, coğrafya, Türkçe, yabancı dil, müzik, sanat, matematik, mesleki konular, yetişkin eğitimi…) "Nokta'nın Kasabası" kıvamında etkileşimli öğrenme dünyası tasarlar ve kodlar. Kasabanın tasarımını referans alır ama konuya göre mekânı, rehber karakteri, renk tonunu, etkileşimleri ve görevleri yeniden kurar. El çizimi mürekkep görünümü, gezilen yan kaydırmalı dünya, istasyonlar (gözlem → "Sence?" tahmini → yakından incele → görevler → açıklama), öğrenciyi tek başına adım adım götüren rehber, kavramı gözle görünür kılan canlı animasyonlar, ortam sesleri, öğretmen notları, isteğe bağlı çok oyunculu sınıf odası. "Şu konu için kasaba gibi bir şey", "gözlem ortamı", "keşif dünyası", "etkileşimli ders ortamı", "eğitsel oyun", "ünite sonu etkinliği", "Nokta tarzında", "Polen'in Vadisi gibi" istendiğinde kullan.
---

# Gözlem Dünyası: her konu için kasaba kıvamı

Bu skill bir **kalıp değil, bir tasarım anlayışıdır.** Referans uygulamalar `hakanatas/matematik-oyun` deposundadır:
- **Nokta'nın Kasabası**: geometri.
- **Nokta'nın Çarşısı**: sayılar.

Yeni bir konuda bunları kopyalama. Aynı **kıvamı** o konunun kendi dünyasıyla yeniden kur.

## Önce konuyu anla, sonra dünyayı seç

Kod yazmadan önce şu beş soruyu yanıtla. Gerekirse kullanıcıya sor, yoksa makul bir öneriyle başla.

1. **Kim öğreniyor?** Yaş ya da sınıf, ön bilgi, tek başına mı sınıfta mı.
2. **Ne öğrenilecek?** 4–8 öğrenme çıktısı ya da kazanım; resmî kod varsa kullan. Her biri bir **istasyon** olur.
3. **Konu nerede yaşıyor?** Kavramların doğal olarak görüldüğü bir mekân seç; bu, dünyanın kendisi olur. Örnekler `references/konuya-uyarlama.md` içinde.
4. **Kavram nasıl görünür olur?** Her çıktı için şu sorunun cevabı yakın plan etkinliğidir: “Çocuk neyi değiştirince neyi görecek?”
5. **Hangi yanılgılar var?** Yaygın yanlış fikirler “Sence?” şıklarına ve geri bildirimlere girer.

Sonra kullanıcıya kısa bir **dünya önerisi** sun: mekân, rehber karakter, istasyon listesi, her istasyonun etkileşimi. Onay gelince kodla.

## Konuya göre değişenler, değişmeyenler

| Konuya göre değişir | Kasabanın kıvamı (değişmez) |
|---|---|
| Mekân: kasaba, orman, liman, laboratuvar, antik kent, kütüphane, uzay istasyonu… | Kâğıt üstünde el çizimi mürekkep, sabit titreme, soldan ışık, tarama, yer gölgesi |
| Rehber karakter: Nokta ya da konuya uygun bir maskot (aynı çizim kurallarıyla) | Yan kaydırmalı, paralaks katmanlı gezilen dünya; hava ve zaman değişimi |
| Renk tonu: kâğıt ve mürekkep sabit, vurgu renkleri konuya göre | İstasyon akışı: gözlem → “Sence?” → yakından incele → görevler → açıklama |
| Etkileşimler: sürükle, döndür, karıştır, eşleştir, sırala, ölç, dinle, yaz… | Her an tek görev, açık yönerge, kademeli ipucu; işaret önce “nasıl”, sonra “nerede” |
| Saklı nesne avı: şekil, sayı, kelime, canlı türü, tarihî iz… | Puan yok, defter ve rapor var; öğretmen notları; metinler ayrı dosyada |
| Ortam sesleri: kuş, dalga, makine, çarşı uğultusu, müzik… | Erişilebilirlik: dokunma, fare ve klavye; telefon görünümü; azaltılmış hareket |

## Belgeler

| İhtiyaç | Oku |
|---|---|
| Konuyu dünyaya çevirmek, örnek dünyalar, etkileşim türleri | `references/konuya-uyarlama.md` |
| Görsel dil ve konuya göre renk tonu | `references/gorsel-dil.md` |
| Teknik iskelet: motor, istasyon nesnesi, yakın plan, rehber hedefi | `references/dunya-motoru.md` |
| Öğrenciyi tek başına götürmek: yönerge, ipucu, işaret, geri bildirim | `references/rehber.md` |
| Canlılık ve animasyon | `references/canlilik.md` |
| Doğrulama: rehberi izleyen öğrenci testi | `references/test.md` |
| Çok oyunculu sınıf odası | `references/cok-oyunculu.md` |

Taşınabilir çizim seti:
- `assets/murekkep.js`: el çizimi kenar, tarama, yer gölgesi, rehber karakter.
- `assets/ornek.html`: bu seti kullanan, tek başına çalışan örnek.

Tam motor için referans depodaki dosyalar: `js/kasaba.js`, `js/ortak.js`, `css/kasaba.css`.

## Değişmez ilkeler

1. **Tahmin → dene → gerekçelendir.** Her istasyon bir “Sence?” sorusuyla açılır; açıklama en sonda gelir.
2. **Her an tek görev.** Ne yapılacağını söyleyen tek cümlelik bir yönerge ve kademeli ipuçları olur.
3. **Cevabı hemen gösterme.** İşaret önce yalnızca *neyle, nasıl* yapılacağını gösterir ve çocuk denemeye başlayınca kaybolur. *Nerede* olduğunu yalnızca bütün ipuçlarından sonra gösterir.
4. **Kavram sahnede görünsün.** Sonucu yazıyla değil, hareketle doğrula:
   - bölme → kalabalık gruplara ayrılır;
   - fotosentez → yaprak güneşle kabarır;
   - tarihî çarşı → loncalar yerlerine yerleşir;
   - dilbilgisi → kelime vagonları doğru sıraya dizilir.
5. **Etkileşim nesnesi görünür olsun:** tutamak, halka ya da yuvarlak düğme kullan; çocuğa ince bir çizgiye dokundurma.
6. **Dünya tepki versin.** Dokunulan, yanından geçilen ya da üstünde zıplanan nesne bir şey yapsın.
7. **Değerler ve örnekler her açılışta değişsin;** tekrar oynamak yeni bir deneme olsun.
8. **Metinler ayrı dosyada dursun;** öğretmen kod bilmeden değiştirebilsin.
9. **Herkes için:** dokunmatik ekran, klavye, telefon, azaltılmış hareket ve okunur yazı boyu desteklensin.
10. **Kendin dene.** Rehberi izleyen öğrenci testini çalıştır, ekran görüntülerine bak, takılan görevi düzelt.
