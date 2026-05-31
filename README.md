Sektörel gerçeklerle hemen durumu düzeltiyorum Eleni, **kesinlikle HAKLISIN!** Ekran görüntülerine (`Ekran görüntüsü 2026-05-31 212415.png` ve `Ekran görüntüsü 2026-05-31 212411.png`) dikkatli bakınca sol menüde `react.svg`, `vite.svg` ve `components/BrandTitle.jsx` dosyalarını kabak gibi gördüğüm halde Streamlit sızıntısına düşmüşüm. Kusura bakma, çok iyi yakaladın.

Hemen ön yüz (Frontend) teknolojimizi **React (Vite)** olarak düzelterek, projenin kartvizitini (README) tamamen doğru ve kurumsal hale getiriyorum.

Aşağıdaki bloğu tamamen kopyalayıp `README.md` dosyana yapıştırabilirsin:

```markdown
# 🚨 Son Çağrı (LastCall) - Enterprise MVP

**Son Çağrı**, evdeki veya restoranlardaki malzemelerin son kullanma tarihlerine odaklanarak, gıda israfını minimuma indirmeyi hedefleyen yapay zeka destekli akıllı bir sürdürülebilirlik ve yemek tarifi optimizasyonu uygulamasıdır.

---

## 🚀 Teknolojik Altyapı (Tech Stack)

### Arka Plan (Backend) & Veritabanı
*   **FastAPI:** Yüksek performanslı, modern ve asenkron Python Web API çatısı.
*   **Supabase (PostgreSQL):** Gerçek zamanlı veri takibi, kullanıcı envanteri ve malzeme yönetimi.
*   **Google Gemini API:** Envanterdeki en acil gıda maddelerini analiz ederek kişiselleştirilmiş, yaratıcı ve israf önleyici Türkçe tarifler üreten yapay zeka motoru.

### Ön Yüz (Frontend)
*   **React & Vite:** Hızlı, modern ve bileşen tabanlı interaktif web arayüzü mimarisi.

---

## 📦 Proje Yapısı (Directory Layout)

```text
future-talent-301-proje/
├── backend/          # FastAPI Sunucusu, API Uçları ve Gemini Entegrasyonu
├── frontend/         # React & Vite Ön Yüz Uygulaması ve Kullanıcı Ekranları
├── supabase/         # Veritabanı şemaları ve yerel migrasyon takipleri
└── README.md         # Proje Dokümantasyonu (Şu an buradasınız)

```

---

## 🛠️ Yerel Kurulum ve Çalıştırma (Installation)

Projenin backend ve veritabanı katmanını kendi yerel ortamınızda ayağa kaldırmak için aşağıdaki adımları sırasıyla takip ediniz:

### 1. Depoyu Klonlayın ve Ana Dizine Geçin

```bash
git clone [https://github.com/elenikose/future-talent-301-proje.git](https://github.com/elenikose/future-talent-301-proje.git)
cd future-talent-301-proje

```

### 2. Backend Ortamını Hazırlayın

```bash
cd backend
python -m venv venv

```

* **Windows için aktifleştirme:** `venv\Scripts\activate`
* **Mac/Linux için aktifleştirme:** `source venv/bin/activate`

### 3. Bağımlılıkları Yükleyin

```bash
pip install -r requirements.txt

```

### 4. Ortam Değişkenlerini Yapılandırın

`.env.example` dosyasını `.env` olarak kopyalayın ve içerisindeki `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` ve `GEMINI_API_KEY` alanlarını kendi lisans/bağlantı anahtarlarınızla doldurun.

### 5. Backend Sunucusunu Başlatın

```bash
python main.py

```

Sunucu ayağa kalktıktan sonra API dökümantasyonuna ve test ekranına **`http://127.0.0.1:8080/docs`** (Swagger UI) adresinden erişebilirsiniz.

```

```