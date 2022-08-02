import axios from 'axios'
const baseUrl = 'http://localhost:3001'

let token = null;
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/api/users`)
  return response
}

const newUser = async (req, checker = '') => {
  if (checker === 'username') {
    try {
    const response = await axios.post(`${baseUrl}/api/users`, {req, checker})
    return response
    } catch(err) {
      return 'Username is already taken'
    }
  } else if (checker === 'email') {
    try {
      const response = await axios.post(`${baseUrl}/api/users`, {req, checker})
      return response
    } catch (err) {
      return 'Email is already in use'
    }
  }

  const { username, name, email, password, dateOfBirth, location, profileImageURL, biography, addictions, groups } = req

  const object = {
    username,
    name,
    email,
    password,
    dateOfBirth,
    location,
    profileImageURL,
    biography,
    addictions,
    groups
  }
  const response = await axios.post(`${baseUrl}/api/users`, object)

  return response
}

const findUser = async (req) => {

  const config = {headers: {
    Authorization: token
  },}

  try {
    const response = await axios.post(`${baseUrl}/api/users/findUser`, req, config )
    return response
  } catch (err) {
    return err
  }
}

export default {
  getAll,
  newUser,
  findUser,
  setToken
}