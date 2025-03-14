"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate a successful login without actually connecting to the backend
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

      // Generate a fake user ID
      const userId = "user_" + Math.random().toString(36).substring(2, 10)

      // Store fake token in localStorage
      localStorage.setItem("token", "fake_token_" + Math.random().toString(36).substring(2, 15))

      // Set a fake session cookie
      document.cookie = "session=fake_session; path=/; max-age=86400"

      toast({
        title: "OTP Sent",
        description: "Please enter the OTP sent to your registered phone number.",
      })

      // Redirect to verify page with the fake user ID and phone number
      router.push(`/verify?userId=${userId}&phoneNumber=${encodeURIComponent("+1234567890")}`)
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
            <Checkbox id="remember" />
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
        <Button type="submit" className="w-full bg-[#0082ed] hover:bg-[#0082ed]/90" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Login"}
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