// src/app/api/students/route.ts
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireRole('ADMIN');

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');

  const students = await prisma.student.findMany({
    where: {
      ...(classId ? { classId } : {}),
      ...(sectionId ? { sectionId } : {}),
    },
    include: { class: true, section: true },
    orderBy: { fullName: 'asc' },
  });

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  await requireRole('ADMIN');

  try {
    const body = await request.json();

    const student = await prisma.student.create({
      data: {
        studentId: body.studentId,
        admissionNumber: body.admissionNumber,
        fullName: body.fullName,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        classId: body.classId,
        sectionId: body.sectionId,
        academicSessionId: body.academicSessionId,
        parentId: body.parentId,
        contactNumber: body.contactNumber,
        address: body.address,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
