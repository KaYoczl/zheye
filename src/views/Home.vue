<template>
  <div class="home-page">
    <section class="py-4 text-center container">
      <div class="row py-lg-4">
        <div class="col-lg-4 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center mb-3">发现精彩</h4>
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
    const currentPage = computed(() => store.state.columns.currentPage)
    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 6 })
    })
    const list = computed(() => store.getters.getColumns)
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { pageSize: 6, currentPage: (currentPage.value ? currentPage.value + 1 : 2) })
    console.log(isLastPage)
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
