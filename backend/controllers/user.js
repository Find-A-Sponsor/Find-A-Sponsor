const bcrypt = require('bcrypt')
const express = require('express')
const { validateToken } = require('../middleware/validateToken')
const usersRouter = require('express').Router()
const User = require('../models/user')
usersRouter.use(express.json())
const jwt = require('jsonwebtoken')

usersRouter.post('/findUser', validateToken, async (req, res) => {
  if (req.authenticated) {
    const email = req.email
    try {
    const user = await User.findOne({email: {$eq: email}})
    return res.status(200).json({user})
    } catch (err) {
      return res.status(404).json({err: err})
    }
  } else {
    return res.status(400).json({err: 'You are not authenticated'})
  }
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
  
  const { username, name, email, password, dateOfBirth, location, profileImageURL, biography, addictions, groups } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const userForToken = {
    email: email,
    username: username,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  const user = new User({
    username,
    name,
    email,
    passwordHash,
    dateOfBirth,
    location,
    profileImageURL,
    following: 0,
    followers: 0,
    biography,
    addictions,
    groups
  })

  await user.save()

  return res.status(201).json({ token, user })

})

module.exports = usersRouter