import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(255, { message: 'Title must be 255 characters or less' }),
  content: z
    .string()
    .min(1, { message: 'Content is required' }),
  tags: z.array(z.string()),
})

export type CreateNoteFormValues = z.infer<typeof createNoteSchema>
