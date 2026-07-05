import type { Meta, StoryObj } from '@storybook/react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '../components/ui/shadcn/drawer'
import { Button } from '../components/ui/shadcn/button'

/**
 * ### Purpose
 * A sliding drawer overlay menu emerging from the page edges.
 *
 * ### When to use
 * Use for mobile navigation panels, expanded details viewing, multi-step configurations.
 */
const meta: Meta<typeof Drawer> = {
  title: 'Components/UI/Drawer',
  component: Drawer,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={(props) => (
        <Button {...props}>Open Drawer Panel</Button>
      )} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Expanded Settings</DrawerTitle>
          <DrawerDescription>
            Inspect layout properties and customize system settings.
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4 text-xs text-muted-foreground flex-1">
          Insert layout lists or checklist configuration forms here.
        </div>
        <DrawerFooter>
          <Button variant="outline" className="w-full">Cancel</Button>
          <Button className="w-full">Apply settings</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
