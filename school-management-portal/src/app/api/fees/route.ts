// src/app/api/fees/route.ts
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  await requireRole('ADMIN');

  const feeStructures = await prisma.feeStructure.findMany({
    include: { class: true, academicSession: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(feeStructures);
}

export async function POST(request: Request) {
  await requireRole('ADMIN');

  try {
    const body = await request.json();

    const feeStructure = await prisma.feeStructure.create({
      data: {
        name: body.name,
        type: body.type,
        amount: body.amount,
        classId: body.classId,
        academicSessionId: body.academicSessionId,
        description: body.description,
      },
    });

    return NextResponse.json(feeStructure, { status: 201 });
  } catch (error) {
    console.error('Create fee structure error:', error);
    return NextResponse.json({ error: 'Failed to create fee structure' }, { status: 500 });
  }
}
