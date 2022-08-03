const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  image: String,
  video: String,
  document: String,
  date: Date,
  tags: String,
  likes: Number,
  comments: Number,
  shares: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  replies: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Replies"
  }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post