const https = require("https")
const app = require("./app")

const server = https.createServer(app)

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
