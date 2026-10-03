/* Çok oyunculu ayarlar. Kurulum adımları: COK-OYUNCULU.md
   1) okulAlanAdlari: yalnız bu alan adlarındaki Google okul hesapları girebilir.
      ogretmenAlanAdi: bu alan adıyla girenler öğretmen sayılır (oda açabilir).
      Alan adları firebase/database.rules.json içinde de yazılıdır; değiştirirseniz orayı da değiştirin.
   2) firebase: Firebase konsolundaki web uygulaması ayarlarını buraya yapıştırın.
   Ayarlar boşsa sayfa "test modu"nda açılır: aynı bilgisayardaki sekmeler birbirini görür. */
window.COK_AYAR = {
  okulAlanAdlari: ['alkev.k12.tr', 'stu.alkev.k12.tr'],
  ogretmenAlanAdi: 'alkev.k12.tr',
  firebase: {
    apiKey: 'AIzaSyDIKOkrnhdFJya3b359qwZVdIsbKMt2GR8',
    authDomain: 'matematik-oyun.firebaseapp.com',
    databaseURL: 'https://matematik-oyun-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'matematik-oyun',
    appId: '1:752138991627:web:a7ff70962bfdc5c20a6f0e',
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
