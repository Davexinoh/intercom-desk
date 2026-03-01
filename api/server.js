'use strict'

const express = require('express')
const cors    = require('cors')
const routes  = require('./routes')

const app  = express()
const PORT = process.env.API_PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.listen(PORT, '127.0.0.1', () => {
  console.log(`  ✅ API server running at http://localhost:${PORT}`)
})

module.exports = app
