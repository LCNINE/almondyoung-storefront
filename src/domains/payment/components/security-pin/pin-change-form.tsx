"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"
import { Card } from "@components/common/ui/card"
import PinKeypad from "./pin-keypad"
import PinDots from "./shared/pin-dots"
import { usePinKeypad } from "./hooks/use-pin-keypad"

type Step = "current" | "new" | "confirm"

export default function PinChangeForm() {
  const [step, setStep] = useState<Step>("current")
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [isShaking, setIsShaking] = useState(false)
  const { shuffledNumbers, shuffleKeypad } = usePinKeypad(true)

  const getCurrentPin = () => {
    switch (step) {
      case "current":
        return currentPin
      case "new":
        return newPin
      case "confirm":
        return confirmPin
    }
  }

  const handleNumberClick = async (value: string | number) => {
    const pin = getCurrentPin()

    if (value === "backspace") {
      switch (step) {
        case "current":
          setCurrentPin((prev) => prev.slice(0, -1))
          break
        case "new":
          setNewPin((prev) => prev.slice(0, -1))
          break
        case "confirm":
          setConfirmPin((prev) => prev.slice(0, -1))
          break
      }
    } else if (value !== "" && pin.length < 6) {
      const newPinValue = pin + value

      switch (step) {
        case "current":
          setCurrentPin(newPinValue)
          if (newPinValue.length === 6) {
            const isValid = await verifyCurrentPin(newPinValue)
            if (isValid) {
              setTimeout(() => {
                setStep("new")
                shuffleKeypad()
              }, 300)
            } else {
              handleFailure()
            }
          }
          break
        case "new":
          setNewPin(newPinValue)
          if (newPinValue.length === 6) {
            setTimeout(() => {
              setStep("confirm")
              shuffleKeypad()
            }, 300)
          }
          break
        case "confirm":
          setConfirmPin(newPinValue)
          if (newPinValue.length === 6) {
            if (newPin === newPinValue) {
              await updatePin(newPinValue)
            } else {
              handleMismatch()
            }
          }
          break
      }
    }
  }

  const verifyCurrentPin = async (pin: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/user/pin/verify", {
        method: "POST",
        body: JSON.stringify({ pin }),
      })
      return response.ok
    } catch {
      return false
    }
  }

  const updatePin = async (pin: string) => {
    try {
      await fetch("/api/user/pin", {
        method: "PUT",
        body: JSON.stringify({ pin }),
      })
      // onSuccess()
    } catch (error) {
      console.error("PIN 변경 실패:", error)
    }
  }

  const handleFailure = () => {
    setIsShaking(true)
    setTimeout(() => {
      setIsShaking(false)
      setCurrentPin("")
    }, 500)
  }

  const handleMismatch = () => {
    setIsShaking(true)
    setTimeout(() => {
      setIsShaking(false)
      setCurrentPin("")
      setNewPin("")
      setConfirmPin("")
      setStep("current")
      shuffleKeypad()
    }, 500)
  }

  const getTitle = () => {
    switch (step) {
      case "current":
        return "현재 PIN 입력"
      case "new":
        return "새로운 PIN 입력"
      case "confirm":
        return "새로운 PIN 확인"
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <KeyRound className="h-8 w-8 text-amber-600" />
          </div>

          <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
            {getTitle()}
          </h2>

          <PinDots
            length={6}
            filledCount={getCurrentPin().length}
            isShaking={isShaking}
          />
        </div>

        <PinKeypad
          shuffledNumbers={shuffledNumbers}
          handleNumberClick={handleNumberClick}
          pin={getCurrentPin()}
        />
      </Card>
    </div>
  )
}
