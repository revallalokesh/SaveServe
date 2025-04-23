"use client"

import React, { useState } from "react"
import { Table, Button, Modal, Form, Input, message } from "antd"
import { PlusOutlined, KeyOutlined } from "@ant-design/icons"

interface Student {
  id: string
  name: string
  email: string
}

// Temporary student data
const mockStudents: Student[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com" },
  { id: "4", name: "Sarah Williams", email: "sarah@example.com" },
  { id: "5", name: "David Brown", email: "david@example.com" },
]

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false)
  const [isResetModalVisible, setIsResetModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [form] = Form.useForm()

  const handleRegister = async (values: { email: string; password: string }) => {
    try {
      // Add new student to the temporary list
      const newStudent = {
        id: Date.now().toString(),
        name: values.email.split("@")[0], // Mock name from email
        email: values.email,
      }
      setStudents([...students, newStudent])
      message.success("Student registered successfully")
      setIsRegisterModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error("Failed to register student")
    }
  }

  const handleResetPassword = async (values: { newPassword: string }) => {
    try {
      // In a real app, this would call an API to reset the password
      message.success(`Password reset for ${selectedStudent?.email}`)
      setIsResetModalVisible(false)
    } catch (error) {
      message.error("Failed to reset password")
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
        rowKey="id"
        pagination={{ pageSize: 5 }}
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