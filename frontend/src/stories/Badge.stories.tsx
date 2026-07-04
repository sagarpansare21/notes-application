import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../components/ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'success', 'info', 'warning', 'destructive'],
      description: 'The visual variant styling of the badge',
    },
    children: {
      control: 'text',
      description: 'The text label content of the badge',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Personal',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Work',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: 'Archived',
    variant: 'outline',
  },
}

export const Success: Story = {
  args: {
    children: 'Completed',
    variant: 'success',
  },
}

export const Info: Story = {
  args: {
    children: 'In Progress',
    variant: 'info',
  },
}

export const Warning: Story = {
  args: {
    children: 'Urgent',
    variant: 'warning',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Deleted',
    variant: 'destructive',
  },
}
