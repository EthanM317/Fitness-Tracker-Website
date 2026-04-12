const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for exercises
let exercises = [];

// Routes
app.get('/api/exercises', (req, res) => {
  const { date } = req.query
  if (date) {
    const filtered = exercises.filter(e => e.date === date)
    res.json(filtered)
  } else {
    res.json(exercises)
  }
});

app.post('/api/exercises', (req, res) => {
  const exercise = req.body;
  exercise.id = Date.now();
  exercises.push(exercise);
  res.json(exercise);
});

app.put('/api/exercises/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = exercises.findIndex(e => e.id === id);
  if (index !== -1) {
    exercises[index] = { ...exercises[index], ...req.body };
    res.json(exercises[index]);
  } else {
    res.status(404).json({ error: 'Exercise not found' });
  }
});

app.delete('/api/exercises/:id', (req, res) => {
  const id = parseInt(req.params.id);
  exercises = exercises.filter(e => e.id !== id);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});