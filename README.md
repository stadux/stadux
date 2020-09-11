# stadux

<p align="center">
  <a href="https://codeclimate.com/github/stadux/stadux/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/a39de525b9dcfcb2e755/maintainability" />
  </a>

  <a href="https://circleci.com/gh/stadux/stadux">
    <img src="https://circleci.com/gh/stadux/stadux.svg?style=svg" />
  </a>

  <a href="https://codecov.io/gh/stadux/stadux">
    <img src="https://codecov.io/gh/stadux/stadux/branch/master/graph/badge.svg" />
  </a>

  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/stadux">
</p>

A state manager that is highly inspired by [Effector](https://github.com/zerobias/effector) but much simpler with only about 100 lines of code.


## Introduction

Stadux is an multi-store state manager for Javascript apps **(React/React Native/Vue/Node.js)**, that allows you to manage data in complex applications without the risk of inflating the monolithic central store, with clear control flow, good type support and high capacity API. Stadux supports **TypeScript** _out of the box_.

### Core concepts

- **Event** Event is a function that describe what happened.
- **Store** Store is the unit of state that you want to manage and will update according to the event.
- **Effect** Side effect is hard to manage and effect will fire event when side effect start, done or failed.

That's all the connect that you need to know!

## API

### createEvent
```typescript
// create event with `string` type of payload
const sayHi = createEvent<string>()

// you can watch for the event to happen
sayHi.watch(console.log)

// fire the event with payload
sayHi('Peter') // Peter
sayHi('Drew')  // Drew
```

### createStore
```typescript
const increment = createEvent('increment')
const decrement = createEvent('decrement')
const resetCounter = createEvent('reset counter')

const counter = createStore(0) // create store with init value
  .on(increment, state => state + 1) // update when event fired
  .on(decrement, state => state - 1)
  .reset(resetCounter) // reset when event fired

counter.watch(console.log) // you can also watch to the store

increment()    // State: 1
decrement()    // State: 0
decrement()    // State: -1
resetCounter() // State: 0
increment()    // State: 1

// use `gestState` to get value in store
const count = counter.getState()
// you can also use select to map value in the store
const greaterThan10 = counter.select(v => v > 10)
```

### createEffect
```typescript
type Todo = { name: string }
// build a effect to fetch API
const fetchTodoList = createEffect<
  { token: string }, // params of effect function
  Todo[] // response
>(({ token }) => axios.get(`https://todos?token=${token}`).then(v => v.data))

const todoList = createStore<{
  todos: Todo[]
  loading: boolean
  error: string
}>({ todos: [], loading: false, error: '' })
  .on(fetchTodoList.start, (state, payload) => ({
    ...state,
    loading: true,
    error: '',
  }))
  .on(fetchTodoList.done, (state, { result }) => ({
    ...state,
    todos: result,
    loading: false,
    error: '',
  }))
  .on(fetchTodoList.fail, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message,
  }))

// after fetchTodoList been called, it will fire `fetchTodoList.start`
// when fetch todo list succeed, it will fire `fetchTodoList.done` event with respond value
// when fetch todo list failed, it will fire `fetchTodoList.fail` event with error reason
fetchTodoList({ token: '' })
```
