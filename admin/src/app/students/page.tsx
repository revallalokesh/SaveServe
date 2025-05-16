"use client"

import { Students } from "../components/Students"

export default function StudentsPage(){
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Students</h1>
      <p className="text-gray-600 mb-6">Manage student details and their hostel assignments here.</p>
      <Students />
    </div>
  )
}