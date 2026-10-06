// src/types/index.ts
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';

export type PaymentStatus = 'PAID' | 'PARTIALLY_PAID' | 'PENDING' | 'OVERDUE';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface StudentSummary {
  id: string;
  studentId: string;
  fullName: string;
  status: string;
  class?: { name: string } | null;
  section?: { name: string } | null;
}

export interface TeacherSummary {
  id: string;
  teacherId: string;
  fullName: string;
  specialization?: string | null;
}

export interface SearchResults {
  students: StudentSummary[];
  teachers: TeacherSummary[];
  classes: { id: string; name: string }[];
  vouchers: { id: string; voucherNumber: string; totalPayable: number; student: { fullName: string } }[];
}
