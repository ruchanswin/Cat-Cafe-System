import { getAgeCategory } from './catDisplay.js'

/** Shared quiz shape (modal + adopt form). */
export const VISIT_QUIZ_DEFAULTS = {
  energy: '',
  lifeStage: '',
  affection: ''
}

/** Single scorer for personality match + browse URL (raw or mapped cat rows). */
export function scorePersonalityCat(cat, answers) {
  let score = 0
  const energy = String(cat.energyLevel ?? cat.energy_level ?? '').toLowerCase()
  const affection = String(cat.affectionLevel ?? cat.affection_level ?? '').toLowerCase()
  const ageLabel = String(cat.age ?? '').toLowerCase()

  if (answers.energy && energy === answers.energy) score += 3
  if (answers.affection && affection === answers.affection) score += 3
  if (answers.lifeStage) {
    if (getAgeCategory(cat) === answers.lifeStage || ageLabel === answers.lifeStage) score += 2
  }

  if (answers.home === 'quiet' && energy === 'calm') score += 1
  if (answers.experience === 'beginner' && energy === 'calm') score += 1

  const personality = String(cat.personality ?? '').toLowerCase()
  if (answers.energy === 'calm' && /calm|gentle|quiet/.test(personality)) score += 1
  if (answers.energy === 'playful' && /playful|energetic|active/.test(personality)) score += 1

  return score
}

function availableCats(cats) {
  return (cats ?? []).filter((cat) => {
    const status = String(cat.status ?? cat.adoption_status ?? '').toLowerCase()
    return cat.available !== false && status === 'available'
  })
}

function poolForAnswers(cats, answers) {
  let pool = availableCats(cats)
  if (answers.lifeStage) {
    pool = pool.filter((cat) => getAgeCategory(cat) === answers.lifeStage)
  }
  return pool
}

function findCatById(cats, id) {
  if (id == null) return null
  return (cats ?? []).find((cat) => Number(cat.id) === Number(id)) ?? null
}

/**
 * Maps quiz answers → CatsView URL query (useCatDiscoveryUrl).
 * @param {number|string|null} preferredCatId — use the cat shown in match results
 */
export function buildCatsDiscoveryQuery(answers, cats, preferredCatId = null) {
  const query = { status: 'Available' }

  if (answers.lifeStage) {
    query.age = answers.lifeStage
  }

  const pool = poolForAnswers(cats, answers)
  const ranked = pool
    .map((cat) => ({ cat, score: scorePersonalityCat(cat, answers) }))
    .sort((a, b) => b.score - a.score)

  let top = ranked[0]?.cat

  const preferred = findCatById(cats, preferredCatId)
  if (preferred && availableCats([preferred]).length) {
    top = preferred
  }

  if (top?.breed) {
    query.breed = top.breed
  }
  if (top?.id) {
    query.cat = String(top.id)
  }

  const traitTerms = []
  if (answers.energy === 'calm') traitTerms.push('calm')
  if (answers.energy === 'playful') traitTerms.push('playful')
  if (answers.affection === 'cuddly') traitTerms.push('cuddly')
  if (answers.affection === 'independent') traitTerms.push('independent')
  if (answers.affection === 'social') traitTerms.push('social')

  if (traitTerms.length && !top) {
    query.q = traitTerms.join(' ')
  }

  return query
}
