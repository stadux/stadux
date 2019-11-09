import { noop } from './utils'
import { Event } from './type'

export const createEvent = <Payload = void>(name?: string): Event<Payload> => {
  let watcher: (v: Payload) => void = noop
  const instance: Event<Payload> = (v: Payload) => {
    instance.currentPayload = v
    watcher(v)
    instance.triggers.forEach(cb => cb(v))
  }
  instance.eventName = name || ''
  instance.triggers = [] as Array<(v: Payload) => void>
  instance.watch = cb => {
    watcher = cb
    return () => {
      watcher = noop
    }
  }
  return instance
}
