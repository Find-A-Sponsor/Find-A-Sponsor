const jwt = require('jsonwebtoken')
const postRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  if (authorization) {
    return authorization
  }
  return null
}

postRouter.post('/', async(req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  const verifiedToken = jwt.verify(token, process.env.SECRET)
  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const user = await User.findById(verifiedToken.id)

  const post = new Post({
    text: body.text,
    image: body.image,
    video: body.video,
    document: body.document,
    date: new Date(),
    owner: user._id,
    likes: 0,
    shares: 0,
    comments: 0 
  })

  const savedPost = await post.save()
  user.posts = user.posts.concat(savedPost._id)
  await user.save()

  res.status(200).json(savedPost)


})



module.exports = postRouter