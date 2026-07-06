import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AppProviders } from './providers/app-providers'
import { ErrorBoundary } from './components/shared/error-boundary'
import { router } from './routes'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>
)

// Register service worker for offline asset caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        console.log('Service Worker registered successfully with scope:', reg.scope)
        // Force check for updates on reload/load
        reg.update().catch(console.error)

        // Listen for new service workers waiting to activate
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker available, force refreshing to activate...')
                window.location.reload()
              }
            })
          }
        })
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err)
      })
  })
}
