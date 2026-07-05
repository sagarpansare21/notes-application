import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/shadcn/tooltip'
import { Button } from '../components/ui/shadcn/button'
import { HelpCircle } from 'lucide-react'

/**
 * ### Purpose
 * Micro contextual helper overlays showing supplementary information on hover/focus.
 *
 * ### When to use
 * Use for describing icon-only buttons, explaining form details, defining specific labels.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Components/UI/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="p-8 flex justify-center">
        <Tooltip>
          <TooltipTrigger render={(props) => (
            <Button {...props} variant="ghost" size="icon-xs" className="size-8 rounded-full border">
              <HelpCircle className="size-4 text-muted-foreground" />
            </Button>
          )} />
          <TooltipContent>
            <span>Learn more about workspace sync backup settings</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}
