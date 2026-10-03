# Görsel dil: kâğıt üstünde mürekkep

## Renkler
| Ad | Değer | Kullanım |
|---|---|---|
| Kâğıt | `#f1eadc` (`--paper`), kart `#fffaf0` (`N.SHEET`) | zemin, kartlar |
| Mürekkep | `#171411` (`N.INK`), yumuşak `rgba(23,20,17,.62)` | çizgiler, yazı |
| Kehribar | `#e8a33d` (`N.AMBER`), koyu `#b8741a` (`N.DEEP`), yıkama `rgba(232,163,61,.18)` | ölçüm, ipucu, vurgulanan seçim, rehber işareti |
| Mühür kırmızısı | `#c4432b` (`N.SEAL`) | uyarı, karşı örnek, “kalan”, rehber oku |
| Ek | çini mavisi `#2f5d8a`, turkuaz `#3f8f8a`, yaprak `#87a074`, tuğla `#b65a3f`, gece `#1f2a44` | dünya ayrıntıları |

Kural: **siyah = çocuğun çizdiği/gerçek**, **kehribar = ölçüm ve yol gösterme**, **kırmızı = dikkat**.

## Yazı tipleri
- `Caveat Brush` — başlıklar, tahta yazıları, Nokta’nın sözleri (el yazısı sıcaklığı).
- `Fraunces` — gövde metni.
- `JetBrains Mono` — sayılar, kodlar, küçük etiketler (MAT.5.3.3 gibi).
Google Fonts tek satır: `family=Caveat+Brush&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=JetBrains+Mono:wght@500`.

## El çizimi (assets/murekkep.js)
- `inkPoly(noktalar, { fill, w })`: dolgu kesin, kenar **titrek** çizilir; köşelerde 1,5 px taşma ve yanında %35 saydam ikinci “kalem izi”. Titreme **sabit gürültüyle** (`N.nz`) üretilir: kareden kareye kıpırdamaz.
- `inkCircle`, `inkLine`, `rectPts`.
- `hatch(alan, { gap, alpha })`: ışık **soldan** gelir; nesnelerin **sağ** yüzü, çatıların sağ eğimi, saçak altı taranır.
- `groundShadow(x, genişlik)`: yere yassı, yumuşak gölge (sağa kayık).
- Ayrıntı katmanları: pencere camında iki beyaz yansıma çizgisi, denizlik, saçak altı koyu şerit, kapıda panolar ve kehribar tokmak, ağaç tepesinde açık üst-sol/koyu alt-sağ.
- Oyun tahtalarında (N.d): ana çizgi **tam doğru** kalır (ölçüm bozulmaz), yanına silik ikinci iz eklenir; kesikli yardımcı çizgilere iz eklenmez.

## Dünya
- Yan kaydırmalı, **paralaks**: gökyüzü (0,05), bulutlar (0,15), kuş sürüsü (0,2), uzak tepeler/cami/değirmen (0,3), arka sıra evler (0,6), ana katman (1), ön çimen (1,15).
- Hava: **sabah / akşam / yağmur** (renk paleti, pencereler yanar, fener ışıltısı, ateş böcekleri, yağmur çizgileri, su halkaları).
- Ana katmanda yalnız görünen kısmı çiz; çizgi/tarama döngülerini görünür aralıkla sınırla (60 fps hedefi).

## Nokta karakteri
- Yumurta gövde (radyal gradyan, benekler, sağ altta tarama), çöp bacaklar ve kollar, üç tel saç, nokta gözler.
- Durumlar: yürür (bacak/kol salınımı, yöne bakar), **göz kırpar** (her ~4 sn), **sevinir** (kollar yukarı, ∩ gözler, kehribar kıvılcımlar), **üzülür** (kaşlar çatık, ağız ters).
- Konuşma balonu: kart rengi, 2,5 px mürekkep kenar, üçgen kuyruk, fırça yazı, 210 px’te sarar.
- Arayüzdeki `<img src="nokta.png">` kendiliğinden canlı karaktere döner (`N.avatar`); `hop` sınıfı sevinç, `shake` üzüntü.
