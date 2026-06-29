<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="member"
        class="modal-backdrop"
        role="presentation"
        @click.self="emit('close')"
      >
        <div
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
            aria-label="Close team member profile"
            @click="emit('close')"
          >
            ×
          </button>

          <div ref="scrollRef" class="modal-scroll">
            <div class="modal-hero">
              <div class="modal-avatar" aria-hidden="true">{{ member.avatar }}</div>
            </div>

            <div class="modal-body">
              <p class="role-badge">{{ member.role }}</p>
              <h2 :id="titleId">{{ member.name }}</h2>
              <p class="lead">{{ member.bio }}</p>

              <section class="detail-section">
                <h3 class="detail-heading">Experience</h3>
                <p class="detail-text">{{ displayExperience }}</p>
              </section>

              <section class="detail-section">
                <h3 class="detail-heading">Background</h3>
                <p class="detail-text">{{ displayBackground }}</p>
              </section>

              <section class="detail-section">
                <h3 class="detail-heading">Education</h3>
                <p class="detail-text">{{ displayEducation }}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  member: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const scrollRef = ref(null)
const closeBtnRef = ref(null)
const titleId = `team-modal-title-${Math.random().toString(36).slice(2, 9)}`

let previousActiveElement = null
let savedScrollY = 0

const displayExperience = computed(() => {
  const text = props.member?.experience?.trim()
  if (text) return text
  return `${props.member?.name ?? 'This team member'} brings hands-on café experience to their ${props.member?.role ?? 'role'} every day.`
})

const displayBackground = computed(() => {
  const text = props.member?.background?.trim()
  if (text) return text
  return 'Background details will be added soon. Ask at the counter if you would like to know more during your visit.'
})

const displayEducation = computed(() => {
  const text = props.member?.education?.trim()
  if (text) return text
  return 'Training and certifications are kept on file at the café.'
})

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
  () => props.member,
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
  if (props.member) {
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modal-scroll::-webkit-scrollbar {
  display: none;
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

.modal-hero {
  display: flex;
  justify-content: center;
  padding: 2rem 1.5rem 1rem;
  background: linear-gradient(180deg, var(--color-bg-blush) 0%, white 100%);
}

.modal-avatar {
  display: grid;
  width: 6.5rem;
  height: 6.5rem;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-caramel), var(--color-soft-pink));
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 700;
  box-shadow: var(--shadow-soft);
}

.modal-body {
  padding: 0 2rem 2.25rem;
}

.role-badge {
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
  margin: 0 0 0.65rem;
  color: var(--color-text);
}

.lead {
  margin: 0 0 1.25rem;
  line-height: 1.6;
  color: rgba(75, 44, 45, 0.88);
}

.detail-section {
  margin-bottom: 1.1rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-heading {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary);
}

.detail-text {
  margin: 0;
  line-height: 1.65;
  color: var(--color-text);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
