const BASE = 'http://localhost:3001/api'

async function req(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  getTickets:    (params = {}) => req('/tickets?' + new URLSearchParams(params)),
  getTicket:     (id)          => req(`/tickets/${id}`),
  createTicket:  (data)        => req('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  reply:         (id, text)    => req(`/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify({ text }) }),
  close:         (id)          => req(`/tickets/${id}/close`, { method: 'POST' }),
  assign:        (id, name)    => req(`/tickets/${id}/assign`, { method: 'POST', body: JSON.stringify({ agentName: name }) }),
  setPriority:   (id, p)       => req(`/tickets/${id}/priority`, { method: 'POST', body: JSON.stringify({ priority: p }) }),
  suggest:       (id, tone)    => req(`/tickets/${id}/suggest?tone=${tone}`),
  getComplaints: ()            => req('/complaints'),
  getMacros:     ()            => req('/macros'),
  getMacro:      (key)         => req(`/macros/${key}`),
  getStats:      ()            => req('/stats'),
  getAgents:     ()            => req('/agents'),
  getSettings:   ()            => req('/settings'),
  setAuto:       (enabled)     => req('/settings/auto', { method: 'POST', body: JSON.stringify({ enabled }) }),
  }
