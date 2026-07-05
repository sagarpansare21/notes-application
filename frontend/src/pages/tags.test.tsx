import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TagsPage } from './tags'
import { useTags } from '@/hooks/use-tags'
import { useNavigate } from 'react-router'

vi.mock('@/hooks/use-tags', () => ({
  useTags: vi.fn(),
}))

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}))

describe('TagsPage', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('renders loading skeletons when isLoading is true', () => {
    vi.mocked(useTags).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<TagsPage />)

    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Browse and filter notes by their categories.')).toBeInTheDocument()
    // There are 8 skeleton cards rendered during load
    const cards = screen.getAllByTestId('tag-skeleton-card')
    expect(cards.length).toBe(8)
  })

  it('renders error state when isError is true', () => {
    const refetchSpy = vi.fn()
    vi.mocked(useTags).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network Error'),
      refetch: refetchSpy,
    } as any)

    render(<TagsPage />)

    expect(screen.getByText('Network Error')).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: /Try again/i })
    fireEvent.click(retryBtn)
    expect(refetchSpy).toHaveBeenCalled()
  })

  it('renders empty state when tag list is empty', () => {
    vi.mocked(useTags).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<TagsPage />)

    expect(screen.getByText('No tags found')).toBeInTheDocument()
    expect(screen.getByText('Create a note and add tags to organize your dashboard.')).toBeInTheDocument()
  })

  it('renders list of tag cards and navigates on click', () => {
    const mockTags = [
      { id: '1', name: 'work', noteCount: 5 },
      { id: '2', name: 'personal', noteCount: 1 },
      { id: '3', name: 'study', noteCount: 0 },
    ]

    vi.mocked(useTags).mockReturnValue({
      data: mockTags,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<TagsPage />)

    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('5 notes')).toBeInTheDocument()

    expect(screen.getByText('personal')).toBeInTheDocument()
    expect(screen.getByText('1 note')).toBeInTheDocument()

    expect(screen.getByText('study')).toBeInTheDocument()
    expect(screen.getByText('0 notes')).toBeInTheDocument()

    // Click the first card
    const cardEl = screen.getByText('work').closest('div')
    expect(cardEl).not.toBeNull()
    fireEvent.click(cardEl!)

    expect(mockNavigate).toHaveBeenCalledWith('/?tag=work')
  })
})
