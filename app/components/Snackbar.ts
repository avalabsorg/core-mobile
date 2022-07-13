const LENGTH_SHORT = 2000
const LENGTH_LONG = 5000
const LENGTH_INFINITE = Number.MAX_SAFE_INTEGER

// provided by `global`. See ContextApp.tsx and index.d.ts at the root of the project.
export function ShowSnackBar(text: string, long = false) {
  return global?.toast?.show(text, {
    type: 'normal',
    placement: 'bottom',
    duration: long ? LENGTH_LONG : LENGTH_SHORT,
    animationType: 'slide-in'
  })
}

export function showSnackBarCustom(
  component: JSX.Element,
  duration: 'short' | 'long' | 'infinite',
  placement: 'top' | 'bottom' = 'top'
) {
  return global?.toast?.show(component, {
    type: 'transaction',
    placement: placement,
    animationType: 'slide-in',

    duration:
      duration === 'infinite'
        ? LENGTH_INFINITE
        : duration === 'long'
        ? LENGTH_LONG
        : LENGTH_SHORT
  })
}

export function updateSnackBarCustom(
  id: string,
  component: JSX.Element,
  long = true
) {
  global?.toast?.update(id, component, {
    duration: long ? LENGTH_LONG : LENGTH_SHORT
  })
}
