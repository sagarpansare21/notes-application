import * as React from 'react'
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Drawer = DrawerPrimitive.Root
export const DrawerTrigger = DrawerPrimitive.Trigger
export const DrawerClose = DrawerPrimitive.Close
export const DrawerPortal = DrawerPrimitive.Portal

export const DrawerBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-200",
      className
    )}
    {...props}
  />
))
DrawerBackdrop.displayName = 'DrawerBackdrop'

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Popup>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerBackdrop />
    <DrawerPrimitive.Popup
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 h-full w-full max-w-sm border-l border-border bg-background p-5 shadow-lg transition-transform duration-300 ease-in-out focus:outline-none animate-in slide-in-from-right",
        className
      )}
      {...props}
    >
      {children}
      <DrawerPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DrawerPrimitive.Close>
    </DrawerPrimitive.Popup>
  </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'

export const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-left pb-4 border-b border-border/50",
      className
    )}
    {...props}
  />
)
DrawerHeader.displayName = 'DrawerHeader'

export const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 pt-4 border-t border-border/50 mt-auto",
      className
    )}
    {...props}
  />
)
DrawerFooter.displayName = 'DrawerFooter'

export const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-sm font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = 'DrawerTitle'

export const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = 'DrawerDescription'
