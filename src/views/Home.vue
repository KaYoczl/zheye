<template>
  <div>
    <uploader action="/upload" :beforeUpload="beforeUpload" @file-uploaded="onFileUploaded" @file-uploaded-error="fileUploadedError"></uploader>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import Uploader from '../components/Uploader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps, ResponseType, ResponseErrorType, ImageProps } from '../store'
import createMessage from '../components/createMessage'
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
    const beforeUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        createMessage('图片必须是JPG格式！', 'error')
      }
      return isJPG
    }
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      createMessage(`上传图片id： ${rawData.data._id}`, 'success')
    }
    const fileUploadedError = (rawData: ResponseErrorType) => {
      createMessage(rawData.error, 'error')
    }
    return {
      list,
      beforeUpload,
      onFileUploaded,
      fileUploadedError
    }
  }
})
</script>

<style>

</style>
