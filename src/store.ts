import { createStore } from 'vuex'
import axios from 'axios'

interface UserProps {
  isLogin: boolean
  name?: string
  id?: number
  columnId: number
}
interface ImageProps {
  _id?: string
  url?: string
  createAt?: string
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps
  createdAt: string
  column: string
}
export interface GlobalDataProps {
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: [],
    posts: [],
    user: { isLogin: true, name: 'lvxiaobu', columnId: 1 }
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, name: 'lvxiaobu' }
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    }
  },
  actions: {
    fetchColumns (context) {
      axios.get('/columns').then(res => {
        console.log(res)
        context.commit('fetchColumns', res.data)
      })
    },
    fetchColumn ({ commit }, cid) {
      axios.get(`/columns/${cid}`).then(res => {
        commit('fetchColumn', res.data)
      })
    },
    fetchPosts ({ commit }, cid) {
      axios.get(`/columns/${cid}/posts`).then(res => {
        commit('fetchPosts', res.data)
      })
    }
  },
  getters: {
    // biggerColumnsLen (state) {
    //   return state.columns.filter(c => c._id > 2).length
    // },
    // getColumnById: (state) => (id: number) => {
    //   return state.columns.find(c => c._id === id)
    // },
    // getPostsByCid: (state) => (cid: number) => {
    //   return state.posts.filter(post => post.columnId === cid)
    // }
  }
})
export default store
