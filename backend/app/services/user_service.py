from app.db.supabase import supabase_client

async def create_user_record(user_id: str, email: str):
    return supabase_client.table("users").insert({"id": user_id, "email": email}).execute()

async def get_user_preferences(user_id: str):
    response = supabase_client.table("user_preferences").select("*").eq("user_id", user_id).execute()
    return response.data