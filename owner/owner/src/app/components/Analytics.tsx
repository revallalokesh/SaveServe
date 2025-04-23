"use client"

import React, { useState } from "react"
import { Card, Calendar, Table, Select, Row, Col } from "antd"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import dayjs from "dayjs"

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

interface StudentMealStatus {
  id: string
  name: string
  breakfast: boolean
  lunch: boolean
  dinner: boolean
}

// Temporary data
const mockMealStats: MealStats[] = Array.from({ length: 30 }, (_, i) => ({
  date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
  breakfast: {
    opted: Math.floor(Math.random() * 50) + 20,
    notOpted: Math.floor(Math.random() * 20) + 5
  },
  lunch: {
    opted: Math.floor(Math.random() * 50) + 20,
    notOpted: Math.floor(Math.random() * 20) + 5
  },
  dinner: {
    opted: Math.floor(Math.random() * 50) + 20,
    notOpted: Math.floor(Math.random() * 20) + 5
  }
}))

const mockStudentStatus: StudentMealStatus[] = Array.from({ length: 10 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Student ${i + 1}`,
  breakfast: Math.random() > 0.3,
  lunch: Math.random() > 0.3,
  dinner: Math.random() > 0.3
}))

const COLORS = ['#0088FE', '#FF8042']

export function Analytics() {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month())
  const [selectedYear, setSelectedYear] = useState(dayjs().year())

  const getMealStatsForDate = (date: string) => {
    return mockMealStats.find(stat => stat.date === date) || mockMealStats[0]
  }

  const getPieData = (opted: number, notOpted: number) => [
    { name: 'Opted', value: opted },
    { name: 'Not Opted', value: notOpted }
  ]

  const studentColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Breakfast',
      dataIndex: 'breakfast',
      key: 'breakfast',
      render: (opted: boolean) => (
        <span style={{ color: opted ? 'green' : 'red' }}>
          {opted ? 'Opted' : 'Not Opted'}
        </span>
      ),
    },
    {
      title: 'Lunch',
      dataIndex: 'lunch',
      key: 'lunch',
      render: (opted: boolean) => (
        <span style={{ color: opted ? 'green' : 'red' }}>
          {opted ? 'Opted' : 'Not Opted'}
        </span>
      ),
    },
    {
      title: 'Dinner',
      dataIndex: 'dinner',
      key: 'dinner',
      render: (opted: boolean) => (
        <span style={{ color: opted ? 'green' : 'red' }}>
          {opted ? 'Opted' : 'Not Opted'}
        </span>
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

  const currentStats = getMealStatsForDate(selectedDate.format('YYYY-MM-DD'))

  return (
    <div className="space-y-6">
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
          dataSource={mockStudentStatus}
          columns={studentColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  )
} 