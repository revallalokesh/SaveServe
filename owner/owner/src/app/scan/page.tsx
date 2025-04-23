"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function ScanPage() {
  const [result, setResult] = useState('')
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    // Clear any existing scanner instance first
    if (scannerRef.current) {
      scannerRef.current.clear()
    }

    // Create new scanner instance
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      /* verbose= */ false
    )

    // Start scanning
    scannerRef.current.render(
      (decodedText) => {
        setResult(decodedText)
        console.log(decodedText)
      },
      (error: Error | string) => {
        if (error instanceof Error) {
          console.log(error.message)
        } else {
          console.log(error)
        }
      }
    )

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
        scannerRef.current = null
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">QR Code Scanner</h1>
        
        <div className="bg-[#1a1b1e] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div id="qr-reader" className="rounded-xl overflow-hidden" />
          
          {result && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-2">Scanned Result:</h3>
              <p className="text-gray-300 break-all">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
