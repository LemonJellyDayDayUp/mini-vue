export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type
  }
  return component
}

export function setupComponent(instance) {

  // initProps()
  // initSlots()

  setupStatefulComponent(instance)

}

function setupStatefulComponent(instance) {
  const Component = instance.type
  const { setup } = Component
  if (setup) {
    // 返回 function 或 object
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {

  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  // function

  finishComponentSetup(instance)

}

function finishComponentSetup(instance) {
  const Component = instance.type
  instance.render = Component.render
}

