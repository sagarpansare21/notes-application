import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio'

/**
 * ### Purpose
 * Standard radio buttons list allowing selection of exactly one option from a set of choices.
 *
 * ### When to use
 * Use for selecting a single item from a brief list of mutually exclusive choices (usually 2 to 4 options).
 *
 * ### When not to use
 * Do not use for listing more than 5 options (use Select dropdown list to preserve screen layout).
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="r1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="r1" id="r1" />
        <label htmlFor="r1" className="text-xs text-foreground cursor-pointer">Option One</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="r2" id="r2" />
        <label htmlFor="r2" className="text-xs text-foreground cursor-pointer">Option Two</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="r3" id="r3" disabled />
        <label htmlFor="r3" className="text-xs text-muted-foreground cursor-not-allowed">Option Disabled</label>
      </div>
    </RadioGroup>
  ),
}
