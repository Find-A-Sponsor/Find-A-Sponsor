const http = require("http")
const path = require("path")
const app = require("./app")

const server = http.createServer(app)

const PORT = process.env.PORT || 443

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html")) // trial
})

server.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
