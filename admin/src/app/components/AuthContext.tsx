'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AuthContextType {
  isLoggedIn: boolean;
  userData: UserData | null;
  login: (token: string, user: UserData) => void;
  logout: () => Promise<void>;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
    const loadAuth = async () => {
      try {
        const token = Cookies.get('auth_token');
        const userDataStr = Cookies.get('user_data');
        
        if (token && userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            setIsLoggedIn(true);
            setUserData(userData);
          } catch (error) {
            console.error('Session restoration failed:', error);
            // Don't call handleLogout here as it might cause a loop
            Cookies.remove('auth_token');
            Cookies.remove('user_data');
            setIsLoggedIn(false);
            setUserData(null);
          }
        }
      } finally {
        // Mark authentication as initialized so app knows state is ready
        setIsInitialized(true);
      }
    };

    loadAuth();
  }, []);

  const login = (token: string, user: UserData) => {
    // Set secure HTTP-only cookies
    Cookies.set('auth_token', token, {
      secure: true,
      sameSite: 'strict'
    });
    
    Cookies.set('user_data', JSON.stringify(user), {
      secure: true,
      sameSite: 'strict'
    });

    setIsLoggedIn(true);
    setUserData(user);
  };

  const handleLogout = async () => {
    try {
      // Call server logout endpoint
      await fetch('https://save-serve-server.onrender.com/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${Cookies.get('auth_token')}`,
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear cookies and state regardless of server response
      Cookies.remove('auth_token');
      Cookies.remove('user_data');
      setIsLoggedIn(false);
      setUserData(null);
      
      // Use NextJS router instead of window.location
      router.push('/login');
    }
    
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout: handleLogout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 