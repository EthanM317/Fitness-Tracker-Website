<template>
  <div class="day-view">
    <h1>{{ formattedDate }}</h1>
    <button @click="$router.push('/')">Back to Calendar</button>
    <div class="flex-container">
      <div class="element-container">
        <ExerciseForm class="exerciseForm" :date="date" @add-exercise="addExercise" />
      </div>
      <div class="element-container">
        <ExerciseList class="exerciseList" :exercises="exercises" @delete-exercise="deleteExercise" />
      </div>
    </div>
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
      const [year, month, day] = this.date.split('-');
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
  margin: 0 5%;
}

.day-view h1 {
  color: var(--text-h);
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.flex-container {
  display: flex;
  gap: 5%;
  padding-top: 15px;
}

.element-container {
  flex: 1 1 0;
  background-color: var(--code-bg);
  border-radius: 24px;
}

.exercise-form {
  margin-left: auto;
  margin-right: auto;
}

button {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: var(--green-1);
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: var(--green-2);
}
</style>
