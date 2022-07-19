import { createVNode } from './vnode'
import { render } from './renderer'

export function createApp(rootComponent) {
  return {

    // rootContainer: <div id="app"></div>
    mount(rootContainer) {
      // component -> vnode
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    }

  }
}