import type { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown'
import { Button } from '../components/ui/button'
import { Settings, FileText, Trash2 } from 'lucide-react'

/**
 * ### Purpose
 * Interactive contextual dropdown popups for selecting single choices.
 *
 * ### When to use
 * Use in list menu actions, header user settings menus, tag filters sorting triggers.
 */
const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/UI/Dropdown',
  component: DropdownMenu,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={(props) => (
        <Button {...props} variant="outline">Options Menu</Button>
      )} />
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem className="gap-2">
          <Settings className="size-3.5 text-muted-foreground" />
          <span>Edit Workspace</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <FileText className="size-3.5 text-muted-foreground" />
          <span>Export Notes</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-destructive hover:bg-destructive/10">
          <Trash2 className="size-3.5" />
          <span>Delete Folder</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
