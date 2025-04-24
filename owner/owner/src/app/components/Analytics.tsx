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
      opted: boolean
      qrCode: string | null
      used: boolean
      usedAt: string | null
    }
    lunch: {
      opted: boolean
      qrCode: string | null
      used: boolean
      usedAt: string | null
    }
    dinner: {
      opted: boolean
      qrCode: string | null
      used: boolean
      usedAt: string | null
    }
  }
}

interface MealStats {
  date: string
  breakfast: {
    opted: number
    notOpted: number
  }
  lunch: {
    opted: number
    notOpted: number
  }
  dinner: {
    opted: number
    notOpted: number
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
      breakfast: { opted: 0, notOpted: 0 },
      lunch: { opted: 0, notOpted: 0 },
      dinner: { opted: 0, notOpted: 0 }
    }

    mealStatus.forEach(status => {
      if (status.meals.breakfast.opted) stats.breakfast.opted++
      else stats.breakfast.notOpted++
      
      if (status.meals.lunch.opted) stats.lunch.opted++
      else stats.lunch.notOpted++
      
      if (status.meals.dinner.opted) stats.dinner.opted++
      else stats.dinner.notOpted++
    })

    return stats
  }

  const getPieData = (opted: number, notOpted: number) => [
    { name: 'Opted', value: opted },
    { name: 'Not Opted', value: notOpted }
  ]

  const studentColumns = [
    {
      title: 'Name',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Email',
      dataIndex: 'studentEmail',
      key: 'studentEmail',
    },
    {
      title: 'Breakfast',
      dataIndex: ['meals', 'breakfast', 'opted'],
      key: 'breakfast',
      render: (opted: boolean, record: MealStatus) => (
        <div>
          <span style={{ color: opted ? 'green' : 'red' }}>
            {opted ? 'Opted' : 'Not Opted'}
          </span>
          {opted && record.meals.breakfast.qrCode && (
            <div className="mt-1">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${record.meals.breakfast.qrCode}`} 
                alt="Breakfast QR Code"
                className="w-8 h-8"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Lunch',
      dataIndex: ['meals', 'lunch', 'opted'],
      key: 'lunch',
      render: (opted: boolean, record: MealStatus) => (
        <div>
          <span style={{ color: opted ? 'green' : 'red' }}>
            {opted ? 'Opted' : 'Not Opted'}
          </span>
          {opted && record.meals.lunch.qrCode && (
            <div className="mt-1">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${record.meals.lunch.qrCode}`} 
                alt="Lunch QR Code"
                className="w-8 h-8"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Dinner',
      dataIndex: ['meals', 'dinner', 'opted'],
      key: 'dinner',
      render: (opted: boolean, record: MealStatus) => (
        <div>
          <span style={{ color: opted ? 'green' : 'red' }}>
            {opted ? 'Opted' : 'Not Opted'}
          </span>
          {opted && record.meals.dinner.qrCode && (
            <div className="mt-1">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${record.meals.dinner.qrCode}`} 
                alt="Dinner QR Code"
                className="w-8 h-8"
              />
            </div>
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
                  data={getPieData(currentStats.breakfast.opted, currentStats.breakfast.notOpted)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieData(currentStats.breakfast.opted, currentStats.breakfast.notOpted).map((entry, index) => (
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
                  data={getPieData(currentStats.lunch.opted, currentStats.lunch.notOpted)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieData(currentStats.lunch.opted, currentStats.lunch.notOpted).map((entry, index) => (
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
                  data={getPieData(currentStats.dinner.opted, currentStats.dinner.notOpted)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieData(currentStats.dinner.opted, currentStats.dinner.notOpted).map((entry, index) => (
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
        />
      </Card>
    </div>
  )
} 