'use client';
import React, { useEffect, useState } from 'react';
import Card from 'antd/es/card';
import Typography from 'antd/es/typography';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import { SmileOutlined, MehOutlined, FrownOutlined, HeartOutlined, FrownFilled } from '@ant-design/icons';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

const EMOJI_SCALE = [
  { value: 1, emoji: '😡', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😍', label: 'Excellent' },
];

const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
type MealType = typeof mealTypes[number];

type RatingsState = {
  [key in MealType]: number | null;
};

type LoadingState = {
  [key in MealType]: boolean;
};

type MenuData = {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
};

type PendingRatingsState = {
  [key in MealType]: number | null;
};

const getCurrentDay = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const StudentMealRating: React.FC = () => {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuData>({ breakfast: [], lunch: [], dinner: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<RatingsState>({ breakfast: null, lunch: null, dinner: null });
  const [submitting, setSubmitting] = useState<LoadingState>({ breakfast: false, lunch: false, dinner: false });
  const [pendingRatings, setPendingRatings] = useState<PendingRatingsState>({ breakfast: null, lunch: null, dinner: null });

  // Get student info
  const studentData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('studentData') || '{}') : {};
  const studentId = studentData.id;
  const hostelId = studentData.hostel?.id;
  const token = typeof window !== 'undefined' ? localStorage.getItem('studentToken') : null;
  const today = getTodayDate();
  const todayDay = getCurrentDay();

  // Fetch today's menu
  useEffect(() => {
    if (!hostelId) {
      setError('Hostel information not found.');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5001/api/student-menu/${hostelId}`)
      .then(res => res.json())
      .then(data => {
        setMenu(data[todayDay] || { breakfast: [], lunch: [], dinner: [] });
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load menu.');
        setLoading(false);
      });
  }, [hostelId, todayDay]);

  // Fetch previous ratings
  useEffect(() => {
    if (!studentId || !token) return;
    fetch(`http://localhost:5001/api/student-menu/ratings/${studentId}?date=${today}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const newRatings: RatingsState = { breakfast: null, lunch: null, dinner: null };
        const newPending: PendingRatingsState = { breakfast: null, lunch: null, dinner: null };
        data.forEach((r: any) => {
          if (mealTypes.includes(r.mealType)) {
            newRatings[r.mealType as MealType] = r.rating;
            newPending[r.mealType as MealType] = r.rating;
          }
        });
        setRatings(newRatings);
        setPendingRatings(newPending);
      })
      .catch(() => {});
  }, [studentId, token, today]);

  const handleSelectRating = (meal: MealType, value: number) => {
    setPendingRatings(prev => ({ ...prev, [meal]: value }));
  };

  const handleSubmitRating = async (meal: MealType) => {
    const rating = pendingRatings[meal];
    if (!studentId || !hostelId || !token || !rating) {
      message.error('Please select a rating before submitting.');
      return;
    }
    setSubmitting(prev => ({ ...prev, [meal]: true }));
    try {
      const res = await fetch('http://localhost:5001/api/student-menu/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          hostelId,
          date: today,
          mealType: meal,
          rating
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save rating');
      }
      setRatings(prev => ({ ...prev, [meal]: rating }));
      message.success(`Rated ${meal.charAt(0).toUpperCase() + meal.slice(1)}: ${EMOJI_SCALE[rating-1].label}`);
    } catch (err: any) {
      message.error(err.message || 'Failed to save rating');
    } finally {
      setSubmitting(prev => ({ ...prev, [meal]: false }));
    }
  };

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
          <Title level={2} className="!mb-0">Meal Rating Error</Title>
        </div>
        <Card className="rounded-2xl shadow-sm border border-red-200 bg-red-50">
          <div className="flex flex-col items-center justify-center p-8 text-center">
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
    <div className="container mx-auto px-4 py-8 max-w-2xl mt-20">
      <Title level={2} className="mb-8 text-center">Rate Today's Meals</Title>
      {mealTypes.map(meal => (
        <Card key={meal} className="mb-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <Title level={4} className="mb-2 capitalize">{meal}</Title>
            <div className="meal-items mb-2">
              {menu[meal].length > 0 ? (
                menu[meal].map((item, idx) => (
                  <Text key={idx} className="menu-item">{item}</Text>
                ))
              ) : (
                <Text type="secondary">No items listed for {meal}.</Text>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center mb-2">
            {EMOJI_SCALE.map(({ value, emoji, label }) => (
              <button
                key={value}
                className={`text-3xl focus:outline-none transition-transform ${pendingRatings[meal] === value ? 'scale-125' : 'opacity-70 hover:scale-110'}`}
                onClick={() => handleSelectRating(meal, value)}
                disabled={submitting[meal]}
                title={label}
                aria-label={label}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              type="primary"
              onClick={() => handleSubmitRating(meal)}
              disabled={submitting[meal] || pendingRatings[meal] == null || ratings[meal] === pendingRatings[meal]}
              loading={submitting[meal]}
              className="mt-2"
            >
              {ratings[meal] === pendingRatings[meal] ? 'Submitted' : 'Submit Rating'}
            </Button>
          </div>
          {ratings[meal] && (
            <div className="text-center mt-2">
              <span className="text-lg">Your rating: </span>
              <span className="text-2xl">{EMOJI_SCALE[ratings[meal]! - 1].emoji}</span>
              <span className="ml-2 text-base text-gray-500">({EMOJI_SCALE[ratings[meal]! - 1].label})</span>
            </div>
          )}
        </Card>
      ))}
      <style jsx global>{`
        .meal-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .menu-item {
          padding: 6px 14px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default StudentMealRating; 