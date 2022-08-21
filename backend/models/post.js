const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  images: Array,
  video: String,
  gif: String,
  date: Date,
  tags: String,
  likes: Number,
  comments: Number,
  shares: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  username: String,
  replies: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  },
  likedBy: Array
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post