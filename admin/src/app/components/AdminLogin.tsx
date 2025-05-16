"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "./AuthContext"
import { SignInPage } from "@/app/components/ui/sign_in"

interface AdminLoginProps {
  onLoginSuccess?: () => void
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handler for sign-in form submission
  const handleSignIn = async (email: string, password: string) => {
    setError("")
    setIsLoading(true)
    try {
      const response = await fetch('https://save-serve-server.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
      
      const data = await response.json()
      
      // Set login state in context
      login(data.token, data.user)
      
      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess()
      }
      
      // Get return URL from query parameters
      const returnUrl = searchParams.get('returnUrl')
      
      // Redirect to intended destination or dashboard
      if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('/login')) {
        router.push(returnUrl)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SignInPage
      onSignIn={handleSignIn}
      isLoading={isLoading}
      error={error}
    />
  )
}