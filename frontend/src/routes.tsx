import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { PageLayout } from './components/ui/page-layout'

const DashboardPage = lazy(() => import('./pages/dashboard').then((m) => ({ default: m.DashboardPage })))
const NotesPage = lazy(() => import('./pages/notes').then((m) => ({ default: m.NotesPage })))
const TagsPage = lazy(() => import('./pages/tags').then((m) => ({ default: m.TagsPage })))
const TrashPage = lazy(() => import('./pages/trash').then((m) => ({ default: m.TrashPage })))
const ExportImportPage = lazy(() => import('./pages/export-import').then((m) => ({ default: m.ExportImportPage })))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        path: '',
        element: <DashboardPage />,
      },
      {
        path: 'notes',
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
    ],
  },
])
