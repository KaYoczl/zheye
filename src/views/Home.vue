<template>
  <div>{{biggerColumnsLen}}
    <uploader action="/upload"></uploader>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import Uploader from '../components/Uploader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
export default defineComponent({
  name: 'Home',
  components: {
    ColumnList,
    Uploader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    console.log(store.state.columns)
    const list = computed(() => store.state.columns)
    const biggerColumnsLen = computed(() => store.getters.biggerColumnsLen)
    return {
      list,
      biggerColumnsLen
    }
  }
})
</script>

<style>

</style>
