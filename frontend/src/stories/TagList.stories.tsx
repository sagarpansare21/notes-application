import type { Meta, StoryObj } from '@storybook/react'
import { TagList } from '../components/composite/tag-list'

/**
 * ### Purpose
 * Standard flex row listing tags.
 *
 * ### When to use
 * Use inside filter toolbars, list headers.
 */
const meta: Meta<typeof TagList> = {
  title: 'Composite/TagList',
  component: TagList,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof TagList>

export const Default: Story = {
  args: {
    tags: ['Work', 'Design', 'Reference', 'Personal', 'Ideas'],
    activeTags: ['Design'],
  },
}
