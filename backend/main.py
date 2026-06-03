import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Son Çağrı API",
    description="Dolaptaki malzemelerin son dakikalarını yakalayan akıllı backend",
    version="1.0.0"
)

url: str = os.environ.get("SUPABASE_URL", "")
# Burayı ANON_KEY yerine SERVICE_ROLE_KEY yapıyoruz ki RLS duvarını aşabilsin:
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not url or not key:
    raise ValueError("Supabase URL veya Service Role Key .env dosyasında bulunamadı!")

db: Client = create_client(url, key)

# --- GERÇEK SUPABASE ŞEMASINA UYGUN MODELLER ---
class IngredientCreate(BaseModel):
    name: str
    category: Optional[str] = "Genel"
    default_shelf_days: int
    carbon_factor_kg_per_kg: Optional[float] = 0.0
    default_weight_grams: Optional[int] = 0

class IngredientResponse(BaseModel):
    id: UUID
    name: str
    category: Optional[str]
    default_shelf_days: int
    carbon_factor_kg_per_kg: Optional[float]
    default_weight_grams: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


@app.get("/")
def read_root():
    return {"status": "Sistem Ayakta", "proje": "Son Çağrı"}


# --- MALZEME ENDPOINTLERİ ---

@app.post("/ingredients", response_model=IngredientResponse, tags=["Ingredients"])
def create_ingredient(ingredient: IngredientCreate):
    """
    Supabase üzerindeki gerçek 'global_ingredients' tablosuna yeni malzeme ekler.
    """
    try:
        response = db.table("global_ingredients").insert({
            "name": ingredient.name,
            "category": ingredient.category,
            "default_shelf_days": ingredient.default_shelf_days,
            "carbon_factor_kg_per_kg": ingredient.carbon_factor_kg_per_kg,
            "default_weight_grams": ingredient.default_weight_grams
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Malzeme veritabanına eklenemedi.")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase Hatası: {str(e)}")


@app.get("/ingredients", response_model=List[IngredientResponse], tags=["Ingredients"])
def get_ingredients():
    """
    Raf ömrü en kısa olan malzemeleri en üstte listeler.
    """
    try:
        response = db.table("global_ingredients").select("*").order("default_shelf_days", desc=False).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase Hatası: {str(e)}")