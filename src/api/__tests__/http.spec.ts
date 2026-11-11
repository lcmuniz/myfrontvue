import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError } from '../errors'
import { createHttpClient, DEFAULT_API_URL } from '../http'

/** Fake adapter: lets us test the real axios instance without touching the network. */
function adapter(status: number, data: unknown = {}): AxiosAdapter {
  return async (config: InternalAxiosRequestConfig) => {
    const response = { status, data, headers: {}, config, statusText: '' }
    const validate = config.validateStatus ?? ((s: number) => s >= 200 && s < 300)
    if (validate(status)) return response
    const { AxiosError } = await import('axios')
    throw new AxiosError('fail', 'ERR_BAD_RESPONSE', config, undefined, response)
  }
}

describe('createHttpClient', () => {
  it('uses the given base URL and a request timeout', () => {
    const client = createHttpClient('https://api.example.test')
    expect(client.defaults.baseURL).toBe('https://api.example.test')
    expect(client.defaults.timeout).toBe(10_000)
  })

  it('falls back to the public demo API', () => {
    expect(createHttpClient().defaults.baseURL).toBe(
      import.meta.env.VITE_API_URL || DEFAULT_API_URL,
    )
  })

  it('returns data on success', async () => {
    const client = createHttpClient('https://api.example.test')
    client.defaults.adapter = adapter(200, [{ id: 1 }])
    await expect(client.get('/users')).resolves.toMatchObject({ data: [{ id: 1 }] })
  })

  it('rejects with ApiError on HTTP errors', async () => {
    const client = createHttpClient('https://api.example.test')
    client.defaults.adapter = adapter(404)
    const error = await client.get('/users/999').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 404, message: 'Resource not found' })
  })
})
