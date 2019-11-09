import { createEvent } from '../createEvent'

test('should be able to create a event', () => {
  expect(createEvent()).not.toThrow()
})

test('should call watcher when event invoked', () => {
  const spy = jest.fn()
  const sayHi = createEvent<string>()
  sayHi.watch(spy)

  sayHi('Peter')
  sayHi('Drew')

  expect(spy).toHaveBeenNthCalledWith(1, 'Peter')
  expect(spy).toHaveBeenNthCalledWith(2, 'Drew')
})

test('should be able to create event without payload', () => {
  const spy = jest.fn()
  const inc = createEvent()
  inc.watch(spy)

  inc()

  expect(spy).toBeCalledTimes(1)
})

test('should be able to unwatch', () => {
  const spy = jest.fn()
  const sayHi = createEvent<string>()
  const unwatch = sayHi.watch(spy)

  sayHi('Peter')
  unwatch()
  sayHi('Drew')

  expect(spy).toHaveBeenNthCalledWith(1, 'Peter')
  expect(spy).not.toHaveBeenNthCalledWith(2, 'Drew')
})
