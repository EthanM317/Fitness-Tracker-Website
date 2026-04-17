const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const app = express();
const port = 3000;

const DATABASE_PATH = "./db.json";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for exercises
let exercises = [];
let customExerciseTypes = [];

let personalBests = {};
let customPersonalBests = {};

// -- Routes --
// Get exercise on date, or all exercises
app.get('/api/exercises', (req, res) => {
  const { date } = req.query
  if (date) {
    const filtered = exercises.filter(e => e.date === date)
    res.json(filtered)
  } else {
    res.json(exercises)
  }
});

// Create a new exercise
app.post('/api/exercises', async (req, res) => {
  const exercise = req.body;
  exercise.id = Date.now();
  exercises.push(exercise);
  res.json(exercise);

  await writeDatabase();

  console.log("Created new exercise: ", exercise)
});

// Update exercise
app.put('/api/exercises/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = exercises.findIndex(e => e.id === id);
  if (index !== -1) {
    exercises[index] = { ...exercises[index], ...req.body };
    res.json(exercises[index]);
    console.log("Updated exercise ", index);

    await writeDatabase();
  } else {
    res.status(404).json({ error: 'Exercise not found' });
  }
});

// Delete an exercise by ID
app.delete('/api/exercises/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  exercises = exercises.filter(e => e.id !== id);
  res.json({ success: true });

  await writeDatabase();

  console.log("Deleted exercise ", id)
});

// Get all custom exercise types
app.get('/api/custom-exercise-types', (req, res) => {
  res.json(customExerciseTypes);
  console.log("Fetched all custom event types ", customExerciseTypes);
});

// Create a new custom exercise type
app.post('/api/custom-exercise-types', async (req, res) => {
  customExerciseTypes = req.body;
  res.json({ success: true });
  await writeDatabase();
});

// Delete a custom exercise type
app.delete('/api/custom-exercise-types/:id', async (req, res) => {
  const id = req.params.id;
  customExerciseTypes = customExerciseTypes.filter(e => e !== id);
  res.json({ success: true });

  await writeDatabase();

  console.log("Deleted custom exercise type ", id)
});


// Fetch all personal bests
app.get('/api/pb', async (req, res) => {
  const { name } = req.query
  if (name) {
    // Return just the thing we're looking for
    const pb = personalBests[name];
    res.json(pb);
  } else {
    // Return everything
    res.json(personalBests);
    console.log("Fetching personalBests: ", personalBests);
  }
});

// Create a new personal best
app.post('/api/pb', async (req, res) => {
  const pb = req.body;

  personalBests[pb.name] = {
    units: pb.units,
    value: pb.value,
    isCustom: pb.isCustom
  };
  res.json({ success: true });

  await writeDatabase();
  // console.log("Created new pb: ", personalBests[pb.name]);
});

// Delete a personal best type
app.delete('/api/pb/:id', async (req, res) => {
  const id = req.params.id;

  console.log(id);

  if (id in personalBests) {
    delete personalBests[id];
  }

  res.json({ success: true });

  await writeDatabase();

  console.log("Deleted custom pb type ", id)
});


// -- "Database" functions --
async function writeDatabase() {
  // The whole database is just stored as a single JSON.
  // This wouldn't scale very well, but it works for our simple app.
  let data = {
    exercises: exercises,
    customExerciseTypes: customExerciseTypes,
    personalBests: personalBests
  };

  await fs.writeFile(DATABASE_PATH, JSON.stringify(data));
}

async function readDatabase() {
  // Try to read database. Don't proceed if it doesn't exist yet
  let isDatabaseValid = await fileExists(DATABASE_PATH);
  if (!isDatabaseValid) {
    return;
  }
  
  let data = JSON.parse(await fs.readFile(DATABASE_PATH));

  if (data.exercises) {
    exercises = data.exercises;
  }

  if (data.customExerciseTypes) {
    customExerciseTypes = data.customExerciseTypes;
  }

  if (data.personalBests) {
    personalBests = data.personalBests;
  }
}

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false
  }
}

async function startServer() {
  await readDatabase();
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();