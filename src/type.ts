export type Callback = () => void
export interface Event<Payload = void> {
  (v: Payload): void
  eventName: string
  watch: (cb: (v: Payload) => void) => () => void
  triggers: Array<(v: Payload) => void>
  currentPayload?: Payload
}
