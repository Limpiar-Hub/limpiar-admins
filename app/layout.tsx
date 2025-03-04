import type { Metadata } from "next"
import "./globals.css"
import "./fonts.css"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Limpiar",
  description: "Property Management System",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"

import "./globals.css"

