import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/shadcn/tabs'

/**
 * ### Purpose
 * Organizes content into tab groupings, allowing users to toggle sections inside the same context.
 *
 * ### When to use
 * Use for configuration tabs (Profile, Database, Editor settings) or categorizing views.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Components/UI/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px] border border-border p-4 rounded-xl bg-card">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tab1">General settings</TabsTrigger>
        <TabsTrigger value="tab2">Export / Import</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="text-xs text-muted-foreground pt-4">
        Customize default note format, fonts and layout configurations here.
      </TabsContent>
      <TabsContent value="tab2" className="text-xs text-muted-foreground pt-4">
        Backup your entire notes database to a local JSON archive.
      </TabsContent>
    </Tabs>
  ),
}
