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
  increment()

  expect(spy).toHaveBeenNthCalledWith(1, 1)
  expect(spy).toHaveBeenNthCalledWith(2, 0)
  expect(spy).toHaveBeenNthCalledWith(3, -1)
  expect(spy).toHaveBeenNthCalledWith(4, 0)
  expect(spy).toHaveBeenNthCalledWith(5, 1)
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

test('should be able to receive params from event', () => {
  const spy = jest.fn()
  type Todo = { name: string }
  const addTodo = createEvent<Todo>('add todo')
  const todoList = createStore<Todo[]>([]).on(addTodo, (state, newTodo) =>
    state.concat(newTodo)
  )
  todoList.watch(spy)

  addTodo({ name: 'shopping' })
  addTodo({ name: 'fishing' })

  expect(spy).toHaveBeenNthCalledWith(1, [{ name: 'shopping' }])
  expect(spy).toHaveBeenNthCalledWith(2, [
    { name: 'shopping' },
    { name: 'fishing' },
  ])
})

test('should be able to get state', () => {
  type Todo = { name: string }
  const addTodo = createEvent<Todo>('add todo')
  const todoList = createStore<Todo[]>([]).on(addTodo, (state, newTodo) =>
    state.concat(newTodo)
  )

  addTodo({ name: 'shopping' })
  expect(todoList.getState()).toEqual([{ name: 'shopping' }])

  addTodo({ name: 'fishing' })
  expect(todoList.getState()).toEqual([
    { name: 'shopping' },
    { name: 'fishing' },
  ])
})

test('should be able to select state', () => {
  type Todo = { name: string }
  const addTodo = createEvent<Todo>('add todo')
  const todoList = createStore<Todo[]>([]).on(addTodo, (state, newTodo) =>
    state.concat(newTodo)
  )
  const selectedStore = todoList.select(todos =>
    todos.map(v => v.name).join(', ')
  )

  addTodo({ name: 'shopping' })
  expect(selectedStore.getState()).toEqual('shopping')

  addTodo({ name: 'fishing' })
  expect(selectedStore.getState()).toEqual('shopping, fishing')
})

test('should be able to select state and watch changes', () => {
  type Todo = { name: string }
  const addTodo = createEvent<Todo>('add todo')
  const todoList = createStore<Todo[]>([]).on(addTodo, (state, newTodo) =>
    state.concat(newTodo)
  )
  const selectedStore = todoList.select(todos =>
    todos.map(v => v.name).join(', ')
  )

  const spy = jest.fn()
  const unwatch = selectedStore.watch(spy)
  addTodo({ name: 'shopping' })
  expect(spy).toHaveBeenLastCalledWith('shopping')

  addTodo({ name: 'fishing' })
  expect(spy).toHaveBeenLastCalledWith('shopping, fishing')

  unwatch()
  addTodo({ name: 'sleeping' })
  expect(spy).not.toHaveBeenLastCalledWith('shopping, fishing, sleeping')
})
