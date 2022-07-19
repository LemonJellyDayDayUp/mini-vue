import { h } from '../../lib/mini-vue.esm.js'

export const App = {

  // 必须写 render
  render() {
    // ui
    return h('div', 'hi, ' + this.msg)
  },

  setup() {
    // composition api
    return {
      msg: 'mini-vue'
    }
  }

}