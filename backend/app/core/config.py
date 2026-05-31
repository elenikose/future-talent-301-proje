"""Ortam değişkenleri ve uygulama ayarları."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """`.env` dosyasından okunan yapılandırma."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    gemini_api_key: str | None = None
    api_version: str = "0.1.0"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    def require_supabase(self) -> None:
        if not self.supabase_url or not self.supabase_service_role_key:
            raise ValueError(
                "SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env içinde tanımlı olmalı."
            )


@lru_cache
def get_settings() -> Settings:
    return Settings()
