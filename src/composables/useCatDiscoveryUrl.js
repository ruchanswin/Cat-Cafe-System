import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const VALID_AGES = new Set(['all', 'kitten', 'adult', 'senior'])
const VALID_SORTS = new Set(['name', 'popularity', 'age-asc', 'age-desc'])

function parsePage(value) {
  const n = parseInt(String(value ?? ''), 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

function parseCatId(value) {
  if (value == null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

function parseBreedFromQuery(query, validBreeds) {
  if (typeof query.breed !== 'string' || query.breed === '' || query.breed === 'all') return 'all'
  // Accept URL breed before Supabase cats finish loading; re-validate once breeds are known
  if (!validBreeds.length) return query.breed
  return validBreeds.includes(query.breed) ? query.breed : 'all'
}

function parseStatusFromQuery(query, validStatuses) {
  if (typeof query.status !== 'string' || query.status === '' || query.status === 'all') return 'all'
  if (!validStatuses.length) return query.status
  return validStatuses.includes(query.status) ? query.status : 'all'
}

/**
 * Keeps cat discovery filters, pagination, and lightbox cat id in sync with the URL query string.
 */
export function useCatDiscoveryUrl({
  searchTerm,
  selectedBreed,
  selectedAge,
  selectedStatus,
  sortBy,
  currentPage,
  selectedCatId,
  validBreeds,
  validStatuses
}) {
  const route = useRoute()
  const router = useRouter()
  const isSyncingFromRoute = ref(false)

  function parseQuery(query) {
    const breeds = validBreeds.value
    const statuses = validStatuses.value

    return {
      q: typeof query.q === 'string' ? query.q : '',
      breed: parseBreedFromQuery(query, breeds),
      age: VALID_AGES.has(query.age) ? query.age : 'all',
      status: parseStatusFromQuery(query, statuses),
      sort: VALID_SORTS.has(query.sort) ? query.sort : 'name',
      page: parsePage(query.page),
      cat: parseCatId(query.cat)
    }
  }

  function buildQuery() {
    const query = {}
    const trimmed = searchTerm.value.trim()
    if (trimmed) query.q = trimmed
    if (selectedBreed.value !== 'all') query.breed = selectedBreed.value
    if (selectedAge.value !== 'all') query.age = selectedAge.value
    if (selectedStatus.value !== 'all') query.status = selectedStatus.value
    if (sortBy.value !== 'name') query.sort = sortBy.value
    if (currentPage.value > 1) query.page = String(currentPage.value)
    if (selectedCatId.value != null) query.cat = String(selectedCatId.value)
    return query
  }

  function applyFromRoute() {
    const parsed = parseQuery(route.query)
    isSyncingFromRoute.value = true
    searchTerm.value = parsed.q
    selectedBreed.value = parsed.breed
    selectedAge.value = parsed.age
    selectedStatus.value = parsed.status
    sortBy.value = parsed.sort
    currentPage.value = parsed.page
    selectedCatId.value = parsed.cat
    nextTick(() => {
      isSyncingFromRoute.value = false
    })
  }

  function syncToRoute() {
    if (isSyncingFromRoute.value) return
    const next = buildQuery()
    const current = route.query
    const keys = new Set([...Object.keys(next), ...Object.keys(current)])
    const unchanged = [...keys].every((key) => String(current[key] ?? '') === String(next[key] ?? ''))
    if (unchanged) return
    router.replace({ path: route.path, query: next })
  }

  onMounted(applyFromRoute)

  watch(() => route.query, applyFromRoute)

  // Re-apply when cat catalogue loads so breed/status from shared links validate correctly
  watch([validBreeds, validStatuses], () => {
    if (validBreeds.value.length === 0 && validStatuses.value.length === 0) return
    applyFromRoute()
  })

  watch(
    [searchTerm, selectedBreed, selectedAge, selectedStatus, sortBy, currentPage, selectedCatId],
    syncToRoute
  )

  return { applyFromRoute, syncToRoute, isSyncingFromRoute }
}
