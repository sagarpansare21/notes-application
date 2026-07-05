import { useNavigate } from 'react-router'
import { FileQuestion, ArrowLeft, Home } from 'lucide-react'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center select-none antialiased relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-card/40 backdrop-blur-xs border border-border/60 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-6">
          <FileQuestion className="size-8 text-primary" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          404
        </h1>
        <h2 className="text-lg font-bold text-foreground mb-2">
          Page Not Found
        </h2>
        <p className="text-xs text-muted-foreground mb-8 max-w-xs mx-auto leading-relaxed font-medium">
          The page you are looking for doesn&apos;t exist, or has been moved to another location.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center w-full">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-accent active:scale-98 transition-all cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-md"
          >
            <Home className="size-3.5" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
