import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Rotaları tek bir merkezden toplamak için api_v1_router'ı çağırıyoruz
from app.api.v1.router import api_v1_router

load_dotenv()

app = FastAPI(
    title="Son Çağrı API",
    description="Sürdürülebilirlik Odaklı Yemek Tarifi Üretim Sistemi",
    version="1.0.0"
)

# SEKTÖR STANDARDI CORS AYARLARI
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite/React varsayılan portu
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROTA BAĞLANTISI: api_v1_router zaten içinde '/recipes' barındırıyor.
# Bu yüzden prefix'i sadece '/api/v1' yapıyoruz. 
# Böylece tam adres: /api/v1/recipes/generate oluyor ve api.js ile tam eşleşiyor!
app.include_router(api_v1_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Son Çağrı API tıkır tıkır çalışıyor!"}