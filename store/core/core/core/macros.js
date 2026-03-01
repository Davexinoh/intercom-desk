'use strict'

const MACROS = {
  refund_policy: {
    name: 'Refund Policy',
    text: `Thank you for reaching out. Our refund policy allows refunds within 30 days of purchase for unused services. To process your refund, please confirm your order ID and the reason for the refund. Once confirmed, refunds are processed within 5–7 business days back to your original payment method.`,
  },
  password_reset: {
    name: 'Password Reset Steps',
    text: `To reset your password, please follow these steps:\n1. Visit the login page and click "Forgot Password"\n2. Enter your registered email address\n3. Check your inbox for a reset link (check spam if not received)\n4. Click the link and follow the instructions to set a new password\n5. The link expires after 24 hours — request a new one if needed.\nLet us know if you run into any issues!`,
  },
  payment_failed: {
    name: 'Payment Failed Troubleshooting',
    text: `Sorry to hear your payment didn't go through. Here are some common fixes:\n1. Double-check your card number, expiry date, and CVV\n2. Ensure your billing address matches your bank records\n3. Check with your bank — some block online transactions by default\n4. Try a different payment method or card\n5. Clear your browser cache and retry\nIf the issue persists, please share the last 4 digits of your card and we'll investigate further.`,
  },
  security_escalation: {
    name: 'Security Escalation',
    text: `We take security concerns extremely seriously. Your report has been flagged as HIGH PRIORITY and escalated to our security team immediately.\n\nIn the meantime, we recommend:\n1. Change your password immediately\n2. Enable two-factor authentication if not already active\n3. Review your recent account activity\n4. Do not share your credentials with anyone\n\nA security specialist will contact you within 2 hours.`,
  },
  bug_report_request: {
    name: 'Bug Report Request',
    text: `Thank you for reporting this! To help us investigate and fix the issue as quickly as possible, could you please share:\n1. Steps to reproduce the issue (what did you do?)\n2. What you expected to happen\n3. What actually happened\n4. Your device / browser / OS version\n5. Any screenshots or error messages\n\nThis helps our engineering team pinpoint the problem quickly. We appreciate your patience!`,
  },
  close_resolved: {
    name: 'Closing — Resolved',
    text: `Great news — it looks like this issue has been resolved! We're closing this ticket now. If you experience any further issues or have additional questions, please don't hesitate to open a new ticket. Thank you for your patience and for choosing us!`,
  },
  escalate_manager: {
    name: 'Escalate to Manager',
    text: `I completely understand your frustration, and I want to make sure this gets the attention it deserves. I'm escalating this ticket to our senior support team and a manager will follow up with you within 24 hours. Thank you for your patience.`,
  },
}

function getMacro(key) {
  return MACROS[key] || null
}

function listMacros() {
  return Object.entries(MACROS).map(([key, val]) => ({ key, name: val.name }))
}

module.exports = { MACROS, getMacro, listMacros }
