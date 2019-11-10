import { noop } from './utils'

export interface Event<Payload = void> {
  (v: Payload): void
  eventName: string
  watch: (cb: (v: Payload) => void) => () => void
  triggers: Array<(v: Payload) => void>
  currentPayload?: Payload
}

export const createEvent = <Payload = void>(name?: string): Event<Payload> => {
  let watchers: Array<(v: Payload) => void> = []
  const instance: Event<Payload> = (v: Payload) => {
    instance.currentPayload = v
    watchers.forEach(cb => cb(v))
    instance.triggers.forEach(cb => cb(v))
  }
  instance.eventName = name || ''
  instance.triggers = [] as Array<(v: Payload) => void>
  instance.watch = cb => {
    watchers.push(cb)
    return () => {
      watchers = watchers.filter(v => v !== cb)
    }
  }
  return instance
}
