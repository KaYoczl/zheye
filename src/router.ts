import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import store from './store'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requireLogin: true }
    }
  ]
})
// to就是我们即将要到达的路由，即将进入的目标，from是正在离开的路由
// next是一个方法，我们一定要调用该方法来resolve这个钩子，让这个路由继续前进，执行效果依赖next方法的调用参数
router.beforeEach((to, from, next) => {
  console.log('to.meta', to.meta)
  console.log('from', from)
  // 如果不调用next方法或者传入false，路由就会失效
  // next(false)
  // next()
  if (to.meta.requireLogin && !store.state.user.isLogin) {
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/')
  } else {
    next()
  }
})
export default router
