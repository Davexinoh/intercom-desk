'use strict'

const express = require('express')
const cors    = require('cors')
const routes  = require('./routes')

const app = express()

// Render provides PORT automatically
const PORT = process.env.PORT || 3001

// Allow frontend (Netlify) to call the API
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

// Health check route (Render needs this)
app.get('/', (req,res)=>{
  res.send('Intercom Desk API running 🚀')
})

app.use('/api', routes)

// IMPORTANT: do NOT bind to 127.0.0.1 (Render can't access it)
app.listen(PORT, () => {
  console.log(`✅ API server running on port ${PORT}`)
})

module.exports = app
