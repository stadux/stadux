import { noop } from './utils'

type Handler<Params, Done> = (params: Params) => Promise<Done>
type Watcher<Params> = (params: Params) => void
type DoneWatcher<Done, Params> = (args: {
  result: Done
  params: Params
}) => void
type FailWatcher<Fail, Params> = (args: { error: Fail; params: Params }) => void

export const createEffect = <Params, Done, Fail = Error>() => {
  let handler: Handler<Params, Done>
  let watcher: Watcher<Params> = noop
  let onDone: DoneWatcher<Done, Params> = noop
  let onFail: FailWatcher<Fail, Params> = noop
  return {
    use: function useEffector(effector: Handler<Params, Done>) {
      handler = effector

      const effect = (params: Params) => {
        watcher(params)
        return handler(params)
          .then(result => {
            onDone({ result, params })
            return result
          })
          .catch(error => {
            onFail({ error, params })
            return error
          })
      }

      effect.use = useEffector

      effect.watch = (cb: Watcher<Params>) => {
        watcher = cb
      }

      effect.done = {
        watch: (cb: DoneWatcher<Done, Params>) => {
          onDone = cb
        },
      }

      effect.fail = {
        watch: (cb: FailWatcher<Fail, Params>) => {
          onFail = cb
        },
      }
      return effect
    },
  }
}
