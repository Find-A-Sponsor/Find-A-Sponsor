import axios from "axios";
const baseUrl = 'http://localhost:3001'

const makeAPost = async (req, token) => {
  const config = {headers: {
    Authorization: token.token
  },}

  const { text, image, video, document } = req


  const object = {
    text,
    image,
    video,
    document
  }
  const response = await axios.post(`${baseUrl}/api/posts`, object, config)
  return response
}

export default {
  makeAPost
}