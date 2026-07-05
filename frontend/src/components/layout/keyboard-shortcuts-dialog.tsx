import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/shadcn/dialog'
import { Button } from '@/components/ui/shadcn/button'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate the application efficiently.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 border-t border-b border-border/60 py-4 text-xs">
            <div className="font-semibold text-muted-foreground text-left flex items-center">Action</div>
            <div className="font-semibold text-muted-foreground text-right flex items-center justify-end">Mac / Windows</div>

            <div className="text-foreground text-left font-medium">New Note</div>
            <div className="text-right flex flex-col gap-1 items-end">
              <div>
                <span className="text-[10px] text-muted-foreground mr-1.5">Mac:</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">⌥ Option</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">N</kbd>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mr-1.5">Win:</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">Alt</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">N</kbd>
              </div>
            </div>

            <div className="text-foreground text-left font-medium">Focus Search</div>
            <div className="text-right flex flex-col gap-1 items-end">
              <div>
                <span className="text-[10px] text-muted-foreground mr-1.5">Mac:</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">⌘ Cmd</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">K</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">/</kbd>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mr-1.5">Win:</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">K</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">/</kbd>
              </div>
            </div>

            <div className="text-foreground text-left font-medium">Toggle Sidebar</div>
            <div className="text-right flex flex-col gap-1 items-end">
              <div>
                <span className="text-[10px] text-muted-foreground mr-1.5">Mac:</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">⌘ Cmd</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">B</kbd>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mr-1.5">Win:</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">B</kbd>
              </div>
            </div>

            <div className="text-foreground text-left font-medium">Toggle Dark Mode</div>
            <div className="text-right flex flex-col gap-1 items-end">
              <div>
                <span className="text-[10px] text-muted-foreground mr-1.5">Mac:</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">⌥ Option</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">T</kbd>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground mr-1.5">Win:</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">Alt</kbd> + <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono shadow-xs">T</kbd>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => onOpenChange(false)} size="sm" className="cursor-pointer">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
