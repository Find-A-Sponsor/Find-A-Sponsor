/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
import axios from "axios";

const baseUrl = '/api/posts'

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

  const response = await axios.post(baseUrl, object, config)
  return response;
}

const getPosts = async (token) => {
  const config = {
    headers: {
      'Authorization': token
    }
  }

  const response = await axios.get(baseUrl, config)
  return response;
}

const configurePost = async (postId, token, variable, action) => {
  const config = {
    headers: {
      'Authorization': token.token
    }
  }
  if (action === 'increase') {
    variable += 1
  } else if (action === 'decrease') {
    variable -= 1
  } else if (action === 'increaseCommentCount') {
    variable += 1
  } else if (action === 'decreaseCommentCount') {
    variable -= 1
  }

  const response = await axios.put(`${baseUrl}${postId}`, {variable, action}, config)
  return response;
}

const getSpecficPost = async (req, token) => {
  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const response = await axios.get(`${baseUrl}${req}`, config)

  return response
}

const removePost = async (req, token) => {
  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const response = await axios.delete(`${baseUrl}/${req}`, config)

  return response;
}

export default {
  makeAPost,
  getPosts,
  getSpecficPost,
  configurePost,
  removePost
}