// src/app/api/search/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (q.length < 2) {
    return NextResponse.json({ students: [], teachers: [], classes: [], vouchers: [] });
  }

  const [students, teachers, classes, vouchers] = await Promise.all([
    prisma.student.findMany({
      where: {
        OR: [
          { fullName: { contains: q, mode: 'insensitive' } },
          { studentId: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { class: true },
      take: 10,
    }),
    prisma.teacher.findMany({
      where: {
        OR: [
          { fullName: { contains: q, mode: 'insensitive' } },
          { teacherId: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
    }),
    prisma.class.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      take: 10,
    }),
    prisma.feeVoucher.findMany({
      where: { voucherNumber: { contains: q, mode: 'insensitive' } },
      include: { student: true },
      take: 10,
    }),
  ]);

  return NextResponse.json({ students, teachers, classes, vouchers });
}
