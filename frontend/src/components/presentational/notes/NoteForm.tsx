import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNoteSchema, type CreateNoteFormValues } from '@/lib/validation/note'
import { cn } from '@/lib/utils'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { MarkdownEditor } from '../../ui/markdown-editor'

interface NoteFormProps {
  onSubmit: (data: { title: string; content: string; tags: string[] }) => void
  onCancel: () => void
  isLoading?: boolean
  onDirtyChange?: (dirty: boolean) => void
  open?: boolean
}

export function NoteForm({ onSubmit, onCancel, isLoading = false, onDirtyChange, open }: NoteFormProps) {
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, touchedFields, isDirty, isSubmitSuccessful },
  } = useForm<CreateNoteFormValues>({
    resolver: zodResolver(createNoteSchema),
    mode: 'all',
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  })

  // Report dirty state to parent component, bypassing confirmation on successful submits
  useEffect(() => {
    onDirtyChange?.(isDirty && !isSubmitSuccessful)
  }, [isDirty, isSubmitSuccessful, onDirtyChange])

  // Reset form inputs to blank state when drawer is closed
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const handleAddTag = (
    e: React.KeyboardEvent<HTMLInputElement>,
    tags: string[],
    onChange: (tags: string[]) => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const clean = tagInput.trim().toLowerCase()
      if (clean && !tags.includes(clean)) {
        onChange([...tags, clean])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (
    tagToRemove: string,
    tags: string[],
    onChange: (tags: string[]) => void
  ) => {
    onChange(tags.filter((t) => t !== tagToRemove))
  }

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <form onSubmit={onFormSubmit} noValidate className="flex flex-col gap-4 text-left">
      <Input
        label="Title"
        required
        placeholder="Note title..."
        error={touchedFields.title ? errors.title?.message : undefined}
        {...register('title')}
      />

      <Controller
        name="content"
        control={control}
        render={({ field, fieldState: { error, isTouched } }) => (
          <MarkdownEditor
            value={field.value}
            onChange={field.onChange}
            required
            error={isTouched ? error?.message : undefined}
          />
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field, fieldState: { error, isTouched } }) => {
          const tagsInputId = 'note-form-tags-input'
          return (
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor={tagsInputId}
                className="text-xs font-medium text-muted-foreground select-none"
              >
                Tags (Press Enter to add)
              </label>
              <div
                className={cn(
                  'flex flex-wrap items-center gap-1.5 min-h-[38px] w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs transition-all duration-150 focus-within:border-ring',
                  error && 'border-destructive focus-within:border-destructive'
                )}
              >
                {field.value.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full select-none"
                  >
                    <span className="truncate">{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag, field.value, field.onChange)}
                      className="hover:text-destructive font-semibold cursor-pointer px-0.5 text-[9px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id={tagsInputId}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => handleAddTag(e, field.value, field.onChange)}
                  placeholder={field.value.length === 0 ? 'Add tags...' : ''}
                  className="flex-1 bg-transparent py-0.5 focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                />
              </div>
              {isTouched && error && (
                <p className="text-xs text-destructive font-medium leading-none">
                  {error.message}
                </p>
              )}
            </div>
          )
        }}
      />

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-auto shrink-0 select-none">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          size="sm"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!isValid}
          loading={isLoading}
        >
          Create Note
        </Button>
      </div>
    </form>
  )
}
