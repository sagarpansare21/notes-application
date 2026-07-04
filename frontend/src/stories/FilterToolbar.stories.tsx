import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FilterToolbar } from '../components/composite/filter-toolbar'

/**
 * ### Purpose
 * Aggregates workspace search and tag filters rows in a card.
 *
 * ### When to use
 * Use at the top of notes grid boards or lists pages to filter lists dynamically.
 */
const meta: Meta<typeof FilterToolbar> = {
  title: 'Composite/FilterToolbar',
  component: FilterToolbar,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

const FilterToolbarDemo = () => {
  const [query, setQuery] = React.useState("")
  const [activeTags, setActiveTags] = React.useState<string[]>(['Design'])

  const handleTagToggle = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <FilterToolbar
        searchQuery={query}
        onSearchChange={setQuery}
        tags={['Work', 'Design', 'Reference', 'Personal']}
        activeTags={activeTags}
        onTagToggle={handleTagToggle}
        onClearFilters={() => {
          setQuery('')
          setActiveTags([])
        }}
      />
    </div>
  )
}

export const Interactive: StoryObj<typeof FilterToolbar> = {
  render: () => <FilterToolbarDemo />,
}
