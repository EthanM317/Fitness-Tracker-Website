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

      <div class="exercise-link-box" v-if="!isAddingCustom && instructionLink">
        <router-link :to="instructionLink" target="_blank" class="info-link">
          View {{ form.name }} Guide
        </router-link>
      </div>

      <div class="form-group" v-if="isAddingCustom">
        <label for="customName">New Exercise Name:</label>
        <div class="input-group">
          <input 
            type="text" 
            id="customName" 
            ref="customNameInput" 
            v-model="newExerciseName" 
            placeholder="e.g., Rowing"
            @input="clearError"
          >
          <input 
            type="text" 
            id="customUnits" 
            ref="customUnitsInput" 
            v-model="newExerciseUnits" 
            placeholder="Units (km, lbs, reps...)"
            @input="clearError"
            @keyup.enter="saveCustomExercise"
          >
          <button type="button" @click="saveCustomExercise">Save</button>
          <button type="button" class="btn-cancel" @click="cancelCustomExercise">Cancel</button>
        </div>
      </div>

      <div class="form-group">
        <label for="sets">Sets:</label>
        <input type="number" id="sets" v-model.number="form.sets" min="0" required>
      </div>

      <div class="form-group">
        <label for="reps">Reps or Duration (mins):</label>
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

    <div v-if="pbToast" class="pb-toast">
      🏆 New PB! {{ pbToast.name }} — {{ pbToast.weight }} lbs
    </div>
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
      exercisePresets: {
        "Bench Press": { sets: 3, reps: 10, weight: 135 },
        "Bicep Curls": { sets: 3, reps: 12, weight: 25 },
        "Cycling": { sets: 1, reps: 1, weight: 0 },
        "Deadlift": { sets: 3, reps: 5, weight: 225 },
        "Plank": { sets: 2, reps: 1, weight: 0 },
        "Pull-ups": { sets: 3, reps: 10, weight: 0 },
        "Push-ups": { sets: 5, reps: 20, weight: 0 },
        "Running": { sets: 1, reps: 1, weight: 0 },
        "Shoulder Press": { sets: 3, reps: 10, weight: 45 },
        "Squats": { sets: 3, reps: 8, weight: 185 },
        "Tricep Dips": { sets: 3, reps: 12, weight: 0 },
        "Walking": { sets: 1, reps: 1, weight: 0 }
      },

      customExercises: [],
      isAddingCustom: false,
      newExerciseName: '',
      newExerciseUnits: '',
      form: {
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
        date: this.date || new Date().toLocaleDateString('en-CA')
      },
      pbToast: null,
      pbToastTimer: null
    }
  },

  computed: {
    defaultExercises() {
      return Object.keys(this.exercisePresets).sort();
    },
    isCustomSelected() {
      return this.customExercises.includes(this.form.name);
    },
    selectedPresetData() {
      return this.exercisePresets[this.form.name] || null;
    },
    instructionLink() {
      if (this.selectedPresetData && this.form.name) {
        const hash = this.form.name.toLowerCase().replace(/\s+/g, '-');
        return `/instructions#${hash}`;
      }
      return null;
    }
  },

  watch: {
    date(newDate) {
      this.form.date = newDate;
    }
  },

  mounted() {
    this.fetchCustomExerciseTypes();
    // Listen for changes from PersonalBests component
    window.addEventListener('exercise-list-changed', this.refreshData);
  },

  beforeDestroy() {
    window.removeEventListener('exercise-list-changed', this.refreshData);
  },

  methods: {
    refreshData() {
      this.fetchCustomExerciseTypes();
    },

    handleSelectChange() {
      if (this.form.name === 'ADD_NEW') {
        this.isAddingCustom = true;
        this.form.name = '';
        this.form.sets = 0;
        this.form.reps = 0;
        this.form.weight = 0;
      } else if (this.exercisePresets[this.form.name]) {
        const preset = this.exercisePresets[this.form.name];
        this.form.sets = preset.sets;
        this.form.reps = preset.reps;
        this.form.weight = preset.weight;
      }
    },

    async saveCustomExercise() {
      const name = this.newExerciseName.trim();
      const units = this.newExerciseUnits.trim();
      const nameInput = this.$refs.customNameInput;

      if (!name || !units) {
        nameInput.setCustomValidity('Please provide both a name and units.');
        nameInput.reportValidity();
        return;
      }

      const searchName = name.toLowerCase();
      const isDuplicate =
        this.defaultExercises.some(ex => ex.toLowerCase() === searchName) ||
        this.customExercises.some(ex => ex.toLowerCase() === searchName);

      if (isDuplicate) {
        nameInput.setCustomValidity(`An exercise named "${name}" already exists.`);
        nameInput.reportValidity();
        return;
      }

      // 1. Save to custom exercise types list
      this.customExercises.push(name);
      try {
        await fetch('/api/custom-exercise-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.customExercises)
        });
      } catch (error) {
        console.error('Error: Could not add custom exercise type.', error);
      }

      // 2. Create a PB entry with null value (so it shows "No record set yet")
      try {
        await fetch('/api/pb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            units: units,
            value: null,
            isCustom: true
          })
        });
      } catch (error) {
        console.error('Error creating initial PB entry:', error);
      }

      this.form.name = name;
      this.isAddingCustom = false;
      this.newExerciseName = '';
      this.newExerciseUnits = '';
      this.form.sets = 0;
      this.form.reps = 0;
      this.form.weight = 0;

      // 3. Notify PersonalBests component to refresh
      window.dispatchEvent(new CustomEvent('exercise-list-changed'));
    },

    clearError() {
      if (this.$refs.customNameInput) {
        this.$refs.customNameInput.setCustomValidity('');
      }
    },

    cancelCustomExercise() {
      this.isAddingCustom = false;
      this.newExerciseName = '';
      this.newExerciseUnits = '';
      this.form.name = '';
    },

    async deleteCustomExercise() {
      let deleteName = this.form.name;

      // 1. Delete from custom exercise types list
      try {
        await fetch(`/api/custom-exercise-types/${deleteName}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error: Failed to delete custom exercise type.', error);
      }

      // 2. Delete the PB entry for this exercise
      try {
        await fetch(`/api/pb/${deleteName}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting PB entry:', error);
      }

      this.customExercises = this.customExercises.filter(ex => ex !== deleteName);
      this.form.name = '';

      // 3. Notify PersonalBests component to refresh
      window.dispatchEvent(new CustomEvent('exercise-list-changed'));
    },

    async submitForm() {
      const exerciseData = { ...this.form };
      this.$emit('add-exercise', exerciseData);

      if (exerciseData.weight > 0 && exerciseData.name) {
        await this.checkAndUpdatePb(exerciseData.name, exerciseData.weight);
      }

      this.resetForm();
    },

    async checkAndUpdatePb(exerciseName, weight) {
      try {
        const response = await fetch(`/api/pb/${encodeURIComponent(exerciseName)}`);

        let pbData = null;

        if (response.ok) {
          pbData = await response.json();
        }

        // Determine the correct units: use whatever is stored, or fall back to 'lbs'
        const units = (pbData && pbData.units) ? pbData.units : 'lbs';
        const isCustom = (pbData && pbData.isCustom) ? pbData.isCustom : this.customExercises.includes(exerciseName);

        if (!pbData || pbData.value === undefined || pbData.value === null) {
          // No PB set yet — use the logged weight as the first PB
          await fetch('/api/pb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: exerciseName,
              units: units,
              value: weight,
              isCustom: isCustom
            })
          });

          this.showPbToast(exerciseName, weight);
          // Notify PersonalBests that PB changed
          window.dispatchEvent(new CustomEvent('exercise-list-changed'));
          return;
        }

        // Existing PB → compare
        if (weight > pbData.value) {
          await fetch('/api/pb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: exerciseName,
              units: units,
              value: weight,
              isCustom: isCustom
            })
          });

          this.showPbToast(exerciseName, weight);
          window.dispatchEvent(new CustomEvent('exercise-list-changed'));
        }

      } catch (error) {
        console.error('Error checking/updating PB:', error);
      }
    },

    showPbToast(name, weight) {
      if (this.pbToastTimer) clearTimeout(this.pbToastTimer);
      this.pbToast = { name, weight };
      this.pbToastTimer = setTimeout(() => {
        this.pbToast = null;
        this.pbToastTimer = null;
      }, 3500);
    },

    resetForm() {
      this.form = {
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
        date: this.date || new Date().toLocaleDateString('en-CA')
      };
    },

    async fetchCustomExerciseTypes() {
      try {
        const response = await fetch('/api/custom-exercise-types');
        this.customExercises = await response.json();
      } catch (error) {
        console.error('Error: Failed to fetch custom exercise types.', error);
      }
    }
  }
}
</script>

<style scoped>
/* (original styles unchanged – keep as in the original) */
.exercise-form {
  margin: 15px;
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
  background-color: var(--bg);
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
.exercise-link-box {
  background-color: rgba(255, 255, 255, 0.03);
  border-left: 3px solid var(--green-1);
  padding: 10px 15px;
  margin: 10px 0 20px 0;
  border-radius: 0 4px 4px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.info-link {
  color: var(--green-1);
  text-decoration: none;
  font-weight: bold;
  font-size: 0.95em;
}
.pb-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--green-1);
  color: #fff;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 6px;
}
</style>