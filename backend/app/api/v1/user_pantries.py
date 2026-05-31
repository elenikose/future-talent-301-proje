"""Kullanıcı dolabı (user_pantries) API uçları."""

from fastapi import APIRouter, HTTPException, status
from app.database.supabase_client import supabase
from app.schemas.user_pantry import UserPantryCreate, UserPantryResponse

router = APIRouter(prefix="/user-pantries", tags=["User Pantry"])

@router.post("/", response_model=UserPantryResponse, status_code=status.HTTP_201_CREATED)
async def add_to_pantry(pantry_data: UserPantryCreate):
    """Kullanıcının kendi dolabına (user_pantries) yeni malzeme ekler."""
    try:
        dummy_user_id = "00000000-0000-0000-0000-000000000000" 

        payload = {
            "global_ingredient_id": pantry_data.global_ingredient_id,
            "quantity": pantry_data.quantity,
            "unit": pantry_data.unit,
            "expiration_date": str(pantry_data.expiration_date),
            "user_id": dummy_user_id
        }

        response = supabase.table("user_pantries").insert(payload).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Malzeme dolaba eklenemedi."
            )
            
        return response.data[0]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Veritabanı hatası: {str(e)}"
        )


@router.get("/", response_model=list[UserPantryResponse])
async def get_my_pantry():
    """Kullanıcının dolabındaki tüm malzemeleri listeler."""
    try:
        response = supabase.table("user_pantries").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Veritabanı hatası: {str(e)}"
        )


@router.get("/urgent", response_model=list[UserPantryResponse])
async def get_urgent_pantry_items(limit: int = 5):
    """
    SON ÇAĞRI ALGORİTMASI:
    Dolapta son kullanma tarihi en yakın olan ve acil tüketilmesi gereken 
    ilk 'limit' adet malzemeyi kronolojik olarak sıralı getirir.
    """
    try:
        # Sektörel Gerçeklik: Veritabanı seviyesinde 'expiration_date' kolonuna göre 
        # artan sıralama (order.asc) yaparak en acil ürünleri en üste çekiyoruz.
        response = (
            supabase.table("user_pantries")
            .select("*")
            .order("expiration_date")  # Sadece kolon adını bırakıyoruz
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Son Çağrı Algoritma Hatası: {str(e)}"
        )