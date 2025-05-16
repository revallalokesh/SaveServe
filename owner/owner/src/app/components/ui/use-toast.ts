// Simplified toast hook implementation
import { useState } from "react"

type ToastVariant = "default" | "destructive" | "success"

type ToastProps = {
  title?: string
  description?: string
  variant?: ToastVariant
}

type Toast = ToastProps & {
  id: string
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, ...props }
    
    setToasts((prevToasts) => [...prevToasts, newToast])
    
    // Auto-dismiss toast after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)
    
    return id
  }

  const dismiss = (id?: string) => {
    setToasts((prevToasts) => 
      id ? prevToasts.filter((toast) => toast.id !== id) : []
    )
  }

  return {
    toast,
    dismiss,
    toasts
  }
} 