<template>
  <header class="navbar-wrap">
    <div class="page-container navbar-inner">
      <RouterLink to="/" class="brand-link">
        <div class="brand display-heading">Purr & Pour</div>
        <div class="subtitle">Cat Café</div>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/visit">Visit</RouterLink>
        <RouterLink to="/visit/book">Book</RouterLink>
        <RouterLink to="/visit/availability">Availability</RouterLink>
        <RouterLink to="/cats">Cats and Team</RouterLink>
        <RouterLink to="/cats/adopt">Adopt</RouterLink>
        <RouterLink to="/membership">Membership</RouterLink>
        <RouterLink to="/reviews">Reviews</RouterLink>
        <RouterLink to="/play">Play</RouterLink>
      </nav>

      <div class="auth-controls">
        <div v-if="!isLoggedIn" class="auth-actions">
          <RouterLink to="/login" class="link-login">Login</RouterLink>
        </div>

        <!-- If logged in -->
        <div v-else class="auth-actions">
          <!-- Admin link -->
          <RouterLink v-if="isAdmin" to="/admin" class="link-admin">
            Admin Dashboard
          </RouterLink>

          <!-- Profile link -->
          <RouterLink to="/profile" class="link-profile">
            {{ currentUser?.name || 'Profile' }}
          </RouterLink>

          <!-- Logout button -->
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </div>
      </div>
      <RouterLink to="/visit/book">
        <button class="btn-primary-cat">Book a Visit</button>
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../../stores/auth'

const router = useRouter()
const { currentUser, isLoggedIn, isAdmin, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<style scoped>
.navbar-wrap {
  position: sticky;
  top: 0;
  background: rgba(255, 245, 225, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(179, 156, 142, 0.3);
  z-index: 100;
}

.navbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  gap: 2rem;
}

.brand-link {
  text-decoration: none;
  min-width: fit-content;
}

.brand {
  font-size: 2rem;
  color: var(--color-accent);
}

.subtitle {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-links a {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-links a:hover {
  color: var(--color-primary);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

.auth-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: fit-content;
}

.auth-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.link-login,
.link-admin,
.link-profile {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.link-login {
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.link-login:hover {
  background: var(--color-primary);
  color: white;
}

.link-admin {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
  font-weight: 600;
}

.link-admin:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(182, 92, 104, 0.25);
}

.link-profile {
  background: var(--color-caramel);
  color: var(--color-text);
}

.link-profile:hover {
  background: var(--color-soft-pink);
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: var(--color-border);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-logout:hover {
  background: var(--color-primary);
  transform: translateY(-2px);
}

.btn-logout:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .navbar-inner {
    gap: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-links a {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .navbar-inner {
    flex-wrap: wrap;
    padding: 0.75rem 0;
  }

  .brand {
    font-size: 1.5rem;
  }

  .nav-links {
    order: 3;
    width: 100%;
    gap: 1rem;
    margin-top: 1rem;
  }

  .auth-controls {
    gap: 0.75rem;
  }

  .auth-actions {
    gap: 0.75rem;
    font-size: 0.85rem;
  }

  .link-login,
  .link-admin,
  .link-profile {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }

  .btn-logout {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>