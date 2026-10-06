// src/app/api/auth/reset-password/route.ts
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.purpose !== 'password-reset' || !payload.userId) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: payload.userId as string },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
}
