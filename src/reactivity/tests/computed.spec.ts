import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {

  it('happy path', () => {

    const user = reactive({ age: 1 })
    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)

  })

  it("should compute lazily", () => {

    const value = reactive({ foo: 1 })
    
    const getter = jest.fn(() => {
      return value.foo
    })

    const cValue = computed(getter)

    // lazy
    // 没有调用 cValue.value 时不会调用 getter
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    // 依赖的对象没有改变时调用 cValue.value 也不会调用 getter
    cValue.value // get
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    // 依赖的对象改变后没有调用 cValue.value 也不会调用 getter
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    // 依赖的对象改变后调用 cValue.value 会调用 getter
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
    
  })


})