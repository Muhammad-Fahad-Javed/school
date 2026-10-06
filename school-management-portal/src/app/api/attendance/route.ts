// src/app/api/attendance/route.ts
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireAuth();

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const classId = searchParams.get('classId');
  const date = searchParams.get('date');

  const attendances = await prisma.attendance.findMany({
    where: {
      ...(studentId ? { studentId } : {}),
      ...(classId ? { classId } : {}),
      ...(date ? { date: new Date(date) } : {}),
    },
    include: { student: true, subject: true },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(attendances);
}

export async function POST(request: Request) {
  const user = await requireAuth();

  try {
    const body = await request.json();
    const { records } = body as {
      records: { studentId: string; status: string; classId?: string; subjectId?: string; date?: string }[];
    };

    const teacher = user.teacher;

    const results = await Promise.all(
      records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_date_subjectId: {
              studentId: record.studentId,
              date: record.date ? new Date(record.date) : new Date(new Date().setHours(0, 0, 0, 0)),
              subjectId: record.subjectId || '',
            },
          },
          update: { status: record.status as any },
          create: {
            studentId: record.studentId,
            teacherId: teacher?.id,
            classId: record.classId,
            subjectId: record.subjectId,
            date: record.date ? new Date(record.date) : new Date(),
            status: record.status as any,
          },
        })
      )
    );

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error('Mark attendance error:', error);
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}
