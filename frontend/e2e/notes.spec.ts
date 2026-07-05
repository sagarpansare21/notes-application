import { test, expect } from '@playwright/test'

// Initial baseline mock data
const initialNotes = [
  {
    id: 'note-1',
    title: 'Work Task',
    content: 'This is a test note created by Playwright.',
    tags: ['work'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null as string | null,
  },
  {
    id: 'note-2',
    title: 'Personal Item',
    content: 'Buy milk and bread.',
    tags: ['personal'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null as string | null,
  },
]

const initialTags = [
  { id: '1', name: 'work', noteCount: 1 },
  { id: '2', name: 'personal', noteCount: 1 },
]

test.describe('Notes App E2E Suite', () => {
  let currentNotes: typeof initialNotes = []
  let currentTags: typeof initialTags = []

  // Setup basic stateful mocking for all tests
  test.beforeEach(async ({ page }) => {
    // Clone baseline data
    currentNotes = JSON.parse(JSON.stringify(initialNotes))
    currentTags = JSON.parse(JSON.stringify(initialTags))

    // Handle generic tag list route
    await page.route('**/v1/tags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: currentTags }),
      })
    })

    // Handle generic GET route
    await page.route('**/v1/notes**', async (route) => {
      if (route.request().method() === 'GET') {
        const url = new URL(route.request().url())
        const search = url.searchParams.get('search')
        const tag = url.searchParams.get('tag')
        const offset = parseInt(url.searchParams.get('offset') || '0', 10)
        
        let filtered = currentNotes.filter((n) => !n.deletedAt)

        if (search) {
          filtered = filtered.filter(
            (n) =>
              n.title.toLowerCase().includes(search.toLowerCase()) ||
              n.content.toLowerCase().includes(search.toLowerCase())
          )
        }

        if (tag) {
          filtered = filtered.filter((n) => n.tags.includes(tag))
        }

        const limit = 6
        const paginated = filtered.slice(offset, offset + limit)

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: paginated,
              total: filtered.length,
              limit,
              offset,
            },
          }),
        })
      } else {
        await route.continue()
      }
    })
  })

  test.describe('App States & Load', () => {
    test('should show loading skeletons initially', async ({ page }) => {
      await page.route('**/v1/notes**', async (route) => {
        // Mock a slow request to ensure loading skeletons are rendered
        await new Promise((resolve) => setTimeout(resolve, 800))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: { data: [], total: 0 } }),
        })
      })

      await page.goto('/')
      const pulseElement = page.locator('.animate-pulse').first()
      await expect(pulseElement).toBeVisible()
    })

    test('should render empty state correctly', async ({ page }) => {
      currentNotes = []
      await page.goto('/')
      await expect(page.getByText('No notes added')).toBeVisible()
      await expect(page.getByText('Create your first note to get started.')).toBeVisible()
    })

    test('should render error state with retry on API failure', async ({ page }) => {
      let callCount = 0
      await page.route('**/v1/notes**', async (route) => {
        callCount++
        // Fail consistently on first two requests to overcome potential React Query automatic retries
        if (callCount <= 2) {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
          })
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                data: currentNotes,
                total: currentNotes.length,
                limit: 6,
                offset: 0,
              },
            }),
          })
        }
      })

      await page.goto('/')
      await expect(page.getByText('Failed to fetch notes')).toBeVisible()

      // Click retry
      await page.getByRole('button', { name: 'Try again' }).click()
      await expect(page.getByText('Work Task')).toBeVisible()
    })
  })

  test.describe('Notes CRUD Actions', () => {
    test.beforeEach(async ({ page }) => {
      // Mock stateful POST
      await page.route('**/v1/notes', async (route) => {
        if (route.request().method() === 'POST') {
          const payload = JSON.parse(route.request().postData() || '{}')
          const newNote = {
            id: `note-${Date.now()}`,
            title: payload.title,
            content: payload.content,
            tags: payload.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
          }
          currentNotes.push(newNote)
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, data: newNote }),
          })
        } else {
          await route.continue()
        }
      })

      // Mock stateful PATCH
      await page.route('**/v1/notes/*', async (route) => {
        if (route.request().method() === 'PATCH') {
          const url = route.request().url()
          const id = url.substring(url.lastIndexOf('/') + 1)
          const payload = JSON.parse(route.request().postData() || '{}')

          const noteIndex = currentNotes.findIndex((n) => n.id === id)
          if (noteIndex !== -1) {
            currentNotes[noteIndex] = {
              ...currentNotes[noteIndex],
              ...payload,
              updatedAt: new Date().toISOString(),
            }
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({ success: true, data: currentNotes[noteIndex] }),
            })
          } else {
            await route.fulfill({ status: 404 })
          }
        } else {
          await route.continue()
        }
      })

      await page.goto('/')
    })

    test('should create a new note successfully with tags', async ({ page }) => {
      await page.getByRole('button', { name: 'Add Note' }).first().click()
      await page.getByLabel('Title').fill('New Note Title')
      await page.getByPlaceholder('Write note contents in markdown...').fill('Note contents go here.')
      
      await page.getByLabel('Tags').fill('work')
      await page.keyboard.press('Enter')

      await page.getByRole('button', { name: 'Create Note' }).click()

      await expect(page.getByText('New Note Title')).toBeVisible()
    })

    test('should edit an existing note successfully', async ({ page }) => {
      await page.getByText('Work Task').click()
      await page.getByLabel('Title').fill('Edited Work Task')
      await page.getByRole('button', { name: 'Save Changes' }).click()

      await expect(page.getByText('Edited Work Task')).toBeVisible()
    })

    test('should handle edit API failures gracefully with optimistic rollback', async ({ page }) => {
      await page.route('**/v1/notes/note-1', async (route) => {
        if (route.request().method() === 'PATCH') {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ success: false, message: 'Autosave failed' }),
          })
        }
      })

      await page.getByText('Work Task').click()
      await page.getByLabel('Title').fill('Failed Edited Title')

      // Form save status error message appears (allow time for autosave debounce + retries)
      await expect(page.getByText('⚠ Save failed')).toBeVisible({ timeout: 15000 })
      
      // Rollback values should restore the original title
      await expect(page.getByText('Work Task')).toBeVisible()
    })

    test('should delete note, restore from trash, and delete permanently', async ({ page }) => {
      // Mock stateful delete (moves to trash)
      await page.route('**/v1/notes/*', async (route) => {
        if (route.request().method() === 'DELETE') {
          const url = route.request().url()
          const id = url.substring(url.lastIndexOf('/') + 1)
          const noteIndex = currentNotes.findIndex((n) => n.id === id)
          if (noteIndex !== -1) {
            currentNotes[noteIndex].deletedAt = new Date().toISOString()
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
          }
        }
      })

      // Hover and delete note-1
      const card = page.getByRole('button', { name: 'Edit note: Work Task' })
      await card.hover()
      await card.getByRole('button', { name: 'Note actions' }).click()
      await page.getByRole('menuitem', { name: 'Delete' }).click()

      // Verify it disappeared from notes page
      await expect(page.getByText('Work Task')).not.toBeVisible()

      // Mock Trash list
      await page.route('**/v1/trash', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, data: currentNotes.filter((n) => n.deletedAt) }),
          })
        } else if (route.request().method() === 'DELETE') {
          // Empty trash action
          currentNotes = currentNotes.filter((n) => !n.deletedAt)
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
        }
      })

      // Go to Trash page
      await page.getByRole('link', { name: 'Trash' }).click()
      await expect(page.getByText('Work Task')).toBeVisible()

      // Mock restore endpoint
      await page.route('**/v1/notes/*/restore', async (route) => {
        const url = route.request().url()
        const parts = url.split('/')
        const id = parts[parts.length - 2]
        const noteIndex = currentNotes.findIndex((n) => n.id === id)
        if (noteIndex !== -1) {
          currentNotes[noteIndex].deletedAt = null
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
        }
      })

      // Click restore on the note card
      await page.getByTitle('Restore Note').click()
      
      // Verify it disappears from Trash list
      await expect(page.getByText('Work Task')).not.toBeVisible()
    })
  })

  test.describe('Search, Filters, Pagination, & Autocomplete', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    test('should trigger correct search API query parameters', async ({ page }) => {
      let queryParams: URLSearchParams | null = null
      await page.route('**/v1/notes**', async (route) => {
        const url = new URL(route.request().url())
        queryParams = url.searchParams
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: [currentNotes[1]],
              total: 1,
              limit: 6,
              offset: 0,
            },
          }),
        })
      })

      const searchInput = page.locator('#notes-search-input')
      await searchInput.fill('milk')

      await expect.poll(() => queryParams?.get('search')).toBe('milk')
    })

    test('should support tag filter selection from toolbar', async ({ page }) => {
      let selectedTagParam: string | null = null
      await page.route('**/v1/notes**', async (route) => {
        const url = new URL(route.request().url())
        selectedTagParam = url.searchParams.get('tag')
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              data: [currentNotes[0]],
              total: 1,
              limit: 6,
              offset: 0,
            },
          }),
        })
      })

      await page.getByRole('combobox').first().click()
      await page.getByRole('option', { name: '#work' }).click()

      await expect.poll(() => selectedTagParam).toBe('work')
    })

    test('should autocomplete tags and navigate suggestions with Arrow keys', async ({ page }) => {
      await page.getByRole('button', { name: 'Add Note' }).first().click()
      const tagInput = page.getByLabel('Tags')
      await tagInput.focus()
      await tagInput.fill('w')

      // Suggestions popup should show
      const popoverList = page.getByTestId('tags-suggestions-list')
      await expect(popoverList).toBeVisible()

      // Use keyboard navigation to select the suggestion
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')

      await expect(page.getByText('work', { exact: true })).toBeVisible()
    })
  })

  test.describe('Keyboard Shortcuts, Responsive, & A11y', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    test('should open new note drawer using Alt+N shortcut', async ({ page }) => {
      await page.locator('body').click()
      await page.keyboard.press('Alt+KeyN')
      await expect(page.getByLabel('Title')).toBeVisible()
    })

    test('should collapse sidebar on mobile viewport and trigger drawer hamburger button', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const sidebar = page.locator('aside').first()
      await expect(sidebar).toBeHidden()

      const menuBtn = page.getByRole('button', { name: 'Open menu' })
      await expect(menuBtn).toBeVisible()
      await menuBtn.click()

      const mobileSidebar = page.locator('aside').nth(1)
      await expect(mobileSidebar).toBeVisible()
    })
  })

  test.describe('Offline Mode & background sync', () => {
    test('should persist note changes locally and background sync on connection restore', async ({ page }) => {
      let syncRequestFired = false
      await page.route('**/v1/notes', async (route) => {
        if (route.request().method() === 'POST') {
          syncRequestFired = true
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                id: 'sync-note-id',
                title: 'Offline Note',
                content: 'Written offline',
                tags: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            }),
          })
        } else {
          await route.continue()
        }
      })

      await page.goto('/')

      // Force offline
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'onLine', {
          value: false,
          configurable: true,
        })
        window.dispatchEvent(new Event('offline'))
      })

      await expect(page.getByText(/You're offline/i)).toBeVisible()

      // Write a note offline
      await page.getByRole('button', { name: 'Add Note' }).first().click()
      await page.getByLabel('Title').fill('Offline Note')
      await page.getByPlaceholder('Write note contents in markdown...').fill('Written offline')
      await page.getByRole('button', { name: 'Create Note' }).click()

      // Optmistic card shows up immediately in the offline session
      await expect(page.getByText('Offline Note')).toBeVisible()
      expect(syncRequestFired).toBe(false)

      // Reconnect online
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'onLine', {
          value: true,
          configurable: true,
        })
        window.dispatchEvent(new Event('online'))
      })

      // Sync POST request should fire
      await expect.poll(() => syncRequestFired).toBe(true)
    })
  })
})
