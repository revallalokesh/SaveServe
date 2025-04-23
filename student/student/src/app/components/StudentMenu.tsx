'use client';

import React, { useState, useEffect } from 'react';
import Card from 'antd/es/card';
import Typography from 'antd/es/typography';
import Button from 'antd/es/button';
import Switch from 'antd/es/switch';
import Tabs from 'antd/es/tabs';
import QRCode from 'antd/es/qrcode';
import message from 'antd/es/message';
import Table from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { TabsProps } from 'antd/es/tabs';
import './menu.css';

const { Title, Text } = Typography;

interface MealOption {
  opted: boolean;
  locked: boolean;
  qrCode?: string;
}

interface DayMeals {
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
}

interface WeeklyMenu {
  [key: string]: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
}

const StudentMenu: React.FC = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string>(getCurrentDay());
  const [mealOptions, setMealOptions] = useState<DayMeals>({
    breakfast: { opted: false, locked: false },
    lunch: { opted: false, locked: false },
    dinner: { opted: false, locked: false }
  });

  // Mock weekly menu data
  const weeklyMenu: WeeklyMenu = {
    Monday: {
      breakfast: ['Idli', 'Sambar', 'Chutney', 'Coffee/Tea'],
      lunch: ['Rice', 'Dal', 'Mixed Veg Curry', 'Curd', 'Papad'],
      dinner: ['Chapati', 'Paneer Butter Masala', 'Jeera Rice', 'Sweet']
    },
    Tuesday: {
      breakfast: ['Dosa', 'Sambar', 'Chutney', 'Coffee/Tea'],
      lunch: ['Rice', 'Sambar', 'Bhindi Fry', 'Curd', 'Pickle'],
      dinner: ['Chapati', 'Veg Curry', 'Rice', 'Ice Cream']
    },
    Wednesday: {
      breakfast: ['Puri', 'Aloo Bhaji', 'Upma', 'Coffee/Tea'],
      lunch: ['Rice', 'Dal Tadka', 'Cabbage Curry', 'Curd', 'Papad'],
      dinner: ['Chapati', 'Mushroom Curry', 'Rice', 'Fruit Custard']
    },
    Thursday: {
      breakfast: ['Uttapam', 'Sambar', 'Chutney', 'Coffee/Tea'],
      lunch: ['Rice', 'Rajma', 'Aloo Gobi', 'Curd', 'Pickle'],
      dinner: ['Chapati', 'Dal Makhani', 'Rice', 'Kheer']
    },
    Friday: {
      breakfast: ['Poha', 'Boiled Eggs/Sprouts', 'Coffee/Tea'],
      lunch: ['Rice', 'Dal', 'Palak Paneer', 'Curd', 'Papad'],
      dinner: ['Chapati', 'Mix Veg Curry', 'Rice', 'Halwa']
    },
    Saturday: {
      breakfast: ['Vada', 'Sambar', 'Chutney', 'Coffee/Tea'],
      lunch: ['Rice', 'Sambar', 'Potato Curry', 'Curd', 'Pickle'],
      dinner: ['Chapati', 'Chana Masala', 'Rice', 'Gulab Jamun']
    },
    Sunday: {
      breakfast: ['Paratha', 'Chole', 'Curd', 'Coffee/Tea'],
      lunch: ['Rice', 'Dal Fry', 'Veg Korma', 'Curd', 'Papad'],
      dinner: ['Chapati', 'Matar Paneer', 'Rice', 'Rasmalai']
    }
  };

  function getCurrentDay(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  const handleMealToggle = (meal: keyof DayMeals) => {
    if (mealOptions[meal].locked) {
      message.warning('This meal option is locked after submission');
      return;
    }

    setMealOptions(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        opted: !prev[meal].opted
      }
    }));
  };

  const handleSubmit = () => {
    // Generate QR codes for opted meals
    const updatedMealOptions = { ...mealOptions };
    Object.keys(updatedMealOptions).forEach((meal) => {
      const mealKey = meal as keyof DayMeals;
      if (updatedMealOptions[mealKey].opted) {
        updatedMealOptions[mealKey] = {
          ...updatedMealOptions[mealKey],
          locked: true,
          qrCode: `${selectedDay}-${meal}-${Date.now()}` // This would be your actual QR code data
        };
      }
    });

    setMealOptions(updatedMealOptions);
    message.success('Meal options submitted successfully!');
  };

  const items: TabsProps['items'] = [
    {
      key: 'breakfast',
      label: 'Breakfast',
      children: (
        <Card>
          <div className="meal-option">
            <div className="meal-header">
              <Title level={4}>Breakfast</Title>
              <Switch
                checked={mealOptions.breakfast.opted}
                onChange={() => handleMealToggle('breakfast')}
                disabled={mealOptions.breakfast.locked}
              />
            </div>
            <div className="meal-items">
              {weeklyMenu[selectedDay]?.breakfast.map((item, index) => (
                <Text key={index} className="menu-item">{item}</Text>
              ))}
            </div>
            {mealOptions.breakfast.qrCode && mealOptions.breakfast.opted && (
              <div className="qr-code">
                <QRCode value={mealOptions.breakfast.qrCode} />
              </div>
            )}
          </div>
        </Card>
      ),
    },
    {
      key: 'lunch',
      label: 'Lunch',
      children: (
        <Card>
          <div className="meal-option">
            <div className="meal-header">
              <Title level={4}>Lunch</Title>
              <Switch
                checked={mealOptions.lunch.opted}
                onChange={() => handleMealToggle('lunch')}
                disabled={mealOptions.lunch.locked}
              />
            </div>
            <div className="meal-items">
              {weeklyMenu[selectedDay]?.lunch.map((item, index) => (
                <Text key={index} className="menu-item">{item}</Text>
              ))}
            </div>
            {mealOptions.lunch.qrCode && mealOptions.lunch.opted && (
              <div className="qr-code">
                <QRCode value={mealOptions.lunch.qrCode} />
              </div>
            )}
          </div>
        </Card>
      ),
    },
    {
      key: 'dinner',
      label: 'Dinner',
      children: (
        <Card>
          <div className="meal-option">
            <div className="meal-header">
              <Title level={4}>Dinner</Title>
              <Switch
                checked={mealOptions.dinner.opted}
                onChange={() => handleMealToggle('dinner')}
                disabled={mealOptions.dinner.locked}
              />
            </div>
            <div className="meal-items">
              {weeklyMenu[selectedDay]?.dinner.map((item, index) => (
                <Text key={index} className="menu-item">{item}</Text>
              ))}
            </div>
            {mealOptions.dinner.qrCode && mealOptions.dinner.opted && (
              <div className="qr-code">
                <QRCode value={mealOptions.dinner.qrCode} />
              </div>
            )}
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-20">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <Title level={2} className="!mb-0">Meal Options - {selectedDay}</Title>
      </div>
      
      <Card className="mb-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
        <Tabs 
          defaultActiveKey="breakfast" 
          items={items}
          className="custom-tabs"
        />

        <div className="mt-6 flex justify-end">
          <Button 
            type="primary" 
            onClick={handleSubmit}
            disabled={Object.values(mealOptions).every(meal => meal.locked)}
            className="px-8 h-10 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300"
          >
            Submit Selections
          </Button>
        </div>
      </Card>

      <Card 
        title={
          <Title level={3} className="!mb-0">
            Complete Week Menu
          </Title>
        }
        className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
      >
        <Table 
          dataSource={Object.entries(weeklyMenu).map(([day, meals]) => ({
            key: day,
            day,
            breakfast: meals.breakfast.join(', '),
            lunch: meals.lunch.join(', '),
            dinner: meals.dinner.join(', ')
          }))}
          columns={[
            { 
              title: 'Day', 
              dataIndex: 'day', 
              key: 'day',
              className: 'font-medium'
            },
            { 
              title: 'Breakfast', 
              dataIndex: 'breakfast', 
              key: 'breakfast',
              className: 'text-gray-600'
            },
            { 
              title: 'Lunch', 
              dataIndex: 'lunch', 
              key: 'lunch',
              className: 'text-gray-600'
            },
            { 
              title: 'Dinner', 
              dataIndex: 'dinner', 
              key: 'dinner',
              className: 'text-gray-600'
            }
          ]}
          pagination={false}
          bordered
          className="rounded-xl overflow-hidden"
        />
      </Card>

      <style jsx global>{`
        .custom-tabs .ant-tabs-nav::before {
          border: none;
        }
        .custom-tabs .ant-tabs-tab {
          padding: 12px 24px;
          margin: 0;
        }
        .custom-tabs .ant-tabs-tab-active {
          background-color: #f8fafc;
          border-radius: 12px 12px 0 0;
        }
        .custom-tabs .ant-tabs-ink-bar {
          display: none;
        }
        .meal-option {
          padding: 24px;
          background-color: #f8fafc;
          border-radius: 0 12px 12px 12px;
        }
        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .meal-items {
          display: grid;
          gap: 8px;
        }
        .menu-item {
          padding: 8px 16px;
          background-color: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .qr-code {
          margin-top: 24px;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default StudentMenu; 