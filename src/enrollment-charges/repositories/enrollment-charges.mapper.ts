import { EnrollmentCharge as PrismaEnrollmentCharge } from '@/generated/prisma/client';
import { EnrollmentCharge } from '../domain/enrollment-charge';

export class EnrollmentChargeMapper {
  static toDomain(raw: PrismaEnrollmentCharge): EnrollmentCharge {
    return {
      id: raw.id,

      enrollmentId: raw.enrollmentId,
      feeTypeId: raw.feeTypeId,
      academicYearId: raw.academicYearId,

      referenceYear: raw.referenceYear,
      referenceMonth: raw.referenceMonth,

      dueDate: raw.dueDate,

      baseAmount: Number(raw.baseAmount),
      penaltyAmount: Number(raw.penaltyAmount),
      totalAmount: Number(raw.totalAmount),
      paidAmount: Number(raw.paidAmount),
      balanceAmount: Number(raw.balanceAmount),

      status: raw.status,

      schoolId: raw.schoolId,

      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }
}
