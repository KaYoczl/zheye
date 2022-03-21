<template>
  <teleport to="#back">
    <div
      class="loading-container d-flex justify-content-center align-items-center h-100"
      :style="{backgroundColor: background || ''}"
    >
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status"></div>
        <p v-if="text" class="text-primary small">{{text}}</p>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String,
      default: 'Loading...'
    },
    background: {
      type: String
    }
  },
  setup () {
    const node = document.createElement('div')
    node.id = 'back'
    document.body.appendChild(node)
    onUnmounted(() => {
      // 如果不在组件卸载的时候清除节点，那么每次发请求都会生成一个id为back的div，越来越多
      document.body.removeChild(node)
    })
  }
})
</script>
<style>
.loading-container {
  background: rgba(255, 255, 255, .5);
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
</style>
