import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TagsGrid } from './TagsGrid'
import type { Tag } from '@/types/note'

describe('TagsGrid', () => {
  const mockTags: Tag[] = [
    { id: '1', name: 'work', noteCount: 4 },
    { id: '2', name: 'personal', noteCount: 1 },
    { id: '3', name: 'ideas', noteCount: 0 },
  ]

  it('renders loading skeleton cards when isLoading is true', () => {
    const onRetry = vi.fn()
    const onTagClick = vi.fn()

    render(
      <TagsGrid
        tags={undefined}
        isLoading={true}
        isError={false}
        error={null}
        onRetry={onRetry}
        onTagClick={onTagClick}
      />
    )

    const skeletons = screen.getAllByTestId('tag-skeleton-card')
    expect(skeletons).toHaveLength(8)
  })

  it('renders error state when isError is true', () => {
    const onRetry = vi.fn()
    const onTagClick = vi.fn()
    const mockError = new Error('Database connection failed')

    render(
      <TagsGrid
        tags={undefined}
        isLoading={false}
        isError={true}
        error={mockError}
        onRetry={onRetry}
        onTagClick={onTagClick}
      />
    )

    expect(screen.getByText('Database connection failed')).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: /Try again/i })
    fireEvent.click(retryBtn)
    expect(onRetry).toHaveBeenCalled()
  })

  it('renders empty state when tags array is empty', () => {
    const onRetry = vi.fn()
    const onTagClick = vi.fn()

    render(
      <TagsGrid
        tags={[]}
        isLoading={false}
        isError={false}
        error={null}
        onRetry={onRetry}
        onTagClick={onTagClick}
      />
    )

    expect(screen.getByText('No tags found')).toBeInTheDocument()
    expect(screen.getByText('Create a note and add tags to organize your dashboard.')).toBeInTheDocument()
  })

  it('renders tag cards and triggers onTagClick callback on click', () => {
    const onRetry = vi.fn()
    const onTagClick = vi.fn()

    render(
      <TagsGrid
        tags={mockTags}
        isLoading={false}
        isError={false}
        error={null}
        onRetry={onRetry}
        onTagClick={onTagClick}
      />
    )

    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('4 notes')).toBeInTheDocument()

    expect(screen.getByText('personal')).toBeInTheDocument()
    expect(screen.getByText('1 note')).toBeInTheDocument()

    expect(screen.getByText('ideas')).toBeInTheDocument()
    expect(screen.getByText('0 notes')).toBeInTheDocument()

    // Click the "work" card (the div element of the Card)
    const workCard = screen.getByText('work').closest('div')
    expect(workCard).not.toBeNull()
    fireEvent.click(workCard!)

    expect(onTagClick).toHaveBeenCalledWith(mockTags[0])
  })
})
