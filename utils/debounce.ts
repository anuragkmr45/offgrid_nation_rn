// utils/debounce.ts

/**
 * Creates a debounced version of `fn` that delays invoking it until
 * after `wait` milliseconds have elapsed since the last time it was called.
 *
 * @param fn    The function to debounce.
 * @param wait  Delay in milliseconds.
 * @returns A debounced function with a `.cancel()` method to clear any pending call.
 */
export function debounce<
  F extends (...args: any[]) => void
>(
  fn: F,
  wait: number
): F & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = ((...args: Parameters<F>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, wait)
  }) as F & { cancel: () => void }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
