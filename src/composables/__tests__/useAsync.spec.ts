import { effectScope } from 'vue'
import { describe, expect, it } from 'vitest'
import { ApiError } from '@/api/errors'
import { useAsync } from '../useAsync'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const flush = () => new Promise((r) => setTimeout(r))

describe('useAsync', () => {
  it('exposes loading, then data', async () => {
    const d = deferred<number>()
    const state = useAsync(() => d.promise)
    expect(state.loading.value).toBe(true)
    d.resolve(42)
    await flush()
    expect(state.loading.value).toBe(false)
    expect(state.data.value).toBe(42)
    expect(state.error.value).toBeUndefined()
  })

  it('exposes errors as ApiError', async () => {
    const state = useAsync(() => Promise.reject(new Error('x')))
    await flush()
    expect(state.error.value).toBeInstanceOf(ApiError)
    expect(state.loading.value).toBe(false)
  })

  it('does not run when immediate is false', () => {
    let calls = 0
    const state = useAsync(async () => ++calls, { immediate: false })
    expect(calls).toBe(0)
    expect(state.loading.value).toBe(false)
  })

  it('aborts the previous request and ignores its late result', async () => {
    const first = deferred<string>()
    const second = deferred<string>()
    const signals: AbortSignal[] = []
    const queue = [first, second]
    const state = useAsync((signal) => {
      signals.push(signal)
      return queue.shift()!.promise
    })

    void state.run()
    expect(signals[0]!.aborted).toBe(true)

    second.resolve('fresh')
    await flush()
    first.resolve('stale')
    await flush()

    expect(state.data.value).toBe('fresh')
    expect(state.loading.value).toBe(false)
  })

  it('aborts the in-flight request when its scope is disposed', () => {
    let signal: AbortSignal | undefined
    const scope = effectScope()
    scope.run(() =>
      useAsync((s) => {
        signal = s
        return new Promise(() => {})
      }),
    )
    scope.stop()
    expect(signal?.aborted).toBe(true)
  })
})
