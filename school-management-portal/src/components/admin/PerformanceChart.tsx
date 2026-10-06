// src/components/admin/PerformanceChart.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'A+', value: 15 },
  { name: 'A', value: 25 },
  { name: 'B', value: 30 },
  { name: 'C', value: 20 },
  { name: 'D', value: 7 },
  { name: 'F', value: 3 },
];

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444', '#8b5cf6'];

export function PerformanceChart() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Student Performance Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
