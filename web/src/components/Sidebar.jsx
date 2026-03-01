const LINKS = [
  { id: 'inbox',     icon: '📨', label: 'Inbox' },
  { id: 'intake',    icon: '✍️',  label: 'New Complaint' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'settings',  icon: '⚙️',  label: 'Settings' },
]

export default function Sidebar({ current, nav }) {
  return (
    <aside style={{
      width: 200, background: '#0a0a18', borderRight: '1px solid #1e1e3a',
      display: 'flex', flexDirection: 'column', padding: '16px 0',
    }}>
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #1e1e3a' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em' }}>INTERCOM DESK</div>
        <div style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>Davexinoh Fork</div>
      </div>
      <nav style={{ marginTop: 12 }}>
        {LINKS.map(l => (
          <button key={l.id} onClick={() => nav(l.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 16px', border: 'none',
            background: current === l.id ? '#1e1e3a' : 'transparent',
            color: current === l.id ? '#a5b4fc' : '#6b7280',
            cursor: 'pointer', fontSize: 13, fontWeight: current === l.id ? 600 : 400,
            borderLeft: current === l.id ? '3px solid #6366f1' : '3px solid transparent',
            textAlign: 'left',
          }}>
            <span>{l.icon}</span> {l.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
