import axios from "axios";
const baseUrl = 'http://localhost:3001'

const postComment = async (req, token) => {
  const newComment  = req

  const config = {
    headers: {
      Authorization: token.token
    }
  }

  const object = {
    newComment
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

export default {
  postComment,
  getComments
}