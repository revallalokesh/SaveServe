"use client"

import React, { useState } from "react"
import { Table, Button, Modal, Form, Input, message, Card } from "antd"
import { SearchOutlined, KeyOutlined } from "@ant-design/icons"

interface Owner {
  id: string
  name: string
  email: string
  hostelName: string
  password: string
}

// Temporary data
const mockOwners: Owner[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    hostelName: "University Hostel A",
    password: "hashed_password_1"
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    hostelName: "University Hostel B",
    password: "hashed_password_2"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    hostelName: "University Hostel C",
    password: "hashed_password_3"
  }
]

export function Owners() {
  const [owners, setOwners] = useState<Owner[]>(mockOwners)
  const [isResetModalVisible, setIsResetModalVisible] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [searchText, setSearchText] = useState("")
  const [resetForm] = Form.useForm()

  const handleResetPassword = async (values: { newPassword: string }) => {
    try {
      // Here you would typically make an API call to reset the password
      if (selectedOwner) {
        const updatedOwners = owners.map(owner =>
          owner.id === selectedOwner.id
            ? { ...owner, password: "hashed_" + values.newPassword }
            : owner
        )
        setOwners(updatedOwners)
        message.success("Password reset successfully")
        setIsResetModalVisible(false)
        resetForm.resetFields()
      }
    } catch (error) {
      message.error("Failed to reset password")
    }
  }

  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchText.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchText.toLowerCase()) ||
    owner.hostelName.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Owner, b: Owner) => a.name.localeCompare(b.name)
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Hostel",
      dataIndex: "hostelName",
      key: "hostelName",
      sorter: (a: Owner, b: Owner) => a.hostelName.localeCompare(b.hostelName)
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Owner) => (
        <Button
          type="primary"
          icon={<KeyOutlined />}
          onClick={() => {
            setSelectedOwner(record)
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
        <h2 className="text-2xl font-bold">Hostel Owners Management</h2>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search owners..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Table
          dataSource={filteredOwners}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Reset Password for ${selectedOwner?.name}`}
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