<template>
  <div class="post-list">
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
      <router-link :to="`/posts/${post._id}`">
        <div class="card-body">
          <h4>{{post.title}}</h4>
          <div class="row my-3 align-items-center">
            <div v-if="post.image && typeof post.image !== 'string'" class="col-4">
              <img :src="post.image.url" :alt="post.title" class="rounded-lg w-75">
            </div>
            <p :class="{'col-8': post.image}">{{post.excerpt}}</p>
          </div>
          <span class="text-muted">{{post.createdAt}}</span>
        </div>
      </router-link>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PostProps } from '../store'
export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>
    }
  }
})
</script>

<style scoped>
.post-list a {
  text-decoration: none;
  color:#1a1a1a;
}
.post-list a:hover {
  color:#0d6efd;
}
.router-link-active {
  text-decoration: none;
}
</style>
