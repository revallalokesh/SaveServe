"use client"

import React, { useState } from "react"
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

// Temporary menu data
const initialMenu: WeeklyMenu = {
  Monday: {
    breakfast: ["Idli", "Sambar", "Chutney", "Coffee/Tea"],
    lunch: ["Rice", "Dal", "Mixed Veg Curry", "Curd", "Papad"],
    dinner: ["Chapati", "Paneer Butter Masala", "Jeera Rice", "Sweet"]
  },
  Tuesday: {
    breakfast: ["Dosa", "Sambar", "Chutney", "Coffee/Tea"],
    lunch: ["Rice", "Sambar", "Bhindi Fry", "Curd", "Pickle"],
    dinner: ["Chapati", "Veg Curry", "Rice", "Ice Cream"]
  },
  Wednesday: {
    breakfast: ["Puri", "Aloo Bhaji", "Upma", "Coffee/Tea"],
    lunch: ["Rice", "Dal Tadka", "Cabbage Curry", "Curd", "Papad"],
    dinner: ["Chapati", "Mushroom Curry", "Rice", "Fruit Custard"]
  },
  Thursday: {
    breakfast: ["Uttapam", "Sambar", "Chutney", "Coffee/Tea"],
    lunch: ["Rice", "Rajma", "Aloo Gobi", "Curd", "Pickle"],
    dinner: ["Chapati", "Dal Makhani", "Rice", "Kheer"]
  },
  Friday: {
    breakfast: ["Poha", "Boiled Eggs/Sprouts", "Coffee/Tea"],
    lunch: ["Rice", "Dal", "Palak Paneer", "Curd", "Papad"],
    dinner: ["Chapati", "Mix Veg Curry", "Rice", "Halwa"]
  },
  Saturday: {
    breakfast: ["Vada", "Sambar", "Chutney", "Coffee/Tea"],
    lunch: ["Rice", "Sambar", "Potato Curry", "Curd", "Pickle"],
    dinner: ["Chapati", "Chana Masala", "Rice", "Gulab Jamun"]
  },
  Sunday: {
    breakfast: ["Paratha", "Chole", "Curd", "Coffee/Tea"],
    lunch: ["Rice", "Dal Fry", "Veg Korma", "Curd", "Papad"],
    dinner: ["Chapati", "Matar Paneer", "Rice", "Rasmalai"]
  }
}

export function FoodMenu() {
  const [menu, setMenu] = useState<WeeklyMenu>(initialMenu)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedMeal, setSelectedMeal] = useState<keyof Meal>("breakfast")
  const [form] = Form.useForm()

  const handleEdit = (day: string, meal: keyof Meal) => {
    setSelectedDay(day)
    setSelectedMeal(meal)
    form.setFieldsValue({
      items: menu[day][meal].join(", ")
    })
    setIsEditModalVisible(true)
  }

  const handleSave = (values: { items: string }) => {
    try {
      const items = values.items.split(",").map(item => item.trim())
      setMenu(prev => ({
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          [selectedMeal]: items
        }
      }))
      message.success("Menu updated successfully")
      setIsEditModalVisible(false)
    } catch (error) {
      message.error("Failed to update menu")
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
                    {meals[mealType].map((item, index) => (
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