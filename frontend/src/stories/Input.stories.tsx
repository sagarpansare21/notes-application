import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../components/ui/input'
import { expect, userEvent, within } from 'storybook/test'

const meta: Meta<typeof Input> = {
  title: 'Components/UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter username...',
    label: 'Username',
    helperText: 'Must be unique across workspaces.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    
    // Focus the input
    await userEvent.click(input)
    await expect(input).toHaveFocus()
    
    // Type into the input
    await userEvent.type(input, 'architect')
    await expect(input).toHaveValue('architect')
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'e.g. john.doe@example.com',
    label: 'Email address',
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Enter password...',
    label: 'Password',
    error: 'Password must be at least 8 characters long.',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled field',
    label: 'API Key',
    disabled: true,
  },
}
