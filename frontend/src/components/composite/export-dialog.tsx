import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'

export interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (format: string) => void
  loading?: boolean
}

export function ExportDialog({
  open,
  onOpenChange,
  onExport,
  loading = false,
}: ExportDialogProps) {
  const [format, setFormat] = useState("json")

  const handleExport = () => {
    onExport(format)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Export Workspace Data</DialogTitle>
          <DialogDescription>
            Download notes and metadata in your preferred format.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <RadioGroup value={format} onValueChange={(val) => setFormat(val as string)} className="gap-3">
            <div
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/40 cursor-pointer"
              onClick={() => setFormat("json")}
            >
              <RadioGroupItem value="json" id="r-json" />
              <label htmlFor="r-json" className="flex flex-col text-left cursor-pointer">
                <span className="text-xs font-semibold text-foreground">Portable JSON Backup</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Contains all notes, tags, and workspace structures. Re-importable.
                </span>
              </label>
            </div>

            <div
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/40 cursor-pointer"
              onClick={() => setFormat("markdown")}
            >
              <RadioGroupItem value="markdown" id="r-markdown" />
              <label htmlFor="r-markdown" className="flex flex-col text-left cursor-pointer">
                <span className="text-xs font-semibold text-foreground">Markdown Zip Archive</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Download each note as a raw Markdown file. Ideal for Obsidian/Notion.
                </span>
              </label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleExport} loading={loading} className="gap-1.5">
            <Download className="size-3.5" />
            <span>Download Backup</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
