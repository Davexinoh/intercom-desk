# Intercom Desk — SKILL.md

Agent operations guide. If you are an autonomous agent, treat this as the source of truth.

Upstream Intercom: https://github.com/Trac-Systems/intercom

---

## What This App Does

Intercom Desk is a customer support helpdesk with:
- A **CLI console** (`node cli/cli.js`) for agent operations
- A **REST API** (`node api/server.js`) on port 3001
- A **React web dashboard** (Vite, port 5173)
- A **JSON datastore** in `/data` with atomic writes

---

## Requirements

- Node.js 18+
- npm

No database. No external services. No auth.

---

## Install & Run

```bash
git clone https://github.com/Davexinoh/intercom-desk
cd intercom-desk
npm install
npm run install:web
npm run seed
npm run dev
Or run components separately:
npm run api   # API only (port 3001)
npm run cli   # CLI only
npm run web   # Web only (port 5173)
CLI Commands
Command
Description
Example
status
System health check
status
complaint
Interactive intake wizard
complaint
inbox [filter]
List tickets
inbox / inbox high / inbox closed
open <id>
View ticket thread
open 3
reply <id> "text"
Send agent reply
reply 3 "We're on it!"
close <id>
Close ticket
close 3
assign <id> <agent>
Assign ticket
assign 3 Alice
priority <id> <level>
Set priority
priority 3 high
suggest <id> [tone]
Suggested reply
suggest 3 friendly
macros
List all macros
macros
macro <key>
Print macro
macro refund_policy
stats
Analytics dashboard
stats
auto on|off
Toggle auto-resolve
auto on
help
Show all commands
help
exit
Quit CLI
exit
Macro Keys
Key
Description
refund_policy
Refund policy explanation
password_reset
Step-by-step reset guide
payment_failed
Payment troubleshooting
security_escalation
High-priority security response
bug_report_request
Request for bug details
close_resolved
Closing message
escalate_manager
Escalate to senior team
Complaint Categories
billing — Billing & Payments
account — Account & Access
security — Security & Fraud (auto-set to HIGH)
technical — Technical Issues
product — Product & Features
other — Other
Auto-Priority Rules
Category
Subcategory
Priority
security
any
HIGH
billing
payment_failed
HIGH
billing
charge_error
HIGH
account
locked_account
HIGH
technical
performance
HIGH
billing
refund_request
MEDIUM
account
password_reset
LOW
product
any
LOW
Data Files
File
Contents
data/tickets.json
All tickets
data/agents.json
Agent records
data/stats.json
Global stats + settings
Troubleshooting
API won't start: Check port 3001 is free. Run lsof -i :3001.
Web won't connect to API: Ensure API is running first. Check CORS.
Data missing: Run npm run seed to reset to demo state.
CLI wizard hangs: Press Ctrl+C and try again.
Trac Address
trac1e822qqhy2x0jsl03y57zaflucewszpdg0k4cv2tu0s3p4sj87z7qg4h5h2
