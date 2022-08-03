import axios from "axios";
const baseUrl = 'http://localhost:3001'

const makeAPost = async (req, token) => {
  console.log(req)
  console.log(token)
  const { text, image, video, document } = req


  const object = {
    text,
    image,
    video,
    document
  }

  const response = await axios.post(`${baseUrl}/api/posts`, object)
  return response
}

export default {
  makeAPost
}