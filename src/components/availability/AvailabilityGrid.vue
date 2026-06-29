<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookings } from '../../composables/useBookings.js'

const router = useRouter()
const { allBookings } = useBookings()

const openingHours = ['09:00', '10:00', '11:00', '12:00', '13:00',
                     '14:00', '15:00', '16:00', '17:00']

const getMondayOf = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const weekStart = ref(getMondayOf(new Date()))

const weekDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    days.push({
      date: d,
      iso: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }),
      isSunday: d.getDay() === 0
    })
  }
  return days
})

const bookingsByCellAndCat = computed(() => {
  const map = {}
  for (const booking of allBookings.value) {
    if (booking.status === 'cancelled') continue
    const key = `${booking.date}_${booking.time}`
    if (!map[key]) map[key] = []
    map[key].push(booking.booking_type === 'cat-session'
      ? (booking.cat_name || 'Cat session')
      : 'Table')
  }
  return map
})

// Returns: 'available' | 'booked' | 'closed'
const getCellState = (dayIso, time, isSunday) => {
  // Sundays after 14:00 are closed
  if (isSunday && time >= '14:00') return 'closed'
  const key = `${dayIso}_${time}`
  const booked = bookingsByCellAndCat.value[key] || []
  return booked.length === 0 ? 'available' : 'booked'
}

const getBookedLabels = (dayIso, time) => {
  const key = `${dayIso}_${time}`
  return bookingsByCellAndCat.value[key] || []
}

const goToPrevWeek = () => {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() - 7)
  weekStart.value = d
}

const goToNextWeek = () => {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + 7)
  weekStart.value = d
}

const goToThisWeek = () => {
  weekStart.value = getMondayOf(new Date())
}

const handleCellClick = (dayIso, time, state) => {
  if (state !== 'available') return
  router.push({ path: '/visit/book', query: { date: dayIso, time, type: 'cat-session' } })
}

const weekRangeLabel = computed(() => {
  const start = weekDays.value[0].date
  const end = weekDays.value[6].date
  const fmt = (d) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  return `${fmt(start)} – ${fmt(end)}`
})

const isToday = (dayIso) => dayIso === new Date().toISOString().split('T')[0]
</script>

<template>
  <div class="ag-wrap">
    <!-- Header bar -->
    <div class="ag-header">
      <div class="ag-nav">
        <button class="ag-btn" @click="goToPrevWeek">
          <span>&#8592;</span> Prev
        </button>
        <button class="ag-btn ag-btn--today" @click="goToThisWeek">This Week</button>
        <button class="ag-btn" @click="goToNextWeek">
          Next <span>&#8594;</span>
        </button>
      </div>
      <div class="ag-range">{{ weekRangeLabel }}</div>
    </div>

    <!-- Legend -->
    <div class="ag-legend">
      <span class="ag-legend-item">
        <span class="ag-pip ag-pip--available"></span> Available
      </span>
      <span class="ag-legend-item">
        <span class="ag-pip ag-pip--booked"></span> Booked
      </span>
      <span class="ag-legend-item">
        <span class="ag-pip ag-pip--closed"></span> Closed
      </span>
    </div>

    <!-- Grid -->
    <div class="ag-grid-wrap">
      <div class="ag-grid">
        <!-- Time column header -->
        <div class="ag-cell ag-cell--header ag-cell--time-head"></div>

        <!-- Day headers -->
        <div
          v-for="day in weekDays"
          :key="day.iso"
          class="ag-cell ag-cell--header"
          :class="{ 'ag-cell--today-head': isToday(day.iso), 'ag-cell--sunday-head': day.isSunday }"
        >
          <span class="ag-day-label">{{ day.label.split(' ')[0] }}</span>
          <span class="ag-day-date">{{ day.label.split(' ').slice(1).join(' ') }}</span>
        </div>

        <!-- Time rows -->
        <template v-for="time in openingHours" :key="time">
          <!-- Time label -->
          <div class="ag-cell ag-cell--time">{{ time }}</div>

          <!-- Slot cells -->
          <div
            v-for="day in weekDays"
            :key="day.iso + time"
            class="ag-cell ag-cell--slot"
            :class="{
              'ag-cell--available': getCellState(day.iso, time, day.isSunday) === 'available',
              'ag-cell--booked':    getCellState(day.iso, time, day.isSunday) === 'booked',
              'ag-cell--closed':    getCellState(day.iso, time, day.isSunday) === 'closed',
              'ag-cell--today-col': isToday(day.iso)
            }"
            :role="getCellState(day.iso, time, day.isSunday) === 'available' ? 'button' : null"
            :tabindex="getCellState(day.iso, time, day.isSunday) === 'available' ? 0 : null"
            @click="handleCellClick(day.iso, time, getCellState(day.iso, time, day.isSunday))"
            @keyup.enter="handleCellClick(day.iso, time, getCellState(day.iso, time, day.isSunday))"
          >
            <template v-if="getCellState(day.iso, time, day.isSunday) === 'available'">
              <span class="ag-slot-icon">🐾</span>
              <span class="ag-slot-text">Available</span>
            </template>
            <template v-else-if="getCellState(day.iso, time, day.isSunday) === 'closed'">
              <span class="ag-slot-icon">🌙</span>
              <span class="ag-slot-text">Closed</span>
            </template>
            <template v-else>
              <span class="ag-slot-icon">🐱</span>
              <span class="ag-slot-text">Booked</span>
              <span
                v-for="(label, i) in getBookedLabels(day.iso, time)"
                :key="label + i"
                class="ag-pill"
              >{{ label }}</span>
            </template>
          </div>
        </template>
      </div>
    </div>

    <p class="ag-hint">Click any <strong>Available</strong> slot to book a cat session.</p>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Root tokens ── */
.ag-wrap {
  --cream:     #fdf6f0;
  --rose:      #c4687a;
  --rose-dark: #9e4f5f;
  --rose-pale: #f5dde2;
  --brown:     #3e2022;
  --muted:     #9c7b7e;
  --closed-bg: #ede8e8;
  --closed-fg: #b0a0a2;
  --booked-bg: #3e2022;
  --booked-fg: #f5dde2;
  --avail-bg:  #ffffff;
  --avail-hover: #fef0f3;
  --today-accent: #c4687a;
  --shadow: 0 2px 16px rgba(62,32,34,0.08);

  font-family: 'DM Sans', sans-serif;
  color: var(--brown);
  background: var(--cream);
  border-radius: 20px;
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  box-shadow: var(--shadow);
}

/* ── Header ── */
.ag-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ag-nav {
  display: flex;
  gap: 0.5rem;
}

.ag-btn {
  background: #fff;
  color: var(--brown);
  border: 1.5px solid var(--rose-pale);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.ag-btn:hover {
  background: var(--rose-pale);
  border-color: var(--rose);
}

.ag-btn--today {
  background: var(--rose);
  color: #fff;
  border-color: var(--rose);
}

.ag-btn--today:hover {
  background: var(--rose-dark);
  border-color: var(--rose-dark);
}

.ag-range {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--brown);
  letter-spacing: 0.01em;
}

/* ── Legend ── */
.ag-legend {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  font-size: 0.82rem;
  color: var(--muted);
  font-weight: 500;
}

.ag-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.ag-pip {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ag-pip--available { background: var(--rose); }
.ag-pip--booked    { background: var(--booked-bg); }
.ag-pip--closed    { background: var(--closed-bg); border: 1.5px solid var(--closed-fg); }

/* ── Grid ── */
.ag-grid-wrap {
  overflow-x: auto;
  border-radius: 14px;
}

.ag-grid {
  display: grid;
  grid-template-columns: 64px repeat(7, 1fr);
  gap: 4px;
  min-width: 680px;
}

/* ── Cells — base ── */
.ag-cell {
  border-radius: 10px;
  padding: 0.5rem 0.3rem;
  min-height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.12s ease, background 0.15s ease, box-shadow 0.15s ease;
  position: relative;
  overflow: hidden;
}

/* ── Header cells ── */
.ag-cell--header {
  min-height: 52px;
  background: var(--rose-pale);
  border-radius: 10px;
  padding: 0.6rem 0.3rem;
}

.ag-cell--time-head {
  background: transparent;
}

.ag-cell--today-head {
  background: var(--rose);
}

.ag-cell--today-head .ag-day-label,
.ag-cell--today-head .ag-day-date {
  color: #fff;
}

.ag-cell--sunday-head {
  background: var(--closed-bg);
}

.ag-cell--sunday-head .ag-day-label,
.ag-cell--sunday-head .ag-day-date {
  color: var(--closed-fg);
}

.ag-day-label {
  display: block;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--rose-dark);
}

.ag-day-date {
  display: block;
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 0.1rem;
}

/* ── Time label cells ── */
.ag-cell--time {
  min-height: 64px;
  background: transparent;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.03em;
}

/* ── Slot states ── */
.ag-cell--available {
  background: var(--avail-bg);
  border: 1.5px dashed #e8c9ce;
  cursor: pointer;
}

.ag-cell--available:hover {
  background: var(--avail-hover);
  border-color: var(--rose);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(196, 104, 122, 0.15);
}

.ag-cell--available:focus-visible {
  outline: 2.5px solid var(--rose);
  outline-offset: 2px;
}

.ag-cell--booked {
  background: var(--booked-bg);
  cursor: not-allowed;
}

.ag-cell--closed {
  background: var(--closed-bg);
  cursor: not-allowed;
}

/* Today column tint on slots */
.ag-cell--today-col.ag-cell--available {
  background: #fff8f9;
  border-color: #e8a6b2;
}

/* ── Slot content ── */
.ag-slot-icon {
  font-size: 1.1rem;
  line-height: 1;
  margin-bottom: 0.2rem;
}

.ag-slot-text {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ag-cell--available .ag-slot-text  { color: var(--muted); }
.ag-cell--booked .ag-slot-text     { color: var(--rose-pale); }
.ag-cell--closed .ag-slot-text     { color: var(--closed-fg); }

/* ── Pills ── */
.ag-pill {
  display: inline-block;
  background: var(--rose);
  color: #fff;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-size: 0.65rem;
  margin: 0.15rem 0.1rem 0;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* ── Hint ── */
.ag-hint {
  text-align: center;
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 1.25rem;
  margin-bottom: 0;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .ag-wrap { padding: 1rem; border-radius: 14px; }
  .ag-cell { min-height: 52px; padding: 0.35rem 0.15rem; }
  .ag-cell--header { min-height: 44px; }
  .ag-slot-icon { font-size: 0.9rem; }
  .ag-slot-text { font-size: 0.62rem; }
  .ag-range { font-size: 1rem; }
  .ag-grid { min-width: 520px; gap: 3px; }
}
</style>