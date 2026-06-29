import { supabase } from '../lib/supabase.js'

// ---------------------------------------------------------------------------
// Supabase — public.team
// id, name, avatar, role, bio, experience, background, education, worked_on
// ---------------------------------------------------------------------------

function parseWorkedOn(value) {
  if (Array.isArray(value)) return value
  if (!value?.trim()) return []
  return value.split(',').map((s) => s.trim()).filter(Boolean)
}

function formatWorkedOn(workedOn) {
  if (Array.isArray(workedOn)) return workedOn.join(', ')
  if (typeof workedOn === 'string') return workedOn
  return ''
}

/** Supabase row → shape used by TeamSection, TeamView, modals */
export function mapSupabaseTeamMember(row) {
  return {
    id: row.id,
    name: row.name ?? '',
    avatar: row.avatar ?? '??',
    role: row.role ?? '',
    bio: row.bio ?? '',
    experience: row.experience ?? '',
    background: row.background ?? '',
    education: row.education ?? '',
    workedOn: parseWorkedOn(row.worked_on)
  }
}

/** App member → Supabase insert/update row */
export function mapTeamMemberToSupabaseRow(member) {
  return {
    ...(member.id != null ? { id: member.id } : {}),
    name: member.name ?? '',
    avatar: member.avatar ?? '??',
    role: member.role ?? '',
    bio: member.bio ?? '',
    experience: member.experience ?? '',
    background: member.background ?? '',
    education: member.education ?? '',
    worked_on: formatWorkedOn(member.workedOn)
  }
}

export async function fetchTeamFromSupabase() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('team')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Supabase fetch team:', error)
    throw error
  }

  return (data ?? []).map(mapSupabaseTeamMember)
}

export async function insertTeamMemberToSupabase(member) {
  if (!supabase) throw new Error('Supabase is not configured')

  const row = mapTeamMemberToSupabaseRow(member)
  delete row.id

  const { data, error } = await supabase.from('team').insert(row).select().single()

  if (error) throw error
  return mapSupabaseTeamMember(data)
}

export async function updateTeamMemberInSupabase(id, member) {
  if (!supabase) throw new Error('Supabase is not configured')

  const row = mapTeamMemberToSupabaseRow({ ...member, id })

  const { data, error } = await supabase
    .from('team')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapSupabaseTeamMember(data)
}

export async function deleteTeamMemberFromSupabase(id) {
  if (!supabase) throw new Error('Supabase is not configured')

  const { error } = await supabase.from('team').delete().eq('id', id)
  if (error) throw error
}
