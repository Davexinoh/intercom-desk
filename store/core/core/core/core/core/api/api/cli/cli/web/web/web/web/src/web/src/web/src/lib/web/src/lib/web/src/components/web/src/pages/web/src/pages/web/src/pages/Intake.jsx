import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Intake({ nav }) {
  const [categories, setCategories] = useState([])
  const [catId,      setCatId]      = useState('')
  const [subId,      setSubId]      = useState('')
  const [subject,    setSubject]    = useState('')
  const [message,    setMessage]    = useState('')
  const [created,    setCreated]    = useState(null)
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    api.getComplaints().then(setCategories)
  }, [])

  const cat = categories.find(c => c.id === catId)

  async function submit() {
    if (!catId || !subId || !subject.trim()) return
    setLoading(true)
    const t = await api.createTicket({ category: catId, subcategory: subId, subject, userMessage: message })
    setCreated(t)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', background: '#0a0a18', border: '1px solid #1e1e3a',
    color: '#e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 13,
    fontFamily: 'inherit', marginBottom: 12,
  }

  if (created) return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <div style={{ background: '#0a1f0a', border: '1px solid #166534', borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <h2 style={{ color: '#4ade80', margin: '0 0 8px' }}>Ticket #{created.id} Created!</h2>
        <p style={{ color: '#6b7280', marginBottom: 4 }}>
          Priority: <strong style={{ color: created.priority === 'high' ? '#ef4444' : created.priority === 'medium' ? '#f59e0b' : '#22c55e' }}>
            {created.priority.toUpperCase()}
          </strong>
        </p>
        {created.status === 'pending' && (
          <p style={{ color: '#a855f7', fontSize: 13 }}>⚡ Auto-resolved by rules engine</p>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button onClick={() => nav('ticket', created.id)} style={{
            background: '#6366f1', border: 'none', color: 'white',
            borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 700,
          }}>View Ticket</button>
          <button onClick={() => { setCreated(null); setCatId(''); setSubId(''); setSubject(''); setMessage('') }} style={{
            background: '#1e1e3a', border: '1px solid #374151', color: '#9ca3af',
            borderRadius: 8, padding: '8px 20px', cursor: 'pointer',
          }}>New Complaint</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#e2e8f0' }}>✍️ New Complaint</h1>
      <p style={{ color: '#4b5563', fontSize: 13, marginBottom: 20 }}>Select a category and describe your issue.</p>

      <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Category</label>
      <select value={catId} onChange={e => { setCatId(e.target.value); setSubId('') }} style={inputStyle}>
        <option value=''>Select a category...</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>

      {cat && (
        <>
          <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Subcategory</label>
          <select value={subId} onChange={e => setSubId(e.target.value)} style={inputStyle}>
            <option value=''>Select a subcategory...</option>
            {cat.subcategories.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </>
      )}

      {subId && (
        <>
          <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            placeholder='Brief summary of your issue'
            style={{ ...inputStyle, marginBottom: 12 }} />

          <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Description</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            rows={4} placeholder='Tell us more about what happened...'
            style={{ ...inputStyle, resize: 'vertical' }} />

          <button onClick={submit} disabled={loading || !subject.trim()} style={{
            width: '100%', background: loading ? '#374151' : '#6366f1',
            border: 'none', color: 'white', borderRadius: 10,
            padding: '12px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Creating...' : 'Submit Complaint →'}
          </button>
        </>
      )}
    </div>
  )
      }
