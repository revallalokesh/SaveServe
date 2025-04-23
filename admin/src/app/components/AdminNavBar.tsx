"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/app/lib/utils"

interface NavItem {
  name: string
  url: string
  emoji: string
}

interface NavBarProps {
  items?: NavItem[]
  className?: string
}

const defaultItems: NavItem[] = [
  { name: "Dashboard", url: "/dashboard", emoji: "🏠" },
  { name: "Hostels", url: "/hostels", emoji: "🏢" },
  { name: "Owners", url: "/owners", emoji: "👥" },
  { name: "Students", url: "/students", emoji: "🎓" },
  { name: "Food Menu", url: "/menu", emoji: "🍽️" },
  { name: "Analytics", url: "/analytics", emoji: "📊" },
  { name: "Settings", url: "/settings", emoji: "⚙️" },
  { name: "Support", url: "/support", emoji: "💬" },
  { name: "Logout", url: "#", emoji: "🚪" },
]

export function AdminNavBar({ items = defaultItems, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name || "")
  const [isMobile, setIsMobile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('userData')
      setIsLoggedIn(!!token && !!userData)
    }

    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    localStorage.removeItem('adminData')
    
    setIsLoggedIn(false)
    setShowLogoutConfirm(false)
    setShowProfileMenu(false)
    
    // Force navigation to login
    router.push('/login')
    router.refresh()
  }

  const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.name === "Logout") {
      e.preventDefault()
      handleLogout()
    } else {
      setActiveTab(item.name)
      router.push(item.url)
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="bg-background/95 backdrop-blur-2xl border border-border/20 rounded-3xl shadow-2xl shadow-black/10 p-2 max-w-2xl w-full"
        >
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide px-2 py-1.5 rounded-2xl bg-foreground/5">
            {isLoggedIn ? (
              <>
                {items.map((item) => (
                  <button
                    key={item.name}
                    onClick={(e) => handleItemClick(item, e)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all relative rounded-xl whitespace-nowrap justify-center group hover:scale-105",
                      activeTab === item.name 
                        ? "text-white bg-primary shadow-lg shadow-primary/25" 
                        : item.name === "Logout"
                        ? "text-red-500 hover:bg-red-500/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                    )}
                  >
                    <span className="text-base transition-transform duration-200 group-hover:scale-110">
                      {item.emoji}
                    </span>
                    <span className="hidden sm:inline text-[11px] font-medium">
                      {item.name}
                    </span>
                  </button>
                ))}

                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all rounded-xl whitespace-nowrap justify-center group hover:scale-105",
                      showProfileMenu 
                        ? "text-white bg-primary shadow-lg shadow-primary/25" 
                        : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                    )}
                  >
                    <span className="text-base transition-transform duration-200 group-hover:scale-110">
                      👤
                    </span>
                    <span className="hidden sm:inline text-[11px] font-medium">
                      Profile
                    </span>
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 w-56 bg-background/95 backdrop-blur-2xl border border-border/20 rounded-2xl shadow-xl shadow-black/10 py-2"
                      >
                        <div className="px-4 py-3 border-b border-border/10">
                          <p className="text-xs font-medium text-foreground/50 mb-1">
                            Signed in as
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {JSON.parse(localStorage.getItem('userData') || '{}').name || 'Admin'}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-foreground/5 transition-colors group"
                        >
                          <span className="text-base transition-transform duration-200 group-hover:scale-110">
                            🚪
                          </span>
                          <span className="font-medium">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full justify-center">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-primary shadow-lg shadow-primary/25 rounded-xl hover:bg-primary/90 transition-all"
                >
                  <span className="text-base">🔑</span>
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-primary border border-primary/20 rounded-xl hover:bg-primary/10 transition-all"
                >
                  <span className="text-base">📝</span>
                  <span className="hidden sm:inline">Request Signup</span>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setShowLogoutConfirm(false)} 
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-background/80 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-white/10 backdrop-blur-xl ring-1 ring-black/5"
            >
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Are you sure you want to logout?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium border border-border/10 rounded-xl hover:bg-foreground/5 transition-all hover:border-border/20"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 