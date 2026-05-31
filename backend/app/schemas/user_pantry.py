"""Kullanıcı kileri/dolabı (user_pantries) API şemaları."""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class UserPantryBase(BaseModel):
    """Kiler işlemleri için ortak baz model."""
    quantity: float = Field(..., description="Malzemenin miktarı (örn: 1.5, 500.0)")
    unit: str = Field(..., max_length=20, description="Miktar birimi (örn: adet, gram, ml)")
    expiration_date: date = Field(..., description="Son Tüketim Tarihi (YYYY-MM-DD)")


class UserPantryCreate(BaseModel):
    """Kullanıcının dolabına yeni malzeme ekleme isteği (POST)."""
    global_ingredient_id: str = Field(..., description="global_ingredients tablosundaki benzersiz ID")
    quantity: float = Field(..., gt=0, description="Eklenecek miktar sıfırdan büyük olmalı")
    unit: str = Field("adet", max_length=20, description="Birim (varsayılan: adet)")
    expiration_date: date = Field(..., description="Son Tüketim Tarihi")


class UserPantryResponse(UserPantryBase):
    """Dolaptan malzeme listelerken dönecek yanıt modeli (GET)."""
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Pantry satırının kendi benzersiz ID'si")
    user_id: str = Field(..., description="Malzemenin ait olduğu kullanıcının ID'si")
    global_ingredient_id: str = Field(..., description="İlişkili global malzeme ID'si")
    created_at: datetime
    updated_at: datetime