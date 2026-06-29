import { ref } from 'vue'
import {
  fetchTeamFromSupabase,
  insertTeamMemberToSupabase,
  updateTeamMemberInSupabase,
  deleteTeamMemberFromSupabase
} from '../services/teamApi.js'

const state = ref([])
let supabaseInitPromise = null

async function loadTeamFromSupabase() {
  try {
    const remote = await fetchTeamFromSupabase()
    if (remote !== null) {
      state.value = remote
      return true
    }
  } catch (err) {
    console.warn('Failed to load team from Supabase:', err.message)
  }
  return false
}

function ensureSupabaseTeamLoaded() {
  if (!supabaseInitPromise) {
    supabaseInitPromise = loadTeamFromSupabase()
  }
  return supabaseInitPromise
}

export function useTeam() {
  ensureSupabaseTeamLoaded()

  async function addMember(member) {
    const payload = {
      name: member.name ?? 'New member',
      avatar: member.avatar ?? '??',
      role: member.role ?? '',
      bio: member.bio ?? '',
      experience: member.experience ?? '',
      background: member.background ?? '',
      education: member.education ?? '',
      workedOn: Array.isArray(member.workedOn) ? member.workedOn : []
    }

    try {
      const created = await insertTeamMemberToSupabase(payload)
      state.value = [...state.value, created]
      return created.id
    } catch (err) {
      console.error('Failed to add team member:', err.message)
      throw err
    }
  }

  async function updateMember(id, patch) {
    const current = state.value.find((m) => m.id === id)
    if (!current) return

    const next = { ...current, ...patch }
    try {
      const updated = await updateTeamMemberInSupabase(id, next)
      state.value = state.value.map((m) => (m.id === id ? updated : m))
    } catch (err) {
      console.error('Failed to update team member:', err.message)
    }
  }

  async function removeMember(id) {
    try {
      await deleteTeamMemberFromSupabase(id)
      state.value = state.value.filter((m) => m.id !== id)
    } catch (err) {
      console.error('Failed to remove team member:', err.message)
    }
  }

  return {
    team: state,
    loadTeamFromSupabase,
    addMember,
    updateMember,
    removeMember
  }
}
