import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'

export default function ConsultanteDetalle() {
  const { id } = useParams()
  const [consultante, setConsultante] = useState(null)
  const [visitas, setVisitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandida, setExpandida] = useState(null)

  useEffect(() => {
    async function cargar() {
      const snap = await getDoc(doc(db, 'consultantes', id))
      if (snap.exists()) setConsultante({ id: snap.id, ...snap.data() })

      const q = query(
        collection(db, 'consultantes', id, 'visitas'),
        orderBy('fecha', 'desc')
      )
      const vSnap = await getDocs(q)
      setVisitas(vSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    cargar()
  }, [id])

  if (loading) return <><Navbar /><div className="loading">Cargando...</div></>
  if (!consultante) return <><Navbar /><div className="loading">Consultante no encontrada.</div></>

  const c = consultante

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Link to="/panel" className="btn-ghost">← Volver</Link>
          <h1 className="page-title" style={{ margin: 0 }}>
            {c.nombreBebe || 'Bebé sin nombre'}
          </h1>
        </div>

        {/* ── Ficha Técnica ── */}
        <div className="card">
          <h2 className="section-title" style={{ marginTop: 0 }}>Ficha Técnica</h2>
          <div className="ficha-grid">
            <Campo label="Nombre del bebé" val={c.nombreBebe} />
            <Campo label="Habitación Nº" val={c.habitacion} />
            <Campo label="Nombre de la mamá" val={c.nombreMama} />
            <Campo label="Edad de la mamá" val={c.edadMama} />
            <Campo label="Historia Clínica Nº" val={c.historiaClinica} />
            <Campo label="Fecha de nacimiento" val={formatFecha(c.fechaNacimiento)} />
            <Campo label="Hora" val={c.hora} />
            <Campo label="Peso" val={c.peso ? `${c.peso} gr` : ''} />
            <Campo label="Edad Gestacional" val={c.edadGestacional ? `${c.edadGestacional} semanas` : ''} />
            <Campo label="Terminación del parto" val={c.terminacionParto === 'cesarea' ? 'Cesárea' : c.terminacionParto === 'vaginal' ? 'Vaginal' : ''} />
            <Campo label="Gesta" val={c.gesta} />
            <Campo label="Para" val={c.para} />
            <Campo label="Abortos" val={c.abortos} />
            <Campo label="¿Se prendió primeras 2h?" val={c.prendidaPrimeras2h?.toUpperCase()} />
          </div>

          {/* Tipo de pezones */}
          {c.tipoPezones?.length > 0 && (
            <div className="ficha-field" style={{ marginTop: 16 }}>
              <label>Tipo de pezones</label>
              <p>{c.tipoPezones.map(capitalizarPezon).join(', ')}</p>
            </div>
          )}

          {/* Lactancia anterior */}
          {c.lactanciaAnterior?.some(l => l.edadActual || l.lactanciaHasta) && (
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: '.78rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Lactancia en hijos/as anteriores
              </label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
                {c.lactanciaAnterior.filter(l => l.edadActual || l.lactanciaHasta).map((l, i) => (
                  <div key={i} style={{ background: 'rgba(201,184,232,.1)', borderRadius: 8, padding: '8px 14px', fontSize: '.88rem' }}>
                    <span style={{ color: 'var(--text-soft)' }}>Edad: </span>{l.edadActual || '—'}
                    {' · '}
                    <span style={{ color: 'var(--text-soft)' }}>Lactancia hasta: </span>{l.lactanciaHasta || '—'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observaciones */}
          {c.observaciones && (
            <div className="ficha-field" style={{ marginTop: 16 }}>
              <label>Observaciones</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{c.observaciones}</p>
            </div>
          )}
        </div>

        {/* ── Visitas ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title" style={{ margin: 0, borderBottom: 'none' }}>
            Visitas ({visitas.length})
          </h2>
          <Link to={`/consultantes/${id}/visita`} className="btn-secondary">
            + Nueva visita
          </Link>
        </div>

        {visitas.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-soft)', padding: 32 }}>
            Todavía no hay visitas registradas.
          </div>
        )}

        {visitas.map(v => (
          <div key={v.id} className="visita-card">
            <div className="visita-header" onClick={() => setExpandida(expandida === v.id ? null : v.id)}>
              <h4>📅 {formatFecha(v.fecha)}</h4>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {v.pesoActual && <span className="badge badge-sage">{v.pesoActual} gr</span>}
                {v.prendidaDuranteVisita && (
                  <span className={`badge ${v.prendidaDuranteVisita === 'si' ? 'badge-sage' : 'badge-rose'}`}>
                    Prendida: {v.prendidaDuranteVisita.toUpperCase()}
                  </span>
                )}
                <span style={{ color: 'var(--text-soft)', fontSize: '.9rem' }}>{expandida === v.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expandida === v.id && (
              <div className="visita-body">
                <div className="ficha-grid" style={{ marginTop: 16 }}>
                  <Campo label="¿Se prendió durante la visita?" val={v.prendidaDuranteVisita?.toUpperCase()} />
                  <Campo label="¿Prendida correcta?" val={formatOpcion(v.prendidaCorrecta)} />
                  <Campo label="Posiciones" val={v.posicionesPrendidas?.map(formatPosicion).join(', ')} />
                  <Campo label="Peso actual" val={v.pesoActual ? `${v.pesoActual} gr` : ''} />
                  <Campo label="¿Dificultad en prendida?" val={v.dificultadPrendida?.toUpperCase()} />
                  <Campo label="¿Estimula reflejo búsqueda?" val={v.estimulaReflejoBusqueda?.toUpperCase()} />
                  <Campo label="¿El bebé abre bien la boca?" val={v.bebeAbreBoca?.toUpperCase()} />
                  <Campo label="¿Pega la lengua al paladar?" val={v.pegaLenguaPaladar?.toUpperCase()} />
                  <Campo label="¿Sabe desprender al bebé?" val={formatOpcion(v.sabeDesprender)} />
                  <Campo label="Pezones" val={v.pezones?.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')} />
                  <Campo label="Alimentación" val={v.alimentacion?.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')} />
                  <Campo label="Chupete" val={formatChupete(v.chupete)} />
                  <Campo label="¿Conoce extracción de calostro?" val={formatOpcion(v.conoceExtraccionCalostro)} />
                </div>

                {v.pezones?.includes('agrietados') && (
                  <div className="subsection" style={{ marginTop: 14 }}>
                    <label style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text)' }}>Si pezones agrietados</label>
                    <div className="ficha-grid" style={{ marginTop: 8 }}>
                      <Campo label="Corrige prendida" val={v.siAgrietados?.corrigePrendida?.toUpperCase()} />
                      <Campo label="Aplica calostro/leche" val={v.siAgrietados?.aplicaCalostro?.toUpperCase()} />
                      <Campo label="Usa pezoneras" val={v.siAgrietados?.usaPezoneras?.toUpperCase()} />
                      <Campo label="Suspende tomas" val={v.siAgrietados?.suspendeTomas?.toUpperCase()} />
                    </div>
                  </div>
                )}

                {v.otras && (
                  <div className="ficha-field" style={{ marginTop: 12 }}>
                    <label>Otras observaciones</label>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{v.otras}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

function Campo({ label, val }) {
  if (!val) return null
  return (
    <div className="ficha-field">
      <label>{label}</label>
      <p>{val}</p>
    </div>
  )
}

function formatFecha(f) {
  if (!f) return ''
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}

function formatOpcion(v) {
  if (!v) return ''
  const map = { si: 'SÍ', no: 'NO', se_corrige: 'Se corrige', se_muestra: 'Se muestra' }
  return map[v] || v
}

function formatPosicion(v) {
  const map = { clasica: 'Clásica', rev: 'Reversa', inv: 'Invertida', recostada: 'Recostada', otras: 'Otras' }
  return map[v] || v
}

function formatChupete(v) {
  const map = { no: 'NO', si: 'SÍ', recomienda_suspender: 'Recomienda suspender' }
  return map[v] || v
}

function capitalizarPezon(v) {
  const map = { protractil: 'Protráctil', umbilicado: 'Umbilicado', retractil: 'Retráctil', plano: 'Plano' }
  return map[v] || v
}
