"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

const StudentLogin = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await fetch('https://save-serve-server.onrender.com/api/hostels');
        if (!response.ok) {
          throw new Error('Failed to fetch hostels');
        }
        const data = await response.json();
        console.log('Fetched hostels:', data);
        setHostels(data);
      } catch (err) {
        console.error('Error fetching hostels:', err);
        setError('Failed to load hostels. Please try again later.');
      }
    };

    fetchHostels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const response = await fetch('https://save-serve-server.onrender.com/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          hostelId: formData.get('hostel'),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response:', data); // Debug log
      
      if (!data.student || !data.student.name) {
        throw new Error('Invalid response from server');
      }

      // Store the complete student data
      const studentDataToStore = {
        id: data.student._id,
        name: data.student.name,
        email: data.student.email,
        hostel: {
          id: data.student.hostelId,
          name: hostels.find(h => h._id === data.student.hostelId)?.name || 'Unknown Hostel'
        }
      };
      
      console.log('Storing student data:', studentDataToStore); // Debug log
      localStorage.setItem('studentData', JSON.stringify(studentDataToStore));
      localStorage.setItem('studentToken', data.token);
      
      router.push('/user/home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-animation">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Student Login
        </h2>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="hostel" className="block text-sm font-medium text-gray-700 mb-1">
              Hostel
            </label>
            <select
              id="hostel"
              name="hostel"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            >
              <option value="">Select Hostel</option>
              {hostels && hostels.length > 0 ? (
                hostels.map((hostel) => (
                  <option key={hostel._id} value={hostel._id}>
                    {hostel.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No hostels available</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentLogin; 