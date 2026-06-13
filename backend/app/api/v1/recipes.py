from fastapi import APIRouter, HTTPException, status
from typing import List
from pydantic import BaseModel
# Hoca Kontrolü: Doğru servis fonksiyonu import edildi
from app.services.recipe_service import generate_recipe_from_gemini

router = APIRouter()

class RecipeRequest(BaseModel):
    ingredients: List[str]

class RecipeResponse(BaseModel):
    recipe: str

@router.post("/generate", response_model=RecipeResponse)
async def generate_recipe(request: RecipeRequest):
    if not request.ingredients:
        raise HTTPException(status_code=400, detail="Malzeme listesi boş olamaz.")
    
    # Gerçek Gemini servisine yönlendirme
    recipe_result = await generate_recipe_from_gemini(request.ingredients)
    return RecipeResponse(recipe=recipe_result)