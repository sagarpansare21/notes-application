import React, { useState, useRef, useEffect, useId } from 'react'
import { marked } from 'marked'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Eye,
  Edit3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarkdownEditorProps {
  value: string
  onChange: (val: string) => void
  error?: string
  label?: string
  required?: boolean
  placeholder?: string
}

function ToolbarButton({
  onClick,
  icon,
  title,
  disabled,
}: {
  onClick: (e: React.MouseEvent) => void
  icon: React.ReactNode
  title: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
      disabled={disabled}
      title={title}
      className={cn(
        'inline-flex items-center justify-center size-7 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none'
      )}
    >
      {icon}
    </button>
  )
}

export function MarkdownEditor({
  value,
  onChange,
  error,
  label = 'Content',
  required = false,
  placeholder = 'Write note contents in markdown...',
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [compiledHtml, setCompiledHtml] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const defaultId = useId()
  const textareaId = `markdown-editor-${defaultId}`

  // Sync Markdown to HTML on preview tab selection
  useEffect(() => {
    if (activeTab === 'preview') {
      const rawHtml = marked.parse(value || '')
      if (typeof rawHtml === 'string') {
        setCompiledHtml(rawHtml)
      } else {
        rawHtml.then((html) => setCompiledHtml(html)).catch(() => setCompiledHtml(''))
      }
    }
  }, [value, activeTab])

  const insertMarkdown = (syntaxBefore: string, syntaxAfter: string, defaultValue: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = value || ''
    const selection = text.substring(start, end)

    const replacement = selection
      ? `${syntaxBefore}${selection}${syntaxAfter}`
      : `${syntaxBefore}${defaultValue}${syntaxAfter}`

    const newValue = text.substring(0, start) + replacement + text.substring(end)
    onChange(newValue)

    // Refocus and reset cursor position selection range
    setTimeout(() => {
      textarea.focus()
      const newCursorStart = start + syntaxBefore.length
      const newCursorEnd = newCursorStart + (selection ? selection.length : defaultValue.length)
      textarea.setSelectionRange(newCursorStart, newCursorEnd)
    }, 0)
  }

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-muted-foreground select-none"
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
        {/* Tab Toggle buttons */}
        <div className="flex items-center border border-border bg-muted/20 rounded-md p-0.5 select-none gap-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={cn(
              'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-all duration-150',
              activeTab === 'edit'
                ? 'bg-card text-foreground shadow-sm border border-border/40'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Edit3 className="size-3" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={cn(
              'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-all duration-150',
              activeTab === 'preview'
                ? 'bg-card text-foreground shadow-sm border border-border/40'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Eye className="size-3" />
            Preview
          </button>
        </div>
      </div>

      <div
        className={cn(
          'w-full rounded-lg border border-border bg-background transition-all duration-150 overflow-hidden focus-within:border-ring',
          error && 'border-destructive focus-within:border-destructive'
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 bg-muted/20 border-b border-border p-1.5 select-none">
          <ToolbarButton
            onClick={() => insertMarkdown('**', '**', 'bold text')}
            icon={<Bold className="size-3.5" />}
            title="Bold"
            disabled={activeTab === 'preview'}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('*', '*', 'italic text')}
            icon={<Italic className="size-3.5" />}
            title="Italic"
            disabled={activeTab === 'preview'}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('~~', '~~', 'strikethrough')}
            icon={<Strikethrough className="size-3.5" />}
            title="Strike"
            disabled={activeTab === 'preview'}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('`', '`', 'code')}
            icon={<Code className="size-3.5" />}
            title="Inline Code"
            disabled={activeTab === 'preview'}
          />
          <div className="w-[1px] h-4 bg-border mx-1" />
          <ToolbarButton
            onClick={() => insertMarkdown('# ', '', 'Heading 1')}
            icon={<Heading1 className="size-3.5" />}
            title="Heading 1"
            disabled={activeTab === 'preview'}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('## ', '', 'Heading 2')}
            icon={<Heading2 className="size-3.5" />}
            title="Heading 2"
            disabled={activeTab === 'preview'}
          />
          <div className="w-[1px] h-4 bg-border mx-1" />
          <ToolbarButton
            onClick={() => insertMarkdown('- ', '', 'List item')}
            icon={<List className="size-3.5" />}
            title="Bullet List"
            disabled={activeTab === 'preview'}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('1. ', '', 'List item')}
            icon={<ListOrdered className="size-3.5" />}
            title="Ordered List"
            disabled={activeTab === 'preview'}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('> ', '', 'Blockquote')}
            icon={<Quote className="size-3.5" />}
            title="Blockquote"
            disabled={activeTab === 'preview'}
          />
          <ToolbarButton
            onClick={() => insertMarkdown('```\n', '\n```', 'code block')}
            icon={<Code2 className="size-3.5" />}
            title="Code Block"
            disabled={activeTab === 'preview'}
          />
        </div>

        {/* Editor Body */}
        {activeTab === 'edit' ? (
          <textarea
            id={textareaId}
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[160px] max-h-[300px] outline-none border-0 bg-transparent px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none font-mono"
          />
        ) : (
          <div
            className="px-3 py-2 text-xs text-foreground min-h-[160px] max-h-[300px] overflow-y-auto ProseMirror text-left"
            dangerouslySetInnerHTML={{
              __html: compiledHtml || `<p className="text-muted-foreground italic select-none">Nothing to preview.</p>`,
            }}
          />
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive font-medium leading-none mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}
