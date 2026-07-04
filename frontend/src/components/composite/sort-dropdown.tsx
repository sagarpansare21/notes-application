import { ArrowUpDown, Check } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown'

export interface SortDropdownProps {
  value: string
  onChange: (sortValue: string) => void
  options: { label: string; value: string }[]
}

export function SortDropdown({ value, onChange, options }: SortDropdownProps) {
  const currentOption = options.find((opt) => opt.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={(props) => (
        <Button {...props} variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs">
          <ArrowUpDown className="size-3.5 text-muted-foreground" />
          <span>Sort: {currentOption?.label || 'Default'}</span>
        </Button>
      )} />
      <DropdownMenuContent className="w-44">
        {options.map((option) => {
          const isSelected = option.value === value
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className="justify-between"
            >
              <span>{option.label}</span>
              {isSelected && <Check className="size-3.5 text-foreground shrink-0" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
