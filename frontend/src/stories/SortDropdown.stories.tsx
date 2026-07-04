import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SortDropdown } from '../components/composite/sort-dropdown'

/**
 * ### Purpose
 * Dropdown trigger allowing users to sort note cards lists.
 *
 * ### When to use
 * Use in list view submenus next to filters toolbar.
 */
const meta: Meta<typeof SortDropdown> = {
  title: 'Composite/SortDropdown',
  component: SortDropdown,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

const SortDropdownDemo = () => {
  const [sort, setSort] = React.useState("recent")
  return (
    <div className="p-8 flex justify-center">
      <SortDropdown
        value={sort}
        onChange={setSort}
        options={[
          { label: 'Recently Updated', value: 'recent' },
          { label: 'Alphabetical', value: 'alphabetical' },
          { label: 'Date Created', value: 'created' },
        ]}
      />
    </div>
  )
}

export const Interactive: StoryObj<typeof SortDropdown> = {
  render: () => <SortDropdownDemo />,
}
