// src/components/admin/AttendanceChart.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', present: 85, absent: 15 },
  { day: 'Tue', present: 90, absent: 10 },
  { day: 'Wed', present: 88, absent: 12 },
  { day: 'Thu', present: 92, absent: 8 },
  { day: 'Fri', present: 87, absent: 13 },
  { day: 'Sat', present: 70, absent: 30 },
];

export function AttendanceChart() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Attendance Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
