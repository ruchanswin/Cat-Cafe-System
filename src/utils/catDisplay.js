const AGE_ORDER = { kitten: 0, adult: 1, senior: 2 }

export function formatAgeDisplay(age) {
  if (age == null || age === '') return '—'
  if (typeof age === 'number' && Number.isFinite(age)) {
    return `${age} ${age === 1 ? 'year' : 'years'}`
  }
  return String(age)
}

export function getAgeCategory(cat) {
  if (cat?.ageCategory) return cat.ageCategory
  const age = cat?.age
  if (typeof age === 'number' && Number.isFinite(age)) {
    if (age < 2) return 'kitten'
    if (age >= 8) return 'senior'
    return 'adult'
  }
  const label = String(age ?? '').toLowerCase()
  if (label.includes('kitten')) return 'kitten'
  if (label.includes('senior')) return 'senior'
  return 'adult'
}

export function compareAgeCats(a, b) {
  return AGE_ORDER[getAgeCategory(a)] - AGE_ORDER[getAgeCategory(b)]
}
