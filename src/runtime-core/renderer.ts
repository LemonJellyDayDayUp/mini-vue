import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

// 处理组件
function patch(vnode, container) {

  // 判断 vnode 是否是 element
  // processElement()

  processComponent(vnode, container)

}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  // subTree 虚拟节点树
  const subTree = instance.render()

  // vnode -> petch
  // vnode -> element -> mountElement
  patch(subTree, container)
}