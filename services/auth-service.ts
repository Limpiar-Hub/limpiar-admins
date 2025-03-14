import { STORAGE_KEYS } from "@/lib/constants"
import type { AuthResponse, RegistrationData } from "@/types"
import { post } from "./http-client"

/**
 * Login with email and password
 * @returns userId for verification
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await post<any>("/auth/login", { email, password }, { skipAuth: true })

    return {
      success: true,
      userId: response.userId,
      message: response.message || "Verification code sent to your phone.",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Verify login with phone number and OTP code
 * @returns user data and token
 */
export async function verifyLogin(phoneNumber: string, code: string): Promise<AuthResponse> {
  try {
    const response = await post<any>("/auth/verify-login", { phoneNumber, code }, { skipAuth: true })

    // Store token in localStorage for future requests
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)

    // Store user data
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

    return {
      success: true,
      token: response.token,
      user: response.user,
      message: response.message || "Login successful.",
    }
  } catch (error) {
    console.error("Verification error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Register a new user
 * Available roles: property_manager, admin, cleaning_business, cleaner
 */
export async function register(userData: RegistrationData): Promise<AuthResponse> {
  try {
    const response = await post<any>("/auth/register", userData, { skipAuth: true })

    // Store phone number for verification
    localStorage.setItem(STORAGE_KEYS.PHONE_NUMBER, userData.phoneNumber)

    return {
      success: true,
      message: response.message || "Verification code sent to your phone.",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Verify registration with phone number and OTP code
 */
export async function verifyRegistration(phoneNumber: string, code: string): Promise<AuthResponse> {
  try {
    const response = await post<any>("/auth/verify-register", { phoneNumber, code }, { skipAuth: true })

    // Store token in localStorage for future requests
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token)

    // Store user data
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

    return {
      success: true,
      token: response.token,
      user: response.user,
      message: response.message || "Registration successful.",
    }
  } catch (error) {
    console.error("Verification error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Resend OTP code
 */
export async function resendOTP(payload: { userId?: string; phoneNumber?: string }): Promise<AuthResponse> {
  try {
    const response = await post<any>("/auth/resend-otp", payload, { skipAuth: true })

    return {
      success: true,
      message: response.message || "OTP code resent successfully.",
      userId: response.userId,
      phoneNumber: response.phoneNumber,
    }
  } catch (error) {
    console.error("Resend OTP error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  try {
    const response = await post<any>("/auth/reset-password", { email }, { skipAuth: true })

    return {
      success: true,
      message: response.message || "Password reset link sent to your email.",
    }
  } catch (error) {
    console.error("Password reset request error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
  try {
    const response = await post<any>("/auth/reset-password/confirm", { token, newPassword }, { skipAuth: true })

    return {
      success: true,
      message: response.message || "Password reset successful.",
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  return !!token
}

/**
 * Get current user data
 */
export function getCurrentUser() {
  if (typeof window === "undefined") return null
  const userJson = localStorage.getItem(STORAGE_KEYS.USER)
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

