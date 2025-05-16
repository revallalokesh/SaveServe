"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "./AuthContext"
import { Home, Building2, Users, GraduationCap, Utensils, Settings, LogOut } from "lucide-react"
import { NavBar as TubelightNavBar } from "./ui/tubelight-navbar"

interface NavItem {
  name: string
  url: string
  icon: React.ComponentType<any>
}

export function AdminNavBar() {
  const { isLoggedIn, userData, logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState("")
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Dashboard")

  if (!isLoggedIn) return null;

  const navItems = [
    { name: "Dashboard", url: "/dashboard", icon: Home },
    { name: "Hostels", url: "/hostels", icon: Building2 },
    { name: "Owners", url: "/owners", icon: Users },
    { name: "Students", url: "/students", icon: GraduationCap },
    { name: "Food Menu", url: "/menu", icon: Utensils },
    
  ]

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.name)
    router.push(item.url)
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
    setLogoutError("")
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    setLogoutError("")
    try {
      await logout()
    } catch (error) {
      setLogoutError("Failed to logout. Please try again.")
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <TubelightNavBar
        items={[
          ...navItems.map(item => ({ 
            ...item, 
            onClick: () => handleNavClick(item),
            isActive: activeTab === item.name
          })),
          { 
            name: "Logout", 
            url: "#", 
            icon: LogOut,
            onClick: handleLogoutClick,
            isActive: false
          }
        ]}
        className="mb-0"
      />

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
              onClick={() => !isLoggingOut && setShowLogoutConfirm(false)} 
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-background/80 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-white/10 backdrop-blur-xl ring-1 ring-black/5"
            >
              <button
                onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
                disabled={isLoggingOut}
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
              <p className="text-sm text-foreground/60 mb-4">Are you sure you want to logout?</p>
              {logoutError && (
                <p className="text-sm text-red-500 mb-4">{logoutError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium border border-border/10 rounded-xl hover:bg-foreground/5 transition-all hover:border-border/20"
                  disabled={isLoggingOut}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-red-500"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging out...
                    </span>
                  ) : (
                    'Logout'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 