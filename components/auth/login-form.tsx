"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { login } from "@/services/auth-service"
import { STORAGE_KEYS } from "@/lib/constants"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(false)

  // Check for remembered email
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL)
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call the login service
      const result = await login(email, password)

      if (!result.success) {
        throw new Error(result.message)
      }

      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email)
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL)
      }

      // Store phone number in localStorage for OTP verification
      if (result.phoneNumber) {
        localStorage.setItem(STORAGE_KEYS.PHONE_NUMBER, result.phoneNumber)
      }

      toast({
        title: "OTP Sent",
        description: "Please enter the OTP sent to your registered phone number.",
      })

      // Redirect to verify page with the user ID and phone number
      router.push(
        `/verify?userId=${result.userId}&phoneNumber=${encodeURIComponent(result.phoneNumber || "")}&isRegistration=false`,
      )
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "There was an error logging in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="hello@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Keep me signed in
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-[#0082ed] hover:underline">
            Forgot Password?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#0082ed] hover:bg-[#0082ed]/90"
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        If you don&apos;t have an account{" "}
        <Link href="/sign-up" className="text-[#0082ed] hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  )
}

