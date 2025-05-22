'use client';

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Select, Spin, Typography, Empty, Statistic } from 'antd';
import { Star, ThumbsUp, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

type MealType = 'breakfast' | 'lunch' | 'dinner';

type AggregatedRating = {
  count: number;
  total: number;
  average: number;
};

type RatingsResponse = {
  date: string;
  hostelId: string;
  ratings: {
    [key in MealType]: AggregatedRating;
  };
};

const EMOJI_SCALE = [
  { value: 1, emoji: '😡', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😍', label: 'Excellent' },
];

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

export function MealReviews() {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(true);
  const [ratings, setRatings] = useState<RatingsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get owner info
  const ownerData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('ownerData') || '{}') : {};
  const hostelId = ownerData.hostelId;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetchRatings();
  }, [selectedDate]);

  const fetchRatings = async () => {
    if (!hostelId || !token) {
      setError('Hostel information not found. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const response = await fetch(`https://save-serve-server.onrender.com/api/student-menu/ratings/aggregated/${formattedDate}?hostelId=${hostelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ratings');
      }

      const data = await response.json();
      setRatings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch ratings. Please try again.');
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const getRatingEmoji = (average: number) => {
    const roundedRating = Math.round(average);
    if (roundedRating < 1) return EMOJI_SCALE[0].emoji;
    if (roundedRating > 5) return EMOJI_SCALE[4].emoji;
    return EMOJI_SCALE[roundedRating - 1].emoji;
  };
  
  const getRatingColor = (average: number) => {
    if (average <= 1.5) return 'rgb(239, 68, 68)'; // red
    if (average <= 2.5) return 'rgb(234, 179, 8)';  // yellow/amber
    if (average <= 3.5) return 'rgb(59, 130, 246)'; // blue
    if (average <= 4.5) return 'rgb(34, 197, 94)';  // green
    return 'rgb(16, 185, 129)'; // teal
  };

  const getMealIcon = (mealType: MealType) => {
    switch (mealType) {
      case 'breakfast':
        return '🍳';
      case 'lunch':
        return '🍲';
      case 'dinner':
        return '🍽️';
      default:
        return '🍽️';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-20">
        <Card className="rounded-2xl shadow-sm border border-red-200 bg-red-50">
          <div className="text-center p-6">
            <Title level={4} className="text-red-700">Error</Title>
            <Paragraph className="text-red-600">{error}</Paragraph>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Title level={2} className="!mb-2">Meal Reviews</Title>
          <Paragraph className="text-gray-500">
            View anonymous aggregated meal ratings for your hostel
          </Paragraph>
        </div>

        <DatePicker 
          value={selectedDate} 
          onChange={handleDateChange} 
          className="w-full md:w-auto"
          disabledDate={(current) => current && current.isAfter(dayjs())}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
          <span className="ml-4 text-lg">Loading ratings...</span>
        </div>
      ) : !ratings || Object.values(ratings.ratings).every(r => r.count === 0) ? (
        <Empty 
          description="No ratings available for this date" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-20"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mealTypes.map((mealType, index) => {
            const mealRating = ratings.ratings[mealType];
            const hasRatings = mealRating.count > 0;
            const averageRating = parseFloat(mealRating.average.toString());
            
            return (
              <motion.div
                key={mealType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  title={
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMealIcon(mealType)}</span>
                      <span className="capitalize">{mealType}</span>
                    </div>
                  }
                >
                  {hasRatings ? (
                    <div className="flex flex-col items-center p-4">
                      <div 
                        className="text-6xl mb-4 p-6 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${getRatingColor(averageRating)}20`,
                          border: `2px solid ${getRatingColor(averageRating)}40`
                        }}
                      >
                        {getRatingEmoji(averageRating)}
                      </div>
                      
                      <div className="grid grid-cols-3 w-full gap-2 text-center mb-4">
                        <Statistic 
                          title="Average" 
                          value={averageRating} 
                          suffix="/5"
                          precision={1}
                          valueStyle={{ color: getRatingColor(averageRating) }}
                        />
                        <Statistic 
                          title="Ratings" 
                          value={mealRating.count}
                          valueStyle={{ color: '#4B5563' }} 
                        />
                        <Statistic 
                          title="Total" 
                          value={mealRating.total}
                          valueStyle={{ color: '#4B5563' }} 
                        />
                      </div>

                      <div className="text-sm text-gray-500 text-center">
                        {mealRating.count} student{mealRating.count !== 1 ? 's' : ''} rated this meal
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="text-5xl mb-4 opacity-30">📊</div>
                      <Text>No ratings available for {mealType}</Text>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
} 