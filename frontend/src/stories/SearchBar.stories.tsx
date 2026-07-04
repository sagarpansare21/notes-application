import type { Meta, StoryObj } from '@storybook/react'
import { SearchBar } from '../components/composite/search-bar'

/**
 * ### Purpose
 * Interactive search component containing magnifier icons and shortcut labels.
 *
 * ### When to use
 * Use in list view headers, navigation headers.
 */
const meta: Meta<typeof SearchBar> = {
  title: 'Composite/SearchBar',
  component: SearchBar,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  args: {
    placeholder: 'Search workspace...',
  },
}
