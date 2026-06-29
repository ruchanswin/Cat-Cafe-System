// Leaderboard composable — keeps the top scores in localStorage so
// they survive a page reload. Same pattern as useBookings: a single
// module-scope ref shared across any component that calls this.
//
// Scores are sorted "best first" using a simple score formula that
// rewards fewer moves and faster times. Top 5 are kept per difficulty.

import { ref, computed } from 'vue'

const STORAGE_KEY = 'purr-pour-leaderboard'
const MAX_ENTRIES = 5

// Load existing scores from localStorage on module init.
// If anything's malformed, start fresh — don't crash the app.
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.warn('Leaderboard: failed to load, starting fresh', e)
    return []
  }
}

const scores = ref(loadFromStorage())

// Score formula: lower is better. Moves count more than seconds so
// careful play beats fast-but-sloppy play.
const computeScore = (moves, seconds) => moves * 10 + seconds

export function useLeaderboard () {
  // Add a new score, keep only top MAX_ENTRIES per difficulty,
  // and persist to localStorage. Returns the rank (1-indexed) or
  // null if the score didn't make the cut.
  const addScore = ({ name, moves, seconds, difficulty }) => {
    const entry = {
      id: Date.now(),
      name: name.trim() || 'Anonymous',
      moves,
      seconds,
      difficulty,
      score: computeScore(moves, seconds),
      playedAt: new Date().toISOString()
    }

    // Combine existing + new, sort, slice to top 5 per difficulty.
    const sameDiff = scores.value
      .filter(s => s.difficulty === difficulty)
      .concat(entry)
      .sort((a, b) => a.score - b.score)
      .slice(0, MAX_ENTRIES)

    const others = scores.value.filter(s => s.difficulty !== difficulty)
    scores.value = [...others, ...sameDiff]

    saveToStorage()

    // Find rank within the same-difficulty list.
    const rank = sameDiff.findIndex(s => s.id === entry.id)
    return rank === -1 ? null : rank + 1
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.value))
    } catch (e) {
      console.warn('Leaderboard: failed to save', e)
    }
  }

  // Computed: top scores for a given difficulty, already sorted.
  const topScoresFor = (difficulty) => computed(() =>
    scores.value
      .filter(s => s.difficulty === difficulty)
      .sort((a, b) => a.score - b.score)
      .slice(0, MAX_ENTRIES)
  )

  // For the optional "Clear leaderboard" admin action.
  const clearAll = () => {
    scores.value = []
    saveToStorage()
  }

  return { addScore, topScoresFor, clearAll }
}