import Vue from 'vue'
import VueRouter from 'vue-router'
import Calendar from './components/Calendar.vue'
import DayView from './components/DayView.vue'
import ExerciseInstructions from './components/ExerciseInstructions.vue'
import PersonalBests from './components/PersonalBests.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/day/:date',
    name: 'DayView',
    component: DayView,
    props: true
  },
  {
    path: '/instructions',
    name: 'Instructions',
    component: ExerciseInstructions
  },
  {
  path: '/records',
  name: 'PersonalBests',
  component: PersonalBests
}
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash, behavior: 'smooth' }
    }
    return { x: 0, y: 0 }
  }
})

export default router
