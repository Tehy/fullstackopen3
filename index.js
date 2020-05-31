const express = require("express");
const app = express();
var morgan = require("morgan");
const root = "./static/index.html";
const cors = require("cors");
const Person = require("./models/person");
app.use(express.static("build"));
app.use(express.json());
morgan.token("resBody", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :resBody"
  )
);

app.use(cors());

/* const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
}; */

//routes
app.get("/", (req, res, next) => {
  res.send(root).catch((error) => next(error));
});
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date();
      const infoResp = `<h3>Phonebook has ${count} entries</h3><p>${date} </p>`;
      res.send(infoResp);
    })
    .catch((error) => next(error));
});
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, {
    runValidators: true,
    context: "query",
  })
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      //res.json(error);
      return next(error);
    });
});
app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save({ new: true, runValidators: true })
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      //console.log("POST ERROR");
      //res.json(error);
      return next(error);
    });
});
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});
// error handler
app.use((error, req, res, next) => {
  console.error("error", error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});
//unknown endpoint
app.use((req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
