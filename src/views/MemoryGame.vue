<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useLeaderboard } from '../composables/useLeaderboard.js'
import GameCard from '../components/game/GameCard.vue'
import WinModal from '../components/game/WinModal.vue'
import PageLayout from '../components/layout/PageLayout.vue'

const { addScore, topScoresFor } = useLeaderboard()

const catPool = [
  { id: 1,  name: 'Whiskers', image: null, emoji: '🐱' },
  { id: 2,  name: 'Mochi',    image: null, emoji: '😺' },
  { id: 3,  name: 'Luna',     image: null, emoji: '😸' },
  { id: 4,  name: 'Biscuit',  image: null, emoji: '😻' },
  { id: 5,  name: 'Pepper',   image: null, emoji: '🐈' },
  { id: 6,  name: 'Ginger',   image: null, emoji: '🐈‍⬛' },
  { id: 7,  name: 'Shadow',   image: null, emoji: '😼' },
  { id: 8,  name: 'Coco',     image: null, emoji: '😽' },
  { id: 9,  name: 'Tiger',    image: null, emoji: '🦁' },
  { id: 10, name: 'Smokey',   image: null, emoji: '🐯' }
]

const DIFFICULTIES = {
  easy:   { label: 'Easy (2×3)',   pairs: 3 },
  medium: { label: 'Medium (2×4)', pairs: 4 },
  hard:   { label: 'Hard (2×5)',   pairs: 5 }
}

const difficulty = ref('medium')
const deck = ref([])
const moves = ref(0)
const seconds = ref(0)
const isLocked = ref(false)
const winModalVisible = ref(false)
const lastRank = ref(null)
const flippedIndices = ref([])

let timerInterval = null

const buildDeck = () => {
  const pairs = DIFFICULTIES[difficulty.value].pairs
  const pool = [...catPool]
  while (pool.length < pairs) pool.push(...catPool)
  const selected = pool.slice(0, pairs)
  const cards = []
  selected.forEach((cat, i) => {
    cards.push({ uid: `${cat.id}-a-${i}`, cat, isFlipped: false, isMatched: false })
    cards.push({ uid: `${cat.id}-b-${i}`, cat, isFlipped: false, isMatched: false })
  })
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

const startTimer = () => {
  if (timerInterval) return
  timerInterval = setInterval(() => { seconds.value++ }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onUnmounted(stopTimer)

const handleFlip = (index) => {
  if (isLocked.value) return
  if (deck.value[index].isFlipped || deck.value[index].isMatched) return

  if (flippedIndices.value.length === 0 && moves.value === 0 && !timerInterval) {
    startTimer()
  }

  deck.value[index].isFlipped = true
  flippedIndices.value.push(index)

  if (flippedIndices.value.length === 2) {
    moves.value++
    isLocked.value = true

    const [a, b] = flippedIndices.value
    const cardA = deck.value[a]
    const cardB = deck.value[b]

    if (cardA.cat.id === cardB.cat.id) {
      setTimeout(() => {
        cardA.isMatched = true
        cardB.isMatched = true
        cardA.isFlipped = false
        cardB.isFlipped = false
        flippedIndices.value = []
        isLocked.value = false
      }, 500)
    } else {
      setTimeout(() => {
        cardA.isFlipped = false
        cardB.isFlipped = false
        flippedIndices.value = []
        isLocked.value = false
      }, 900)
    }
  }
}

const matchedCount = computed(() => deck.value.filter(c => c.isMatched).length / 2)
const totalPairs = computed(() => DIFFICULTIES[difficulty.value].pairs)
const isWon = computed(() => deck.value.length > 0 && matchedCount.value === totalPairs.value)

watch(isWon, (won) => {
  if (won) {
    stopTimer()
    setTimeout(() => { winModalVisible.value = true }, 600)
  }
})

const formattedTime = computed(() => {
  const m = Math.floor(seconds.value / 60)
  const s = seconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const restart = () => {
  stopTimer()
  seconds.value = 0
  moves.value = 0
  flippedIndices.value = []
  isLocked.value = false
  winModalVisible.value = false
  lastRank.value = null
  deck.value = buildDeck()
}

restart()
watch(difficulty, restart)

const handleScoreSubmit = (name) => {
  lastRank.value = addScore({
    name,
    moves: moves.value,
    seconds: seconds.value,
    difficulty: difficulty.value
  })
}

const handleModalClose = () => {
  winModalVisible.value = false
  restart()
}

const currentLeaderboard = computed(() => topScoresFor(difficulty.value).value)

const formatEntryTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

const gridClass = computed(() => `grid-${difficulty.value}`)
</script>

<template>
  <PageLayout>
    <div class="memory-game container py-4">

      <!-- Exit button -->
      <div class="exit-row">
        <router-link to="/play" class="btn-exit">← Back to Games</router-link>
      </div>

      <header class="text-center mb-3">
        <h1 class="game-title">🐱 Cat Memory Match</h1>
        <p class="game-subtitle">Flip cards to find matching pairs. Match them all to win!</p>
      </header>

      <div class="difficulty-row" role="radiogroup" aria-label="Game difficulty">
        <button
          v-for="(d, key) in DIFFICULTIES"
          :key="key"
          :class="['btn-difficulty', { active: difficulty === key }]"
          :aria-checked="difficulty === key"
          role="radio"
          @click="difficulty = key"
        >
          {{ d.label }}
        </button>
      </div>

      <div class="game-layout">
        <section class="game-area">
          <div class="stats-bar">
            <div class="stat-card">
              <p class="stat-label">Time</p>
              <p class="stat-value">{{ formattedTime }}</p>
            </div>
            <div class="stat-card">
              <p class="stat-label">Moves</p>
              <p class="stat-value">{{ moves }}</p>
            </div>
            <div class="stat-card">
              <p class="stat-label">Pairs</p>
              <p class="stat-value">{{ matchedCount }} / {{ totalPairs }}</p>
            </div>
            <button class="stat-card stat-restart" @click="restart" aria-label="Restart game">
              <span class="restart-icon" aria-hidden="true">↻</span>
              <p class="stat-label">Restart</p>
            </button>
          </div>

          <div :class="['card-grid', gridClass]">
            <GameCard
              v-for="(card, i) in deck"
              :key="card.uid"
              :cat="card.cat"
              :is-flipped="card.isFlipped"
              :is-matched="card.isMatched"
              :is-locked="isLocked"
              @flip="handleFlip(i)"
            />
          </div>
        </section>

        <aside class="leaderboard">
          <h2 class="leaderboard-title">🏆 Leaderboard</h2>
          <p class="leaderboard-subtitle">Top scores — {{ DIFFICULTIES[difficulty].label }}</p>

          <ol v-if="currentLeaderboard.length" class="leaderboard-list">
            <li
              v-for="(entry, idx) in currentLeaderboard"
              :key="entry.id"
              class="leaderboard-entry"
              :class="{ 'top-three': idx < 3 }"
            >
              <span class="rank">{{ idx + 1 }}.</span>
              <span class="player-name">{{ entry.name }}</span>
              <span class="player-score">{{ entry.moves }} / {{ formatEntryTime(entry.seconds) }}</span>
            </li>
          </ol>

          <p v-else class="empty-leaderboard">No scores yet — be the first!</p>
        </aside>
      </div>

      <WinModal
        :visible="winModalVisible"
        :moves="moves"
        :seconds="seconds"
        :difficulty="difficulty"
        :rank="lastRank"
        @submit="handleScoreSubmit"
        @close="handleModalClose"
      />
    </div>
  </PageLayout>
</template>

<style scoped>
.memory-game { max-width: 1100px; margin: 0 auto; }
.game-title { color: #4B2C2D; font-weight: 600; margin-bottom: 0.25rem; }
.game-subtitle { color: #8a6f70; font-size: 0.95rem; }

/* ── Exit button ── */
.exit-row {
  margin-bottom: 1rem;
}

.btn-exit {
  display: inline-block;
  color: #B65C68;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  padding: 0.4rem 1rem;
  border: 1.5px solid #d8c5c7;
  border-radius: 999px;
  background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.btn-exit:hover {
  background: #fdf2f3;
  border-color: #B65C68;
}

/* ── Difficulty ── */
.difficulty-row {
  display: flex; gap: 0.5rem; justify-content: center;
  margin-bottom: 1.5rem; flex-wrap: wrap;
}
.btn-difficulty {
  background: #fff; color: #4B2C2D; border: 1px solid #d8c5c7;
  font-weight: 500; padding: 0.45rem 1rem; border-radius: 8px;
  cursor: pointer; transition: background 0.15s ease;
}
.btn-difficulty:hover { background: #fdf2f3; }
.btn-difficulty.active { background: #B65C68; color: #fff; border-color: #B65C68; }

/* ── Layout ── */
.game-layout { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 992px) {
  .game-layout { grid-template-columns: 2fr 1fr; }
}

/* ── Stats ── */
.stats-bar {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem; margin-bottom: 1rem;
}
.stat-card {
  background: #fdf2f3; border-radius: 8px; border: none;
  padding: 0.75rem 0.5rem; text-align: center; cursor: default;
}
.stat-card.stat-restart {
  cursor: pointer; background: #fff; border: 1px solid #d8c5c7;
  transition: background 0.15s ease;
}
.stat-card.stat-restart:hover { background: #fdf2f3; }
.stat-label {
  font-size: 0.75rem; color: #8a6f70; margin: 0;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.stat-value {
  font-size: 1.4rem; font-weight: 600; color: #4B2C2D;
  margin: 0; font-variant-numeric: tabular-nums;
}
.restart-icon { font-size: 1.4rem; display: block; color: #4B2C2D; margin-bottom: 2px; }

/* ── Card grid ── */
.card-grid { display: grid; gap: 0.6rem; }
.grid-easy   { grid-template-columns: repeat(3, 1fr); }
.grid-medium { grid-template-columns: repeat(4, 1fr); }
.grid-hard   { grid-template-columns: repeat(5, 1fr); }

@media (max-width: 576px) {
  .stats-bar { grid-template-columns: repeat(4, 1fr); gap: 0.4rem; }
  .stat-value { font-size: 1.1rem; }
}

/* ── Leaderboard ── */
.leaderboard {
  background: #fff; border: 1px solid #d8c5c7;
  border-radius: 12px; padding: 1.25rem; height: fit-content;
}
.leaderboard-title { font-size: 1.15rem; color: #4B2C2D; font-weight: 600; margin: 0 0 0.25rem; }
.leaderboard-subtitle { font-size: 0.8rem; color: #8a6f70; margin: 0 0 1rem; }
.leaderboard-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.leaderboard-entry {
  display: grid; grid-template-columns: auto 1fr auto;
  gap: 0.5rem; align-items: center;
  padding: 0.5rem 0.75rem; background: #fdf2f3;
  border-radius: 6px; font-size: 0.9rem; color: #4B2C2D;
}
.leaderboard-entry.top-three .rank { color: #B65C68; font-weight: 700; }
.rank { font-weight: 600; color: #8a6f70; }
.player-name { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.player-score { font-size: 0.8rem; color: #8a6f70; font-variant-numeric: tabular-nums; }
.empty-leaderboard { font-size: 0.9rem; color: #8a6f70; text-align: center; padding: 1rem 0; margin: 0; }
</style>