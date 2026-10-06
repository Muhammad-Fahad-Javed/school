// src/app/api/payments/route.ts
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireAuth();

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const voucherId = searchParams.get('voucherId');

  const payments = await prisma.payment.findMany({
    where: {
      ...(studentId ? { studentId } : {}),
      ...(voucherId ? { voucherId } : {}),
    },
    include: { voucher: true, student: true },
    orderBy: { paymentDate: 'desc' },
  });

  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  await requireAuth();

  try {
    const body = await request.json();

    const payment = await prisma.payment.create({
      data: {
        voucherId: body.voucherId,
        studentId: body.studentId,
        amount: body.amount,
        method: body.method,
        transactionNumber: body.transactionNumber,
        receivedBy: body.receivedBy,
        notes: body.notes,
      },
    });

    const voucher = await prisma.feeVoucher.findUnique({
      where: { id: body.voucherId },
      include: { payments: true },
    });

    if (voucher) {
      const totalPaid = voucher.payments.reduce((sum, p) => sum + p.amount, 0);
      const status =
        totalPaid >= voucher.totalPayable
          ? 'PAID'
          : totalPaid > 0
          ? 'PARTIALLY_PAID'
          : 'PENDING';

      await prisma.feeVoucher.update({
        where: { id: voucher.id },
        data: { status },
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Record payment error:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}
