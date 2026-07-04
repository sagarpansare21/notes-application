import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton, SkeletonCircle, SkeletonLine, SkeletonCard } from '../components/ui/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <SkeletonLine width="w-12" height="h-4" />
      <SkeletonLine width="w-full" height="h-8" />
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <SkeletonCard />
    </div>
  ),
}

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md border border-border rounded-xl p-5 bg-card shadow-notion">
      <div className="mb-2">
        <SkeletonLine height="h-4.5" width="w-1/3" />
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0 last:pb-0"
        >
          <SkeletonCircle size="size-9" />
          <div className="flex-1 flex flex-col gap-1.5">
            <SkeletonLine height="h-3.5" width="w-2/3" />
            <SkeletonLine height="h-2.5" width="w-1/3" />
          </div>
          <SkeletonLine height="h-4" width="w-12" className="rounded-full" />
        </div>
      ))}
    </div>
  ),
}

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl p-6 border border-border rounded-xl bg-card shadow-notion">
      {/* Stats Cards */}
      <div className="border border-border p-4 rounded-lg bg-secondary/30 dark:bg-muted/10 flex flex-col gap-3">
        <SkeletonLine height="h-3" width="w-1/2" />
        <SkeletonLine height="h-7" width="w-1/3" />
      </div>
      <div className="border border-border p-4 rounded-lg bg-secondary/30 dark:bg-muted/10 flex flex-col gap-3">
        <SkeletonLine height="h-3" width="w-1/3" />
        <SkeletonLine height="h-7" width="w-1/4" />
      </div>
      <div className="border border-border p-4 rounded-lg bg-secondary/30 dark:bg-muted/10 flex flex-col gap-3">
        <SkeletonLine height="h-3" width="w-2/5" />
        <SkeletonLine height="h-7" width="w-1/5" />
      </div>

      {/* Main Content Area - Span 2 */}
      <div className="md:col-span-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SkeletonLine height="h-4.5" width="w-1/4" />
          <SkeletonLine height="h-7" width="w-20" className="rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>

      {/* Sidebar Content Area */}
      <div className="flex flex-col gap-4">
        <SkeletonLine height="h-4.5" width="w-1/3" />
        <div className="flex flex-col gap-3.5 border border-border p-4 rounded-lg bg-secondary/10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <SkeletonCircle size="size-7" />
              <div className="flex-1 flex flex-col gap-1 w-full">
                <SkeletonLine height="h-2.5" width="w-4/5" />
                <SkeletonLine height="h-1.5" width="w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}
