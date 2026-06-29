import { ref } from 'vue'
import {
  fetchCafeCatsFromSupabase,
  insertCafeCatToSupabase,
  updateCafeCatInSupabase,
  deleteCafeCatFromSupabase
} from '../services/catApi.js'

const state = ref([])
let supabaseInitPromise = null

async function loadCatsFromSupabase() {
  try {
    const remote = await fetchCafeCatsFromSupabase()
    if (remote !== null) {
      state.value = remote
      return true
    }
  } catch (err) {
    console.warn('Failed to load cats from Supabase:', err.message)
  }
  return false
}

function ensureSupabaseCatsLoaded() {
  if (!supabaseInitPromise) {
    supabaseInitPromise = loadCatsFromSupabase()
  }
  return supabaseInitPromise
}

export function useCats() {
  ensureSupabaseCatsLoaded()

  async function addCat(cat) {
    const status = cat.status ?? (cat.available ? 'Available' : 'Pending')
    const payload = {
      name: cat.name ?? 'New cat',
      age: cat.age ?? 'Adult',
      ageCategory: cat.ageCategory,
      breed: cat.breed ?? 'Unknown',
      gender: cat.gender ?? '',
      personality: cat.personality ?? '',
      description: cat.description ?? '',
      habits: cat.habits ?? '',
      feedingGuide: cat.feedingGuide ?? '',
      status,
      adoptionStatus: status.toLowerCase(),
      popularity: Number(cat.popularity ?? 50),
      image: cat.image ?? '',
      energyLevel: cat.energyLevel ?? '',
      affectionLevel: cat.affectionLevel ?? '',
      available: Boolean(cat.available ?? status === 'Available')
    }

    try {
      const created = await insertCafeCatToSupabase(payload)
      state.value = [...state.value, created]
      return created.id
    } catch (err) {
      console.error('Failed to add cat:', err.message)
      throw err
    }
  }

  async function updateCat(id, patch) {
    const current = state.value.find((c) => c.id === id)
    if (!current) return

    const next = { ...current, ...patch }
    if (patch.status != null && patch.available == null) {
      next.available = patch.status === 'Available'
    }
    if (patch.available != null && patch.status == null) {
      next.status = patch.available ? 'Available' : current.status
    }

    try {
      const updated = await updateCafeCatInSupabase(id, next)
      state.value = state.value.map((c) => (c.id === id ? updated : c))
    } catch (err) {
      console.error('Failed to update cat:', err.message)
    }
  }

  async function removeCat(id) {
    try {
      await deleteCafeCatFromSupabase(id)
      state.value = state.value.filter((c) => c.id !== id)
    } catch (err) {
      console.error('Failed to remove cat:', err.message)
    }
  }

  return {
    cats: state,
    loadCatsFromSupabase,
    addCat,
    updateCat,
    removeCat
  }
}
