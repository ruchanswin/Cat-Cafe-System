import { supabase } from '../lib/supabase.js'

// ---------------------------------------------------------------------------
// Supabase — public.menu (see public/menu_rows.csv)
// id, category_name, category_icon, name, desc, price
// ---------------------------------------------------------------------------

const CATEGORY_ORDER = ['Hot Drinks', 'Cold Drinks', 'Treats']

export function mapSupabaseMenuItem(row) {
  return {
    id: row.id,
    categoryName: row.category_name ?? '',
    categoryIcon: row.category_icon ?? '',
    name: row.name ?? '',
    desc: row.desc ?? '',
    price: row.price ?? ''
  }
}

/** Flat menu rows → nested shape used by MenuView / HomeView */
export function groupMenuItems(items) {
  const byName = new Map()

  for (const item of items) {
    const key = item.categoryName
    if (!byName.has(key)) {
      byName.set(key, {
        name: item.categoryName,
        icon: item.categoryIcon,
        items: []
      })
    }
    byName.get(key).items.push({
      id: item.id,
      name: item.name,
      desc: item.desc,
      price: item.price
    })
  }

  const categories = CATEGORY_ORDER.filter((name) => byName.has(name)).map((name) => byName.get(name))

  for (const [name, category] of byName) {
    if (!CATEGORY_ORDER.includes(name)) categories.push(category)
  }

  return { menuCategories: categories }
}

export async function fetchMenuFromSupabase() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Supabase fetch menu:', error)
    throw error
  }

  return (data ?? []).map(mapSupabaseMenuItem)
}
