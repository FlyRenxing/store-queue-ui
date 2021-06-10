import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    alias: '/index',
    name: 'Index',
    meta: {title: "首页"},
    component: Index
  },
  {
    path: '/all',
    name: 'All',
    meta: {title: "分类"},
    component: () => import(/* webpackChunkName: "about" */ '../views/All.vue')
  },
  {
    path: '/my',
    name: 'My',
    meta: {title: "我的"},
    component: () => import(/* webpackChunkName: "about" */ '../views/My.vue')
  },
  {
    path: '/myorder',
    name: 'MyOrder',
    meta: {title: "订单"},
    component: () => import(/* webpackChunkName: "about" */ '../views/Order.vue')
  },


]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {//如果设置标题，拦截后设置标题
    document.title = to.meta.title + " - 想不出商城"
  }
  next()
})

export default router
