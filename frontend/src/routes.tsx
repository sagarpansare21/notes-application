import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { PageLayout } from './components/layout/page-layout'

const NotesPage = lazy(() => import('./pages/notes').then((m) => ({ default: m.NotesPage })))
const TagsPage = lazy(() => import('./pages/tags').then((m) => ({ default: m.TagsPage })))
const TrashPage = lazy(() => import('./pages/trash').then((m) => ({ default: m.TrashPage })))
const ExportImportPage = lazy(() => import('./pages/export-import').then((m) => ({ default: m.ExportImportPage })))
const NotFoundPage = lazy(() => import('./pages/not-found').then((m) => ({ default: m.NotFoundPage })))

import { ErrorBoundary } from './components/ui/error-boundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <PageLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '',
        element: <NotesPage />,
      },
      {
        path: 'tags',
        element: <TagsPage />,
      },
      {
        path: 'trash',
        element: <TrashPage />,
      },
      {
        path: 'export-import',
        element: <ExportImportPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
