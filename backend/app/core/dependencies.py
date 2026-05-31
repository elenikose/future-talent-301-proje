"""FastAPI Depends — ortak bağımlılıklar."""

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import UserContext, resolve_user_from_token

_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(_bearer)
    ],
) -> UserContext:
    """Korunan uç noktalarda zorunlu Bearer JWT."""
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yetkilendirme gerekli.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return resolve_user_from_token(credentials.credentials)
