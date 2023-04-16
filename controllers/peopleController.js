/* eslint-disable linebreak-style */
const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('/', (request, response, next) => {
  Person.find({})
    .then((person) => {
      response.json(person)
    })
    .catch((err) => next(err))
})

personRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

personRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

personRouter.post('/', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => response.json(savedAndFormattedPerson))
    .catch((err) => next(err))
})

personRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const newPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

personRouter.get('/info', (request, response, next) => {
  Person.find({})
    .then((res) => {
      response
        .status(200)
        .send(
          `<div><p>Phonebook has info for ${
            Object.keys(res).length
          } people</p><p>${new Date()}</p></div>`
        )
    })
    .catch((error) => next(error))
})


module.exports = personRouter