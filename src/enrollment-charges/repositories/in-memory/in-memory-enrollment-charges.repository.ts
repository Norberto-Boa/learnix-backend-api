import type { EnrollmentCharge } from '@/enrollment-charges/domain/enrollment-charge';
import {
  EnrollmentChargesRepository,
  type CreateEnrollmentChargeInput,
  type FindManyEnrollmentChargesParams,
  type UpdateEnrollmentChargeInput,
} from '../enrollment-charges.repository';
import type { DbContext } from '@/prisma/shared/db-context';

export class InMemoryEnrollmentChargesRepository implements EnrollmentChargesRepository {
  public items: EnrollmentCharge[] = [];

  private findIndexOrThrow(id: string, schoolId: string): number {
    const enrollmentChargeIndex = this.items.findIndex((item) => {
      return item.id === id && item.schoolId === schoolId && !item.deletedAt;
    });

    if (enrollmentChargeIndex < 0) {
      throw new Error('Enrollment charge not found');
    }

    return enrollmentChargeIndex;
  }

  async save(
    data: CreateEnrollmentChargeInput,
    schoolId: string,
    _db?: DbContext,
  ): Promise<EnrollmentCharge> {
    const enrollmentCharge: EnrollmentCharge = {
      id: crypto.randomUUID(),

      enrollmentId: data.enrollmentId,
      feeTypeId: data.feeTypeId,
      academicYearId: data.academicYearId,

      referenceYear: data.referenceYear,
      referenceMonth: data.referenceMonth,

      dueDate: data.dueDate,

      baseAmount: data.baseAmount,
      penaltyAmount: data.penaltyAmount,
      totalAmount: data.totalAmount,
      paidAmount: data.paidAmount,
      balanceAmount: data.balanceAmount,

      status: data.status,

      schoolId: schoolId,

      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(enrollmentCharge);

    return enrollmentCharge;
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<EnrollmentCharge | null> {
    const enrollmentCharge = this.items.find((item) => {
      return item.id === id && item.schoolId === schoolId && !item.deletedAt;
    });

    if (!enrollmentCharge) {
      return null;
    }

    return enrollmentCharge;
  }

  async findDuplicatedCharge(params: {
    enrollmentId: string;
    feeTypeId: string;
    referenceYear: number;
    referenceMonth: number;
  }): Promise<EnrollmentCharge | null> {
    const enrollmentCharge = this.items.find((item) => {
      return (
        item.enrollmentId === params.enrollmentId &&
        item.feeTypeId === params.feeTypeId &&
        item.referenceYear === params.referenceYear &&
        item.referenceMonth === params.referenceMonth &&
        !item.deletedAt
      );
    });

    if (!enrollmentCharge) {
      return null;
    }

    return enrollmentCharge;
  }

  async findMany(
    schoolId: string,
    params: FindManyEnrollmentChargesParams,
  ): Promise<EnrollmentCharge[]> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    return this.items
      .filter((item) => {
        if (item.schoolId !== schoolId) return false;
        if (item.deletedAt) return false;
        if (params.enrollmentId && item.enrollmentId !== params.enrollmentId)
          return false;
        if (
          params.academicYearId &&
          item.academicYearId !== params.academicYearId
        )
          return false;
        if (
          params.referenceMonth &&
          item.referenceMonth !== params.referenceMonth
        )
          return false;
        if (params.referenceYear && item.referenceYear !== params.referenceYear)
          return false;
        if (params.status && item.status !== params.status) return false;

        return true;
      })
      .sort((a, b) => {
        if (a.referenceYear !== b.referenceYear) {
          return b.referenceYear - a.referenceYear;
        }
        if (a.referenceMonth !== b.referenceMonth) {
          return b.referenceMonth - a.referenceMonth;
        }

        return a.dueDate.getTime() - b.dueDate.getTime();
      })
      .slice((page - 1) * limit, page * limit);
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateEnrollmentChargeInput,
    _tx?: DbContext,
  ): Promise<EnrollmentCharge> {
    const enrollmentChargeIndex = this.findIndexOrThrow(id, schoolId);

    const current = this.items[enrollmentChargeIndex];

    const updated: EnrollmentCharge = {
      ...current,

      dueDate: data.dueDate ?? current.dueDate,

      baseAmount: data.baseAmount ?? current.baseAmount,
      penaltyAmount: data.penaltyAmount ?? current.penaltyAmount,
      totalAmount: data.totalAmount ?? current.totalAmount,
      balanceAmount: data.balanceAmount ?? current.balanceAmount,

      updatedAt: new Date(),
    };

    this.items[enrollmentChargeIndex] = updated;

    return updated;
  }

  async cancel(
    id: string,
    schoolId: string,
    _tx?: DbContext,
  ): Promise<EnrollmentCharge> {
    const enrollmentChargeIndex = this.findIndexOrThrow(id, schoolId);
    const current = this.items[enrollmentChargeIndex];

    const canceled: EnrollmentCharge = {
      ...current,
      status: 'CANCELLED',
      updatedAt: new Date(),
    };

    this.items[enrollmentChargeIndex] = canceled;

    return canceled;
  }

  async delete(id: string, schoolId: string, _tx?: DbContext): Promise<void> {
    const enrollmentChargeIndex = this.findIndexOrThrow(id, schoolId);

    const current = this.items[enrollmentChargeIndex];

    this.items[enrollmentChargeIndex] = {
      ...current,
      deletedAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
