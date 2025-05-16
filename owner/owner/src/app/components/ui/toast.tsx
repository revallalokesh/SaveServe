"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  variant?: "default" | "destructive" | "success"
  title?: string
  description?: string
  onClose?: () => void
}

export function Toast({
  variant = "default",
  title,
  description,
  onClose,
}: ToastProps) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-md transition-all",
        variant === "default" && "bg-background text-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground",
        variant === "success" && "bg-green-500 text-white"
      )}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          {title && <h5 className="font-medium">{title}</h5>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-background/20"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
} 