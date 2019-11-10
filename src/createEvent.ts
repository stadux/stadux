import { noop } from './utils'

export interface Event<Payload = void> {
  (v: Payload): void
  eventName: string
  watch: (cb: (v: Payload) => void) => () => void
  triggers: Array<(v: Payload) => void>
  currentPayload?: Payload
}

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
