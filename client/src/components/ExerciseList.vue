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
  margin: 15px;
  max-width: 600px;
  color: var(--text);
}

.exercise-list h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 15px;
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--border);
  margin-bottom: 10px;
  background-color: var(--bg);
}

.exercise-info {
  margin-right: 10px;
}

.delete-btn {
  background-color: var(--red-1);
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: var(--red-2);
}

ul {
  padding: 0px;
}
</style>