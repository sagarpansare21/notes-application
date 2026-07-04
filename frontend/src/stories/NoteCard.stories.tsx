import type { Meta, StoryObj } from '@storybook/react'
import { NoteCard } from '../components/composite/note-card'

/**
 * ### Purpose
 * Standardized note preview element showing title, snippet, tags and modified timestamps.
 *
 * ### When to use
 * Use inside note boards grid listings and workspaces lists.
 */
const meta: Meta<typeof NoteCard> = {
  title: 'Composite/NoteCard',
  component: NoteCard,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof NoteCard>

export const Default: Story = {
  args: {
    title: 'Meeting Notes: Design System Architecture',
    content: 'Today we aligned on utilizing React 19, TypeScript, Vite, Tailwind CSS, and Base UI unstyled primitives to construct a modern design system.',
    tags: ['Design', 'Work'],
    updatedAt: 'July 4, 2026',
    onDelete: () => alert('Deleted note!'),
  },
}

export const Selected: Story = {
  args: {
    title: 'Weekly Grocery List',
    content: 'Organic apples, fresh milk, whole wheat bread, avocados, eggs, spinach, coffee beans.',
    tags: ['Personal'],
    updatedAt: '2 hours ago',
    selected: true,
    onDelete: () => alert('Deleted note!'),
  },
}
