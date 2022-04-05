import { ComputedRef, ref, computed } from 'vue'
import { useStore } from 'vuex'

interface LoadParams {
  currentPage: number
  pageSize: number
}
const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params: LoadParams = { currentPage: 2, pageSize: 5 }
) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  // 假如我们要获得最新的值，我们不能直接使用响应式对象的值，因为currentPage.value是一个常量2，
  // 所以每次请求都是2，所以我们需要使用computed计算属性来包裹一下，或者使用reactive对象
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
