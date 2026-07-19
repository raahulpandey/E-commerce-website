'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Debounces a value by the given delay (ms).
 * Useful for search inputs — avoids an API call on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
