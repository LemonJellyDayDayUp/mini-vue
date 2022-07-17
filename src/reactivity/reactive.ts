import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function isReactive(value) {
  // 将 undefined 取两次反转换为 false
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  // 将 undefined 取两次反转换为 false
  return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}