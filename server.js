const express = require('express')

const server = express()

const dbRouter = require('./data/db-router')

server.use(express.json())
server.use('./api/posts', dbRouter)

module.exports = server
