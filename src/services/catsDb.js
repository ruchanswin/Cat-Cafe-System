import { supabase } from '../lib/supabase'

export async function getCats() {
  const { data, error } = await supabase
    .from('cats')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addCat(cat) {
  const { data, error } = await supabase
    .from('cats')
    .insert([cat])
    .select()

  if (error) throw error
  return data[0]
}

export async function updateCat(id, updates) {
  const { data, error } = await supabase
    .from('cats')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

export async function deleteCat(id) {
  const { error } = await supabase
    .from('cats')
    .delete()
    .eq('id', id)

  if (error) throw error
}