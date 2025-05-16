'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './AuthContext'

const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password']

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if the path is public
    const isPublicPath = PUBLIC_PATHS.includes(pathname)

    if (!isLoggedIn && !isPublicPath) {
      // Redirect to login with return URL
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)
    } else if (isLoggedIn && isPublicPath) {
      // Redirect to dashboard if logged in user tries to access public pages
      router.push('/dashboard')
    }
  }, [isLoggedIn, pathname, router])

  // Show nothing while checking auth
  if (!isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
    return null
  }

  return <>{children}</>
} 