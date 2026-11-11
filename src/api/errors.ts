import axios from 'axios'

/** Error type exposed by the API layer, so views never depend on axios internals. */
export class ApiError extends Error {
  readonly status?: number
  readonly cancelled: boolean

  constructor(
    message: string,
    options: { status?: number; cancelled?: boolean; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.status = options.status
    this.cancelled = options.cancelled ?? false
  }
}

/** Converts anything thrown by axios (or elsewhere) into an {@link ApiError}. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isCancel(error)) {
    return new ApiError('Request was cancelled', { cancelled: true, cause: error })
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status) {
      const message = status === 404 ? 'Resource not found' : `Request failed with status ${status}`
      return new ApiError(message, { status, cause: error })
    }
    if (error.code === 'ECONNABORTED') {
      return new ApiError('The server took too long to respond', { cause: error })
    }
    return new ApiError('Could not reach the server', { cause: error })
  }

  return new ApiError('Unexpected error', { cause: error })
}
