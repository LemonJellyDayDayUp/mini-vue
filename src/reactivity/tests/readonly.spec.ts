import { readonly, isReadonly, isProxy } from '../reactive'

describe('readonly', () => {

  it('happy path', () => {

    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)

    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)

    // isReadonly
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)

    // 嵌套
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isReadonly(original.bar)).toBe(false)

    // isProxy
    expect(isProxy(wrapped)).toBe(true)

  })

  it('warn', () => {

    console.warn = jest.fn()

    const user = readonly({ age: 10 })
    user.age = 11

    expect(console.warn).toHaveBeenCalled()

  })

})