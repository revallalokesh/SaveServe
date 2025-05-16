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
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')
      
      login(data.token, data.user)
      onLoginSuccess?.()
      
      // Handle return URL if present
      const returnUrl = searchParams.get('returnUrl')
      if (returnUrl && returnUrl.startsWith('/')) {
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