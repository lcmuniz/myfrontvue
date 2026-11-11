import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '../index'

const router = createRouter({ history: createMemoryHistory(), routes })

describe('router', () => {
  it('passes numeric ids to the user page as a number prop', () => {
    const route = router.resolve('/users/5')
    expect(route.name).toBe('user')
    const props = route.matched[0]!.props.default as (r: typeof route) => Record<string, unknown>
    expect(props(route)).toEqual({ id: 5 })
  })

  it('sends non-numeric ids and unknown paths to the 404 page', () => {
    expect(router.resolve('/users/abc').name).toBe('not-found')
    expect(router.resolve('/nope').name).toBe('not-found')
  })
})
