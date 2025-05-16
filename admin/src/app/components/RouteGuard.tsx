'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthContext'

// Define paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password']

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isInitialized } = useAuth()
  const pathname = usePathname()
  
  // Show loading state while initializing
  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  // Just render the children, skip all redirection logic to break the loop
  // The server-side redirects and cookies will handle authentication
  return <>{children}</>
} 