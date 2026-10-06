// src/lib/auth.ts
import { compare, hash } from 'bcryptjs';
import { prisma } from './prisma';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const token = cookies().get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      student: true,
      teacher: true,
      parent: true,
    },
  });

  return user;
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role) throw new Error('Forbidden');
  return user;
}

export async function getDashboardRoute(role: string) {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'TEACHER':
      return '/teacher';
    case 'STUDENT':
      return '/student';
    case 'PARENT':
      return '/parent';
    default:
      return '/';
  }
}
