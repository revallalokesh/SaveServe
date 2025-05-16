import { Suspense } from "react"
import { AdminLogin } from "../components/AdminLogin"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="loading-container">Loading...</div>}>
      <AdminLogin />
    </Suspense>
  )
} 