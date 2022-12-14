/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
import axios from "axios";

const baseUrl = process.env.NODE_ENV === "production" ? "/api/comments" : "http://localhost:3001/api/comments"


const postComment = async (req, postId, token, position, originalPostId = "") => {
  const newComment  = req
  console.log(newComment);

  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const object = {
    newComment,
    postId,
    nestedPosition: position,
    originalPostId
  }

  const response = await axios.post(baseUrl, object, config)

  return response
}

const getComments = async (token) => {
  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const response = await axios.get(baseUrl, config)

  return response
}

const configureComment = async (commentId, token, variable, action) => {
  const config = {
    headers: {
      'Authorization': token.token
    }
  }

  if (action === 'increase') {
    variable += 1
  } else if (action === 'decrease') {
    variable -= 1
  }

  const response = await axios.put(`${baseUrl}/${commentId}`, {variable, action}, config)
  return response;
}

const removeComment = async (req, token) => {
  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const response = await axios.delete(`${baseUrl}/${req}`, config)
  return response
}

export default {
  postComment,
  getComments,
  configureComment,
  removeComment
}