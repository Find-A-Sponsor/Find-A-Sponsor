import axios from "axios";
const baseUrl = 'http://localhost:3001'

const postComment = async (req, postId, token) => {
  const newComment  = req

  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const object = {
    newComment,
    postId
  }

  const response = await axios.post(`${baseUrl}/api/comments`, object, config)

  return response
}

const getComments = async (token) => {
  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const response = await axios.get(`${baseUrl}/api/comments`, config)

  return response
}

const configureComment = async (commentId, token, likes, action) => {
  const config = {
    headers: {
      'Authorization': token.token
    }
  }

  if (action === 'increase') {
    likes = likes + 1
  } else if (action === 'decrease') {
    likes = likes - 1
  }

  const response = await axios.put(`${baseUrl}/api/comments/${commentId}`, {likes, action}, config)
  return response;
}

const removeComment = async (req, token) => {
  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const response = await axios.delete(`${baseUrl}/api/comments/${req}`, config)
  return response
}

export default {
  postComment,
  getComments,
  configureComment,
  removeComment
}