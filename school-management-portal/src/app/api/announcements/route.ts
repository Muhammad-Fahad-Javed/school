// src/app/api/announcements/route.ts
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  await requireAuth();

  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    include: { author: true },
    orderBy: { publishDate: 'desc' },
    take: 20,
  });

  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const user = await requireAuth();

  try {
    const body = await request.json();

    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        type: body.type,
        target: body.target,
        targetId: body.targetId,
        authorId: user.id,
        isPublished: body.isPublished ?? false,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
