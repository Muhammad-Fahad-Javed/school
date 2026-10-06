// src/app/(dashboard)/parent/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default async function ParentDashboard() {
  const user = await requireAuth();

  const parent = await prisma.parent.findUnique({
    where: { userId: user.id },
    include: {
      children: {
        include: {
          class: true,
          section: true,
          attendances: {
            where: {
              date: {
                gte: new Date(new Date().getFullYear(), 0, 1),
              },
            },
          },
          examResults: {
            include: {
              exam: {
                include: {
                  subject: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
          feeVouchers: {
            where: {
              status: { in: ['PENDING', 'PARTIALLY_PAID'] },
            },
          },
        },
      },
    },
  });

  if (!parent) {
    return <div>Parent profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
      <p className="text-gray-600">Welcome, {parent.fullName}</p>

      <div className="grid grid-cols-1 gap-6">
        {parent.children.map((child) => {
          const totalDays = child.attendances.length;
          const presentDays = child.attendances.filter(a => a.status === 'PRESENT').length;
          const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
          const pendingFees = child.feeVouchers.reduce((sum, v) => sum + v.totalPayable, 0);

          return (
            <Card key={child.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{child.fullName}</h3>
                  <p className="text-sm text-gray-600">
                    {child.class?.name} {child.section?.name} • ID: {child.studentId}
                  </p>
                </div>
                <Link
                  href={`/parent/children/${child.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p className="text-xl font-semibold">{attendancePercentage.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{presentDays} present</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Grade</p>
                  <p className="text-xl font-semibold">
                    {child.examResults[0]?.grade || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Fees</p>
                  <p className="text-xl font-semibold text-red-600">
                    ${pendingFees.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Results</p>
                  <p className="text-xl font-semibold">{child.examResults.length}</p>
                  <p className="text-xs text-gray-500">subjects</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
