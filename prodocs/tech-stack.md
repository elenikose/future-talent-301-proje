# 🛠️ Son Çağrı (Project LastCall) — Teknoloji Yığını & Mimari Gerekçeler (Tech Stack)

Bu doküman, "Son Çağrı" MVP projesinin geliştirilmesinde kullanılan teknolojileri, bu servislerin seçilme gerekçelerini ve modern yazılım mühendisliği pratikleri doğrultusunda yapay zekanın (AI) süreçte nasıl konumlandırıldığını özetler.

---

## 🏗️ Çekirdek Teknoloji Yığını (Core Tech Stack)

### 1. Backend (Arka Yüz): FastAPI (Python)
* **Seçim Gerekçesi:** * Projenin merkezinde Google Gemini LLM API entegrasyonu yer almaktadır. Python, yapay zeka ve veri işleme kütüphaneleriyle yerel olarak en uyumlu ve ekosistemi en güçlü dildir.
  * FastAPI, asenkron (`async/await`) mimari desteği sayesinde yapay zeka API'lerinden dönen uzun süreli veri isteklerini (latency) bloklanmadan (non-blocking) yönetebilir.
  * Otomatik Swagger/OpenAPI dokümantasyonu üretmesi, geliştirme sürecini hızlandırmıştır.

### 2. Frontend (Ön Yüz): React + Vite (JavaScript)
* **Seçim Gerekçesi:**
  * Uygulamanın en kritik UX eşiği olan "Kiler Malzeme Girişi" ve "Anlık (Ad-hoc) Ürün Ekleme" ekranları, anlık arayüz güncellemeleri (state management) gerektirmektedir. React'in sanal DOM mimarisi bu dinamik yapıyı minimum gecikmeyle yönetir.
  * Vite, geleneksel Webpack sistemlerine kıyasla hot-reload (anlık kod güncelleme) hızında devrimsel bir performans sunarak geliştirme sürecini kısaltmıştır.

### 3. Veri Tabanı & Auth: Supabase (PostgreSQL)
* **Seçim Gerekçesi:**
  * MVP aşamasında hızlı yol alabilmek adına geleneksel bir veritabanı sunucusu kurmak yerine BaaS (Backend-as-a-Service) modeli tercih edilmiştir.
  * **Güvenlik Politikası:** Kullanıcı kiler verilerinin güvenliği PostgreSQL tabanlı **Satır Bazlı Güvenlik (RLS - Row Level Security)** politikaları ile korunmuştur. Bir kullanıcı sadece kendi token'ı ile eşleşen kiler ve tasarruf verilerine erişebilir.

---

## 🤖 Geliştirme Sürecinde Yapay Zekanın (AI) Rolü

"Son Çağrı" projesinde yapay zeka hem ürünün **çekirdek bir bileşeni** hem de geliştirme sürecini hızlandıran bir **mühendislik asistanı** olarak iki farklı rolde kullanılmıştır:

### 1. Ürün Çekirdeğinde AI (Google Gemini API)
* **Rolü:** Kullanıcının kilerindeki son tüketim tarihi yaklaşan düzensiz malzemeleri analiz ederek gastronomik açıdan güvenli ve yenilebilir tarif senaryoları üretmek.
* **Seçim Gerekçesi:** Esnek prompt mühendisliğine izin vermesi, doğal dil işleme kapasitesinin yüksek olması ve bağlamsal doğruluğunun %98'in üzerinde olması sebebiyle ana yapay zeka motoru olarak **Google Gemini API** entegre edilmiştir.

### 2. Kodlama ve Mimari Süreçte AI (Yazılım Asistanı)
Geliştirme sürecinde AI, körü körüne kod kopyalamak için değil, mimari kararları doğrulamak ve kod kalitesini artırmak için bir "Pair Programmer" olarak konumlandırılmıştır:
* **Hata Ayıklama (Debugging):** Özellikle React üzerindeki *Object Rendering (White Screen of Death)* krizinde ve FastAPI yönlendirmelerindeki rota çakışmalarında hata loglarının analiz edilmesinde AI asistanlığından yararlanılmıştır.
* **Sürüm Yönetimi (Git) Standardizasyonu:** Geliştirilen özelliklerin commit mesajlarının tek bir "kod çöplüğü" haline gelmesini önlemek amacıyla, atomik commit paketleme süreçleri ve global sektör standardı olan **İngilizce Geçmiş Zaman (Past Tense - Past Verb + Feature)** mesaj yapısı AI rehberliğinde kurgulanmıştır.
* **Veri Tutarlılığı ve Validasyon:** Yapay zekanın sayısal hesaplamalardaki "halüsinasyon" riski fark edildiğinde, karbon ayak izi (CO2) hesaplama yetkisi AI'ın elinden alınarak ön yüze deterministik matematiksel formüller yazılması kararı AI ile yapılan mimari beyin fırtınaları sonucunda alınmıştır.