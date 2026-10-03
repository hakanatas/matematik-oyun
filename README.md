# Nokta'nın Oyunları

Ortaokul matematik için mürekkep oyunları. [Nokta'nın Filmleri](https://hakanatas.github.io/nokta-filmleri/) ile aynı görsel dünyada; Türkiye Yüzyılı Maarif Modeli öğrenme çıktılarına göre hazırlandı. Her oyun aynı döngüyü izler: **tahmin et → dene → gerekçelendir**.

Canlı sürüm: **https://hakanatas.github.io/matematik-oyun/**

İlk tema: **5. sınıf · MAT.5.3 Geometrik Şekiller**

| Kod | Oyun | Ne yapılıyor? | Film |
|---|---|---|---|
| MAT.5.3.1 – 5.3.2 | [Araç Ustası](oyunlar/arac-ustasi.html) | Doğru aracı seç (ölçüsüz cetvel, pergel, gönye) ve kullan: cetvelle sürükle, pergeli döndür, gönyeyi kaydır. Doğru, doğru parçası, ışın, çember, açı, dikme ve paralel çizildikçe yelkenli sahnesi canlanır. Sonunda çizimlerden çıkarım soruları var. | Noktadan Çembere |
| MAT.5.3.3 | [Açı Avcısı](oyunlar/aci-avcisi.html) | Önce tahmin et, sonra sürüklenip döndürülebilen açıölçerle ölç. Açıyı sınıflandır, verilen ölçüde açı ve eş açı kur. | Kaç Derece? |
| MAT.5.3.4 | [Kesişme Dedektifi](oyunlar/kesisme-dedektifi.html) | Paralel, kesişen, dik ve çakışık doğrular. Açı bulmacalarında ters, komşu bütünler ve tümler açılar. Doğruları çevirerek “6 dar açı” gibi görevleri tamamla. | Doğrular Kesişince |
| MAT.5.3.5 | [Şekli Kapat](oyunlar/sekli-kapat.html) | Doğruları ardışık kesiştir; son doğru ilkini kesince çokgen kapanır. Üçgenden altıgene kadar çokgen kur, n doğru → n kenar genellemesini yap. | Doğrulardan Çokgene |
| MAT.5.3.6 | [Üçgenin Sırrı](oyunlar/ucgenin-sirri.html) | Köşeleri yırtıp 180°’yi bul, kayıp açıyı hesapla. 3 × 3 üçgen tablosunu doldur, imkânsız hücreleri yakala, düzgün çokgenleri ayırt et. | Üçgenin Sırrı |
| MAT.5.3.7 | [Pergel Ustası](oyunlar/pergel-ustasi.html) | İki çember ve bir kesişim noktasıyla hiç ölçmeden eşkenar, ikizkenar ve çeşitkenar üçgen kur. Ödül: yaşam çiçeği. | Çemberlerle Üçgen |

## Nokta'nın Kasabası

[Polen'in Vadisi](https://github.com/hakanatas/polen-vadisi)'nden esinlenen bir **gözlem ortamı**: [oyunlar/kasaba.html](oyunlar/kasaba.html). Puan yok. Nokta'nın rehberliğinde kasabada gezilir; her noktada gözlem, “Sence?” tahmini, yakından inceleme ve görevler var. Gözlemler deftere yazılır, rapor indirilir.

1. **Tren İstasyonu** (MAT.5.3.1–5.3.2): paralel raylar, dik travers (en kısa yol), iki noktadan tek doğru, döner platformla çember.
2. **Saat Kulesi** (MAT.5.3.3): akrep ve yelkovanı çevir, açıölçerle ölç.
3. **Kavşak** (MAT.5.3.4): sokakları döndür; ters açılar, dik ve paralel sokaklar.
4. **Çini Atölyesi** (MAT.5.3.5–5.3.6): doğrulardan çokgen çini, düzgün çokgen, köşegen, boşluksuz döşeme.
5. **Köprü** (MAT.5.3.6): üçgen neden sağlam, iç açılar toplamı 180°.
6. **Çeşme Meydanı** (MAT.5.3.7): iki taşın halkalarından ölçmeden üçgen.

Ayrıca: şekil avı (8 saklı şekil, ikisi hareketli), sabah/akşam/yağmur, öğretmen notları, sunum modu (P), tanıtım. Bütün metinler `js/kasaba.js` başındaki `KASABA_METINLERI` nesnesinde.

## Çalıştırma

Kurulum gerekmez. `index.html` dosyasını tarayıcıda açmanız yeterli; internet olmadan da çalışır (yazı tipleri internet yoksa yedek yazı tipine düşer). GitHub Pages için depo kökünden yayımlayabilirsiniz.

## Yapı

```
index.html            ana sayfa: sınıf → tema → oyun (Nokta'nın Filmleri düzeni)
css/oyun.css          ortak mürekkep stili (kâğıt, siyah mürekkep, kehribar)
js/ortak.js           tuval, geometri, çizim, Nokta'nın konuşması, puan, ses, yıldızlar
js/<oyun>.js          her oyunun kuralları
oyunlar/<oyun>.html   oyun sayfaları
img/                  Nokta ve oyun önizlemeleri (oyunların ?onizleme görünümünden)
```

Yeni bir oyun eklemek için `oyunlar/` altındaki bir sayfayı kopyalayın, yeni bir `js/<oyun>.js` yazın ve oyunu `index.html` içindeki `GAMES` listesine ekleyin.

Kaynak: MEB Türkiye Yüzyılı Maarif Modeli, Ortaokul Matematik Dersi Öğretim Programı (tymm.meb.gov.tr).
