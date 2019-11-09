import { createStore } from '../createStore'
import { createEvent } from '../createEvent'

test('should be able to create store', () => {
  const spy = jest.fn()
  const increment = createEvent('increment')
  const decrement = createEvent('decrement')
  const resetCounter = createEvent('reset counter')
  const counter = createStore(0)
    .on(increment, state => state + 1)
    .on(decrement, state => state - 1)
    .reset(resetCounter)
  counter.watch(spy)

  increment()
  decrement()
  decrement()
  resetCounter()

  expect(spy).toHaveBeenNthCalledWith(1, 1)
  expect(spy).toHaveBeenNthCalledWith(2, 0)
  expect(spy).toHaveBeenNthCalledWith(3, -1)
  expect(spy).toHaveBeenNthCalledWith(4, 0)
})

test('should be able to unwatch', () => {
  const spy = jest.fn()
  const increment = createEvent('increment')
  const counter = createStore(0).on(increment, state => state + 1)
  const unwatch = counter.watch(spy)

  increment()
  unwatch()
  increment()

  expect(spy).toHaveBeenNthCalledWith(1, 1)
  expect(spy).not.toHaveBeenNthCalledWith(2, 2)
})
