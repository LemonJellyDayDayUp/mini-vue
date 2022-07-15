import { reactive } from '../reactive'
import { effect } from '../effect'

describe('effect', () => {

  it('happy path', () => {

    // 响应式对象
    const user = reactive({
      age: 10
    })

    let nextAge
    // 建立依赖
    effect(() => {
      nextAge = user.age + 1
    })

    // 依赖建立时触发一次
    expect(nextAge).toBe(11)

    // 响应式对象更新
    user.age++
    expect(nextAge).toBe(12)

  })

})