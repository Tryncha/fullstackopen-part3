const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 2) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 4) {
  const personName = process.argv[2];
  const personNumber = process.argv[3];

  const person = new Person({
    name: personName,
    number: personNumber
  });

  person.save().then((result) => {
    console.log('Person saved!');
    mongoose.connection.close();
  });
}
