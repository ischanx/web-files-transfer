import Vue from 'vue'
import VueRouter from 'vue-router'
import Send from '@/views/Send.vue'
import Receive from '@/views/Receive.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Send',
    component: Send,
  },
  {
    path: '/receive',
    name: 'Receive',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Receive,
  }
]

const router = new VueRouter({
  routes
})

export default router
