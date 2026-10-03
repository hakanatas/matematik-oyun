/* Çok oyunculu ayarlar. Kurulum adımları: COK-OYUNCULU.md
   1) okulAlanAdi: yalnız bu alan adındaki Google okul hesapları girebilir (ör. 'okulum.k12.tr').
      Aynı alan adını firebase/database.rules.json içine de yazın.
   2) firebase: Firebase konsolundaki web uygulaması ayarlarını buraya yapıştırın.
   Ayarlar boşsa sayfa "test modu"nda açılır: aynı bilgisayardaki sekmeler birbirini görür. */
window.COK_AYAR = {
  okulAlanAdi: '',
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    appId: '',
  },
  // Hazır mesajlar: öğrenciler yalnız bunları gönderebilir (veritabanına yalnız sıra numarası yazılır).
  // En çok 24 mesaj; sırayı değiştirmek eski mesajların anlamını değiştirir, sona ekleyin.
  mesajlar: [
    'Merhaba! 👋', 'Görüşürüz!', 'Teşekkürler!', 'Aferin! 👏',
    'Buraya gel!', 'Beni bekle!', 'Hadi sonraki istasyona!', 'Ben buradayım!',
    'Bence dik açı (90°)', 'Bence dar açı', 'Bence geniş açı', 'Bunlar paralel!',
    'Bunlar kesişiyor!', 'İç açılar 180°!', 'Yarıçaplar eşit!', 'Bu bir çember!',
    '😀', '🤔 Düşünüyorum…', '😮 Vay!', '🎉',
    'Yardım eder misin?', 'Ben yaptım!', 'Bir daha deneyelim!',
  ],
};
