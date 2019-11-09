import { Subject } from 'rxjs'
import { Event } from './type'

export const createStore = <T>(defaultState: T) => {
  let state = defaultState
  const subject = new Subject<T>()

  return {
    on(event: Event, cb: (x: T) => T) {
      event.triggers.push(() => {
        state = cb(state)
        subject.next(state)
      })
      return this
    },

    reset(event: Event) {
      event.triggers = [
        () => {
          state = defaultState
          subject.next(state)
        },
      ]
      return this
    },

    watch(cb: (store: T) => void) {
      const subscription = subject.subscribe(cb)
      return () => subscription.unsubscribe()
    },
  }
}
