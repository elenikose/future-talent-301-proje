import os
import google.generativeai as genai
from fastapi import HTTPException
from dotenv import load_dotenv, find_dotenv

# .env dosyasını sisteme yükler
load_dotenv(find_dotenv())

# Sistemdeki Google API Anahtarını çeker
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# API Anahtarı mevcutsa Google SDK'yı yapılandırır
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

async def generate_recipe_from_gemini(ingredients: list) -> str:
    print("\n[INFO] generate_recipe_from_gemini fonksiyonu tetiklendi.")
    print(f"[INFO] API Key durumu: {bool(GOOGLE_API_KEY)}\n")
    
    if not GOOGLE_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="Sunucu hatası: API anahtarı bulunamadı."
        )

    try:
        # Aktif ve kotası açık olan model alias'ı tanımlandı
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = (
           "Sen, gıda israfını önleme odaklı uzman bir şefsin.\n"
            "Senden istenen tarifi tam olarak şu şablona uyarak oluştur:\n\n"
            "**Yemek Adı:** [Buraya yemeğin adını yaz]\n\n"
            "**🌍 Gezegene Katkın:** [Kullanıcının seçtiği bu malzemeleri çöpe gitmekten kurtarmanın doğaya ve karbon ayak izine olan pozitif etkisi hakkında 2 cümlelik, motive edici ve israfı önlemenin önemini anlatan bir mesaj yaz.]\n\n"
            "**Kullanılan Malzemeler:**\n"
            "- [Malzeme 1]\n"
            "- [Malzeme 2]\n\n"
            "**Hazırlanışı:**\n"
            "1. [Adım 1]\n"
            "2. [Adım 2]\n\n"
            "**Önemli:** Yukarıdaki açıklamaların hemen altına, bu tarifi uygulayarak yaklaşık kaç kg CO2 salınımını engellediğimizi 'CO2_Tasarrufu: X kg' şeklinde belirt.\n\n"
            "Kurallar:\n"
            "1. Kullanıcının kilerinde olmayan hiçbir majör malzemeyi tarife ekleme.\n"
            "2. Adım adım yapılışını kısa, net ve anlaşılır ver.\n\n"
            f"Kilerimdeki Malzemeler: {', '.join(ingredients)}"
        )
        
        # Asenkron içerik üretimi çağrısı
        response = await model.generate_content_async(prompt)
        return response.text

    except Exception as e:
        print(f"[ERROR] Google SDK Hatası: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Yapay zeka servisi şu anda yanıt veremiyor veya kota aşıldı."
        )
