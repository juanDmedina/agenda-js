const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./person");

const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"), (req, res, next) => {
  if (req.method === "POST") {
    console.log(req.body);
  }
  next();
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  Person.find({ name: body.name })
    .then((res) => {
      if (Object.keys(res).length > 0) {
        return response.status(400).json({
          error: "name already exists",
        });
      } else {
        newPerson
          .save()
          .then((savedPerson) => savedPerson.toJSON())
          .then((savedAndFormattedPerson) =>
            response.json(savedAndFormattedPerson)
          )
          .catch((err) => next(err));
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const newPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((res) => {
      response
        .status(200)
        .send(
          `<div><p>Phonebook has info for ${
            Object.keys(res).length
          } people</p><p>${new Date()}</p></div>`
        );
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
