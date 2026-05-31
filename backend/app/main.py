import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# api/v1 altındaki tüm yönlendiricileri toplayan ana köprüyü içeri alıyoruz
from app.api.v1.router import api_v1_router

# .env içerisindeki şifreleri yüklüyoruz
load_dotenv()

app = FastAPI(
    title="Son Çağrı API",
    description="Dolaptaki malzemelerin son dakikalarını yakalayan akıllı backend",
    version="1.0.0"
)

# Sektörel Gereklilik: Yarın öbür gün frontend (arayüz) bağlanırken 
# CORS engeline takılmamak için bu middleware ayarını ekliyoruz.
# main.py içindeki ilgili kısmı sadece bu hale getir:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bizim az önce yazdığımız o zengin v1 router'ını ana uygulamaya bağlıyoruz.
# Böylece /api/v1/health, /api/v1/users ve /api/v1/user-pantries tek kalemde aktif olacak.
app.include_router(api_v1_router, prefix="/api/v1")


# Küresel eski rota desteği (Swagger'da kalması için)
from app.database.supabase_client import supabase
from typing import List
from fastapi import HTTPException
from pydantic import BaseModel

class IngredientCreate(BaseModel):
    name: str
    category: str = "Diğer"
    default_shelf_days: int
    carbon_factor_kg_per_kg: float = 0.0
    default_weight_grams: int = 100

class IngredientResponse(BaseModel):
    id: str
    name: str
    category: str
    default_shelf_days: int
    carbon_factor_kg_per_kg: float
    default_weight_grams: int

@app.get("/", tags=["Root"])
def read_root():
    return {"status": "Sistem Ayakta", "proje": "Son Çağrı MVP"}

@app.post("/ingredients", response_model=IngredientResponse, tags=["Global Ingredients"])
def create_ingredient(ingredient: IngredientCreate):
    try:
        response = supabase.table("global_ingredients").insert(ingredient.model_dump()).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Malzeme eklenemedi.")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ingredients", response_model=List[IngredientResponse], tags=["Global Ingredients"])
def get_ingredients():
    try:
        response = supabase.table("global_ingredients").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))