import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const user = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate('/panel', { replace: true })
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate('/panel')
    } catch (err) {
      setError(traducirError(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      navigate('/panel')
    } catch (err) {
      setError(traducirError(err.code))
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: 20, textDecoration: 'none', fontSize: '1.4rem' }}>🌸</Link>
        <h2>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        <p className="login-subtitle">
          {isRegister ? 'Primera vez en el sistema' : 'Accedé a tu panel de consultantes'}
        </p>

        {error && <div className="error-msg">{error}</div>}

        <button onClick={handleGoogle} className="btn-google">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.6 35.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37 39.6 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/>
          </svg>
          Continuar con Google
        </button>

        <div className="login-divider"><span>o</span></div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        <div className="login-toggle">
          {isRegister ? '¿Ya tenés cuenta?' : '¿Primera vez?'}{' '}
          <button onClick={() => { setIsRegister(!isRegister); setError('') }}>
            {isRegister ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </div>
      </div>
    </div>
  )
}

function traducirError(code) {
  const map = {
    'auth/user-not-found': 'No existe una cuenta con ese email.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ese email ya está registrado.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email': 'El email no es válido.',
    'auth/too-many-requests': 'Demasiados intentos. Intentá más tarde.',
    'auth/popup-closed-by-user': 'Se cerró el popup antes de completar el login.',
  }
  return map[code] || 'Ocurrió un error. Intentá nuevamente.'
}
