'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { DayPicker } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import "react-day-picker/dist/style.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Set to true to enable debug information
const DEBUG = false;

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface StudentMealStatus {
  studentName: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  studentId?: string;
  breakfastUsed?: boolean;
  lunchUsed?: boolean;
  dinnerUsed?: boolean;
  breakfastOpted?: boolean;
  lunchOpted?: boolean;
  dinnerOpted?: boolean;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Please login first');
        // Optionally redirect to login, depending on desired behavior
        return;
      }
      
      const response = await fetch('https://save-serve-server.onrender.com/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      setStudents(data);
      console.log("Fetched Students:", data);
    } catch (error) {
      console.error('Error fetching students:', error);
      // Decide how to handle errors in the UI, maybe show a message
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchAnalytics = useCallback(async (selectedDate: Date) => {
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
      
      // Update the normalized data to include opted status
      const normalizedData = {
        ...data,
        studentStatuses: Array.isArray(data.studentStatuses) 
          ? data.studentStatuses.map((student: any) => {
              console.log("Raw student data:", student);
              
              // Extract meal selected and used status safely
              const breakfastSelected = Boolean(student.meals?.breakfast?.selected);
              const lunchSelected = Boolean(student.meals?.lunch?.selected);
              const dinnerSelected = Boolean(student.meals?.dinner?.selected);
              
              const breakfastUsed = Boolean(student.meals?.breakfast?.used);
              const lunchUsed = Boolean(student.meals?.lunch?.used);
              const dinnerUsed = Boolean(student.meals?.dinner?.used);
              
              console.log("Meal status for", student.studentName, {
                breakfast: { selected: breakfastSelected, used: breakfastUsed },
                lunch: { selected: lunchSelected, used: lunchUsed },
                dinner: { selected: dinnerSelected, used: dinnerUsed },
              });
              
              return {
                studentId: student.studentId || '',
                studentName: student.studentName || 'Unknown Student',
                // Track what meals were actually consumed
                breakfast: Boolean(student.breakfast || breakfastUsed),
                lunch: Boolean(student.lunch || lunchUsed),
                dinner: Boolean(student.dinner || dinnerUsed),
                // Track QR scans
                breakfastUsed: breakfastUsed,
                lunchUsed: lunchUsed,
                dinnerUsed: dinnerUsed,
                // Track what meals were opted for
                breakfastOpted: breakfastSelected,
                lunchOpted: lunchSelected,
                dinnerOpted: dinnerSelected
              };
            })
          : []
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
  }, [router]);

  const handleMealStatusChange = (index: number, meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => {
    setAnalytics(prev => {
      const newStudentStatuses = [...prev.studentStatuses];
      newStudentStatuses[index] = {
        ...newStudentStatuses[index],
        [meal]: value
      };

      // Update the total counts
      const newAnalytics = {
        ...prev,
        studentStatuses: newStudentStatuses,
        [meal]: newStudentStatuses.filter(student => student[meal]).length
      };

      return newAnalytics;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSuccessMessage('');
      setError('');

      const hostelId = localStorage.getItem('hostelId');
      const token = localStorage.getItem('token');
      
      if (!hostelId || !token) {
        throw new Error('Authentication data not found');
      }

      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Transform the data to match the server's expected format
      const updatedStatuses = analytics.studentStatuses.map(student => ({
        studentId: student.studentId,
        studentName: student.studentName,
        meals: {
          breakfast: {
            selected: student.breakfast,
            used: student.breakfastUsed || false // Preserve used status when updating
          },
          lunch: {
            selected: student.lunch,
            used: student.lunchUsed || false
          },
          dinner: {
            selected: student.dinner,
            used: student.dinnerUsed || false
          }
        }
      }));

      const response = await fetch('/api/student-meal-status/update-bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostelId,
          date: formattedDate,
          studentStatuses: updatedStatuses
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update meal statuses');
      }

      setSuccessMessage('Meal statuses updated successfully!');
      // Refresh the data
      await fetchAnalytics(date);
    } catch (error) {
      console.error('Error updating meal statuses:', error);
      setError('Failed to update meal statuses. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(date);
  }, [date, fetchAnalytics]);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Only run if students are loaded and analytics.studentStatuses is empty
    if (
      !studentsLoading &&
      students.length > 0 &&
      analytics.studentStatuses.length === 0
    ) {
      setAnalytics((prev) => ({
        ...prev,
        studentStatuses: students.map((student) => ({
          studentId: student._id,
          studentName: student.name,
          breakfast: false,
          lunch: false,
          dinner: false,
        })),
      }));
    }
  }, [students, studentsLoading, analytics.studentStatuses.length]);

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
          <div className="overflow-x-auto">
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                {successMessage}
              </div>
            )}
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
                {analytics.studentStatuses && analytics.studentStatuses.length > 0 ? (
                  analytics.studentStatuses.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.studentName}</TableCell>
                      <TableCell className="text-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={student.breakfast}
                            onChange={(e) => handleMealStatusChange(index, 'breakfast', e.target.checked)}
                            disabled={!student.breakfastOpted || student.breakfastUsed}
                            className={`h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                              student.breakfastUsed ? 'opacity-70' : 
                              !student.breakfastOpted ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title={!student.breakfastOpted ? "Not opted" : student.breakfastUsed ? "Already verified" : "Mark as consumed"}
                          />
                          {student.breakfastUsed && (
                            <div className="absolute -top-3 -right-3">
                              <span className="bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center" title="QR Scanned">
                                ✓
                              </span>
                            </div>
                          )}
                          {DEBUG && (
                            <div className="text-xs mt-1">
                              <div>Opted: {student.breakfastOpted ? "Yes" : "No"}</div>
                              <div>Used: {student.breakfastUsed ? "Yes" : "No"}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={student.lunch}
                            onChange={(e) => handleMealStatusChange(index, 'lunch', e.target.checked)}
                            disabled={!student.lunchOpted || student.lunchUsed}
                            className={`h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 ${
                              student.lunchUsed ? 'opacity-70' : 
                              !student.lunchOpted ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title={!student.lunchOpted ? "Not opted" : student.lunchUsed ? "Already verified" : "Mark as consumed"}
                          />
                          {student.lunchUsed && (
                            <div className="absolute -top-3 -right-3">
                              <span className="bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center" title="QR Scanned">
                                ✓
                              </span>
                            </div>
                          )}
                          {DEBUG && (
                            <div className="text-xs mt-1">
                              <div>Opted: {student.lunchOpted ? "Yes" : "No"}</div>
                              <div>Used: {student.lunchUsed ? "Yes" : "No"}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={student.dinner}
                            onChange={(e) => handleMealStatusChange(index, 'dinner', e.target.checked)}
                            disabled={!student.dinnerOpted || student.dinnerUsed}
                            className={`h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${
                              student.dinnerUsed ? 'opacity-70' : 
                              !student.dinnerOpted ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title={!student.dinnerOpted ? "Not opted" : student.dinnerUsed ? "Already verified" : "Mark as consumed"}
                          />
                          {student.dinnerUsed && (
                            <div className="absolute -top-3 -right-3">
                              <span className="bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center" title="QR Scanned">
                                ✓
                              </span>
                            </div>
                          )}
                          {DEBUG && (
                            <div className="text-xs mt-1">
                              <div>Opted: {student.dinnerOpted ? "Yes" : "No"}</div>
                              <div>Used: {student.dinnerUsed ? "Yes" : "No"}</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No student data available for this date
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {analytics.studentStatuses.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
