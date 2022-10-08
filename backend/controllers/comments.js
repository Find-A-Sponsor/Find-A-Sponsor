const jwt = require('jsonwebtoken')
const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const User = require('../models/user')
const Post = require('../models/post')
const ObjectId = require('mongodb').ObjectId
const moment = require('moment')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  if (authorization) {
    return authorization
  }
  return null
}

commentRouter.post('/', async(req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  const verifiedToken = jwt.verify(token, process.env.SECRET)
  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const user = await User.findById(verifiedToken.id)
  const post = await Post.findById(body.postId)

  const comment = new Comment({
    text: body.newComment,
    images: body.images,
    gif: body.gif,
    date: (moment(new Date()).format('LLLL')).toString(),
    owner: user._id,
    username: user.username,
    likes: 0,
    comments: 0,
    likedBy: [],
    nestedPosition: 1,
    belongsToPost: post._id
  })

  const savedComment = await comment.save()
  user.commentsMade = user.commentsMade.concat(savedComment._id)
  await user.save()

  res.status(200).json(savedComment)
})

commentRouter.put('/:id', async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  const verifiedToken = jwt.verify(token, process.env.SECRET)
  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const userWhoLikes = await User.findById(verifiedToken.id)
  let commentToUpdate;

  if (body.action === 'increase') {

    commentToUpdate = await Comment.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$set: {likes: body.variable}, $addToSet: {likedBy: userWhoLikes._id}}, {new: true})

  } else if (body.action === 'decrease') {

    commentToUpdate = await Comment.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$set: {likes: body.variable}, $pull: {likedBy: userWhoLikes._id}}, {new: true})
  
  } else if (body.action === 'editComment') {
    commentToUpdate = await Comment.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$set: {text: body.variable, date: (moment(new Date()).format('LLLL')).toString(), "status": "edited"}}, {new: true})
  } else if (body.action === 'addMedia') {
    if (body.variable.type === "gif" || body.variable.type.includes("gif")) {
      commentToUpdate = await Comment.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$set: {gif: body.variable.url}}, {new: true})
    } else if (body.variable.type === "images" || body.variable.type.includes("image")) {
      commentToUpdate = await Comment.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$push: {images: body.variable.url}}, {new: true})
    }
  } else if (body.action === 'removeMedia') {
    const type = body.variable
    if (type === "images") {
      commentToUpdate = await Comment.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$set: {images: []}}, {new: true})
    } else if (type === "gif") {
      commentToUpdate = await Comment.findOneAndUpdate({_id: ObjectId(req.params.id)},
  {$unset: {gif: ""}}, {new: true})
    }
  }

  res.status(200).json(commentToUpdate);
})

commentRouter.get('/', async (req, res) => {
  const token = getTokenFrom(req)
  const verifiedToken = jwt.verify(token, process.env.SECRET)

  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const comments = await Comment.find({})

  res.status(200).json(comments)
})

commentRouter.get('/:id', async (req, res) => {
  let token = getTokenFrom(req)
  token = token.replace(/^Bearer\s+/, "");
  const verifiedToken = jwt.verify(token, process.env.SECRET)
  const id = ObjectId(req.params.id)

  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const singleComment = await Comment.findById({_id: id})

  res.status(200).json(singleComment);

})

commentRouter.delete('/:id', async (req, res) => {
  let token = getTokenFrom(req)
  const verifiedToken = jwt.verify(token, process.env.SECRET)
  const id = ObjectId(req.params.id)

  if (!verifiedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }
  
  const singleCommentRequest = await Comment.findByIdAndDelete(id)

  res.status(200).json(singleCommentRequest)
})


module.exports = commentRouter