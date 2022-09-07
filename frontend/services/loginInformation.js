/* eslint-disable prettier/prettier */
import axios from "axios";

const login = async (req) => {
  const { email, password } = req

  const object = {
    email,
    password
  }

  const response = await axios.post(`/api/login`, object)

  return response
}

export default {
  login,
}