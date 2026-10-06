// src/components/admin/DashboardStats.tsx
'use client';

import {
  Users,
  UserCog,
  BookOpen,
  CalendarCheck,
  CalendarX,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface DashboardStatsProps {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  presentToday: number;
  absentToday: number;
  pendingFees: number;
  feesCollected: number;
  upcomingExams: number;
}

export function DashboardStats({
  totalStudents,
  totalTeachers,
  totalClasses,
  presentToday,
  absentToday,
  pendingFees,
  feesCollected,
  upcomingExams,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Teachers',
      value: totalTeachers,
      icon: UserCog,
      color: 'bg-green-500',
    },
    {
      label: 'Total Classes',
      value: totalClasses,
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      label: 'Present Today',
      value: presentToday,
      icon: CalendarCheck,
      color: 'bg-emerald-500',
    },
    {
      label: 'Absent Today',
      value: absentToday,
      icon: CalendarX,
      color: 'bg-red-500',
    },
    {
      label: 'Pending Fees',
      value: `$${pendingFees.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-amber-500',
    },
    {
      label: 'Fees Collected',
      value: `$${feesCollected.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-teal-500',
    },
    {
      label: 'Upcoming Exams',
      value: upcomingExams,
      icon: Clock,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="text-white" size={20} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
