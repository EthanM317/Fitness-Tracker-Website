<template>
  <div class="exercise-form">
    <h2>Select Your Exercise</h2>
    <form @submit.prevent="submitForm">
      
      <div class="form-group" v-if="!isAddingCustom">
        <label for="name">Exercise Type:</label>
        <div class="input-group">
          <select id="name" v-model="form.name" @change="handleSelectChange" required>
            <option disabled value="">Select an exercise</option>
            
            <optgroup label="Default Exercises">
              <option v-for="exercise in defaultExercises" :key="exercise" :value="exercise">
                {{ exercise }}
              </option>
            </optgroup>
            
            <optgroup label="Custom Exercises" v-if="customExercises.length > 0">
              <option v-for="exercise in customExercises" :key="exercise" :value="exercise">
                {{ exercise }}
              </option>
            </optgroup>
            
            <option value="ADD_NEW">➕ Add Custom Exercise...</option>
          </select>
          
          <button type="button" class="btn-danger" v-if="isCustomSelected" @click="deleteCustomExercise" title="Delete custom exercise">
            Delete
          </button>
        </div>
      </div>

      <div class="form-group" v-if="isAddingCustom">
        <label for="customName">New Exercise Name:</label>
        <div class="input-group">
          <input type="text" id="customName" v-model="newExerciseName" placeholder="Example: Burpees">
          <button type="button" @click="saveCustomExercise">Save</button>
          <button type="button" class="btn-cancel" @click="cancelCustomExercise">Cancel</button>
        </div>
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
      
      <button type="submit" v-if="!isAddingCustom">Add Exercise</button>
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
      defaultExercises: [
        "Bench Press",
        "Push-ups",
        "Squats",
        "Pull-ups"
      ],
      customExercises: [], 
      isAddingCustom: false, 
      newExerciseName: '', 
      form: {
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
        date: this.date || new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    isCustomSelected() {
      return this.customExercises.includes(this.form.name);
    }
  },
  watch: {
    date(newDate) {
      this.form.date = newDate
    }
  },
  mounted() {
    const saved = localStorage.getItem('customExercises');
    if (saved) {
      this.customExercises = JSON.parse(saved);
    }
  },
  methods: {
    handleSelectChange() {
      if (this.form.name === 'ADD_NEW') {
        this.isAddingCustom = true;
        this.form.name = ''; 
      }
    },
    saveCustomExercise() {
      const name = this.newExerciseName.trim();
      if (!name) return; 
      
      if (!this.defaultExercises.includes(name) && !this.customExercises.includes(name)) {
        this.customExercises.push(name);
        localStorage.setItem('customExercises', JSON.stringify(this.customExercises));
      }
      
      this.form.name = name;
      this.isAddingCustom = false;
      this.newExerciseName = '';
    },
    cancelCustomExercise() {
      this.isAddingCustom = false;
      this.newExerciseName = '';
      this.form.name = '';
    },
    deleteCustomExercise() {
      this.customExercises = this.customExercises.filter(ex => ex !== this.form.name);
      localStorage.setItem('customExercises', JSON.stringify(this.customExercises));
      this.form.name = ''; 
    },
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
}

.exercise-form h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  gap: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid var(--border);
  background-color: var(--code-bg);
  color: var(--text);
  font-family: inherit;
  font-size: inherit;
}

button {
  background-color: var(--green-1);
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

button:hover {
  background-color: var(--green-2);
}

.btn-danger {
  background-color: var(--red-1);
}

.btn-danger:hover {
  background-color: var(--red-2);
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

.btn-cancel:hover {
  background-color: var(--border);
}
</style>
