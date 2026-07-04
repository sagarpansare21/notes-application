import type { Meta, StoryObj } from '@storybook/react'
import { toast } from '../components/ui/toast'
import { Button } from '../components/ui/button'
import { Toaster } from 'sonner'

/**
 * ### Purpose
 * Non-blocking system feedback alerts slide-loading on the screen edges.
 *
 * ### When to use
 * Use for informing user about background operations (successful backup sync, connection reconnects, deletes).
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Toast',
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

const ToastDemo = () => (
  <div className="flex flex-wrap gap-2 p-8 border rounded-lg bg-card shadow-sm">
    <Toaster position="top-right" richColors />
    <Button onClick={() => toast.success('Note Saved', 'All workspace changes are synced.')}>
      Success Alert
    </Button>
    <Button variant="destructive" onClick={() => toast.error('Sync Error', 'Failed to reach backup server.')}>
      Error Alert
    </Button>
    <Button variant="outline" onClick={() => toast.info('System Update', 'Version 2.0.4 layout active.')}>
      Info Alert
    </Button>
    <Button variant="outline" onClick={() => toast.warning('Warning', 'Note in trash will auto-delete in 3 days.')}>
      Warning Alert
    </Button>
  </div>
)

export const InteractionDemo: StoryObj = {
  render: () => <ToastDemo />,
}
