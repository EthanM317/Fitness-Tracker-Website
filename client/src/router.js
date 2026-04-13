import Vue from 'vue'
import VueRouter from 'vue-router'
import Calendar from './components/Calendar.vue'
import CalendarView from './components/CalendarView.vue'
import DayView from './components/DayView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CalendarView',
    component: CalendarView
  },
  {
    path: '/day/:date',
    name: 'DayView',
    component: DayView,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router