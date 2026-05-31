"""Kullanıcı profili CRUD — kimlik Supabase Auth, profil profiles tablosu."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.core.security import UserContext
from app.schemas.user import (
    UserDeleteResponse,
    UserProfileCreate,
    UserProfileResponse,
    UserProfileUpdate,
)
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfileResponse)
def read_me(
    current_user: Annotated[UserContext, Depends(get_current_user)],
) -> UserProfileResponse:
    """Oturum açmış kullanıcının profilini okur."""
    return user_service.get_profile(current_user)


@router.post(
    "/me",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_me(
    body: UserProfileCreate,
    current_user: Annotated[UserContext, Depends(get_current_user)],
) -> UserProfileResponse:
    """Kayıt sonrası profil satırı oluşturur (upsert)."""
    return user_service.create_profile(current_user, body)


@router.patch("/me", response_model=UserProfileResponse)
def update_me(
    body: UserProfileUpdate,
    current_user: Annotated[UserContext, Depends(get_current_user)],
) -> UserProfileResponse:
    """Görünen ad vb. profil alanlarını günceller."""
    return user_service.update_profile(current_user, body)


@router.delete("/me", response_model=UserDeleteResponse)
def delete_me(
    current_user: Annotated[UserContext, Depends(get_current_user)],
) -> UserDeleteResponse:
    """KVKK: kiler silinir, tasarruf ledger anonimleştirilir, hesap kaldırılır."""
    user_service.delete_account(current_user.id)
    return UserDeleteResponse(
        message="Hesabın ve kiler verilerin silindi. Tasarruf istatistikleri anonim olarak korunuyor.",
        deleted=True,
    )
