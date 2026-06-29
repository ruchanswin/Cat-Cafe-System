<script setup>
import { computed } from 'vue'
import { useCats } from '../../composables/useCats.js'

const props = defineProps({
  booking: { type: Object, default: null }
})

defineEmits(['close'])

const { cats } = useCats()

const catName = computed(() => {
  if (!props.booking?.catId) return null
  return cats.value.find((c) => c.id === props.booking.catId)?.name
})
</script>

<template>
  <Transition name="fade">
    <div v-if="booking" class="modal-backdrop-custom" @click.self="$emit('close')">
      <div
        class="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
      >
        <div class="text-center mb-3">
          <span class="display-1" aria-hidden="true">🎉</span>
        </div>
        <h2 id="confirmation-title" class="confirmation-title text-center mb-3">
          Booking Confirmed!
        </h2>

        <dl class="booking-summary">
          <dt>Reference</dt>
          <dd>#{{ String(booking.id).padStart(4, '0') }}</dd>

          <dt>Type</dt>
          <dd>{{ booking.type === 'table' ? 'Table' : 'Cat Session' }}</dd>

          <dt>Name</dt>
          <dd>{{ booking.name }}</dd>

          <dt>Date &amp; Time</dt>
          <dd>{{ booking.date }} at {{ booking.time }}</dd>

          <dt>Guests</dt>
          <dd>{{ booking.guests }}</dd>

          <dt v-if="catName">Cat</dt>
          <dd v-if="catName">{{ catName }}</dd>
        </dl>

        <p class="confirmation-note text-center mt-3">
          A confirmation email has been sent to {{ booking.email }}.
        </p>

        <div class="d-grid mt-3">
          <button class="btn btn-primary-cafe" @click="$emit('close')">
            Done
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

.confirmation-title {
  color: #4B2C2D;
  font-weight: 600;
}

.booking-summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  margin: 0;
  padding: 1rem;
  background: #fdf2f3;
  border-radius: 8px;
}

.booking-summary dt {
  font-weight: 600;
  color: #4B2C2D;
}

.booking-summary dd {
  margin: 0;
  color: #4B2C2D;
}

.confirmation-note {
  color: #8a6f70;
  font-size: 0.9rem;
}

.btn-primary-cafe {
  background: #B65C68;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.btn-primary-cafe:hover {
  background: #a04e59;
}

.btn-primary-cafe:focus {
  box-shadow: 0 0 0 3px rgba(182, 92, 104, 0.3);
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