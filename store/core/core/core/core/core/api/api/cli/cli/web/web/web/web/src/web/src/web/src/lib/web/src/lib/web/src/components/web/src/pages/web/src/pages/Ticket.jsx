import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { fmtDate, PRIORITY_COLORS, STATUS_COLORS } from '../lib/format'

const badge = (label, color) => (
  <span style={{
    background: color + '22', color, border: `1px solid ${color}44`,
    borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700,
  }}>{label}</span>
)

export default function Ticket({ id, nav }) {
  const [ticket,    setTicket]    = useState(null)
  const [agents,    setAgents]    = useState([])
  const [macros,    setMacros]    = useState([])
  const [replyText, setReplyText] = useState('')
  const [suggest,   setSuggest]   = useState('')
  const [tone,      setTone]      = useState('professional')
  const [loading,   setLoading]   = useState(true)

  async function load() {
    const [t, ag, mc] = await Promise.all([api.getTicket(id), api.getAgents(), api.getMacros()])
    setTicket(t); setAgents(ag); setMacros(mc); setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function sendReply() {
    if (!replyText.trim()) return
    const t = await api.reply(id, replyText)
    setTicket(t); setReplyText(''); setSuggest('')
  }

  async function closeTicket() {
    const t = await api.close(id)
    setTicket(t)
  }

  async function getSuggestion() {
    const { suggestion } = await api.suggest(id, tone)
    setSuggest(suggestion)
  }

  async function insertMacro(key) {
    const m = await api.getMacro(key)
    setReplyText(prev => prev ? prev + '\n\n' + m.text : m.text)
  }

  async function assignTo(name) {
    const t = await api.assign(id, name)
    setTicket(t)
  }

  async function setPriority(p) {
    const t = await api.setPriority(id, p)
    setTicket(t)
  }

  if (loading) return <div style={{ color: '#4b5563', padding: 40, textAlign: 'center' }}>Loading...</div>
  if (!ticket) return <div style={{ color: '#ef4444', padding: 40 }}>Ticket not found.</div>

  const inputStyle = {
    background: '#0a0a18', border: '1px solid #1e1e3a', color: '#e2e8f0',
    borderRadius: 8, padding: '6px 10px', fontSize: 12,
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, display: 'flex', gap: 20 }}>
      <div style={{ flex: 1 }}>
        <button onClick={() => nav('inbox')} style={{ ...inputStyle, cursor: 'pointer', marginBottom: 16 }}>← Back</button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: 0, flex: 1 }}>
            #{ticket.id} — {ticket.subject}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {badge(ticket.status, STATUS_COLORS[ticket.status])}
          {badge(ticket.priority, PRIORITY_COLORS[ticket.priority])}
          <span style={{ fontSize: 11, color: '#4b5563' }}>{ticket.category} / {ticket.subcategory}</span>
          <span style={{ fontSize: 11, color: '#4b5563' }}>Created: {fmtDate(ticket.createdAt)}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <select onChange={e => assignTo(e.target.value)} value={ticket.assignedTo || ''} style={inputStyle}>
            <option value=''>Unassigned</option>
            {agents.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
          <select onChange={e => setPriority(e.target.value)} value={ticket.priority} style={inputStyle}>
            <option value='high'>🔴 High</option>
            <option value='medium'>🟡 Medium</option>
            <option value='low'>🟢 Low</option>
          </select>
          {ticket.status !== 'closed' && (
            <button onClick={closeTicket} style={{
              background: '#1f2937', border: '1px solid #374151', color: '#9ca3af',
              borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer',
            }}>✓ Close Ticket</button>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          {ticket.thread.map((m, i) => {
            const isAgent  = m.role === 'agent'
            const isSystem = m.role === 'system'
            return (
              <div key={i} style={{
                background: isSystem ? 'transparent' : isAgent ? '#0f1a2e' : '#13132a',
                border: isSystem ? 'none' : '1px solid #1e1e3a',
                borderRadius: 10, padding: isSystem ? '4px 0' : '12px 14px',
                marginBottom: 8,
                borderLeft: isAgent ? '3px solid #6366f1' : isSystem ? 'none' : '3px solid #374151',
              }}>
                {!isSystem && (
                  <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 6 }}>
                    {isAgent ? '🎧 Agent' : '👤 User'} · {fmtDate(m.at)}
                  </div>
                )}
                <div style={{
                  fontSize: isSystem ? 11 : 13, color: isSystem ? '#374151' : '#d1d5db',
                  whiteSpace: 'pre-wrap', fontStyle: isSystem ? 'italic' : 'normal',
                  textAlign: isSystem ? 'center' : 'left',
                }}>{m.text}</div>
              </div>
            )
          })}
        </div>

        {ticket.status !== 'closed' && (
          <div style={{ background: '#13132a', border: '1px solid #1e1e3a', borderRadius: 12, padding: 14 }}>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              rows={5}
              placeholder='Type your reply...'
              style={{
                width: '100%', background: '#0a0a18', border: '1px solid #1e1e3a',
                color: '#e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 13,
                resize: 'vertical', fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
              <button onClick={sendReply} style={{
                background: '#6366f1', border: 'none', color: 'white',
                borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>Send Reply →</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ width: 240, flexShrink: 0 }}>
        <div style={{ background: '#13132a', border: '1px solid #1e1e3a', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', marginBottom: 8 }}>✨ Suggested Reply</div>
          <select value={tone} onChange={e => setTone(e.target.value)} style={{ ...inputStyle, width: '100%', marginBottom: 8 }}>
            <option value='professional'>Professional</option>
            <option value='friendly'>Friendly</option>
            <option value='short'>Short</option>
          </select>
          <button onClick={getSuggestion} style={{
            width: '100%', background: '#1e1e3a', border: '1px solid #374151', color: '#a5b4fc',
            borderRadius: 8, padding: '6px', fontSize: 12, cursor: 'pointer', marginBottom: 8,
          }}>Generate</button>
          {suggest && (
            <>
              <div style={{ fontSize: 11, color: '#6b7280', background: '#0a0a18', borderRadius: 8, padding: 8, marginBottom: 6, whiteSpace: 'pre-wrap', maxHeight: 150, overflow: 'auto' }}>
                {suggest}
              </div>
              <button onClick={() => setReplyText(suggest)} style={{
                width: '100%', background: '#6366f1', border: 'none', color: 'white',
                borderRadius: 8, padding: '6px', fontSize: 11, cursor: 'pointer',
              }}>Insert into Reply</button>
            </>
          )}
        </div>

        <div style={{ background: '#13132a', border: '1px solid #1e1e3a', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', marginBottom: 8 }}>⚡ Macros</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {macros.map(m => (
              <button key={m.key} onClick={() => insertMacro(m.key)} style={{
                background: '#1e1e3a', border: '1px solid #374151', color: '#9ca3af',
                borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer',
              }}>{m.name}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
                                   }
