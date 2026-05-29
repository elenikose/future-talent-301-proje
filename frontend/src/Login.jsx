import { useState } from 'react'
import BrandTitle from './components/BrandTitle.jsx'
import './Login.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateFields(email, password) {
  const errors = {}

  if (!email.trim() || !password) {
    errors.form = 'E-posta ve şifre gerekli.'
    if (!email.trim()) errors.email = 'E-posta ve şifre gerekli.'
    if (!password) errors.password = 'E-posta ve şifre gerekli.'
    return errors
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Geçerli bir e-posta adresi gir.'
  }

  return errors
}

/**
 * MVP giriş ekranı — yalnızca e-posta / şifre (Google yok).
 * @param {{ onSubmit?: (credentials: { email: string, password: string }) => void | Promise<void>, simulateAuth?: boolean, authError?: string | null, isLoading?: boolean, registerHref?: string, forgotHref?: string }} props
 */
export default function Login({
  onSubmit,
  simulateAuth = false,
  authError = null,
  isLoading = false,
  registerHref = '/kayit',
  forgotHref = '/sifremi-unuttum',
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)

    if (simulateAuth && onSubmit) {
      await onSubmit({ email: email.trim(), password })
      return
    }

    const errors = validateFields(email, password)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError(errors.form ?? null)
      return
    }

    setFieldErrors({})

    if (!onSubmit) {
      return
    }

    try {
      await onSubmit({ email: email.trim(), password })
    } catch {
      setFormError('Bağlantı kurulamadı. Biraz sonra tekrar dene.')
    }
  }

  const displayError =
    authError ?? formError ?? (fieldErrors.form && !fieldErrors.email && !fieldErrors.password ? fieldErrors.form : null)

  return (
    <main className="login-page">
      <div className="login-card">
        <BrandTitle />

        <p className="login-heading">Giriş yap</p>

        <form className="app-form" onSubmit={handleSubmit} noValidate>
          {displayError && (
            <p className="auth-alert" role="alert">
              {displayError}
            </p>
          )}

          <div className="input-wrapper">
            <label className="form-label" htmlFor="login-email">
              E-posta
            </label>
            <input
              id="login-email"
              className={`input-field${fieldErrors.email ? ' input-field--error' : ''}`}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="ornek@eposta.com"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="login-email-error" className="input-hint" role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="input-wrapper">
            <label className="form-label" htmlFor="login-password">
              Şifre
            </label>
            <input
              id="login-password"
              className={`input-field${fieldErrors.password ? ' input-field--error' : ''}`}
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
              }}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="login-password-error" className="input-hint" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            <i className="ti ti-login" aria-hidden="true" />
            {isLoading ? 'Giriş yapılıyor…' : 'Giriş yap'}
          </button>
        </form>

        <footer className="login-footer">
          <a className="auth-link" href={forgotHref}>
            Şifremi unuttum
          </a>
          <a className="auth-link" href={registerHref}>
            Hesabın yok mu? Kayıt ol
          </a>
        </footer>
      </div>
    </main>
  )
}
