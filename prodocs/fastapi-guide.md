# Son Çağrı — Backend Geliştirme Rehberi

**Proje:** Son Çağrı (Project LastCall)  
**Kök klasör:** `backend/`  
**Çalışma zamanı:** Python 3.10+, FastAPI  
**Veri katmanı:** Supabase (PostgreSQL + Auth)  
**LLM:** Google Gemini API  

Bu belge, backend ekibinin uyacağı mimari standartları, klasör düzenini ve kodlama kurallarını tanımlar.

---

## 1. Genel mimari

Backend, tek bir FastAPI uygulaması olarak `backend/` altında geliştirilir. İstemci (React) yalnızca bu API ile konuşur; veritabanına doğrudan yazma/okuma işlemleri backend üzerinden yapılır.

| Katman | Sorumluluk |
|--------|------------|
| **Router** | HTTP uç noktaları, istek/yanıt modelleri, auth bağımlılıkları |
| **Service** | İş kuralları, Gemini çağrıları, birden fazla tabloya yayılan işlemler |
| **Repository / DB** | `supabase-py` ile tablo erişimi |
| **Schemas** | Pydantic modelleri (giriş, çıkış, LLM doğrulama) |
| **Core** | Uygulama fabrikası, ayarlar, JWT doğrulama, ortak hatalar |

Tüm HTTP rotaları **`/api/v1`** ön eki altında yayınlanır. Versiyon dışı uç nokta yalnızca sağlık kontrolü (`/api/v1/health`) gibi altyapı amaçlı olanlardır.

---

## 2. Klasör yapısı

Önerilen düzen (henüz oluşturulmamış modüller bu isimlendirmeyi takip etmelidir):

```
backend/
├── app/
│   ├── main.py                 # FastAPI app, router mount, /api/v1 prefix
│   ├── core/
│   │   ├── config.py           # Ortam değişkenleri (Supabase, Gemini, JWT)
│   │   ├── security.py         # Bearer token çözümleme, kullanıcı kimliği
│   │   └── dependencies.py     # Ortak Depends (get_current_user, get_supabase)
│   ├── api/
│   │   └── v1/
│   │       ├── router.py       # v1 alt router birleştirici
│   │       ├── health.py
│   │       ├── auth.py         # (gerekirse proxy; asıl auth Supabase Auth)
│   │       ├── pantry.py
│   │       ├── recipes.py      # Gemini tarif üretimi
│   │       └── savings.py      # Green Ledger
│   ├── schemas/
│   │   ├── pantry.py
│   │   ├── recipe.py           # LLMRecipeSchema ve API yanıt modelleri
│   │   └── savings.py
│   ├── services/
│   │   ├── recipe_service.py
│   │   └── pantry_service.py
│   └── db/
│       └── supabase_client.py  # Tekil Supabase istemcisi
├── requirements.txt
└── .env.example                # Commit edilmez; .env gitignore'da
```

**Kural:** Uygulama kodu yalnızca depo kökündeki `./backend/` dizininde bulunur; kök veya `frontend/` içine Python modülü eklenmez.

---

## 3. API sözleşmesi

### 3.1 URL ön eki

```python
# app/main.py — örnek mount
app.include_router(api_v1_router, prefix="/api/v1")
```

Tüm iş uç noktaları `https://<host>/api/v1/...` biçimindedir.

### 3.2 Sağlık kontrolü

| Metot | Yol | Açıklama |
|-------|-----|----------|
| `GET` | `/api/v1/health` | Sunucu ayakta mı; Render cold start sonrası ön yüz bu uç noktayı kullanır |

Yanıt gövdesi Pydantic ile modellenmeli (ör. `status`, `version`).

### 3.3 Örnek iş uç noktaları (PRD ile uyumlu)

| Metot | Yol | Auth |
|-------|-----|------|
| `POST` | `/api/v1/pantry/search` | Bearer (kullanıcı oturumu) |
| `POST` | `/api/v1/recipes/generate` | Bearer |
| `POST` | `/api/v1/savings/confirm` | Bearer |

Tam liste PRD ve OpenAPI şemasından türetilir; yeni rota eklerken aynı `/api/v1` kuralı korunur.

---

## 4. Kimlik doğrulama ve yetkilendirme

- Kullanıcı girişi **Supabase Auth** (e-posta/şifre) ile yapılır; istemci aldığı JWT’yi `Authorization: Bearer <token>` başlığında gönderir.
- Korunan uç noktalarda token doğrulaması **zorunludur**.
- **`user_id` asla istek gövdesinden (JSON body) okunmaz.** Kimlik yalnızca doğrulanmış token’dan çıkarılır ve servis katmanına parametre olarak iletilir.
- Supabase **Satır Bazlı Güvenlik (RLS)** politikaları birincil veri güvenliği hattıdır; backend sorguları da yalnızca ilgili kullanıcının verisine erişecek şekilde filtrelenir. Başka kullanıcının kiler veya ledger kaydına erişim denemeleri `403 Forbidden` ile reddedilir.

```python
# Örnek bağımlılık kullanımı (kavramsal)
@router.post("/pantry/search")
async def search_pantry(
    body: PantrySearchRequest,
    current_user: UserContext = Depends(get_current_user),
):
    # current_user.id — body'den değil
    ...
```

---

## 5. Veritabanı: Supabase

- Veritabanı erişimi için **yalnızca resmi [`supabase-py`](https://github.com/supabase/supabase-py)** istemcisi kullanılır; ham `psycopg2` / SQLAlchemy ile paralel ikinci bir erişim katmanı açılmaz.
- Ücretsiz katmanda bağlantı havuzu sınırı (~60) nedeniyle uzun ömürlü gereksiz bağlantı açılmaz; istemci uygulama yaşam döngüsünde tekil (singleton) tutulur.
- MVP tabloları (PRD): `global_ingredients`, `user_pantries`, `user_savings_ledger` ve ilgili RLS politikaları.

---

## 6. Pydantic ve API yanıtları

- Her uç noktanın **istek ve yanıt gövdesi** açık Pydantic modelleriyle tanımlanır.
- FastAPI `response_model` ile çıkış şeması zorlanır; serbest `dict` dönüşü kullanılmaz.
- Doğrulama hataları standart HTTP `422` ile döner; iş kuralı ihlalleri anlamlı `4xx` kodları ve Türkçe mesaj gövdesiyle iletilir.

```python
class PantrySearchResponse(BaseModel):
    items: list[IngredientHit]
    total: int

@router.post("/pantry/search", response_model=PantrySearchResponse)
async def search_pantry(...):
    ...
```

---

## 7. Gemini entegrasyonu ve `LLMRecipeSchema`

Tarif üretimi Gemini API üzerinden yapılır. Backend şu kurallara uyar:

1. API çağrısında **`response_mime_type="application/json"`** her zaman set edilir; model çıktısı yapılandırılmış JSON olarak istenir.
2. Dönen JSON, **`LLMRecipeSchema`** Pydantic modeli ile doğrulanır. Şema dışı veya eksik alan → kullanıcıya kontrollü hata, sunucu loguna ayrıntı (MVP hedefi: ≥ %98 doğrulama başarısı).
3. Gastronomik uyumsuzluk senaryosu PRD’deki gibi `is_compatible: false` ile modellenir; bu durumda tarif adımları döndürülmez.

```python
# Kavramsal — gerçek alanlar schemas/recipe.py içinde tanımlanır
class LLMRecipeSchema(BaseModel):
    is_compatible: bool
    title: str | None = None
    steps: list[str] | None = None
    # ... diğer zorunlu alanlar
```

Bozuk JSON veya zaman aşımı durumunda uygulama çökmez; kullanıcıya kibar hata mesajı, arka planda yapılandırılmış log.

---

## 8. Kodlama kuralları

| Konu | Standart |
|------|----------|
| Dil | Python 3.10+ tip ipuçları (`list[str]`, `str \| None`) |
| Yorumlar | **Türkçe** — modül, karmaşık iş kuralı ve public fonksiyonlar |
| Async | I/O ağırlıklı uç noktalar `async def`; bloklayan SDK çağrıları uygun executor veya senkron sarmalayıcı ile |
| Ortam | Gizli anahtarlar `.env` içinde; repoya commit edilmez |
| Hata modeli | Tutarlı exception handler; production’da stack trace istemciye sızmaz |
| Loglama | LLM doğrulama hataları, 5xx ve güvenlik ihlalleri loglanır |

---

## 9. Dağıtım ve performans notları

- **Render.com (ücretsiz):** 15 dakika isteksizlikten sonra uyku; ilk istek 30–50 sn sürebilir. Ön yüz açılışında `/api/v1/health` ile uyandırma yapılır (ayrıntı: `react-guide.md`).
- **Arama:** Kiler malzeme araması hedefi &lt; 200 ms (PRD NFR); sorgular indeksli `global_ingredients` üzerinden optimize edilir.
- **Tarif üretimi:** LLM dahil üst sınır ~12–15 sn; zaman aşımı yönetimi router/service katmanında tanımlanır.

---

## 10. İlgili belgeler

- `prodocs/PRD_SON_CAGRİ.md` — kullanıcı hikâyeleri, kabul kriterleri, QA matrisi  
- `prodocs/MVP_Kapsam_Dokumani.md` — kapsam, altyapı kısıtları  
- `prodocs/react-guide.md` — istemci tarafı entegrasyon ve UX kısıtları  

---

*Son Çağrı Backend Rehberi — proje mimari standartları*
