<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="cat"
        class="modal-backdrop"
        role="presentation"
        @click.self="emit('close')"
      >
        <div
          ref="dialogRef"
          class="modal-dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
        >
          <button
            ref="closeBtnRef"
            type="button"
            class="modal-close"
            aria-label="Close cat details"
            @click="emit('close')"
          >
            ×
          </button>

          <div ref="scrollRef" class="modal-scroll">
            <img
              class="modal-image"
              :src="cat.image || placeholderImage"
              :alt="`${cat.name} the ${cat.breed}`"
            />

            <div class="modal-body">
            <p class="status">{{ cat.status }}</p>
            <h2 :id="titleId">{{ cat.name }}</h2>

            <dl class="modal-details">
              <div>
                <dt>Age</dt>
                <dd>{{ formatAgeDisplay(cat.age) }}</dd>
              </div>
              <div>
                <dt>Breed</dt>
                <dd>{{ cat.breed }}</dd>
              </div>
              <div v-if="cat.gender">
                <dt>Gender</dt>
                <dd>{{ cat.gender }}</dd>
              </div>
              <div v-else>
                <dt>Status</dt>
                <dd>{{ cat.status }}</dd>
              </div>
            </dl>

            <section v-if="cat.energyLevel || cat.affectionLevel" class="detail-section traits-row">
              <span v-if="cat.energyLevel" class="trait-chip">Energy: {{ cat.energyLevel }}</span>
              <span v-if="cat.affectionLevel" class="trait-chip">Affection: {{ cat.affectionLevel }}</span>
            </section>

            <section v-if="cat.habits?.trim()" class="detail-section">
              <h3 class="detail-heading">Habits &amp; routine</h3>
              <p class="detail-text">{{ cat.habits }}</p>
            </section>

            <section v-if="cat.feedingGuide?.trim()" class="detail-section">
              <h3 class="detail-heading">How to feed at the café</h3>
              <p class="detail-text">{{ cat.feedingGuide }}</p>
            </section>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { formatAgeDisplay } from '../../utils/catDisplay.js'

const placeholderImage =
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80'

const props = defineProps({
  cat: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const dialogRef = ref(null)
const scrollRef = ref(null)
const closeBtnRef = ref(null)
const titleId = `cat-modal-title-${Math.random().toString(36).slice(2, 9)}`

let previousActiveElement = null
let savedScrollY = 0

function lockBodyScroll(locked) {
  if (locked) {
    savedScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.overflow = ''
    window.scrollTo(0, savedScrollY)
  }
}

function focusDialog() {
  nextTick(() => {
    closeBtnRef.value?.focus()
  })
}

function restoreFocus() {
  previousActiveElement?.focus?.()
  previousActiveElement = null
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.cat,
  (value) => {
    if (value) {
      previousActiveElement = document.activeElement
      lockBodyScroll(true)
      focusDialog()
      nextTick(() => {
        if (scrollRef.value) scrollRef.value.scrollTop = 0
      })
      document.addEventListener('keydown', onDocumentKeydown)
    } else {
      document.removeEventListener('keydown', onDocumentKeydown)
      lockBodyScroll(false)
      restoreFocus()
    }
  }
)

onMounted(() => {
  if (props.cat) {
    previousActiveElement = document.activeElement
    lockBodyScroll(true)
    focusDialog()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onDocumentKeydown)
  lockBodyScroll(false)
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
    max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
  overflow: hidden;
  background: rgba(75, 44, 45, 0.65);
}

.modal-dialog {
  position: relative;
  width: min(100%, 640px);
  max-height: min(92vh, 820px);
  overflow: hidden;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 50px rgba(75, 44, 45, 0.35);
  outline: none;
}

.modal-scroll {
  max-height: min(92vh, 820px);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  border-radius: inherit;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modal-scroll::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-text);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
}

.modal-image {
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
  vertical-align: top;
}

.modal-body {
  padding: 1.25rem 2rem 2.25rem;
}

.status {
  width: fit-content;
  margin: 0 0 0.5rem;
  padding: 0.25rem 0.7rem;
  color: var(--color-primary);
  background: var(--color-bg-blush);
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 700;
}

h2 {
  margin: 0 0 1rem;
  color: var(--color-text);
}

.modal-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 0 0 1rem;
}

.modal-details > div {
  padding: 0.75rem;
  background: var(--color-bg-soft);
  border-radius: 1rem;
}

dt {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

dd {
  margin: 0.2rem 0 0;
  font-weight: 700;
}

.detail-section {
  margin-bottom: 1.15rem;
}

.detail-heading {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.02em;
}

.detail-text {
  margin: 0;
  line-height: 1.65;
  color: var(--color-text);
}

.traits-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.trait-chip {
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-pill);
  background: var(--color-bg-soft);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 520px) {
  .modal-details {
    grid-template-columns: 1fr;
  }
}
</style>
