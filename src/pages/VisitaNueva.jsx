import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'

const hoy = new Date().toISOString().split('T')[0]

const inicial = {
  fecha: hoy,
  prendidaDuranteVisita: '',
  posicionesPrendidas: [],
  prendidaCorrecta: '',
  pesoActual: '',
  dificultadPrendida: '',
  estimulaReflejoBusqueda: '',
  bebeAbreBoca: '',
  pegaLenguaPaladar: '',
  otras: '',
  sabeDesprender: '',
  pezones: [],
  siAgrietados: {
    corrigePrendida: '',
    aplicaCalostro: '',
    usaPezoneras: '',
    suspendeTomas: '',
  },
  conoceExtraccionCalostro: '',
  alimentacion: [],
  chupete: '',
}

export default function VisitaNueva() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(inicial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function toggleCheck(field, value) {
    setForm(prev => {
      const arr = prev[field]
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  function setAgrietados(field, value) {
    setForm(prev => ({ ...prev, siAgrietados: { ...prev.siAgrietados, [field]: value } }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fecha) { setError('La fecha es obligatoria.'); return }
    setLoading(true)
    try {
      await addDoc(collection(db, 'consultantes', id, 'visitas'), {
        ...form,
        creadoEn: serverTimestamp(),
      })
      navigate(`/consultantes/${id}`)
    } catch {
      setError('Error al guardar. Intentá nuevamente.')
      setLoading(false)
    }
  }

  const tieneAgrietados = form.pezones.includes('agrietados')

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Link to={`/consultantes/${id}`} className="btn-ghost">← Volver</Link>
          <h1 className="page-title" style={{ margin: 0 }}>Nueva visita</h1>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card">
            {/* Fecha */}
            <div className="form-group" style={{ maxWidth: 200 }}>
              <label>Fecha</label>
              <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} required />
            </div>

            {/* Prendida durante la visita */}
            <h2 className="section-title">Prendida</h2>

            <div className="form-group">
              <label>¿Se prendió durante la visita?</label>
              <div className="radio-group">
                <Radio name="prendidaDuranteVisita" value="si" label="SÍ" form={form} set={set} />
                <Radio name="prendidaDuranteVisita" value="no" label="NO" form={form} set={set} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label>Posiciones de las prendidas</label>
              <div className="checkbox-group">
                {[
                  ['clasica', 'Clásica'],
                  ['rev', 'Reversa'],
                  ['inv', 'Invertida'],
                  ['recostada', 'Recostada'],
                  ['otras', 'Otras'],
                ].map(([val, lbl]) => (
                  <label key={val} className="check-option">
                    <input type="checkbox" checked={form.posicionesPrendidas.includes(val)}
                      onChange={() => toggleCheck('posicionesPrendidas', val)} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label>¿Prendida correcta?</label>
              <div className="radio-group">
                <Radio name="prendidaCorrecta" value="si" label="SÍ" form={form} set={set} />
                <Radio name="prendidaCorrecta" value="no" label="NO" form={form} set={set} />
                <Radio name="prendidaCorrecta" value="se_corrige" label="Se corrige" form={form} set={set} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14, maxWidth: 220 }}>
              <label>Peso actual (gr)</label>
              <input type="number" value={form.pesoActual} onChange={e => set('pesoActual', e.target.value)} min="0" />
            </div>

            {/* Dificultades */}
            <h2 className="section-title">Dificultades</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>¿Dificultad en prendida?</label>
                <div className="radio-group">
                  <Radio name="dificultadPrendida" value="si" label="SÍ" form={form} set={set} />
                  <Radio name="dificultadPrendida" value="no" label="NO" form={form} set={set} />
                </div>
              </div>
              <div className="form-group">
                <label>¿Estimula reflejo búsqueda?</label>
                <div className="radio-group">
                  <Radio name="estimulaReflejoBusqueda" value="si" label="SÍ" form={form} set={set} />
                  <Radio name="estimulaReflejoBusqueda" value="no" label="NO" form={form} set={set} />
                </div>
              </div>
              <div className="form-group">
                <label>¿El bebé abre bien la boca?</label>
                <div className="radio-group">
                  <Radio name="bebeAbreBoca" value="si" label="SÍ" form={form} set={set} />
                  <Radio name="bebeAbreBoca" value="no" label="NO" form={form} set={set} />
                </div>
              </div>
              <div className="form-group">
                <label>¿Pega la lengua al paladar?</label>
                <div className="radio-group">
                  <Radio name="pegaLenguaPaladar" value="si" label="SÍ" form={form} set={set} />
                  <Radio name="pegaLenguaPaladar" value="no" label="NO" form={form} set={set} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label>¿Sabe desprender al bebé?</label>
              <div className="radio-group">
                <Radio name="sabeDesprender" value="si" label="SÍ" form={form} set={set} />
                <Radio name="sabeDesprender" value="no" label="NO" form={form} set={set} />
                <Radio name="sabeDesprender" value="se_muestra" label="Se muestra" form={form} set={set} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label>¿Otras?</label>
              <input type="text" value={form.otras} onChange={e => set('otras', e.target.value)} />
            </div>

            {/* Pezones */}
            <h2 className="section-title">Pezones</h2>

            <div className="form-group">
              <label>Estado de los pezones</label>
              <div className="checkbox-group">
                {['sanos', 'agrietados', 'enrojecidos'].map(v => (
                  <label key={v} className="check-option">
                    <input type="checkbox" checked={form.pezones.includes(v)}
                      onChange={() => toggleCheck('pezones', v)} />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {tieneAgrietados && (
              <div className="subsection" style={{ marginTop: 12 }}>
                <label style={{ fontWeight: 700, fontSize: '.9rem', display: 'block', marginBottom: 12 }}>
                  Si pezones agrietados
                </label>
                <div className="form-grid">
                  {[
                    ['corrigePrendida', '¿Corrige prendida?'],
                    ['aplicaCalostro', '¿Aplica calostro (o leche)?'],
                    ['usaPezoneras', '¿Usa pezoneras?'],
                    ['suspendeTomas', '¿Suspende tomas?'],
                  ].map(([field, lbl]) => (
                    <div key={field} className="form-group">
                      <label>{lbl}</label>
                      <div className="radio-group">
                        {['si', 'no'].map(v => (
                          <label key={v} className="radio-option">
                            <input type="radio" name={`agrietados_${field}`} value={v}
                              checked={form.siAgrietados[field] === v}
                              onChange={() => setAgrietados(field, v)} />
                            {v.toUpperCase()}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calostro / Alimentación / Chupete */}
            <h2 className="section-title">Alimentación y técnica</h2>

            <div className="form-group">
              <label>¿Conoce la técnica de extracción de calostro?</label>
              <div className="radio-group">
                <Radio name="conoceExtraccionCalostro" value="si" label="SÍ" form={form} set={set} />
                <Radio name="conoceExtraccionCalostro" value="no" label="NO" form={form} set={set} />
                <Radio name="conoceExtraccionCalostro" value="se_muestra" label="Se muestra" form={form} set={set} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label>Alimentación</label>
              <div className="checkbox-group">
                {[['pecho', 'Pecho'], ['formula', 'Fórmula']].map(([val, lbl]) => (
                  <label key={val} className="check-option">
                    <input type="checkbox" checked={form.alimentacion.includes(val)}
                      onChange={() => toggleCheck('alimentacion', val)} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label>Chupete</label>
              <div className="radio-group">
                <Radio name="chupete" value="no" label="NO" form={form} set={set} />
                <Radio name="chupete" value="si" label="SÍ" form={form} set={set} />
                <Radio name="chupete" value="recomienda_suspender" label="Recomienda suspender" form={form} set={set} />
              </div>
            </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-secondary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar visita'}
            </button>
            <Link to={`/consultantes/${id}`} className="btn-ghost">Cancelar</Link>
          </div>
        </form>
      </div>
    </>
  )
}

function Radio({ name, value, label, form, set }) {
  return (
    <label className="radio-option">
      <input
        type="radio"
        name={name}
        value={value}
        checked={form[name] === value}
        onChange={() => set(name, value)}
      />
      {label}
    </label>
  )
}
