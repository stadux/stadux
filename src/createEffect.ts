import { noop } from './utils'
import { createEvent, Event } from './createEvent'

type Handler<Params, Done> = (params: Params) => Promise<Done>
type Watcher<Params> = (params: Params) => void

export interface Effect<Params, Done, Fail> {
  (params: Params): Promise<Done>
  watch(cb: Watcher<Params>): void
  start: Event<{ params: Params }>
  done: Event<{ result: Done; params: Params }>
  fail: Event<{ error: Fail; params: Params }>
  adopt(handler: Handler<Params, Done>): Effect<Params, Done, Fail>
}

export const createEffect = <Params = void, Done = void, Fail = Error>(
  effector: Handler<Params, Done>
) => {
  let handler: Handler<Params, Done> = effector
  let watcher: Watcher<Params> = noop

  const effect: Effect<Params, Done, Fail> = (params: Params) => {
    watcher(params)
    effect.start({ params })
    return handler(params)
      .then(result => {
        effect.done({ result, params })
        return result
      })
      .catch(error => {
        effect.fail({ error, params })
        return Promise.reject(error)
      })
  }
  effect.watch = (cb: Watcher<Params>) => {
    watcher = cb
  }
  effect.start = createEvent<{ params: Params }>()
  effect.done = createEvent<{ result: Done; params: Params }>()
  effect.fail = createEvent<{ error: Fail; params: Params }>()
  effect.adopt = (effector: Handler<Params, Done>) => {
    handler = effector
    return effect
  }

  return effect
}
