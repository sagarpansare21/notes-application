import React, { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNoteSchema, type CreateNoteFormValues } from '@/lib/validation/note'
import { cn } from '@/lib/utils'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { MarkdownEditor } from '../../ui/markdown-editor'

interface NoteFormProps {
  onSubmit: (data: { title: string; content: string; tags: string[] }) => void
  onCancel?: () => void
  isLoading?: boolean
  onDirtyChange?: (dirty: boolean) => void
  open?: boolean
  mode?: 'create' | 'edit'
  initialValues?: { title: string; content: string; tags: string[] }
  // Called on every change when in edit mode — for auto-save
  onAutoSave?: (data: { title: string; content: string; tags: string[] }) => void
  autoSaveStatus?: 'idle' | 'saving' | 'saved' | 'error'
}

export function NoteForm({
  onSubmit,
  onCancel,
  isLoading = false,
  onDirtyChange,
  open,
  mode = 'create',
  initialValues,
  onAutoSave,
  autoSaveStatus = 'idle',
}: NoteFormProps) {
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid, touchedFields, isDirty, isSubmitSuccessful },
  } = useForm<CreateNoteFormValues>({
    resolver: zodResolver(createNoteSchema),
    mode: 'all',
    defaultValues: initialValues ?? {
      title: '',
      content: '',
      tags: [],
    },
  })

  useEffect(() => {
    onDirtyChange?.(isDirty && !isSubmitSuccessful)
  }, [isDirty, isSubmitSuccessful, onDirtyChange])

  // Reset form when create drawer closes or when edit note changes
  useEffect(() => {
    if (mode === 'create' && !open) {
      reset()
    }
  }, [open, reset, mode])

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      reset(initialValues)
    }
  }, [initialValues?.title, initialValues?.content, initialValues?.tags, reset, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save: watch all fields and call onAutoSave after a change
  const watchedValues = watch()
  const onAutoSaveRef = React.useRef(onAutoSave)
  useEffect(() => { onAutoSaveRef.current = onAutoSave })

  useEffect(() => {
    if (mode !== 'edit' || !onAutoSaveRef.current) return
    const timer = setTimeout(() => {
      onAutoSaveRef.current?.({
        title: watchedValues.title,
        content: watchedValues.content,
        tags: watchedValues.tags,
      })
    }, 800)
    return () => clearTimeout(timer)
  }, [watchedValues.title, watchedValues.content, watchedValues.tags, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTag = useCallback((
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
  }, [tagInput])

  const handleRemoveTag = useCallback((
    tagToRemove: string,
    tags: string[],
    onChange: (tags: string[]) => void
  ) => {
    onChange(tags.filter((t) => t !== tagToRemove))
  }, [])

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data)
  })

  const autoSaveLabel = {
    idle: null,
    saving: <span className="text-[10px] text-muted-foreground animate-pulse">Saving…</span>,
    saved: <span className="text-[10px] text-muted-foreground">✓ Saved</span>,
    error: <span className="text-[10px] text-destructive">⚠ Save failed</span>,
  }[autoSaveStatus]

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

      <div className="flex items-center justify-between gap-2 pt-4 border-t border-border mt-auto shrink-0 select-none">
        {/* Auto-save status (edit mode) */}
        <div className="min-h-[16px]">{autoSaveLabel}</div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              size="sm"
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          {mode === 'create' && (
            <Button
              type="submit"
              size="sm"
              disabled={!isValid}
              loading={isLoading}
            >
              Create Note
            </Button>
          )}
          {mode === 'edit' && (
            <Button
              type="submit"
              size="sm"
              disabled={!isValid}
              loading={isLoading}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
