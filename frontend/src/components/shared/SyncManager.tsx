import { useEffect } from 'react'
import { useSyncQueue } from '@/hooks/use-sync-queue'

/**
 * Invisible component mounted once at the app root.
 * Registers the online/offline listeners and drains leftover queue on startup.
 * Writes sync state to Zustand — no Context needed.
 */
export function SyncManager() {
  const { drainQueue } = useSyncQueue()

  // Drain any queue entries that remain from a previous offline session
  useEffect(() => {
    if (navigator.onLine) {
      drainQueue()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
