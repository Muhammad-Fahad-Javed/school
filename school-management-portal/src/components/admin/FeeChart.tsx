// src/components/admin/FeeChart.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', collected: 45000, pending: 12000 },
  { month: 'Feb', collected: 52000, pending: 8000 },
  { month: 'Mar', collected: 48000, pending: 15000 },
  { month: 'Apr', collected: 55000, pending: 5000 },
  { month: 'May', collected: 60000, pending: 3000 },
  { month: 'Jun', collected: 35000, pending: 20000 },
];

export function FeeChart() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Fee Collection Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="collected" fill="#3b82f6" />
          <Bar dataKey="pending" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
