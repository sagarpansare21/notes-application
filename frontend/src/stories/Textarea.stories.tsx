import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '../components/ui/textarea'
import { expect, userEvent, within } from 'storybook/test'

const meta: Meta<typeof Textarea> = {
  title: 'Components/UI/Textarea',
  component: Textarea,
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
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Write your thoughts here...',
    label: 'Note Content',
    helperText: 'Supports Markdown formatting.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox')
    
    // Focus the textarea
    await userEvent.click(textarea)
    await expect(textarea).toHaveFocus()
    
    // Type into the textarea
    await userEvent.type(textarea, 'Building a design system with Storybook.')
    await expect(textarea).toHaveValue('Building a design system with Storybook.')
  },
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Describe your notes...',
    label: 'Description',
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Write a comment...',
    label: 'Comments',
    error: 'Comments cannot exceed 200 characters.',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea field',
    label: 'System Log',
    disabled: true,
  },
}
