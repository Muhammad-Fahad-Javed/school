// src/app/api/teachers/route.ts
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  await requireRole('ADMIN');

  const teachers = await prisma.teacher.findMany({
    include: { classTeacherOf: true, subjects: true },
    orderBy: { fullName: 'asc' },
  });

  return NextResponse.json(teachers);
}

export async function POST(request: Request) {
  await requireRole('ADMIN');

  try {
    const body = await request.json();

    const teacher = await prisma.teacher.create({
      data: {
        teacherId: body.teacherId,
        fullName: body.fullName,
        qualification: body.qualification,
        specialization: body.specialization,
        contactNumber: body.contactNumber,
        address: body.address,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error('Create teacher error:', error);
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
  }
}
