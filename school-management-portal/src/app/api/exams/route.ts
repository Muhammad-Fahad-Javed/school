// src/app/api/exams/route.ts
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireAuth();

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');
  const subjectId = searchParams.get('subjectId');

  const exams = await prisma.exam.findMany({
    where: {
      ...(classId ? { classId } : {}),
      ...(subjectId ? { subjectId } : {}),
    },
    include: { subject: true, class: true, academicSession: true },
    orderBy: { examDate: 'desc' },
  });

  return NextResponse.json(exams);
}

export async function POST(request: Request) {
  await requireAuth();

  try {
    const body = await request.json();

    const exam = await prisma.exam.create({
      data: {
        name: body.name,
        type: body.type,
        academicSessionId: body.academicSessionId,
        classId: body.classId,
        subjectId: body.subjectId,
        examDate: new Date(body.examDate),
        totalMarks: body.totalMarks,
        passingMarks: body.passingMarks,
        term: body.term,
        description: body.description,
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error('Create exam error:', error);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}
