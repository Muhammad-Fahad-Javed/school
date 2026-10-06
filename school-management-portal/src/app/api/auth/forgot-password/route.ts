// src/app/api/auth/forgot-password/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid leaking which emails are registered.
    if (user) {
      const resetToken = await new SignJWT({ userId: user.id, purpose: 'password-reset' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(JWT_SECRET);

      // In production, email this link to the user instead of logging it.
      console.log(`Password reset link: /reset-password?token=${resetToken}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
