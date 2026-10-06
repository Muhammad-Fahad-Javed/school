// src/app/(dashboard)/student/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

export default async function StudentDashboard() {
  const user = await requireAuth();

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    include: {
      class: true,
      section: true,
      academicSession: true,
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
        take: 5,
      },
      feeVouchers: {
        where: {
          status: { in: ['PENDING', 'PARTIALLY_PAID'] },
        },
        orderBy: { dueDate: 'asc' },
      },
      feedbacks: {
        where: { isPublished: true },
        include: { teacher: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
  });

  if (!student) {
    return <div>Student profile not found</div>;
  }

  const totalDays = student.attendances.length;
  const presentDays = student.attendances.filter(a => a.status === 'PRESENT').length;
  const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  const totalMarks = student.examResults.reduce((sum, r) => sum + r.totalMarks, 0);
  const obtainedMarks = student.examResults.reduce((sum, r) => sum + r.obtainedMarks, 0);
  const overallPercentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

  const pendingFees = student.feeVouchers.reduce((sum, v) => sum + v.totalPayable, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back, {student.fullName}!
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Attendance</p>
          <p className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">{presentDays} present out of {totalDays} days</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Current Grade</p>
          <p className="text-2xl font-bold">
            {student.examResults[0]?.grade || 'N/A'}
          </p>
          <p className="text-xs text-gray-500">{overallPercentage.toFixed(1)}% average</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending Fees</p>
          <p className="text-2xl font-bold text-red-600">${pendingFees.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{student.feeVouchers.length} pending vouchers</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Upcoming Exams</p>
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-gray-500">Check examination schedule</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Recent Results</h3>
          <div className="space-y-3">
            {student.examResults.slice(0, 5).map((result) => (
              <div key={result.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="text-sm font-medium">{result.exam.subject.name}</p>
                  <p className="text-xs text-gray-500">{result.exam.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{result.obtainedMarks}/{result.totalMarks}</p>
                  <p className="text-xs text-gray-500">{result.percentage?.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Latest Feedback</h3>
          <div className="space-y-3">
            {student.feedbacks.map((feedback) => (
              <div key={feedback.id} className="border-b pb-2">
                <p className="text-sm font-medium">{feedback.category}</p>
                <p className="text-sm text-gray-600">{feedback.comment}</p>
                <p className="text-xs text-gray-500">
                  By {feedback.teacher?.fullName || 'Teacher'} • {formatDate(feedback.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
