# Son Çağrı — Frontend Geliştirme Rehberi

**Proje:** Son Çağrı (Project LastCall)  
**Kök klasör:** `frontend/`  
**Çatı:** React, Vite, JavaScript  
**API tabanı:** `https://<backend-host>/api/v1`  
**Tasarım:** `prodocs/design-system.md` (leftovers & co.)

Bu belge, frontend ekibinin uyacağı mimari standartları, klasör düzenini ve kodlama kurallarını tanımlar.

---

## 1. Genel mimari

Tek sayfa uygulaması (SPA), Vite ile derlenir. Tüm iş verisi backend REST API üzerinden alınır; kimlik doğrulama token’ı Supabase Auth’tan gelir ve korumalı isteklerde `Authorization` başlığına eklenir.

| Katman | Sorumluluk |
|--------|------------|
| **Pages / routes** | Ekran düzeyi bileşenler, URL eşlemesi |
| **Components** | Yeniden kullanılabilir UI parçaları |
| **Hooks** | Debounce, API durumu, auth oturumu, cold start |
| **Services / api** | `fetch` veya HTTP istemcisi; `/api/v1` taban URL |
| **Context / state** | Oturum, kiler, yükleme kilidi (global UI durumu) |

**Kural:** Kaynak kod yalnızca depo kökündeki `./frontend/` dizininde bulunur.

---

## 2. Klasör yapısı

Önerilen düzen:

```
frontend/
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   ├── client.js           # baseURL, auth header, hata normalizasyonu
│   │   ├── health.js
│   │   ├── pantry.js           # search, CRUD
│   │   ├── recipes.js
│   │   └── savings.js
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useBackendReady.js  # cold start / health
│   │   └── useAuth.js
│   ├── components/
│   │   ├── ui/                 # buton, tag, input — design-system sınıfları
│   │   ├── layout/
│   │   └── pantry/
│   ├── pages/
│   │   ├── PantryPage.jsx
│   │   ├── RecipeListPage.jsx
│   │   ├── RecipeDetailPage.jsx
│   │   └── ProfilePage.jsx
│   ├── styles/
│   │   ├── variables.css       # design-system CSS değişkenleri
│   │   └── global.css
│   └── utils/
│       └── constants.js
├── index.html
├── vite.config.js
└── package.json
```

Ekran akışı `design-system.md` §8 ile uyumludur: Malzeme girişi → Tarif listesi → Tarif detay → Profil / geçmiş.

---

## 3. Backend entegrasyonu

### 3.1 Taban URL ve sürüm

Tüm istekler **`/api/v1`** ön ekli yollara gider. Örnek:

```javascript
// api/client.js — kavramsal
const API_BASE = import.meta.env.VITE_API_BASE_URL; // örn. https://api.example.com/api/v1

export async function apiPost(path, body, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  // hata ve JSON parse...
}
```

### 3.2 Kritik uç noktalar

| Kullanım | Metot | Yol |
|----------|-------|-----|
| Sunucu uyandırma / hazır kontrol | `GET` | `/api/v1/health` |
| Kiler malzeme arama | `POST` | `/api/v1/pantry/search` |
| Tarif üret | `POST` | `/api/v1/recipes/generate` |
| Tasarruf onayı | `POST` | `/api/v1/savings/confirm` |

Tam sözleşme backend OpenAPI / `fastapi-guide.md` ile senkron tutulur.

---

## 4. Zorunlu istemci davranışları

### 4.1 Malzeme araması — 300 ms debounce

Kiler arama çubuğu `POST /api/v1/pantry/search` çağırır. **Her tuş vuruşunda istek atılmaz.**

- Kullanıcı yazmayı bıraktıktan **300 ms** sonra tek istek gönderilir.
- PRD: en az **2 karakter** sonrası arama (backend ile aynı kural).
- QA (TC-002): hızlı ardışık girişte yalnızca son sorgu için tek API çağrısı beklenir.

```javascript
// hooks/useDebounce.js — kullanım örneği
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  if (debouncedQuery.length < 2) return;
  pantryApi.search(debouncedQuery, token);
}, [debouncedQuery, token]);
```

### 4.2 “Tarif Üret” — 10 saniyelik tıklama kilidi

Gemini ücretsiz katmanında RPM sınırı (≈15/dk) nedeniyle aynı butona art arda basış engellenir.

- İlk tıklamadan sonra buton **10 saniye** devre dışı (`disabled` + görsel geri bildirim).
- İstek süresince yükleme göstergesi; PRD’deki dinamik loading metinleri kullanılabilir.
- 429 yanıtında kullanıcıya anlaşılır mesaj; kilidin süresi uzatılmaz (standart 10 sn korunur).

### 4.3 Cold start — health check ve UI kilidi

Render ücretsiz katmanda API 15 dk sonra uyur; ilk istek **30–50 sn** sürebilir.

**Uygulama açılışında:**

1. Arka planda asenkron `GET /api/v1/health` (kullanıcıyı bloklamadan başlatılır).
2. Yanıt başarılı olana kadar:
   - Etkileşimli butonlar **kilitli**,
   - Tam ekran veya layout **skeleton / yükleme** ekranı gösterilir.
3. Health başarısız veya zaman aşımında skeleton kalır; periyodik yeniden deneme veya kullanıcıya bilgi mesajı (PRD TC-004).

```javascript
// hooks/useBackendReady.js — kavramsal durum makinesi
// idle → waking → ready | failed
```

Bu davranış MVP altyapı kısıtının bir parçasıdır; yalnızca geliştirme ortamında atlanmamalıdır (ortam değişkeni ile kısa devre isteğe bağlı yapılabilir).

---

## 5. Bileşen ve UI standartları

- Bileşenler **küçük, tek sorumluluklu** tutulur; sayfa dosyaları orchestration yapar, iş mantığını mümkün olduğunca `hooks/` ve `api/` taşır.
- Görsel katman **`prodocs/design-system.md`** ile uyumludur: renk token’ları, Fraunces / DM Sans, `btn-primary`, `tag-sage`, `recipe-card`, skeleton boş durumlar.
- **Mobile-first:** tasarım 390px baz; breakpoint `768px`.
- İkonlar: Tabler Icons (`ti ti-*`).

---

## 6. Kimlik doğrulama (istemci)

- Supabase Auth SDK veya backend’in önerdiği akış ile oturum açılır; JWT bellekte güvenli tutulur (tercihen `sessionStorage` / Supabase client).
- Korumalı `api/*` çağrılarına token eklenir; token süresi dolduğunda yenileme veya login yönlendirmesi.
- Kullanıcı kimliği API gövdesine **gönderilmez**; backend token’dan çözer (`fastapi-guide.md`).

---

## 7. Kodlama kuralları

| Konu | Standart |
|------|----------|
| Dil | JavaScript (MVP); TypeScript geçişi ayrı karar |
| Yorumlar | **Türkçe** — karmaşık effect’ler, API sözleşmesi sapmaları |
| Ortam | `VITE_*` önekli değişkenler; `.env` commit edilmez |
| Stil | Design system CSS değişkenleri; rastgele hex / generic UI kit yok |
| Erişilebilirlik | Buton `disabled` durumunda klavye odağı ve `aria-busy` / `aria-disabled` |
| Hata gösterimi | API `4xx/5xx` kullanıcı dostu Türkçe mesaj; teknik detay konsolda |

---

## 8. Test ve kabul referansları

| Test ID | Frontend beklentisi |
|---------|---------------------|
| TC-002 | Debounce: hızlı yazımda tek search isteği |
| TC-004 | Cold start: health başarısızken skeleton, butonlar kilitli |
| TC-001 | `is_compatible: false` → tarif adımları gizli, uyarı görünür |

Detaylı senaryolar: `prodocs/PRD_SON_CAGRİ.md` Tablo 2.

---

## 9. Yerel geliştirme

```bash
cd frontend
npm install
npm run dev
```

`.env` örneği:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Backend çalışmadan health akışı test edilemez; geliştirmede her iki süreç birlikte ayağa kaldırılır.

---

## 10. İlgili belgeler

- `prodocs/design-system.md` — UI bileşenleri ve akış  
- `prodocs/fastapi-guide.md` — API, auth, Pydantic, Gemini  
- `prodocs/PRD_SON_CAGRİ.md` — kullanıcı hikâyeleri ve NFR  
- `prodocs/MVP_Kapsam_Dokumani.md` — debounce, throttling, cold start gerekçeleri  

---

*Son Çağrı Frontend Rehberi — proje mimari standartları*
