"use client"

import React, { useState } from "react"
import { Table, Select, Input, Card, Button, Modal, Form, message } from "antd"
import { SearchOutlined, KeyOutlined } from "@ant-design/icons"

interface Student {
  id: string
  name: string
  email: string
  roomNumber: string
  phone: string
  status: "active" | "inactive"
}

interface Hostel {
  id: string
  name: string
}

// Temporary data
const mockHostels: Hostel[] = [
  { id: "1", name: "University Hostel A" },
  { id: "2", name: "University Hostel B" },
  { id: "3", name: "University Hostel C" },
  { id: "4", name: "University Hostel D" },
  { id: "5", name: "University Hostel E" }
]

const mockStudents: Record<string, Student[]> = {
  "1": [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      roomNumber: "101",
      phone: "1234567890",
      status: "active"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      roomNumber: "102",
      phone: "2345678901",
      status: "active"
    }
  ],
  "2": [
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      roomNumber: "201",
      phone: "3456789012",
      status: "active"
    }
  ],
  "3": [
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      roomNumber: "301",
      phone: "4567890123",
      status: "active"
    }
  ]
}

export function Students() {
  const [selectedHostel, setSelectedHostel] = useState<string>("")
  const [searchText, setSearchText] = useState("")
  const [isResetModalVisible, setIsResetModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [resetForm] = Form.useForm()

  const handleHostelChange = (value: string) => {
    setSelectedHostel(value)
    setSearchText("") // Reset search when hostel changes
  }

  const handleResetPassword = async (values: { newPassword: string }) => {
    try {
      // Here you would typically make an API call to reset the password
      message.success(`Password reset for ${selectedStudent?.name}`)
      setIsResetModalVisible(false)
      resetForm.resetFields()
    } catch (error) {
      message.error("Failed to reset password")
    }
  }

  const filteredStudents = selectedHostel
    ? mockStudents[selectedHostel]?.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase()) ||
        student.roomNumber.includes(searchText)
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
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
      sorter: (a: Student, b: Student) => a.roomNumber.localeCompare(b.roomNumber)
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Student) => (
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
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={mockHostels.map(hostel => ({
              value: hostel.id,
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
          rowKey="id"
          pagination={{ pageSize: 10 }}
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