#!/usr/bin/env node
'use strict'

const db = require('./store/db')
const { DEFAULT_AGENTS, DEFAULT_STATS } = require('./store/schema')

db.ensureData()

console.log('  🌱 Seeding Intercom Desk with demo data...')

// Reset
db.write('stats', { ...DEFAULT_STATS, nextId: 1 })
db.write('agents', DEFAULT_AGENTS)

const now  = new Date()
const ago  = (mins) => new Date(now - mins * 60000).toISOString()

const SEED_TICKETS = [
  {
    id: 1,
    status: 'open',
    priority: 'high',
    category: 'security',
    subcategory: 'unauthorised',
    subject: 'Someone logged into my account from a foreign country',
    createdAt: ago(120),
    updatedAt: ago(90),
    assignedTo: 'Alice',
    thread: [
      { role: 'user',   text: 'I got an alert that my account was accessed from Russia. I have never been there. Please help immediately!', at: ago(120) },
      { role: 'system', text: 'Ticket created. Priority set to HIGH by rules engine.', at: ago(120) },
      { role: 'agent',  text: 'Hi there, I\'ve escalated this to our security team immediately. Please change your password right now and enable 2FA. A security specialist will contact you within 2 hours.', at: ago(90) },
    ],
  },
  {
    id: 2,
    status: 'open',
    priority: 'high',
    category: 'billing',
    subcategory: 'payment_failed',
    subject: 'Unable to complete payment for Pro plan',
    createdAt: ago(60),
    updatedAt: ago(60),
    assignedTo: null,
    thread: [
      { role: 'user',   text: 'I\'ve tried 3 times and my payment keeps failing. I need the Pro plan for my business. This is urgent.', at: ago(60) },
      { role: 'system', text: 'Ticket created. Priority set to HIGH by rules engine.', at: ago(60) },
    ],
  },
  {
    id: 3,
    status: 'open',
    priority: 'medium',
    category: 'technical',
    subcategory: 'bug_report',
    subject: 'Export CSV button does nothing on Firefox',
    createdAt: ago(45),
    updatedAt: ago(30),
    assignedTo: 'Bob',
    thread: [
      { role: 'user',  text: 'When I click "Export CSV" in Firefox 120 on Windows 11, nothing happens. Works fine on Chrome.', at: ago(45) },
      { role: 'agent', text: 'Thank you for the detailed report! I\'ve reproduced this and filed it with engineering. Fix is targeted for next week\'s release.', at: ago(30) },
    ],
  },
  {
    id: 4,
    status: 'closed',
    priority: 'low',
    category: 'account',
    subcategory: 'password_reset',
    subject: 'Cannot reset my password',
    createdAt: ago(180),
    updatedAt: ago(160),
    assignedTo: 'Carol',
    thread: [
      { role: 'user',   text: 'I\'m not receiving the password reset email.', at: ago(180) },
      { role: 'system', text: 'Auto-resolved by Intercom Desk rules engine.', at: ago(180) },
      { role: 'agent',  text: 'Please check your spam folder. The link expires after 24 hours.', at: ago(170) },
      { role: 'user',   text: 'Found it in spam! Thank you so much.', at: ago(165) },
      { role: 'system', text: 'Ticket closed.', at: ago(160) },
    ],
  },
  {
    id: 5,
    status: 'open',
    priority: 'low',
    category: 'product',
    subcategory: 'feature_request',
    subject: 'Dark mode for the dashboard',
    createdAt: ago(30),
    updatedAt: ago(30),
    assignedTo: null,
    thread: [
      { role: 'user', text: 'Would love a dark mode! My eyes thank you in advance.', at: ago(30) },
    ],
  },
  {
    id: 6,
    status: 'closed',
    priority: 'high',
    category: 'billing',
    subcategory: 'charge_error',
    subject: 'Charged twice for October subscription',
    createdAt: ago(240),
    updatedAt: ago(200),
    assignedTo: 'Alice',
    thread: [
      { role: 'user',   text: 'I was charged $49 twice on October 1st. Please refund one of the charges.', at: ago(240) },
      { role: 'agent',  text: 'I can see the duplicate charge. I\'ve initiated a refund for $49 — it will appear in 5-7 business days.', at: ago(220) },
      { role: 'user',   text: 'Thank you for sorting that so quickly!', at: ago(210) },
      { role: 'system', text: 'Ticket closed.', at: ago(200) },
    ],
  },
]

db.write('tickets', SEED_TICKETS)

const agents = db.read('agents')
agents[0].closedCount = 2
agents[2].closedCount = 1
db.write('agents', agents)

const stats = db.read('stats')
stats.nextId      = SEED_TICKETS.length + 1
stats.totalClosed = 2
stats.autoResolved = 1
db.write('stats', stats)

console.log(`  ✅ Seeded ${SEED_TICKETS.length} tickets, ${agents.length} agents`)
console.log('  Run: node cli/cli.js')
console.log('   or: npm run dev\n')
