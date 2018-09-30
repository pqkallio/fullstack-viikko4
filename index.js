const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./config')

app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)
app.use(cors())

mongoose
    .connect(config.mongoUrl)
    .then(() => {
        console.log('Connected to database', config.mongoUrl)
    })
    .catch(error => {
        console.log(error)
    })

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app,
    server
}