"use client"

import { OwnerNavBar } from './components/OwnerNavBar'
import { OwnerProfile } from './components/OwnerProfile'

// Temporary owner data
const tempOwnerData = {
  name: "John Smith",
  email: "owner@example.com",
  hostel: {
    name: "University Hostel"
  }
}

export default function Home() {
  return (
    <main>
      <OwnerNavBar />
      <div className="pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
        <OwnerProfile ownerData={tempOwnerData} />
      </div>
    </main>
  )
}
