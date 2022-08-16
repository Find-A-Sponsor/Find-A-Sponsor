const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/user')
const postRouter = require('./controllers/post')
const commentRouter = require('./controllers/comments')

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)

module.exports = app