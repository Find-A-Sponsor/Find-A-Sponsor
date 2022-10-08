const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  images: Array,
  gif: String,
  date: String,
  likes: Number,
  comments: Number,
  nestedPosition: Number, //nestedPosition of 1 represents the first comment made in a series of comments and replies to that comment
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  username: String,
  likedBy: Array,
  belongsToPost: String,
  status: String
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment