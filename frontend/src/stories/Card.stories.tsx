import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '../components/ui/card'

const meta: Meta<typeof Card> = {
  title: 'Components/UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    hoverable: {
      control: 'boolean',
      description: 'Whether the card raises and highlights on hover',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the card is visually selected',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-[360px]">
      <CardHeader>
        <CardTitle>Default Workspace</CardTitle>
        <CardDescription>Created by Administrator</CardDescription>
      </CardHeader>
      <CardContent>
        This is a standard card container designed to hold notes, tasks, or settings inside your dashboard workspace.
      </CardContent>
      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span>Shared with 2 users</span>
        <span>2 mins ago</span>
      </CardFooter>
    </Card>
  ),
  args: {
    hoverable: false,
    selected: false,
  },
}

export const Hover: Story = {
  render: (args) => (
    <Card {...args} className="max-w-[360px]">
      <CardHeader>
        <CardTitle>Interactive Note</CardTitle>
        <CardDescription>Hover over me to see effect</CardDescription>
      </CardHeader>
      <CardContent>
        Hovering over this card applies a subtle upward translation and shadow enhancement, signaling clickability.
      </CardContent>
      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span>Public access</span>
        <span>Just now</span>
      </CardFooter>
    </Card>
  ),
  args: {
    hoverable: true,
    selected: false,
  },
}

export const Selected: Story = {
  render: (args) => (
    <Card {...args} className="max-w-[360px]">
      <CardHeader>
        <CardTitle>Selected Item</CardTitle>
        <CardDescription>Highlighted state</CardDescription>
      </CardHeader>
      <CardContent>
        When selected, this card displays a primary-colored border ring and a very light accent background overlay.
      </CardContent>
      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span>Selected</span>
        <span>Active</span>
      </CardFooter>
    </Card>
  ),
  args: {
    hoverable: true,
    selected: true,
  },
}
