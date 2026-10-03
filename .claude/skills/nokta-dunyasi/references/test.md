# Test: rehberi izleyen öğrenci

Playwright (`require('/opt/node22/lib/node_modules/playwright')`, Chromium kurulu) ile yerel sunucu: `python3 -m http.server 8765`.

1. Sayfayı `?tanitimsiz&test` ile aç: motor `window.__rehber()` verir → `{ sid, tid, done, how, pt, sel, … }`.
2. Döngü: `done` ise `#gNext`’e bas; `pt`/`how` varsa tahtada o noktaya dokun (900 × 600 → ekran: `bx.x + x * bx.width / 900`); `sel` varsa o öğeye bas; seçenekli görevlerde düğmeleri sırayla dene.
3. Her istasyonda `#zside .tasks li.ok` sayısı görev sayısına eşit olmalı; takılırsa `stuck` yazdır, ekran görüntüsü al.
4. Ekran görüntülerine **bak** (Read): yazı çakışması, tahtadan taşan öğe, okunmayan etiket.
5. Telefon: 390 × 844, `isMobile: true`; masaüstü 1400 × 860.
6. Konsol hatalarını topla (yazı tipi yükleme hatalarını yok say).
