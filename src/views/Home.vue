<template>
  <div>
    <column-list :list="list"></column-list>
    <button @click="loadMorePage" v-if="!isLastPage" class="btn btn-outline-primary mt-2 mb-5 mx-auto d-block w-25">
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import useLoadMore from '../hooks/useLoadMore'
export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const total = computed(() => store.state.columns.total)
    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 3 })
    })
    const list = computed(() => store.getters.getColumns)
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { pageSize: 3, currentPage: 2 })
    console.log(isLastPage)
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style>

</style>
