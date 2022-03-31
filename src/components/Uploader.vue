<template>
  <div class="file-upload">
    <div v-bind="$attrs" class="file-upload-container" @click="triggerUpload">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input @change="handleFileChange" ref="fileInput" type="file" class="file-input d-none">
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
  // 作用是父组件传来的class作用在file-upload-container上，而不是根元素file-upload上
  inheritAttrs: false,
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    },
    uploaded: {
      type: Object
    }
  },
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
    const uploadedData = ref(props.uploaded)
    console.log(props.uploaded)
    watch(() => props.uploaded, (newValue) => {
      if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
      }
    })
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
        // currentTarget.files是类数组对象，转换成数组
        const files = Array.from(currentTarget.files)
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        // formData.append的key可自定义，value拿数组第一项，因为只能上传一个文件
        formData.append(files[0].name, files[0])
        // 第三个参数可以添加一个额外的header，二进制文件要改成multipart/form-data
        axios.post(props.action, formData, {
          headers: {
            'Context-type': 'multipart/form-data'
          }
        }).then(res => {
          uploadedData.value = res.data
          context.emit('file-uploaded', res.data)
          fileStatus.value = 'success'
        }).catch((error) => {
          fileStatus.value = 'error'
          context.emit('file-uploaded-error', { error })
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
      handleFileChange,
      uploadedData
    }
  }
})
</script>
