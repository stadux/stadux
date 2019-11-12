import axios from 'axios'
import { createEffect } from '../createEffect'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

type Params = { id: string }
type Resp = { name: string }
const fetchUser = createEffect<Params, Resp>().use(({ id }) =>
  axios
    .get(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then(v => v.data)
)

beforeEach(() => jest.resetAllMocks())

test('should be able to watch done', async () => {
  mockedAxios.get.mockResolvedValue({ data: { name: 'ABC' } })
  const spy = jest.fn()
  fetchUser.done.watch(spy)
  await fetchUser({ id: '1' })
  expect(spy).toHaveBeenCalledWith({
    result: { name: 'ABC' },
    params: { id: '1' },
  })
})

test('should be able to watch fail', async () => {
  mockedAxios.get.mockRejectedValue('this is error msg')
  const spy = jest.fn()
  fetchUser.fail.watch(spy)

  await fetchUser({ id: '1' })
  expect(spy).toHaveBeenCalledWith({
    error: 'this is error msg',
    params: { id: '1' },
  })
})

test('should be able to use use to change implementation', async () => {
  fetchUser.use(() => Promise.resolve({ name: 'alice' }))
  const spy = jest.fn()
  fetchUser.done.watch(spy)
  await fetchUser({ id: '1' })
  expect(spy).toHaveBeenCalledWith({
    result: { name: 'alice' },
    params: { id: '1' },
  })
})

test('should be able to get data from effect', async () => {
  fetchUser.use(() => Promise.resolve({ name: 'alice' }))
  const user = await fetchUser({ id: '1' })
  expect(user).toEqual({ name: 'alice' })
})

test('should be able to watch effect', async () => {
  const spy = jest.fn()
  fetchUser.use(() => Promise.resolve({ name: 'alice' }))
  fetchUser.watch(spy)
  await fetchUser({ id: '1' })
  expect(spy).toBeCalled()
})
