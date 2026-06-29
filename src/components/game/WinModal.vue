<script setup>
import { ref, computed } from 'vue'

// Shown when the player matches all pairs. Player enters their name
// and the parent submits it to the leaderboard. Visually consistent
// with BookingConfirmation.vue so the app feels unified.

const props = defineProps({
  visible: {                // controls whether modal is rendered
    type: Boolean,
    required: true
  },
  moves: { type: Number, required: true },
  seconds: { type: Number, required: true },
  difficulty: { type: String, required: true },
  rank: {                   // 1-5 if made the leaderboard, null otherwise
    type: Number,
    default: null
  }
})

const emit = defineEmits(['submit', 'close'])

const name = ref('')
const submitted = ref(false)

// Format seconds as M:SS for display.
const formattedTime = computed(() => {
  const m = Math.floor(props.seconds / 60)
  const s = props.seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

const difficultyLabel = computed(() => ({
  easy: 'Easy (4×3)',
  medium: 'Medium (4×4)',
  hard: 'Hard (4×5)'
}[props.difficulty] || props.difficulty))

const handleSubmit = () => {
  if (!name.value.trim()) return
  emit('submit', name.value.trim())
  submitted.value = true
}

const handleClose = () => {
  name.value = ''
  submitted.value = false
  emit('close')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="modal-backdrop-custom" @click.self="handleClose">
      <div
        class="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-title"
      >
        <div class="text-center mb-3">
          <span class="display-1" aria-hidden="true">🏆</span>
        </div>

        <h2 id="win-title" class="win-title text-center mb-3">
          You won!
        </h2>

        <dl class="game-summary">
          <dt>Difficulty</dt>
          <dd>{{ difficultyLabel }}</dd>

          <dt>Moves</dt>
          <dd>{{ moves }}</dd>

          <dt>Time</dt>
          <dd>{{ formattedTime }}</dd>

          <dt v-if="rank">Leaderboard rank</dt>
          <dd v-if="rank" class="rank-badge">#{{ rank }}</dd>
        </dl>

        <!-- Name entry — only shown until score is submitted -->
        <div v-if="!submitted" class="mt-3">
          <label for="player-name" class="form-label">
            Save your score
          </label>
          <div class="input-row">
            <input
              id="player-name"
              v-model="name"
              type="text"
              class="form-control"
              placeholder="Your name"
              maxlength="20"
              @keyup.enter="handleSubmit"
            >
            <button
              class="btn btn-primary-cafe"
              :disabled="!name.trim()"
              @click="handleSubmit"
            >
              Save
            </button>
          </div>
        </div>

        <div v-else class="saved-note text-center mt-3">
          ✓ Score saved to the leaderboard
        </div>

        <div class="d-grid mt-3">
          <button class="btn btn-secondary-cafe" @click="handleClose">
            {{ submitted ? 'Play again' : 'Skip & play again' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(75, 44, 45, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1050;
}

.modal-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(75, 44, 45, 0.25);
  border-top: 4px solid #B65C68;
}

.win-title {
  color: #4B2C2D;
  font-weight: 600;
}

.game-summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  margin: 0;
  padding: 1rem;
  background: #fdf2f3;
  border-radius: 8px;
}

.game-summary dt {
  font-weight: 600;
  color: #4B2C2D;
}

.game-summary dd {
  margin: 0;
  color: #4B2C2D;
}

.rank-badge {
  font-weight: 700;
  color: #B65C68;
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-row .form-control {
  flex: 1;
  border: 1px solid #d8c5c7;
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
}

.input-row .form-control:focus {
  border-color: #B65C68;
  box-shadow: 0 0 0 3px rgba(182, 92, 104, 0.18);
  outline: none;
}

.form-label {
  color: #4B2C2D;
  font-weight: 500;
  margin-bottom: 0.35rem;
  display: block;
}

.saved-note {
  color: #2e7d32;
  font-weight: 500;
}

.btn-primary-cafe {
  background: #B65C68;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.btn-primary-cafe:hover:not(:disabled) {
  background: #a04e59;
}

.btn-primary-cafe:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary-cafe {
  background: #fff;
  color: #4B2C2D;
  border: 1px solid #d8c5c7;
  font-weight: 500;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
}

.btn-secondary-cafe:hover {
  background: #fdf2f3;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-card,
.fade-leave-active .modal-card {
  transition: transform 0.25s ease;
}

.fade-enter-from .modal-card,
.fade-leave-to .modal-card {
  transform: translateY(20px) scale(0.97);
}
</style>