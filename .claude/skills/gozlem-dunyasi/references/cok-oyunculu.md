# Çok oyunculu katman (isteğe bağlı)

Ayrıntılı kurulum: depodaki `COK-OYUNCULU.md`.

- **Firebase**: Google ile giriş (yalnız okul alan adları; `hd` + istemci kontrolü + veritabanı kuralları), Realtime Database.
- **Odalar**: öğretmen alan adındaki hesap oda açar, öğrenci kodla girer; çıkanlar `onDisconnect` ile silinir.
- **Konum**: her 250 ms değiştiyse `{x, tx, yon, z}`; diğerleri ara değerle yürür, aynı yerde duranlar yan yana dizilir.
- **Sohbet**: yalnız hazır mesajlar; veritabanına yalnız sıra numarası (kurallar `0 ≤ m < 24`).
- **Ad**: ekranda “Ad S.”; kurallar adın Google adıyla aynı olmasını ister.
- **Hareket**: ← → / A D, ◀ ▶ düğmeleri, yere dokunma; zıplama boşluk/↑ (z sayacı ile arkadaşlara iletilir).
- **Etkileşim**: zıplayınca yakındaki nesneler tepki verir; yakında ise “⤒ zıpla: …” ipucu.
- **Test modu**: Firebase yokken BroadcastChannel ile aynı tarayıcıdaki sekmeler.
- Kurallarda yeni bir alan eklenirse kuralların Firebase’de **yeniden yayımlanması** gerekir; yoksa konum güncellemesi de reddedilir.
