import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { timeAgo, PRIORITY_COLORS, STATUS_COLORS } from '../lib/format'

const badge = (label, color) => (
  <span style={{
    background: color + '22', color, border: `1px solid ${color}44`,
    borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700,
  }}>{label}</span>
)

export default function Inbox({ nav }) {
  const [tickets,  setTickets]  = useState([])
  const [status,   setStatus]   = useState('open')
  const [priority, setPriority] = useState('')
  const [q,        setQ]        = useState('')
  const [loading,  setLoading]  = useState(true)

  async function load() {
    setLoading(true)
    const data = await api.getTickets({ status, priority, q })
    setTickets(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [status, priority, q])

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>📨 Inbox</h1>
        <span style={{ background: '#1e1e3a', borderRadius: 100, padding: '2px 10px', fontSize: 12, color: '#a5b4fc' }}>
          {tickets.length}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['open','closed','pending'].map(s => (
          <button key={s} onClick={() => setStatus(s)} style={{
            padding: '5px 14px', borderRadius: 100, border: '1px solid #1e1e3a',
            background: status === s ? '#6366f1' : 'transparent',
            color: status === s ? 'white' : '#6b7280', cursor: 'pointer', fontSize: 12,
          }}>{s}</button>
        ))}
        <select value={priority} onChange={e => setPriority(e.target.value)} style={{
          background: '#0a0a18', border: '1px solid #1e1e3a', color: '#9ca3af',
          borderRadius: 8, padding: '5px 10px', fontSize: 12,
        }}>
          <option value=''>All Priorities</option>
          <option value='high'>High</option>
          <option value='medium'>Medium</option>
          <option value='low'>Low</option>
        </select>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search tickets...'
          style={{
            flex: 1, minWidth: 140, background: '#0a0a18', border: '1px solid #1e1e3a',
            color: '#e2e8f0', borderRadius: 8, padding: '5px 12px', fontSize: 12,
          }} />
        <button onClick={() => nav('intake')} style={{
          background: '#6366f1', border: 'none', color: 'white', borderRadius: 8,
          padding: '6px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>+ New</button>
      </div>

      {loading
        ? <div style={{ color: '#4b5563', textAlign: 'center', padding: 40 }}>Loading...</div>
        : tickets.length === 0
        ? <div style={{ color: '#4b5563', textAlign: 'center', padding: 40 }}>No tickets found.</div>
        : tickets.map(t => (
          <div key={t.id} onClick={() => nav('ticket', t.id)}
            style={{
              background: '#13132a', border: '1px solid #1e1e3a', borderRadius: 12,
              padding: '14px 16px', marginBottom: 8, cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e3a'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#4b5563' }}>#{t.id}</span>
              {badge(t.status, STATUS_COLORS[t.status])}
              {badge(t.priority, PRIORITY_COLORS[t.priority])}
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>{t.subject}</span>
              <span style={{ fontSize: 11, color: '#4b5563' }}>{timeAgo(t.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#4b5563' }}>
              <span>{t.category} / {t.subcategory}</span>
              {t.assignedTo && <span>→ {t.assignedTo}</span>}
              <span>{t.thread.length} messages</span>
            </div>
          </div>
        ))
      }
    </div>
  )
      }
