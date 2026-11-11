import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import * as api from '@/api'
import { ApiError } from '@/api/errors'
import { routes } from '@/router'
import PostsView from '../PostsView.vue'
import UserDetailView from '../UserDetailView.vue'
import UsersView from '../UsersView.vue'

vi.mock('@/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api')>()
  return {
    ...actual,
    getUsers: vi.fn(),
    getUserById: vi.fn(),
    getPosts: vi.fn(),
    getPostsByUser: vi.fn(),
  }
})

const ada = { id: 1, name: 'Ada Lovelace', username: 'ada', email: 'ada@example.com' }

function mountWithRouter(component: object, props: Record<string, unknown> = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(component, { props, global: { plugins: [router] } })
}

describe('UsersView', () => {
  beforeEach(() => vi.mocked(api.getUsers).mockReset())

  it('shows a loading state, then the users with links', async () => {
    vi.mocked(api.getUsers).mockResolvedValue([ada])
    const wrapper = mountWithRouter(UsersView)
    expect(wrapper.text()).toContain('Loading')

    await flushPromises()
    expect(wrapper.text()).toContain('Ada Lovelace')
    expect(wrapper.text()).toContain('ada@example.com')
    expect(wrapper.find('a').attributes('href')).toBe('/users/1')
  })

  it('shows an empty state', async () => {
    vi.mocked(api.getUsers).mockResolvedValue([])
    const wrapper = mountWithRouter(UsersView)
    await flushPromises()
    expect(wrapper.text()).toContain('No users found.')
  })

  it('shows the error and retries on click', async () => {
    vi.mocked(api.getUsers)
      .mockRejectedValueOnce(new ApiError('Could not reach the server'))
      .mockResolvedValueOnce([ada])
    const wrapper = mountWithRouter(UsersView)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Could not reach the server')
    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(api.getUsers).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Ada Lovelace')
  })
})

describe('UserDetailView', () => {
  it('loads the user and their posts', async () => {
    vi.mocked(api.getUserById).mockResolvedValue({
      ...ada,
      company: { name: 'Analytical', catchPhrase: '', bs: '' },
    })
    vi.mocked(api.getPostsByUser).mockResolvedValue([
      { id: 10, userId: 1, title: 'Notes', body: '' },
    ])

    const wrapper = mountWithRouter(UserDetailView, { id: 1 })
    await flushPromises()

    expect(api.getUserById).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(api.getPostsByUser).toHaveBeenCalledWith(1, expect.anything())
    expect(wrapper.get('h1').text()).toBe('Ada Lovelace')
    expect(wrapper.text()).toContain('Analytical')
    expect(wrapper.text()).toContain('Posts (1)')
  })

  it('shows "not found" errors', async () => {
    vi.mocked(api.getUserById).mockRejectedValue(
      new ApiError('Resource not found', { status: 404 }),
    )
    vi.mocked(api.getPostsByUser).mockResolvedValue([])

    const wrapper = mountWithRouter(UserDetailView, { id: 999 })
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Resource not found')
  })
})

describe('PostsView', () => {
  it('renders post titles', async () => {
    vi.mocked(api.getPosts).mockResolvedValue([{ id: 1, userId: 1, title: 'Hello', body: '' }])
    const wrapper = mountWithRouter(PostsView)
    await flushPromises()
    expect(wrapper.text()).toContain('Hello')
  })
})
