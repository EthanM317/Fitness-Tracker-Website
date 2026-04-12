<template>
  <div class="exercise-form">
    <h2>Add Exercise</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Exercise Name:</label>
        <input type="text" id="name" v-model="form.name" required>
      </div>
      <div class="form-group">
        <label for="sets">Sets:</label>
        <input type="number" id="sets" v-model.number="form.sets" min="0" required>
      </div>
      <div class="form-group">
        <label for="reps">Reps:</label>
        <input type="number" id="reps" v-model.number="form.reps" min="0" required>
      </div>
      <div class="form-group">
        <label for="weight">Weight (lbs):</label>
        <input type="number" id="weight" v-model.number="form.weight" min="0" step="5" required>
      </div>
      <div class="form-group" v-if="!date">
        <label for="date">Date:</label>
        <input type="date" id="date" v-model="form.date" required>
      </div>
      <button type="submit">Add Exercise</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ExerciseForm',
  props: {
    date: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
        date: this.date || new Date().toISOString().split('T')[0]
      }
    }
  },
  watch: {
    date(newDate) {
      this.form.date = newDate
    }
  },
  methods: {
    submitForm() {
      this.$emit('add-exercise', { ...this.form })
      this.resetForm()
    },
    resetForm() {
      this.form = {
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
        date: this.date || new Date().toISOString().split('T')[0]
      }
    }
  }
}
</script>

<style scoped>
.exercise-form {
  margin: 20px auto;
  max-width: 400px;
  color: #1a1a1a;
}

.exercise-form h2 {
  color: #1a1a1a;
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #1a1a1a;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  color: #1a1a1a;
  background-color: #fff;
  border: 1px solid #ccc;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>