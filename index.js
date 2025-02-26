const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

morgan.token('res-data', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :res-data'));

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const textHTML = `
  <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}</p>
  <p>${new Date()}</p>`;

  res.end(textHTML);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({ error: 'Name must be unique!' });
  }

  if (!body.name) {
    return res.status(400).json({ error: 'Missing name!' });
  }

  if (!body.number) {
    return res.status(400).json({ error: 'Missing number!' });
  }

  const person = {
    id: String(Math.floor(Math.random() * 1000)),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
