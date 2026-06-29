import { supabase } from '../lib/supabase.js'

const CAT_API_BASE_URL = 'https://api.thecatapi.com/v1'

const DEFAULT_CAT_IMAGE =
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80'

// ---------------------------------------------------------------------------
// Supabase — public.cats (see public/cats_rows.csv for column shape)
// id, name, age, breed, gender, personality, description, habits, feedingGuide,
// image_url, adoption_status, energy_level, affection_level, created_at
// ---------------------------------------------------------------------------

function formatAdoptionStatus(value) {
  if (!value) return 'Available'
  const lower = String(value).toLowerCase()
  if (lower === 'available') return 'Available'
  if (lower === 'pending') return 'Pending'
  if (lower === 'adopted') return 'Adopted'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function normalizeAgeCategory(age) {
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

function ageLabelFromCategory(category) {
  if (category === 'kitten') return 'Kitten'
  if (category === 'senior') return 'Senior'
  return 'Adult'
}

/** Supabase row → shape used by CatsView, CatCard, BookingForm, etc. */
export function mapSupabaseCat(row) {
  const ageCategory = normalizeAgeCategory(row.age)
  const status = formatAdoptionStatus(row.adoption_status)
  const available = String(row.adoption_status ?? 'available').toLowerCase() === 'available'

  return {
    id: row.id,
    name: row.name,
    age: row.age ?? ageLabelFromCategory(ageCategory),
    ageCategory,
    breed: row.breed ?? 'Unknown',
    gender: row.gender ?? '',
    personality: row.personality ?? '',
    description: row.description ?? '',
    habits: row.habits ?? '',
    feedingGuide: row.feedingGuide ?? '',
    status,
    adoptionStatus: row.adoption_status ?? 'available',
    available,
    image: row.image_url?.trim() || DEFAULT_CAT_IMAGE,
    energyLevel: row.energy_level ?? '',
    affectionLevel: row.affection_level ?? '',
    popularity: row.popularity ?? 50,
    createdAt: row.created_at ?? null
  }
}

/** App cat → Supabase insert/update row */
export function mapCatToSupabaseRow(cat) {
  const ageCategory = cat.ageCategory ?? normalizeAgeCategory(cat.age)
  let age = cat.age
  if (typeof age === 'number') {
    age = ageLabelFromCategory(ageCategory)
  }

  const adoptionStatus =
    cat.adoptionStatus ??
    (cat.available === false ? 'pending' : String(cat.status ?? 'available').toLowerCase())

  return {
    ...(cat.id != null ? { id: cat.id } : {}),
    name: cat.name,
    age: age ?? 'Adult',
    breed: cat.breed ?? 'Unknown',
    gender: cat.gender ?? '',
    personality: cat.personality ?? '',
    description: cat.description ?? '',
    habits: cat.habits ?? '',
    feedingGuide: cat.feedingGuide ?? '',
    image_url: cat.image ?? '',
    adoption_status: adoptionStatus,
    energy_level: cat.energyLevel ?? '',
    affection_level: cat.affectionLevel ?? ''
  }
}

export async function fetchCafeCatsFromSupabase() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('cats')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Supabase fetch cats:', error)
    throw error
  }

  return (data ?? []).map(mapSupabaseCat)
}

export async function insertCafeCatToSupabase(cat) {
  if (!supabase) throw new Error('Supabase is not configured')

  const row = mapCatToSupabaseRow(cat)
  delete row.id

  const { data, error } = await supabase.from('cats').insert(row).select().single()

  if (error) throw error
  return mapSupabaseCat(data)
}

export async function updateCafeCatInSupabase(id, patch) {
  if (!supabase) throw new Error('Supabase is not configured')

  const row = mapCatToSupabaseRow({ ...patch, id })

  const { data, error } = await supabase
    .from('cats')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapSupabaseCat(data)
}

export async function deleteCafeCatFromSupabase(id) {
  if (!supabase) throw new Error('Supabase is not configured')

  const { error } = await supabase.from('cats').delete().eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------------
// The Cat API — external breeds/images (adoption personality match)
// ---------------------------------------------------------------------------

export async function fetchCatBreeds() {
  const response = await fetch(`${CAT_API_BASE_URL}/breeds`, {
    headers: {
      'x-api-key': import.meta.env.VITE_CAT_API_KEY
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch cat breeds')
  }

  return response.json()
}

export async function fetchCatImageByBreed(breedId) {
  const response = await fetch(
    `${CAT_API_BASE_URL}/images/search?breed_ids=${breedId}&limit=1`,
    {
      headers: {
        'x-api-key': import.meta.env.VITE_CAT_API_KEY
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch cat image')
  }

  const data = await response.json()
  return data[0]?.url || ''
}
