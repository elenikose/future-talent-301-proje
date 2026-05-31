"""
Supabase migration'larını uzak veritabanına uygular.

Gerekli (.env — birini kullanın):
  DATABASE_URL  — Dashboard → Database → Connection string → URI (Session pooler, önerilen)
  veya SUPABASE_URL + SUPABASE_DB_PASSWORD

İsteğe bağlı:
  SUPABASE_DB_REGION  — örn. eu-central-1 (pooler host için)
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from urllib.parse import quote_plus

import psycopg

_BACKEND = Path(__file__).resolve().parents[1]
_REPO = _BACKEND.parent
_MIGRATIONS = _REPO / "supabase" / "migrations"

if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from dotenv import load_dotenv  # noqa: E402

load_dotenv(_BACKEND / ".env")

from app.core.config import get_settings  # noqa: E402


def _project_ref(supabase_url: str) -> str:
    host = supabase_url.replace("https://", "").replace("http://", "").split("/")[0]
    return host.split(".")[0]


def build_database_url() -> str:
    direct = os.getenv("DATABASE_URL", "").strip()
    if direct:
        return direct

    settings = get_settings()
    settings.require_supabase()
    password = os.getenv("SUPABASE_DB_PASSWORD", "").strip()
    if not password:
        raise SystemExit(
            "\n❌ DATABASE_URL veya SUPABASE_DB_PASSWORD .env içinde yok.\n"
        )

    ref = _project_ref(settings.supabase_url)
    region = os.getenv("SUPABASE_DB_REGION", "eu-central-1").strip()
    safe = quote_plus(password)
    return (
        f"postgresql://postgres.{ref}:{safe}@aws-0-{region}.pooler.supabase.com:5432/postgres"
    )


def apply_migrations(db_url: str) -> None:
    files = sorted(_MIGRATIONS.glob("*.sql"))
    if not files:
        raise SystemExit(f"Migration dosyası bulunamadı: {_MIGRATIONS}")

    with psycopg.connect(db_url, autocommit=True) as conn:
        for path in files:
            sql = path.read_text(encoding="utf-8")
            print(f"  → {path.name}")
            conn.execute(sql)


def main() -> None:
    print("Veritabanına bağlanılıyor...")
    db_url = build_database_url()
    print("Migration'lar uygulanıyor...")
    apply_migrations(db_url)
    print("\n✓ Tablolar oluşturuldu. Supabase → Table Editor'da yenileyin.")


if __name__ == "__main__":
    main()
