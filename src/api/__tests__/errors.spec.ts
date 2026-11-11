import { AxiosError, CanceledError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError, toApiError } from '../errors'

function axiosErrorWithStatus(status: number): AxiosError {
  const response = { status, data: {}, headers: {}, config: {}, statusText: '' } as AxiosResponse
  return new AxiosError('boom', 'ERR_BAD_RESPONSE', undefined, undefined, response)
}

describe('toApiError', () => {
  it('maps 404 responses to a friendly message and keeps the status', () => {
    const error = toApiError(axiosErrorWithStatus(404))
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(404)
    expect(error.message).toBe('Resource not found')
  })

  it('maps other HTTP errors to a generic message with the status', () => {
    const error = toApiError(axiosErrorWithStatus(500))
    expect(error.status).toBe(500)
    expect(error.message).toBe('Request failed with status 500')
  })

  it('maps timeouts and network failures', () => {
    expect(toApiError(new AxiosError('t', 'ECONNABORTED')).message).toMatch(/too long/)
    expect(toApiError(new AxiosError('n', 'ERR_NETWORK')).message).toBe(
      'Could not reach the server',
    )
  })

  it('flags cancelled requests', () => {
    expect(toApiError(new CanceledError()).cancelled).toBe(true)
  })

  it('wraps unknown values and keeps the original as cause', () => {
    const original = new TypeError('x')
    const error = toApiError(original)
    expect(error.message).toBe('Unexpected error')
    expect(error.cause).toBe(original)
  })

  it('returns ApiError instances unchanged', () => {
    const error = new ApiError('already mapped')
    expect(toApiError(error)).toBe(error)
  })
})
