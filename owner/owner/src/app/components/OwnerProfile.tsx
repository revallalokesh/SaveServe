"use client"

import React from "react"
import { Building2, User, Edit } from "lucide-react"

interface OwnerProfileProps {
  ownerData: {
    id: string
    username: string
    name: string
    role: string
    hostel?: {
      name: string
    }
  }
}

export function OwnerProfile({ ownerData }: OwnerProfileProps) {
  if (!ownerData) {
    return (
      <div className="bg-[#1a1b1e] rounded-2xl p-8 shadow-xl border border-gray-800">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1b1e] rounded-2xl p-8 shadow-xl border border-gray-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{ownerData.name}</h1>
            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
          </div>
          <p className="text-gray-400">Hostel Owner</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid gap-6">
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-3 text-gray-400 mb-1">
            <User size={18} />
            <span className="text-sm font-medium">Full Name</span>
          </div>
          <p className="text-white pl-8">{ownerData.name}</p>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-3 text-gray-400 mb-1">
            <User size={18} />
            <span className="text-sm font-medium">Username</span>
          </div>
          <p className="text-white pl-8">{ownerData.username}</p>
        </div>

        {ownerData.hostel && (
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3 text-gray-400 mb-1">
              <Building2 size={18} />
              <span className="text-sm font-medium">Hostel Name</span>
            </div>
            <p className="text-white pl-8">{ownerData.hostel.name}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors">
            Edit Profile
          </button>
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors">
            Change Password
          </button>
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors">
            Notifications
          </button>
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors">
            Security
          </button>
        </div>
      </div>
    </div>
  )
} 