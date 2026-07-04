import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DeleteDialog } from '../components/composite/delete-dialog'
import { Button } from '../components/ui/button'

/**
 * ### Purpose
 * Absolute modal warning overlay verifying a destructive delete note action.
 *
 * ### When to use
 * Use when a user clicks the delete button on any note or tag item.
 */
const meta: Meta<typeof DeleteDialog> = {
  title: 'Composite/DeleteDialog',
  component: DeleteDialog,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

const DeleteDialogDemo = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="p-8 flex justify-center">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Trigger Delete Confirm
      </Button>
      <DeleteDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          alert('Confirmed deletion!')
          setOpen(false)
        }}
      />
    </div>
  )
}

export const Interactive: StoryObj<typeof DeleteDialog> = {
  render: () => <DeleteDialogDemo />,
}
