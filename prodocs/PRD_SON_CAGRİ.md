# **SON ÇAĞRI (Project LastCall)**

### **Sürdürülebilir GreenTech Mobil Uygulama Projesi \- Faz 1 MVP**

**Kurumsal Seviye Ürün Gereksinim Dokümanı (PRD)**

## **Doküman Bilgileri**

* **Sürüm:** v2.0 (Production-Ready)  
* **Durum:** ONAYLANDI (Ready to Code)  
* **Yazarlar:** Teknik Product Owner Ekibi  
* **Hedef Kitle:** Lead Architects, Frontend & Backend Developers, QA Engineers  
* **Gizlilik Derecesi:** Şirket İçi / Gizli

## **1\. Giriş ve Ürün Vizyonu**

Dünya genelinde üretilen gıdaların yaklaşık üçte biri tüketilemeden çöpe gitmektedir. Bu durum hem ciddi ekonomik kayba hem de küresel ısınmayı tetikleyen sera gazı emisyonlarına doğrudan sebebiyet verir. Gıda israfının en kritik, müdahale edilmesi en elzem aşaması ise; gıdaların son tüketim tarihlerinden (SKT) hemen önceki son 24-48 saatlik zaman dilimidir.

**Son Çağrı (Project LastCall)**, adını bu kritik zaman eşiğinden alan, kullanıcıların kilerlerindeki son demlerini yaşayan malzemeleri yapay zeka desteğiyle analiz ederek; gastronomik açıdan güvenli, hızlı ve optimize edilmiş "kurtarma" yemek tarifleri üreten bir GreenTech mobil uygulamasıdır.

Bu doküman, "Son Çağrı" markası altında hayata geçirilecek olan kullanıcı senaryolarını (User Stories), kabul kriterlerini (Acceptance Criteria), fonksiyonel olmayan gereksinimleri (NFR) ve kalite güvence (QA) standartlarını teknik ve fonksiyonel açıdan eksiksiz şekilde tanımlar.

## **2\. Kullanıcı Personası ve Empati Haritası**

### **2.1 Persona Profil Kartı: Derin (31, Kıdemli Pazarlama Müdürü, Yalnız Yaşıyor)**

* **Demografi:** Kentte yalnız yaşayan, yoğun çalışma temposuna sahip, mutfak planlamasına vakit ayıramayan beyaz yakalı.  
* **Davranış Alışkanlıkları:** Pazar günleri toplu market alışverişi yapar. Hafta içi anlık planlarla dışarıda yemek durumunda kaldığında evdeki taze gıdaları unutur. Hafta sonu geldiğinde kilerdeki et ve sebzelerin bozulduğunu fark eder.  
* **Temel Problem:** Gıdaları çöpe atarken hissettiği çevreye karşı yoğun suçluluk psikolojisi ve mali kayıp.  
* **Çözüm İhtiyacı:** Dolabı açtığında elindeki malzemeleri tek tek düşünmeden, saniyeler içinde pişirebileceği biyokimyasal açıdan güvenli bir tarife hızla ulaşmak.

## **3\. Ürün Kapsam Yönetimi ve MVP Sınırları**

Yazılım ekibinin odaklanmasını sağlamak ve pazara çıkış süresini (Time-to-Market) optimize etmek adına MVP sınırları katı bir şekilde çizilmiştir. Tablo 1'de belirtilen kapsam sınırlarının dışına hiçbir koşulda çıkılmayacaktır.

### **Tablo 1: Son Çağrı Faz 1 MVP Kapsam Matrisi**

| Kapsam İçi (MVP Öncelikli) | Kapsam Dışı (Sonraki Fazlar) |
| :---- | :---- |
| E-posta ve Supabase ile Kimlik Doğrulama (Auth) | Sosyal Medya Entegrasyonları (Google, Apple Sign-In) |
| Manuel malzeme arama ve kiler envanterine ekleme | Fiş/Fatura tarama veya kamera ile otomatik kiler doldurma (OCR) |
| SKT ve dinamik aciliyet durumu takibi | Kiler azaldığında entegre marketlerden otomatik sipariş |
| Gemini LLM ile tek tıkla doğrulanmış tarif üretimi | Tariflerin sosyal medyada paylaşımı veya topluluk akışı |
| Karbon ayak izi ve ağırlık tasarrufu loglama (Ledger) | Gelişmiş oyunlaştırma, rozetler ve liderlik tablosu |

## **4\. Detaylı Kullanıcı Senaryoları (User Stories)**

### **US-01: Kiler ve Canlı Envanter Yönetimi**

**Bir Kullanıcı Olarak**, evimde bulunan malzemeleri kilerime ekleyebilmek, durumlarını (Mevcut/Tüketildi) yönetmek ve son tüketim tarihlerini girmek istiyorum; **böylece** elimdeki gıda stoğunu anlık olarak takip edebilirim.

#### **Kabul Kriterleri (Acceptance Criteria)**

* Kullanıcı arama barına en az 2 karakter girdiğinde global\_ingredients tablosundan arama sonuçları listelenmelidir (İstemci tarafında 300ms debounce uygulanmalıdır).  
* Veri kalitesini ve sürdürülebilirlik metriklerinin doğruluğunu korumak adına, kullanıcı sadece sistem kütüphanesinde tanımlı olan malzemeleri seçebilir. Serbest metin girişi ile malzeme ekleme engellenmiştir.  
* Malzeme eklenirken "Son Tüketim Tarihi" opsiyoneldir. Girilmediği takdirde sistem gıda kategorisine göre varsayılan bir SKT tanımlar.  
* Kullanıcı kilerindeki bir malzemeyi sağa kaydırarak veya "Tüketildi" butonuna basarak kiler envanterinden düşebilmelidir.

### **US-02: Yapay Zeka ile Akıllı Tarif Üretimi (Core Engine)**

**Bir Kullanıcı Olarak**, kilerimden seçtiğim spesifik malzemelerle hızlıca yemek tarifi üretmek istiyorum; **böylece** ne pişireceğimi düşünmekten ve malzemeleri israf etmekten kurtulurum.

#### **Kabul Kriterleri (Acceptance Criteria)**

* Kullanıcı tarif üretmek için kilerinden en az 1, en fazla 7 malzeme seçebilir.  
* "Tarif Üret" butonuna basıldığında arkada Gemini API tetiklenmeli ve en geç 15 saniye içinde yanıt dönmelidir. Sunucu uykuda ise kullanıcıya animasyonlu bir yükleme ekranı gösterilmelidir.  
* Yapay zeka, seçilen malzemelerin birbiriyle biyokimyasal veya gastronomik olarak uyumsuz olduğunu (Örn: Süt, Balık ve Çikolata kombinasyonları) tespit ederse tarif üretmeyi reddetmeli ve kullanıcıya esprili bir gıda güvenliği uyarısı dönmelidir (is\_compatible: false senaryosu).

### **US-03: Sürdürülebilirlik ve Tasarruf Takibi (Green Ledger)**

**Bir Kullanıcı Olarak**, yapay zekanın önerdiği yemeği pişirdiğimde kazancımı görmek istiyorum; **böylece** çevreye ve bütçeme sağladığım katkıyı somut olarak takip edebilirim.

#### **Kabul Kriterleri (Acceptance Criteria)**

* Üretilen tarifin altında **"Yemeği Yaptım / Kurtardım"** butonu yer almalıdır.  
* Kullanıcı bu butona bastığında, tarif için seçilen tüm malzemelerin kilerdeki statüsü otomatik olarak Consumed (Tüketildi) moduna geçmelidir.  
* Yapay zekanın hesapladığı gıda ağırlığı (gram) ve engellenen ![][image1] salınımı (![][image2]), kullanıcının geçmiş veri tabanına (user\_savings\_ledger) yeni bir satır olarak işlenmeli ve ana sayfadaki toplam tasarruf sayacı anlık olarak güncellenmelidir.  
* Tasarruf edilen toplam karbon miktarı aşağıdaki formüle uygun olarak hesaplanacaktır:

![][image3]*Burada ![][image4] kurtarılan malzemenin gram cinsinden ağırlığını, ![][image5] ise o gıda kategorisine ait küresel karbon emisyon katsayısını temsil eder.*

## **5\. Fonksiyonel Olmayan Gereksinimler (NFR)**

* **Performans:** Arama sonuçları listeleme süresi 200ms'nin altında olmalıdır. Yapay zeka tarif üretim süresi (LLM gecikmesi dahil) maksimum 12 saniye olmalıdır. Bu süreyi aşan durumlarda arayüz zaman aşımına düşmemelidir.  
* **Güvenlik:** Kullanıcı verileri ve kiler bilgileri Supabase Satır Bazlı Güvenlik (RLS) politikalarıyla korunmalıdır. Bir kullanıcı, kesinlikle başka bir kullanıcının kiler veya tasarruf verilerine API üzerinden erişemez.  
* **KVKK / GDPR Uyumu:** Kullanıcı hesabını silmek istediğinde (Unutulma Hakkı), user\_pantries tablosundaki verileri kalıcı olarak silinecek; ancak user\_savings\_ledger tablosundaki tasarruf miktarları anonimleştirilerek (Kullanıcı ID'si kaldırılarak) genel sistem istatistiklerini korumak amacıyla tutulacaktır.

## **6\. QA ve Otomasyon Test Senaryoları**

Geliştirilen uygulamanın kabul kriterlerine uyumluluğu, QA ekibi tarafından Tablo 2'de belirtilen test senaryoları ile otomatize edilecektir.

### **Tablo 2: QA Otomasyon ve Kabul Test Matrisi**

| Test ID | Senaryo Tanımı | Girdi (Input) | Beklenen Çıktı (Expected Output) |
| :---- | :---- | :---- | :---- |
| **TC-001** | Geçersiz Kombinasyon Filtresi | Malzemeler: \[Balık, Süt, Portakal\] | API is\_compatible: false döner, UI tarif adımlarını gizler ve ekranda uyarı gösterilir. |
| **TC-002** | Debounce Doğrulaması | 100ms arayla harf girilmesi | API'ye sadece tek istek gider (search\_query: "tav"). |
| **TC-003** | Veri Güvenliği Aşımı | Kullanıcı A'nın Token'ı ile B'nin kilerini silmek | API 403 Forbidden döner, işlem engellenir ve veri silinmez. |
| **TC-004** | Sunucu Uykusu Kurtarma | Sunucu kapalıyken uygulamanın açılması | Ön yüz /health kontrolü başarısız olur, skeleton ekranda kalır. |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAaCAYAAADFTB7LAAACoElEQVR4Xu2VO2gUURSGZ1kFBUFQV8m+ZnYXbSwsFi18oIWICoIQG0mjja6SSlARUgkWoohoIdhICi2CFkFEEYtUxs7GNIqgELESQTD4zPr92Ttw92RmN7HwAfPD4c49/zlzHnPunSDIkOEfQ71e3xCG4STyI4qiUdatyECtVtvEeh+5h9zGNGd9QQ7uFX7jsm82m0t530r259B/Ry5bh8VCAb4hT0qlUtmS6FbDtQl43HJKBm4E7kiQkDz6Fvys1S8KvGBQyalqy8VQJ6rV6najzqE74xKYl5xQLpdL8G/o7DrLLQg4buEFH6k0spwPbKaKxeIao1NhP5ExX++jUCisgJ+gkN2W6wuqWx525qttOQts7rIsifeNRmMtuhfI10qlssMz7YKX4AHL9QVN26vPg0xbzoJOh/4en2EVhjzrNRrqOjZTv5UgjtdcEHVnwaCwZfg8cL4XLO/D3QKfEua3N+LWuyCnLN8LOun4TDvffZb3oZMvO/+Q6FZAv5PRKAYph0vdG0Deyrlf++3hwL6J32eJnn3Oh2Yc/pFiBJ1EciR2gv15ZAh5jjxMGxFdEbdcF4YsGcMdhq5TGs8VMkMXNvtcDH0hknkcdk75oHTE28jze/RHYxv2E+xHu70dvEOSeE24S/h6HMCDOnHVFTdsOCEfdf4is7ong5TPCFdXwqxnLTcHl8BNBWKb9zk+zyr0d1wC8wLoVJPES/jX2K6P9e7quoJ8QU4GCb4OcZGpn3gO7oWXkHdqtRJmHWedpLJt1t4HdhF2T5EZbA+xvcjzB2Qs6ZfpQb/W0/jcUHxLJoKO7HFBDipwkF65hToROd9dmitrYCD7w0iL57ybw/3W6K/BNaClK0ZjQmHHUmfwT8O7ntpGUm+RDBky/K/4BWOzs5XKJXULAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAYAAACzdqxAAAAB5UlEQVR4Xu1UsUoDQRDNEQVBQVFjIHe5TS6VlcVhQFREULAQCxsrsUjhB4gKYmthGwQR0mhhCtOplRbWdhaijWAhCAERCwUREt/zdnWzCUI8sMqDx+3MzrydnZ0kEmnh3+C67rQQ4gB8Be/M/VBwHMeG6D1YMvdCAVVPQbSC77q5FwoQ3QA/IDxm7v0ZqVSqA6KnbAVbIn09tm33YWkZ4QrRTCYzwK+58Q1U6UH0keI8BNzD+gS8AXNGuIX4WT4yeAQegsfwLRpxtf31PK87mUwOw94Eq0bPLfhWwBf4R+nAusA4FLOsxQUQQX8r2FxAwi59WG/DV06n00MqDnu+CEZyJyJbJHPfWIyK+4LW36oUytYE/KAN+0VZwIxyytzrRCLRrwfXjRlOHoed55qHxmKxLhmnqj2Px+OdKl8eVN8GCgptzHh1JYzvKg6a4xoT4sB+gMi+ls6eNxxRXq8ktDGjMA/jqFEEdlyLLcB3KccwCjvXsA1MEsHYFJlIn+/77bBvwTNwXo/H4b2MBcsyL8/CVG4NOF4U032sSPX2N/B9Gva3CVjyUSe5Vk7YW3xULa45QGAEfAevZH/ZxizsZ/O2TQECgyL4yV/g6ksi+O9+QrVrZmzTYGWcHAhP4F3cUJW2EBqfOdGCNr0gDVgAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,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>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAYAAABCfffNAAAB9UlEQVR4Xu2TvYsTYRDGN3iCoiIicQn7mUQMInjFFtdoeWBjI3b2+heIoHCFYiHYCAZEwh0WKeyEI90VQQtBi/sHtDgQBXvtNP4edjdM3ssmEVII5oHh3XnmnY93ZtbzVvjnkKbpsSRJ7iLvkREylC6+1WpdiOP4Bfq3wvYT/rXxe4B8L2yfkIf1ev2km2MMgmVc+sF5ZortngLpdG3wt5CXWZYddW2HUCZBGq4N7rGSUP0ry/PS0/jtwKeWr0QQBCGBvrhJwjA8D/d1WhL0OxLLzYSCIwfNZnPd0Gtw3WIuI2SgWcjQbrcj9D7FnTX3Z0OzwOmj2lZyURRdJegz+BtFkmEx2Br3tsSbEPMhZwXB+Yp02nQcvYd+yczrXafTOSWO7+cLDdvC9/0TOO4R4Lp0ValqvbzqMskB0tDr7IsdHEFqLjmGBqvg6jPnNn0/J56ArST/V8okT7yKQNy9yVx9lx+DAPe1kpx9+1PJCe5z8Zqu9bFQ+7TWLj+BOP/pfnFuWr6cV5Kv8QdrK0EhmJNHyMC1TUA7z6Uen2uWN0l+JxUbRWG3sV2cm0RD1+a4PKiphciuts41ClocXnOZO/uubQIECLyKgfLKDbXE5S2Kdv/9ai8KDZxC3iLXSNR07UuB5sZL3pDgqVfRjaVgoRVe4f/BH8BnfvW+ty5ZAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAaCAYAAABYQRdDAAABmUlEQVR4Xu2UPUsDQRCGE4zgFwhqDMkdubsEa8EDwY8fIIggRCt/gI2VIGJrY2GnXRqx0CJoEWxTiE3AxsrSQrD3B/j5jO7JZnImQUEs8sLLbOadmdvdmU0i0cWfwPO8Onz2ff8YOwuzQRBMYi/y+fwe9hyeEJrUuXFIkrRKQs1xHFeL+Eb50DX6G3Zd67EguARfCoXCsNYi8NFtYp6w81prAsebJvgR3mnNBsWWiLnN5XJjWmuA67r9cl9yLLihdRum6BnLlNYawP0sEPgKH2CgdRtswOFUnvY3gUIHZpftd9AJ0un0EMUuTdFNrbdDbFMplIX3UlTuS+s2pDnEhLaPvFomkxm0fQKZzSOz0zUtRigWi+PoFXt+6UWfHdMAq1GVMAx7tS4+tENYinysp+AunLFjv2CSyrJbPrBja3R7BP+p9zlq0bNM8XsLbaLlIzCzum8Ky5svY6vYOolzKjwp9ygnjG2UhgRRZIWEZegnvv/T+OgFzRtg3aPFH4ETBPBGrqGj3XYCmQIOckXRRa39Ci1Hqov/j3d7RVhCcH+KWgAAAABJRU5ErkJggg==>