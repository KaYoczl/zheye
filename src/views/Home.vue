<template>
  <div>{{biggerColumnsLen}}
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
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
