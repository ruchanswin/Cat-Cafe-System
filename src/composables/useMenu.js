import { ref, computed } from 'vue'
import { fetchMenuFromSupabase, groupMenuItems } from '../services/menuApi.js'

const state = ref({ menuCategories: [] })
let supabaseInitPromise = null

async function loadMenuFromSupabase() {
  try {
    const items = await fetchMenuFromSupabase()
    if (items !== null) {
      state.value = items.length ? groupMenuItems(items) : { menuCategories: [] }
      return true
    }
  } catch (err) {
    console.warn('Failed to load menu from Supabase:', err.message)
  }
  return false
}

function ensureSupabaseMenuLoaded() {
  if (!supabaseInitPromise) {
    supabaseInitPromise = loadMenuFromSupabase()
  }
  return supabaseInitPromise
}

export function useMenu() {
  ensureSupabaseMenuLoaded()

  const menuCategories = computed(() => state.value.menuCategories ?? [])

  function categoryItems(name) {
    return menuCategories.value.find((c) => c.name === name)?.items ?? []
  }

  return {
    menuCategories,
    categoryItems,
    loadMenuFromSupabase
  }
}
