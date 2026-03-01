'use strict'

const TEMPLATES = {
  billing: {
    charge_error:   'I can see there may have been an issue with the charge on your account. Let me look into this right away and make sure we get it corrected for you.',
    refund_request: 'I completely understand your request for a refund. I\'ve reviewed your account and I\'ll be processing this according to our refund policy.',
    payment_failed: 'I\'m sorry to hear your payment didn\'t go through. This can happen for a few reasons — let\'s get this sorted out quickly for you.',
    subscription:   'I can see there\'s a concern with your subscription. Let me pull up your account details and get this resolved immediately.',
    invoice:        'Of course — I\'d be happy to provide you with a copy of your invoice. I\'ll send that over to your registered email address right away.',
  },
  account: {
    password_reset:  'No problem at all! Resetting your password is quick and easy. I\'ll walk you through the steps to get you back in.',
    locked_account:  'I understand how frustrating it can be to not have access to your account. I\'m making this a priority and will get it unlocked for you.',
    two_factor:      'I can help you with your two-factor authentication issue. Let\'s verify your identity first and then get this sorted.',
    email_change:    'Happy to help you update your email address. For security purposes, I\'ll need to verify your identity first.',
    delete_account:  'I\'m sorry to hear you\'d like to delete your account. Before we proceed, may I ask if there\'s anything we can do to change your mind?',
  },
  security: {
    unauthorised:   'This is extremely serious and we\'re treating it as our highest priority. Our security team has been alerted and we\'re taking immediate action to secure your account.',
    phishing:       'Thank you for reporting this — you\'ve done the right thing. Our security team will investigate this phishing attempt immediately.',
    data_breach:    'We take this concern very seriously. Our security and compliance teams have been notified and will investigate this immediately.',
    compromised:    'I\'m so sorry to hear this. We\'re escalating this to our security team right now. Please do not log in again until you hear from us.',
  },
  technical: {
    bug_report:     'Thank you for taking the time to report this bug. Our engineering team will investigate this right away. Could you share a few more details?',
    performance:    'I apologise for the inconvenience caused by the performance issues. Our technical team is actively monitoring the situation.',
    integration:    'I can help you troubleshoot this integration issue. Could you tell me which integration you\'re using and what error you\'re seeing?',
    mobile_app:     'I\'m sorry the app crashed on you! That\'s not an experience we want for our users. Let\'s get this fixed.',
    data_sync:      'I can see your data isn\'t syncing correctly. Let me take a look at the sync logs and identify what\'s causing the delay.',
  },
  product: {
    feature_request: 'Thank you so much for this suggestion! I\'ve logged it with our product team. We really value customer feedback.',
    how_to:          'Great question! I\'d be happy to walk you through how to use this feature step by step.',
    missing_data:    'I can see the data isn\'t displaying correctly. Let me investigate this on our end and get back to you.',
    export:          'Of course! I can help you export your data. Let me get that process started for you right away.',
  },
  other: {
    feedback:        'Thank you so much for taking the time to share your feedback — we really appreciate it and use it to improve our service.',
    compliment:      'That truly made our day! Thank you so much for your kind words. We\'ll pass this along to the team.',
    partner:         'Thank you for your interest in partnering with us! I\'ve forwarded your enquiry to our partnerships team.',
    press:           'Thank you for reaching out! I\'ve forwarded your enquiry to our communications team who will be in touch shortly.',
  },
}

const TONE_WRAPPERS = {
  friendly: (text) => `Hey there! 👋\n\n${text}\n\nPlease don't hesitate to reach out if you need anything else — we're always happy to help! 😊`,
  professional: (text) => `Dear Customer,\n\n${text}\n\nThank you for your patience. Please do not hesitate to contact us should you require further assistance.\n\nKind regards,\nIntercom Desk Support`,
  short: (text) => text.split('.')[0] + '. We\'ll get this sorted ASAP.',
}

function getSuggestion(ticket, tone = 'professional') {
  const cat  = ticket.category
  const sub  = ticket.subcategory
  const base = (TEMPLATES[cat] && TEMPLATES[cat][sub])
    || (TEMPLATES[cat] && Object.values(TEMPLATES[cat])[0])
    || 'Thank you for reaching out. We\'re looking into your issue and will get back to you shortly.'

  const wrapper = TONE_WRAPPERS[tone] || TONE_WRAPPERS.professional
  return wrapper(base)
}

module.exports = { getSuggestion }
