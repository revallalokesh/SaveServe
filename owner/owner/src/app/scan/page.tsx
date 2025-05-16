"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { Loader2, Camera, Check, X, RefreshCw, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'

// Fix the error type
type Html5QrcodeError = string | Error;

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
  const [scanning, setScanning] = useState(true)
  const [isSelectingCamera, setIsSelectingCamera] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const lastScannedCode = useRef<string | null>(null)
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const [scannerVisible, setScannerVisible] = useState(true);

  const initializeScanner = () => {
    // Clear any existing scanner instance first
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {})
    }

    // Create new scanner instance with optimized settings
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false // verbose mode off
    )

    // Start scanning
    scannerRef.current.render(
      async (decodedText) => {
        handleSuccessfulScan(decodedText);
      },
      (error) => {
        handleScanError(error);
      }
    )

    // Apply our custom styles
    customizeScanner();
  }

  const handleSuccessfulScan = async (decodedText: string) => {
    // Prevent duplicate scans within 5 seconds
    if (lastScannedCode.current === decodedText) {
      return
    }

    // Clear any existing timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
    }

    lastScannedCode.current = decodedText
    setScanning(false)
    await validateQRCode(decodedText)

    // Reset lastScannedCode after 5 seconds
    scanTimeoutRef.current = setTimeout(() => {
      lastScannedCode.current = null
    }, 5000)
  }

  const handleScanError = (error: Html5QrcodeError) => {
    // Only log critical errors, ignore common "not found" messages
    if (typeof error === 'string' && 
        !error.includes('No MultiFormat Readers') && 
        !error.includes('No barcode or QR code detected')) {
      console.error('Scanner error:', error)
    }
  }

  const customizeScanner = () => {
    // Wait a bit to ensure the scanner UI is fully loaded
    setTimeout(() => {
      // Add custom styles to scanner elements
      const scannerContainer = document.getElementById('qr-reader');
      if (scannerContainer) {
        // Hide the stop scanning button from the library completely
        const buttons = scannerContainer.querySelectorAll('button');
        buttons.forEach(button => {
          if (button.innerHTML.includes('Stop') || button.innerText.includes('Stop')) {
            button.style.display = 'none';
          }
        });
        
        // Update the select element for camera selection
        const selectElement = scannerContainer.querySelector('select');
        if (selectElement) {
          // Style the select element
          selectElement.className = 'bg-gray-800 text-white rounded-lg p-2 border border-gray-700 text-sm mb-2 w-full max-w-xs';
          
          // Create a wrapper div for the select element for better styling
          const wrapper = document.createElement('div');
          wrapper.className = 'mb-4 mt-2';
          
          // Add a custom label for the select
          const label = document.createElement('div');
          label.className = 'text-gray-400 text-xs mb-1';
          label.innerText = 'Choose Camera:';
          
          // Replace the select with our wrapper containing the label and select
          const parent = selectElement.parentNode;
          if (parent) {
            wrapper.appendChild(label);
            parent.insertBefore(wrapper, selectElement);
            wrapper.appendChild(selectElement);
          }
        }
      }
    }, 500);
  }

  const validateQRCode = async (qrCode: string) => {
    try {
      setValidating(true)
      setValidationResult(null)

      const token = localStorage.getItem('token')
      if (!token) {
        showError('Authentication required')
        return
      }

      const response = await fetch('https://save-serve-server.onrender.com/api/student-menu/validate-qr', {
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
      
      // Redirect to analytics after a short delay
      setTimeout(() => {
        router.push('/analytics');
      }, 3000);
    } catch (error) {
      console.error('Error validating QR code:', error)
      setValidationResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to validate QR code'
      })
    } finally {
      setValidating(false)
    }
  }

  const restartScanner = () => {
    setValidationResult(null);
    setScanning(true);
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }
    setTimeout(() => {
      initializeScanner();
    }, 100);
  }

  const showError = (errorMessage: string) => {
    setValidationResult({
      success: false,
      message: errorMessage
    });
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        console.log('Attempting to stop scanner...');
        
        // First, set scanning state to false to update UI
        setScanning(false);
        
        // Hide the scanner container temporarily
        setScannerVisible(false);
        
        // Properly clear the scanner after a small delay
        setTimeout(() => {
          if (scannerRef.current) {
            console.log('Clearing scanner...');
            scannerRef.current.clear()
              .then(() => {
                console.log('Scanner cleared successfully');
                // After another delay, show the scanner again and reinitialize
                setTimeout(() => {
                  console.log('Reinitializing scanner...');
                  setScannerVisible(true);
                  setScanning(true);
                  // We'll initialize the scanner when the component re-renders
                }, 300);
              })
              .catch(error => {
                console.error('Error clearing scanner:', error);
                // Even if there's an error, we still want to reset the UI
                setTimeout(() => {
                  setScannerVisible(true);
                  setScanning(true);
                }, 300);
              });
          }
        }, 100);
      } catch (error) {
        console.error('Failed to stop scanner:', error);
        // Emergency recovery
        setScannerVisible(true);
        setScanning(true);
      }
    }
  }

  useEffect(() => {
    if (scanning && scannerVisible) {
      console.log('Initializing scanner...');
      initializeScanner();
    }
    
    // Cleanup function
    return () => {
      if (scannerRef.current) {
        console.log('Cleaning up scanner...');
        // Use try/catch to prevent unhandled promise rejections
        try {
          scannerRef.current.clear().catch(err => console.error('Cleanup error:', err));
        } catch (err) {
          console.error('Error during scanner cleanup:', err);
        }
        scannerRef.current = null;
      }
      
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [scanning, scannerVisible]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[85vh] flex flex-col">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">QR Code Scanner</h1>
        
        <Card className="flex-1 flex flex-col">
          <CardContent className="p-6 pt-6 flex-1 flex flex-col">
            {scanning ? (
              <>
                <div className="rounded-xl overflow-hidden bg-black/20 border border-gray-800 mb-4 flex-1 min-h-[300px] flex flex-col">
                  {scannerVisible ? (
                    <div id="qr-reader" className="w-full h-full rounded-xl flex-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2 text-gray-400">Resetting scanner...</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                  <Button 
                    onClick={() => setIsSelectingCamera(!isSelectingCamera)}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Camera size={18} />
                    <span>Camera Options</span>
                  </Button>
                  
                  <Button
                    onClick={stopScanner}
                    className="flex items-center gap-2 relative"
                    variant="destructive"
                    disabled={!scannerVisible}
                  >
                    <X size={18} />
                    <span>Stop Scanning</span>
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.click();
                    }}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Upload size={18} />
                    <span>Scan from File</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center">
                {validating ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <div className="relative">
                      <Loader2 className="h-16 w-16 animate-spin text-primary" />
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-background"></div>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-center">Validating QR code...</p>
                    <p className="text-muted-foreground text-center">Please wait while we verify this meal selection</p>
                  </div>
                ) : (
                  validationResult && (
                    <div className={`w-full max-w-md mx-auto rounded-xl p-6 ${
                      validationResult.success 
                        ? 'bg-green-900/20 border border-green-900/50' 
                        : 'bg-red-900/20 border border-red-900/50'
                    }`}>
                      <div className="flex flex-col items-center gap-4">
                        <div className={`rounded-full p-3 ${
                          validationResult.success ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {validationResult.success ? (
                            <Check className="h-8 w-8 text-green-500" />
                          ) : (
                            <X className="h-8 w-8 text-red-500" />
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-center">
                          {validationResult.success ? 'Meal Validated!' : 'Validation Failed'}
                        </h3>
                        
                        <p className="text-center text-muted-foreground">
                          {validationResult.message}
                        </p>
                        
                        {validationResult.success && (
                          <div className="bg-background/40 rounded-lg p-4 w-full mt-2">
                            {validationResult.studentName && (
                              <div className="flex justify-between py-2 border-b border-gray-800">
                                <span className="text-muted-foreground">Student</span>
                                <span className="font-medium">{validationResult.studentName}</span>
                              </div>
                            )}
                            {validationResult.mealType && (
                              <div className="flex justify-between py-2 border-b border-gray-800">
                                <span className="text-muted-foreground">Meal</span>
                                <span className="font-medium">{validationResult.mealType}</span>
                              </div>
                            )}
                            {validationResult.usedAt && (
                              <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Time</span>
                                <span className="font-medium">{new Date(validationResult.usedAt).toLocaleTimeString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <Button onClick={restartScanner} className="mt-4 w-full flex items-center justify-center gap-2">
                          <RefreshCw size={16} />
                          <span>Scan Another Code</span>
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
