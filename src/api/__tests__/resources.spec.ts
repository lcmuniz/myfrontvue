import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '../http'
import { getPosts, getPostsByUser } from '../posts.api'
import { createUser, getUserById, getUsers } from '../users.api'

describe('resource modules', () => {
  beforeEach(() => {
    vi.spyOn(http, 'get').mockResolvedValue({ data: 'payload' })
    vi.spyOn(http, 'post').mockResolvedValue({ data: 'created' })
  })

  it('getUsers calls /users and unwraps data', async () => {
    const signal = new AbortController().signal
    await expect(getUsers({ signal })).resolves.toBe('payload')
    expect(http.get).toHaveBeenCalledWith('/users', { signal })
  })

  it('getUserById builds the URL from the id', async () => {
    await getUserById(7)
    expect(http.get).toHaveBeenCalledWith('/users/7', { signal: undefined })
  })

  it('createUser posts the payload', async () => {
    const payload = { name: 'Ada', username: 'ada', email: 'ada@example.com' }
    await expect(createUser(payload)).resolves.toBe('created')
    expect(http.post).toHaveBeenCalledWith('/users', payload)
  })

  it('getPosts calls /posts', async () => {
    await getPosts()
    expect(http.get).toHaveBeenCalledWith('/posts', { signal: undefined })
  })

  it('getPostsByUser filters by userId via query params', async () => {
    await getPostsByUser(3)
    expect(http.get).toHaveBeenCalledWith('/posts', { params: { userId: 3 }, signal: undefined })
  })
})
