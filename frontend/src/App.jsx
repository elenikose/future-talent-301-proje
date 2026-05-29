import { useState } from 'react'
import Login from './Login.jsx'
import ProductAdd from './ProductAdd.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (isLoggedIn) {
    return <ProductAdd onLogout={() => setIsLoggedIn(false)} />
  }

  return (
    <Login
      simulateAuth
      onSubmit={async () => {
        setIsLoggedIn(true)
      }}
    />
  )
}

export default App
