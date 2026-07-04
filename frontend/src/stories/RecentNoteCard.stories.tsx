import type { Meta, StoryObj } from '@storybook/react'
import { RecentNoteCard } from '../components/composite/recent-note-card'

/**
 * ### Purpose
 * Compact item previews showing title, timestamp and tag category labels.
 *
 * ### When to use
 * Use inside widgets list containers on the main dashboard to list latest work.
 */
const meta: Meta<typeof RecentNoteCard> = {
  title: 'Composite/RecentNoteCard',
  component: RecentNoteCard,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof RecentNoteCard>

export const Work: Story = {
  args: {
    title: 'Project Roadmap - Design System',
    updatedAt: '10 mins ago',
    tag: 'Work',
  },
}

export const Personal: Story = {
  args: {
    title: 'Weekly Grocery List',
    updatedAt: '2 hours ago',
    tag: 'Personal',
  },
}
