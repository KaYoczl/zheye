<template>
  <div class="container">
    <div class="image">
      <img :src="currentImageUrl" v-if="currentImageUrl" width="500">
    </div>
    <hr>
    <user-profile :author="currentPost.author" v-if="typeof currentPost.author !== 'string'"></user-profile>
    <hr>
    <div class="content" v-html="currentHTML"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import { PostProps, ImageProps } from '../store'
import UserProfile from '../components/UserProfile.vue'

export default defineComponent({
  components: { UserProfile },
  setup () {
    const route = useRoute()
    const store = useStore()
    const postId = route.params.id
    const md = MarkdownIt()
    onMounted(() => {
      store.dispatch('fetchPost', postId)
    })
    const currentPost = computed<PostProps>(() => store.getters.getPostByPid(postId))
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        return md.render(currentPost.value.content)
      } else {
        return ''
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url
      } else {
        return null
      }
    })
    return {
      currentPost,
      currentImageUrl,
      currentHTML
    }
  }
})
</script>
<style scoped>
.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  text-align: center;
}
.content {
  margin: 50px 0 50px 0;
}
</style>
