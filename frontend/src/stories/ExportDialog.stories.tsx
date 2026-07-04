import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ExportDialog } from '../components/composite/export-dialog'
import { Button } from '../components/ui/button'

/**
 * ### Purpose
 * Selection modal overlay choosing backup formats (JSON vs Markdown).
 *
 * ### When to use
 * Use when a user clicks the export button in Settings or sidebar controls.
 */
const meta: Meta<typeof ExportDialog> = {
  title: 'Composite/ExportDialog',
  component: ExportDialog,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

const ExportDialogDemo = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="p-8 flex justify-center">
      <Button onClick={() => setOpen(true)}>
        Trigger Export Menu
      </Button>
      <ExportDialog
        open={open}
        onOpenChange={setOpen}
        onExport={(format) => {
          alert(`Exporting workspace in ${format} format...`)
          setOpen(false)
        }}
      />
    </div>
  )
}

export const Interactive: StoryObj<typeof ExportDialog> = {
  render: () => <ExportDialogDemo />,
}
