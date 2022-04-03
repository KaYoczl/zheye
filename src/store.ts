import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helper'

export interface ResponseType<P = { [key: string]: any }> {
  code: number
  msg: string
  data: P
}
export interface ResponseErrorType {
  code: number
  error: string
}
export interface ImageProps {
  _id?: string
  url?: string
  createAt?: string
}
export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
  description?: string
  avatar?: ImageProps
  createdAt?: string
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps | string
  createdAt?: string
  column: string
  author?: UserProps | string
}
interface ListProps<P> {
  [id: string]: P
}
export interface GlobalErrorProps {
  status: boolean
  message?: string
}
export interface GlobalDataProps {
  token: string
  columns: ListProps<ColumnProps>
  posts: ListProps<PostProps>
  user: UserProps
  loading: boolean
  error: GlobalErrorProps
}
// 第4个参数是传入axios发送请求时的配置，它有一个独特的类型
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
  // 不是直接使用get等方法，而是把axios当方法使用，第一个参数是url，第二个是config
  const { data } = await axios(url, config)
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    columns: {},
    posts: {},
    user: { isLogin: false },
    loading: false,
    error: { status: false }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts[newPost._id] = newPost
    },
    deletePost (state, { data }) {
      delete state.posts[data._id]
    },
    fetchColumns (state, rawData) {
      state.columns = arrToObj(rawData.data.list)
    },
    fetchColumn (state, rawData) {
      state.columns[rawData.data._id] = rawData.data
    },
    fetchPosts (state, rawData) {
      state.posts = arrToObj(rawData.data.list)
    },
    fetchPost (state, rawData) {
      state.posts[rawData.data._id] = rawData.data
    },
    updatePost (state, { data }) {
      state.posts[data._id] = data
    },
    setLoading (state, status) {
      state.loading = status
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      return asyncAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost ({ commit }, pid) {
      return asyncAndCommit(`/posts/${pid}`, 'fetchPost', commit)
    },
    updatePost ({ commit }, { pid, payload }) {
      return asyncAndCommit(`/posts/${pid}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, {
        method: 'post',
        data: payload
      })
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/posts', 'createPost', commit, {
        method: 'post',
        data: payload
      })
    },
    deletePost ({ commit }, pid) {
      return asyncAndCommit(`/posts/${pid}`, 'deletePost', commit, { method: 'delete' })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts).filter(post => post.column === cid)
    },
    getPostByPid: (state) => (pid: string) => {
      return state.posts[pid]
    }
  }
})
export default store
