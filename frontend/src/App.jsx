import { useState, useEffect } from 'react'
import Login from './Login.jsx'
import Register from './Register.jsx'
import ProductAdd from './ProductAdd.jsx'
import { supabase } from './supabaseClient'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authScreen, setAuthScreen] = useState('login')

  useEffect(() => {
    // 1. Uygulama açılışında mevcut oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 2. Oturum değişikliğini (Giriş/Çıkış) canlı dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Oturum kapandıysa kullanıcıyı login ekranına zorla
      if (!session) {
        setAuthScreen('login')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  function handleLoginSuccess(userData) {
    setUser(userData)
  }

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setAuthScreen('login')
    setLoading(false)
  }

  // Oturum kontrolü bitene kadar kullanıcıya "Yükleniyor" ekranı göster
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#10b981' }}>
        <h3>Yükleniyor... 🌍</h3>
      </div>
    )
  }

  // Oturum durumuna göre ekranları yönet
  return (
    <>
      {user ? (
        <ProductAdd onLogout={handleLogout} />
      ) : (
        authScreen === 'login' ? (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => setAuthScreen('register')} 
          />
        ) : (
          <Register 
            onRegisterSuccess={handleLoginSuccess} 
            onNavigateToLogin={() => setAuthScreen('login')} 
          />
        )
      )}
    </>
  )
}
