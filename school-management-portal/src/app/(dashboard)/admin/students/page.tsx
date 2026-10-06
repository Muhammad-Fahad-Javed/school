// src/app/(dashboard)/admin/students/page.tsx
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { StudentsTable } from '@/components/admin/StudentsTable';

export default async function StudentsPage() {
  await requireRole('ADMIN');

  const students = await prisma.student.findMany({
    include: { class: true, section: true },
    orderBy: { fullName: 'asc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
      </div>
      <StudentsTable students={students} />
    </div>
  );
}
