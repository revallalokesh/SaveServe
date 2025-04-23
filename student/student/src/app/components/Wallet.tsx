'use client';

import React, { useState, useEffect } from 'react';
import Card from 'antd/es/card';
import Typography from 'antd/es/typography';
import Button from 'antd/es/button';
import Table from 'antd/es/table';
import message from 'antd/es/message';
import Statistic from 'antd/es/statistic';

const { Title, Text } = Typography;

interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

interface WalletProps {
  studentId?: string;
}

const MEAL_CREDIT_AMOUNTS = {
  breakfast: 50,
  lunch: 100,
  dinner: 100,
};

const Wallet: React.FC<WalletProps> = ({ studentId }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    // Load wallet data from localStorage
    const savedBalance = localStorage.getItem('walletBalance');
    const savedTransactions = localStorage.getItem('walletTransactions');
    
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    // Save wallet data to localStorage whenever it changes
    localStorage.setItem('walletBalance', balance.toString());
    localStorage.setItem('walletTransactions', JSON.stringify(transactions));
  }, [balance, transactions]);

  // Function to add credit for opted-out meals
  const addOptOutCredit = (mealType: keyof typeof MEAL_CREDIT_AMOUNTS) => {
    const creditAmount = MEAL_CREDIT_AMOUNTS[mealType];
    const newTransaction: WalletTransaction = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      description: `Opt-out credit for ${mealType}`,
      amount: creditAmount,
      type: 'credit'
    };

    setBalance(prev => prev + creditAmount);
    setTransactions(prev => [newTransaction, ...prev]);
    message.success(`Added ₹${creditAmount} to your wallet for opting out of ${mealType}`);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: WalletTransaction) => (
        <Text type={record.type === 'credit' ? 'success' : 'danger'}>
          {record.type === 'credit' ? '+' : '-'}₹{amount}
        </Text>
      ),
    },
  ];

  return (
    <div className="wallet-container" style={{ padding: '24px' }}>
      <Title level={2}>My Wallet</Title>
      
      <Card style={{ marginBottom: '24px' }}>
        <Statistic
          title="Current Balance"
          value={balance}
          precision={2}
          prefix="₹"
          valueStyle={{ color: balance >= 0 ? '#3f8600' : '#cf1322' }}
        />
      </Card>

      <Card title="Meal Opt-out Credits" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {Object.entries(MEAL_CREDIT_AMOUNTS).map(([meal, amount]) => (
            <Button
              key={meal}
              type="primary"
              onClick={() => addOptOutCredit(meal as keyof typeof MEAL_CREDIT_AMOUNTS)}
            >
              Opt-out {meal} (₹{amount})
            </Button>
          ))}
        </div>
      </Card>

      <Card title="Transaction History">
        <Table
          dataSource={transactions}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default Wallet; 