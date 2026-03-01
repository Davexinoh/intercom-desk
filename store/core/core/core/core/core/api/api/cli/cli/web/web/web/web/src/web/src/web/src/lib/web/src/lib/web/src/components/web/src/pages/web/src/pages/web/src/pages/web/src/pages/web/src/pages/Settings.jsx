import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Settings() {
  const [autoMode, setAutoMode] = useState(true)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    api.getSettings().then(s => setAutoMode(s.autoMode))
  }, [])

  async function toggle() {
    const next = !autoMode
    await api.setAuto(next)
    setAutoMode(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>⚙️ Settings</h1>

      <div style={{ background: '#13132a', border: '1px solid #1e1e3a', borderRadius: 12, padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Auto-Resolve Mode</div>
            <div style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>
              Automatically resolve simple tickets (e.g. password resets) using macro templates.
            </div>
          </div>
          <button onClick={toggle} style={{
            background: autoMode ? '#6366f1' : '#1e1e3a',
            border: '2px solid ' + (autoMode ? '#818cf8' : '#374151'),
            borderRadius: 100, width: 48, height: 26, cursor: 'pointer',
            position: 'relative', transition: 'all 0.2s',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 2,
              left: autoMode ? 24 : 4, transition: 'left 0.2s',
            }} />
          </button>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: autoMode ? '#22c55e' : '#6b7280' }}>
          {autoMode ? '✅ Auto-resolve is ON' : '⭕ Auto-resolve is OFF'}
        </div>
      </div>

      {saved && (
        <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#4ade80' }}>
          ✅ Settings saved
        </div>
      )}

      <div style={{ background: '#13132a', border: '1px solid #1e1e3a', borderRadius: 12, padding: 20, marginTop: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>About</div>
        <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.7 }}>
          <div>Intercom Desk — Davexinoh Fork</div>
          <div>Built on the Intercom ecosystem</div>
          <div style={{ marginTop: 6 }}>
            <a href='https://github.com/Trac-Systems/intercom' target='_blank' style={{ color: '#6366f1' }}>
              Upstream: github.com/Trac-Systems/intercom
            </a>
          </div>
        </div>
      </div>
    </div>
  )
          }
