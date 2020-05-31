const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
}

const password = process.argv[2];

const url = `mongodb+srv://fs-db-user:${password}@cluster0-acj2u.mongodb.net/persons-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  console.log("process.argv", process.argv);
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then(() => {
    console.log(
      "added ",
      person.name,
      " number ",
      person.number,
      " to phonebook"
    );
    mongoose.connection.close();
    process.exit(1);
  });
} else if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
