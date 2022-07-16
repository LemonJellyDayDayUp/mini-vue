import { track, trigger } from './effect'

export function reactive(rew) {
  return new Proxy (rew, {
  
    get(target, key) {
      const res = Reflect.get(target, key)
      // 收集依赖
      track(target, key)
      return res
    },

    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      // 触发依赖
      trigger(target, key)
      return res
    }

  })
}

export function readonly(rew) {
  return new Proxy (rew, {

    get(target, key) {
      const res = Reflect.get(target, key)
      return res
    },

    set(target, key) {
      // readonly 不可以被 set
      console.warn(
        `key: "${String(key)}" set 失败, 因为 target 是 readonly 类型`,
        target
      )
      return true
    }
  })
}