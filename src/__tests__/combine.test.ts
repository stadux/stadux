import { createStore } from '../createStore'
import { combine } from '../combine'
import { createEvent } from '../createEvent'

test('should be able to return default combined state', () => {
  const storeA = createStore('stateA')
  const storeB = createStore('stateB')
  const storeC = createStore('stateC')

  const combinedStore = combine({ a: storeA, b: storeB, c: storeC })

  expect(combinedStore.getState()).toEqual({
    a: 'stateA',
    b: 'stateB',
    c: 'stateC',
  })
})

test('should be able to reflect state changes of child store', () => {
  const updateStoreBEvent = createEvent<{ x: string }>()
  const storeA = createStore('stateA')
  const storeB = createStore({ x: 'stateB' }).on(updateStoreBEvent, (x, p) => p)

  const combinedStore = combine({ a: storeA, b: storeB })
  expect(combinedStore.getState()).toEqual({ a: 'stateA', b: { x: 'stateB' } })

  updateStoreBEvent({ x: 'updatedB' })
  expect(combinedStore.getState()).toEqual({
    a: 'stateA',
    b: { x: 'updatedB' },
  })
})

test('combined store should not affect each other', () => {
  const updateStoreAEvent = createEvent<string>()
  const storeA = createStore('stateA').on(updateStoreAEvent, (x, p) => p)

  const updateStoreBEvent = createEvent<{ x: string }>()
  const storeB = createStore({ x: 'stateB' }).on(updateStoreBEvent, (x, p) => p)

  const combinedStoreA = combine({ a: storeA })
  expect(combinedStoreA.getState()).toEqual({ a: 'stateA' })

  const combinedStoreB = combine({ b: storeB })
  expect(combinedStoreB.getState()).toEqual({ b: { x: 'stateB' } })

  updateStoreBEvent({ x: 'updatedB' })
  expect(combinedStoreB.getState()).toEqual({ b: { x: 'updatedB' } })
  expect(combinedStoreA.getState()).toEqual({ a: 'stateA' })
})
