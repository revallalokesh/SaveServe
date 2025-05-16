"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart2,
  Menu,
  X,
  Home,
  ScanLine,
  Users,
  LogOut,
  LogIn,
  Utensils,
  ShoppingCart
} from "lucide-react"
import { cn } from "../lib/utils"
import { OwnerLogin } from "./OwnerLogin"

interface NavItem {
  name: string
  url: string
  icon: any
}

export function OwnerNavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }

    const handleAuthChange = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }

    window.addEventListener('authChanged', handleAuthChange)
    return () => {
      window.removeEventListener('authChanged', handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ownerData')
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    setIsLoggedIn(false)
    window.dispatchEvent(new Event('authChanged'))
    router.push('/')
  }

  const handleLogin = () => {
    setShowLoginModal(false)
    setIsLoggedIn(true)
    window.dispatchEvent(new Event('authChanged'))
  }

  const items: NavItem[] = [
    {
      name: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      name: "Menu",
      url: "/menu",
      icon: Utensils,
    },
    {
      name: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      name: "Students",
      url: "/students",
      icon: Users,
    },
    {
      name: "Analytics",
      url: "/analytics",
      icon: BarChart2,
    },
    {
      name: "QR Scanner",
      url: "/scan",
      icon: ScanLine,
    },
  ]

  const publicItems: NavItem[] = [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
  ]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-white"
              >
                SaveServes
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center justify-center flex-1 gap-1">
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

        {/* Mobile Nav */}
        {isOpen && (
          <div className="sm:hidden bg-black/90 shadow-lg">
            <div className="pt-2 pb-3 space-y-1 px-4">
              {isLoggedIn ? (
                <>
                  {items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200",
                        pathname === item.url && "bg-white/10 text-white"
                      )}
                    >
                      <item.icon size={20} strokeWidth={2} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  >
                    <LogOut size={20} strokeWidth={2} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {publicItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200",
                        pathname === item.url && "bg-white/10 text-white"
                      )}
                    >
                      <item.icon size={20} strokeWidth={2} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  >
                    <LogIn size={20} strokeWidth={2} />
                    <span>Login</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-lg w-full max-w-md">
            <OwnerLogin onLoginSuccess={handleLogin} />
          </div>
        </div>
      )}
    </>
  )
} 