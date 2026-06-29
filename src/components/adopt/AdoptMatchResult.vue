<template>
  <div class="results-grid">
    <div
      v-for="match in matches"
      :key="match.cat.id"
      class="result-card"
    >
      <div v-if="match.cat.image_url" class="result-image">
        <img :src="match.cat.image_url" :alt="match.cat.name" />
      </div>

      <p class="result-label">Suggested Match</p>
      <h2 class="display-heading">{{ match.cat.name }}</h2>

      <p class="meta">
        {{ match.cat.age }} · {{ match.cat.gender }} · {{ match.cat.breed }}
      </p>

      <p class="personality">
        {{ match.cat.personality }}
      </p>

      <p>{{ match.reason }}</p>

      <div class="result-actions">
        <button type="button" class="browse-cats-button" @click="$emit('browse-cats', match.cat.id)">
          Browse matching cats at the café
        </button>

        <button
          v-if="bookingCatId !== match.cat.id"
          type="button"
          class="adopt-button"
          @click="generateSlots(match.cat.id)"
        >
          Book a visit with this cat
        </button>
      </div>

      <div v-if="bookingCatId === match.cat.id" class="booking-box">
        <h3>Reserve a Visit</h3>

        <div class="slot-grid">
          <button
            v-for="slot in timeSlots"
            :key="slot"
            class="slot-button"
            :class="{ selected: selectedSlot === slot }"
            @click="selectedSlot = slot"
          >
            {{ slot }}
          </button>
        </div>

        <button
          class="confirm-button"
          :disabled="!selectedSlot"
          @click="confirmBooking(match.cat.name)"
        >
          Confirm Visit
        </button>
      </div>

      <div v-if="confirmedCat === match.cat.name" class="success-box">
        Visit reserved for {{ selectedSlot }} to meet {{ match.cat.name }}.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  matches: {
    type: Array,
    default: () => []
  }
})

defineEmits(['browse-cats'])

const bookingCatId = ref(null)
const selectedSlot = ref('')
const confirmedCat = ref('')
const timeSlots = ref([])

function generateSlots(catId) {
  bookingCatId.value = catId
  selectedSlot.value = ''
  confirmedCat.value = ''

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const times = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM']

  const slots = []

  while (slots.length < 4) {
    const slot = `${days[Math.floor(Math.random() * days.length)]} at ${times[Math.floor(Math.random() * times.length)]}`

    if (!slots.includes(slot)) {
      slots.push(slot)
    }
  }

  timeSlots.value = slots
}

function confirmBooking(catName) {
  confirmedCat.value = catName
}
</script>

<style scoped>
.results-grid {
  display: grid;
  gap: 1.5rem;
}

.result-card {
  background: white;
  border-radius: 2rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
}

.result-image {
  border-radius: 1.5rem;
  overflow: hidden;
  max-height: 260px;
  margin-bottom: 1rem;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-label {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.8rem;
}

h2 {
  font-size: 2.5rem;
  margin: 0;
}

.meta {
  opacity: 0.75;
}

.personality {
  background: rgba(232, 166, 161, 0.18);
  padding: 0.8rem 1rem;
  border-radius: 999px;
  width: fit-content;
  font-weight: 700;
}

.result-actions {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.browse-cats-button {
  border: 2px solid var(--color-primary);
  border-radius: 999px;
  background: white;
  color: var(--color-primary);
  padding: 0.9rem 1.3rem;
  font-weight: 700;
  cursor: pointer;
}

.browse-cats-button:hover {
  background: var(--color-bg-blush);
}

.adopt-button,
.confirm-button,
.slot-button {
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.adopt-button,
.confirm-button {
  margin-top: 0;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  padding: 0.9rem 1.3rem;
}

.booking-box {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: var(--color-bg-light);
}

.slot-grid {
  display: grid;
  gap: 0.75rem;
}

.slot-button {
  border-radius: 1rem;
  background: white;
  color: var(--color-text);
  padding: 0.85rem 1rem;
  border: 1px solid rgba(75, 44, 45, 0.12);
  text-align: left;
}

.slot-button.selected {
  background: rgba(182, 92, 104, 0.15);
  border-color: var(--color-primary);
}

.confirm-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-box {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(168, 191, 160, 0.25);
  font-weight: 700;
}
</style>