#!/usr/bin/env node
'use strict'

const readline = require('readline')
const cmds = require('./commands')

const BANNER = `
\x1b[1m\x1b[36m  ╔══════════════════════════════════════════════╗
  ║   Intercom Desk — Davexinoh Fork  🎧        ║
  ║   Customer Support Agent Console            ║
  ╚══════════════════════════════════════════════╝\x1b[0m
  Type \x1b[33mhelp\x1b[0m to see all commands.
`

async function main() {
  console.log(BANNER)

  const rl = readline.createInterface({
    input:   process.stdin,
    output:  process.stdout,
    prompt:  '\x1b[36mdesk>\x1b[0m ',
  })

  rl.prompt()

  for await (const line of rl) {
    const parts = line.trim().split(/\s+/)
    const cmd   = parts[0]
    const args  = parts.slice(1)

    switch (cmd) {
      case 'complaint': await cmds.cmdComplaint(); break
      case 'inbox':     cmds.cmdInbox(args);       break
      case 'open':      cmds.cmdOpen(args);         break
      case 'reply':     cmds.cmdReply(args);        break
      case 'close':     cmds.cmdClose(args);        break
      case 'assign':    cmds.cmdAssign(args);       break
      case 'priority':  cmds.cmdPriority(args);     break
      case 'suggest':   cmds.cmdSuggest(args);      break
      case 'macros':    cmds.cmdMacros();           break
      case 'macro':     cmds.cmdMacro(args);        break
      case 'stats':     cmds.cmdStats();            break
      case 'status':    cmds.cmdStatus();           break
      case 'auto':      cmds.cmdAuto(args);         break
      case 'help':      cmds.cmdHelp();             break
      case 'exit':
      case 'quit':
        console.log('\x1b[90m  Goodbye 👋\x1b[0m\n')
        process.exit(0)
      case '': break
      default:
        console.log(`\x1b[31m  Unknown command: "${cmd}". Type "help".\x1b[0m`)
    }

    rl.prompt()
  }
}

main().catch(err => { console.error(err); process.exit(1) })
