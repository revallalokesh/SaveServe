'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudentDashboard from './StudentDashboard';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Get student data from localStorage
    const data = localStorage.getItem('studentData');
    if (!data) {
      // If no student data, redirect to login
      router.push('/');
      return;
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <StudentDashboard />
    </main>
  );
};

export default Home;