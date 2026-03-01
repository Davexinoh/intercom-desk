'use strict'

const DEFAULT_TICKETS = []

const DEFAULT_AGENTS = [
  { name: 'Alice', email: 'alice@desk.local', closedCount: 0 },
  { name: 'Bob',   email: 'bob@desk.local',   closedCount: 0 },
  { name: 'Carol', email: 'carol@desk.local',  closedCount: 0 },
]

const DEFAULT_STATS = {
  nextId: 1,
  autoMode: true,
  totalClosed: 0,
  autoResolved: 0,
}

function validateTicket(t) {
  return (
    t && typeof t.id === 'number' &&
    typeof t.subject === 'string' &&
    ['open','closed','pending'].includes(t.status) &&
    ['high','medium','low'].includes(t.priority)
  )
}

module.exports = { DEFAULT_TICKETS, DEFAULT_AGENTS, DEFAULT_STATS, validateTicket }
