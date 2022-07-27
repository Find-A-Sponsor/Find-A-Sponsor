const bcrypt = require('bcrypt')
const express = require('express')
const usersRouter = require('express').Router()
const User = require('../models/user')
usersRouter.use(express.json())

usersRouter.get('/', async (req, res) => {
  const users = await User
  .find({})

  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  if (req.body.checker === 'username') {
    const user = req.body.req
    const existingUser = await User.findOne({ username: {$eq: user}})
    if (existingUser) {
    return res.status(400).json({
        error: 'username is already taken'
    })
    } else {
      return res.status(200).json({
        error: 'You are good to go!'
      })
    }
  } else if (req.body.checker === 'email') {
    const email = req.body.req
    const existingEmail = await User.findOne({ email: {$eq: email} })
    if (existingEmail) {
      return res.status(400).json({
        error: 'Email is already in use'
      })
    } else {
      return res.status(200).json({
        error: 'You are good to go!'
      })
    }
  }
  
  const { username, name, email, password, dateOfBirth, location } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    email,
    passwordHash,
    dateOfBirth,
    location
  })

  const savedUser = await user.save()

  return res.status(201).json(savedUser)

})

module.exports = usersRouter