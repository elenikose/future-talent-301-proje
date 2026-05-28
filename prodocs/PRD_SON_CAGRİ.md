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