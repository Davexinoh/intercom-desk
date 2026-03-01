import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Inbox from './pages/Inbox'
import Ticket from './pages/Ticket'
import Intake from './pages/Intake'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

export default function App() {
  const [page, setPage]         = useState('inbox')
  const [ticketId, setTicketId] = useState(null)

  function nav(p, id = null) {
    setPage(p)
    setTicketId(id)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f1a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar current={page} nav={nav} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {page === 'inbox'     && <Inbox     nav={nav} />}
        {page === 'ticket'    && <Ticket    id={ticketId} nav={nav} />}
        {page === 'intake'    && <Intake    nav={nav} />}
        {page === 'analytics' && <Analytics />}
        {page === 'settings'  && <Settings  />}
      </main>
    </div>
  )
}
