import type { Meta, StoryObj } from '@storybook/react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'

/**
 * ### Purpose
 * A dropdown select menu displaying multiple options, designed using Base UI's unstyled primitives.
 *
 * ### When to use
 * Use when selecting a single item from a defined list of 5 or more options.
 *
 * ### When not to use
 * Do not use for binary selections (use Switch/Checkbox) or when there are 3 or fewer choices (use RadioGroup).
 *
 * ### Accessibility Notes
 * Fully keyboard navigation compliant (Up/Down arrow keys, Enter, Escape to close) with correct ARIA selection states.
 */
const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="disabled" disabled>Disabled Fruit</SelectItem>
      </SelectContent>
    </Select>
  ),
}
