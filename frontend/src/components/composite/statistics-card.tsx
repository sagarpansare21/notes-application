import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatisticsCardProps {
  title: string
  value: string | number
  description: string
  icon?: LucideIcon
  changeText?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatisticsCard({
  title,
  value,
  description,
  icon: Icon,
  changeText,
  trend = 'neutral',
  className,
}: StatisticsCardProps) {
  return (
    <Card hoverable className={cn("select-none", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex flex-col gap-0.5 text-left">
          <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-[10px] text-muted-foreground/80">
            {description}
          </CardDescription>
        </div>
        {Icon && <Icon className="size-4 text-muted-foreground/75 shrink-0" />}
      </CardHeader>
      <CardContent className="pt-2 flex flex-col items-start">
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {changeText && (
          <span
            className={cn(
              "text-[9px] font-medium mt-1",
              trend === 'up' && "text-green-500",
              trend === 'down' && "text-red-500",
              trend === 'neutral' && "text-muted-foreground"
            )}
          >
            {changeText}
          </span>
        )}
      </CardContent>
    </Card>
  )
}
