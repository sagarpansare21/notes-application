import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from '../components/shared/empty-state'
import { Button } from '../components/ui/shadcn/button'
import { FileText, Tag, Trash2, Search, Plus } from 'lucide-react'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Main heading text' },
    description: { control: 'text', description: 'Supporting description text' },
    icon: { control: { disable: true }, description: 'Lucide icon component rendered in the center circle' },
    action: { control: { disable: true }, description: 'Interactive action node rendered at the bottom' },
  },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Notes: Story = {
  args: {
    title: 'No notes yet',
    description: 'Create your first note to start writing and organizing your thoughts.',
    icon: <FileText className="size-6 text-muted-foreground/80" />,
    action: (
      <Button size="sm">
        <Plus className="size-3.5 mr-1.5" />
        <span>New Note</span>
      </Button>
    ),
  },
}

export const Tags: Story = {
  args: {
    title: 'No tags found',
    description: 'Create custom tags to filter and categorize your notes efficiently.',
    icon: <Tag className="size-6 text-muted-foreground/80" />,
    action: (
      <Button variant="outline" size="sm">
        <Plus className="size-3.5 mr-1.5" />
        <span>Create Tag</span>
      </Button>
    ),
  },
}

export const Trash: Story = {
  args: {
    title: 'Trash is empty',
    description: 'Deleted notes will appear here and are cleared automatically after 30 days.',
    icon: <Trash2 className="size-6 text-muted-foreground/80" />,
  },
}

export const SearchResults: Story = {
  args: {
    title: 'No results matched',
    description: 'Try searching with keywords or different filter options.',
    icon: <Search className="size-6 text-muted-foreground/80" />,
  },
}
