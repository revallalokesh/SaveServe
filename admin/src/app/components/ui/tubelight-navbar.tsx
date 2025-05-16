"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface NavItem {
  name: string
  url: string
  // icon: LucideIcon // Remove icon for text-only tabs
  onClick?: () => void
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 flex justify-center items-center mt-8",
        className,
      )}
      style={{ pointerEvents: "none" }}
    >
      <div
        className="flex items-center justify-center gap-0 bg-transparent border border-border/40 rounded-full shadow-none px-4 py-0.5"
        style={{
          pointerEvents: "auto",
          background: "#111112",
        }}
      >
        {items.map((item) => {
          const isActive = activeTab === item.name
          const isHovered = hoveredTab === item.name
          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name)
                if (item.onClick) item.onClick()
              }}
              onMouseEnter={() => setHoveredTab(item.name)}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "relative cursor-pointer text-sm font-bold px-5 py-2 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "text-neutral-300 hover:text-white",
                isActive && "bg-neutral-900 text-white"
              )}
              style={{
                margin: "0 0.25rem",
                boxShadow: isActive ? "0 0 0 0 #fff" : undefined,
              }}
            >
              {item.name}
              {isHovered && (
                <motion.div
                  layoutId="lamp"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-2 rounded-b-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.9) 60%, transparent 100%)",
                    boxShadow: "0 0 16px 4px #fff, 0 0 24px 6px #fff8",
                    filter: "blur(0.5px)",
                  }}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
