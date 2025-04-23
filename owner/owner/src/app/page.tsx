"use client"

import { OwnerNavBar } from './components/OwnerNavBar'
import { OwnerProfile } from './components/OwnerProfile'
import { useEffect, useState } from 'react'

interface OwnerData {
  id: string
  username: string
  name: string
  role: string
  hostel?: {
    name: string
  }
}

export default function Home() {
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const storedData = localStorage.getItem('ownerData')
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          setOwnerData(parsedData)
        }
      } catch (error) {
        console.error('Error loading owner data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOwnerData()
  }, [])

  if (isLoading) {
    return (
      <main>
        <OwnerNavBar />
        <div className="pt-24 px-4">
          <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
          <div className="bg-[#1a1b1e] rounded-2xl p-8 shadow-xl border border-gray-800">
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!ownerData) {
    return (
      <main>
        <OwnerNavBar />
        <div className="pt-24 px-4">
          <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
          <div className="bg-[#1a1b1e] rounded-2xl p-8 shadow-xl border border-gray-800">
            <p className="text-gray-400">Please login to view your dashboard</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <OwnerNavBar />
      <div className="pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
        <OwnerProfile ownerData={ownerData} />
      </div>
    </main>
  )
}
