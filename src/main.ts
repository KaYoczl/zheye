import { createApp } from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import App from './App.vue'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  // get请求，添加到url中
  config.params = { ...config.params, icode: '7010DEF1C581452E' }
  if (config.data instanceof FormData) {
    config.data.append('icode', '7010DEF1C581452E')
  } else {
    // 普通的body对象，添加到data中
    config.data = { ...config.data, icode: '7010DEF1C581452E' }
  }
  return config
})
// 发送请求时提交setLoading改变loading状态
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
