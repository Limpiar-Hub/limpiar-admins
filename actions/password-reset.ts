"use server"

export async function requestPasswordReset(email: string) {
  // Simulate API call to send password reset email
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, always return success
  return {
    success: true,
    message: "Password reset link sent successfully",
  }
}

export async function resetPassword(token: string, newPassword: string) {
  // Simulate API call to reset password
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, always return success
  return {
    success: true,
    message: "Password reset successfully",
  }
}

