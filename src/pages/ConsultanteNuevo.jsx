import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'

const inicial = {
  nombreBebe: '',
  habitacion: '',
  nombreMama: '',
  edadMama: '',
  historiaClinica: '',
  fechaNacimiento: '',
  hora: '',
  peso: '',
  edadGestacional: '',
  terminacionParto: '',
  gesta: '',
  para: '',
  abortos: '',
  lactanciaAnterior: [
    { edadActual: '', lactanciaHasta: '' },
    { edadActual: '', lactanciaHasta: '' },
    { edadActual: '', lactanciaHasta: '' },
    { edadActual: '', lactanciaHasta: '' },
  ],
  tipoPezones: [],
  prendidaPrimeras2h: '',
  observaciones: '',
}

export default function ConsultanteNuevo() {
  const navigate = useNavigate()
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const [form, setForm] = useState(inicial)
  const [loading, setLoading] = useState(false)
  const [cargando, setCargando] = useState(esEdicion)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!esEdicion) return
    getDoc(doc(db, 'consultantes', id)).then(snap => {
      if (snap.exists()) {
        const data = snap.data()
        setForm({
          ...inicial,
          ...data,
          lactanciaAnterior: data.lactanciaAnterior?.length === 4
            ? data.lactanciaAnterior
            : inicial.lactanciaAnterior,
        })
      }
      setCargando(false)
    })
  }, [id, esEdicion])

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

  function setLactancia(index, subfield, value) {
    setForm(prev => {
      const arr = [...prev.lactanciaAnterior]
      arr[index] = { ...arr[index], [subfield]: value }
      return { ...prev, lactanciaAnterior: arr }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombreMama && !form.nombreBebe) {
      setError('Completá al menos el nombre de la mamá o del bebé.')
      return
    }
    setLoading(true)
    try {
      if (esEdicion) {
        await updateDoc(doc(db, 'consultantes', id), { ...form })
        navigate(`/consultantes/${id}`)
      } else {
        const docRef = await addDoc(collection(db, 'consultantes'), {
          ...form,
          creadoEn: serverTimestamp(),
        })
        navigate(`/consultantes/${docRef.id}`)
      }
    } catch {
      setError('Error al guardar. Intentá nuevamente.')
      setLoading(false)
    }
  }

  if (cargando) return <><Navbar /><div className="loading">Cargando...</div></>

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Link to={esEdicion ? `/consultantes/${id}` : '/panel'} className="btn-ghost">← Volver</Link>
          <h1 className="page-title" style={{ margin: 0 }}>
            {esEdicion ? 'Editar consultante' : 'Nueva consultante'}
          </h1>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card">
            <h2 className="section-title" style={{ marginTop: 0 }}>Planilla de Lactancia Materna</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Apellido y nombre del bebé</label>
                <input type="text" value={form.nombreBebe} onChange={e => set('nombreBebe', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Habitación Nº</label>
                <input type="text" value={form.habitacion} onChange={e => set('habitacion', e.target.value)} />
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: 14 }}>
              <div className="form-group">
                <label>Apellido y nombre de la mamá</label>
                <input type="text" value={form.nombreMama} onChange={e => set('nombreMama', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Edad de la mamá</label>
                <input type="text" value={form.edadMama} onChange={e => set('edadMama', e.target.value)} />
              </div>
            </div>

            <div className="form-grid three" style={{ marginTop: 14 }}>
              <div className="form-group">
                <label>Historia Clínica Nº</label>
                <input type="text" value={form.historiaClinica} onChange={e => set('historiaClinica', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Fecha de nacimiento</label>
                <input type="date" value={form.fechaNacimiento} onChange={e => set('fechaNacimiento', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Hora</label>
                <input type="time" value={form.hora} onChange={e => set('hora', e.target.value)} />
              </div>
            </div>

            <div className="form-grid three" style={{ marginTop: 14 }}>
              <div className="form-group">
                <label>Peso (gr)</label>
                <input type="number" value={form.peso} onChange={e => set('peso', e.target.value)} min="0" />
              </div>
              <div className="form-group">
                <label>Edad Gestacional (semanas)</label>
                <input type="number" value={form.edadGestacional} onChange={e => set('edadGestacional', e.target.value)} min="0" max="45" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label>Terminación del parto</label>
              <div className="radio-group">
                {['vaginal', 'cesarea'].map(v => (
                  <label key={v} className="radio-option">
                    <input type="radio" name="terminacionParto" value={v}
                      checked={form.terminacionParto === v}
                      onChange={() => set('terminacionParto', v)} />
                    {v === 'vaginal' ? 'Vaginal' : 'Cesárea'}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-grid three" style={{ marginTop: 14 }}>
              <div className="form-group">
                <label>Gesta</label>
                <input type="text" value={form.gesta} onChange={e => set('gesta', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Para</label>
                <input type="text" value={form.para} onChange={e => set('para', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Abortos</label>
                <input type="text" value={form.abortos} onChange={e => set('abortos', e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ fontWeight: 700, fontSize: '.9rem', display: 'block', marginBottom: 10 }}>
                Duración de la lactancia en hijos/as anteriores
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {form.lactanciaAnterior.map((item, i) => (
                  <div key={i} style={{ background: 'rgba(201,184,232,.08)', borderRadius: 10, padding: 12 }}>
                    <div className="form-group">
                      <label>Edad actual</label>
                      <input type="text" value={item.edadActual} onChange={e => setLactancia(i, 'edadActual', e.target.value)} placeholder="ej: 3 años" />
                    </div>
                    <div className="form-group" style={{ marginTop: 8 }}>
                      <label>Lactancia hasta</label>
                      <input type="text" value={item.lactanciaHasta} onChange={e => setLactancia(i, 'lactanciaHasta', e.target.value)} placeholder="ej: 6 meses" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Tipo de pezones</label>
              <div className="checkbox-group">
                {[
                  ['protractil', 'Protráctil'],
                  ['umbilicado', 'Umbilicado'],
                  ['retractil', 'Retráctil'],
                  ['plano', 'Plano'],
                ].map(([val, lbl]) => (
                  <label key={val} className="check-option">
                    <input type="checkbox" checked={form.tipoPezones.includes(val)}
                      onChange={() => toggleCheck('tipoPezones', val)} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14 }}>
              <label>¿Se prendió las primeras 2 horas?</label>
              <div className="radio-group">
                {['si', 'no'].map(v => (
                  <label key={v} className="radio-option">
                    <input type="radio" name="prendidaPrimeras2h" value={v}
                      checked={form.prendidaPrimeras2h === v}
                      onChange={() => set('prendidaPrimeras2h', v)} />
                    {v.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Observaciones</label>
              <textarea
                value={form.observaciones}
                onChange={e => set('observaciones', e.target.value)}
                placeholder="Anotaciones adicionales..."
                rows={3}
              />
            </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Guardar consultante'}
            </button>
            <Link to={esEdicion ? `/consultantes/${id}` : '/panel'} className="btn-ghost">Cancelar</Link>
          </div>
        </form>
      </div>
    </>
  )
}
