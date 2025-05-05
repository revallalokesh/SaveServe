'use client';
import React, { useEffect, useState } from 'react';
import Card from 'antd/es/card';
import Typography from 'antd/es/typography';
import Button from 'antd/es/button';
import QRCode from 'antd/es/qrcode';
import message from 'antd/es/message';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
type MealType = typeof mealTypes[number];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getQrKey = (studentId: string, date: string, meal: string) => `qr_${studentId}_${date}_${meal}`;

const getDateOfWeekday = (weekday: string) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 (Sun) - 6 (Sat)
  const targetDay = daysOfWeek.indexOf(weekday);
  // Adjust for Sunday (0)
  const diff = targetDay + 1 - (currentDay === 0 ? 7 : currentDay);
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  return date.toISOString().split('T')[0];
};

const YourMeals: React.FC = () => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [qrData, setQrData] = useState<{ [key: string]: string | null }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
    setStudentId(studentData.id || null);
    // Load all QRs for the week from localStorage
    const qrMap: { [key: string]: string | null } = {};
    daysOfWeek.forEach(day => {
      const date = getDateOfWeekday(day);
      mealTypes.forEach(meal => {
        const key = `${date}_${meal}`;
        const qrKey = getQrKey(studentData.id, date, meal);
        qrMap[key] = localStorage.getItem(qrKey);
      });
    });
    setQrData(qrMap);
  }, []);

  const handleRefreshQr = async (date: string, meal: MealType) => {
    if (!studentId) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/student-menu/selections/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch QR');
      const data = await response.json();
      const qr = data.meals[meal]?.qrCode || null;
      const qrKey = getQrKey(studentId, date, meal);
      if (qr) {
        localStorage.setItem(qrKey, qr);
        setQrData(prev => ({ ...prev, [`${date}_${meal}`]: qr }));
        message.success('QR refreshed!');
      } else {
        message.info('No QR found for this meal.');
      }
    } catch (err) {
      message.error('Failed to refresh QR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl mt-20">
      <Title level={2} className="mb-8 text-center">Your Meals & QRs (This Week)</Title>
      {daysOfWeek.map((day, i) => {
        const date = getDateOfWeekday(day);
        return (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 120 }}
          >
            <Card className="mb-6 rounded-2xl shadow-sm border border-gray-100">
              <Title level={4} className="mb-2">{day} ({date})</Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mealTypes.map(meal => {
                  const qr = qrData[`${date}_${meal}`];
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
        );
      })}
    </div>
  );
};

export default YourMeals; 