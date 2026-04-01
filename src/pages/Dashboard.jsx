import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const [consultantes, setConsultantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    async function cargar() {
      const q = query(collection(db, 'consultantes'), orderBy('creadoEn', 'desc'))
      const snap = await getDocs(q)
      setConsultantes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    cargar()
  }, [])

  const filtrados = consultantes.filter(c => {
    const term = busqueda.toLowerCase()
    return (
      c.nombreBebe?.toLowerCase().includes(term) ||
      c.nombreMama?.toLowerCase().includes(term) ||
      c.historiaClinica?.toLowerCase().includes(term)
    )
  })

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 className="page-title" style={{ margin: 0 }}>Consultantes</h1>
          <Link to="/consultantes/nuevo" className="btn-primary">
            + Nueva consultante
          </Link>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre del bebé, mamá o historia clínica..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ maxWidth: 420 }}
          />
        </div>

        {loading && <div className="loading">Cargando...</div>}

        {!loading && filtrados.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-soft)', padding: 40 }}>
            {busqueda ? 'Sin resultados para esa búsqueda.' : 'Todavía no hay consultantes cargadas.'}
          </div>
        )}

        {filtrados.map(c => (
          <Link key={c.id} to={`/consultantes/${c.id}`} className="consultante-card">
            <h3>
              👶 {c.nombreBebe || '(sin nombre del bebé)'}
            </h3>
            <p>
              Mamá: {c.nombreMama || '—'}
              {c.historiaClinica && ` · HC: ${c.historiaClinica}`}
              {c.fechaNacimiento && ` · Nacimiento: ${formatFecha(c.fechaNacimiento)}`}
            </p>
          </Link>
        ))}
      </div>
    </>
  )
}

function formatFecha(f) {
  if (!f) return ''
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}
