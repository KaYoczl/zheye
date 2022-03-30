<template>
  <div class="container">
    <div class="profile">
      <img :src="imgUrl" :alt="author.nickName" class="img-circle image">
      <div class="nickName">{{author.nickName}}</div>
      <div class="description">{{author.description}}</div>
    </div>
    <div class="time">{{time}}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { UserProps } from '../store'
export default defineComponent({
  props: {
    author: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup (props) {
    console.log(props.author)
    const imgUrl = computed(() => {
      const { avatar } = props.author
      return avatar && avatar.url
    })
    const time = new Date()
    return {
      time,
      imgUrl
    }
  }
})
</script>
<style scoped>
.container {
  width: 100%;
  height: 84px;
  display: flex;
  justify-content: space-between;
  line-height: 84px;
}
.profile {
  width: 60%;
  height: 100%;
  position: relative;
  font-size: 18px;
}
.image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: contain;
}
.nickName {
  line-height: initial; /* 不继承祖先元素也就是container元素的line-height属性 */
  position: absolute;
  top: 16px;
  margin-left: 66px;
  font-weight: 600;
  color: #444;
}
.description {
  line-height: initial; /* 不继承祖先元素也就是container元素的line-height属性 */
  position: absolute;
  bottom: 16px;
  margin-left: 66px;
  color: #6c757d;
}
.time {
  font-style: italic;
  color: #6c757d;
}
</style>
