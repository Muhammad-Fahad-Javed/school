// src/components/admin/StudentsTable.tsx
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface StudentRow {
  id: string;
  studentId: string;
  fullName: string;
  status: string;
  class?: { name: string } | null;
  section?: { name: string } | null;
}

interface StudentsTableProps {
  students: StudentRow[];
}

export function StudentsTable({ students }: StudentsTableProps) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-4 py-3">Student ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Section</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">{student.studentId}</td>
              <td className="px-4 py-3 font-medium">{student.fullName}</td>
              <td className="px-4 py-3">{student.class?.name || '—'}</td>
              <td className="px-4 py-3">{student.section?.name || '—'}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {student.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/students/${student.id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
