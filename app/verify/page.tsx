"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const userIdParam = searchParams.get("userId")
    const phoneParam = searchParams.get("phoneNumber")

    if (userIdParam && phoneParam) {
      setUserId(userIdParam)
      setPhoneNumber(decodeURIComponent(phoneParam))
    } else {
      const storedPhoneNumber = localStorage.getItem("phoneNumber")
      if (storedPhoneNumber) {
        setPhoneNumber(storedPhoneNumber)
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

    // Move to next input if value is entered
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
      const response = await fetch("https://limpiar-backend.onrender.com/api/auth/verify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          code: otpString,
        }),
      })

      const data = await response.json()

      console.log("Full response:", response)
      console.log("Response status:", response.status)
      console.log("Response data:", data)

      if (response.ok) {
        console.log("Verification successful, response:", data)
        localStorage.setItem("token", data.token)
        localStorage.removeItem("phoneNumber")
        // Only redirect on successful verification
        router.push("/users", { replace: true })
      } else {
        console.error("Verification failed, response:", data)
        let errorMessage = "Verification failed. Please try again."
        if (data && data.message) {
          errorMessage = data.message
        }
        throw new Error(errorMessage)
      }
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
      const payload: Record<string, string> = {}
      if (userId) payload.userId = userId
      if (phoneNumber) payload.phoneNumber = phoneNumber

      if (!userId && !phoneNumber) {
        toast({
          title: "Session information missing",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        })
        return
      }

      console.log("Resend OTP payload:", payload)

      const response = await fetch("https://limpiar-backend.onrender.com/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      console.log("Resend OTP full response:", response)
      console.log("Resend OTP response status:", response.status)

      const data = await response.json()
      console.log("Resend OTP response data:", data)

      if (response.ok) {
        setTimeLeft(60)
        setOtp(["", "", "", "", "", ""])
        toast({
          title: "Code resent",
          description: "A new verification code has been sent to your phone.",
        })
        // Update userId and phoneNumber if they're returned in the response
        if (data.userId) setUserId(data.userId)
        if (data.phoneNumber) setPhoneNumber(data.phoneNumber)
      } else {
        throw new Error(data.message || "Failed to resend code")
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend verification code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const maskPhoneNumber = (phone: string) => {
    if (!phone) return ""
    const last4 = phone.slice(-4)
    return `***-***-${last4}`
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
            Enter the one-time code sent to {phoneNumber ? maskPhoneNumber(phoneNumber) : "your phone"} to confirm your
            account and start with Limpiar
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
            {isLoading ? "Verifying..." : "Confirm"}
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