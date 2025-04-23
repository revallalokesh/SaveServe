import {Hostels} from "@/app/components/Hostels"
export default function HostelsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hostels</h1>
      <p className="text-gray-600">Manage hostels and their details here.</p>
      <Hostels/>
    </div>
  )
} 