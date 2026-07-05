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
  availableTags?: string[]
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
  availableTags = [],
}: NoteFormProps) {
  const [tagInput, setTagInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

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
          const suggestions = availableTags.filter(
            (tag) =>
              tag.toLowerCase().includes(tagInput.toLowerCase()) &&
              !field.value.includes(tag)
          )
          const showSuggestions = isFocused && tagInput.trim() !== '' && suggestions.length > 0

          return (
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor={tagsInputId}
                className="text-xs font-medium text-muted-foreground select-none"
              >
                Tags (Press Enter to add)
              </label>
              <div className="relative w-full">
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
                    autoComplete="off"
                    value={tagInput}
                    onFocus={() => {
                      setIsFocused(true)
                      setHighlightedIndex(0)
                    }}
                    onBlur={() => {
                      // Slight delay to allow suggestions click selection to commit first
                      setTimeout(() => setIsFocused(false), 200)
                    }}
                    onChange={(e) => {
                      setTagInput(e.target.value)
                      setHighlightedIndex(0)
                    }}
                    onKeyDown={(e) => {
                      if (showSuggestions) {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault()
                          setHighlightedIndex((prev) => (prev + 1) % suggestions.length)
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault()
                          setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
                        } else if (e.key === 'Enter') {
                          e.preventDefault()
                          const selectedTag = suggestions[highlightedIndex]
                          if (selectedTag) {
                            field.onChange([...field.value, selectedTag])
                            setTagInput('')
                          } else {
                            handleAddTag(e, field.value, field.onChange)
                          }
                        } else if (e.key === 'Escape') {
                          setIsFocused(false)
                        }
                      } else {
                        handleAddTag(e, field.value, field.onChange)
                      }
                    }}
                    placeholder={field.value.length === 0 ? 'Add tags...' : ''}
                    className="flex-1 bg-transparent py-0.5 focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                  />
                </div>

                {/* Autocomplete Suggestions Popover */}
                {showSuggestions && (
                  <ul
                    className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg w-full animate-in fade-in slide-in-from-top-1 duration-100"
                    data-testid="tags-suggestions-list"
                  >
                    {suggestions.map((tag, idx) => (
                      <li
                        key={tag}
                        onClick={() => {
                          field.onChange([...field.value, tag])
                          setTagInput('')
                        }}
                        className={cn(
                          'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs text-popover-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                          idx === highlightedIndex && 'bg-accent text-accent-foreground font-semibold'
                        )}
                        data-testid={`tag-suggestion-${tag}`}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
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
