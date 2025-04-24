"use client"

import React, { useState, useEffect } from "react"
import { Card, Calendar, Table, Select, Row, Col, Spin } from "antd"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import dayjs from "dayjs"
import axios from "axios"

interface MealStatus {
  studentName: string
  studentEmail: string
  meals: {
    breakfast: {
      selected: boolean
      qrCode: string | null
      used: boolean
      usedAt: string | null
      submittedAt: string | null
    }
    lunch: {
      selected: boolean
      qrCode: string | null
      used: boolean
      usedAt: string | null
      submittedAt: string | null
    }
    dinner: {
      selected: boolean
      qrCode: string | null
      used: boolean
      usedAt: string | null
      submittedAt: string | null
    }
  }
  dayOfWeek?: string
  createdAt?: string
  updatedAt?: string
  expiresAt?: string
}

interface MealStats {
  date: string
  breakfast: {
    selected: number
    notSelected: number
  }
  lunch: {
    selected: number
    notSelected: number
  }
  dinner: {
    selected: number
    notSelected: number
  }
}

const COLORS = ['#0088FE', '#FF8042']
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export function Analytics() {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month())
  const [selectedYear, setSelectedYear] = useState(dayjs().year())
  const [mealStatus, setMealStatus] = useState<MealStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [hostelId, setHostelId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get hostel ID from localStorage
    const storedHostelId = localStorage.getItem("hostelId")
    if (storedHostelId) {
      setHostelId(storedHostelId)
    }
  }, [])

  useEffect(() => {
    if (hostelId) {
      fetchMealStatus()
    }
  }, [hostelId, selectedDate])

  const fetchMealStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_BASE_URL}/student-meal-status/date/${selectedDate.format('YYYY-MM-DD')}?hostelId=${hostelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Meal status response:', response.data)
      setMealStatus(response.data)
    } catch (error) {
      console.error('Error fetching meal status:', error)
      setError('Failed to fetch meal status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getMealStats = (): MealStats => {
    const totalStudents = mealStatus.length
    const stats: MealStats = {
      date: selectedDate.format('YYYY-MM-DD'),
      breakfast: { selected: 0, notSelected: 0 },
      lunch: { selected: 0, notSelected: 0 },
      dinner: { selected: 0, notSelected: 0 }
    }

    mealStatus.forEach(status => {
      if (status.meals.breakfast.selected) stats.breakfast.selected++
      else stats.breakfast.notSelected++
      
      if (status.meals.lunch.selected) stats.lunch.selected++
      else stats.lunch.notSelected++
      
      if (status.meals.dinner.selected) stats.dinner.selected++
      else stats.dinner.notSelected++
    })

    return stats
  }

  const getPieData = (selected: number, notSelected: number) => [
    { name: 'Selected', value: selected },
    { name: 'Not Selected', value: notSelected }
  ]

  const studentColumns = [
    {
      title: 'Name',
      dataIndex: 'studentName',
      key: 'studentName',
      width: '20%',
      render: (name: string) => (
        <span className="font-medium">{name}</span>
      )
    },
    {
      title: 'Email',
      dataIndex: 'studentEmail',
      key: 'studentEmail',
      width: '20%',
    },
    {
      title: 'Breakfast',
      dataIndex: ['meals', 'breakfast'],
      key: 'breakfast',
      width: '20%',
      render: (breakfast: any, record: MealStatus) => (
        <div className="flex flex-col items-center gap-2">
          <span style={{ color: breakfast.selected ? 'green' : 'red' }} className="font-medium">
            {breakfast.selected ? 'Selected' : 'Not Selected'}
          </span>
          {breakfast.selected && breakfast.qrCode && (
            <div className="mt-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${breakfast.qrCode}`} 
                alt="Breakfast QR Code"
                className="w-24 h-24 border border-gray-200 rounded-lg shadow-sm"
              />
            </div>
          )}
          {breakfast.used && (
            <span className="text-sm text-gray-500">
              Used at: {new Date(breakfast.usedAt!).toLocaleString()}
        </span>
          )}
        </div>
      ),
    },
    {
      title: 'Lunch',
      dataIndex: ['meals', 'lunch'],
      key: 'lunch',
      width: '20%',
      render: (lunch: any, record: MealStatus) => (
        <div className="flex flex-col items-center gap-2">
          <span style={{ color: lunch.selected ? 'green' : 'red' }} className="font-medium">
            {lunch.selected ? 'Selected' : 'Not Selected'}
          </span>
          {lunch.selected && lunch.qrCode && (
            <div className="mt-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${lunch.qrCode}`} 
                alt="Lunch QR Code"
                className="w-24 h-24 border border-gray-200 rounded-lg shadow-sm"
              />
            </div>
          )}
          {lunch.used && (
            <span className="text-sm text-gray-500">
              Used at: {new Date(lunch.usedAt!).toLocaleString()}
        </span>
          )}
        </div>
      ),
    },
    {
      title: 'Dinner',
      dataIndex: ['meals', 'dinner'],
      key: 'dinner',
      width: '20%',
      render: (dinner: any, record: MealStatus) => (
        <div className="flex flex-col items-center gap-2">
          <span style={{ color: dinner.selected ? 'green' : 'red' }} className="font-medium">
            {dinner.selected ? 'Selected' : 'Not Selected'}
          </span>
          {dinner.selected && dinner.qrCode && (
            <div className="mt-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${dinner.qrCode}`} 
                alt="Dinner QR Code"
                className="w-24 h-24 border border-gray-200 rounded-lg shadow-sm"
              />
            </div>
          )}
          {dinner.used && (
            <span className="text-sm text-gray-500">
              Used at: {new Date(dinner.usedAt!).toLocaleString()}
        </span>
          )}
        </div>
      ),
    },
  ]

  const handleDateSelect = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
  }

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month)
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
  }

  const currentStats = getMealStats()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Meal Analytics</h2>
        <div className="flex gap-4">
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: i,
              label: dayjs().month(i).format('MMMM')
            }))}
          />
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            options={Array.from({ length: 5 }, (_, i) => ({
              value: dayjs().year() - 2 + i,
              label: (dayjs().year() - 2 + i).toString()
            }))}
          />
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Breakfast Statistics">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPieData(currentStats.breakfast.selected, currentStats.breakfast.notSelected)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieData(currentStats.breakfast.selected, currentStats.breakfast.notSelected).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Lunch Statistics">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPieData(currentStats.lunch.selected, currentStats.lunch.notSelected)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieData(currentStats.lunch.selected, currentStats.lunch.notSelected).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Dinner Statistics">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPieData(currentStats.dinner.selected, currentStats.dinner.notSelected)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieData(currentStats.dinner.selected, currentStats.dinner.notSelected).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Calendar">
        <Calendar
          value={selectedDate}
          onChange={handleDateSelect}
          mode="month"
          onPanelChange={(date) => {
            setSelectedMonth(date.month())
            setSelectedYear(date.year())
          }}
        />
      </Card>

      <Card title={`Student Meal Status for ${selectedDate.format('MMMM D, YYYY')}`}>
        <Table
          dataSource={mealStatus}
          columns={studentColumns}
          rowKey="studentEmail"
          pagination={false}
          scroll={{ x: 1200 }}
          className="overflow-x-auto"
        />
      </Card>
    </div>
  )
} 