import axios from "axios";
const baseUrl = 'http://localhost:3001'

const makeAPost = async (req, token) => {
  const config = {headers: {
    Authorization: token.token
  },}

  const { text, images, video, gif } = req


  const object = {
    text,
    images,
    video,
    gif
  }

  const response = await axios.post(`${baseUrl}/api/posts`, object, config)
  return response;
}

const getPosts = async (token) => {
  const config = {
    headers: {
      'Authorization': token
    }
  }

  const response = await axios.get(`${baseUrl}/api/posts`, config)
  return response;
}

const configurePost = async (postId, token, variable, action) => {
  const config = {
    headers: {
      'Authorization': token.token
    }
  }
  if (action === 'increase') {
    variable = variable + 1
  } else if (action === 'decrease') {
    variable = variable - 1
  } else if (action === 'increaseCommentCount') {
    variable = variable + 1
  } else if (action === 'decreaseCommentCount') {
    variable = variable - 1
  }

  const response = await axios.put(`${baseUrl}/api/posts/${postId}`, {variable, action}, config)
  return response;
}

const getSpecficPost = async (req, token) => {
  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const response = await axios.get(`${baseUrl}/api/posts/${req}`, config)

  return response
}

const removePost = async (req, token) => {
  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const response = await axios.delete(`${baseUrl}/api/posts/${req}`, config)

  return response;
}

export default {
  makeAPost,
  getPosts,
  getSpecficPost,
  configurePost,
  removePost
}