import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MarkdownEditor } from '../components/ui/markdown-editor'

const meta: Meta<typeof MarkdownEditor> = {
  title: 'Components/UI/MarkdownEditor',
  component: MarkdownEditor,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof MarkdownEditor>

function InteractiveEditorWrapper(args: React.ComponentProps<typeof MarkdownEditor>) {
  const [value, setValue] = useState(args.value || '')
  return (
    <div className="p-4 max-w-xl bg-card border border-border rounded-xl">
      <MarkdownEditor {...args} value={value} onChange={setValue} />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <InteractiveEditorWrapper {...args} />,
  args: {
    label: 'Content',
    value: '# Heading 1\n\nWrite some **bold** and *italic* text here!\n\n- Bullet item 1\n- Bullet item 2',
  },
}

export const ValidationError: Story = {
  render: (args) => <InteractiveEditorWrapper {...args} />,
  args: {
    label: 'Content',
    value: '',
    error: 'Content is required.',
  },
}
