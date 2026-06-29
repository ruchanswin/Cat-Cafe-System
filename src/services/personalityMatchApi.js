import { getCats } from './catsDb'
import { scorePersonalityCat } from '../utils/visitMatch.js'

export async function getPersonalityMatch(answers) {
  const cats = await getCats()

  const matches = cats
    .filter((cat) => String(cat.adoption_status ?? '').toLowerCase() === 'available')
    .map((cat) => ({
      cat,
      score: scorePersonalityCat(cat, answers),
      reason: `${cat.name} matches your preferences based on personality, energy level, and affection style.`
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)

  return matches
}
