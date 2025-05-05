"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LucideIcon, Home, Settings, Users, BarChart2, MessageSquare, AlertCircle, LogOut, LogIn, Utensils, ScanLine } from "lucide-react"
import { cn } from "../lib/utils"
import { OwnerLogin } from "./OwnerLogin"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items?: NavItem[]
  className?: string
}

const defaultItems: NavItem[] = [
  { name: "Dashboard", url: "/", icon: Home },
  { name: "Students", url: "/students", icon: Users },
  { name: "Food Menu", url: "/menu", icon: Utensils },
  { name: "Analytics", url: "/analytics", icon: BarChart2 },
  { name: "Scan QR", url: "/scan", icon: ScanLine },
  { name: "Settings", url: "/settings", icon: Settings },
]

const publicItems: NavItem[] = [
  { name: "Request Sign Up", url: "/signup", icon: AlertCircle },
  { name: "Contact Support", url: "/support", icon: MessageSquare },
]

export function OwnerNavBar({ items = defaultItems }: NavBarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const storedData = localStorage.getItem('ownerData')
    setIsLoggedIn(!!storedData)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ownerData')
    setIsLoggedIn(false)
    router.push('/')
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center h-16 gap-1">
            {isLoggedIn ? (
              <>
                {items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.url}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200",
                      pathname === item.url && "bg-white/10 text-white"
                    )}
                  >
                    <item.icon size={18} strokeWidth={2} />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 ml-2"
                >
                  <LogOut size={18} strokeWidth={2} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                {publicItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.url}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200",
                      pathname === item.url && "bg-white/10 text-white"
                    )}
                  >
                    <item.icon size={18} strokeWidth={2} />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 ml-2"
                >
                  <LogIn size={18} strokeWidth={2} />
                  <span className="hidden sm:inline">Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1b1e] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Owner Login</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <OwnerLogin onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </>
  )
} 