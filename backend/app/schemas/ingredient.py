from pydantic import BaseModel
from datetime import datetime

# Ortak malzeme özellikleri (Tüm malzeme şemaları bunu miras alacak)
class IngredientBase(BaseModel):
    name: str
    quantity: float
    unit: str  # adet, gram, ml, paket vb.
    expiration_date: datetime  # Son Çağrı algoritmasının kritik değişkeni!

# Kullanıcı arayüzünden (Frontend) veri gelirken kullanılacak şema
class IngredientCreate(IngredientBase):
    pass

# API'den kullanıcıya cevap dönerken kullanılacak şema
class IngredientResponse(IngredientBase):
    id: int
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True