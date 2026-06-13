# 📈 Son Çağrı (Project LastCall) — Geliştirme Günlüğü (Progress Ledger)

Bu doküman, "Son Çağrı" MVP Faz 1 geliştirme sürecinde karşılaşılan bloklayan hataları (blocker bugs), teknik kriz anlarını ve üretilen mühendislik çözümlerini kayıt altında tutar.

---

## 🛠️ Karşılaşılan Kritik Hatalar ve Çözüm Günlüğü (Bug Fix Log)

### Hata 001: API Rate Limit Çökmesi (429 Too Many Requests)
* **Semptom:** Test aşamasında Google Gemini Free Tier kotasının (günlük limitler) aşılması üzerine sistem aniden `500 Internal Server Error` fırlattı ve arayüz tamamen kilitlendi.
* **Mühendislik Çözümü:** 1. API anahtarları kodun içinden sökülerek güvenli `.env` katmanına taşındı ve rotasyona uygun hale getirildi.
  2. Kullanıcının hiçbir malzeme seçmeden "Üret" butonuna basarak API kotasını boşa harcamasını engellemek için ön yüze katı JS validasyon blokları eklendi.
  3. Çökme senaryoları için `try-catch` blokları güçlendirildi; sistemin çökmesi engellenerek kullanıcıya şık uyarı mesajları dönülmesi sağlandı.

### Hata 002: React Object Rendering Kriz Anı (White Screen of Death)
* **Semptom:** Backend'den dönen Pydantic JSON modelinin frontend tarafında doğrudan bir state içerisine nesne (object) olarak basılmaya çalışılması sonucu React motoru çöktü ve ekran tamamen beyaza döndü.
* **Mühendislik Çözümü:** Ham verinin doğrudan render edilemeyeceği gerçeğiyle yüzleşildi. State yapısı revize edilerek, gelen yanıt parse edildi ve yapay zekanın ürettiği temiz string verisi (`res.recipe`) izole edilerek arayüze güvenli bir şekilde aktarıldı.

### Hata 003: Yapay Zeka Metin Ayrıştırma (Markdown Parsing) Hatası
* **Semptom:** Gemini API'den dönen tariflerde, modelin sistem promptunu manipüle ederek ürettiği `**Yemek Adı:**` gibi çiğ ve redundant (tekrarlayan) etiketler React arayüzünde çok çirkin ve çift başlıklı bir görüntü oluşturuyordu.
* **Mühendislik Çözümü:** Ön yüzde `ReactMarkdown` bileşeninin hemen girişine Regex (Düzenli İfadeler) filtresi entegre edildi: `replace(/\*\*Yemek Adı:\*\*\s*.*/i, '')`. Bu sayede yapay zekanın ürettiği çiğ başlık metinleri runtime'da yakalanarak tamamen gizlendi ve temizlendi.

### Hata 004: Karbon Ayak İzi (CO2) İstatistiksel Halüsinasyon Riski
* **Semptom:** İlk aşamada yapay zekadan tarife göre karbon tasarrufunu hesaplaması istendi. Ancak LLM'lerin matematiksel işlemlerde "halüsinasyon" (her istekte tamamen uydurma ve tutarsız rakamlar vermesi) gördüğü ve istatistiksel tutarlılığı bozduğu tespit edildi.
* **Mühendislik Çözümü:** Sayısal veri üretim yetkisi yapay zekanın elinden tamamen alındı. Frontend tarafında deterministik (girdi adedine bağlı, kesin sonuç üreten) bir matematiksel model kuruldu: `(itemCount * 0.45).toFixed(1)`. Veri tutarlılığı %100 garanti altına alındı.

### Hata 005: Kiler Manuel Giriş Sürtünmesi ve UX Tıkanıklığı
* **Semptom:** Kullanıcı testlerinde, her malzemenin önce Kiler ekranına gidilip veritabanına kaydedilmesi zorunluluğunun kullanıcıyı uygulamadan soğuttuğu ve sistem esnekliğini öldürdüğü (user friction) fark edildi.
* **Mühendislik Çözümü:** Çevik (Agile) bir kararla, "Tarif Üret" modalının içerisine veritabanına kayıt zorunluluğu olmayan **"Anlık (Ad-hoc) Malzeme Girdisi"** eklendi. Kullanıcının o an tezgahında duran anlık ürünleri (örn: yarım limon) kilerini bozmadan tarife katabilmesi sağlandı, payload dinamikleştirildi.

### Hata 006: Kök Dizin Dosya Kirliliği ve Rota Çakışması
* **Semptom:** Proje ilk oluşturulurken kök dizinde unutulan eski `main.py` dosyası ile `backend/app/main.py` rotaları çakışıyor, Git üzerinde sürüm karmaşası yaratıyordu.
* **Mühendislik Çözümü:** Temiz Kod (Clean Code) prensipleri gereğince kök dizindeki eski ve atıl durumdaki 469 satırlık kod tamamen silindi. Projenin kalbi tekil olarak `backend/app/` mimarisine delege edildi.