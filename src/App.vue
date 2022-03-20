<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <h1 v-if="isLoading">Loading...</h1>
    <router-view></router-view>
    <global-footer></global-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    GlobalFooter
  },
  setup () {
    const store = useStore()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    return {
      currentUser,
      isLoading
    }
  }
})
</script>

<style>

</style>
