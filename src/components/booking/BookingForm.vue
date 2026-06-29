<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookings } from '../../composables/useBookings.js'
import { useCats } from '../../composables/useCats.js'

const emit = defineEmits(['booking-confirmed'])
const { addBooking, isSlotTaken } = useBookings()
const { cats } = useCats()
const route = useRoute()

const form = reactive({
  type: 'table',
  name: '',
  email: '',
  date: '',
  time: '',
  guests: 1,
  catId: null
})

const touched = reactive({
  name: false, email: false, date: false,
  time: false, guests: false, catId: false
})

const submitAttempted = ref(false)

onMounted(() => {
  const { date, time, type } = route.query
  if (type === 'cat-session' || type === 'table') form.type = type
  if (date) form.date = date
  if (time) form.time = time
})

const availableCats = computed(() => cats.value.filter(c => c.available || c.status === 'Available'))

const openingHours = ['09:00', '10:00', '11:00', '12:00', '13:00',
                      '14:00', '15:00', '16:00', '17:00']

const selectedCatName = () => cats.value.find(c => c.id === form.catId)?.name ?? null

const todayStr = new Date().toISOString().split('T')[0]
const maxDateStr = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 60)
  return d.toISOString().split('T')[0]
})()

const errors = computed(() => {
  const e = {}

  if (!form.name.trim()) e.name = 'Name is required'
  else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) e.email = 'Email is required'
  else if (!emailPattern.test(form.email)) e.email = 'Please enter a valid email'

  if (!form.date) e.date = 'Date is required'
  else if (form.date < todayStr) e.date = 'Date cannot be in the past'
  else if (form.date > maxDateStr) e.date = 'Bookings only open 60 days ahead'

  if (!form.time) e.time = 'Time is required'

  const g = Number(form.guests)
  if (!g) e.guests = 'Guest count is required'
  else if (g < 1 || g > 8) e.guests = 'Guests must be between 1 and 8'

  if (form.type === 'cat-session') {
    if (!form.catId) e.catId = 'Please select a cat'
    else if (form.date && form.time && isSlotTaken(form.date, form.time, selectedCatName())) {
      e.catId = 'This cat is already booked at that time'
    }
  }

  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

const showError = field => (touched[field] || submitAttempted.value) && errors.value[field]

const handleSubmit = async () => {
  submitAttempted.value = true
  if (!isValid.value) return

  const booking = await addBooking({
    bookingType: form.type,
    name: form.name.trim(),
    email: form.email.trim(),
    date: form.date,
    time: form.time,
    guests: Number(form.guests),
    catName: form.type === 'cat-session' ? selectedCatName() : null
  })

  if (!booking) return

  // Re-attach display fields that BookingConfirmation reads
  booking.type  = form.type
  booking.catId = form.catId

  emit('booking-confirmed', booking)
  resetForm()
}

const resetForm = () => {
  form.type   = 'table'
  form.name   = ''
  form.email  = ''
  form.date   = ''
  form.time   = ''
  form.guests = 1
  form.catId  = null
  Object.keys(touched).forEach(k => { touched[k] = false })
  submitAttempted.value = false
}
</script>

<template>
  <form class="booking-form" novalidate @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label class="form-label fw-bold d-block mb-2">Booking Type</label>
      <div class="btn-group w-100" role="group" aria-label="Booking type">
        <input id="type-table" v-model="form.type" type="radio" class="btn-check" value="table">
        <label class="btn btn-toggle" for="type-table">🍽️ Book a Table</label>

        <input id="type-cat" v-model="form.type" type="radio" class="btn-check" value="cat-session">
        <label class="btn btn-toggle" for="type-cat">🐱 Cat Interaction Session</label>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12 col-md-6">
        <label for="name" class="form-label">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="form-control"
          :class="{ 'field-invalid': showError('name') }"
          @blur="touched.name = true"
        >
        <div v-if="showError('name')" class="field-error">{{ errors.name }}</div>
      </div>

      <div class="col-12 col-md-6">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-control"
          :class="{ 'field-invalid': showError('email') }"
          @blur="touched.email = true"
        >
        <div v-if="showError('email')" class="field-error">{{ errors.email }}</div>
      </div>

      <div class="col-12 col-md-4">
        <label for="date" class="form-label">Date</label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          class="form-control"
          :min="todayStr"
          :max="maxDateStr"
          :class="{ 'field-invalid': showError('date') }"
          @blur="touched.date = true"
        >
        <div v-if="showError('date')" class="field-error">{{ errors.date }}</div>
      </div>

      <div class="col-12 col-md-4">
        <label for="time" class="form-label">Time</label>
        <select
          id="time"
          v-model="form.time"
          class="form-select"
          :class="{ 'field-invalid': showError('time') }"
          @blur="touched.time = true"
        >
          <option value="">Select a time</option>
          <option v-for="t in openingHours" :key="t" :value="t">{{ t }}</option>
        </select>
        <div v-if="showError('time')" class="field-error">{{ errors.time }}</div>
      </div>

      <div class="col-12 col-md-4">
        <label for="guests" class="form-label">Guests</label>
        <input
          id="guests"
          v-model.number="form.guests"
          type="number"
          min="1"
          max="8"
          class="form-control"
          :class="{ 'field-invalid': showError('guests') }"
          @blur="touched.guests = true"
        >
        <div v-if="showError('guests')" class="field-error">{{ errors.guests }}</div>
      </div>

      <div v-if="form.type === 'cat-session'" class="col-12">
        <label class="form-label d-block">Preferred Cat</label>
        <div class="row g-2">
          <div v-for="cat in availableCats" :key="cat.id" class="col-6 col-md-3">
            <input
              :id="'cat-' + cat.id"
              v-model="form.catId"
              type="radio"
              class="btn-check"
              :value="cat.id"
              @change="touched.catId = true"
            >
            <label class="btn btn-cat w-100" :for="'cat-' + cat.id">{{ cat.name }}</label>
          </div>
        </div>
        <div v-if="showError('catId')" class="field-error mt-2">{{ errors.catId }}</div>
      </div>
    </div>

    <div class="d-grid mt-4">
      <button type="submit" class="btn btn-primary-cafe btn-lg">Confirm Booking</button>
    </div>
  </form>
</template>

<style scoped>
.booking-form {
  max-width: 720px;
  margin: 0 auto;
}

.booking-form .form-label {
  color: #4B2C2D;
  font-weight: 500;
  margin-bottom: 0.35rem;
}

.booking-form .form-control,
.booking-form .form-select {
  border: 1px solid #d8c5c7;
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.booking-form .form-control:focus,
.booking-form .form-select:focus {
  border-color: #B65C68;
  box-shadow: 0 0 0 3px rgba(182, 92, 104, 0.18);
  outline: none;
}

.booking-form .field-invalid {
  border-color: #c0392b;
  background-image: none;
}

.booking-form .field-invalid:focus {
  border-color: #c0392b;
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.18);
}

.booking-form .field-error {
  color: #c0392b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.booking-form .btn-toggle {
  background: #fff;
  color: #4B2C2D;
  border: 1px solid #d8c5c7;
  font-weight: 500;
  padding: 0.7rem 1rem;
}

.booking-form .btn-toggle:hover { background: #fdf2f3; }

.booking-form .btn-check:checked + .btn-toggle {
  background: #B65C68;
  color: #fff;
  border-color: #B65C68;
}

.booking-form .btn-cat {
  background: #fff;
  color: #4B2C2D;
  border: 1px solid #d8c5c7;
  padding: 0.55rem 0.5rem;
  font-weight: 500;
}

.booking-form .btn-cat:hover {
  background: #fdf2f3;
  border-color: #E8A6A1;
}

.booking-form .btn-check:checked + .btn-cat {
  background: #E8A6A1;
  color: #4B2C2D;
  border-color: #B65C68;
}

.booking-form .btn-primary-cafe {
  background: #B65C68;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  transition: background 0.15s ease, transform 0.05s ease;
}

.booking-form .btn-primary-cafe:hover  { background: #a04e59; }
.booking-form .btn-primary-cafe:active { transform: translateY(1px); }
.booking-form .btn-primary-cafe:focus  { box-shadow: 0 0 0 3px rgba(182, 92, 104, 0.3); }
</style>