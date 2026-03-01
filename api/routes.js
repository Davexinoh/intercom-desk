'use strict'

const express   = require('express')
const router    = express.Router()
const tickets   = require('../store/tickets')
const { CATEGORIES } = require('../store/complaints')
const { getSuggestion } = require('../store/suggest')
const { listMacros, getMacro } = require('../store/macros')
const { getAnalytics } = require('../store/analytics')
const db        = require('../store/db')

router.get('/health', (_, res) => res.json({ ok: true, service: 'Intercom Desk' }))

router.get('/complaints', (_, res) => res.json(CATEGORIES))

router.get('/tickets', (req, res) => {
  const { status, priority, q } = req.query
  res.json(tickets.getTickets({ status, priority, q }))
})

router.get('/tickets/:id', (req, res) => {
  const t = tickets.getTicket(req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
})

router.post('/tickets', (req, res) => {
  const { category, subcategory, subject, userMessage } = req.body
  if (!category || !subcategory || !subject) {
    return res.status(400).json({ error: 'category, subcategory, subject required' })
  }
  const t = tickets.createTicket({ category, subcategory, subject, userMessage })
  res.status(201).json(t)
})

router.post('/tickets/:id/reply', (req, res) => {
  const { text, role } = req.body
  if (!text) return res.status(400).json({ error: 'text required' })
  const t = tickets.replyTicket(req.params.id, text, role || 'agent')
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
})

router.post('/tickets/:id/close', (req, res) => {
  const t = tickets.closeTicket(req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
})

router.post('/tickets/:id/assign', (req, res) => {
  const { agentName } = req.body
  if (!agentName) return res.status(400).json({ error: 'agentName required' })
  const t = tickets.assignTicket(req.params.id, agentName)
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
})

router.post('/tickets/:id/priority', (req, res) => {
  const { priority } = req.body
  if (!['high','medium','low'].includes(priority)) return res.status(400).json({ error: 'Invalid priority' })
  const t = tickets.setPriority(req.params.id, priority)
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
})

router.get('/tickets/:id/suggest', (req, res) => {
  const t = tickets.getTicket(req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  const tone = req.query.tone || 'professional'
  res.json({ suggestion: getSuggestion(t, tone) })
})

router.get('/macros', (_, res) => res.json(listMacros()))
router.get('/macros/:key', (req, res) => {
  const m = getMacro(req.params.key)
  if (!m) return res.status(404).json({ error: 'Not found' })
  res.json(m)
})

router.get('/stats', (_, res) => res.json(getAnalytics()))

router.get('/agents', (_, res) => res.json(db.read('agents')))

router.post('/settings/auto', (req, res) => {
  const { enabled } = req.body
  const stats = db.read('stats')
  stats.autoMode = !!enabled
  db.write('stats', stats)
  res.json({ autoMode: stats.autoMode })
})

router.get('/settings', (_, res) => {
  const stats = db.read('stats')
  res.json({ autoMode: stats.autoMode })
})

module.exports = router
