import type { Meta, StoryObj } from '@storybook/react'
import { LoadingSpinner } from '../components/ui/loading-spinner'

/**
 * ### Purpose
 * Indefinite circular loading animation indication.
 *
 * ### When to use
 * Use inside loading buttons, spinner frames, and background database sync indicators.
 */
const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof LoadingSpinner>

export const Medium: Story = {
  args: {
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}
