/* eslint-disable prettier/prettier */
import axios from "axios";

const baseUrl = process.env.NODE_ENV === "production" ? "" : "http://localhost:3001"

const login = async (req) => {
  const { email, password } = req

  const object = {
    email,
    password
  }

  const response = await axios.post(`${baseUrl}/api/login`, object)

  return response
}

export default {
  login,
}