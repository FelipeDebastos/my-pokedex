import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import PokemonDetails from '../pages/Details.vue'

const routes = [
  { path: '/', name: 'PageHome', component: Home },
  { path: '/pokemon/:id', name: 'PokemonDetails', component: PokemonDetails }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
