# leftovers & co. — Design System

> Elindeki malzemelerle hem lezzetli yemek yap, hem gezegene katkı sağla.

---

## İçindekiler

1. [Marka & Kimlik](#1-marka--kimlik)
2. [Tipografi](#2-tipografi)
3. [Renk Paleti](#3-renk-paleti)
4. [Spacing Scale](#4-spacing-scale)
5. [Border Radius](#5-border-radius)
6. [Componentler](#6-componentler)
   - [Navigasyon](#61-navigasyon)
   - [Malzeme Etiketleri](#62-malzeme-etiketleri)
   - [Giriş Alanı](#63-giriş-alanı)
   - [Adım Göstergesi](#64-adım-göstergesi)
   - [Tarif Kartı](#65-tarif-kartı)
   - [Karbon Badge](#66-karbon-badge)
   - [Tasarruf Göstergesi](#67-tasarruf-göstergesi)
   - [Butonlar](#68-butonlar)
7. [CSS Değişkenleri](#7-css-değişkenleri)
8. [Uygulama Akışı](#8-uygulama-akışı)

---

## 1. Marka & Kimlik

**Ürün adı:** `leftovers & co.`

**Ton & Ses:**
- Sıcak, teşvik edici, suçlamayan
- "Atık" değil, "değerlendirme" dili kullanılır
- Karbon tasarrufunu rakamla somutlaştır, soyut bırakma

**Logo yazı stili:**
```
leftovers (Fraunces italic, sage rengi) + & co. (DM Sans light, charcoal)
```

**Tagline:** *"Dolaptakileri değerlendir."*

---

## 2. Tipografi

### Yazı Tipleri

| Kullanım | Font | Ağırlık | Boyut |
|---|---|---|---|
| Display / Başlık | Fraunces | 600 | 28–36px |
| Başlık italic vurgu | Fraunces italic | 300 | 28–36px |
| Section başlığı | DM Sans | 500 | 16–20px |
| Body text | DM Sans | 400 | 14–15px |
| Yardımcı / meta | DM Sans | 400 | 11–13px |
| Label / badge | DM Sans | 500 | 10–12px |

### Google Fonts İçe Aktarımı

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
```

### Kullanım Kuralları

- Sayısal değerler (CO₂, süre, porsiyon) → `Fraunces 600`
- Tüm açıklayıcı metin → `DM Sans 400`
- Section label'ları → `DM Sans 500, uppercase, letter-spacing: 0.12em`
- Hiçbir yerde `font-weight: 700` kullanılmaz

---

## 3. Renk Paleti

### Ana Renkler

| İsim | Hex | Kullanım |
|---|---|---|
| Sage | `#5C7A5A` | Ana marka rengi, CTA buton, aktif state |
| Sage Light | `#E8F0E7` | Malzeme tag bg, section bg |
| Sage Mid | `#A8C4A5` | Tag border, ayraç |
| Bark | `#6B4F3A` | Et/protein kategorisi |
| Bark Light | `#EDE3DC` | Protein tag bg |
| Carbon Green | `#3A6B4A` | Karbon tasarruf, pozitif metrik |
| Carbon BG | `#D4EBD9` | Karbon badge arka plan |
| Amber | `#B87333` | Sebze kategorisi, uyarı |
| Amber BG | `#F5E8D6` | Sebze tag bg |
| Charcoal | `#2C2C28` | Ana metin rengi |
| Muted | `#7A776F` | İkincil metin, placeholder |
| Cream | `#F7F3EE` | Genel zemin |
| Warm White | `#FDFAF6` | Kart arka planı |

### Kategori → Renk Eşleştirmesi

```
Sebze / Meyve  →  Sage (#5C7A5A)
Et / Protein   →  Bark (#6B4F3A)
Tahıl / Bakliyat → Amber (#B87333)
Süt ürünleri   →  Sage (açık ton)
Karbon metrik  →  Carbon Green (#3A6B4A)
```

### Renk Kullanım Kuralları

- Gradient yalnızca `Tasarruf Göstergesi` kartında kullanılır (`sage → carbon-green`)
- Diğer tüm yüzeyler düz renk
- Koyu zemin üstü metin her zaman `white` veya `rgba(255,255,255,0.85)`
- Açık zemin üstü ikincil metin `var(--muted)` (#7A776F)

---

## 4. Spacing Scale

| Token | Değer | Kullanım |
|---|---|---|
| `xs` | 4px | İkon-metin arası, badge iç boşluk |
| `sm` | 8px | Tag gap, chip arası |
| `md` | 12px | Component içi padding (yatay) |
| `lg` | 16px | Kart padding, section arası |
| `xl` | 24px | Büyük section arası |
| `2xl` | 32px | Sayfa bölümleri arası |

---

## 5. Border Radius

| Token | Değer | Kullanım |
|---|---|---|
| `radius-sm` | 8px | Küçük chip, küçük badge |
| `radius-md` | 14px | Input, button, metric kart |
| `radius-lg` | 22px | Ana kart, nav bar, büyük container |
| `radius-pill` | 999px | Tag, ghost buton, meta chip |

---

## 6. Componentler

### 6.1 Navigasyon

```html
<nav class="nav-bar">
  <div class="nav-logo">leftovers<span> & co.</span></div>
  <button class="btn-ghost">
    <i class="ti ti-leaf"></i> 0 kg CO₂
  </button>
</nav>
```

**Kurallar:**
- Yalnızca logo + toplam CO₂ tasarrufu gösterilir
- Sticky değil, scroll ile kaybolur (mobil performans)
- CO₂ sayacı her tarif yapıldığında güncellenir

---

### 6.2 Malzeme Etiketleri

```html
<!-- Sebze -->
<span class="tag tag-sage">
  <i class="ti ti-plant-2"></i> Ispanak
  <span class="tag-remove">×</span>
</span>

<!-- Protein -->
<span class="tag tag-bark">
  <i class="ti ti-meat"></i> Tavuk
  <span class="tag-remove">×</span>
</span>
```

**Varyantlar:**

| Varyant | BG | Border | Metin |
|---|---|---|---|
| `tag-sage` | `#E8F0E7` | `#A8C4A5` | `#5C7A5A` |
| `tag-bark` | `#EDE3DC` | `#C9A882` | `#6B4F3A` |
| `tag-amber` | `#F5E8D6` | `#DEB98A` | `#B87333` |

---

### 6.3 Giriş Alanı

```html
<div class="input-wrapper">
  <input
    class="input-field"
    type="text"
    placeholder="Malzeme ekle... (örn: domates, soğan)"
  />
  <p class="input-hint">Virgülle ayırarak birden fazla ekleyebilirsin</p>
</div>
```

**Davranış:**
- Enter veya virgül → malzeme tag olarak eklenir
- Boş input submit edilemez
- Maksimum 12 malzeme önerilir (UI kalabalıklaşır)

---

### 6.4 Adım Göstergesi

```html
<div class="step-row">
  <div class="step-dot done">✓</div>
  <div class="step-line"></div>
  <div class="step-dot active">2</div>
  <div class="step-line"></div>
  <div class="step-dot inactive">3</div>
</div>
<div class="step-labels">
  <span>Malzemeler</span>
  <span>Tarif</span>
  <span>Sonuç</span>
</div>
```

**State'ler:**

| State | BG | İçerik |
|---|---|---|
| `done` | `#D4EBD9` | ✓ ikonu, `#3A6B4A` |
| `active` | `#5C7A5A` | Adım numarası, beyaz |
| `inactive` | `#F7F3EE` | Adım numarası, `#7A776F` |

---

### 6.5 Tarif Kartı

```html
<div class="recipe-card">
  <div class="recipe-card-header">
    <h2 class="recipe-card-title">Ispanaklı Yumurta</h2>
    <p class="recipe-card-subtitle">Elindeki 4 malzemeyle yapılıyor</p>
  </div>
  <div class="recipe-card-body">
    <div class="recipe-meta">
      <span class="recipe-meta-chip">
        <i class="ti ti-clock"></i> 15 dk
      </span>
      <span class="recipe-meta-chip">
        <i class="ti ti-flame"></i> Kolay
      </span>
      <span class="recipe-meta-chip">
        <i class="ti ti-users"></i> 2 kişi
      </span>
    </div>
    <p>Tarif açıklaması buraya gelir.</p>
    <!-- Karbon Badge buraya yerleşir -->
  </div>
</div>
```

**Kart yapısı:**
- `recipe-card-header` → `#E8F0E7` zemin
- `recipe-card-body` → `#FDFAF6` zemin
- Kart `box-shadow: 0 2px 12px rgba(92,122,90,0.10)`

---

### 6.6 Karbon Badge

Her tarif kartının altında yer alır. Tarif başına kaç kg CO₂ israfının önlendiğini gösterir.

```html
<div class="carbon-badge">
  <div class="carbon-icon">🌱</div>
  <div>
    <p class="carbon-label">Karbon tasarrufu</p>
    <p class="carbon-value">0.8 kg</p>
    <p class="carbon-sub">CO₂ israftan kurtarıldı</p>
  </div>
</div>
```

**Hesaplama mantığı (frontend):**
```js
// Kullanılan malzeme başına ortalama karbon değeri (kg CO₂/kg gıda)
const carbonMap = {
  tavuk: 6.9, dana: 27.0, yumurta: 4.5,
  domates: 1.4, ispanak: 2.0, patates: 0.5,
  makarna: 1.9, pirinç: 2.7, peynir: 13.5,
};

function calcCarbonSaved(ingredients) {
  return ingredients.reduce((total, item) => {
    return total + (carbonMap[item.name] || 1.5) * item.kg;
  }, 0).toFixed(1);
}
```

---

### 6.7 Tasarruf Göstergesi

Kullanıcının aylık birikimli karbon tasarrufunu gösterir.

```html
<div class="streak-card">
  <div>
    <p class="streak-eyebrow">Bu ay kurtardın</p>
    <p class="streak-num">3.2 <span>kg</span></p>
    <p class="streak-label">🌍 3 ağaç dikmeye eşdeğer</p>
  </div>
  <div class="streak-icon" aria-hidden="true">🌿</div>
</div>
```

**Karşılaştırma metinleri (dinamik):**

| CO₂ Aralığı | Metin |
|---|---|
| 0–0.5 kg | "İyi başlangıç! 🌱" |
| 0.5–2 kg | "1 ağaç dikmeye eşdeğer" |
| 2–5 kg | "3 ağaç dikmeye eşdeğer" |
| 5–10 kg | "İstanbul'dan Ankara'ya gidişin %10'u" |
| 10+ kg | "Gerçek bir çevre kahramanısın 🏆" |

---

### 6.8 Butonlar

```html
<!-- Primary — Ana CTA -->
<button class="btn-primary">
  <i class="ti ti-sparkles"></i>
  Tarif Oluştur
</button>

<!-- Secondary — İkincil aksiyon -->
<button class="btn-secondary">Farklı Tarif İste</button>

<!-- Ghost — Yardımcı aksiyon -->
<button class="btn-ghost">
  <i class="ti ti-bookmark"></i> Kaydet
</button>
```

**Stil özeti:**

| Varyant | BG | Border | Metin | Kullanım |
|---|---|---|---|---|
| `btn-primary` | `#5C7A5A` | — | `white` | Ana CTA, her ekranda 1 tane |
| `btn-secondary` | `transparent` | `#5C7A5A` 1.5px | `#5C7A5A` | İkincil aksiyon |
| `btn-ghost` | `#F7F3EE` | `rgba(0,0,0,0.08)` | `#2C2C28` | Kaydet, Paylaş, filtre |

---

## 7. CSS Değişkenleri

```css
:root {
  /* Renkler */
  --sage:          #5C7A5A;
  --sage-light:    #E8F0E7;
  --sage-mid:      #A8C4A5;
  --cream:         #F7F3EE;
  --warm-white:    #FDFAF6;
  --bark:          #6B4F3A;
  --bark-light:    #EDE3DC;
  --charcoal:      #2C2C28;
  --muted:         #7A776F;
  --carbon-green:  #3A6B4A;
  --carbon-bg:     #D4EBD9;
  --amber:         #B87333;
  --amber-bg:      #F5E8D6;

  /* Tipografi */
  --font-display:  'Fraunces', serif;
  --font-body:     'DM Sans', sans-serif;

  /* Border Radius */
  --radius-sm:     8px;
  --radius-md:     14px;
  --radius-lg:     22px;
  --radius-pill:   999px;

  /* Spacing */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  12px;
  --space-lg:  16px;
  --space-xl:  24px;
  --space-2xl: 32px;

  /* Shadow */
  --shadow-card: 0 2px 12px rgba(92, 122, 90, 0.10);
}
```

---

## 8. Uygulama Akışı

```
Ekran 1 — Malzeme Girişi
  └── Input field
  └── Otomatik kategori algılama → renkli tag
  └── "Tarif Oluştur" btn-primary

Ekran 2 — Tarif Listesi
  └── 2–3 tarif kartı (dikey scroll)
  └── Her kartta: başlık, süre, zorluk, karbon badge
  └── "Farklı Tarif İste" btn-secondary

Ekran 3 — Tarif Detay
  └── Malzeme listesi (etiketlere bağlı)
  └── Adım adım yapılış
  └── Büyük karbon tasarruf göstergesi
  └── "Kaydet" + "Paylaş" ghost butonlar

Ekran 4 — Profil / Geçmiş
  └── Aylık CO₂ tasarruf streak kartı
  └── Geçmiş tarifler listesi
```

---

## Tasarım İlkeleri

1. **Organik hissettir** — köşeler yumuşak, renkler doğadan gelir
2. **Suçlamaz, kutlar** — "israf ettin" değil, "değerlendirdin" dili
3. **Somutlaştır** — kg CO₂ rakamını ağaç/yolculuk gibi anlamlı karşılaştırmaya çevir
4. **Mobile-first** — tüm layout'lar 390px baz alınarak tasarlandı, breakpoint `768px`
5. **Hız önce** — yükleme sırasında iskelet (skeleton) gösterilir, boş state asla boş bırakılmaz

---

*leftovers & co. Design System v1.0 — Mayıs 2026*
