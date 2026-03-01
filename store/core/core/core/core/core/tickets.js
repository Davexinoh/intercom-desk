'use strict'

const db      = require('../store/db')
const { applyPriority, checkAutoResolve } = require('./rules')
const { getMacro } = require('./macros')

function createTicket({ category, subcategory, subject, userMessage }) {
  const stats   = db.read('stats')
  const tickets = db.read('tickets')

  const priority = applyPriority(category, subcategory)
  const now      = new Date().toISOString()
  const id       = stats.nextId++

  const thread = [
    { role: 'user', text: userMessage || subject, at: now },
  ]

  const autoRule = checkAutoResolve(category, subcategory)
  let status = 'open'
  if (autoRule) {
    const macro = getMacro(autoRule.macro)
    if (macro) {
      thread.push({ role: 'agent', text: macro.text, at: now })
      thread.push({ role: 'system', text: 'Auto-resolved by Intercom Desk rules engine.', at: now })
      status = 'pending'
      stats.autoResolved = (stats.autoResolved || 0) + 1
    }
  }

  const ticket = {
    id,
    status,
    priority,
    category,
    subcategory,
    subject,
    createdAt: now,
    updatedAt: now,
    assignedTo: null,
    thread,
  }

  tickets.push(ticket)
  db.write('tickets', tickets)
  db.write('stats', stats)
  return ticket
}

function getTickets({ status, priority, q } = {}) {
  let list = db.read('tickets')
  if (status)   list = list.filter(t => t.status === status)
  if (priority) list = list.filter(t => t.priority === priority)
  if (q) {
    const lq = q.toLowerCase()
    list = list.filter(t =>
      t.subject.toLowerCase().includes(lq) ||
      t.category.toLowerCase().includes(lq) ||
      t.subcategory.toLowerCase().includes(lq)
    )
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function getTicket(id) {
  const tickets = db.read('tickets')
  return tickets.find(t => t.id === Number(id)) || null
}

function replyTicket(id, text, role = 'agent') {
  const tickets = db.read('tickets')
  const t = tickets.find(t => t.id === Number(id))
  if (!t) return null
  const now = new Date().toISOString()
  t.thread.push({ role, text, at: now })
  t.updatedAt = now
  db.write('tickets', tickets)
  return t
}

function closeTicket(id) {
  const tickets = db.read('tickets')
  const stats   = db.read('stats')
  const t = tickets.find(t => t.id === Number(id))
  if (!t) return null
  const now = new Date().toISOString()
  t.status    = 'closed'
  t.updatedAt = now
  t.thread.push({ role: 'system', text: 'Ticket closed.', at: now })
  stats.totalClosed = (stats.totalClosed || 0) + 1
  if (t.assignedTo) {
    const agents = db.read('agents')
    const agent  = agents.find(a => a.name === t.assignedTo)
    if (agent) { agent.closedCount++; db.write('agents', agents) }
  }
  db.write('tickets', tickets)
  db.write('stats', stats)
  return t
}

function assignTicket(id, agentName) {
  const tickets = db.read('tickets')
  const t = tickets.find(t => t.id === Number(id))
  if (!t) return null
  const now = new Date().toISOString()
  t.assignedTo = agentName
  t.updatedAt  = now
  t.thread.push({ role: 'system', text: `Assigned to ${agentName}.`, at: now })
  db.write('tickets', tickets)
  return t
}

function setPriority(id, priority) {
  const tickets = db.read('tickets')
  const t = tickets.find(t => t.id === Number(id))
  if (!t) return null
  t.priority  = priority
  t.updatedAt = new Date().toISOString()
  db.write('tickets', tickets)
  return t
}

module.exports = { createTicket, getTickets, getTicket, replyTicket, closeTicket, assignTicket, setPriority }
