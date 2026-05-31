"""JWT doğrulama ve kullanıcı bağlamı."""

from dataclasses import dataclass

from fastapi import HTTPException, status
from supabase import AuthApiError

from app.database.supabase_client import get_supabase


@dataclass(frozen=True)
class UserContext:
    """Doğrulanmış oturumdan çıkarılan kimlik; user_id gövdeden okunmaz."""

    id: str
    email: str | None


def resolve_user_from_token(access_token: str) -> UserContext:
    """Bearer JWT ile Supabase Auth üzerinden kullanıcıyı çözümler."""
    client = get_supabase()
    try:
        response = client.auth.get_user(access_token)
    except AuthApiError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Oturum geçersiz veya süresi dolmuş.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user = response.user
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Oturum doğrulanamadı.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return UserContext(id=user.id, email=user.email)
