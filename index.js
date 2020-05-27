const express = require("express");
const app = express();
app.use(express.static("build"));
var morgan = require("morgan");
const root = "./static/index.html";
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());

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

app.get("/", (req, res) => {
  res.send(root);
});
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((person) => {
    response.json(person);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
