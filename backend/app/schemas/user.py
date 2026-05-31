"""Kullanıcı profili API şemaları."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserProfileResponse(BaseModel):
    """GET /users/me yanıtı."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr | None = None
    display_name: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class UserProfileCreate(BaseModel):
    """Kayıt sonrası profil satırı oluşturma (POST /users/me)."""

    display_name: str | None = Field(
        default=None,
        max_length=80,
        description="Profilde görünen ad (opsiyonel).",
    )


class UserProfileUpdate(BaseModel):
    """Profil güncelleme (PATCH /users/me)."""

    display_name: str | None = Field(default=None, max_length=80)


class UserDeleteResponse(BaseModel):
    """Hesap silme (KVKK) yanıtı."""

    message: str
    deleted: bool = True
