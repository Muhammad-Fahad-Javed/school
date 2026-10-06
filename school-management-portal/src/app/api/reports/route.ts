// src/app/api/reports/route.ts
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireRole('ADMIN');

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'overview';

  if (type === 'attendance') {
    const summary = await prisma.attendance.groupBy({
      by: ['status'],
      _count: true,
    });
    return NextResponse.json(summary);
  }

  if (type === 'fees') {
    const summary = await prisma.feeVoucher.groupBy({
      by: ['status'],
      _sum: { totalPayable: true },
      _count: true,
    });
    return NextResponse.json(summary);
  }

  if (type === 'performance') {
    const summary = await prisma.examResult.groupBy({
      by: ['grade'],
      _count: true,
    });
    return NextResponse.json(summary);
  }

  const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
  ]);

  return NextResponse.json({ totalStudents, totalTeachers, totalClasses });
}
