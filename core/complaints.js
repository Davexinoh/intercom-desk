'use strict'

const CATEGORIES = [
  {
    id: 'billing',
    label: 'Billing & Payments',
    subcategories: [
      { id: 'charge_error',    label: 'Incorrect charge / overcharge' },
      { id: 'refund_request',  label: 'Refund request' },
      { id: 'payment_failed',  label: 'Payment failed' },
      { id: 'subscription',    label: 'Subscription issue' },
      { id: 'invoice',         label: 'Invoice / receipt request' },
    ],
  },
  {
    id: 'account',
    label: 'Account & Access',
    subcategories: [
      { id: 'password_reset',  label: 'Password reset' },
      { id: 'locked_account',  label: 'Account locked / suspended' },
      { id: 'two_factor',      label: '2FA / MFA issue' },
      { id: 'email_change',    label: 'Email address change' },
      { id: 'delete_account',  label: 'Delete account request' },
    ],
  },
  {
    id: 'security',
    label: 'Security & Fraud',
    subcategories: [
      { id: 'unauthorised',    label: 'Unauthorised access / suspicious login' },
      { id: 'phishing',        label: 'Phishing / scam report' },
      { id: 'data_breach',     label: 'Data breach concern' },
      { id: 'compromised',     label: 'Compromised account' },
    ],
  },
  {
    id: 'technical',
    label: 'Technical Issues',
    subcategories: [
      { id: 'bug_report',      label: 'Bug report' },
      { id: 'performance',     label: 'Slow performance / downtime' },
      { id: 'integration',     label: 'Integration / API issue' },
      { id: 'mobile_app',      label: 'Mobile app crash' },
      { id: 'data_sync',       label: 'Data not syncing' },
    ],
  },
  {
    id: 'product',
    label: 'Product & Features',
    subcategories: [
      { id: 'feature_request', label: 'Feature request' },
      { id: 'how_to',          label: 'How to use a feature' },
      { id: 'missing_data',    label: 'Missing / incorrect data' },
      { id: 'export',          label: 'Data export request' },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    subcategories: [
      { id: 'feedback',        label: 'General feedback' },
      { id: 'compliment',      label: 'Compliment / praise' },
      { id: 'partner',         label: 'Partnership enquiry' },
      { id: 'press',           label: 'Press / media enquiry' },
    ],
  },
]

function getCategory(id) {
  return CATEGORIES.find(c => c.id === id)
}

function getSubcategory(catId, subId) {
  const cat = getCategory(catId)
  return cat ? cat.subcategories.find(s => s.id === subId) : null
}

module.exports = { CATEGORIES, getCategory, getSubcategory }
