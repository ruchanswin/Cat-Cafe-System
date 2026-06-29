import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

const bookings = ref([])

export function useBookings() {
  // Load all bookings from Supabase
  const fetchBookings = async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Failed to fetch bookings:', error)
      return
    }
    bookings.value = data
  }

  // Save a new booking to Supabase
  const addBooking = async (booking) => {
    const newBooking = {
      name: booking.name,
      email: booking.email,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      booking_type: booking.bookingType || booking.booking_type,
      cat_name: booking.catName || booking.cat_name || null
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .insert(newBooking)
        .select()
      if (error) {
        console.error('Failed to save booking:', error)
        return null
      }
      bookings.value.unshift(data[0])
      return data[0]
    } else {
      // fallback if supabase not configured
      const fallback = { ...newBooking, id: Date.now() }
      bookings.value.unshift(fallback)
      return fallback
    }
  }

  // Check if a slot is taken (used by availability grid)
  const isSlotTaken = (date, time, catId = null) => {
    return bookings.value.some(b =>
      b.date === date &&
      b.time === time &&
      (catId === null || b.cat_name === catId)
    )
  }

  const allBookings = computed(() => bookings.value)

  return { addBooking, isSlotTaken, allBookings, fetchBookings }
}