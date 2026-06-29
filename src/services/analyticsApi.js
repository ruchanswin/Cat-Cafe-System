export async function fetchAdminAnalytics() {
  const response = await fetch('http://localhost:3000/api/admin-analytics')

  if (!response.ok) {
    throw new Error('Failed to load admin analytics')
  }

  return response.json()
}