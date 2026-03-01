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

  console.log(color(`\n  ── Ticket #${t.id} ───────────────────────────────────────`, C.bold))
  console.log(`  ${color('Subject:', C.bold)} ${t.subject}`)
  console.log(`  ${color('Status:', C.bold)}  ${statusColor(t.status)}   ${color('Priority:', C.bold)} ${priorityColor(t.priority)}`)
  console.log(`  ${color('Category:', C.bold)} ${t.category} / ${t.subcategory}`)
  if (t.assignedTo) console.log(`  ${color('Assigned:', C.bold)} ${t.assignedTo}`)
  console.log()
  for (const msg of t.thread) {
    const who = msg.role === 'user' ? color('USER', C.blue) : msg.role === 'agent' ? color('AGENT', C.green) : color('SYSTEM', C.grey)
    console.log(`  [${who}] ${msg.at.slice(0,16).replace('T',' ')}`)
    console.log(`  ${msg.text}\n`)
  }
}

function cmdReply(args) {
  const id   = args[0]
  const text = args.slice(1).join(' ').replace(/^"|"$/g, '')
  if (!id || !text) return console.log(color('Usage: reply <id> "text"', C.red))
  const t = tickets.replyTicket(id, text, 'agent')
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  console.log(color(`  ✅ Reply sent to ticket #${id}`, C.green))
}

function cmdClose(args) {
  const id = args[0]
  if (!id) return console.log(color('Usage: close <id>', C.red))
  const t = tickets.closeTicket(id)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  console.log(color(`  ✅ Ticket #${id} closed.`, C.green))
}

function cmdAssign(args) {
  const id   = args[0]
  const name = args[1]
  if (!id || !name) return console.log(color('Usage: assign <id> <agent>', C.red))
  const t = tickets.assignTicket(id, name)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  console.log(color(`  ✅ Ticket #${id} assigned to ${name}.`, C.green))
}

function cmdPriority(args) {
  const id = args[0]
  const p  = args[1]
  if (!id || !['high','medium','low'].includes(p)) return console.log(color('Usage: priority <id> high|medium|low', C.red))
  const t = tickets.setPriority(id, p)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  console.log(color(`  ✅ Priority set to ${p} on ticket #${id}.`, C.green))
}

function cmdSuggest(args) {
  const id   = args[0]
  const tone = args[1] || 'professional'
  if (!id) return console.log(color('Usage: suggest <id> [friendly|professional|short]', C.red))
  const t = tickets.getTicket(id)
  if (!t) return console.log(color(`Ticket #${id} not found.`, C.red))
  const text = getSuggestion(t, tone)
  console.log(color(`\n  ── Suggested Reply (${tone}) ───────────────────────────────`, C.bold))
  console.log(`  ${text}\n`)
}

function cmdMacros() {
  const list = listMacros()
  console.log(color('\n  ── Macros ───────────────────────────────────────────────', C.bold))
  for (const m of list) {
    console.log(`  ${color(m.key.padEnd(24), C.cyan)} ${m.name}`)
  }
  console.log()
}

function cmdMacro(args) {
  const key = args[0]
  if (!key) return console.log(color('Usage: macro <key>', C.red))
  const m = getMacro(key)
  if (!m) return console.log(color(`Macro "${key}" not found.`, C.red))
  console.log(color(`\n  ── ${m.name} ───────────────────────────────────────────────`, C.bold))
  console.log(`  ${m.text}\n`)
}

function cmdStats() {
  const s = getAnalytics()
  console.log(color('\n  ── Analytics Dashboard ──────────────────────────────────', C.bold))
  console.log(`  Open tickets:       ${color(s.openCount, C.cyan)}`)
  console.log(`  Closed total:       ${color(s.closedTotal, C.green)}`)
  console.log(`  Closed today:       ${s.closedToday}`)
  console.log(`  Auto-resolved:      ${s.autoResolved}`)
  console.log(`  Avg first response: ${s.avgFirstResponse}`)
  console.log(`  Avg resolution:     ${s.avgResolution}`)
  console.log()
  console.log(color('  Open by priority:', C.bold))
  console.log(`    High:   ${color(s.priorities.high, C.red)}`)
  console.log(`    Medium: ${color(s.priorities.medium, C.yellow)}`)
  console.log(`    Low:    ${color(s.priorities.low, C.green)}`)
  console.log()
  if (s.leaderboard.length) {
    console.log(color('  Leaderboard:', C.bold))
    for (const [i, a] of s.leaderboard.entries()) {
      console.log(`    ${i + 1}. ${a.name.padEnd(12)} ${a.closed} closed`)
    }
  }
  console.log()
}

function cmdStatus() {
  const stats = db.read('stats')
  const count = db.read('tickets').length
  console.log(color('\n  ── System Status ────────────────────────────────────────', C.bold))
  console.log(`  ${color('●', C.green)} API: OK`)
  console.log(`  Tickets in store: ${count}`)
  console.log(`  Auto-resolve:     ${stats.autoMode ? color('ON', C.green) : color('OFF', C.grey)}`)
  console.log()
}

function cmdAuto(args) {
  const mode = args[0]
  if (!['on','off'].includes(mode)) return console.log(color('Usage: auto on|off', C.red))
  const stats = db.read('stats')
  stats.autoMode = mode === 'on'
  db.write('stats', stats)
  console.log(color(`  ✅ Auto-resolve mode: ${mode.toUpperCase()}`, C.green))
}

async function cmdComplaint() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q) => new Promise(resolve => rl.question(q, resolve))

  try {
    console.log(color('\n  ── New Complaint Wizard ────────────────────────────────', C.bold))
    console.log(color('\n  Categories:', C.bold))
    CATEGORIES.forEach((c, i) => console.log(`  ${color((i + 1) + '.', C.cyan)} ${c.label}`))

    const catIdx = parseInt(await ask(color('\n  Select category number: ', C.yellow))) - 1
    const cat = CATEGORIES[catIdx]
    if (!cat) { console.log(color('  Invalid selection.', C.red)); return }

    console.log(color('\n  Subcategories:', C.bold))
    cat.subcategories.forEach((s, i) => console.log(`  ${color((i + 1) + '.', C.cyan)} ${s.label}`))

    const subIdx = parseInt(await ask(color('\n  Select subcategory number: ', C.yellow))) - 1
    const sub = cat.subcategories[subIdx]
    if (!sub) { console.log(color('  Invalid selection.', C.red)); return }

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
