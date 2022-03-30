import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import PostDetail from './views/PostDetail.vue'
import store from './store'
import axios from 'axios'

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
      path: '/signup',
      name: 'signup',
      component: Signup
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
    },
    {
      path: '/posts/:id',
      name: 'posts',
      component: PostDetail
    }
  ]
})
// to就是我们即将要到达的路由，即将进入的目标，from是正在离开的路由
// next是一个方法，我们一定要调用该方法来resolve这个钩子，让这个路由继续前进，执行效果依赖next方法的调用参数
router.beforeEach((to, from, next) => {
  // to.meta能拿到路由元信息
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e)
        // 既然获取当前用户失败了但又有token，说明token不好用了，要删掉
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})
export default router
