"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { message } from 'antd'
import { Loader2 } from 'lucide-react'

interface ValidationResult {
  success: boolean
  message: string
  studentName?: string
  mealType?: string
  usedAt?: string
}

export default function ScanPage() {
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const lastScannedCode = useRef<string | null>(null)
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing scanner instance first
    if (scannerRef.current) {
      scannerRef.current.clear()
    }

    // Create new scanner instance with optimized settings
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 5, // Reduced from 10 to 5 to decrease processing load
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], // Only look for QR codes
      },
      false // verbose mode off
    )

    // Start scanning
    scannerRef.current.render(
      async (decodedText) => {
        // Prevent duplicate scans within 5 seconds
        if (lastScannedCode.current === decodedText) {
          return
        }

        // Clear any existing timeout
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current)
        }

        lastScannedCode.current = decodedText
        await validateQRCode(decodedText)

        // Reset lastScannedCode after 5 seconds
        scanTimeoutRef.current = setTimeout(() => {
          lastScannedCode.current = null
        }, 5000)
      },
      (error) => {
        // Only log critical errors, ignore common "not found" messages
        if (typeof error === 'string' && 
            !error.includes('No MultiFormat Readers') && 
            !error.includes('No barcode or QR code detected')) {
          console.error('Scanner error:', error)
        }
      }
    )

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
        scannerRef.current = null
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current)
      }
    }
  }, [])

  const validateQRCode = async (qrCode: string) => {
    try {
      setValidating(true)
      setValidationResult(null)

      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Authentication required')
        return
      }

      const response = await fetch('http://localhost:5001/api/student-menu/validate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ qrCode })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate QR code')
      }

      setValidationResult({
        success: true,
        message: data.message,
        studentName: data.studentName,
        mealType: data.mealType,
        usedAt: data.usedAt
      })
      message.success('QR code validated successfully')
    } catch (error) {
      console.error('Error validating QR code:', error)
      setValidationResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to validate QR code'
      })
      message.error(error instanceof Error ? error.message : 'Failed to validate QR code')
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">QR Code Scanner</h1>
        
        <div className="bg-[#1a1b1e] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div id="qr-reader" className="rounded-xl overflow-hidden" />
          
          {validating && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <p className="text-gray-300">Validating QR code...</p>
            </div>
          )}

          {validationResult && (
            <div className={`mt-4 p-4 ${validationResult.success ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-xl`}>
              <h3 className={`text-lg font-semibold ${validationResult.success ? 'text-green-400' : 'text-red-400'} mb-2`}>
                {validationResult.success ? 'Validation Successful' : 'Validation Failed'}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-300">{validationResult.message}</p>
                {validationResult.success && (
                  <>
                    {validationResult.studentName && (
                      <p className="text-gray-300">Student: {validationResult.studentName}</p>
                    )}
                    {validationResult.mealType && (
                      <p className="text-gray-300">Meal: {validationResult.mealType}</p>
                    )}
                    {validationResult.usedAt && (
                      <p className="text-gray-300">Used at: {new Date(validationResult.usedAt).toLocaleString()}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
