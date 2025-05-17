"use client"

import { useState } from 'react';
import { NavBar } from './components/NavBar';
import { Html } from './components/ui/hero-futuristic';
import StudentLogin from './components/StudentLogin';
import { motion, AnimatePresence } from 'framer-motion';

export default function Page() {
  const [showLoginForm, setShowLoginForm] = useState(false);

  return (
    <main>
      <NavBar />
      <div className="relative w-full h-screen bg-black">
        {/* Hero section as background */}
        <div className="absolute inset-0 z-0">
          <Html />
        </div>
        
        {/* Login button */}
        {!showLoginForm && (
          <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
            <motion.button
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: 'spring', stiffness: 120 }}
              onClick={() => setShowLoginForm(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-lg font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login to Save Serves
            </motion.button>
          </div>
        )}
        
        {/* Login form overlay */}
        <AnimatePresence>
          {showLoginForm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="relative bg-white bg-opacity-90 p-8 rounded-lg shadow-2xl w-full max-w-md">
                <button 
                  onClick={() => setShowLoginForm(false)} 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close login form"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <StudentLogin />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
