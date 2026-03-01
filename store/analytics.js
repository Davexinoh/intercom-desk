'use strict'

const db = require('./db')

function getAnalytics() {
  const tickets = db.read('tickets')
  const stats   = db.read('stats')
  const agents  = db.read('agents')

  const now        = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  const open        = tickets.filter(t => t.status === 'open')
  const closed      = tickets.filter(t => t.status === 'closed')
  const closedToday = closed.filter(t => new Date(t.updatedAt).getTime() >= todayStart)

  let totalFirstResponse = 0
  let firstResponseCount = 0
  for (const t of tickets) {
    const agentReply = t.thread.find(m => m.role === 'agent')
    if (agentReply) {
      totalFirstResponse += new Date(agentReply.at).getTime() - new Date(t.createdAt).getTime()
      firstResponseCount++
    }
  }
  const avgFirstResponseMs = firstResponseCount > 0 ? totalFirstResponse / firstResponseCount : 0

  let totalResolution = 0
  let resolutionCount = 0
  for (const t of closed) {
    totalResolution += new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime()
    resolutionCount++
  }
  const avgResolutionMs = resolutionCount > 0 ? totalResolution / resolutionCount : 0

  const catCounts = {}
  for (const t of tickets) {
    const key = `${t.category} / ${t.subcategory}`
    catCounts[key] = (catCounts[key] || 0) + 1
  }
  const topCategories = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }))

  const agentClosed = {}
  for (const t of closed) {
    if (t.assignedTo) {
      agentClosed[t.assignedTo] = (agentClosed[t.assignedTo] || 0) + 1
    }
  }
  const leaderboard = agents
    .map(a => ({ name: a.name, closed: agentClosed[a.name] || 0 }))
    .sort((a, b) => b.closed - a.closed)

  const priorities = { high: 0, medium: 0, low: 0 }
  for (const t of open) priorities[t.priority]++

  return {
    openCount:        open.length,
    closedTotal:      closed.length,
    closedToday:      closedToday.length,
    autoResolved:     stats.autoResolved || 0,
    avgFirstResponse: fmtDuration(avgFirstResponseMs),
    avgResolution:    fmtDuration(avgResolutionMs),
    topCategories,
    leaderboard,
    priorities,
  }
}

function fmtDuration(ms) {
  if (!ms) return 'N/A'
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ${mins % 60}m`
  return `${Math.floor(hrs / 24)}d ${hrs % 24}h`
}

module.exports = { getAnalytics }
