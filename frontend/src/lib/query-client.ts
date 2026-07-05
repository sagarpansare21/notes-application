import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Use cached data while offline; don't throw just because we're disconnected
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Queue mutations when offline; auto-fire when connection restores
      networkMode: 'offlineFirst',
      retry: 3,
    },
  },
})
