"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SpiralAnimation } from "./ui/spiral-animation"
import { motion } from "framer-motion"

export function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [spiralProgress, setSpiralProgress] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    setIsLoggedIn(!!userData)
    setIsLoading(false)

    if (!userData) {
      router.push('/login')
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  // Get admin name from localStorage
  let adminName = "Admin"
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        adminName = JSON.parse(userData).name || "Admin"
      } catch {}
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SpiralAnimation onProgress={setSpiralProgress} />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.h1
          className="text-4xl font-bold mb-4"
          animate={{ scale: 0.6 + 0.4 * spiralProgress, opacity: spiralProgress }}
          transition={{ type: 'tween', duration: 0.1 }}
        >
          Welcome to Save Serve
        </motion.h1>
        <motion.h2
          className="text-2xl font-semibold mb-2"
          animate={{ scale: 0.6 + 0.4 * spiralProgress, opacity: spiralProgress }}
          transition={{ type: 'tween', duration: 0.1 }}
        >
          Hello, {adminName}!
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg text-center max-w-2xl"
          animate={{ opacity: spiralProgress, y: 20 - 20 * spiralProgress }}
          transition={{ type: 'tween', duration: 0.1 }}
        >
          Welcome to the Admin Dashboard for Save Serve Hostel Food Management System. Manage hostels, owners, and students from here.
        </motion.p>
      </div>
    </div>
  )
} 