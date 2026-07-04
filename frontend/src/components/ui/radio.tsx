import * as React from 'react'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = 'RadioGroup'

export const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadioPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioPrimitive.Root
      ref={ref}
      className={cn(
        "aspect-square size-4 rounded-full border border-border bg-background text-foreground shadow-sm transition-all focus:outline-none focus:ring-3 focus:ring-ring/25 focus:border-ring disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:border-primary data-[checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center text-current">
        <Circle className="size-2 fill-primary text-primary" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'
