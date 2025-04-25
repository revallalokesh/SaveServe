'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DayPicker } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import "react-day-picker/dist/style.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StudentMealStatus {
  studentName: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface MealAnalytics {
  breakfast: number;
  lunch: number;
  dinner: number;
  totalStudents: number;
  studentStatuses: StudentMealStatus[];
}

export default function Analytics() {
  const [date, setDate] = useState<Date>(new Date());
  const [analytics, setAnalytics] = useState<MealAnalytics>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    totalStudents: 0,
    studentStatuses: [],
  });
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const fetchAnalytics = async (selectedDate: Date) => {
    try {
      const hostelId = localStorage.getItem('hostelId');
      const token = localStorage.getItem('token');
      
      console.log('Auth Data:', { hostelId, hasToken: !!token });
      
      if (!hostelId || !token) {
        console.error('Authentication data not found');
        router.push('/login');
        return;
      }

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('Making API request:', {
        url: `/api/student-meal-status/analytics/${formattedDate}?hostelId=${hostelId}`,
        date: formattedDate,
        hostelId
      });
      
      const response = await fetch(
        `/api/student-meal-status/analytics/${formattedDate}?hostelId=${hostelId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      console.log('Raw API Response:', data);
      
      // Ensure studentStatuses is always an array
      const normalizedData = {
        ...data,
        studentStatuses: data.studentStatuses || []
      };
      
      console.log('Normalized Data:', {
        totalStudents: normalizedData.totalStudents,
        studentCount: normalizedData.studentStatuses.length,
        meals: {
          breakfast: normalizedData.breakfast,
          lunch: normalizedData.lunch,
          dinner: normalizedData.dinner
        },
        firstStudent: normalizedData.studentStatuses[0]
      });
      
      setAnalytics(normalizedData);
      setError('');
    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
      setError('Failed to load analytics data. Please try again.');
    }
  };

  useEffect(() => {
    fetchAnalytics(date);
  }, [date]);

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Student Food Table</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Total Breakfast</h3>
              <div className="text-4xl font-bold text-blue-600">
                {analytics.breakfast}
              </div>
              <p className="text-sm text-gray-500 mt-2">students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Total Lunch</h3>
              <div className="text-4xl font-bold text-green-600">
                {analytics.lunch}
              </div>
              <p className="text-sm text-gray-500 mt-2">students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Total Dinner</h3>
              <div className="text-4xl font-bold text-purple-600">
                {analytics.dinner}
              </div>
              <p className="text-sm text-gray-500 mt-2">students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Meal Distribution</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Breakfast', value: analytics.breakfast, color: '#3b82f6' },
                    { name: 'Lunch', value: analytics.lunch, color: '#22c55e' },
                    { name: 'Dinner', value: analytics.dinner, color: '#a855f7' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Breakfast', color: '#3b82f6' },
                    { name: 'Lunch', color: '#22c55e' },
                    { name: 'Dinner', color: '#a855f7' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Breakfast</TableHead>
                <TableHead className="text-center">Lunch</TableHead>
                <TableHead className="text-center">Dinner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics?.studentStatuses?.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{student.studentName}</TableCell>
                  <TableCell className="text-center">
                    {student.breakfast ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.lunch ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.dinner ? "✅" : "❌"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
