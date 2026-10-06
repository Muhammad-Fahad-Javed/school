// src/app/api/transcripts/route.ts
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { generateTranscriptNumber } from '@/lib/utils';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET(request: Request) {
  await requireAuth();

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  const transcripts = await prisma.transcript.findMany({
    where: {
      ...(studentId ? { studentId } : {}),
    },
    include: { student: true, academicSession: true },
    orderBy: { issueDate: 'desc' },
  });

  return NextResponse.json(transcripts);
}

export async function POST(request: Request) {
  await requireAuth();

  try {
    const body = await request.json();

    const transcript = await prisma.transcript.create({
      data: {
        transcriptNumber: generateTranscriptNumber(),
        studentId: body.studentId,
        academicSessionId: body.academicSessionId,
        verificationId: randomUUID(),
        isVerified: true,
      },
    });

    return NextResponse.json(transcript, { status: 201 });
  } catch (error) {
    console.error('Create transcript error:', error);
    return NextResponse.json({ error: 'Failed to create transcript' }, { status: 500 });
  }
}
