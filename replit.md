# Intercom Desk

A full-stack customer support workspace — CLI agent console + React web dashboard.

## Architecture

- **Frontend**: React (Vite) — runs on port 5000, proxies `/api` to the backend
- **Backend API**: Express.js — runs on port 3001 (`127.0.0.1`)
- **CLI**: Interactive Node.js console (`cli/cli.js`)
- **Datastore**: JSON files in `/data` (no external database)

## Project Structure

```
api/            Express API server
  server.js     Listens on 127.0.0.1:3001
  routes.js     All API routes under /api

cli/            CLI agent console
  cli.js        Interactive REPL
  commands.js   Command implementations

web/            React frontend (Vite)
  src/
    App.jsx
    components/Sidebar.jsx
    pages/Inbox.jsx, Ticket.jsx, Intake.jsx, Analytics.jsx, Settings.jsx
    lib/api.js, format.js

store/          Shared business logic
  db.js         JSON file read/write
  schema.js     Default data shapes
  tickets.js    Ticket CRUD
  complaints.js Complaint categories
  rules.js      Auto-priority + auto-resolve rules
  macros.js     Response templates
  suggest.js    AI-free suggested replies
  analytics.js  Stats computation

data/           JSON datastore (gitignored in production)
  tickets.json
  agents.json
  stats.json
```

## Running

```bash
npm install
npm run install:web
npm run seed        # Load 6 demo tickets
npm run dev         # Start API (3001) + Web (5000)
```

## Key Design Decisions

- Vite dev server proxies `/api` requests to the Express backend on port 3001
- The API listens on `127.0.0.1` (not `localhost`) to ensure IPv4 compatibility with the Vite proxy
- The web frontend uses `0.0.0.0` as host for Replit proxy compatibility
- No external dependencies — everything is self-contained

## Deployment

- Target: VM (needs persistent storage for JSON data files)
- Run: `bash -c "node seed.js && npm run dev"`
