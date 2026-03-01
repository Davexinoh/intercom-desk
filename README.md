# 🎧 Intercom Desk

**A full-stack customer support workspace built on the [Intercom](https://github.com/Trac-Systems/intercom) ecosystem — Trac Network.**

Intercom Desk combines a **CLI agent console** and a **React web dashboard** into one seamless support workflow. Agents can triage complaints, reply to tickets, run macros, and track performance — all from the terminal or browser, with zero external dependencies.

> Fork of [Trac-Systems/intercom](https://github.com/Trac-Systems/intercom)

---

## ✨ What it demonstrates

| Feature | Details |
|---------|---------|
| 🧙 Complaint Wizard | Category → subcategory intake flow (CLI + Web) |
| 📨 Inbox | Filter by status, priority, keyword search |
| 🧵 Ticket Threads | Full user/agent/system message history |
| Macros | 7 built-in response templates, one-click insert |
| Suggested Replies | Template engine with 3 tones — no external AI |
| Auto-Priority Rules | Security/payment tickets auto-set to HIGH |
| 🔄 Auto-Resolve | Simple cases (e.g. password reset) resolved instantly |
| 📊 Analytics | Response times, leaderboard, top categories |
| Seed Data | 6 realistic demo tickets loaded instantly |
| CLI + Web | Same JSON datastore, two interfaces |

---

## 🚀 Quickstart

```bash
git clone https://github.com/Davexinoh/intercom-desk
cd intercom-desk
npm install
npm run install:web
npm run seed        # loads 6 demo tickets instantly
npm run dev         # starts API (3001) + Web (5173) + CLI
That's it. Three commands and you're live.
🌐 Web Dashboard → http://localhost:5173
🔌 REST API      → http://localhost:3001
🎧 CLI Console   → your terminal
🎧 CLI Demo
node cli/cli.js

desk> status                         # system health check
desk> inbox                          # all open tickets
desk> inbox high                     # high priority only
desk> complaint                      # interactive intake wizard
desk> open 1                         # view ticket thread
desk> suggest 1 friendly             # AI-free suggested reply
desk> reply 1 "We're on it!"        # send reply
desk> macro security_escalation      # insert macro
desk> assign 1 Alice                 # assign to agent
desk> priority 2 high                # escalate priority
desk> close 4                        # resolve ticket
desk> stats                          # analytics dashboard
🌐 Web Dashboard Demo
Open https://intercomdesk.netlify.app/
Click ✍️ New Complaint → select category → subcategory → submit
Watch auto-priority fire instantly on security/payment tickets
Open 📨 Inbox → click any ticket
Use Suggested Reply panel → pick tone → Insert into Reply
Click a Macro chip to fill the reply box
Assign agent, set priority, send reply, close ticket
Visit 📊 Analytics for live leaderboard + stats
🔌 API
Method
Endpoint
Description
GET
/api/health
System health check
GET
/api/complaints
Complaint categories
GET
/api/tickets
List tickets (filters: status/priority/q)
GET
/api/tickets/:id
Single ticket
POST
/api/tickets
Create ticket
POST
/api/tickets/:id/reply
Agent reply
POST
/api/tickets/:id/close
Close ticket
POST
/api/tickets/:id/assign
Assign to agent
POST
/api/tickets/:id/priority
Set priority
GET
/api/tickets/:id/suggest
Suggested reply
GET
/api/macros
List macros
GET
/api/stats
Analytics

�

Trac Address
trac1e822qqhy2x0jsl03y57zaflucewszpdg0k4cv2tu0s3p4sj87z7qg4h5h2
Bounty submission — Trac Network Intercom vibe competition.
