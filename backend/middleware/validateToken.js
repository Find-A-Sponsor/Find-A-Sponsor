const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {
  const accessToken = req.cookies['access-token']
  
  if (!accessToken) return res.status(400).json({error: 'User not authenticated'})

  try {
    const validToken = verify(accessToken, process.env.SECRET)
    if (validToken) {
      req.authenticated = true
      return next()
    }
  } catch (err) {
    return res.status(400).json({error: err });
  }
}

module.exports = { validateToken }