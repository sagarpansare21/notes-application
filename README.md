# Notes Application

An **offline-first, full-stack Notes application** built with React and Fastify. The application provides a modern, responsive user experience with support for offline note management, background synchronization, optimistic updates, keyboard shortcuts, and comprehensive testing.

---

# Tech Stack & Why

## Frontend

| Technology | Why |
|------------|-----|
| **React + TypeScript** | Component-based UI with strong type safety and maintainability. |
| **Vite** | Fast development server and optimized production builds. |
| **TanStack Query** | Handles server state, caching, optimistic updates, and automatic cache invalidation. |
| **Zustand** | Lightweight state management for UI state and synchronization status. |
| **IndexedDB (`idb`)** | Persists notes and queued mutations locally for offline usage. |
| **Service Worker** | Caches application assets for offline availability and faster page loads. |
| **Tailwind CSS** | Rapid development of responsive and accessible user interfaces. |

## Backend

| Technology | Why |
|------------|-----|
| **Fastify** | High-performance Node.js framework with excellent TypeScript support. |
| **Prisma ORM** | Type-safe database access and simplified migrations. |
| **SQLite** | Lightweight database requiring zero configuration for local evaluation. |
| **Swagger** | Automatically generated interactive API documentation. |

---

# Architecture Overview

The application follows an **offline-first client-server architecture**. Users can continue creating, editing, and deleting notes without an internet connection. Changes are stored locally and synchronized automatically when connectivity is restored.

## System Architecture

```text
                         Browser
┌──────────────────────────────────────────────────────┐
│                                                      │
│  React UI                                            │
│      │                                               │
│      ▼                                               │
│  TanStack Query                                      │
│      │                                               │
│      ▼                                               │
│  IndexedDB (Local Notes)                             │
│      ▲                                               │
│      │                                               │
│  Sync Manager ◄────────────── Service Worker         │
│      │                                               │
└──────┼───────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│                Fastify REST API                      │
│                      │                               │
│                      ▼                               │
│                 Prisma ORM                           │
│                      │                               │
│                      ▼                               │
│                SQLite Database                       │
└──────────────────────────────────────────────────────┘
```

## Data Flow

1. The user interacts with the React UI.
2. TanStack Query manages data fetching, caching, and mutations.
3. Notes are persisted locally in IndexedDB.
4. When online, mutations are sent directly to the backend.
5. When offline, mutations are queued locally.
6. Once connectivity is restored, the Sync Manager processes queued operations and synchronizes them with the backend.
7. TanStack Query refreshes the local cache to keep the UI consistent with the server.

---

# Setup & Run

## Prerequisites

- Node.js 18+
- npm

## Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Backend runs on:

```
http://localhost:3000
```

Swagger documentation:

```
http://localhost:3000/docs
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

# Testing

The project follows a layered testing strategy to balance fast feedback with confidence in end-to-end user workflows.

## Frontend

### Unit & Component Tests

- Vitest
- React Testing Library

Tests cover:

- Custom hooks
- UI components
- Zustand stores
- Utility functions

Run:

```bash
cd frontend
npm run test:run
```

### End-to-End Tests

- Playwright

Tests cover:

- Notes CRUD
- Search and filtering
- Trash management
- Keyboard shortcuts
- Offline mode
- Background synchronization
- Responsive behavior

Run:

```bash
npm run test:e2e
```

Interactive mode:

```bash
npm run test:e2e:ui
```

## Backend

Integration tests use **Vitest** with **Fastify Inject** to verify API routes, controllers, and database interactions without starting an HTTP server.

Run:

```bash
cd backend
npm run test
```

### Testing Approach

- **Unit tests** validate isolated business logic and UI behavior.
- **Integration tests** verify API contracts and database interactions.
- **End-to-end tests** validate complete user workflows, including offline synchronization and browser interactions.

---

# Key Trade-Offs

### Offline-First Architecture

The application prioritizes local persistence by storing notes and queued mutations in IndexedDB. This provides an uninterrupted user experience while offline but introduces additional complexity around synchronization, retries, and conflict handling.

### Optimistic Updates

UI updates immediately before server confirmation, improving responsiveness. Failed requests require rollback logic to keep local and server state consistent.

### Auto-Save

Changes are automatically saved after a short debounce interval, reducing the risk of losing user input. This increases write frequency but improves the overall editing experience.

---

# Known Limitations

- Authentication and authorization are not implemented.
- Real-time collaboration is not supported.

---

# Bonus Features

- ✅ Offline-first architecture
- ✅ IndexedDB local persistence
- ✅ Service Worker support
- ✅ Background synchronization
- ✅ Optimistic UI updates
- ✅ Auto-save
- ✅ Keyboard shortcuts
- ✅ Responsive UI
- ✅ Accessibility improvements
- ✅ Storybook component documentation
- ✅ Playwright end-to-end tests
- ✅ Unit and integration tests
- ✅ Swagger API documentation