export default function BrandTitle({ showTagline = true }) {
  return (
    <>
      <h1 className="app-brand">
        <em>Son</em>
        <span> Çağrı</span>
      </h1>
      {showTagline && <p className="app-tagline">Dolaptakileri değerlendir.</p>}
    </>
  )
}
