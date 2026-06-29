import { ref, watch } from 'vue'

const STORAGE_KEY = 'catCafe.favorites.cats.v1'

function loadFavoriteIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((id) => Number(id)).filter((id) => Number.isFinite(id))
  } catch {
    return []
  }
}

function saveFavoriteIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // ignore quota / privacy mode
  }
}

const favoriteIds = ref(loadFavoriteIds())

watch(
  favoriteIds,
  (ids) => saveFavoriteIds(ids),
  { deep: true }
)

export function useCatFavorites() {
  function isFavorite(catId) {
    return favoriteIds.value.includes(Number(catId))
  }

  function toggleFavorite(catId) {
    const id = Number(catId)
    if (!Number.isFinite(id)) return
    favoriteIds.value = favoriteIds.value.includes(id)
      ? favoriteIds.value.filter((item) => item !== id)
      : [...favoriteIds.value, id]
  }

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite
  }
}
