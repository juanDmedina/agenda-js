const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "310-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5223523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

const findPerson = (personName) => {
  return persons.find(
    (p) => p.name.trim().toLowerCase() === personName.trim().toLowerCase()
  );
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
    return;
  }
  response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (findPerson(body.name)) {
    return response.status(400).json({
      error: "name already exists",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  response
    .status(200)
    .send(
      `<div><p>Phonebook has info for ${
        persons.length
      } people</p><p>${new Date()}</p></div>`
    );
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
