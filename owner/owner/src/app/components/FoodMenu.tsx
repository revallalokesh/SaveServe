"use client"

import React, { useState, useEffect } from "react"
import { Modal, Form, Input, message } from "antd"
import { Edit3, Coffee, Sun, Moon } from "lucide-react"

interface Meal {
  breakfast: string[]
  lunch: string[]
  dinner: string[]
}

interface WeeklyMenu {
  [key: string]: Meal
}

const defaultMenu: WeeklyMenu = {
  Monday: { breakfast: [], lunch: [], dinner: [] },
  Tuesday: { breakfast: [], lunch: [], dinner: [] },
  Wednesday: { breakfast: [], lunch: [], dinner: [] },
  Thursday: { breakfast: [], lunch: [], dinner: [] },
  Friday: { breakfast: [], lunch: [], dinner: [] },
  Saturday: { breakfast: [], lunch: [], dinner: [] },
  Sunday: { breakfast: [], lunch: [], dinner: [] }
}

export function FoodMenu() {
  const [menu, setMenu] = useState<WeeklyMenu>(defaultMenu)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedMeal, setSelectedMeal] = useState<keyof Meal>("breakfast")
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Please login first')
        return
      }

      const response = await fetch('http://localhost:5001/api/menu', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch menu')
      }

      const data = await response.json()
      
      // Validate and sanitize the received data
      const validatedMenu: WeeklyMenu = { ...defaultMenu }
      Object.keys(defaultMenu).forEach(day => {
        if (data[day]) {
          validatedMenu[day] = {
            breakfast: Array.isArray(data[day].breakfast) ? data[day].breakfast : [],
            lunch: Array.isArray(data[day].lunch) ? data[day].lunch : [],
            dinner: Array.isArray(data[day].dinner) ? data[day].dinner : []
          }
        }
      })
      
      setMenu(validatedMenu)
    } catch (error) {
      message.error('Failed to fetch menu')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  const handleEdit = (day: string, meal: keyof Meal) => {
    setSelectedDay(day)
    setSelectedMeal(meal)
    const items = menu[day]?.[meal] || []
    form.setFieldsValue({
      items: items.join(", ")
    })
    setIsEditModalVisible(true)
  }

  const handleSave = async (values: { items: string }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Please login first')
        return
      }

      const items = values.items.split(",").map(item => item.trim()).filter(item => item)
      
      const response = await fetch(`http://localhost:5001/api/menu/${selectedDay}/${selectedMeal}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      })

      if (!response.ok) {
        throw new Error('Failed to update menu')
      }

      const updatedMenu = await response.json()
      
      // Validate and sanitize the received data
      const validatedMenu: WeeklyMenu = { ...defaultMenu }
      Object.keys(defaultMenu).forEach(day => {
        if (updatedMenu[day]) {
          validatedMenu[day] = {
            breakfast: Array.isArray(updatedMenu[day].breakfast) ? updatedMenu[day].breakfast : [],
            lunch: Array.isArray(updatedMenu[day].lunch) ? updatedMenu[day].lunch : [],
            dinner: Array.isArray(updatedMenu[day].dinner) ? updatedMenu[day].dinner : []
          }
        }
      })
      
      setMenu(validatedMenu)
      message.success("Menu updated successfully")
      setIsEditModalVisible(false)
    } catch (error) {
      message.error("Failed to update menu")
      console.error('Error:', error)
    }
  }

  const getMealIcon = (meal: keyof Meal) => {
    switch (meal) {
      case "breakfast":
        return <Coffee className="w-5 h-5" />
      case "lunch":
        return <Sun className="w-5 h-5" />
      case "dinner":
        return <Moon className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-400">Loading menu...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Weekly Food Menu</h2>
      </div>

      <div className="grid gap-6">
        {Object.entries(menu).map(([day, meals]) => (
          <div key={day} className="bg-[#1a1b1e] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">{day}</h3>
            
            <div className="grid gap-4">
              {(Object.keys(meals) as Array<keyof Meal>).map((mealType) => (
                <div
                  key={mealType}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/[0.07] transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      {getMealIcon(mealType)}
                      <span className="font-medium capitalize">{mealType}</span>
                    </div>
                    <button
                      onClick={() => handleEdit(day, mealType)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="pl-7">
                    {(meals[mealType] || []).map((item, index) => (
                      <span
                        key={index}
                        className="inline-block bg-white/[0.06] text-gray-300 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <span>Edit {selectedMeal} for {selectedDay}</span>
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        className="modern-modal"
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item
            name="items"
            label="Menu Items (comma-separated)"
            rules={[{ required: true, message: "Please input menu items" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter menu items separated by commas"
              className="modern-input"
            />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .modern-modal .ant-modal-content {
          background: #1a1b1e;
          border: 1px solid #2d2d2d;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 1.5rem;
        }
        .modern-modal .ant-modal-header {
          background: transparent;
          border: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }
        .modern-modal .ant-modal-title {
          color: white;
        }
        .modern-modal .ant-modal-close {
          color: #6b7280;
        }
        .modern-modal .ant-modal-close:hover {
          color: white;
        }
        .modern-modal .ant-form-item-label > label {
          color: #9ca3af;
        }
        .modern-input {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid #2d2d2d !important;
          border-radius: 0.5rem !important;
          color: white !important;
        }
        .modern-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  )
} 