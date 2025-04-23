"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"

interface OwnerLoginProps {
  onLoginSuccess?: () => void
}

export function OwnerLogin({ onLoginSuccess }: OwnerLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll use mock authentication
      if (email === "owner@example.com" && password === "password") {
        // Store owner data in localStorage
        const ownerData = {
          id: "1",
          email: email,
          name: "Owner",
          role: "owner"
        }
        localStorage.setItem("ownerData", JSON.stringify(ownerData))
        onLoginSuccess?.()
        router.push("/")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Owner Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex items-center border border-gray-300 rounded-t-md">
              <Mail className="h-5 w-5 text-gray-400 mx-3" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-b-md">
              <Lock className="h-5 w-5 text-gray-400 mx-3" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 