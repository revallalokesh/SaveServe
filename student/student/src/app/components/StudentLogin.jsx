import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, UserAddOutlined, LockOutlined } from '@ant-design/icons';
import './login.css';

const { Option } = Select;

const StudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock hostel data
  const mockHostels = [
    { _id: '1', name: 'Hostel A' },
    { _id: '2', name: 'Hostel B' },
    { _id: '3', name: 'Hostel C' }
  ];

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      
      // Create mock user data with default values
      const mockUser = {
        id: '1',
        name: values?.name || 'Test User',
        email: values?.email || 'test@example.com',
        hostel: {
          id: '1',
          name: 'Hostel A'
        }
      };

      // Store mock user data in localStorage
      localStorage.setItem("studentData", JSON.stringify(mockUser));
      message.success("Login successful");
      
      // Navigate to home instead of dashboard
      navigate("/user/home");
    } catch (error) {
      console.error("Error during login:", error);
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-background/60 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-foreground/60 mt-2">Please enter your details to login</p>
          </div>

          <Form
            layout="vertical"
            onFinish={handleLogin}
            initialValues={{
              hostelId: '1',
              name: '',
              email: '',
              phone: '',
              roomNo: '',
              username: '',
              password: ''
            }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Form.Item
                label={<span className="text-foreground/70 font-medium">Hostel</span>}
                name="hostelId"
              >
                <Select
                  placeholder="Select your hostel"
                  loading={loading}
                  allowClear
                  className="w-full !rounded-xl"
                  suffixIcon={<HomeOutlined className="text-primary/70" />}
                  dropdownStyle={{ borderRadius: '12px' }}
                >
                  {mockHostels.map((hostel) => (
                    <Option key={hostel._id} value={hostel._id}>
                      {hostel.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Form.Item
                label={<span className="text-foreground/70 font-medium">Full Name</span>}
                name="name"
              >
                <Input 
                  prefix={<UserOutlined className="text-primary/70" />}
                  placeholder="Enter your full name"
                  className="rounded-xl py-2 px-4 border-border/50 hover:border-primary/30 focus:border-primary transition-colors"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Form.Item
                label={<span className="text-foreground/70 font-medium">Email</span>}
                name="email"
              >
                <Input 
                  prefix={<MailOutlined className="text-primary/70" />}
                  placeholder="Enter your email"
                  className="rounded-xl py-2 px-4 border-border/50 hover:border-primary/30 focus:border-primary transition-colors"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Form.Item
                label={<span className="text-foreground/70 font-medium">Phone Number</span>}
                name="phone"
              >
                <Input 
                  prefix={<PhoneOutlined className="text-primary/70" />}
                  placeholder="Enter your phone number"
                  className="rounded-xl py-2 px-4 border-border/50 hover:border-primary/30 focus:border-primary transition-colors"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Form.Item
                label={<span className="text-foreground/70 font-medium">Room Number</span>}
                name="roomNo"
              >
                <Input 
                  prefix={<HomeOutlined className="text-primary/70" />}
                  placeholder="Enter room number"
                  className="rounded-xl py-2 px-4 border-border/50 hover:border-primary/30 focus:border-primary transition-colors"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Form.Item
                label={<span className="text-foreground/70 font-medium">Username</span>}
                name="username"
              >
                <Input 
                  prefix={<UserAddOutlined className="text-primary/70" />}
                  placeholder="Enter username"
                  className="rounded-xl py-2 px-4 border-border/50 hover:border-primary/30 focus:border-primary transition-colors"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Form.Item
                label={<span className="text-foreground/70 font-medium">Password</span>}
                name="password"
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-primary/70" />}
                  placeholder="Enter password"
                  className="rounded-xl py-2 px-4 border-border/50 hover:border-primary/30 focus:border-primary transition-colors"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block
                  className="h-11 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5"
                >
                  <span className="font-medium">Login</span>
                </Button>
              </Form.Item>
            </motion.div>
          </Form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLogin; 