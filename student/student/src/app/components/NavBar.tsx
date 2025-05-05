"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon, LogIn, Home, UserPlus, Info, LogOut, Wallet } from "lucide-react"
import { cn } from "../lib/utils"
import WalletComponent from "./Wallet"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items?: NavItem[]
  className?: string
}

interface Hostel {
  _id: string;
  name: string;
}

interface LoginData {
  name: string;
  email: string;
  phone: string;
  roomNo: string;
  username: string;
  password: string;
  hostelId: string;
}

export function NavBar({ items = [], className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name || "")
  const [isMobile, setIsMobile] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showWallet, setShowWallet] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState<LoginData>({
    name: "",
    email: "",
    phone: "",
    roomNo: "",
    username: "",
    password: "",
    hostelId: ""
  })
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch hostels from API
    const fetchHostels = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/hostels');
        if (!response.ok) {
          throw new Error('Failed to fetch hostels');
        }
        const data = await response.json();
        console.log('Fetched hostels:', data); // Debug log
        setHostels(data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const studentData = localStorage.getItem('studentData');
    setIsLoggedIn(!!studentData);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Add a new effect to listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const studentData = localStorage.getItem('studentData');
      setIsLoggedIn(!!studentData);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5001/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          hostelId: loginData.hostelId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store the complete student data
      localStorage.setItem('studentData', JSON.stringify({
        id: data.student._id,
        name: data.student.name,
        email: data.student.email,
        hostel: {
          id: data.student.hostelId,
          name: hostels.find(h => h._id === data.student.hostelId)?.name
        }
      }));
      localStorage.setItem('studentToken', data.token);
      
      setIsLoggedIn(true);
      setShowLoginForm(false);
      window.location.href = '/user/home';
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('studentData');
    setIsLoggedIn(false);
    window.location.href = '/';
  }

  const handleWalletClick = () => {
    setShowWallet(true);
  };

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50 shadow-sm",
          className,
        )}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Student Dashboard
            </span>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/user/home"
              className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative"
            >
              <span className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <Home size={18} strokeWidth={2.5} className="group-hover:text-primary transition-colors" />
              <span>Home</span>
            </Link>

            <Link
              href="/about"
              className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative"
            >
              <span className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <Info size={18} strokeWidth={2.5} className="group-hover:text-primary transition-colors" />
              <span>About</span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/user/meal-rating"
                  className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative"
                >
                  <span className="text-xl">🍽️</span>
                  <span>Rate Meals</span>
                </Link>
                <Link
                  href="/user/your-meals"
                  className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative"
                >
                  <span className="text-xl">🍱</span>
                  <span>Your Meals</span>
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleWalletClick}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium border-2 border-primary/20 hover:border-primary/30 text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                  >
                    <Wallet size={18} strokeWidth={2.5} className="text-primary" />
                    <span>Wallet</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5"
                  >
                    <LogOut size={18} strokeWidth={2.5} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5"
                >
                  <LogIn size={18} strokeWidth={2.5} />
                  <span>Login</span>
                </button>
                
                <button
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium border-2 border-primary/20 hover:border-primary/30 text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                >
                  <UserPlus size={18} strokeWidth={2.5} />
                  <span>Request Signup</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLoginForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoginForm(false)} />
          <div className="relative bg-background/95 p-8 rounded-2xl shadow-xl w-full max-w-md border border-border/50 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Login</h2>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="hostel" className="block text-sm font-medium mb-1 text-foreground/70">
                  Select Hostel
                </label>
                <select
                  id="hostel"
                  value={loginData.hostelId}
                  onChange={(e) => setLoginData({ ...loginData, hostelId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-foreground/70 hover:border-primary/30 transition-colors"
                >
                  <option value="">Select a hostel</option>
                  {hostels.map((hostel) => (
                    <option key={hostel._id} value={hostel._id}>
                      {hostel.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground/70">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-foreground/70 hover:border-primary/30 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground/70">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 text-foreground/70 hover:border-primary/30 transition-colors"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2.5 px-4 rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5"
              >
                Login
              </button>
            </form>
            <button
              onClick={() => setShowLoginForm(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {showWallet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 mt-16 p-4"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowWallet(false)} />
          <div className="relative bg-background/95 rounded-2xl shadow-xl w-full max-w-4xl border border-border/50 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-120px)]">
            <button
              onClick={() => setShowWallet(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors z-10"
            >
              ✕
            </button>
            <WalletComponent studentId={JSON.parse(localStorage.getItem('studentData') || '{}').id} />
          </div>
        </motion.div>
      )}
    </>
  )
} 