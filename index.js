#!/usr/bin/env node
'use strict'

/**
 * Intercom Desk — Davexinoh Fork
 * Customer Support Agent Console + Web Dashboard
 *
 * Upstream Intercom: https://github.com/Trac-Systems/intercom
 *
 * Usage:
 *   npm run dev    — API + Web + CLI
 *   npm run api    — API only
 *   npm run cli    — CLI only
 *   npm run seed   — seed demo data
 */

require('./api/server')
require('./cli/cli')
