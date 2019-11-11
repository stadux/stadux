import { Event } from './createEvent'

export interface Store<T> {
  on<Payload = void>(
    event: Event<Payload>,
    cb: (x: T, payload: Payload) => T
  ): Store<T>
  reset(event: Event<void>): Store<T>
  watch(cb: (store: T) => void): () => void
  getState(): T
}

export const createStore = <T>(defaultState: T): Store<T> => {
  let state = defaultState
  let watchers: Array<(store: T) => void> = []

  return {
    on<Payload = void>(
      event: Event<Payload>,
      cb: (x: T, payload: Payload) => T
    ) {
      event.watch(payload => {
        state = cb(state, payload)
        watchers.forEach(v => v(state))
      })
      return this
    },

    reset<Payload = void>(event: Event<Payload>) {
      event.watch(_ => {
        state = defaultState
        watchers.forEach(v => v(state))
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
  }
}
