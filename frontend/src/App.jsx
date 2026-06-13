import { useState, useEffect } from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'
import ProductAdd from './ProductAdd.jsx'
import { supabase } from './supabaseClient'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // İlk yükleme anındaki boşluğu yönetmek için
  const [authScreen, setAuthScreen] = useState('login')

  useEffect(() => {
    // 1. Sayfa ilk açıldığında aktif bir Supabase oturumu var mı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 2. Oturum durumunu (Giriş, Çıkış, Token Yenilenmesi) sürekli dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Bileşen kapandığında dinleyiciyi temizle (Memory leak önleme)
    return () => subscription.unsubscribe()
  }, [])

  function handleLoginSuccess(userData) {
    // Supabase giriş anında onAuthStateChange zaten tetikleneceği için 
    // sadece state'i garantiye alıyoruz, localStorage ile manuel uğraşmıyoruz.
    setUser(userData)
  }

  async function handleLogout() {
    setLoading(true)
    // Supabase'e güvenli çıkış isteği atıyoruz, tarayıcıyı o temizliyor
    await supabase.auth.signOut()
    setUser(null)
    setAuthScreen('login')
    setLoading(false)
  }

  // Supabase oturum kontrolünü yaparken ekranda beyaz boşluk kalmasın diye loading koyuyoruz
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#10b981' }}>
        <h3>Yükleniyor... 🌍</h3>
      </div>
    )
  }

  return (
    <>
      {user ? (
        <ProductAdd onLogout={handleLogout} />
      ) : authScreen === 'login' ? (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onNavigateToRegister={() => setAuthScreen('register')} 
        />
      ) : (
        <Register 
          onRegisterSuccess={handleLoginSuccess} 
          onNavigateToLogin={() => setAuthScreen('login')} 
        />
      )}
    </>
  )
}