import { useState } from 'react'
import { supabase } from './supabaseClient' 
import './Register.css' 

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) throw error

      if (data?.user) {
        console.log("Supabase'e gerçek kayıt yapıldı. ID:", data.user.id);
        onRegisterSuccess(data.user)
      }
    } catch (error) {
      setErrorMessage(error.message || 'Kayıt esnasında bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Son Çağrı'ya Katıl 🌍</h2>
        <p className="register-subtitle">Hesap oluşturarak verilerinizi bulutta güvenle saklayın.</p>
        
        {errorMessage && <div className="register-error">{errorMessage}</div>}

        <form onSubmit={handleRegister} className="register-form">
          <div className="register-input-group">
            <label className="register-label">E-posta Adresi</label>
            <input
              type="email"
              placeholder="ornek@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="register-input"
            />
          </div>

          <div className="register-input-group">
            <label className="register-label">Şifre</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="register-input"
            />
            {/* Sektör Standardı UX Düzeltmesi: Şifre kısıtlaması inputun hemen altına eklendi */}
            <p style={{
              fontSize: '0.75rem', 
              color: '#64748b', 
              marginTop: '6px', 
              textAlign: 'left',
              width: '100%',
              paddingLeft: '4px'
            }}>
              * Güvenliğiniz için şifreniz en az 6 karakterden oluşmalıdır.
            </p>
          </div>

          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Hesap Oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="register-footer-text">
          Zaten hesabınız var mı?{' '}
          <span onClick={onNavigateToLogin} className="register-link">
            Giriş Yap
          </span>
        </p>
      </div>
    </div>
  )
}