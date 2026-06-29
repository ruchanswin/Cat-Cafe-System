<script setup>
import { computed } from 'vue'

// A single memory game card. Three visual states:
//   1. face-down (dark pink with paw)
//   2. flipped (showing cat photo/emoji with highlight border)
//   3. matched (faded, locked, no longer clickable)

const props = defineProps({
  cat: { type: Object, required: true },         // { id, name, image?, emoji? }
  isFlipped: { type: Boolean, default: false },
  isMatched: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false }
})

const emit = defineEmits(['flip'])

const showCatSide = computed(() => props.isFlipped || props.isMatched)
const isClickable = computed(() => !showCatSide.value && !props.isLocked)

const handleClick = () => {
  if (!isClickable.value) return
  emit('flip')
}

const handleKey = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <div
    class="game-card"
    :class="{
      'is-flipped': showCatSide,
      'is-matched': isMatched,
      'is-clickable': isClickable
    }"
    :role="isClickable ? 'button' : null"
    :tabindex="isClickable ? 0 : -1"
    :aria-label="showCatSide ? `${cat.name} card revealed` : 'Face-down card'"
    :aria-pressed="showCatSide"
    @click="handleClick"
    @keyup="handleKey"
  >
    <div v-if="!showCatSide" class="card-face card-back">
      <span aria-hidden="true">🐾</span>
    </div>

    <div v-else class="card-face card-front">
      <img
        v-if="cat.image"
        :src="cat.image"
        :alt="cat.name"
        class="cat-image"
      >
      <span v-else class="cat-emoji" aria-hidden="true">
        {{ cat.emoji || '🐱' }}
      </span>
      <span class="cat-name">{{ cat.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.game-card {
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  user-select: none;
  transition: transform 0.15s ease, opacity 0.25s ease;
}

.game-card.is-clickable { cursor: pointer; }
.game-card.is-clickable:hover { transform: translateY(-2px); }
.game-card.is-clickable:focus-visible {
  outline: 3px solid #B65C68;
  outline-offset: 2px;
}
.game-card.is-matched { opacity: 0.55; cursor: default; }

.card-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 10px;
}

.card-back {
  background: #B65C68;
  color: #fdf2f3;
  font-size: 2rem;
}

.card-front {
  background: #fdf2f3;
  border: 2px solid #B65C68;
  color: #4B2C2D;
}

.game-card.is-matched .card-front {
  background: #E8A6A1;
  border-color: #B65C68;
}

.cat-image {
  width: 100%;
  flex: 1;
  object-fit: cover;
  border-radius: 6px;
  min-height: 0;
}

.cat-emoji {
  font-size: 2.5rem;
  line-height: 1;
}

.cat-name {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

@media (max-width: 576px) {
  .card-back { font-size: 1.5rem; }
  .cat-emoji { font-size: 2rem; }
  .cat-name { font-size: 0.65rem; }
}
</style>