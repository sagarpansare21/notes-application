import type { Meta, StoryObj } from '@storybook/react'
import { StatisticsCard } from '../components/composite/statistics-card'
import { FileText, Tag, Trash2 } from 'lucide-react'

/**
 * ### Purpose
 * Standardized KPI statistics card.
 *
 * ### When to use
 * Use inside dashboard layout pages to summarize totals.
 */
const meta: Meta<typeof StatisticsCard> = {
  title: 'Composite/StatisticsCard',
  component: StatisticsCard,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof StatisticsCard>

export const Notes: Story = {
  args: {
    title: 'Total Notes',
    value: 12,
    description: 'Active personal & shared note files',
    icon: FileText,
    changeText: '+2 added this week',
    trend: 'up',
  },
}

export const Tags: Story = {
  args: {
    title: 'Active Tags',
    value: 5,
    description: 'Categories & labels defined',
    icon: Tag,
    changeText: '3 unused tags',
    trend: 'neutral',
  },
}

export const Deleted: Story = {
  args: {
    title: 'Recently Deleted',
    value: 3,
    description: 'Items in trash waiting clear',
    icon: Trash2,
    changeText: 'Cleared in 30 days',
    trend: 'down',
  },
}
