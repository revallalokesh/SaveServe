"use client"

import React, { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Input, message, Card } from "antd"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PlusOutlined, 
  SearchOutlined, 
  HomeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  MailOutlined,
  LockOutlined
} from "@ant-design/icons"
import type { TableProps } from 'antd'

interface Hostel {
  _id: string
  name: string
  address: string
  owner: string
  email: string
  username: string
  password: string
  createdAt: string
}

interface RegisterHostelValues {
  name: string;
  owner: string;
  address: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

export function Hostels() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [form] = Form.useForm()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHostels()
  }, [])

  const fetchHostels = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/hostels', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch hostels')
      const data = await response.json()
      setHostels(data)
    } catch {
      message.error('Failed to fetch hostels')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values: RegisterHostelValues) => {
    try {
      const hostelData = { ...values };
      delete hostelData.confirmPassword;

      const response = await fetch('http://localhost:5001/api/hostels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(hostelData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to register hostel')
      }

      const newHostel = await response.json()
      setHostels([newHostel, ...hostels])
      message.success("Hostel registered successfully")
      setIsRegisterModalVisible(false)
      form.resetFields()
    } catch {
      message.error("Failed to register hostel")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/hostels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete hostel')
      
      setHostels(hostels.filter(hostel => hostel._id !== id))
      message.success('Hostel deleted successfully')
    } catch {
      message.error('Failed to delete hostel')
    }
  }

  const filteredHostels = hostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchText.toLowerCase()) ||
    hostel.address.toLowerCase().includes(searchText.toLowerCase()) ||
    hostel.owner.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns: TableProps<Hostel>['columns'] = [
    {
      title: "Hostel Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <div className="flex items-center gap-2 py-1">
          <HomeOutlined className="text-primary" />
          <span className="font-medium">{name}</span>
        </div>
      )
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      render: (address: string) => (
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-foreground/50" />
          <span className="text-sm">{address}</span>
        </div>
      )
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (owner: string) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-foreground/50" />
          <span className="text-sm">{owner}</span>
        </div>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, hostel: Hostel) => (
        <div className="flex items-center gap-2">
          <Button 
            type="text" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => handleDelete(hostel._id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-background to-background p-6 rounded-2xl"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Hostel Management
            </h2>
            <p className="text-foreground/60 mt-1">Manage and monitor all hostels</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsRegisterModalVisible(true)}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5"
          >
            Register New Hostel
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Input
            placeholder="Search hostels..."
            prefix={<SearchOutlined className="text-foreground/50" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md flex-1"
          />
          <div className="flex gap-2">
            <Button
              type={viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-primary' : ''}
            >
              Grid View
            </Button>
            <Button
              type={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-primary' : ''}
            >
              Table View
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredHostels.map((hostel) => (
              <motion.div
                key={hostel._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group"
              >
                <Card
                  className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background/60 backdrop-blur-xl border-border/50"
                  hoverable
                  actions={[
                    <Button 
                      key="delete"
                      type="text" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(hostel._id)}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <HomeOutlined className="text-primary" />
                          {hostel.name}
                        </h3>
                        <p className="text-sm text-foreground/60 flex items-center gap-2 mt-1">
                          <EnvironmentOutlined />
                          {hostel.address}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm flex items-center gap-2">
                        <UserOutlined />
                        <span className="text-foreground/60">Owner:</span> {hostel.owner}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-background/60 backdrop-blur-xl border-border/50">
              <Table
                dataSource={filteredHostels}
                columns={columns}
                rowKey="_id"
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total ${total} hostels`,
                }}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <HomeOutlined className="text-primary" />
            <span>Register New Hostel</span>
          </div>
        }
        open={isRegisterModalVisible}
        onCancel={() => {
          setIsRegisterModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form 
          form={form} 
          onFinish={handleRegister} 
          layout="vertical" 
          className="mt-4"
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Hostel Name"
              rules={[{ required: true, message: "Please input hostel name" }]}
            >
              <Input 
                prefix={<HomeOutlined className="text-primary/70" />}
                placeholder="Enter hostel name"
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item
              name="owner"
              label="Owner Name"
              rules={[{ required: true, message: "Please input owner name" }]}
            >
              <Input 
                prefix={<UserOutlined className="text-primary/70" />}
                placeholder="Enter owner name"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input address" }]}
          >
            <Input.TextArea 
              placeholder="Enter hostel address"
              className="rounded-lg"
              rows={3}
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input email" },
                { type: 'email', message: "Please enter a valid email" }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-primary/70" />}
                placeholder="Enter email address"
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input username" },
                { min: 3, message: "Username must be at least 3 characters" }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-primary/70" />}
                placeholder="Enter username"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input password" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-primary/70" />}
                placeholder="Enter password"
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: "Please confirm password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-primary/70" />}
                placeholder="Confirm password"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item className="mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              className="h-10 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5"
            >
              Register Hostel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
} 