"use client"

import { useEffect, useState } from "react"
import { SpiralAnimation } from "./ui/spiral-animation"
import { motion } from "framer-motion"
import { useAuth } from "./AuthContext"

export function Dashboard() {
  const { userData, isLoggedIn, isInitialized } = useAuth()
  const [spiralProgress, setSpiralProgress] = useState(0)

  // Wait for auth to initialize before rendering content
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Admin name from context
  const adminName = userData?.name || "Admin"

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