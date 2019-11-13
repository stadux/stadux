import { Event } from './createEvent'

export interface BaseStore<T> {
  getState(): T
  watch(cb: (store: T) => void): () => void
}

export interface Store<T> extends BaseStore<T> {
  on<Payload = void>(
    event: Event<Payload>,
    cb: (x: T, payload: Payload) => T
  ): Store<T>
  reset(event: Event<void>): Store<T>
  select<U>(project: (state: T) => U): BaseStore<U>
}

export const createStore = <T>(defaultState: T): Store<T> => {
  let state = defaultState
  let watchers: Array<(store: T) => void> = []
  const setState = (newState: T) => {
    state = newState
    watchers.forEach(cb => cb(newState))
  }

  return {
    on<Payload = void>(
      event: Event<Payload>,
      cb: (x: T, payload: Payload) => T
    ) {
      event.watch(payload => {
        setState(cb(state, payload))
      })
      return this
    },

    reset<Payload = void>(event: Event<Payload>) {
      event.watch(_ => {
        setState(defaultState)
      })
      return this
    },

    watch(cb: (store: T) => void) {
      watchers.push(cb)
      return () => {
        watchers = watchers.filter(v => v !== cb)
      }
    },

    getState() {
      return state
    },

    select<U>(project: (state: T) => U) {
      return {
        watch: (cb: (store: U) => void) => {
          const selectCallback = (v: T) => cb(project(v))
          watchers.push(selectCallback)
          return () => {
            watchers = watchers.filter(v => v !== selectCallback)
          }
        },
        getState: () => project(this.getState()),
      }
    },
  }
}
