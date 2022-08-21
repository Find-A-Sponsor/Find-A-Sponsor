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

const configurePost = async (postId, token, likes, action) => {
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

  const response = await axios.put(`${baseUrl}/api/posts/${postId}`, {likes, action}, config)
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

export default {
  makeAPost,
  getPosts,
  getSpecficPost,
  configurePost
}