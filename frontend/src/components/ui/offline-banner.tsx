import { WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OfflineBannerProps {
  className?: string
}

export function OfflineBanner({ className }: OfflineBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-center gap-2 w-full px-4 py-2',
        'bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-400',
        'text-xs font-medium animate-in slide-in-from-top duration-300',
        className
      )}
    >
      <WifiOff className="size-3.5 shrink-0" />
      <span>
        You&apos;re offline. Changes will sync when you reconnect.
      </span>
    </div>
  )
}
