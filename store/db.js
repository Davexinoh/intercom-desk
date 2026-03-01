'use strict'

const fs   = require('fs')
const path = require('path')
const { DEFAULT_TICKETS, DEFAULT_AGENTS, DEFAULT_STATS } = require('./schema')

const DATA = path.join(__dirname, '../data')

const FILES = {
  tickets: path.join(DATA, 'tickets.json'),
  agents:  path.join(DATA, 'agents.json'),
  stats:   path.join(DATA, 'stats.json'),
}

const DEFAULTS = {
  tickets: DEFAULT_TICKETS,
  agents:  DEFAULT_AGENTS,
  stats:   DEFAULT_STATS,
}

function ensureData() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true })
  for (const [key, file] of Object.entries(FILES)) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(DEFAULTS[key], null, 2))
    }
  }
}

function read(key) {
  ensureData()
  try {
    return JSON.parse(fs.readFileSync(FILES[key], 'utf8'))
  } catch {
    return JSON.parse(JSON.stringify(DEFAULTS[key]))
  }
}

function write(key, data) {
  ensureData()
  const tmp = FILES[key] + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, FILES[key])
}

module.exports = { read, write, ensureData }
