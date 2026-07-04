import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'

/**
 * ### Purpose
 * Circular representation of a user profile using an image source or text initials fallback.
 *
 * ### When to use
 * Use in sidebar footers, commenting lists, profile dropdown triggers, and settings panels.
 */
const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof Avatar>

export const Image: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="User avatar" />
      <AvatarFallback>SP</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" />
      <AvatarFallback>SP</AvatarFallback>
    </Avatar>
  ),
}
