<template>
  <div class="instructions-page main-container">
    <header class="page-header">
      <h1>Exercise Library</h1>
    </header>

    <div class="exercise-list" v-if="Object.keys(exercises).length > 0">
      <section 
        v-for="(data, name) in exercises" 
        :key="name" 
        :id="formatId(name)" 
        class="exercise-section"
      >
        <h2>{{ name }}</h2>
        <div class="content-wrapper">
          <div class="text-content">
            <p>{{ data.instructions }}</p>
          </div>
          <div class="media-placeholder">
            <img 
            v-if="data.image" 
            :src="data.image" 
            :alt="name + ' instructions'"
            class="exercise-graphic"
            >
            <span v-else>Graphic Coming Soon</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExerciseInstructions',
  data() {
    return {
exercises: {
        "Bench Press": { 
          instructions: "Lay flat and grab the bar just outside shoulder width. Lower it slowly to your mid-chest, then drive it back up toward the ceiling. Keep your feet planted for balance.",
          image: "/images/Bench_Press.png"
        },
        "Bicep Curls": {
          instructions: "Stand tall with your dumbbells. Pin your elbows to your sides and curl the weights up toward your shoulders. Squeeze at the top and resist the weight on the way back down.",
          image: "/images/Bicep_Curls.png"
        },
        "Cycling": {
          instructions: "Set your seat so there's just a tiny bend in your knee at the bottom of the pedal stroke. Find a rhythm that feels steady and keep your upper body relaxed while you ride.",
          image: "/images/cycling.png"
        },
        "Deadlift": { 
          instructions: "Set your feet hip-width apart with the bar over your shoelaces. Hinge at your hips to grab the bar, keep your back flat, and stand up strong. Keep the bar close to your shins.",
          image: "/images/Deadlift.png"
        },
        "Plank": { 
          instructions: "Get down on your forearms and toes. Keep your body in a straight line—don't let your hips sag or your butt poke up. Tighten your core like someone's about to poke you in the stomach.",
          image: "/images/Plank.png"
        },
        "Pull-ups": { 
          instructions: "Grab the bar with your palms facing away. Pull your chest up toward the bar by driving your elbows down toward your ribs. Try to get your chin over the bar, then lower yourself slowly.",
          image: "/images/Pull_Up.png"
        },
        "Push-ups": { 
          instructions: "Keep your hands a bit wider than your shoulders. Lower yourself until your chest almost touches the floor, then push back up. Keep your whole body moving as one solid piece.",
          image: "/images/Push_Ups.png"
        },
        "Running": {
          instructions: "Lean forward just a tiny bit and land softly on the middle of your foot. Keep your shoulders down and relaxed, and try to find a steady breathing pattern that matches your stride.",
          image: "/images/Running.png"
        },
        "Shoulder Press": {
          instructions: "Hold the weights at shoulder height. Press them straight up until your arms are locked out above your head. Don't arch your back—keep your core tight to stay stable.",
          image: "/images/Shoulder_Press.png"
        },
        "Squats": { 
          instructions: "Feet shoulder-width apart. Sit your hips back and down like you're looking for a chair. Keep your chest up and your weight in your heels, then drive back up to standing.",
          image: "/images/Squats.png"
        },
        "Tricep Dips": {
          instructions: "Lower yourself by bending your elbows until they hit a 90-degree angle. Push yourself back up using the back of your arms. Try to stay upright to keep the focus on your triceps.",
          image: "/images/Tricep_Dips.png"
        },
        "Walking": {
          instructions: "Walk tall with your head up. Swing your arms naturally and move at a pace that gets your heart rate up slightly. Roll through your whole foot from heel to toe.",
          image: "/images/walking.png"
        }
      }
    }
  },
  methods: {

    formatId(name) {
      return name.toLowerCase().replace(/\s+/g, '-');
    }
  }
}
</script>

<style scoped>
.instructions-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 15px 0px 50px 0px;
}

.page-header {
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: var(--text-h);
  font-size: 2.5em;
  font-weight: bold;
  margin: 0;
}

.btn-back {
  padding: 10px 15px;
  background-color: var(--code-bg);
  color: var(--text);
  border: 1px solid var(--border);
  cursor: pointer;
}

.btn-back:hover {
  background-color: var(--border);
}

.exercise-section {
  background-color: var(--code-bg);
  border: 1px solid var(--border);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  scroll-margin-top: 20px; 
}

.exercise-section h2 {
  margin-top: 0;
  font-size: 2 rem; 
  color: var(--green-1);
  border-bottom: 1px solid #444;
  padding-bottom: 12px;
  margin-bottom: 20px;
  letter-spacing: 0.5px; 
  font-weight: 700;
}

.content-wrapper {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: space-between;
  min-height: 200px;
}

.text-content {
  flex: 1;
  line-height: 1.75;
  font-size: 1.25rem; 
  color: var(--text);
  text-align: left;
  display: flex;
  align-items: center;
  padding-left: 15px;
}

.text-content p {
  margin: 0; 
  line-height: 1.6;
  font-size: 1.25rem;
  color: var(--text);
  text-align: left;
}

.media-placeholder {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.exercise-graphic {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
  background-color: white;
}

.media-placeholder img,
.media-placeholder video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
</style>
