// src/app/(dashboard)/admin/students/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  await requireRole('ADMIN');

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      class: true,
      section: true,
      parent: true,
      examResults: { include: { exam: { include: { subject: true } } } },
      feeVouchers: true,
      attendances: true,
    },
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{student.fullName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Profile</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Student ID</dt>
              <dd>{student.studentId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Admission Number</dt>
              <dd>{student.admissionNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Class</dt>
              <dd>{student.class?.name || '—'} {student.section?.name || ''}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Date of Birth</dt>
              <dd>{formatDate(student.dateOfBirth)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Guardian</dt>
              <dd>{student.parent?.fullName || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd>{student.status}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Summary</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Exam Results</dt>
              <dd>{student.examResults.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Fee Vouchers</dt>
              <dd>{student.feeVouchers.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Attendance Records</dt>
              <dd>{student.attendances.length}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
