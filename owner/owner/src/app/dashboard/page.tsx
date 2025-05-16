"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Analytics from '../components/Analytics'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (!token || !user) {
        console.log('[Dashboard] No auth found, redirecting to login')
        router.push('/login')
        return
      }

      try {
        const userData = JSON.parse(user)
        if (!userData.hostelId) {
          console.error('[Dashboard] No hostel ID in user data')
          router.push('/login')
          return
        }
      } catch (error) {
        console.error('[Dashboard] Error parsing user data:', error)
        router.push('/login')
      }
    }

    checkAuth()
    window.addEventListener('authChanged', checkAuth)
    return () => {
      window.removeEventListener('authChanged', checkAuth)
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Analytics />
    </div>
  )
} 