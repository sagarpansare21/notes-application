import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '../components/ui/shadcn/switch'

/**
 * ### Purpose
 * An interactive slider selector toggle used to activate states instantly.
 *
 * ### When to use
 * Use for binary settings like toggling light/dark themes, notifications on/off.
 *
 * ### When not to use
 * Do not use inside large form submissions where changes should only apply after a Submit click (use Checkbox instead).
 */
const meta: Meta<typeof Switch> = {
  title: 'Components/UI/Switch',
  component: Switch,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="s1" />
      <label htmlFor="s1" className="text-xs text-foreground cursor-pointer">
        Enable dark mode
      </label>
    </div>
  ),
}

export const ActiveChecked: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="s2" defaultChecked />
      <label htmlFor="s2" className="text-xs text-foreground cursor-pointer">
        Enabled switch
      </label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="s3" disabled />
      <label htmlFor="s3" className="text-xs text-muted-foreground cursor-not-allowed">
        Disabled switch
      </label>
    </div>
  ),
}
