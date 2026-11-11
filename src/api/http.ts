import axios, { type AxiosInstance } from 'axios'
import { toApiError } from './errors'

export const DEFAULT_API_URL = 'https://jsonplaceholder.typicode.com'

/**
 * Builds the shared axios instance. Exported as a factory so tests (or a second backend)
 * can create isolated clients.
 */
export function createHttpClient(
  baseURL: string = import.meta.env.VITE_API_URL || DEFAULT_API_URL,
): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 10_000,
    headers: { Accept: 'application/json' },
  })

  // Every rejection leaves the API layer as an ApiError with a user-safe message.
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiError(error)),
  )

  return client
}

const http = createHttpClient()

export default http
