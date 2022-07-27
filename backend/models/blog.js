const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  content: String,
  date: Date,
  tags: String,
  likes: Number,
  replies: Number,
  shares: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog