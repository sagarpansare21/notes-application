import * as React from 'react'
import { UploadCloud, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export interface ImportDropzoneProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSizeMB?: number
  loading?: boolean
}

export function ImportDropzone({
  onFileSelect,
  accept = ".json",
  maxSizeMB = 2,
  loading = false,
}: ImportDropzoneProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size exceeds limit of ${maxSizeMB}MB`)
        return
      }
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size exceeds limit of ${maxSizeMB}MB`)
        return
      }
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-card transition-all duration-150 text-center",
        dragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30",
        selectedFile ? "border-solid border-green-500/50 bg-green-500/5" : ""
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
        disabled={loading}
      />

      {selectedFile ? (
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-foreground">{selectedFile.name}</span>
            <span className="text-[10px] text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB • Ready to restore
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFile(null)
                if (inputRef.current) inputRef.current.value = ""
              }}
              disabled={loading}
            >
              Clear
            </Button>
            <Button size="sm" loading={loading} onClick={() => alert("Restoring database...")}>
              Restore Database
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <UploadCloud className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-foreground">Drag and drop workspace backup file</span>
            <span className="text-[10px] text-muted-foreground">
              Supports {accept} files up to {maxSizeMB}MB
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            Choose File
          </Button>
        </div>
      )}
    </div>
  )
}
