const jwt = require('jsonwebtoken')
const postRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const ObjectId = require('mongodb').ObjectId

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
    images: body.images,
    video: body.video,
    gif: body.gif,
    date: new Date(),
    owner: user._id,
    username: user.username,
    likes: 0,
    shares: 0,
    comments: 0,
    location: user.location,
    likedBy: []
  })

  const savedPost = await post.save()
  user.posts = user.posts.concat(savedPost._id)
  await user.save()

  res.status(200).json(savedPost)
})

postRouter.put('/:id', async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  const verifiedToken = jwt.verify(token, process.env.SECRET)
  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const userWhoLikes = await User.findById(verifiedToken.id)
  let postToUpdate;

  if (body.action === 'increase') {

    postToUpdate = await Post.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$set: {likes: body.variable}, $addToSet: {likedBy: userWhoLikes._id}}, {new: true})

  } else if (body.action === 'decrease') {

    postToUpdate = await Post.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$set: {likes: body.variable}, $pull: {likedBy: userWhoLikes._id}}, {new: true})
  
  } else if (body.action === 'increaseCommentCount') {
    postToUpdate = await Post.findOneAndUpdate({_id: ObjectId(req.params.id)},
    {$set: {comments: body.variable}})
  }

  res.status(200).json(postToUpdate);
})

postRouter.get('/', async (req, res) => {
  const token = getTokenFrom(req)
  const verifiedToken = jwt.verify(token, process.env.SECRET)

  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const posts = await Post.find({})

  res.status(200).json(posts)
})

postRouter.get('/:id', async (req, res) => {
  let token = getTokenFrom(req)
  token = token.replace(/^Bearer\s+/, "");
  const verifiedToken = jwt.verify(token, process.env.SECRET)
  const id = ObjectId(req.params.id)

  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const singlePost = await Post.findById({_id: id})

  res.status(200).json(singlePost);

})


module.exports = postRouter