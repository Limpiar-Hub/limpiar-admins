"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Users, Briefcase, Building2, CreditCard, LineChart, Settings, HeadphonesIcon, LogOut } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const menuItems = [
    { href: "/users", icon: Users, label: "Users" },
    { href: "/cleaning-business", icon: Briefcase, label: "Cleaning Business" },
    { href: "/property", icon: Building2, label: "Property" },
    { href: "/booking", icon: CreditCard, label: "Booking" },
    { href: "/payment", icon: CreditCard, label: "Payment" },
    { href: "/analytics", icon: LineChart, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  const footerItems = [{ href: "/support", icon: HeadphonesIcon, label: "Help and Support" }]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Clear client-side token
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Attempt to logout on server
      try {
        await fetch("https://limpiar-backend.onrender.com/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      } catch (error) {
        // Continue with client-side logout even if server logout fails
        console.error("Server logout failed:", error)
      }

      // Redirect to login page
      router.push("/")

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="fixed left-0 top-0 flex h-screen w-[240px] flex-col bg-[#101113]">
      <div className="p-6">
        <Image src="/logo.jpg" alt="Limpiar Logo" width={120} height={40} className="h-8 w-auto" />
      </div>

      {/* Static Dashboard Title */}
      <div className="px-6 pb-4">
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 px-3 py-4">
        {footerItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  )
}

