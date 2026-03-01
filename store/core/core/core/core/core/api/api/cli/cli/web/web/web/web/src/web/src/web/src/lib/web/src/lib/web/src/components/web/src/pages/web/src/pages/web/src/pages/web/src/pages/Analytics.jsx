import { useEffect, useState } from 'react'
import { api } from '../lib/api'

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: '#13132a', border: `1px solid ${color}33`,
      borderRadius: 12, padding: '16px 20px', minWidth: 140,
    }}>
      <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

export default function Analytics() {
  const [stats, setStats] = useState(null)

  useEffect(() => { api.getStats().then(setStats) }, [])

  if (!stats) return <div style={{ color: '#4b5563', padding: 40, textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>📊 Analytics</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard label='Open Tickets'   value={stats.openCount}        color='#3b82f6' />
        <StatCard label='Closed Today'   value={stats.closedToday}      color='#22c55e' />
        <StatCard label='Total Closed'   value={stats.closedTotal}      color='#a5b4fc' />
        <StatCard label='Auto-Resolved'  value={stats.autoResolved}     color='#a855f7' />
        <StatCard label='Avg 1st Reply'  value={stats.avgFirstResponse} color='#f59e0b' />
        <StatCard label='Avg Resolution' value={stats.avgResolution}    color='#f97316' />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          ['🔴 High',   stats.priorities.high,   '#ef4444'],
          ['🟡 Medium', stats.priorities.medium, '#f59e0b'],
          ['🟢 Low',    stats.priorities.low,    '#22c55e'],
        ].map(([label, val, color]) => (
          <div key={label} style={{ background: '#13132a', border: `1px solid ${color}33`, borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#4b5563' }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260, background: '#13132a', border: '1px solid #1e1e3a', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', marginBottom: 12 }}>Top Complaint Categories</div>
          {stats.topCategories.length === 0
            ? <div style={{ color: '#4b5563', fontSize: 12 }}>No data yet</div>
            : stats.topCategories.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1e1e3a' }}>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{c.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>{c.count}</span>
              </div>
            ))
          }
        </div>

        <div style={{ flex: 1, minWidth: 220, background: '#13132a', border: '1px solid #1e1e3a', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', marginBottom: 12 }}>🏆 Agent Leaderboard</div>
          {stats.leaderboard.map((a, i) => (
            <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e1e3a' }}>
              <span style={{ fontSize: 13, color: i === 0 ? '#fbbf24' : '#9ca3af' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {a.name}
              </span>
              <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>{a.closed} closed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
          }
