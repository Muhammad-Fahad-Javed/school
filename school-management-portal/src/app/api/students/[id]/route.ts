// src/app/api/students/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await requireRole('ADMIN');

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      class: true,
      section: true,
      parent: true,
      examResults: { include: { exam: { include: { subject: true } } } },
      feeVouchers: true,
      attendances: true,
    },
  });

  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  return NextResponse.json(student);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await requireRole('ADMIN');

  try {
    const body = await request.json();

    const student = await prisma.student.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await requireRole('ADMIN');

  try {
    await prisma.student.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
