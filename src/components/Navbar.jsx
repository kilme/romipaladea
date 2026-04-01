import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function Navbar() {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut(auth)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/panel" className="navbar-brand">
        🌸 Romina Paladea
      </Link>
      <button onClick={handleLogout} className="btn-logout">
        Cerrar sesión
      </button>
    </nav>
  )
}
