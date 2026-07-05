import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from '../components/ui/pagination'

/**
 * ### Purpose
 * Pagination control list for shifting between content pages.
 *
 * ### When to use
 * Use for notes lists or audit logs extending past 20 items.
 */
const meta: Meta<typeof Pagination> = {
  title: 'Components/UI/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      autodocs: true,
    },
  },
}
export default meta

const PaginationDemo = () => {
  const [page, setPage] = React.useState(2)
  return (
    <div className="p-4 border rounded-xl bg-card shadow-sm max-w-lg mx-auto">
      <Pagination currentPage={page} totalPages={8} onPageChange={setPage} />
    </div>
  )
}

export const Interactive: StoryObj<typeof Pagination> = {
  render: () => <PaginationDemo />,
}
