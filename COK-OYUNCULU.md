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

## Kurulum

Girebilecek hesaplar:
- `@alkev.k12.tr` hesapları öğretmen sayılır ve oda açabilir.
- `@stu.alkev.k12.tr` hesapları öğrencidir.
- Başka hiçbir hesap giremez.

Bu alan adları `js/cok/ayar.js` ve `firebase/database.rules.json` dosyalarında hazır yazılıdır.

1. **Google ile girişi açın.** Firebase konsolunda soldan **Build → Authentication** yolunu izleyin.
   - **Get started**’a, sonra **Sign-in method** sekmesinde **Google**’a tıklayın.
   - **Enable**’ı açın, destek e-postasını seçin ve **Save**’e basın.
   - Aynı sayfada **Settings → Authorized domains → Add domain** ile `hakanatas.github.io` ekleyin.
2. **Kuralları yapıştırın.** **Build → Realtime Database → Rules** sekmesini açın.
   - Oradaki her şeyi silin.
   - `firebase/database.rules.json` dosyasının içeriğini olduğu gibi yapıştırın ve **Publish**’e basın.
3. **Web uygulamasını kaydedin.** Sol üstteki ⚙️ → **Project settings** → **General** sekmesini açın.
   - En altta **Your apps** bölümünde **</>** (Web) simgesine tıklayın.
   - Bir ad verin, örneğin “nokta”, ve **Register app**’e basın.
   - Çıkan kutudaki `firebaseConfig = { … }` bölümünü kopyalayın ve `js/cok/ayar.js` içindeki `firebase` alanına yazın.
   - Bu değerler gizli değildir. Güvenliği 2. adımdaki kurallar sağlar.

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
