"""API v1 alt router birleştirici."""

from fastapi import APIRouter

# Sektörel Not: Yeni oluşturduğumuz recipes dosyasını buraya import olarak ekliyoruz
from app.api.v1 import health, users, user_pantries, recipes

api_v1_router = APIRouter()

# Mevcut sistem endpoint'leri
api_v1_router.include_router(health.router)
api_v1_router.include_router(users.router)

# Yeni eklenen Kullanıcı Dolabı (User Pantry) endpoint'i
api_v1_router.include_router(user_pantries.router)

# SON ÇAĞRI: Gemini API Destekli Akıllı Tarif Motoru endpoint'i
api_v1_router.include_router(recipes.router)