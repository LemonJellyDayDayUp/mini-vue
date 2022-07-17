import { reactive } from '../reactive'
import { effect, stop } from '../effect'

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

  it("runner", () => {

    let foo = 10;

    // effect 返回 runner 函数
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)

    // 调用 runner 函数执行 fn 并且返回 fn 的返回值
    const res = runner()
    expect(foo).toBe(12)
    expect(res).toBe('foo')

  })

  it('scheduler', () => {

    let run: any
    const scheduler = jest.fn(() => { run = runner });

    let dummy
    const obj = reactive({ foo: 0 })

    const runner = effect(
      () => { dummy = obj.foo },
      { scheduler }
    )
    
    // 第一次执行 effect 时 执行 fn 不执行 scheduler
    expect(dummy).toBe(0)
    expect(scheduler).not.toHaveBeenCalled()

    // 响应式对象更新时 执行 scheduler 不执行 fn
    obj.foo++
    expect(dummy).toBe(0)
    expect(scheduler).toHaveBeenCalledTimes(1)

    // 执行 runner 时 执行 fn
    run()
    expect(dummy).toBe(1)

  })

  it('stop', () => {

    let dummy
    const obj = reactive({ prop: 0 })

    const runner = effect(() => {
      dummy = obj.prop
    })

    obj.prop = 1
    expect(dummy).toBe(1)

    // 调用 stop 后响应式对象更新将不会触发该依赖
    stop(runner)
    obj.prop ++
    expect(dummy).toBe(1)

    // 优化前 obj.prop++ 测试会失败
    // obj.prop++ 相当于 obj.prop = obj.prop + 1
    // 触发 get 操作会把当前的 activeEffect 再收集一遍

    // 再调用 runner 会重新触发该依赖
    runner()
    expect(dummy).toBe(2)

  })

  it('onStop', () => {

    let dummy
    const obj = reactive({ foo: 0 })
    const onStop = jest.fn()

    const runner = effect(
      () => { dummy = obj.foo },
      { onStop }
    )

    // 执行 stop 后调用 onStop
    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)

  })

})