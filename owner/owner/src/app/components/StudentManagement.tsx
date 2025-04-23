"use client"

import React, { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Input, message } from "antd"
import { PlusOutlined, KeyOutlined } from "@ant-design/icons"

interface Student {
  _id: string
  name: string
  email: string
  createdAt: string
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false)
  const [isResetModalVisible, setIsResetModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Please login first')
        return
      }
      
      const response = await fetch('http://localhost:5001/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      message.error('Failed to fetch students')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Please login first')
        return
      }

      const response = await fetch('http://localhost:5001/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to register student')
      }

      await fetchStudents()
      message.success('Student registered successfully')
      setIsRegisterModalVisible(false)
      form.resetFields()
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Failed to register student')
      }
    }
  }

  const handleResetPassword = async (values: { newPassword: string }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Please login first')
        return
      }

      const response = await fetch(`http://localhost:5001/api/students/${selectedStudent?._id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: values.newPassword })
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      message.success(`Password reset for ${selectedStudent?.email}`)
      setIsResetModalVisible(false)
    } catch (error) {
      message.error('Failed to reset password')
      console.error('Error:', error)
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString()
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
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsRegisterModalVisible(true)}
        >
          Register New Student
        </Button>
      </div>

      <Table 
        dataSource={students} 
        columns={columns} 
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        loading={loading}
      />

      <Modal
        title="Register New Student"
        open={isRegisterModalVisible}
        onCancel={() => {
          setIsRegisterModalVisible(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleRegister} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input student name" }]}
          >
            <Input placeholder="Enter student name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email" },
              { type: "email", message: "Please input valid email" },
            ]}
          >
            <Input placeholder="Enter student email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Reset Password for ${selectedStudent?.email}`}
        open={isResetModalVisible}
        onCancel={() => {
          setIsResetModalVisible(false)
        }}
        footer={null}
      >
        <Form onFinish={handleResetPassword} layout="vertical">
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