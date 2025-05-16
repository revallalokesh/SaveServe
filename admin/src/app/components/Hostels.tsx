"use client"

import React, { useState, useEffect } from "react"
import {  Modal, Form, Input, message } from "antd"
import { motion } from "framer-motion"
import { 
  HomeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  MailOutlined,
  LockOutlined
} from "@ant-design/icons"
import { SearchBar } from "./ui/search-bar"
import type { TableProps } from 'antd'
import { ShimmerButton } from "../components/ui/shimmer-button"
import { GradientCard } from "./ui/gradient-card"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHostels()
  }, [])

  const fetchHostels = async () => {
    try {
      const response = await fetch('https://save-serve-server.onrender.com/api/hostels', {
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

      const response = await fetch('https://save-serve-server.onrender.com/api/hostels', {
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
      const response = await fetch(`https://save-serve-server.onrender.com/api/hostels/${id}`, {
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
    (hostel.name?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
    (hostel.address?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
    (hostel.owner?.toLowerCase() || "").includes(searchText.toLowerCase())
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
          <div 
            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded cursor-pointer transition"
            onClick={() => handleDelete(hostel._id)}
          >
            Delete
          </div>
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
    <>
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-background to-background p-6 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-4">
            <ShimmerButton className="shadow-2xl relative overflow-hidden" onClick={() => setIsRegisterModalVisible(true)}>
              {/* Rotating border ring */}
              <span
                className="absolute inset-0 z-0 pointer-events-none rounded-[100px] animate-spin-around"
                style={{
                  background: "conic-gradient(from 0deg, #fff 0deg, #fff 90deg, transparent 90deg, transparent 360deg)",
                  WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 62%)",
                  maskImage: "radial-gradient(circle, transparent 60%, black 62%)",
                }}
              />
              {/* Button background to cover the center */}
              <span className="absolute inset-0 z-0 rounded-[100px] bg-[var(--bg,black)]" />
              {/* Button content */}
              <span className="relative z-10 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg flex items-center gap-2">
                <span className="animate-spin-around">
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                Register New Hostel
              </span>
            </ShimmerButton>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="max-w-md w-full flex-1">
              <SearchBar
                placeholder="Search hostels..."
                onSearch={setSearchText}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          key="grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredHostels.map((hostel) => (
            <GradientCard
              key={hostel._id}
              _id={hostel._id}
              name={hostel.name}
              address={hostel.address}
              owner={hostel.owner}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>

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
              <ShimmerButton
                className="shadow-2xl"
                onClick={form.submit}
              >
                Register Hostel
              </ShimmerButton>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
} 