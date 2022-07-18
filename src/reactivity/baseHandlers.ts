import { track, trigger } from './effect'
import { reactive, readonly } from './reactive'
import { ReactiveFlags } from './reactive'
import { isObject } from '../shared'

// 避免每个对象初始化时都获取一个新的 get / set
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowGet = createGetter(true, true)
const readonlySet = createReadonlySetter()

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {

    if (key === ReactiveFlags.IS_REACTIVE) return !isReadonly
    else if (key === ReactiveFlags.IS_READONLY) return isReadonly

    const res = Reflect.get(target, key)

    if (isShallow) return res

    // 嵌套
    if (isObject(res)) return isReadonly ? readonly(res) : reactive(res);

    // 收集依赖
    if (!isReadonly) track(target, key)
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

function createReadonlySetter() {
  return function set(target, key) {
    // readonly 不可以被 set
    console.warn(
      `key: "${String(key)}" set 失败, 因为 target 是 readonly 类型`,
      target
    )
    return true
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet
}

export const shallowReadonlyHandlers = {
  get: shallowGet,
  set: readonlySet
}