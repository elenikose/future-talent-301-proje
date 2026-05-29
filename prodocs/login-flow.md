# Giriş Akışı (Login Flow)

**Proje:** Son Çağrı  
**Kaynak:** [MVP_Kapsam_Dokumani.md](./MVP_Kapsam_Dokumani.md) §2 (Auth), [design-system.md](./design-system.md)

---

## 1. Minimal akış (referans)

Kullanıcı şablonu — siyah-beyaz stil:

```mermaid
flowchart TD
    A([LOGIN]) --> B[e-mail]
    B --> C[pass]
    C --> D{pass is}

    D -- true --> E[homepage]
    D -- wrong --> F[pass is invalid]

    style A fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style B fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style C fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style D fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style E fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style F fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
```

> **Not:** MVP’de `homepage` = **Malzeme Girişi** (`/pantry`). Şifre doğrulaması istemcide değil **Supabase Auth** üzerinden yapılır.

---

## 2. Genişletilmiş MVP akışı

```mermaid
flowchart TD
    subgraph appOpen [Uygulama acilisi]
        Start([Uygulama acilisi]) --> SessionCheck{Gecerli oturum var mi?}
        SessionCheck -->|Evet| HealthLoop
        SessionCheck -->|Hayir| LoginScreen
    end

    subgraph loginForm [Giris ekrani]
        LoginScreen([LOGIN]) --> Email[e-posta]
        Email --> Pass[sifre]
        Pass --> Submit[Giris Yap]
        Submit --> ClientValid{Alanlar gecerli mi?}
        ClientValid -->|Hayir| FieldHint[Alan alti uyarisi]
        FieldHint --> Email
        ClientValid -->|Evet| SupabaseAuth[Supabase signInWithPassword]
    end

    subgraph authResult [Kimlik dogrulama]
        SupabaseAuth --> AuthOk{Basarili mi?}
        AuthOk -->|Evet| StoreJWT[JWT oturuma kaydet]
        AuthOk -->|Hayir| InvalidCreds[sifre veya e-posta hatali]
        InvalidCreds --> LoginScreen
    end

    subgraph postLogin [Giris sonrasi]
        StoreJWT --> HealthLoop[/GET api/v1/health/]
        HealthLoop --> HealthOk{Sunucu hazir mi?}
        HealthOk -->|Evet| Pantry[Malzeme Girisi - Pantry]
        HealthOk -->|Cold start| Skeleton[Skeleton / yukleniyor]
        Skeleton --> HealthLoop
    end

    subgraph sideLinks [Yan akislar - MVP]
        LoginScreen --> RegisterLink[Kayit ol]
        LoginScreen --> ForgotLink[Sifremi unuttum]
        RegisterLink --> RegisterFlow[Register sayfasi - Supabase signUp]
        ForgotLink --> ResetFlow[Sifre sifirlama e-postasi]
    end

    style LoginScreen fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style Email fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style Pass fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style AuthOk fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style Pantry fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
    style InvalidCreds fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000
```

---

## 3. Kullanıcı mesajları (design-system tonu)

| Durum | UI metni |
|--------|----------|
| Geçersiz kimlik (`invalid_credentials`) | E-posta veya şifre eşleşmedi. Tekrar dene. |
| Boş alan (istemci) | E-posta ve şifre gerekli. |
| Geçersiz e-posta formatı | Geçerli bir e-posta adresi gir. |
| Ağ / sunucu hatası | Bağlantı kurulamadı. Biraz sonra tekrar dene. |
| Kayıt başarılı | Hesabın hazır. Giriş yapabilirsin. |
| Şifre sıfırlama gönderildi | Sıfırlama bağlantısı e-postana gönderildi. |

---

## 4. İlgili dosyalar

| Dosya | Açıklama |
|--------|----------|
| `frontend/src/pages/LoginPage.jsx` | Giriş formu |
| `frontend/src/hooks/useAuth.js` | Supabase oturum |
| `frontend/src/hooks/useBackendReady.js` | Health / cold start |
| `backend/main.py` | `GET /api/v1/health` |
