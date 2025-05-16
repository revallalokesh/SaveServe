'use client';

import { useAuth } from './components/AuthContext';

export default function Home() {
  const { isInitialized } = useAuth();

  // Root page is now handled by Next.js redirects in next.config.js
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="text-xl font-medium">Save Serve Admin</div>
        <div className="mt-2">Redirecting to dashboard...</div>
      </div>
    </div>
  );
}
