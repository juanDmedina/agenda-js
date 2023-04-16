/* eslint-disable linebreak-style */
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const personRouter = require('./controllers/peopleController')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

logger.info('connecting to', config.MONGODB_CNN)

mongoose
  .connect(config.MONGODB_CNN)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/persons', personRouter)


app.use(morgan('tiny'), (req, res, next) => {
  if (req.method === 'POST') {
    console.log(req.body)
  }
  next()
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app