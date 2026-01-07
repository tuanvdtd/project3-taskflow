import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache 5 phút
      staleTime: 5 * 60 * 1000,

      // Không refetch linh tinh
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,

      // Retry vừa phải
      retry: 1,

      // Dùng với Suspense
      suspense: true,

      // Error sẽ throw cho ErrorBoundary
      useErrorBoundary: true
    },
    mutations: {
      retry: 0
    }
  }
})
