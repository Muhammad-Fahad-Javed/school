// src/app/api/results/route.ts
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { calculatePercentage, getGrade } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireAuth();

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const examId = searchParams.get('examId');

  const results = await prisma.examResult.findMany({
    where: {
      ...(studentId ? { studentId } : {}),
      ...(examId ? { examId } : {}),
    },
    include: { student: true, exam: { include: { subject: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(results);
}

export async function POST(request: Request) {
  await requireAuth();

  try {
    const body = await request.json();
    const { results } = body as {
      results: { studentId: string; examId: string; obtainedMarks: number; totalMarks: number }[];
    };

    const grades = await prisma.grade.findMany();

    const created = await Promise.all(
      results.map((result) => {
        const percentage = calculatePercentage(result.obtainedMarks, result.totalMarks);
        const grade = getGrade(percentage, grades);

        return prisma.examResult.upsert({
          where: {
            studentId_examId: {
              studentId: result.studentId,
              examId: result.examId,
            },
          },
          update: {
            obtainedMarks: result.obtainedMarks,
            totalMarks: result.totalMarks,
            percentage,
            grade,
          },
          create: {
            studentId: result.studentId,
            examId: result.examId,
            obtainedMarks: result.obtainedMarks,
            totalMarks: result.totalMarks,
            percentage,
            grade,
          },
        });
      })
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Save results error:', error);
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 });
  }
}
