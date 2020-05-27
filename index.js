const express = require("express");
const app = express();
var morgan = require("morgan");

morgan.token("resBody", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :resBody"
  )
);
app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((note) => {
    return note.id === id;
  });

  person === undefined
    ? response.status(404).send("<p>404</p>")
    : response.json(person);
});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  pernsons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
app.get("/info", (req, res) => {
  const personCount = persons.length;
  const date = new Date();
  const infoResp = `<h3>Phonebook has ${personCount} entries</h3><p>${date} </p>`;

  res.send(infoResp);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});
const generateId = () => {
  const id = Math.floor(Math.random() * 100000);
  return id;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  } else if (persons.map((person) => person.name).includes(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
