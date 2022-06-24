<template>
  <div class="container">
    <modal title="删除文章"
      :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定删除这篇文章吗？</p>
    </modal>
    <div class="image">
      <img :src="currentImageUrl" v-if="currentImageUrl" width="500">
    </div>
    <hr>
    <user-profile :author="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
    <hr>
    <div class="content" v-html="currentHTML"></div>
    <div v-if="showEditArea" class="btn-group mt-5">
      <router-link :to="{name: 'create', query: { id: currentPost._id }}" type="button" class="btn btn-success">编辑</router-link>
      <button @click.prevent="modalIsVisible = true" type="button" class="btn btn-danger">删除</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import { PostProps, ImageProps, UserProps, ResponseType } from '../store'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  components: { UserProfile, Modal },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const modalIsVisible = ref(false)
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
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', postId).then((rawData: ResponseType<PostProps>) => {
        createMessage('删除成功，2秒后跳转到专栏首页', 'success')
        setTimeout(() => {
          router.push({ name: 'column', params: { id: rawData.data.column } })
        }, 2000)
      })
    }
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>
<style scoped>
.container {
  margin-bottom: 20px;
}
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
