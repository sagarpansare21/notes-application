import type { Meta, StoryObj } from '@storybook/react'
import { ImportDropzone } from '../components/composite/import-dropzone'

/**
 * ### Purpose
 * Drag-and-drop import file component supporting custom formats.
 *
 * ### When to use
 * Use in data backup pages and settings import modals.
 */
const meta: Meta<typeof ImportDropzone> = {
  title: 'Composite/ImportDropzone',
  component: ImportDropzone,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof ImportDropzone>

export const Default: Story = {
  args: {
    onFileSelect: (file) => console.log('Selected file:', file.name),
  },
}
