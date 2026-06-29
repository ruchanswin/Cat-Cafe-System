import { ref, computed } from 'vue'

const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

export function useAuth() {
  const isLoggedIn = computed(() => currentUser.value !== null)

  const isAdmin = computed(() => {
    return currentUser.value?.role === 'admin'
  })

  function login(email, password) {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    // Check admin credentials
    if (email === 'admin@catcafe.com' && password === 'admin123') {
      currentUser.value = {
        name: 'Admin Dashboard',
        email,
        role: 'admin'
      }
    } else {
      // Regular user login
      currentUser.value = {
        name: email.split('@')[0], // Use email prefix as name
        email,
        role: 'user'
      }
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
    return currentUser.value
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }
  function setAdminUser(user) {
  currentUser.value = user
  localStorage.setItem('currentUser', JSON.stringify(user))
}

  return {
  currentUser,
  isLoggedIn,
  isAdmin,
  login,
  logout,
  setAdminUser
}
}