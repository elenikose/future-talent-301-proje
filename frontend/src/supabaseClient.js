import { createClient } from '@supabase/supabase-js'

// Şifreler koda gömülmüyor, Vite'ın çevre değişkenlerinden güvenle çekiliyor.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)