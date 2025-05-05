'use client';

import React, { useEffect, useState } from 'react';
import { Menu, MessageSquare, Bell, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Card from 'antd/es/card';
interface StudentData {
  name: string;
  email: string;
  hostel?: {
    id: string;
    name: string;
  };
}

const StudentDashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('studentData');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        console.log('Loaded student data:', parsedData); // Debug log
        setStudentData(parsedData);
      } catch (error) {
        console.error('Error parsing student data:', error);
        router.push('/'); // Redirect to login if data is invalid
      }
    } else {
      router.push('/'); // Redirect to login if no data
    }
  }, [router]);

  if (!studentData) {
    return null;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-20">
      {/* Profile Section */}
      <Card className="mb-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
        <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl text-gray-600">{studentData.name[0]}</span>
          </div>
          <div className="md:ml-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{studentData.name}</h2>
            <p className="text-gray-600 mt-1">{studentData.email}</p>
            <p className="text-gray-600">{studentData.hostel?.name}</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Balance</h3>
          <p className="text-3xl font-bold text-primary">₹500</p>
        </Card>
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Meals This Month</h3>
          <p className="text-3xl font-bold text-primary">12</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card 
        title={<h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>}
        className="mb-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handleNavigation('/user/menu')}
            className="p-6 rounded-xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all duration-300 flex flex-col items-center justify-center group"
          >
            <Menu className="w-6 h-6 mb-2 text-gray-600 group-hover:text-primary" />
            <span className="text-sm font-medium text-gray-800">View Menu</span>
          </button>
          <button 
            onClick={() => handleNavigation('/user/meal-rating')}
            className="p-6 rounded-xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all duration-300 flex flex-col items-center justify-center group"
          >
            <MessageSquare className="w-6 h-6 mb-2 text-gray-600 group-hover:text-primary" />
            <span className="text-sm font-medium text-gray-800">Submit Feedback</span>
          </button>
          <button 
            onClick={() => handleNavigation('/user/notifications')}
            className="p-6 rounded-xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all duration-300 flex flex-col items-center justify-center group"
          >
            <Bell className="w-6 h-6 mb-2 text-gray-600 group-hover:text-primary" />
            <span className="text-sm font-medium text-gray-800">Notifications</span>
            <span className="text-xs text-gray-500 mt-1">Check updates</span>
          </button>
          <button 
            onClick={() => handleNavigation('/user/wallet')}
            className="p-6 rounded-xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all duration-300 flex flex-col items-center justify-center group"
          >
            <Wallet className="w-6 h-6 mb-2 text-gray-600 group-hover:text-primary" />
            <span className="text-sm font-medium text-gray-800">Wallet</span>
            <span className="text-xs text-gray-500 mt-1">Manage your balance</span>
          </button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card 
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button 
              onClick={() => handleNavigation('/user/activity')}
              className="text-primary text-sm hover:underline"
            >
              View All
            </button>
          </div>
        }
        className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
      >
        <div className="divide-y divide-gray-100">
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Menu className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-800">Lunch Opted Out</p>
                <p className="text-sm text-gray-500">Today, 12:30 PM</p>
              </div>
            </div>
            <span className="text-green-600 font-medium">+₹100</span>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-800">Feedback Submitted</p>
                <p className="text-sm text-gray-500">Yesterday, 6:45 PM</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard; 