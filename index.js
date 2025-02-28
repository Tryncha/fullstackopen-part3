require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person.js');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

morgan.token('res-data', (req, res) => {
  return JSON.stringify(req.body);
});

// app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-data'));

function errorHandler(err, req, res, next) {
  console.log(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  next(err);
}

app.use(errorHandler);

// let people = [
//   {
//     id: '1',
//     name: 'Arto Hellas',
//     number: '040-123456'
//   },
//   {
//     id: '2',
//     name: 'Ada Lovelace',
//     number: '39-44-5323523'
//   },
//   {
//     id: '3',
//     name: 'Dan Abramov',
//     number: '12-43-234345'
//   },
//   {
//     id: '4',
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122'
//   }
// ];

app.get('/api/people', (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get('/info', (req, res) => {
  Person.find({}).then((people) => {
    const textHTML = `
    <p>Phonebook has info for ${people.length} ${people.length === 1 ? 'person' : 'people'}</p>
    <p>${new Date()}</p>`;

    res.end(textHTML);
  });
});

app.get('/api/people/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.post('/api/people', (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.put('/api/people/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/people/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
