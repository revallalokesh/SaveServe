'use client';
import React, { useEffect, useState } from 'react';
import Card from 'antd/es/card';
import Typography from 'antd/es/typography';
import QRCode from 'antd/es/qrcode';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Get current day of week as string (e.g., "Monday")
const getCurrentDayOfWeek = (): string => {
  const dayIndex = new Date().getDay(); // 0 is Sunday, 6 is Saturday
  // Convert to our daysOfWeek array index (0 is Monday, 6 is Sunday)
  const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return daysOfWeek[adjustedIndex];
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const YourMeals: React.FC = () => {
  const [, setStudentId] = useState<string | null>(null);
  const [qrData, setQrData] = useState<{ [key: string]: string | null }>({});
  const [currentDay] = useState<string>(getCurrentDayOfWeek());
  const [todayDate] = useState<string>(getTodayDate());

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
    const sid = studentData.id || null;
    setStudentId(sid);
    
    // Load today's QRs from localStorage
    const qrMap: { [key: string]: string | null } = {};
    
    // Check all QR-related localStorage entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`qr_${sid}`)) {
        const value = localStorage.getItem(key);
        
        // Extract the meal type from the key
        const keyParts = key.split('_');
        if (keyParts.length >= 4) {
          const meal = keyParts[3]; // breakfast, lunch, or dinner
          
          // Store the QR code using the meal as key
          if (mealTypes.includes(meal as typeof mealTypes[number])) {
            qrMap[meal] = value;
          }
        }
      }
    }
    
    setQrData(qrMap);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl mt-20">
      <Title level={2} className="mb-8 text-center">Today&apos;s Meals &amp; QRs</Title>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <Card className="mb-6 rounded-2xl shadow-sm border border-gray-100">
          <Title level={4} className="mb-2">{currentDay} ({todayDate})</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mealTypes.map(meal => {
              const qr = qrData[meal];
              return (
                <div key={meal} className="flex flex-col items-center">
                  <Text className="font-semibold capitalize mb-2">{meal}</Text>
                  {qr ? (
                    <motion.div whileHover={{ scale: 1.08 }}>
                      <QRCode value={qr} />
                    </motion.div>
                  ) : (
                    <Text type="secondary">No QR found</Text>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default YourMeals; 