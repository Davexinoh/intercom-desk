'use strict'

const PRIORITY_RULES = [
  { category: 'security',  priority: 'high' },
  { category: 'billing',   subcategory: 'payment_failed',  priority: 'high' },
  { category: 'billing',   subcategory: 'charge_error',    priority: 'high' },
  { category: 'billing',   subcategory: 'refund_request',  priority: 'medium' },
  { category: 'account',   subcategory: 'locked_account',  priority: 'high' },
  { category: 'account',   subcategory: 'password_reset',  priority: 'low' },
  { category: 'technical', subcategory: 'bug_report',      priority: 'medium' },
  { category: 'technical', subcategory: 'performance',     priority: 'high' },
  { category: 'product',   priority: 'low' },
  { category: 'other',     priority: 'low' },
]

const AUTO_RESOLVE_RULES = [
  { category: 'account', subcategory: 'password_reset', macro: 'password_reset' },
]

function applyPriority(category, subcategory) {
  for (const rule of PRIORITY_RULES) {
    if (rule.category === category) {
      if (!rule.subcategory || rule.subcategory === subcategory) {
        return rule.priority
      }
    }
  }
  return 'medium'
}

function checkAutoResolve(category, subcategory) {
  return AUTO_RESOLVE_RULES.find(
    r => r.category === category && r.subcategory === subcategory
  ) || null
}

module.exports = { applyPriority, checkAutoResolve }
