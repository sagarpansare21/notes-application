import React from 'react'
import { UploadCloud, FileJson, FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ExportImportPanelProps {
  // Import states
  isDragActive: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  importProgress: number
  isImporting: boolean
  importError: string | null
  importSuccess: boolean
  importedStats: { imported: number; skipped: number; failed: number } | null

  // Export states
  isExporting: boolean
  onExport: (format: 'json' | 'markdown') => void
}

export function ExportImportPanel({
  isDragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  fileInputRef,
  importProgress,
  isImporting,
  importError,
  importSuccess,
  importedStats,
  isExporting,
  onExport,
}: ExportImportPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {/* Import Card */}
      <Card className="border border-border/80 bg-card shadow-sm flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Import Notes</CardTitle>
            <CardDescription className="text-xs">
              Upload a previously exported JSON file to restore your notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer select-none transition-all duration-200 ${
                isDragActive
                  ? 'border-primary bg-primary/5 scale-[0.99] shadow-inner'
                  : 'border-border/80 hover:border-muted-foreground/30 hover:bg-muted/10'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                accept=".json"
                className="hidden"
                disabled={isImporting}
              />
              <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/80 text-muted-foreground border border-border/40 shrink-0">
                <UploadCloud className="size-6" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground">
                  Drag and drop your export file here
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                  Support JSON format only
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-8 font-semibold shrink-0 cursor-pointer pointer-events-none"
              >
                Browse File
              </Button>
            </div>

            {/* Importing Progress Bar */}
            {isImporting && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>Uploading and parsing notes...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-foreground h-1.5 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Validation/API Errors */}
            {importError && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-destructive/15 bg-destructive/5 text-destructive animate-in fade-in duration-200 text-xs text-left">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Import Failed</p>
                  <p className="opacity-90 mt-0.5">{importError}</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {importSuccess && importedStats && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-green-500/15 bg-green-500/5 text-green-700 dark:text-green-400 animate-in fade-in duration-200 text-xs text-left">
                <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Import Successful</p>
                  <p className="opacity-90 mt-1 flex flex-wrap gap-x-3 gap-y-1 font-medium">
                    <span>Imported: <strong>{importedStats.imported}</strong></span>
                    <span>Skipped: <strong>{importedStats.skipped}</strong></span>
                    <span>Failed: <strong>{importedStats.failed}</strong></span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Export Card */}
      <Card className="border border-border/80 bg-card shadow-sm flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Export Notes</CardTitle>
            <CardDescription className="text-xs">
              Backup your notes in JSON or Markdown format to download them local.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              {/* Export JSON Option */}
              <div className="flex items-center justify-between p-3.5 border border-border/60 rounded-xl hover:border-border transition-colors duration-150 text-left bg-muted/5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-lg bg-secondary/80 text-muted-foreground shrink-0">
                    <FileJson className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Export as JSON</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Contains raw note content, tags, and system timestamps.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isExporting}
                  onClick={() => onExport('json')}
                  className="h-8 text-xs font-semibold cursor-pointer shrink-0"
                >
                  <Download className="size-3.5 mr-1" />
                  JSON
                </Button>
              </div>

              {/* Export Markdown Option */}
              <div className="flex items-center justify-between p-3.5 border border-border/60 rounded-xl hover:border-border transition-colors duration-150 text-left bg-muted/5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-lg bg-secondary/80 text-muted-foreground shrink-0">
                    <FileText className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Export as Markdown</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Saves your notes as individual markdown (.md) documents.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isExporting}
                  onClick={() => onExport('markdown')}
                  className="h-8 text-xs font-semibold cursor-pointer shrink-0"
                >
                  <Download className="size-3.5 mr-1" />
                  Markdown
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
