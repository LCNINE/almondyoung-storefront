import { cn } from "@/lib/utils"
import { HttpTypes } from "@medusajs/types"

interface OptionSelectProps {
  option: HttpTypes.StoreProductOption
  current?: string
  selectedValues?: string[]
  updateOption: (optionId: string, value: string) => void
  title: string
  disabled?: boolean
  "data-testid"?: string
}

export default function OptionSelect({
  option,
  current,
  selectedValues = [],
  updateOption,
  title,
  disabled,
  "data-testid": dataTestId,
}: OptionSelectProps) {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-medium">{title}</span>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const isSelected = selectedValues.includes(v) || v === current
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                {
                  "border-primary bg-primary text-primary-foreground":
                    isSelected,
                  "border-gray-200 hover:border-gray-400": !isSelected,
                  "pointer-events-none opacity-50": disabled,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}
