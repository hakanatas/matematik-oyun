# Birlikte Kasaba (çok oyunculu deneme)

`oyunlar/kasaba-cok.html`: öğrenciler **okul Google hesabıyla** girer, öğretmenin açtığı **sınıf odasına** kodla katılır, aynı kasabada birbirini görerek dolaşır ve **hazır mesajlarla** konuşur.

## Güvenlik

- **Yalnız okul hesapları:**
  - Google giriş penceresi yalnız okul alan adını önerir.
  - Sayfa başka hesapları geri çevirir.
  - Veritabanı kuralları, başka alan adındaki hesapların hiçbir şeyi okumasına ya da yazmasına izin vermez.
- **Serbest yazı yok:**
  - Veritabanına bir mesajın yalnız sıra numarası yazılır (0–23).
  - Mesaj metinleri `js/cok/ayar.js` içindedir.
  - Kurallar başka bir şeyi kabul etmez.
- **Ad:**
  - Ekranda ad ve soyadın baş harfi görünür, örneğin “Ayşe Y.”.
  - Veritabanındaki ad, Google hesabındaki addan başka olamaz.
  - Kimse başkasının adını kullanamaz.
- **Odalar:**
  - Odayı yalnız öğretmen listesindekiler açabilir.
  - Öğrenci yalnız açık bir odaya, kodla girer.
  - Odadan çıkan ya da sekmesini kapatan öğrenci listeden hemen silinir.

## Kurulum (yaklaşık 10 dakika)

1. **Proje oluşturun.** <https://console.firebase.google.com> adresinde okul hesabınızla **Proje ekle**’ye tıklayın, örneğin adı `nokta-oyunlari` olsun. Google Analytics gerekmez.
2. **Google ile girişi açın.**
   - **Build → Authentication → Get started → Sign-in method → Google**’ı etkinleştirin.
   - **Settings → Authorized domains** bölümüne sitenin adresini ekleyin: `hakanatas.github.io`.
3. **Veritabanını oluşturun.**
   - **Build → Realtime Database → Create database** yolunu izleyin, konum olarak **europe-west1** seçin.
   - **Rules** sekmesine `firebase/database.rules.json` dosyasının içeriğini yapıştırın.
   - Dosyadaki bütün `OKUL_ALAN_ADI` yazılarını kendi alan adınızla değiştirin, örneğin `okulum.k12.tr`, ve **Publish**’e basın.
4. **Öğretmenleri ekleyin.**
   - Realtime Database’in **Data** sekmesinde kökte `ogretmenler` adlı bir düğüm açın.
   - Her öğretmen için bir anahtar ekleyin. Anahtar, e-postadaki noktalar virgülle değiştirilmiş hâlidir; değeri `true` olsun.
   - Örnek: `hakan@okulum.k12.tr` → `hakan@okulum,k12,tr` : `true`
5. **Web uygulamasını kaydedin.**
   - **Proje ayarları → Genel → Uygulamalarınız → Web (</>)** yolunu izleyin.
   - Çıkan `firebaseConfig` değerlerini (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`) `js/cok/ayar.js` dosyasına yapıştırın.
   - Aynı dosyada `okulAlanAdi` değerini de doldurun.

Bu değerler gizli değildir; sitede herkese açık durur. Güvenliği 3. adımdaki kurallar sağlar.

## Sınıfta kullanım

1. Öğretmen `kasaba-cok.html` sayfasını açar, okul hesabıyla girer, **Oda aç**’a basar (örneğin “5-A”) ve çıkan **kodu** tahtaya yazar.
2. Öğrenciler aynı sayfayı açar, okul hesabıyla girer ve kodu yazar. `kasaba-cok.html?oda=KOD` bağlantısı da doğrudan odaya götürür.
3. Herkes kasabayı kendi hızında gezer.
   - Sağdaki listede kimin hangi istasyonda olduğu görünür; **→** ile bir arkadaşın yanına gidilir.
   - **💬 Mesaj** düğmesi hazır mesajları açar.

## Test modu

`js/cok/ayar.js` boşken ya da adrese `?yerel` eklenince sayfa sunucusuz **test modu**nda açılır. Bu modda aynı tarayıcıdaki sekmeler birbirini görür ve örnek kişilerle giriş yapılır. Öğretmen olarak denemek için “Öğretmen …” kişisini seçin.

## Sonraki adımlar

- Çok oyunculu oyunlar ve izleyici modu: örneğin açı düellosu, kesir yarışı.
- Öğretmen paneli: odayı kapatma, herkesi bir istasyona çağırma, sessize alma.
