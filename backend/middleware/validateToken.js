const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) return res.status(400).json({error: 'User not authenticated'})

  try {
    const validToken = verify(token, process.env.SECRET)
    if (validToken) {
      req.authenticated = true
      req.email = validToken.email
      return next()
    }
  } catch (err) {
    return res.status(403).json({error: err });
  }
}

module.exports = { validateToken }