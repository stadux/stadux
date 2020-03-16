import { createStore, Store } from './createStore'
import { createEvent } from './createEvent'

export const combine = <T, K extends keyof T>(
  combined: Record<K, Store<T[K]>>
) => {
  const keys = Object.keys(combined) as K[]
  const stores = Object.values(combined) as Store<T[K]>[]

  const defaultState = keys.reduce(
    (acc, k) => ({ ...acc, [k]: combined[k].getState() }),
    {} as T
  )
  const store = createStore<T>(defaultState)

  const partialEvent = createEvent<[K, T[K]]>()
  store.on(partialEvent, (pre, [k, v]) => ({ ...pre, [k]: v }))
  stores.forEach((v, i) => v.watch(state => partialEvent([keys[i], state])))
  return store
}
