<template>
  <div class="create-post-page">
    <h4>{{isEditMode ? '编辑文章' : '新建文章'}}</h4>
    <uploader action="/upload" :beforeUpload="beforeUpload" @file-uploaded="handleFileUploaded" @file-uploaded-error="fileUploadedError" :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传图片</h2>
      <template #loading>
        <div class="loading-content text-center">
          <div class="spinner-border text-primary" role="status"></div>
          <h2>正在上传...</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" width="500">
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          type="text"
          tag="textarea"
          :rules="contentRules"
          v-model="contentVal"
          placeholder="请输入文章详情"
        ></validate-input>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary">{{isEditMode ? '更新文章' : '发表文章'}}</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '../components/Uploader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps, ResponseType, ResponseErrorType, ImageProps } from '../store'
import createMessage from '../components/createMessage'
import { beforeUploadCheck } from '../helper'
export default defineComponent({
  name: 'App',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    const uploadedData = ref()
    const titleVal = ref('')
    const contentVal = ref('')
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    const store = useStore<GlobalDataProps>()
    let imageId = ''
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const fileUploadedError = (rawData: ResponseErrorType) => {
      createMessage(rawData.error, 'error')
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            pid: route.query.id,
            payload: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success')
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const beforeUpload = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是JPG/PNG格式', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过1Mb', 'error')
      }
      return passed
    }
    return {
      uploadedData,
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      beforeUpload,
      handleFileUploaded,
      fileUploadedError,
      onFormSubmit,
      isEditMode
    }
  }
})
</script>
<style>
.create-post-page {
  margin-bottom: 20px;
}
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
