// src/app/api/assignments/route.ts
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireAuth();

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');
  const subjectId = searchParams.get('subjectId');

  const assignments = await prisma.assignment.findMany({
    where: {
      ...(classId ? { classId } : {}),
      ...(subjectId ? { subjectId } : {}),
    },
    include: { subject: true, class: true, teacher: true, submissions: true },
    orderBy: { dueDate: 'desc' },
  });

  return NextResponse.json(assignments);
}

export async function POST(request: Request) {
  const user = await requireAuth();

  try {
    const body = await request.json();

    if (!user.teacher) {
      return NextResponse.json({ error: 'Only teachers can create assignments' }, { status: 403 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: body.title,
        description: body.description,
        subjectId: body.subjectId,
        classId: body.classId,
        sectionId: body.sectionId,
        teacherId: user.teacher.id,
        dueDate: new Date(body.dueDate),
        attachments: body.attachments || [],
        isPublished: body.isPublished ?? false,
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Create assignment error:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}
