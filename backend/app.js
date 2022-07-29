const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const usersRouter = require('./controllers/user')

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)

module.exports = app