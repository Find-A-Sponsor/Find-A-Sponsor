const https = require("https")
const app = require("./app")

const server = https.createServer(app)

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
