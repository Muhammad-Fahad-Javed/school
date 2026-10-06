// src/app/(dashboard)/parent/children/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default async function ChildDetailPage({ params }: { params: { id: string } }) {
  const user = await requireAuth();

  const parent = await prisma.parent.findUnique({ where: { userId: user.id } });
  if (!parent) notFound();

  const child = await prisma.student.findFirst({
    where: { id: params.id, parentId: parent.id },
    include: {
      class: true,
      section: true,
      examResults: { include: { exam: { include: { subject: true } } } },
      feeVouchers: true,
      attendances: true,
    },
  });

  if (!child) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{child.fullName}</h1>

      <Card className="p-6">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Student ID</dt>
            <dd className="font-medium">{child.studentId}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Class</dt>
            <dd className="font-medium">{child.class?.name} {child.section?.name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Date of Birth</dt>
            <dd className="font-medium">{formatDate(child.dateOfBirth)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd className="font-medium">{child.status}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Results</h3>
        <div className="space-y-3">
          {child.examResults.slice(0, 5).map((result) => (
            <div key={result.id} className="flex items-center justify-between border-b pb-2">
              <p className="text-sm">{result.exam.subject.name} — {result.exam.name}</p>
              <p className="text-sm font-semibold">{result.obtainedMarks}/{result.totalMarks}</p>
            </div>
          ))}
          {child.examResults.length === 0 && (
            <p className="text-sm text-gray-500">No results yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
