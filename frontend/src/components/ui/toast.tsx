import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      className: "border-border bg-background text-foreground text-xs",
    })
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      className: "border-border bg-background text-foreground text-xs",
    })
  },
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      className: "border-border bg-background text-foreground text-xs",
    })
  },
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      className: "border-border bg-background text-foreground text-xs",
    })
  },
  default: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
      className: "border-border bg-background text-foreground text-xs",
    })
  }
}
