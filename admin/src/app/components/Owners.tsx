"use client"

import React, { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Input, message, Card, Spin } from "antd"
import { SearchOutlined, KeyOutlined, PlusOutlined } from "@ant-design/icons"
import { useAuth } from "./AuthContext"

interface Owner {
  id: string
  username: string
  name: string
  email: string
  address: string
  role: string
  hostel: {
    name: string
  }
  createdAt: string
}

interface CreateOwnerForm {
  name: string
  email: string
  hostelName: string
  username: string
  password: string
  address: string
}

export function Owners() {
  const { isLoggedIn } = useAuth()
  const [owners, setOwners] = useState<Owner[]>([])
  const [isResetModalVisible, setIsResetModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [searchText, setSearchText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resetForm] = Form.useForm()
  const [createForm] = Form.useForm()

  // Fetch owners data
  const fetchOwners = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('https://save-serve-server.onrender.com/api/hostels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to fetch owners')
      }
      
      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server')
      }

      console.log('Raw data from server:', data) // Debug log

      const formattedOwners = data.map((hostel: any) => {
        if (!hostel) {
          console.warn('Received null or undefined hostel object')
          return null
        }

        console.log('Processing hostel:', hostel) // Debug individual hostel

        return {
          id: hostel._id || '',
          username: hostel.username || '',
          name: hostel.name || '',
          email: hostel.email || '',
          address: hostel.address || '',
          role: hostel.role || 'owner',
          hostel: {
            name: hostel.hostel?.name || ''
          },
          createdAt: hostel.createdAt ? new Date(hostel.createdAt).toLocaleDateString() : ''
        }
      }).filter((owner): owner is Owner => owner !== null) // Type guard to ensure non-null values

      console.log('Formatted owners:', formattedOwners)
      setOwners(formattedOwners)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch owners list'
      setError(errorMessage)
      message.error(errorMessage)
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchOwners()
    }
  }, [isLoggedIn])

  const handleResetPassword = async (values: { newPassword: string }) => {
    try {
      if (!selectedOwner) return
      
      const response = await fetch(`https://save-serve-server.onrender.com/api/hostels/${selectedOwner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password: values.newPassword })
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      message.success("Password reset successfully")
      setIsResetModalVisible(false)
      resetForm.resetFields()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password'
      message.error(errorMessage)
      console.error('Reset password error:', error)
    }
  }

  const handleCreateOwner = async (values: CreateOwnerForm) => {
    try {
      const response = await fetch('https://save-serve-server.onrender.com/api/hostels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        throw new Error('Failed to create owner')
      }

      message.success("Owner created successfully")
      setIsCreateModalVisible(false)
      createForm.resetFields()
      fetchOwners() // Refresh the list
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create owner'
      message.error(errorMessage)
      console.error('Create owner error:', error)
    }
  }

  const handleDeleteOwner = async (id: string) => {
    try {
      const response = await fetch(`https://save-serve-server.onrender.com/api/hostels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete owner')
      }

      message.success("Owner deleted successfully")
      fetchOwners() // Refresh the list
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete owner'
      message.error(errorMessage)
      console.error('Delete owner error:', error)
    }
  }

  const filteredOwners = owners.filter(owner => {
    const searchLower = searchText.toLowerCase()
    return (
      (owner.name?.toLowerCase() || '').includes(searchLower) ||
      (owner.email?.toLowerCase() || '').includes(searchLower) ||
      (owner.hostel.name?.toLowerCase() || '').includes(searchLower) ||
      (owner.username?.toLowerCase() || '').includes(searchLower)
    )
  })

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Owner, b: Owner) => (a.name || '').localeCompare(b.name || ''),
      render: (text: string) => text || 'N/A'
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => text || 'N/A'
    },
    {
      title: "Hostel",
      dataIndex: "hostel.name",
      key: "hostel.name",
      sorter: (a: Owner, b: Owner) => (a.hostel.name || '').localeCompare(b.hostel.name || ''),
      render: (text: string) => text || 'N/A'
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text: string) => text || 'N/A'
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text: string) => text || 'N/A'
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => text || 'N/A',
      sorter: (a: Owner, b: Owner) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Owner) => (
        <div className="space-x-2">
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
          <Button
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Delete Owner',
                content: `Are you sure you want to delete ${record.name || 'this owner'}?`,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => handleDeleteOwner(record.id)
              })
            }}
          >
            Delete
          </Button>
        </div>
      )
    }
  ]

  if (error) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl text-red-500 mb-4">Error Loading Owners</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button type="primary" onClick={fetchOwners}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Hostel Owners Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
        >
          Add Owner
        </Button>
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
          loading={isLoading}
        />
      </Card>

      {/* Reset Password Modal */}
      <Modal
        title={`Reset Password for ${selectedOwner?.name || 'Owner'}`}
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
            rules={[
              { required: true, message: "Please input new password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
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

      {/* Create Owner Modal */}
      <Modal
        title="Create New Owner"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false)
          createForm.resetFields()
        }}
        footer={null}
      >
        <Form form={createForm} onFinish={handleCreateOwner} layout="vertical">
          <Form.Item
            name="name"
            label="Owner Name"
            rules={[{ required: true, message: "Please input owner name" }]}
          >
            <Input placeholder="Enter owner name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email" },
              { type: 'email', message: "Please enter a valid email" }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="hostelName"
            label="Hostel Name"
            rules={[{ required: true, message: "Please input hostel name" }]}
          >
            <Input placeholder="Enter hostel name" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Hostel Address"
            rules={[{ required: true, message: "Please input hostel address" }]}
          >
            <Input.TextArea placeholder="Enter hostel address" rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Owner
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
} 