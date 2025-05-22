"use client"

import React, { useState, useEffect } from "react"
import { Table, Select, Input, Card, Button, Modal, Form, message } from "antd"
import { SearchOutlined, KeyOutlined } from "@ant-design/icons"

interface Student {
  _id: string
  name: string
  email: string
  hostelId: string
  createdAt: string
}

interface Hostel {
  _id: string
  name: string
  owner: string
  email: string
  username: string
  address: string
  createdAt: string
}

export function Students() {
  const [selectedHostel, setSelectedHostel] = useState<string>("")
  const [searchText, setSearchText] = useState("")
  const [isResetModalVisible, setIsResetModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [resetForm] = Form.useForm()
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Record<string, Student[]>>({})

  useEffect(() => {
    fetchHostels()
  }, [])

  useEffect(() => {
    if (selectedHostel) {
      fetchStudentsByHostel(selectedHostel)
    }
  }, [selectedHostel])

  const fetchHostels = async () => {
    try {
      const response = await fetch('https://save-serve-server.onrender.com/api/hostels')
      if (!response.ok) {
        throw new Error('Failed to fetch hostels')
      }
      const data = await response.json()
      setHostels(data)
    } catch (error) {
      message.error('Failed to load hostels')
      console.error('Error fetching hostels:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentsByHostel = async (hostelId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`https://save-serve-server.onrender.com/api/students/hostel/${hostelId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      const data = await response.json()
      setStudents(prev => ({
        ...prev,
        [hostelId]: data
      }))
    } catch (error) {
      message.error('Failed to load students')
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHostelChange = (value: string) => {
    setSelectedHostel(value)
    setSearchText("") // Reset search when hostel changes
  }

  const handleResetPassword = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await fetch(`https://save-serve-server.onrender.com/api/students/${selectedStudent._id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          newPassword: resetForm.getFieldValue('newPassword') 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      message.success(`Password reset for ${selectedStudent.name}`)
      setIsResetModalVisible(false)
      resetForm.resetFields()
    } catch (error) {
      message.error("Failed to reset password")
      console.error('Error resetting password:', error)
    }
  }

  const filteredStudents = selectedHostel
    ? students[selectedHostel]?.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase())
      ) || []
    : []

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Student, b: Student) => a.name.localeCompare(b.name)
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Student) => (
        <Button
          type="primary"
          icon={<KeyOutlined />}
          onClick={() => {
            setSelectedStudent(record)
            setIsResetModalVisible(true)
          }}
        >
          Reset Password
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Student Management</h2>
      </div>

      <Card>
        <div className="flex gap-4 mb-4">
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Select a hostel"
            optionFilterProp="children"
            onChange={handleHostelChange}
            value={selectedHostel}
            loading={loading}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={hostels.map(hostel => ({
              value: hostel._id,
              label: hostel.name
            }))}
          />
          <Input
            placeholder="Search students..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            disabled={!selectedHostel}
          />
        </div>

        <Table
          dataSource={filteredStudents}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>

      <Modal
        title={`Reset Password for ${selectedStudent?.name}`}
        open={isResetModalVisible}
        onCancel={() => {
          setIsResetModalVisible(false)
          resetForm.resetFields()
        }}
        footer={null}
      >
        <Form form={resetForm} onFinish={handleResetPassword} layout="vertical">
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: "Please input new password" }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
} 