'use client';

import { useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';

/**
 * Pings the backend health endpoint to wake up Render's free tier
 * from sleep on initial page load. Runs once per session.
 */
export function BackendWakeUp() {
  useEffect(() => {
    const sessionKey = 'shopvault_backend_pinged';
    if (sessionStorage.getItem(sessionKey)) return;

    // Fire-and-forget ping to wake up Render
    fetch(`${BACKEND_URL}/health`, { method: 'GET', cache: 'no-store' })
      .then(() => sessionStorage.setItem(sessionKey, '1'))
      .catch(() => {}); // Silently ignore errors
  }, []);

  return null;
}
