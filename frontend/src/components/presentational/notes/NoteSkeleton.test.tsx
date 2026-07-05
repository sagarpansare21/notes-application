import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NoteSkeleton } from './NoteSkeleton'

describe('NoteSkeleton', () => {
  it('renders a grid skeleton by default', () => {
    const { container } = render(<NoteSkeleton />)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('animate-pulse')
  })

  it('renders a grid skeleton when viewMode is "grid"', () => {
    const { container } = render(<NoteSkeleton viewMode="grid" />)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('animate-pulse')
    expect(card.className).toContain('min-h-[140px]')
  })

  it('renders a list skeleton when viewMode is "list"', () => {
    const { container } = render(<NoteSkeleton viewMode="list" />)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('animate-pulse')
    expect(card.className).toContain('items-center')
  })

  it('grid and list skeletons render different layouts', () => {
    const { container: gridContainer } = render(<NoteSkeleton viewMode="grid" />)
    const { container: listContainer } = render(<NoteSkeleton viewMode="list" />)

    const gridCard = gridContainer.firstChild as HTMLElement
    const listCard = listContainer.firstChild as HTMLElement

    expect(gridCard.className).not.toEqual(listCard.className)
  })
})
