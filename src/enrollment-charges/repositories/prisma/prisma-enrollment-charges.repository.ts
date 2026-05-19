import { Injectable } from '@nestjs/common';
import {
  EnrollmentChargesRepository,
  type CreateEnrollmentChargeInput,
  type FindManyEnrollmentChargesParams,
  type UpdateEnrollmentChargeInput,
} from '@/enrollment-charges/repositories/enrollment-charges.repository';
import { PrismaService } from '@/prisma/prisma.service';
import type { EnrollmentCharge } from '@/enrollment-charges/domain/enrollment-charge';
import type { DbContext } from '@/prisma/shared/db-context';
import { EnrollmentChargeMapper } from '@/enrollment-charges/repositories/enrollment-charges.mapper';

@Injectable()
export class PrismaEnrollmentChargesRepository implements EnrollmentChargesRepository {
  constructor(private readonly prisma: PrismaService) {}

  getClient(db?: DbContext) {
    return db ?? this.prisma;
  }

  async save(
    data: CreateEnrollmentChargeInput,
    schoolId: string,
    db: DbContext,
  ): Promise<EnrollmentCharge> {
    const client = this.getClient(db);

    const enrollmentCharge = await client.enrollmentCharge.create({
      data: {
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
        schoolId,
      },
    });
    return EnrollmentChargeMapper.toDomain(enrollmentCharge);
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<EnrollmentCharge | null> {
    const enrollmentCharge = await this.prisma.enrollmentCharge.findFirst({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
    });

    if (!enrollmentCharge) {
      return null;
    }

    return EnrollmentChargeMapper.toDomain(enrollmentCharge);
  }

  async findDuplicatedCharge(params: {
    enrollmentId: string;
    feeTypeId: string;
    referenceYear: number;
    referenceMonth: number;
  }): Promise<EnrollmentCharge | null> {
    const client = this.getClient();

    const enrollmentCharge = await client.enrollmentCharge.findUnique({
      where: {
        enrollmentId_feeTypeId_referenceYear_referenceMonth: {
          enrollmentId: params.enrollmentId,
          feeTypeId: params.feeTypeId,
          referenceYear: params.referenceYear,
          referenceMonth: params.referenceMonth,
        },
      },
    });

    if (!enrollmentCharge || enrollmentCharge.deletedAt) {
      return null;
    }

    return EnrollmentChargeMapper.toDomain(enrollmentCharge);
  }

  async findMany(
    schoolId: string,
    params: FindManyEnrollmentChargesParams,
  ): Promise<EnrollmentCharge[]> {
    const client = this.getClient();

    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    const enrollmentCharges = await client.enrollmentCharge.findMany({
      where: {
        schoolId,
        deletedAt: null,

        enrollmentId: params.enrollmentId,
        academicYearId: params.academicYearId,
        referenceYear: params.referenceYear,
        referenceMonth: params.referenceMonth,

        status: params.status,
      },
      orderBy: [
        {
          referenceYear: 'desc',
        },
        {
          referenceMonth: 'desc',
        },
        {
          dueDate: 'asc',
        },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });
    return enrollmentCharges.map(EnrollmentChargeMapper.toDomain);
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateEnrollmentChargeInput,
    tx?: DbContext,
  ): Promise<EnrollmentCharge> {
    const client = this.getClient(tx);

    const enrollmentCharge = await client.enrollmentCharge.update({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
      data: {
        dueDate: data.dueDate,

        baseAmount: data.baseAmount,
        penaltyAmount: data.penaltyAmount,
        totalAmount: data.totalAmount,
        balanceAmount: data.balanceAmount,
      },
    });

    return EnrollmentChargeMapper.toDomain(enrollmentCharge);
  }

  async cancel(
    id: string,
    schoolId: string,
    tx?: DbContext,
  ): Promise<EnrollmentCharge> {
    const client = this.getClient(tx);

    const enrollmentCharge = await client.enrollmentCharge.update({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
      data: {
        status: 'CANCELLED',
      },
    });

    return EnrollmentChargeMapper.toDomain(enrollmentCharge);
  }

  async delete(id: string, schoolId: string, tx?: DbContext): Promise<void> {
    const client = this.getClient(tx);

    await client.enrollmentCharge.update({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
