'use strict'

const readline = require('readline')
const { CATEGORIES } = require('../core/complaints')
const tickets  = require('../core/tickets')
const { getSuggestion } = require('../core/suggest')
const { listMacros, getMacro } = require('../core/macros')
const { getAnalytics } = require('../core/analytics')
const db       = require('../store/db')

const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m',
  grey:   '\x1b[90m',
}

function color(str, c) { return `${c}${str}${C.reset}` }

function priorityColor(p) {
  if (p === 'high')   return color(p.toUpperCase(), C.red)
  if (p === 'medium') return color(p.toUpperCase(), C.yellow)
  return color(p.toUpperCase(), C.green)
}

function statusColor(s) {
  if (s === 'open')    return color(s, C.cyan)
  if (s === 'closed')  return color(s, C.grey)
  return color(s, C.yellow)
}

function cmdInbox(args) {
  const filter = args[0]
  const opts = {}
  if (['open','closed','pending'].includes(filter)) opts.status = filter
  else if (['high','medium','low'].includes(filter)) opts.priority = filter
  else opts.status = 'open'

  const list = tickets.getTickets(opts)
  if (list.length === 0) {
    console.log(color('\n  No tickets found.\n', C.grey))
    return
  }
  console.log(color(`\n  ── Inbox (${list.length}) ──────────────────────────────────────`, C.bold))
  for (const t of list) {
    const assigned = t.assignedTo ? color(` → ${t.assignedTo}`, C.blue) : ''
    console.log(
      `  ${color('#' + t.id, C.bold)} ${statusColor(t.status)} ${priorityColor(t.priority)} ` +
      `${t.subject.slice(0, 50)}${assigned}`
    )
    console.log(color(`      ${t.category} / ${t.subcategory}  ${t.createdAt.slice(0,10)}`, C.grey))
  }
  console.log()
}

function cmdOpen(args) {
  const id = args[0]
  if (!id) return console.log(color('Usage: open <id>', C.red))
  const t = tickets.getTicket(id)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))

  console.log(color(`\n  ── Ticket #${t.id}: ${t.subject} ──`, C.bold))
  console.log(`  Status: ${statusColor(t.status)}  Priority: ${priorityColor(t.priority)}  Assigned: ${t.assignedTo || 'Unassigned'}`)
  console.log(color(`  Category: ${t.category} / ${t.subcategory}`, C.grey))
  console.log(color(`  Created: ${t.createdAt}`, C.grey))
  console.log(color(`\n  ── Thread ──────────────────────────────────────`, C.bold))
  for (const m of t.thread) {
    const prefix = m.role === 'user' ? color('  👤 User', C.cyan) :
                   m.role === 'agent' ? color('  🎧 Agent', C.green) :
                   color('  ⚙️  System', C.grey)
    console.log(`${prefix}  ${color(m.at.slice(0,16).replace('T',' '), C.grey)}`)
    console.log(`     ${m.text.replace(/\n/g, '\n     ')}`)
  }
  console.log()
}

function cmdReply(args) {
  const id   = args[0]
  const text = args.slice(1).join(' ').replace(/^"|"$/g, '')
  if (!id || !text) return console.log(color('Usage: reply <id> "your reply text"', C.red))
  const t = tickets.replyTicket(id, text)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  console.log(color(`\n  ✅ Reply added to ticket #${id}\n`, C.green))
}

function cmdClose(args) {
  const id = args[0]
  if (!id) return console.log(color('Usage: close <id>', C.red))
  const t = tickets.closeTicket(id)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  console.log(color(`\n  ✅ Ticket #${id} closed.\n`, C.green))
}

function cmdAssign(args) {
  const id    = args[0]
  const agent = args[1]
  if (!id || !agent) return console.log(color('Usage: assign <id> <agentName>', C.red))
  const t = tickets.assignTicket(id, agent)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  console.log(color(`\n  ✅ Ticket #${id} assigned to ${agent}\n`, C.green))
}

function cmdPriority(args) {
  const id  = args[0]
  const pri = args[1]
  if (!id || !['high','medium','low'].includes(pri)) return console.log(color('Usage: priority <id> high|medium|low', C.red))
  const t = tickets.setPriority(id, pri)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  console.log(color(`\n  ✅ Ticket #${id} priority set to ${pri}\n`, C.green))
}

function cmdSuggest(args) {
  const id   = args[0]
  const tone = args[1] || 'professional'
  if (!id) return console.log(color('Usage: suggest <id> [friendly|professional|short]', C.red))
  const t = tickets.getTicket(id)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  const suggestion = getSuggestion(t, tone)
  console.log(color(`\n  ── Suggested Reply (${tone}) ────────────────────────`, C.bold))
  console.log(suggestion.replace(/^/gm, '  '))
  console.log()
}

function cmdMacros() {
  console.log(color('\n  ── Macros ──────────────────────────────────────', C.bold))
  for (const m of listMacros()) {
    console.log(`  ${color(m.key.padEnd(20), C.cyan)} ${m.name}`)
  }
  console.log()
}

function cmdMacro(args) {
  const key = args[0]
  if (!key) return console.log(color('Usage: macro <key>', C.red))
  const m = getMacro(key)
  if (!m) return console.log(color(`Macro "${key}" not found. Run "macros" to list.`, C.red))
  console.log(color(`\n  ── ${m.name} ────────────────────────────────────`, C.bold))
  console.log(m.text.replace(/^/gm, '  '))
  console.log()
}

function cmdStats() {
  const s = getAnalytics()
  console.log(color('\n  ╔════════════════════════════════════════╗', C.bold))
  console.log(color('  ║      Intercom Desk — Analytics         ║', C.bold))
  console.log(color('  ╚════════════════════════════════════════╝', C.bold))
  console.log(`  Open tickets   : ${color(s.openCount, C.cyan)}`)
  console.log(`  Closed today   : ${color(s.closedToday, C.green)}`)
  console.log(`  Total closed   : ${color(s.closedTotal, C.green)}`)
  console.log(`  Auto-resolved  : ${color(s.autoResolved, C.yellow)}`)
  console.log(`  Avg 1st reply  : ${color(s.avgFirstResponse, C.blue)}`)
  console.log(`  Avg resolution : ${color(s.avgResolution, C.blue)}`)
  console.log(`  Priority split : ${color('HIGH', C.red)} ${s.priorities.high}  ${color('MED', C.yellow)} ${s.priorities.medium}  ${color('LOW', C.green)} ${s.priorities.low}`)
  if (s.topCategories.length) {
    console.log(color('\n  Top Categories:', C.bold))
    for (const c of s.topCategories) {
      console.log(`    ${c.label.padEnd(35)} ${color(c.count, C.cyan)}`)
    }
  }
  if (s.leaderboard.length) {
    console.log(color('\n  Agent Leaderboard:', C.bold))
    for (const a of s.leaderboard) {
      console.log(`    ${a.name.padEnd(20)} ${color(a.closed + ' closed', C.green)}`)
    }
  }
  console.log()
}

function cmdStatus() {
  const tickets = require('../store/db').read('tickets')
  const stats   = require('../store/db').read('stats')
  const agents  = require('../store/db').read('agents')
  const open    = tickets.filter(t => t.status === 'open')
  const high    = open.filter(t => t.priority === 'high')
  console.log(color('\n  ── System Status ────────────────────────────────', C.bold))
  console.log(`  ${'Status'.padEnd(18)}: ${color('✅ READY', C.green)}`)
  console.log(`  ${'API'.padEnd(18)}: ${color('http://localhost:3001', C.cyan)}`)
  console.log(`  ${'Web Dashboard'.padEnd(18)}: ${color('http://localhost:5173', C.cyan)}`)
  console.log(`  ${'Open Tickets'.padEnd(18)}: ${color(open.length, C.yellow)}`)
  console.log(`  ${'High Priority'.padEnd(18)}: ${color(high.length, high.length > 0 ? C.red : C.green)}`)
  console.log(`  ${'Agents'.padEnd(18)}: ${color(agents.length, C.blue)}`)
  console.log(`  ${'Auto-Resolve'.padEnd(18)}: ${color(stats.autoMode ? 'ON' : 'OFF', stats.autoMode ? C.green : C.grey)}`)
  console.log(`  ${'Seed Data'.padEnd(18)}: ${color(tickets.length > 0 ? 'Loaded (' + tickets.length + ' tickets)' : 'Empty — run npm run seed', tickets.length > 0 ? C.green : C.yellow)}`)
  console.log()
}

function cmdAuto(args) {
  const flag = args[0]
  const stats = db.read('stats')
  if (flag === 'on') stats.autoMode = true
  else if (flag === 'off') stats.autoMode = false
  db.write('stats', stats)
  console.log(color(`\n  Auto-resolve mode: ${stats.autoMode ? 'ON' : 'OFF'}\n`, C.yellow))
}

async function cmdComplaint() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q) => new Promise(resolve => rl.question(q, resolve))

  try {
    console.log(color('\n  ── New Complaint Wizard ─────────────────────────', C.bold))
    console.log(color('  Select a category:\n', C.cyan))
    CATEGORIES.forEach((c, i) => console.log(`  ${color((i + 1) + '.', C.bold)} ${c.label}`))
    const catIdx = parseInt(await ask(color('\n  Category number: ', C.yellow))) - 1
    if (isNaN(catIdx) || !CATEGORIES[catIdx]) {
      console.log(color('  Invalid selection.\n', C.red))
      rl.close(); return
    }
    const cat = CATEGORIES[catIdx]

    console.log(color(`\n  Subcategories for "${cat.label}":\n`, C.cyan))
    cat.subcategories.forEach((s, i) => console.log(`  ${color((i + 1) + '.', C.bold)} ${s.label}`))
    const subIdx = parseInt(await ask(color('\n  Subcategory number: ', C.yellow))) - 1
    if (isNaN(subIdx) || !cat.subcategories[subIdx]) {
      console.log(color('  Invalid selection.\n', C.red))
      rl.close(); return
    }
    const sub = cat.subcategories[subIdx]

    const subject = await ask(color('  Brief subject (one line): ', C.yellow))
    const message = await ask(color('  Describe your issue: ', C.yellow))

    const t = tickets.createTicket({
      category:    cat.id,
      subcategory: sub.id,
      subject:     subject || sub.label,
      userMessage: message,
    })

    console.log(color(`\n  ✅ Ticket #${t.id} created!`, C.green))
    console.log(`  Priority: ${priorityColor(t.priority)}  Status: ${statusColor(t.status)}`)
    if (t.status === 'pending') console.log(color('  ⚡ Auto-resolved by rules engine', C.yellow))
    console.log()
  } finally {
    rl.close()
  }
}

function cmdHelp() {
  console.log(color('\n  ── Intercom Desk CLI — Commands ─────────────────', C.bold))
  const cmds = [
    ['complaint',                    'Interactive complaint intake wizard'],
    ['inbox [open|closed|high|...]', 'List tickets (default: open)'],
    ['open <id>',                    'View full ticket thread'],
    ['reply <id> "text"',            'Send agent reply'],
    ['close <id>',                   'Close ticket'],
    ['assign <id> <agent>',          'Assign ticket to agent'],
    ['priority <id> high|med|low',   'Set ticket priority'],
    ['suggest <id> [tone]',          'Get suggested reply'],
    ['macros',                       'List all macros'],
    ['macro <key>',                  'Print a macro'],
    ['stats',                        'Show analytics dashboard'],
    ['status',                       'System status / health check'],
    ['auto on|off',                  'Toggle auto-resolve mode'],
    ['help',                         'Show this help'],
    ['exit',                         'Quit'],
  ]
  for (const [cmd, desc] of cmds) {
    console.log(`  ${color(cmd.padEnd(32), C.cyan)} ${desc}`)
  }
  console.log()
}

module.exports = {
  cmdInbox, cmdOpen, cmdReply, cmdClose, cmdAssign, cmdPriority,
  cmdSuggest, cmdMacros, cmdMacro, cmdStats, cmdAuto, cmdComplaint,
  cmdStatus, cmdHelp,
               }
