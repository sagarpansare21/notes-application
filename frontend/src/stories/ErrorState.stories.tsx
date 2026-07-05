import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorState } from '../components/ui/error-state'

const meta: Meta<typeof ErrorState> = {
  title: 'Components/UI/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Heading of the error state' },
    message: { control: 'text', description: 'Detailed explanation message of the error' },
    retryText: { control: 'text', description: 'Label text of the retry button' },
    onRetry: { action: 'retry-clicked', description: 'Callback function for the retry button' },
  },
}

export default meta
type Story = StoryObj<typeof ErrorState>

export const General: Story = {
  args: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred while saving your changes. Please try again.',
    retryText: 'Try again',
    onRetry: () => {},
  },
}

export const ConnectionLost: Story = {
  args: {
    title: 'Network Connection Lost',
    message: 'We were unable to connect to the server. Please check your internet connection.',
    retryText: 'Retry Connection',
    onRetry: () => {},
  },
}

export const AccessDenied: Story = {
  args: {
    title: 'Access Denied',
    message: "You do not have the required permissions to view this note workspace.",
    retryText: 'Request Access',
    onRetry: () => {},
  },
}
