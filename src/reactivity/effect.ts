import { extend } from '../shared/index'

let activeEffect
let shouldTrack

export class ReactiveEffect {

  private _fn: any

  deps = []
  active = true

  onStop?: () => void

  public scheduler: Function | undefined

  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  // 执行 fn 并把 fn 的参数返回出去
  run() {

    if (!this.active) return this._fn()
    
    // 当前依赖没被 stop 停掉
    shouldTrack = true
    activeEffect = this
    const res = this._fn()
    // 重置 shouldTrack
    shouldTrack = false

    return res

  }

  stop() {
    // 防止重复清空 提高性能
    if (this.active) {
      cleanupEffect(this)
      // 调用 stop 执行 onStop
      if (this.onStop) this.onStop()
      this.active = false
    }
  }

}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  // 清空 effect
  effect.deps.length = 0
}

const targetMap = new Map()

// 收集依赖
export function track(target, key) {

  if (!isTracking()) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffects(dep)

}

export function isTracking() {
  // 进行普通 get 操作时并不会收集到依赖 activeEffect 为 undefined
  // 只有在 fn 里进行 get 操作才能收集依赖
  // 被 stop 停掉的依赖不能再次收集
  return shouldTrack && activeEffect !== undefined
}

export function trackEffects(dep) {
  // activeEffect 已经在 dep 中
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  // 在 effect 里存储 (存了该effect的) dep
  activeEffect.deps.push(dep)
}

// 触发依赖
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    // 有 scheduler 时执行 scheduler
    if (effect.scheduler) effect.scheduler()
    else effect.run()
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

  extend(_effect, options)

  // 第一次调用 effect 时执行 fn
  _effect.run()

  // 将 runner 函数的 this 指定为对应的 ReactiveEffect 对象(_effect)
  const runner: any = _effect.run.bind(_effect)
  // 将 effect 挂载到 runner 上 (实现 stop)
  runner.effect = _effect
  // 返回 runner 函数
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}

