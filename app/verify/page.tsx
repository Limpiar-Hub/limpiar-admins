"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { verifyLogin, verifyRegistration, resendOTP } from "@/services/auth-service"
import { Loader2 } from "lucide-react"
import { ROUTES, STORAGE_KEYS } from "@/lib/constants"
import { maskSensitiveInfo } from "@/lib/utils"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isRegistration, setIsRegistration] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const userIdParam = searchParams.get("userId")
    const phoneParam = searchParams.get("phoneNumber")
    const isRegParam = searchParams.get("isRegistration")

    if (isRegParam === "true") {
      setIsRegistration(true)
    }

    // Set userId from URL param or localStorage
    if (userIdParam) {
      setUserId(userIdParam)
    } else {
      const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID)
      if (storedUserId) {
        setUserId(storedUserId)
      }
    }

    // Set phoneNumber from URL param or localStorage
    if (phoneParam) {
      setPhoneNumber(decodeURIComponent(phoneParam))
    } else {
      const storedPhoneNumber = localStorage.getItem(STORAGE_KEYS.PHONE_NUMBER)
      if (storedPhoneNumber) {
        setPhoneNumber(storedPhoneNumber)
        if (isRegParam !== "true") {
          
          setIsRegistration(false)
        }
      } else {
        toast({
          title: "Session information missing",
          description: "Please enter your verification code or request a new one.",
          variant: "destructive",
        })
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join("")
    if (otpString.length !== 6) return

    setIsLoading(true)

    try {
      let result

      if (isRegistration) {
        // Handle registration verification
        if (!phoneNumber) {
          throw new Error("Phone number not found. Please try again.")
        }

        result = await verifyRegistration(phoneNumber, otpString)
      } else {
        // Handle login verification
        if (!phoneNumber && !userId) {
          throw new Error("User information not found. Please try again.")
        }

        // Use userId and phoneNumber for verification
        result = await verifyLogin(phoneNumber || "", otpString, userId || undefined)
      }

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Verification successful",
        description: isRegistration
          ? "Your account has been created successfully."
          : "You have been logged in successfully.",
      })

      // Clear the stored data from localStorage
      localStorage.removeItem(STORAGE_KEYS.PHONE_NUMBER)
      localStorage.removeItem(STORAGE_KEYS.USER_ID)

      // Redirect to dashboard
      router.push(ROUTES.USERS)
    } catch (error) {
      console.error("Verification error:", error)
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
      // Clear the OTP input fields on failure
      setOtp(["", "", "", "", "", ""])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (timeLeft > 0) return

    try {
      const payload = userId ? { userId } : phoneNumber ? { phoneNumber } : null

      if (!payload) {
        throw new Error("No user ID or phone number available for resending OTP")
      }

      const result = await resendOTP(payload)

      if (!result.success) {
        throw new Error(result.message)
      }

      setTimeLeft(60)
      setOtp(["", "", "", "", "", ""])

      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your phone.",
      })
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend verification code. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-[#EBF5FF] px-6 py-3">
            <Image src="/logo.jpg" alt="Limpiar Logo" width={165} height={48} priority />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Enter OTP Code</h1>
          <p className="text-gray-600">
            Enter the one-time code sent to {phoneNumber ? maskSensitiveInfo(phoneNumber) : "your phone"} to confirm
            your account and start with Limpiar
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0082ed] hover:bg-[#0082ed]/90 text-white py-2 rounded-lg"
            disabled={isLoading || otp.some((digit) => !digit)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={handleResendOTP}
            disabled={timeLeft > 0}
            className="text-[#0082ed] text-sm hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  )
}

