import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

import VisitView from '../views/visit/VisitView.vue'
import FAQView from '../views/visit/FAQView.vue'
import MenuView from '../views/visit/MenuView.vue'
import BookingView from '../views/visit/BookingView.vue'
import AvailabilityView from '../views/visit/AvailabilityView.vue'

import CatsView from '../views/cats/CatsView.vue'
import TeamView from '../views/cats/TeamView.vue'
import AdoptView from '../views/cats/AdoptView.vue'

import MembershipView from '../views/membership/MembershipView.vue'
import ProfileView from '../views/membership/ProfileView.vue'

import ReviewsView from '../views/reviews/ReviewsView.vue'
import GameView from '../views/play/GameView.vue'
import AdminView from '../views/admin/AdminView.vue'
import LoginView from '../views/auth/LoginView.vue'

import MemoryGame from '../views/MemoryGame.vue'

const routes = [
  { path: '/', component: HomeView },

  { path: '/visit', component: VisitView },
  { path: '/visit/faq', component: FAQView },
  { path: '/visit/menu', component: MenuView },
  { path: '/visit/book', component: BookingView },
  { path: '/visit/availability', component: AvailabilityView },
  { path: '/login', component: LoginView },

  { path: '/cats', component: CatsView },
  { path: '/cats/team', component: TeamView },
  { path: '/cats/adopt', component: AdoptView },

  { path: '/membership', component: MembershipView },
  { path: '/profile', component: ProfileView },

  { path: '/reviews', component: ReviewsView },

  { path: '/play', component: GameView },

  { path: '/play/memory-game', component: MemoryGame },

  { path: '/admin', component: AdminView }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})