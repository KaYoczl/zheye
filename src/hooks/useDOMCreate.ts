import { onUnmounted } from 'vue'

function useDOMCreate (nodeId: string) {
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    // 如果不在组件卸载的时候清除节点，那么每次发请求都会生成一个id为nodeId的div，越来越多
    document.body.removeChild(node)
  })
}

export default useDOMCreate
