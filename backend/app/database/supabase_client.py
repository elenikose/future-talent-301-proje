import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY", "")

if not url or not key:
    raise ValueError("SUPABASE_URL ve geçerli bir API Key .env içinde tanımlı olmalı.")

# 1. Doğrudan nesne olarak çağıran dosyalar için (Bizim yeni kodlarımız)
supabase: Client = create_client(url, key)

# 2. Eski kodların (users.py, health.py vb.) bağımlılık olarak beklediği fonksiyon
def get_supabase() -> Client:
    """Eski mimariyle uyumluluk için Supabase istemcisini döner."""
    return supabase