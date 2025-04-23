"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

  return (
    <div className="pt-24 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome to the Admin Dashboard for Save Serve Hostel Food Management System. Manage hostels, owners, and students from here.</p>
    </div>
  )
} 