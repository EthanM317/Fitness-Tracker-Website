<template>
  <div class="day-view">
    <h1>{{ formattedDate }}</h1>
    <button @click="$router.push('/')">Back to Calendar</button>
    <ExerciseForm :date="date" @add-exercise="addExercise" />
    <ExerciseList :exercises="exercises" @delete-exercise="deleteExercise" />
  </div>
</template>

<script>
import ExerciseForm from './ExerciseForm.vue'
import ExerciseList from './ExerciseList.vue'

export default {
  name: 'DayView',
  components: {
    ExerciseForm,
    ExerciseList
  },
  props: {
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      exercises: []
    }
  },
  computed: {
    formattedDate() {
      return new Date(this.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  mounted() {
    this.fetchExercises()
  },
  watch: {
    date() {
      this.fetchExercises()
    }
  },
  methods: {
    async fetchExercises() {
      try {
        const response = await fetch(`/api/exercises?date=${this.date}`)
        this.exercises = await response.json()
      } catch (error) {
        console.error('Error fetching exercises:', error)
      }
    },
    async addExercise(exercise) {
      try {
        const response = await fetch('/api/exercises', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...exercise, date: this.date })
        })
        const newExercise = await response.json()
        this.exercises.push(newExercise)
      } catch (error) {
        console.error('Error adding exercise:', error)
      }
    },
    async deleteExercise(id) {
      try {
        await fetch(`/api/exercises/${id}`, {
          method: 'DELETE'
        })
        this.exercises = this.exercises.filter(e => e.id !== id)
      } catch (error) {
        console.error('Error deleting exercise:', error)
      }
    }
  }
}
</script>

<style scoped>
.day-view {
  max-width: 800px;
  margin: 0 auto;
}

.day-view h1 {
  color: #1a1a1a;
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
}

button {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>