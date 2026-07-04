import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '../components/ui/checkbox'

/**
 * ### Purpose
 * An input element allowing binary selection or multiple choices from a list.
 *
 * ### When to use
 * Use for selecting one or more items from a set, or checking single agreements.
 *
 * ### When not to use
 * Do not use for instantaneous on/off toggles where no form submission is needed (use Switch instead).
 *
 * ### Accessibility Notes
 * Inherits standard checkbox controls (Spacebar toggles) and reports `aria-checked` states natively.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="c1" />
      <label htmlFor="c1" className="text-xs text-foreground cursor-pointer select-none">
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="c2" defaultChecked />
      <label htmlFor="c2" className="text-xs text-foreground cursor-pointer select-none">
        Checked state
      </label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="c3" disabled />
      <label htmlFor="c3" className="text-xs text-muted-foreground cursor-not-allowed select-none">
        Disabled option
      </label>
    </div>
  ),
}
