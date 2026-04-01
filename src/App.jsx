import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ConsultanteNuevo from './pages/ConsultanteNuevo'
import ConsultanteDetalle from './pages/ConsultanteDetalle'
import VisitaNueva from './pages/VisitaNueva'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/consultantes/nuevo" element={<ProtectedRoute><ConsultanteNuevo /></ProtectedRoute>} />
        <Route path="/consultantes/:id" element={<ProtectedRoute><ConsultanteDetalle /></ProtectedRoute>} />
        <Route path="/consultantes/:id/visita" element={<ProtectedRoute><VisitaNueva /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}
