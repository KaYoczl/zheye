import { createApp } from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import App from './App.vue'

axios.defaults.baseURL = 'http://api.vikingship.xyz/api'
// axios.interceptors.request.use(config => {
//   config.params = { ...config.params, icode: 'C6A6C4086133360B' }
//   return config
// })
axios.get('/columns').then(res => {
  console.log(res)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
