import { useState } from 'react'
import BrandTitle from './components/BrandTitle.jsx'
import './styles/forms.css'
import './ProductAdd.css'

export default function ProductAdd({ onLogout }) {
  const [productName, setProductName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [products, setProducts] = useState([])

  function handleSubmit(event) {
    event.preventDefault()
    setSuccessMessage(null)

    if (!productName.trim()) {
      setFieldError('Ürün adı gerekli.')
      return
    }

    setFieldError(null)
    setProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: productName.trim(),
        expiryDate: expiryDate || null,
      },
    ])
    setSuccessMessage(`${productName.trim()} kilerine eklendi.`)
    setProductName('')
    setExpiryDate('')
  }

  return (
    <main className="product-page">
      <header className="product-header">
        <BrandTitle showTagline={false} />
        {onLogout && (
          <button type="button" className="btn-ghost product-logout" onClick={onLogout}>
            <i className="ti ti-logout" aria-hidden="true" />
            Çıkış yap
          </button>
        )}
      </header>

      <div className="product-card">
        <p className="section-heading">Kilerine malzeme ekle</p>

        <form className="app-form" onSubmit={handleSubmit} noValidate>
          {fieldError && (
            <p className="form-alert form-alert--error" role="alert">
              {fieldError}
            </p>
          )}
          {successMessage && (
            <p className="form-alert form-alert--success" role="status">
              {successMessage}
            </p>
          )}

          <div className="input-wrapper">
            <label className="form-label" htmlFor="product-name">
              Ürün adı
            </label>
            <input
              id="product-name"
              className={`input-field${fieldError ? ' input-field--error' : ''}`}
              type="text"
              name="productName"
              placeholder="Örn: domates, tavuk"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value)
                if (fieldError) setFieldError(null)
              }}
              aria-invalid={Boolean(fieldError)}
            />
          </div>

          <div className="input-wrapper">
            <label className="form-label" htmlFor="product-expiry">
              Son tüketim tarihi
            </label>
            <input
              id="product-expiry"
              className="input-field"
              type="date"
              name="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
            <p className="input-hint input-hint--muted">İsteğe bağlı — boş bırakılabilir.</p>
          </div>

          <button type="submit" className="btn-primary">
            <i className="ti ti-plus" aria-hidden="true" />
            Ürün ekle
          </button>
        </form>

        {products.length > 0 && (
          <section className="product-list" aria-label="Eklenen ürünler">
            <p className="section-heading">Kilerindekiler</p>
            <ul className="product-list-items">
              {products.map((item) => (
                <li key={item.id} className="product-list-item">
                  <span className="product-list-name">{item.name}</span>
                  {item.expiryDate && (
                    <span className="product-list-date">
                      SKT: {new Date(item.expiryDate + 'T12:00:00').toLocaleDateString('tr-TR')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
