<template>
  <div class="pb-page main-container">
    <header class="page-header">
      <h1>Personal Bests</h1>
      <router-link to="/" class="btn-back">Back to Calendar</router-link>
    </header>

    <div class="pb-grid">
      <section 
        v-for="exercise in exercises" 
        :key="exercise" 
        class="pb-card"
        :class="{ 'glowing': recentlyBroken === exercise }"
      >
        <h2>{{ exercise }}</h2>
        
        <div v-if="personalBests[exercise] === null" class="unset-state">
          <p>No record set yet.</p>
          <button @click="openPopup(exercise)" class="btn-primary">Set Initial PB</button>
        </div>

        <div v-else class="set-state">
          <div class="record-display">
            <div>
              <span class="label">Current PB:</span>
              <span class="weight">{{ personalBests[exercise] }} {{ exerciseUnits[exercise] }}</span>
            </div>
            <button @click="openResetModal(exercise)" class="btn-clear">Reset</button>
          </div>

          <div class="log-section">
            <input 
              type="number" 
              v-model.number="newAttempts[exercise]" 
              :placeholder="'Enter ' + exerciseUnits[exercise] + '...'"
              class="weight-input"
            >
            <button @click="checkRecord(exercise)" class="btn-log">Log</button>
          </div>
        </div>
      </section>
    </div>

    <div v-if="showPopup" class="modal-overlay" @click.self="closePopup">
      <div class="modal-content">
        <h2>Set Initial PB</h2>
        <p class="modal-subtitle">{{ currentPopupExercise }}</p>
        
        <input 
          type="number" 
          v-model.number="popupInput" 
          :placeholder="'Record (' + exerciseUnits[currentPopupExercise] + ')'"
          class="weight-input modal-input"
        >
        
        <div class="modal-actions">
          <button @click="closePopup" class="btn-back">Cancel</button>
          <button @click="saveInitialPb" class="btn-primary">Save PB</button>
        </div>
      </div>
    </div>

    <div v-if="showResetModal" class="modal-overlay" @click.self="closeResetModal">
      <div class="modal-content">
        <h2>Reset Record?</h2>
        <p class="modal-subtitle alert-text">Are you sure you want to clear your {{ exerciseToReset }} PB? This cannot be undone.</p>
        
        <div class="modal-actions">
          <button @click="closeResetModal" class="btn-back">Cancel</button>
          <button @click="confirmReset" class="btn-danger">Yes, Reset</button>
        </div>
      </div>
    </div>

    <div v-if="showAlertModal" class="modal-overlay" @click.self="closeAlertModal">
      <div class="modal-content alert-modal">
        <h2>Keep Going!</h2>
        <p class="modal-subtitle alert-text">{{ alertMessage }}</p>
        
        <div class="modal-actions center-actions">
          <button @click="closeAlertModal" class="btn-primary">Got It</button>
        </div>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay" @click.self="closeSuccessModal">
      <div class="modal-content success-modal">
        <h2>🎉 New Record! 🎉</h2>
        <p class="modal-subtitle alert-text">{{ successMessage }}</p>
        
        <div class="modal-actions center-actions">
          <button @click="closeSuccessModal" class="btn-primary">Awesome</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PersonalBests',
  data() {
    return {
      exercises: [
        "Bench Press",
        "Bicep Curls",
        "Cycling",
        "Deadlift",
        "Plank",
        "Pull-ups",
        "Push-ups",
        "Running",
        "Shoulder Press",
        "Squats",
        "Tricep Dips",
        "Walking"
      ],
      exerciseUnits: {
        "Bench Press": "lbs",
        "Bicep Curls": "lbs",
        "Cycling": "km",
        "Deadlift": "lbs",
        "Plank": "secs",
        "Pull-ups": "reps",
        "Push-ups": "reps",
        "Running": "km",
        "Shoulder Press": "lbs",
        "Squats": "lbs",
        "Tricep Dips": "reps",
        "Walking": "km"
      },
      personalBests: {
        "Bench Press": null,
        "Bicep Curls": null,
        "Cycling": null,
        "Deadlift": null,
        "Plank": null,
        "Pull-ups": null,
        "Push-ups": null,
        "Running": null,
        "Shoulder Press": null,
        "Squats": null,
        "Tricep Dips": null,
        "Walking": null
      },
      newAttempts: {},
      recentlyBroken: null,
      
      showPopup: false,
      currentPopupExercise: null,
      popupInput: null,

      showResetModal: false,
      exerciseToReset: null,

      showAlertModal: false,
      alertMessage: "",

      showSuccessModal: false,
      successMessage: "",

      positiveComments: [
        "Outstanding work!",
        "You're a beast!",
        "Incredible progress!",
        "Way to push your limits!",
        "10/10, Looking Good",
        "Absolutely crushing it!",
        "Keep it up!",
        "Phenomenal effort!",
        "Stronger every day!"
      ],
      encouragingComments: [
        "Solid effort! Your PB is still {pb}. Keep grinding!",
        "Nice work, but you're chasing {pb}. You'll get it next time!",
        "Good push! Remember, your current best to beat is {pb}.",
        "Way to put in the work! Your record remains at {pb}.",
        "Almost there! Your PB stands at {pb}. Keep pushing!",
        "Your PB is {pb}. You should train yourself now!"
      ]
    }
  },
  methods: {
    openPopup(exercise) {
      this.currentPopupExercise = exercise;
      this.popupInput = null;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.currentPopupExercise = null;
      this.popupInput = null;
    },
    saveInitialPb() {
      if (this.popupInput && this.popupInput > 0) {
        this.personalBests[this.currentPopupExercise] = this.popupInput;
        this.closePopup();
      }
    },

    checkRecord(exercise) {
      const attempt = this.newAttempts[exercise];
      const currentPb = this.personalBests[exercise];

      if (!attempt || attempt <= 0) return;

      if (attempt > currentPb) {
        this.personalBests[exercise] = attempt;
        this.triggerCelebration(exercise, attempt);
      } else {
        this.triggerAlert(currentPb, exercise);
      }
      
      this.newAttempts[exercise] = null;
    },

    openResetModal(exercise) {
      this.exerciseToReset = exercise;
      this.showResetModal = true;
    },
    closeResetModal() {
      this.showResetModal = false;
      this.exerciseToReset = null;
    },
    confirmReset() {
      if (this.exerciseToReset) {
        this.personalBests[this.exerciseToReset] = null;
        this.newAttempts[this.exerciseToReset] = null;
        this.closeResetModal();
      }
    },

    triggerCelebration(exercise, newRecord) {
      this.recentlyBroken = exercise;
      
      const randomIndex = Math.floor(Math.random() * this.positiveComments.length);
      const praise = this.positiveComments[randomIndex];
      const unit = this.exerciseUnits[exercise];
      
      this.successMessage = `${praise} Your new PB for ${exercise} is ${newRecord} ${unit}!`;
      this.showSuccessModal = true;

      setTimeout(() => {
        this.recentlyBroken = null;
      }, 3500);
    },

    closeSuccessModal() {
      this.showSuccessModal = false;
      this.successMessage = "";
    },

    triggerAlert(currentPb, exercise) {
      const randomIndex = Math.floor(Math.random() * this.encouragingComments.length);
      const messageTemplate = this.encouragingComments[randomIndex];
      const unit = this.exerciseUnits[exercise];
      
      this.alertMessage = messageTemplate.replace('{pb}', `${currentPb} ${unit}`);
      this.showAlertModal = true;
    },
    
    closeAlertModal() {
      this.showAlertModal = false;
      this.alertMessage = "";
    }
  }
}
</script>

<style scoped>
.pb-page {
  max-width: 1200px;
  width: 100%; 
  box-sizing: border-box; 
  margin: 0 auto;
  padding: 20px 20px 50px 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px; 
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 20px;
}

.page-header h1 {
  color: var(--text-h);
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.btn-back {
  flex-shrink: 0; 
  padding: 10px 15px;
  background-color: var(--code-bg);
  color: var(--text);
  border: 1px solid var(--border);
  cursor: pointer;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1rem;
}

.btn-back:hover {
  background-color: var(--border);
}

.pb-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 30px;
  width: 100%;
}

@media (max-width: 900px) {
  .pb-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .pb-grid {
    grid-template-columns: 1fr;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

.pb-card {
  background-color: var(--code-bg);
  border: 1px solid var(--border);
  padding: 20px;
  border-radius: 6px;
  text-align: left;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 200px; 
}

.pb-card h2 {
  margin-top: 0;
  color: var(--green-1);
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.unset-state, .set-state {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.unset-state p {
  color: var(--text);
  margin-bottom: 15px;
}

.btn-primary {
  padding: 10px 15px;
  background-color: var(--green-1);
  color: #000;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-danger {
  padding: 10px 15px;
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.btn-danger:hover {
  opacity: 0.9;
}

.record-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: var(--text);
}

.record-display .weight {
  font-weight: bold;
  color: var(--text-h);
  margin-left: 8px;
  font-size: 1.3rem;
}

.btn-clear {
  background: none;
  border: none;
  color: var(--text);
  opacity: 0.5;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  padding: 0;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.btn-clear:hover {
  color: #ff4d4d;
  opacity: 1;
}

.log-section {
  display: flex;
  gap: 10px;
}

.weight-input {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-h);
  font-size: 1rem;
}

.btn-log {
  padding: 10px 20px;
  background-color: var(--border);
  color: var(--text-h);
  border: 1px solid #444;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-log:hover {
  background-color: #444;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background-color: var(--code-bg);
  border: 1px solid var(--border);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  width: 360px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.modal-content h2 {
  color: var(--text-h);
  margin-top: 0;
  margin-bottom: 5px;
}

.modal-subtitle {
  color: var(--green-1);
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.alert-text {
  color: var(--text);
  font-weight: normal;
  line-height: 1.4;
  margin-bottom: 30px;
}

.success-modal h2 {
  color: var(--green-1);
}

.modal-input {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.1rem;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.modal-actions .btn-back,
.modal-actions .btn-primary,
.modal-actions .btn-danger {
  flex: 1;
  width: auto;
}

.center-actions {
  justify-content: center;
}

.center-actions .btn-primary {
  flex: none;
  width: 150px;
}

.pb-card.glowing {
  border-color: var(--green-1);
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);
  transform: translateY(-2px);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
