"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type FilterRadioGroupProps = {
  items: {
    value: string
    label: string
  }[]
  value: string
  handleChange: (value: string) => void
}

export default function FilterRadioGroup({
  items,
  value,
  handleChange,
}: FilterRadioGroupProps) {
  return (
    <div className="flex items-center gap-3">
      {items.map((item, index) => (
        <div key={item.value} className="flex items-center gap-3">
          {index > 0 && (
            <Separator orientation="vertical" className="h-3" />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleChange(item.value)}
            className={cn(
              "h-auto p-0 text-sm hover:bg-transparent",
              item.value === value
                ? "font-semibold text-foreground"
                : "font-normal text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </div>
  )
}
