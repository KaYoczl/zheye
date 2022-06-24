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
  columns: { data: ListProps<ColumnProps>, currentPage: number, total: number }
  posts: { data: ListProps<PostProps>, loadedColumns: string[] }
  user: UserProps
  loading: boolean
  error: GlobalErrorProps
}
// 第4个参数是传入axios发送请求时的配置，它有一个独特的类型
const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any
) => {
  // 不是直接使用get等方法，而是把axios当方法使用，第一个参数是url，第二个是config
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: [] },
    user: { isLogin: false },
    loading: false,
    error: { status: false }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        currentPage: currentPage * 1,
        total: count
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
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
      state.user = { isLogin: false }
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
    fetchColumns ({ state, commit }, params = {}) {
      // 万一没传currentPage和pageSize，就会使用1和6
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    fetchPost ({ state, commit }, pid) {
      const currentPost = state.posts.data[pid]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${pid}`, 'fetchPost', commit)
      } else {
        // 如果不返回一个Promise，那么在编辑文章页就因为不执行上面代码导致.then回调函数中的rawData为undefined
        return Promise.resolve({ data: currentPost })
      }
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
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getPostByPid: (state) => (pid: string) => {
      return state.posts.data[pid]
    }
  }
})
export default store
