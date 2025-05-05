'use client';

import React, { useState, useEffect } from 'react';
import Card from 'antd/es/card';
import Typography from 'antd/es/typography';
import Button from 'antd/es/button';
import Switch from 'antd/es/switch';
import Tabs from 'antd/es/tabs';
import QRCode from 'antd/es/qrcode';
import message from 'antd/es/message';
import Table from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, Leaf, Globe } from 'lucide-react';
import type { TabsProps } from 'antd/es/tabs';
import './menu.css';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

interface MealOption {
  opted: boolean;
  locked: boolean;
  qrCode?: string;
  submitted: boolean;
}

interface DayMeals {
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
}


interface DayMenuData {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

interface WeeklyMenuData {
  [key: string]: DayMenuData;
  Monday: DayMenuData;
  Tuesday: DayMenuData;
  Wednesday: DayMenuData;
  Thursday: DayMenuData;
  Friday: DayMenuData;
  Saturday: DayMenuData;
  Sunday: DayMenuData;
}

const StudentMenu: React.FC = () => {
  const router = useRouter();
  const [selectedDay, ] = useState<string>(getCurrentDay());
  const [mealOptions, setMealOptions] = useState<DayMeals>({
    breakfast: { opted: false, locked: false, submitted: false },
    lunch: { opted: false, locked: false, submitted: false },
    dinner: { opted: false, locked: false, submitted: false }
  });

  const initialWeeklyMenu: WeeklyMenuData = {
    Monday: { breakfast: [], lunch: [], dinner: [] },
    Tuesday: { breakfast: [], lunch: [], dinner: [] },
    Wednesday: { breakfast: [], lunch: [], dinner: [] },
    Thursday: { breakfast: [], lunch: [], dinner: [] },
    Friday: { breakfast: [], lunch: [], dinner: [] },
    Saturday: { breakfast: [], lunch: [], dinner: [] },
    Sunday: { breakfast: [], lunch: [], dinner: [] }
  };

  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuData>(initialWeeklyMenu);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hostelId, setHostelId] = useState<string | null>(null);

  // Add helper function to safely get menu items
  const getMealItems = (day: string, type: 'breakfast' | 'lunch' | 'dinner'): string[] => {
    return weeklyMenu[day]?.[type] || [];
  };

  // Helper to get QR key for localStorage
  const getQrKey = (studentId: string, date: string, meal: string) => `qr_${studentId}_${date}_${meal}`;

  useEffect(() => {
    // Get student data from localStorage
    const studentDataString = localStorage.getItem('studentData');
    if (studentDataString) {
      try {
        const studentData = JSON.parse(studentDataString);
        if (studentData && studentData.hostel && studentData.hostel.id) {
          setHostelId(studentData.hostel.id);
        } else {
          setError('Hostel information not found in your profile.');
          setLoading(false);
        }
      } catch (e) {
        console.error("Error parsing student data from localStorage", e);
        setError('Could not retrieve your profile information.');
        setLoading(false);
      }
    } else {
      setError('You must be logged in to view the menu.');
      setLoading(false);
      // Optionally redirect to login
      // router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!hostelId) return;

    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://save-serve-server.onrender.com/api/student-menu/${hostelId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: WeeklyMenuData = await response.json();
        console.log('Fetched Menu Data:', data);
        setWeeklyMenu(data);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(err instanceof Error ? err.message : 'Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [hostelId]);

  // Add new useEffect to fetch existing meal selections
  useEffect(() => {
    const fetchExistingSelections = async () => {
      try {
        const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
        const studentId = studentData.id;
        const today = new Date().toISOString().split('T')[0];
        if (!studentId) return;

        const response = await fetch(`https://save-serve-server.onrender.com/api/student-menu/selections/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch existing selections');
        }

        const data = await response.json();
        // Try to load QR from localStorage if available
        const meals = ['breakfast', 'lunch', 'dinner'] as (keyof DayMeals)[];
        const newMealOptions = { ...mealOptions };
        meals.forEach(meal => {
          const qrKey = getQrKey(studentId, today, meal);
          const localQr = localStorage.getItem(qrKey);
          newMealOptions[meal] = {
            ...newMealOptions[meal],
            opted: data.meals[meal]?.selected || false,
            locked: data.meals[meal]?.selected || false,
            submitted: data.meals[meal]?.selected || false,
            qrCode: localQr || data.meals[meal]?.qrCode || null
          };
        });
        setMealOptions(newMealOptions);
      } catch (error) {
        console.error('Error fetching existing selections:', error);
      }
    };
    fetchExistingSelections();
  }, []);

  function getCurrentDay(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  const handleMealToggle = (meal: keyof DayMeals) => {
    if (mealOptions[meal].locked || mealOptions[meal].submitted) {
      message.warning('This meal option has already been submitted');
      return;
    }

    setMealOptions(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        opted: !prev[meal].opted
      }
    }));
  };

  const handleSubmit = async (meal: keyof DayMeals) => {
    if (mealOptions[meal].submitted) {
      message.warning('This meal has already been submitted');
      return;
    }
    try {
      const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
      const studentId = studentData.id;
      const hostelId = studentData.hostel?.id;
      const studentName = studentData.name;
      const studentEmail = studentData.email;
      const today = new Date().toISOString().split('T')[0];
      // Validate IDs
      if (!studentId || !hostelId) {
        throw new Error('Student or hostel ID not found');
      }

      // Validate ID format (24 character hex string)
      const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
      if (!isValidObjectId(studentId) || !isValidObjectId(hostelId)) {
        throw new Error('Invalid student or hostel ID format');
      }

      if (!studentName || !studentEmail) {
        throw new Error('Student information not found');
      }

      console.log('Submitting meal selection:', {
        studentId,
        hostelId,
        studentName,
        studentEmail,
        dayOfWeek: selectedDay,
        meal,
        studentIdValid: isValidObjectId(studentId),
        hostelIdValid: isValidObjectId(hostelId)
      });

      const response = await fetch('https://save-serve-server.onrender.com/api/student-menu/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
        },
        body: JSON.stringify({
          studentId,
          hostelId,
          studentName,
          studentEmail,
          dayOfWeek: selectedDay,
          selections: {
            [meal]: true
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to submit meal selection');
      }

      const data = await response.json();
      // Save QR to localStorage for offline access
      const qrKey = getQrKey(studentId, today, meal);
      if (data.qrCodes[meal]) {
        localStorage.setItem(qrKey, data.qrCodes[meal]);
      }
      setMealOptions(prev => ({
        ...prev,
        [meal]: {
          ...prev[meal],
          locked: true,
          submitted: true,
          qrCode: data.qrCodes[meal]
        }
      }));
      message.success(`${meal.charAt(0).toUpperCase() + meal.slice(1)} selection submitted successfully!`);
    } catch (error) {
      console.error('Error submitting meal selection:', error);
      message.error(error instanceof Error ? error.message : 'Failed to submit meal selection. Please try again.');
    }
  };

  const items: TabsProps['items'] = [
    {
      key: 'breakfast',
      label: 'Breakfast',
      children: (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          <Card>
            <div className="meal-option">
              <div className="meal-header">
                <Title level={4}>Breakfast</Title>
                <Switch
                  checked={mealOptions.breakfast.opted}
                  onChange={() => handleMealToggle('breakfast')}
                  disabled={mealOptions.breakfast.locked || mealOptions.breakfast.submitted}
                />
              </div>
              <div className="meal-items">
                {getMealItems(selectedDay, 'breakfast').length > 0 ? (
                  getMealItems(selectedDay, 'breakfast').map((item: string, index: number) => (
                    <Text key={index} className="menu-item">{item}</Text>
                  ))
                ) : (
                  <Text type="secondary">No breakfast items listed for today.</Text>
                )}
              </div>
              {mealOptions.breakfast.qrCode && mealOptions.breakfast.submitted ? (
                <motion.div className="qr-code" whileHover={{ scale: 1.08 }}>
                  <QRCode value={mealOptions.breakfast.qrCode} />
                </motion.div>
              ) : (
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() => handleSubmit('breakfast')}
                    disabled={!mealOptions.breakfast.opted || mealOptions.breakfast.submitted}
                    className="w-full"
                  >
                    {mealOptions.breakfast.submitted ? 'Submitted' : 'Submit Breakfast Selection'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ),
    },
    {
      key: 'lunch',
      label: 'Lunch',
      children: (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          <Card>
            <div className="meal-option">
              <div className="meal-header">
                <Title level={4}>Lunch</Title>
                <Switch
                  checked={mealOptions.lunch.opted}
                  onChange={() => handleMealToggle('lunch')}
                  disabled={mealOptions.lunch.locked || mealOptions.lunch.submitted}
                />
              </div>
              <div className="meal-items">
                {getMealItems(selectedDay, 'lunch').length > 0 ? (
                  getMealItems(selectedDay, 'lunch').map((item: string, index: number) => (
                    <Text key={index} className="menu-item">{item}</Text>
                  ))
                ) : (
                  <Text type="secondary">No lunch items listed for today.</Text>
                )}
              </div>
              {mealOptions.lunch.qrCode && mealOptions.lunch.submitted ? (
                <motion.div className="qr-code" whileHover={{ scale: 1.08 }}>
                  <QRCode value={mealOptions.lunch.qrCode} />
                </motion.div>
              ) : (
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() => handleSubmit('lunch')}
                    disabled={!mealOptions.lunch.opted || mealOptions.lunch.submitted}
                    className="w-full"
                  >
                    {mealOptions.lunch.submitted ? 'Submitted' : 'Submit Lunch Selection'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ),
    },
    {
      key: 'dinner',
      label: 'Dinner',
      children: (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          <Card>
            <div className="meal-option">
              <div className="meal-header">
                <Title level={4}>Dinner</Title>
                <Switch
                  checked={mealOptions.dinner.opted}
                  onChange={() => handleMealToggle('dinner')}
                  disabled={mealOptions.dinner.locked || mealOptions.dinner.submitted}
                />
              </div>
              <div className="meal-items">
                {getMealItems(selectedDay, 'dinner').length > 0 ? (
                  getMealItems(selectedDay, 'dinner').map((item: string, index: number) => (
                    <Text key={index} className="menu-item">{item}</Text>
                  ))
                ) : (
                  <Text type="secondary">No dinner items listed for today.</Text>
                )}
              </div>
              {mealOptions.dinner.qrCode && mealOptions.dinner.submitted ? (
                <motion.div className="qr-code" whileHover={{ scale: 1.08 }}>
                  <QRCode value={mealOptions.dinner.qrCode} />
                </motion.div>
              ) : (
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() => handleSubmit('dinner')}
                    disabled={!mealOptions.dinner.opted || mealOptions.dinner.submitted}
                    className="w-full"
                  >
                    {mealOptions.dinner.submitted ? 'Submitted' : 'Submit Dinner Selection'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-4 text-xl">Loading Menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-20">
         <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <Title level={2} className="!mb-0">Meal Options Error</Title>
        </div>
        <Card className="rounded-2xl shadow-sm border border-red-200 bg-red-50">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <Title level={3} className="text-red-700 !mb-2">Oops! Something went wrong.</Title>
            <Paragraph className="text-red-600">{error}</Paragraph>
            <Button type="primary" danger onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 px-4 py-8 flex flex-col items-center">
      {/* Animated eco header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="flex flex-col items-center pt-16 mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 shadow-lg">
            <Leaf className="w-8 h-8 text-green-600" />
          </span>
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 shadow-lg">
            <Globe className="w-8 h-8 text-blue-600" />
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700 tracking-tight text-center drop-shadow-lg">
          Save Food, Save Earth
        </h1>
        <p className="text-lg text-emerald-600 mt-2 text-center max-w-xl">
          Every meal you opt-in or opt-out helps reduce food waste and protect our planet. Thank you for making a difference!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
        className="w-full max-w-3xl"
      >
        <Card className="mb-8 rounded-2xl shadow-lg border border-emerald-100 bg-white/80 hover:shadow-2xl transition-shadow duration-300">
          <Tabs
            defaultActiveKey="breakfast"
            items={items}
            className="custom-tabs"
            tabBarGutter={24}
            moreIcon={null}
            animated
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        className="w-full max-w-4xl"
      >
        <Card
          title={
            <Title level={3} className="!mb-0 text-emerald-700">
              Complete Week Menu
            </Title>
          }
          className="rounded-2xl shadow-md border border-emerald-100 bg-white/80"
        >
          <Table
            dataSource={Object.entries(weeklyMenu)
              .filter(([day]) => day !== '_id' && day !== 'hostelId')
              .map(([day, meals]) => ({
                key: day,
                day,
                breakfast: meals.breakfast.join(', ') || 'N/A',
                lunch: meals.lunch.join(', ') || 'N/A',
                dinner: meals.dinner.join(', ') || 'N/A'
            }))}
            columns={[
              {
                title: 'Day',
                dataIndex: 'day',
                key: 'day',
                className: 'font-medium',
                render: (text: string) => <span className="text-emerald-700 font-semibold">{text}</span>
              },
              {
                title: 'Breakfast',
                dataIndex: 'breakfast',
                key: 'breakfast',
                className: 'text-gray-600',
                render: (text: string) => <span className="hover:bg-green-50 px-2 py-1 rounded transition-colors duration-200">{text}</span>
              },
              {
                title: 'Lunch',
                dataIndex: 'lunch',
                key: 'lunch',
                className: 'text-gray-600',
                render: (text: string) => <span className="hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200">{text}</span>
              },
              {
                title: 'Dinner',
                dataIndex: 'dinner',
                key: 'dinner',
                className: 'text-gray-600',
                render: (text: string) => <span className="hover:bg-emerald-50 px-2 py-1 rounded transition-colors duration-200">{text}</span>
              }
            ]}
            pagination={false}
            bordered
            className="rounded-xl overflow-hidden"
          />
        </Card>
      </motion.div>

      <style jsx global>{`
        .custom-tabs .ant-tabs-nav::before {
          border: none;
        }
        .custom-tabs .ant-tabs-tab {
          padding: 14px 28px;
          margin: 0;
          font-weight: 600;
          color: #059669;
          background: #f0fdf4;
          border-radius: 12px 12px 0 0;
          transition: background 0.2s;
        }
        .custom-tabs .ant-tabs-tab-active {
          background-color: #d1fae5;
          color: #047857;
          border-radius: 12px 12px 0 0;
        }
        .custom-tabs .ant-tabs-ink-bar {
          display: none;
        }
        .meal-option {
          padding: 28px;
          background-color: #f8fafc;
          border-radius: 0 12px 12px 12px;
          box-shadow: 0 2px 16px 0 rgba(16, 185, 129, 0.07);
        }
        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .meal-items {
          display: grid;
          gap: 10px;
        }
        .menu-item {
          padding: 10px 18px;
          background-color: #e0f2fe;
          border-radius: 8px;
          border: 1px solid #bae6fd;
          font-weight: 500;
          color: #0369a1;
          box-shadow: 0 1px 4px 0 rgba(59, 130, 246, 0.04);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .menu-item:hover {
          background-color: #bbf7d0;
          color: #047857;
          box-shadow: 0 2px 8px 0 rgba(16, 185, 129, 0.09);
        }
        .qr-code {
          margin-top: 28px;
          display: flex;
          justify-content: center;
          transition: transform 0.2s;
        }
      `}</style>
    </div>
  );
};

export default StudentMenu; 