import { createApp } from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import App from './App.vue'

axios.defaults.baseURL = 'http://apis.imooc.com/api'
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: 'B83FA1594D8BFE8D' }
  return config
})
async function hello () {
  const greeting = await Promise.resolve('Hello')
  return greeting
}
hello().then(value => console.log(value))
console.log(hello())
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
