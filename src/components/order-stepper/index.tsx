import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { step: 1, label: "장바구니" },
  { step: 2, label: "주문/결제" },
  { step: 3, label: "완료" },
] as const

interface OrderStepperProps {
  currentStep: 1 | 2 | 3
}

export function OrderStepper({ currentStep }: OrderStepperProps) {
  return (
    <div className="hidden md:block py-10">
      <div className="flex items-center justify-center gap-4">
        {STEPS.map((item, index) => (
          <div key={item.step} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  currentStep === item.step
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {String(item.step).padStart(2, "0")}.
              </span>
              <span
                className={cn(
                  "text-xl",
                  currentStep === item.step
                    ? "font-bold"
                    : "font-normal text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <ChevronRight className="text-border h-5 w-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
