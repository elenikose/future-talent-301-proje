# **MVP KAPSAM DÖKÜMANI (MVP Scope Document)**

## **Proje Adı: Son Çağrı (Project LastCall)**

* **Sürüm:** v1.0 (Kilitlenmiş Kapsam)  
* **Durum:** ONAYLANDI / DONDURULDU  
* **Yazar:** Teknik Product Owner  
* **Gizlilik:** Şirket İçi (Internal)

## **1\. MVP Stratejisi ve Sektörel Gerçekler**

Bu dokümanın temel amacı, **Son Çağrı (Project LastCall)** uygulamasının ilk sürümünü (Faz 1 \- MVP) 6 haftalık pazara çıkış (Time-to-Market) hedefi doğrultusunda sınırlandırmaktır.

### **Kritik Sektörel Analiz (TPO Gözünden Eleştiri):**

Gıda israfı ve kiler takip uygulamalarının piyasadaki en büyük başarısızlık sebebi **"kullanıcı sürtünmesidir" (user friction)**. Kullanıcılardan evlerindeki her gıdayı manuel olarak girmelerini beklemek ütopiktir. MVP kapsamında bu sürtünmeyi tamamen çözemediğimizin farkındayız (OCR ve barkod tarama Faz 2'ye bırakılmıştır). Bu nedenle MVP'nin başarısı, manuel kiler girişini ne kadar akıcı hale getirdiğimiz ve karşılığında sunduğumuz yapay zeka destekli tarif/tasarruf dopamininin bu zahmete değip değmediği ile ölçülecektir.

## **2\. Detaylı Fonksiyonel Kapsam Matrisi**

Yazılım, tasarım ve test ekiplerinin kapsam kayması yaşamasını önlemek adına kural nettir: **Burada tanımlanmayan hiçbir özellik MVP sürümünde kodlanmayacaktır.**

| Modül / Epik | MVP Kapsamında (In-Scope) | MVP Dışı / Sonraki Fazlar (Out-of-Scope) |
| :---- | :---- | :---- |
| **Kullanıcı Yönetimi (Auth)** | \- E-posta/Şifre ile kayıt ve giriş. \- Supabase Auth JWT altyapısı. \- Şifre sıfırlama akışı. \- Çıkış yapma ve oturum kontrolü. | \- Google, Apple ID ile tek tıkla giriş. \- Telefon numarası ve SMS (OTP) ile doğrulama. \- Profil fotoğrafı yükleme ve hesap özelleştirme. |
| **Kiler Yönetimi (Pantry)** | \- global\_ingredients tablosundan malzeme arama (300ms Debounce kısıtlı). \- Manuel SKT (Son Tüketim Tarihi) seçimi. \- Acil Tüketilmeli (is\_urgent) bayrağı yönetimi. \- Kilerden malzeme silme / tüketildi işaretleme. | \- Fiş, fatura veya buzdolabı fotoğrafı tarayarak otomatik malzeme ekleme (OCR). \- Barkod tarayıcı (Barcode Scanner) entegrasyonu. \- Miktar/Birim takibi (Örn: "3 adet yumurta", "200 ml süt"). |
| **Yapay Zeka Motoru (AI)** | \- En az 1, en fazla 7 malzeme seçimi. \- Gemini API entegrasyonu. \- Katı Pydantic şema doğrulaması (LLMRecipeSchema). \- Gastronomik uyumsuzluk filtresi (is\_compatible: false). | \- Kullanıcının diyet/alerji tercihine göre (Vegan, Gluten-free) filtreleme. \- Tarif adımlarını sesli okuma (Text-to-Speech). \- Üretilen tarifin porsiyon miktarını dinamik değiştirme. |
| **Tasarruf Ledger (Metrics)** | \- "Yemeği Yaptım" tetiklemesi. \- Kurtarılan gıda ağırlığı (gram) ve engellenen ![][image1] (![][image2]) kaydı. \- user\_savings\_ledger tablosuna atomik (ACID) yazım. \- Ana sayfada kümülatif toplam sayacı. | \- Haftalık/Aylık PDF analitik rapor çıktısı. \- Sosyal medyada (Instagram Stories, Twitter) paylaşım butonları. \- Dijital rozet, başarı basamakları ve liderlik tablosu (Leaderboard). |
| **Bildirimler (Notifications)** | \- Sistem içi statik uyarılar (Kiler ekranında kırmızı alarm simgeleri). | \- Mobil anlık bildirimler (Push Notifications \- Firebase Cloud Messaging). \- Haftalık israf özet e-postaları. |

## **3\. Teknik Altyapı, Sınırlar ve Kısıtlar (Technical Stack Constraints)**

Uygulamanın çalışacağı ücretsiz bulut katmanlarının sınırları, backend mimarisini doğrudan etkilemektedir:

1. **FastAPI Gateway (Render.com Ücretsiz Katman):**  
   * Sunucu 15 dakika boyunca istek almazsa otomatik olarak "uyku" (idling) moduna geçer.  
   * İlk istekte (Cold Start) sunucunun uyanması **30 ila 50 saniye** sürebilir.  
   * *Teknik Çözüm:* Ön yüz açılışında asenkron /api/v1/health check atılacak ve sunucu uyanana kadar kullanıcı arayüzü kilitlenerek şık bir loading/skeleton ekranı gösterilecektir.  
2. **Supabase PostgreSQL:**  
   * Eşzamanlı bağlantı havuzu (connection pool) limiti ücretsiz katmanda **60** ile sınırlıdır. Gereksiz açık bağlantılar (open connections) derhal kapatılmalıdır.  
   * Satır Bazlı Güvenlik (RLS) politikaları en baştan sıkı tutulmalıdır.  
3. **Gemini 1.5 Flash API:**  
   * Ücretsiz katman limitleri saniyede maksimum **15 istek (RPM)** ve günlük sınırlara tabidir.  
   * *Teknik Çözüm:* Kullanıcının "Tarif Üret" butonuna üst üste basmasını engellemek için ön yüzde **10 saniyelik tıklama kilidi (throttling)** uygulanacaktır.

## **4\. MVP Kritik Başarı ve Canlıya Çıkış Eşikleri (Release Gates)**

Uygulamanın mağazalara veya beta test gruplarına (TestFlight) çıkabilmesi için aşağıdaki 3 eşikten sıfır hata ile geçmesi gerekir:

* **Eşik 1: Sıfır Kritik Hata (Zero Blocker Bugs):** Uygulamanın çökmesine (crash), donmasına veya veri tabanında tutarsızlığa yol açan hiçbir hata kabul edilmeyecektir.  
* **Eşik 2: Katı Yapay Zeka Validasyonu:** Gemini API'den dönen yanıtların backend'deki Pydantic şemasıyla doğrulanma başarısı **%98**'in üzerinde olmalıdır. Yapay zeka saçmalarsa (bozuk JSON) sistem kullanıcıya kibarca hata dönmeli ve çökmek yerine asenkron olarak loglamalıdır.  
* **Eşik 3: Çekirdek Akış Testi:** Bir kullanıcının sıfırdan kayıt olup, kiler araması yapıp, malzeme ekleyip, o malzemelerden tarif üretip "Yemeği Yaptım" diyerek envanter düşürmesine kadar olan **"Happy Path"** akışı kesintisiz çalışmalıdır.

## **5\. Risk ve Azaltma Matrisi (Risk Mitigation)**

| Tanımlanan Risk | Olasılık / Etki | Teknik Önlem ve Çözüm |
| :---- | :---- | :---- |
| **Kullanıcının Manuel Girişten Sıkılması** | Yüksek / Yüksek | Arama debounce süresi 300ms'ye çekilecek, lokal cache aktif edilecek ve ilk 5 popüler malzeme arama yapılmadan listelenecektir. |
| **Gemini API Gecikmesi (Latency)** | Orta / Yüksek | İstek süresince kullanıcıya dinamik loading copy'leri ("Malzemeler koklanıyor...", "Gastronomik riskler eleniyor...") gösterilerek bekleme hissi azaltılacaktır. |
| **Tasarruf Skorunun İstismar Edilmesi** | Orta / Düşük | Kullanıcının sürekli "Yemeği Yaptım" butonuna basarak yapay veri üretmesini engellemek için aynı tarife günde sadece 1 kez onay hakkı backend seviyesinde kısıtlanacaktır. |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAXCAYAAACBMvbiAAACtklEQVR4Xu2WOWiUQRTHN0RBwQOPVbPXfHvgsiBoWLDwLhQETRNBhNgJ2gSLgAqC4IFY2KlVGrXQItiICCmCBCwiplEwjZhC0TKIAQuPGH9vZ0ZfXtZNGi/IHx7fzPv/38yb+0ulFvAfo61UKm10zl3GnhUKhTfYYLFY3CUcvnO5XG61DYqoVCor0AxJnMQnSXKBb4fVzYmQxAj2lUZu890mDZHIZr4P6OAK3ztI22wsCS6FPw0/kc/nM7ja8VVo5z6+j9gBG9MKMurPMqpsNpuzJL41NPwUO2E5fBskDhvHapqTJGUg2HusU3NNwci3iphGE8tpMPKuTCazNtbr9fpi4vqxabijWqsBVw+zM6bjZ0FlPm05C0mGzyJV30fclMyYzJySzoBK5rVrtX9oaD+Cb9hby1mQeFaVZY8MyiBo47ySzQK6vaGP1slAXpMGsXuWawX0NWwC+0JnOyyvgaYv9DGKdpXlG0in08sQDAdhn+VbAX13iBtnz623fASztgTNw6C9kWpyEhuA7HB+6mQDyn74JWTjydrHOuUzoYNhGZTWanDMNzl/kj5R3hn91GskukeSbThkynCOzicZNL36WEt5HsnIdXEp6Abk9ImT+2wl/R3Hd9b5pe5uiHHeDOKeme38RLlcXieN6ftHbcrH1Wp1udZHwHU6f2W8ZCld9FM/4sJGdv6mH4tEPE0DUawR7pLr2CHtDwm+kM5kKTQnkCcD7pHwco9pjoEcxlcN5S40kw1CX1xU23VQaPAu1ptqsvEkQWyKBm/JUY9+Bpg4v/yvKG7RMRbOz8yTH45w8V3F3iX+TepP/JsyQkfbVayFLPNBdB+kY8on+fZgk9gpnWAzyNuF7jl97bbcHwVJXHThHZvrnvqtkK0hx9z5PwJ5F+X++Tug82POn+BoQ1azgH8S3wG+38PADnrO1gAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAXCAYAAADpwXTaAAAB4UlEQVR4XuWTvUtkMRTFZ1BB0ULUcWC+MuNUVhbDCrIrImgrYmNpYeEfICqIrYWtnWKjhRZrp1a7xbKFhZ2FaCNYCIIggjCCiB+/817eM6YQX2XhhUNuTu49yb1JUqnvZblcrqtcLo8bY6YZy/56IiuVSqMIbYF6pVLJ+uuJrVAo5BG7wG301xIbQovg0ecTG21qRujAnizi2vP5fCdu+i0ytoZqtdotyH+3Qs96ELqSYDabbUVoDX8fnOpS3gUjDncOftuYbbAXryI2AvHMuMC4XiwWfzAugRdxntAs3E87b2S+obg4woT9euZEk4y94vBX8K+53b4oDpEaXD3llG5z74OJ068XJbuBnukUO9o0Ipzck4CgyQUmlyz8N2Fph+JiCWt6fybs1WXEOb3ejYi4X5rjP4BV+do5k8m02bigRPDXEQtyiZuJCDX9kfGXFbuLxBjnuIwx+U4Fm1Yrbfsa56oPu+BCPyAS0wZ6Y0p0vldwc3BH+A340+AJnOhvu33YUbAVWwdn4A+YsEKBsWGHYm3OKrgxYb8SfcE05Q6SOCxfBP4yqKuXXuzHRtKACS/mWOVTUT/+raqo1WpNfvyHRlKvCZ/AP3o2pfI40Txlt/ixnzKdQJeE2FDi03ypvQJQ9ogWGm+VuQAAAABJRU5ErkJggg==>