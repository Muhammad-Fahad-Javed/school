// src/app/(dashboard)/admin/page.tsx
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { AttendanceChart } from '@/components/admin/AttendanceChart';
import { FeeChart } from '@/components/admin/FeeChart';
import { PerformanceChart } from '@/components/admin/PerformanceChart';

export default async function AdminDashboard() {
  await requireRole('ADMIN');

  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    presentToday,
    absentToday,
    pendingFees,
    feesCollected,
    upcomingExams,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
    prisma.attendance.count({
      where: {
        status: 'PRESENT',
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.attendance.count({
      where: {
        status: 'ABSENT',
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.feeVoucher.aggregate({
      where: { status: 'PENDING' },
      _sum: { totalPayable: true },
    }),
    prisma.feeVoucher.aggregate({
      where: { status: 'PAID' },
      _sum: { totalPayable: true },
    }),
    prisma.exam.count({
      where: {
        examDate: { gte: new Date() },
        isPublished: true,
      },
    }),
  ]);

  const recentActivities = await prisma.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <DashboardStats
        totalStudents={totalStudents}
        totalTeachers={totalTeachers}
        totalClasses={totalClasses}
        presentToday={presentToday}
        absentToday={absentToday}
        pendingFees={pendingFees._sum.totalPayable || 0}
        feesCollected={feesCollected._sum.totalPayable || 0}
        upcomingExams={upcomingExams}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <PerformanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeeChart />
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
}
