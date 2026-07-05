import type { Meta, StoryObj } from '@storybook/react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog'
import { Button } from '../components/ui/button'

/**
 * ### Purpose
 * Floating modal overlays presenting critical context on top of the primary page content.
 *
 * ### When to use
 * Use for delete confirmations, profile configuration panels, data backup setups.
 *
 * ### Accessibility Notes
 * Uses backdrop focus traps. Automatically locks page scrolling and focuses on Dialog contents. Supports escape key triggers.
 */
const meta: Meta<typeof Dialog> = {
  title: 'Components/UI/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={(props) => (
        <Button {...props}>Open Modal Dialog</Button>
      )} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Workspace</DialogTitle>
          <DialogDescription>
            Modify workspace properties and customize default settings.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-xs text-muted-foreground">
          Insert dialog custom form content inputs here.
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
