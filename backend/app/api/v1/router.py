from fastapi import APIRouter
from app.api.v1.recipes import router as recipes_router

api_v1_router = APIRouter()

# 🚀 Şef Gemini'nin odasını merkez santrale mühürlüyoruz
api_v1_router.include_router(recipes_router, prefix="/recipes", tags=["AI Recipe"])