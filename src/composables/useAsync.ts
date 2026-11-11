import { onScopeDispose, ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import { ApiError, toApiError } from '@/api/errors'

export interface AsyncState<T> {
  data: ShallowRef<T | undefined>
  error: ShallowRef<ApiError | undefined>
  loading: Ref<boolean>
  /** Runs the request again, cancelling one still in flight. */
  run: () => Promise<void>
}

/**
 * Wraps an async API call with loading / error / data state.
 * In-flight requests are aborted when a new one starts or the component unmounts,
 * so stale responses never overwrite fresh ones.
 */
export function useAsync<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  { immediate = true } = {},
): AsyncState<T> {
  const data = shallowRef<T>()
  const error = shallowRef<ApiError>()
  const loading = ref(false)
  let controller: AbortController | undefined

  async function run(): Promise<void> {
    controller?.abort()
    const current = new AbortController()
    controller = current

    loading.value = true
    error.value = undefined
    try {
      const result = await fn(current.signal)
      if (!current.signal.aborted) data.value = result
    } catch (err) {
      const apiError = toApiError(err)
      if (!current.signal.aborted && !apiError.cancelled) error.value = apiError
    } finally {
      if (controller === current) loading.value = false
    }
  }

  onScopeDispose(() => controller?.abort())

  if (immediate) void run()

  return { data, error, loading, run }
}
