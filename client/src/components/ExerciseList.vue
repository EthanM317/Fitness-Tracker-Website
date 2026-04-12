<template>
  <div class="exercise-list">
    <h2>Exercise History</h2>
    <ul>
      <li v-for="exercise in exercises" :key="exercise.id" class="exercise-item">
        <div class="exercise-info">
          <strong>{{ exercise.name }}</strong> - {{ exercise.sets }} sets x {{ exercise.reps }} reps @ {{ exercise.weight }}kg on {{ exercise.date }}
        </div>
        <button @click="deleteExercise(exercise.id)" class="delete-btn">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ExerciseList',
  props: {
    exercises: {
      type: Array,
      required: true
    }
  },
  methods: {
    deleteExercise(id) {
      this.$emit('delete-exercise', id)
    }
  }
}
</script>

<style scoped>
.exercise-list {
  margin: 20px auto;
  max-width: 800px;
  color: #1a1a1a;
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  color: #1a1a1a;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
</style>