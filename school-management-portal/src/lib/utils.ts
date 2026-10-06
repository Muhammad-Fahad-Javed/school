// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateVoucherNumber() {
  const prefix = 'VCH';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

export function generateTranscriptNumber() {
  const prefix = 'TR';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `${prefix}-${year}-${random}`;
}

export function calculatePercentage(obtained: number, total: number) {
  if (total === 0) return 0;
  return (obtained / total) * 100;
}

export function getGrade(percentage: number, grades: any[]) {
  const sorted = [...grades].sort((a, b) => b.minPercentage - a.minPercentage);
  for (const grade of sorted) {
    if (percentage >= grade.minPercentage && percentage <= grade.maxPercentage) {
      return grade.name;
    }
  }
  return 'F';
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
