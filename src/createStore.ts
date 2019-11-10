import { Subject } from 'rxjs'
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
  const subject = new Subject<T>()

  return {
    on<Payload = void>(
      event: Event<Payload>,
      cb: (x: T, payload: Payload) => T
    ) {
      event.watch(payload => {
        state = cb(state, payload)
        subject.next(state)
      })
      return this
    },

    reset<Payload = void>(event: Event<Payload>) {
      event.watch(_ => {
        state = defaultState
        subject.next(state)
      })
      return this
    },

    watch(cb: (store: T) => void) {
      const subscription = subject.subscribe(cb)
      return () => subscription.unsubscribe()
    },

    getState() {
      return state
    },
  }
}
