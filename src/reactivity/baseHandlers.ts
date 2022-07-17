import { track, trigger } from "./effect"
import { readonly } from "./reactive"
import { ReactiveFlags } from "./reactive";

// 避免每个对象初始化时都获取一个新的 get / set
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadOnly = false) {
  return function get(target, key) {

    if (key === ReactiveFlags.IS_REACTIVE) return !isReadOnly
    else if (key === ReactiveFlags.IS_READONLY) return readonly

    const res = Reflect.get(target, key)
    // 收集依赖
    if (!isReadOnly) track(target, key)
    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // readonly 不可以被 set
    console.warn(
      `key: "${String(key)}" set 失败, 因为 target 是 readonly 类型`,
      target
    )
    return true
  }
}