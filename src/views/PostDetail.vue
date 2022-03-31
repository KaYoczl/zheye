<template>
  <div class="container">
    <div class="image">
      <img :src="currentImageUrl" v-if="currentImageUrl" width="500">
    </div>
    <hr>
    <user-profile :author="currentPost.author" v-if="typeof currentPost.author !== 'string'"></user-profile>
    <hr>
    <div class="content" v-html="currentHTML"></div>
    <div v-if="showEditArea" class="btn-group mt-5">
      <router-link :to="{name: 'create', query: { id: currentPost._id }}" type="button" class="btn btn-success">编辑</router-link>
      <button type="button" class="btn btn-danger">删除</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import { PostProps, ImageProps, UserProps } from '../store'
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
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return null
      }
    })
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea
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
