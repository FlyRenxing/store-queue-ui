import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
//import My from '../views/My.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    alias: '/index',
    name: 'Index',
    component: Index
  },
  {
    path: '/all',
    name: 'All',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/All.vue')
  },
  {
    path: '/my',
    name: 'My',
    component: () => import(/* webpackChunkName: "about" */ '../views/My.vue')
  },
  {
    path: '/myorder',
    name: 'MyOrder',
    component: () => import(/* webpackChunkName: "about" */ '../views/Order.vue')
  },
  
  
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
