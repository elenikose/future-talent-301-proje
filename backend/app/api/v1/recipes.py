"""Gemini API Destekli Akıllı Tarif Öneri Motoru."""

from fastapi import APIRouter, HTTPException, status
from app.database.supabase_client import supabase
import os
from google import genai

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/suggest", status_code=status.HTTP_200_OK)
async def suggest_ai_recipes():
    """
    SON ÇAĞRI YAPAY ZEKA MOTORU:
    Dolapta son kullanma tarihi en yakın olan malzemeleri çeker,
    malzeme adlarını eşleştirir ve Gemini API'sine göndererek 
    israfı önleyecek dinamik tarif önerileri üretir.
    """
    try:
        # 1. Dolaptaki son kullanma tarihi en yakın olan ilk 5 malzemeyi çekiyoruz
        urgent_pantry = (
            supabase.table("user_pantries")
            .select("*")
            .order("expiration_date")
            .limit(5)
            .execute()
        )
        
        if not urgent_pantry.data:
            return {
                "message": "Dolabınızda acil tüketilmesi gereken bir malzeme bulunamadı.",
                "recipe_suggestion": None
            }

        # 2. Malzeme ID'lerini isimlere dönüştürmek için küresel malzemeleri çekiyoruz
        ingredients_response = supabase.table("global_ingredients").select("id, name").execute()
        ingredient_map = {item["id"]: item["name"] for item in ingredients_response.data} if ingredients_response.data else {}

        # 3. Gemini'a göndermek için malzemeleri anlamlı bir metin haline getiriyoruz
        ingredients_text = ""
        for item in urgent_pantry.data:
            # Supabase tablandaki sütun ismine göre burayı güncelledik (Önce ingredient_id'ye, yoksa global_ingredient_id'ye bakar)
            ing_id = item.get("ingredient_id") or item.get("global_ingredient_id")
            
            # Sözlükten ismi çekiyoruz, eğer yine bulamazsa en azından 'Bilinmeyen Malzeme' yazar ki yapay zeka çuvallamasın
            ing_name = ingredient_map.get(ing_id, f"Bilinmeyen Malzeme (ID: {ing_id})") 
            
            # 🔍 SEKTÖREL DEBUG SATIRI: Terminale hangi ID'nin patladığını basıyoruz
            print(f"\n[DEBUG] KONTROL EDİLEN ID: {ing_id} -> EŞLEŞEN İSİM: {ing_name}\n")
            
            ingredients_text += f"- Malzeme: {ing_name}, Miktar: {item['quantity']} {item['unit']}, Son Tüketim Tarihi: {item['expiration_date']}\n"

        # 4. .env dosyasından API anahtarını kontrol ediyoruz
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GEMINI_API_KEY ortam değişkeni bulunamadı. Lütfen .env dosyanızı kontrol edin."
            )

        # 5. Gemini İstemcisini başlatıyoruz ve istemi (prompt) gönderiyoruz
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
        Sen 'Son Çağrı' (LastCall) adlı sürdürülebilirlik ve gıda atığı önleme uygulamasının akıllı şefisin.
        Sana kullanıcının dolabında son kullanma tarihi çok yaklaşmış olan malzemeleri veriyorum.
        Bu malzemeleri odak noktasına alarak, israfı engelleyecek yaratıcı, pratik ve lezzetli BİR TARİF öner.
        Gerekiyorsa evde bulunabilecek temel malzemeleri ekleyebilirsin (tuz, yağ, su vb.).
        
        Acil Tüketilmesi Gereken Malzemeler:
        {ingredients_text}
        
        Lütfen yanıtı şu başlıklarla net ve Türkçe olarak ver:
        1. Tarif Adı (Neden bu malzemeleri seçtiğini belirten esprili/sürdürülebilir bir isim)
        2. Kurtarılan Malzemeler
        3. Hazırlanışı (Adım adım)
        4. Şefin Sürdürülebilirlik Notu (Gıda israfı hakkında farkındalık mesajı)
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )

        return {
            "message": "Gemini Akıllı Şef dolabındaki acil malzemeleri analiz etti ve tarifini hazırladı!",
            "recipe_suggestion": response.text
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Yapay Zeka Motoru Hatası: {str(e)}"
        )