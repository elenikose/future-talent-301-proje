"""Kullanıcı profili CRUD ve KVKK hesap silme iş kuralları."""

from datetime import datetime, timezone

from fastapi import HTTPException, status
from postgrest.exceptions import APIError

from app.core.security import UserContext
from app.database.supabase_client import get_supabase
from app.schemas.user import UserProfileCreate, UserProfileResponse, UserProfileUpdate


def _row_to_profile(row: dict, email: str | None) -> UserProfileResponse:
    return UserProfileResponse(
        id=str(row["id"]),
        email=email,
        display_name=row.get("display_name"),
        created_at=row.get("created_at"),
        updated_at=row.get("updated_at"),
    )


def _fetch_profile_row(user_id: str) -> dict | None:
    client = get_supabase()
    result = client.table("profiles").select("*").eq("id", user_id).execute()
    rows = result.data or []
    return rows[0] if rows else None


def get_profile(current_user: UserContext) -> UserProfileResponse:
    """Mevcut kullanıcının profilini döner; satır yoksa yalnızca auth bilgisi."""
    row = _fetch_profile_row(current_user.id)
    if row is None:
        return UserProfileResponse(
            id=current_user.id,
            email=current_user.email,
            display_name=None,
            created_at=None,
            updated_at=None,
        )
    return _row_to_profile(row, current_user.email)


def create_profile(
    current_user: UserContext,
    body: UserProfileCreate,
) -> UserProfileResponse:
    """İlk giriş/kayıt sonrası profiles satırı oluşturur veya günceller."""
    if not current_user.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-posta bilgisi oturumda bulunamadı.",
        )

    now = datetime.now(timezone.utc).isoformat()
    payload = {
        "id": current_user.id,
        "email": current_user.email,
        "display_name": body.display_name,
        "updated_at": now,
    }

    existing = _fetch_profile_row(current_user.id)
    if existing is None:
        payload["created_at"] = now

    client = get_supabase()
    try:
        result = (
            client.table("profiles")
            .upsert(payload, on_conflict="id")
            .execute()
        )
    except APIError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Profil kaydedilemedi.",
        ) from exc

    row = result.data[0] if result.data else payload
    return _row_to_profile(row, current_user.email)


def update_profile(
    current_user: UserContext,
    body: UserProfileUpdate,
) -> UserProfileResponse:
    """Profil alanlarını günceller."""
    fields = body.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Güncellenecek en az bir alan gerekli.",
        )

    existing = _fetch_profile_row(current_user.id)
    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil bulunamadı. Önce POST /api/v1/users/me ile oluşturun.",
        )

    now = datetime.now(timezone.utc).isoformat()
    payload = {**fields, "updated_at": now}
    client = get_supabase()
    try:
        result = (
            client.table("profiles")
            .update(payload)
            .eq("id", current_user.id)
            .execute()
        )
    except APIError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Profil güncellenemedi.",
        ) from exc

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil bulunamadı.",
        )

    return _row_to_profile(result.data[0], current_user.email)


def delete_account(user_id: str) -> None:
    """
    KVKK unutulma hakkı: kiler kalıcı silinir, ledger anonimleştirilir,
    ardından Supabase Auth kullanıcısı kaldırılır (PRD §5).
    """
    client = get_supabase()

    try:
        client.table("user_pantries").delete().eq("user_id", user_id).execute()
    except APIError:
        pass

    try:
        client.table("user_savings_ledger").update({"user_id": None}).eq(
            "user_id", user_id
        ).execute()
    except APIError:
        pass

    try:
        client.table("recipe_confirmations").delete().eq("user_id", user_id).execute()
    except APIError:
        pass

    try:
        client.table("profiles").delete().eq("id", user_id).execute()
    except APIError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Profil silinemedi.",
        ) from exc

    try:
        client.auth.admin.delete_user(user_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Hesap tamamen silinemedi.",
        ) from exc
