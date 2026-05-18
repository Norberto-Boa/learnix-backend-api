import type { CHARGE_STATUS } from '@/generated/prisma/enums';
import type { DbContext } from '@/prisma/shared/db-context';
import type { EnrollmentCharge } from '../domain/enrollment-charge';

export interface CreateEnrollmentChargeInput {
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
}

export interface UpdateEnrollmentChargeInput {
  dueDate?: Date;

  baseAmount?: number;
  penaltyAmount?: number;
  totalAmount?: number;
  balanceAmount?: number;
}

export interface FindManyEnrollmentChargesParams {
  enrollmentId?: string;
  academicYearId?: string;

  referenceYear?: number;
  referenceMonth?: number;

  status?: CHARGE_STATUS;
  page: number;
  limit: number;
}

export abstract class EnrollmentChargesRepository {
  abstract save(
    data: CreateEnrollmentChargeInput,
    schoolId: string,
    db: DbContext,
  ): Promise<EnrollmentCharge>;

  abstract findById(
    id: string,
    schoolId: string,
  ): Promise<EnrollmentCharge | null>;

  abstract findDuplicatedCharge(params: {
    enrollmentId: string;
    feeTypeId: string;
    referenceYear: number;
    referenceMonth: number;
  }): Promise<EnrollmentCharge | null>;

  abstract findMany(
    schoolId: string,
    params: FindManyEnrollmentChargesParams,
  ): Promise<EnrollmentCharge[]>;

  abstract update(
    id: string,
    schoolId: string,
    data: UpdateEnrollmentChargeInput,
    tx?: DbContext,
  ): Promise<EnrollmentCharge>;

  abstract cancel(
    id: string,
    schoolId: string,
    tx?: DbContext,
  ): Promise<EnrollmentCharge>;

  abstract delete(id: string, schoolId: string, tx?: DbContext): Promise<void>;
}
