// src/app/api/fees/vouchers/route.ts
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { generateVoucherNumber } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireAuth();

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const status = searchParams.get('status');

  const vouchers = await prisma.feeVoucher.findMany({
    where: {
      ...(studentId ? { studentId } : {}),
      ...(status ? { status: status as any } : {}),
    },
    include: { student: true, items: true, payments: true },
    orderBy: { dueDate: 'desc' },
  });

  return NextResponse.json(vouchers);
}

export async function POST(request: Request) {
  await requireAuth();

  try {
    const body = await request.json();

    const voucher = await prisma.feeVoucher.create({
      data: {
        voucherNumber: generateVoucherNumber(),
        studentId: body.studentId,
        month: body.month,
        totalAmount: body.totalAmount,
        discount: body.discount || 0,
        previousBalance: body.previousBalance || 0,
        totalPayable: body.totalPayable,
        dueDate: new Date(body.dueDate),
        items: {
          create: (body.items || []).map((item: any) => ({
            description: item.description,
            amount: item.amount,
            type: item.type,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(voucher, { status: 201 });
  } catch (error) {
    console.error('Create voucher error:', error);
    return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
  }
}
