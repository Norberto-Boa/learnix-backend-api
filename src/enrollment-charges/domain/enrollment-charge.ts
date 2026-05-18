import type { CHARGE_STATUS } from '@/generated/prisma/enums';

export interface EnrollmentCharge {
  id: string;
  enrollmentId: string;
  feeTypeId: string;
  academicYearId: string;
  referenceYear: number;
  referenceMonth: number;
  dueDate: Date;
  baseAmount: number;
  penaltyAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: CHARGE_STATUS;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
