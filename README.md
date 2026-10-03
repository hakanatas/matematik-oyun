# Nokta'nın Oyunları

Ortaokul matematik için mürekkep oyunları. [Nokta'nın Filmleri](https://hakanatas.github.io/nokta-filmleri/) ile aynı görsel dünyada; Türkiye Yüzyılı Maarif Modeli öğrenme çıktılarına göre hazırlandı. Her oyun aynı döngüyü izler: **tahmin et → dene → gerekçelendir**.

Canlı sürüm: **https://hakanatas.github.io/matematik-oyun/**

Temalar: **5. sınıf · MAT.5.3 Geometrik Şekiller** (6 oyun) ve **MAT.5.1 Sayılar ve Nicelikler · kesirler** (2 oyun)

| Kod | Oyun | Ne yapılıyor? | Film |
|---|---|---|---|
| MAT.5.1.3 | [Kesir Fırını](oyunlar/kesir-firini.html) | Siparişleri pasta ve tepsi dilimleri, ölçü kapları, sayı doğrusu ve yüzlük kartla göster; denk kesir, tam sayılı ve bileşik kesir, ondalık ve yüzde; sonunda aynı miktarın bütün kılıklarını tuzaklar arasından seç. | Bir Kesir, Dört Kılık |
| MAT.5.1.4 | [Kesir Yarışı](oyunlar/kesir-yarisi.html) | “Paydası büyük olan büyüktür” iddiasını şeritlerle çürüt; şerit karşılaştırma, yarımla karşılaştırma; kesir, ondalık, yüzde ve şekli sayı doğrusunda (yakınlaştırarak) sırala; önermeler. | Hangisi Büyük? |
| MAT.5.3.1 – 5.3.2 | [Araç Ustası](oyunlar/arac-ustasi.html) | Doğru aracı seç (ölçüsüz cetvel, pergel, gönye) ve kullan: cetvelle sürükle, pergeli döndür, gönyeyi kaydır. Doğru, doğru parçası, ışın, çember, açı, dikme ve paralel çizildikçe yelkenli sahnesi canlanır. Sonunda çizimlerden çıkarım soruları var. | Noktadan Çembere |
| MAT.5.3.3 | [Açı Avcısı](oyunlar/aci-avcisi.html) | Önce tahmin et, sonra sürüklenip döndürülebilen açıölçerle ölç. Açıyı sınıflandır, verilen ölçüde açı ve eş açı kur. | Kaç Derece? |
| MAT.5.3.4 | [Kesişme Dedektifi](oyunlar/kesisme-dedektifi.html) | Paralel, kesişen, dik ve çakışık doğrular. Açı bulmacalarında ters, komşu bütünler ve tümler açılar. Doğruları çevirerek “6 dar açı” gibi görevleri tamamla. | Doğrular Kesişince |
| MAT.5.3.5 | [Şekli Kapat](oyunlar/sekli-kapat.html) | Doğruları ardışık kesiştir; son doğru ilkini kesince çokgen kapanır. Üçgenden altıgene kadar çokgen kur, n doğru → n kenar genellemesini yap. | Doğrulardan Çokgene |
| MAT.5.3.6 | [Üçgenin Sırrı](oyunlar/ucgenin-sirri.html) | Köşeleri yırtıp 180°’yi bul, kayıp açıyı hesapla. 3 × 3 üçgen tablosunu doldur, imkânsız hücreleri yakala, düzgün çokgenleri ayırt et. | Üçgenin Sırrı |
| MAT.5.3.7 | [Pergel Ustası](oyunlar/pergel-ustasi.html) | İki çember ve bir kesişim noktasıyla hiç ölçmeden eşkenar, ikizkenar ve çeşitkenar üçgen kur. Sayılar her açılışta değişir. Ödül: yaşam çiçeği. | Çemberlerle Üçgen |

## Tema sonu gözlem ortamları

Her temanın sonunda Polen'in Vadisi tarzında bir gözlem ortamı var. Hepsi aynı motoru (`js/kasaba.js`) kullanır; hangi dünyanın açılacağını sayfanın yüklediği metin dosyası belirler (`js/<dünya>-metinleri.js`: istasyonlar, görevler, öğretmen notları, dünya ayarları).

### Nokta'nın Çarşısı · MAT.5.1 Sayılar ve Nicelikler

[oyunlar/carsi.html](oyunlar/carsi.html)

1. **Gözlemevi** (MAT.5.1.1): Güneş’e uzaklığı sağdan üçer üçer bölüklere ayır, doğru okunuşu seç; okunuşu verilen sayıyı rakam çarklarıyla yaz; 000 bölüğü.
2. **Otogar** (MAT.5.1.2): gezi için toplam kişi, bölme (bölüm ve kalan), kalanı yorumlama (bir otobüs daha), otobüsleri doldurarak kontrol.
3. **Pastane** (MAT.5.1.3) ve 4. **Pazar** (MAT.5.1.4): aşağıdaki kesir istasyonları.

Çarşıda 5 sayı saklı (sayı avı). Metinler `js/carsi-metinleri.js` içinde.

### Nokta'nın Kasabası · MAT.5.3 Geometrik Şekiller

[Polen'in Vadisi](https://github.com/hakanatas/polen-vadisi)'nden esinlenen bir **gözlem ortamı**: [oyunlar/kasaba.html](oyunlar/kasaba.html). Puan yok. Nokta'nın rehberliğinde kasabada gezilir; her noktada gözlem, “Sence?” tahmini, yakından inceleme ve görevler var. Gözlemler deftere yazılır, rapor indirilir.

1. **Tren İstasyonu** (MAT.5.3.1–5.3.2): paralel raylar, dik travers (en kısa yol), iki noktadan tek doğru, döner platformla çember.
2. **Saat Kulesi** (MAT.5.3.3): akrep ve yelkovanı çevir, açıölçerle ölç.
3. **Kavşak** (MAT.5.3.4): sokakları döndür; ters açılar, dik ve paralel sokaklar.
4. **Çini Atölyesi** (MAT.5.3.5–5.3.6): doğrulardan çokgen çini, düzgün çokgen, köşegen, boşluksuz döşeme.
5. **Köprü** (MAT.5.3.6): üçgen neden sağlam, iç açılar toplamı 180°.
6. **Çeşme Meydanı** (MAT.5.3.7): iki taşın halkalarından ölçmeden üçgen.
- **Pastane** (MAT.5.1.3, Çarşı'da): siparişi tepside dilimle göster, denk kesir; ölçü kaplarında tam sayılı kesir ve sayı doğrusu; yüzlük kartta kesir, ondalık ve yüzde.
- **Pazar** (MAT.5.1.4, Çarşı'da): “paydası büyük olan büyüktür” iddiasını şeritlerle çürüt, denk kesir; dört farklı gösterimi sayı doğrusunda sırala.

Ayrıca: şekil avı (8 saklı şekil, ikisi hareketli), sabah/akşam/yağmur, ortam sesleri (kuşlar, cırcır böceği, yağmur, çeşme, tren düdüğü, iki dakikada bir kule çanı; yaklaştıkça yükselir), öğretmen notları, sunum modu (P), tanıtım. Bütün metinler `js/kasaba-metinleri.js` içindeki `KASABA_METINLERI` nesnesinde. Telefonda araç düğmeleri “☰ menü”de toplanır; kasabada gezinirken istasyon kartı ince bir şeride iner.

## Benim ilerlemem

[ilerleme.html](ilerleme.html): oyun yıldızları ve kasaba gözlemleri (tahminler, görevler, notlar, şekil avı) tek sayfada. Öğrenci adını yazıp yazdırabilir; paylaşılan bilgisayarda kayıtlar buradan silinir. Kayıtlar yalnızca o tarayıcıda saklanır.

## Klavye ve sunum kumandası

Bütün oyun tahtaları klavyeyle oynanır: tahtaya odaklanıp ok tuşlarına basınca sanal imleç çıkar; boşluk/Enter tutar ve bırakır, Shift hızlı, Alt ince adım, Esc bırakır. Kasabada 1–6 istasyon, ←/→ gezinme, PageUp/PageDown (sunum kumandası) önceki/sonraki istasyon, Z yakından incele, P sunum modu.

## Çalıştırma

Kurulum gerekmez. `index.html` dosyasını tarayıcıda açmanız yeterli; internet olmadan da çalışır (yazı tipleri internet yoksa yedek yazı tipine düşer). GitHub Pages için depo kökünden yayımlayabilirsiniz.

## Yapı

```
index.html            ana sayfa: sınıf → tema → oyun (Nokta'nın Filmleri düzeni)
css/oyun.css          ortak mürekkep stili (kâğıt, siyah mürekkep, kehribar)
js/ortak.js           tuval, geometri, el çizimi mürekkep, canlı Nokta karakteri, konuşma, puan, ses, yıldızlar
js/<oyun>.js          her oyunun kuralları
oyunlar/<oyun>.html   oyun sayfaları
img/                  Nokta ve oyun önizlemeleri (oyunların ?onizleme görünümünden)
```

Yeni bir oyun eklemek için `oyunlar/` altındaki bir sayfayı kopyalayın, yeni bir `js/<oyun>.js` yazın ve oyunu `index.html` içindeki `GAMES` listesine ekleyin.

Kaynak: MEB Türkiye Yüzyılı Maarif Modeli, Ortaokul Matematik Dersi Öğretim Programı (tymm.meb.gov.tr).
