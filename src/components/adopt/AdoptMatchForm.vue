<template>
  <div class="match-form-card">
    <h2 class="display-heading">Find Your Cat Match</h2>

    <div class="form-grid">
      <label>
        Energy level
        <select v-model="localAnswers.energy">
          <option value="calm">Calm</option>
          <option value="playful">Playful</option>
        </select>
      </label>

      <label>
        Life stage
        <select v-model="localAnswers.lifeStage">
          <option value="kitten">Kitten</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
      </label>

      <label>
        Affection style
        <select v-model="localAnswers.affection">
          <option value="cuddly">Cuddly</option>
          <option value="independent">Independent</option>
          <option value="social">Social</option>
        </select>
      </label>

      <label>
        Home environment
        <select v-model="localAnswers.home">
          <option value="quiet">Quiet</option>
          <option value="busy">Busy</option>
        </select>
      </label>

      <label>
        Cat experience
        <select v-model="localAnswers.experience">
          <option value="beginner">Beginner</option>
          <option value="experienced">Experienced</option>
        </select>
      </label>
    </div>

    <button class="match-button" @click="$emit('submit-match', localAnswers)">
      Get My Match
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const localAnswers = reactive({
  energy: 'calm',
  lifeStage: 'adult',
  affection: 'cuddly',
  home: 'quiet',
  experience: 'beginner'
})

defineEmits(['submit-match'])
</script>

<style scoped>
.match-form-card {
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: var(--shadow-soft);
}

.match-form-card h2 {
  margin-top: 0;
  font-size: 2.5rem;
}

.form-grid {
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0;
}

label {
  display: grid;
  gap: 0.4rem;
  font-weight: 700;
}

select {
  border: 1px solid rgba(75, 44, 45, 0.15);
  border-radius: 1rem;
  padding: 0.8rem 1rem;
  background: var(--color-bg-light);
  color: var(--color-text);
}

.match-button {
  border: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  padding: 1rem 1.4rem;
  font-weight: 700;
  cursor: pointer;
}
</style>