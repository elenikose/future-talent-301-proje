# 🚨 Son Çağrı (LastCall) - Enterprise MVP

**Son Çağrı**, evdeki gıda malzemelerinin son kullanma tarihlerine odaklanarak, gıda israfını minimuma indirmeyi hedefleyen yapay zeka destekli akıllı bir sürdürülebilirlik ve yemek tarifi optimizasyonu uygulamasıdır.

---

## 🚀 Teknolojik Altyapı (Tech Stack)

### Arka Plan (Backend) & Veritabanı
* **FastAPI:** Yüksek performanslı, modern ve asenkron Python Web API çatısı.
* **Supabase (PostgreSQL):** Gerçek zamanlı veri takibi, kullanıcı kimlik doğrulama (Auth) ve RLS (Satır Bazlı Güvenlik) destekli malzeme yönetimi.
* **Google Gemini API:** Envanterdeki ürünleri ve anlık (ad-hoc) girdileri analiz ederek kişiselleştirilmiş, yaratıcı ve israf önleyici Türkçe tarifler üreten LLM motoru.

### Ön Yüz (Frontend)
* **React & Vite:** Hızlı, modern ve bileşen tabanlı interaktif web arayüzü mimarisi.
* **Deterministik CO2 Modeli:** Yapay zeka halüsinasyonlarını engelleyen, ön yüz tabanlı net karbon tasarruf hesaplama algoritması.

---

## 📦 Proje Yapısı (Directory Layout)

```text
future-talent-301-proje/
├── backend/          # FastAPI Sunucusu, API Rotaları, Servisler ve Gemini Entegrasyonu
├── frontend/         # React & Vite Ön Yüz Uygulaması ve Kullanıcı Ekranları
├── prodocs/          # Mimari kararlar, QA testleri, PRD ve MVP kapsam dokümanları
├── .gitignore        # Gereksiz dosyaların repoya girmesini engelleyen kural seti
├── .env.example      # Gerçek API anahtarları olmadan örnek global çevre değişkenleri şablonu
└── README.md         # Proje Dokümantasyonu (Şu an buradasınız)

```

---

## 🛠️ Yerel Kurulum ve Çalıştırma (Installation)

Projenin hem backend hem de frontend katmanını yerel ortamınızda ayağa kaldırmak için aşağıdaki adımları sırasıyla takip ediniz:

### 1. Depoyu Klonlayın

```bash
git clone [https://github.com/elenikose/future-talent-301-proje.git](https://github.com/elenikose/future-talent-301-proje.git)
cd future-talent-301-proje

```

### 2. Backend (FastAPI) Ortamını Hazırlayın

Yeni bir terminal açın ve backend dizinine gidin:

```bash
cd backend
python -m venv venv

```

#### 🔑 Sanal Ortamı (Venv) Aktifleştirme:

Kullandığınız işletim sistemine ve terminal türüne uygun olan komutu çalıştırınız:

* **Windows (PowerShell - Önerilen):**
*Eğer yetki kısıtlama hatası alırsanız önce `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` komutunu çalıştırın.*
```powershell
.\venv\Scripts\activate

```


* **Windows (Klasör / CMD):**
```cmd
.\venv\Scripts\activate.bat

```


* **Mac / Linux (Terminal):**
```bash
source venv/bin/activate

```



#### 📦 Bağımlılıkların Yüklenmesi ve Çalıştırma:

Sanal ortam aktifken bağımlılıkları yükleyin:

```bash
pip install -r requirements.txt

```

Kök dizindeki `.env.example` dosyasını referans alarak `backend/` klasörü içinde bir `.env` dosyası oluşturun ve içerisindeki `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` ve `GOOGLE_API_KEY` alanlarını kendi bağlantı anahtarlarınızla doldurun.

Backend sunucusunu başlatın (Kök dizinden app modülünü çağırarak):

```bash
uvicorn app.main:app --reload

```

*API dökümantasyonuna ve test ekranına **`http://127.0.0.1:8000/docs`** (Swagger UI) adresinden erişebilirsiniz.*

---

### 3. Frontend (React) Ortamını Hazırlayın

Farklı bir terminal sekmesi açın ve frontend dizinine gidin:

```bash
cd frontend
npm install

```

Kök dizindeki `.env.example` dosyasını referans alarak `frontend/` klasörü içinde bir `.env` dosyası oluşturun, gerekli ortam değişkenlerini (`VITE_API_BASE_URL`, `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY`) yapılandırdıktan sonra ön yüzü ayağa kaldırın:

```bash
npm run dev

```

*Uygulama arayüzüne **`http://localhost:5173`** adresinden erişerek test işlemlerine başlayabilirsiniz.*

```