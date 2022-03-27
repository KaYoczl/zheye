<template>
  <div class="file-upload">
    <button @click="triggerUpload" class="btn btn-primary">
      <span v-if="fileStatus === 'loading'">正在上传...</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else>点击上传</span>
    </button>
    <input @change="handleFileChange" ref="fileInput" type="file" class="file-input d-none">
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    // @change触发的方法
    const handleFileChange = (e: Event) => {
      // 为了在currentTarget上拿到files属性
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        fileStatus.value = 'loading'
        // currentTarget.files是类数组对象，转换成数组
        const files = Array.from(currentTarget.files)
        const formData = new FormData()
        // formData.append的key可自定义，value拿数组第一项，因为只能上传一个文件
        formData.append(files[0].name, files[0])
        // 第三个参数可以添加一个额外的header，二进制文件要改成multipart/form-data
        axios.post(props.action, formData, {
          headers: {
            'Context-type': 'multipart/form-data'
          }
        }).then(res => {
          console.log(res.data)
          fileStatus.value = 'success'
        }).catch(() => {
          fileStatus.value = 'error'
        // 不管是成功还是失败都会触发.finally
        }).finally(() => {
          // 无论成功还是失败，input框的内容都要清空
          if (fileInput.value) {
            // fileInput.value是一个DOM节点，节点上还有一个value值，对应输入框的值
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      fileStatus,
      triggerUpload,
      handleFileChange
    }
  }
})
</script>
