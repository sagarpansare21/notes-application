import type { Meta, StoryObj } from '@storybook/react'
import { TagChip } from '../components/composite/tag-chip'

/**
 * ### Purpose
 * Compact tag chips containing action controls.
 *
 * ### When to use
 * Use inside note headers, note cards, filtering search bars.
 */
const meta: Meta<typeof TagChip> = {
  title: 'Composite/TagChip',
  component: TagChip,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof TagChip>

export const Default: Story = {
  args: {
    label: 'Design',
  },
}

export const Active: Story = {
  args: {
    label: 'Architecture',
    active: true,
  },
}

export const Removable: Story = {
  args: {
    label: 'Work',
    onRemove: () => alert('Removed tag!'),
  },
}
