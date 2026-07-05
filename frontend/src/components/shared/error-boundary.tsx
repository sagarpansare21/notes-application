import { Component, useState, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle, RefreshCcw, Copy, Check, RefreshCw, Terminal } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorDisplayProps {
  error: Error | null
  onReset: () => void
}

function ErrorDisplay({ error, onReset }: ErrorDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleCopy = () => {
    if (!error) return
    navigator.clipboard.writeText(`${error.name}: ${error.message}\n\nStack:\n${error.stack || ''}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleHardReload = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-background to-secondary/20 p-6 text-center select-none antialiased">
      {/* Background glow decorator */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-destructive/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-8 shadow-2xl shadow-destructive/5 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center size-14 rounded-2xl bg-destructive/10 border border-destructive/20 mx-auto mb-6 shadow-inner animate-pulse">
          <AlertCircle className="size-6 text-destructive" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-foreground mb-2">
          Application Error Occurred
        </h1>
        <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed font-medium">
          Something went wrong under the hood. Our application encountered an unexpected runtime crash.
        </p>

        {error && (
          <div className="w-full text-left mb-6">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Terminal className="size-3.5" />
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
              {showDetails && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy error</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {showDetails && (
              <div className="rounded-xl border border-border/60 bg-muted/50 p-4 font-mono text-[10px] leading-normal text-muted-foreground max-h-48 overflow-y-auto w-full select-text selection:bg-destructive/20 break-words">
                <span className="font-semibold text-destructive">{error.name}:</span> {error.message}
                {error.stack && (
                  <div className="mt-2 text-[9px] opacity-75 whitespace-pre-wrap">
                    {error.stack}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center w-full">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-md"
          >
            <RefreshCcw className="size-4" />
            Try again
          </button>

          <button
            onClick={handleHardReload}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground hover:bg-accent active:scale-98 transition-all cursor-pointer"
          >
            <RefreshCw className="size-4" />
            Hard Reload
          </button>
        </div>
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return <ErrorDisplay error={this.state.error} onReset={this.handleReset} />
    }

    return this.props.children
  }
}
