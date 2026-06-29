

<template>
  <div class="a11y-widget" :class="{ expanded: isOpen }">

    <!-- The round 🔊 button that opens/closes the panel -->
    <button class="a11y-toggle" @click="toggleOpen" :aria-label="isOpen ? 'Close accessibility panel' : 'Open text to speech'">
      🔊
    </button>

    <!-- The panel — only visible when isOpen is true -->
    <div v-if="isOpen" class="a11y-panel">

      <!-- Panel title and close button -->
      <div class="a11y-header">
        <span class="a11y-title">Text to Speech</span>
        <button class="a11y-close" @click="toggleOpen" aria-label="Close">✕</button>
      </div>

      <!-- Shows the current state: Ready / Loading / Playing / Paused / Error -->
      <div class="a11y-status" :class="status">
        <span class="status-dot"></span>
        <span class="status-label">{{ statusLabel }}</span>
      </div>

      <!-- Error message shown if the API call fails -->
      <p v-if="status === 'error'" class="a11y-error">{{ errorMsg }}</p>

      <!-- Play / Pause / Resume / Stop buttons -->
      <!-- Only the relevant buttons show depending on the current status -->
      <div class="a11y-controls">

        <!-- Read Page — shown when idle or after an error -->
        <button
          v-if="status === 'idle' || status === 'error'"
          class="ctrl-btn primary"
          @click="handlePlay"
          :disabled="status === 'loading'"
          aria-label="Read page aloud"
        >
          ▶ Read Page
        </button>

        <!-- Loading spinner — shown while waiting for ElevenLabs to respond -->
        <button v-if="status === 'loading'" class="ctrl-btn primary" disabled>
          <span class="spinner"></span> Loading…
        </button>

        <!-- Pause — shown while audio is playing -->
        <button
          v-if="status === 'playing'"
          class="ctrl-btn primary"
          @click="handlePause"
          aria-label="Pause"
        >
          ⏸ Pause
        </button>

        <!-- Resume — shown while audio is paused -->
        <button
          v-if="status === 'paused'"
          class="ctrl-btn primary"
          @click="handleResume"
          aria-label="Resume"
        >
          ▶ Resume
        </button>

        <!-- Stop — shown while playing or paused -->
        <button
          v-if="status === 'playing' || status === 'paused'"
          class="ctrl-btn secondary"
          @click="handleStop"
          aria-label="Stop"
        >
          ⏹ Stop
        </button>
      </div>

      <!-- Speed selector — changes how fast the audio plays -->
      <div class="a11y-speed">
        <span class="speed-label">Speed</span>
        <div class="speed-options">
          <button
            v-for="s in speeds"
            :key="s"
            class="speed-btn"
            :class="{ active: speed === s }"
            @click="setSpeed(s)"
          >
            {{ s }}x
          </button>
        </div>
      </div>

      <p class="a11y-note">Powered by ElevenLabs</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { textToSpeech, getPageText } from '../../services/accessibility.js'

// Controls whether the panel is open or closed
const isOpen  = ref(false)

// Tracks what the widget is currently doing
// Possible values: idle | loading | playing | paused | error
const status  = ref('idle')

const errorMsg = ref('')

// Current playback speed (default 1x)
const speed   = ref(1)
const speeds  = [0.75, 1, 1.25, 1.5]

// The HTML Audio element that plays the speech
let audio    = null
// The temporary URL for the audio blob returned by ElevenLabs
let audioUrl = null

// Converts the status value into a readable label for the UI
const statusLabel = computed(() => ({
  idle:    'Ready',
  loading: 'Fetching audio…',
  playing: 'Playing',
  paused:  'Paused',
  error:   'Error',
}[status.value]))

// Opens or closes the panel
function toggleOpen() {
  isOpen.value = !isOpen.value
}

// Called when the user clicks "Read Page"
// Grabs page text → sends to ElevenLabs → plays the audio
async function handlePlay() {
  status.value  = 'loading'
  errorMsg.value = ''

  try {
    const text = getPageText()
    audioUrl = await textToSpeech(text)

    audio = new Audio(audioUrl)
    audio.playbackRate = speed.value

    audio.addEventListener('ended', () => { status.value = 'idle' })
    audio.addEventListener('error', () => {
      status.value  = 'error'
      errorMsg.value = 'Audio playback failed.'
    })

    await audio.play()
    status.value = 'playing'
  } catch (err) {
    status.value  = 'error'
    errorMsg.value = err.message || 'Something went wrong.'
  }
}

// Pauses the audio
function handlePause() {
  if (audio) {
    audio.pause()
    status.value = 'paused'
  }
}

// Resumes paused audio
function handleResume() {
  if (audio) {
    audio.play()
    status.value = 'playing'
  }
}

// Stops audio completely and cleans up memory
function handleStop() {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
    audio = null
  }
  if (audioUrl) {
    URL.revokeObjectURL(audioUrl)
    audioUrl = null
  }
  status.value = 'idle'
}

// Changes playback speed — also updates the audio if it is already playing
function setSpeed(s) {
  speed.value = s
  if (audio) audio.playbackRate = s
}

// Stop audio if the user navigates away from the page
onUnmounted(() => handleStop())
</script>

<style scoped>
/* The widget sits fixed in the bottom-left corner on all pages */
.a11y-widget {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

/* ── Toggle button ── */
.a11y-toggle {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(182, 92, 104, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.a11y-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 18px rgba(182, 92, 104, 0.45);
}

/* ── Panel ── */
.a11y-panel {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 1.2rem;
  width: 240px;
  order: -1;
  border: 1px solid var(--color-border);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.a11y-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.a11y-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-text);
}

.a11y-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-border);
  padding: 0.2rem;
  line-height: 1;
}

/* ── Status dot — changes colour based on current state ── */
.a11y-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.82rem;
  color: var(--color-text);
  opacity: 0.7;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  flex-shrink: 0;
}

.a11y-status.playing .status-dot { background: #4CAF50; animation: pulse 1.2s ease infinite; }
.a11y-status.loading .status-dot { background: var(--color-caramel); animation: pulse 0.8s ease infinite; }
.a11y-status.paused  .status-dot { background: var(--color-soft-pink); }
.a11y-status.error   .status-dot { background: #e53935; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.a11y-error {
  font-size: 0.78rem;
  color: #e53935;
  margin: 0 0 0.75rem;
  line-height: 1.4;
}

/* ── Controls ── */
.a11y-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.ctrl-btn {
  flex: 1;
  padding: 0.55rem 0.5rem;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.ctrl-btn.primary {
  background: var(--color-primary);
  color: white;
}

.ctrl-btn.primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.ctrl-btn.secondary {
  background: var(--color-cream);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.ctrl-btn.secondary:hover {
  background: var(--color-bg-blush);
}

.ctrl-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Speed buttons ── */
.a11y-speed {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.speed-label {
  font-size: 0.78rem;
  color: var(--color-text);
  opacity: 0.6;
  flex-shrink: 0;
}

.speed-options {
  display: flex;
  gap: 0.25rem;
}

.speed-btn {
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.15s ease;
}

.speed-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* ── Loading spinner animation ── */
.spinner {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 0.25rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.a11y-note {
  font-size: 0.7rem;
  color: var(--color-border);
  margin: 0;
  text-align: center;
}
</style>
