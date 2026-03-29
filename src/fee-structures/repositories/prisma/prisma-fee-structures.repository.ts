import type { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type {
  CreateFeeStructureInput,
  FeeStructuresRepository,
  FindManyFeeStructuresParams,
  UpdateFeeStructureInput,
} from '../fee-structures.repository';
import type { FeeStructureDomain } from '@/fee-structures/domain/fee-structure';
import type { DbContext } from '@/prisma/shared/db-context';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class PrismaFeeStructresRepository implements FeeStructuresRepository {
  constructor(private readonly prisma: PrismaService) {}

  getClient(db?: DbContext) {
    return db ?? this.prisma;
  }

  async save(
    data: CreateFeeStructureInput,
    schoolId: string,
    db?: DbContext,
  ): Promise<FeeStructureDomain> {
    const client = this.getClient(db);

    const feeStructure = await client.feeStructure.create({
      data: {
        ...data,
        schoolId,
      },
    });

    return {
      ...feeStructure,
      amount: Number(feeStructure.amount),
    };
  }

  async findByUniqueCombination(
    schoolId: string,
    feeTypeId: string,
    academicYearId: string,
    gradeId: string | null,
  ): Promise<FeeStructureDomain | null> {
    const feeStructure = await this.prisma.feeStructure.findFirst({
      where: {
        schoolId,
        feeTypeId,
        academicyearId: academicYearId,
        gradeId,
        deletedAt: null,
      },
    });

    return feeStructure
      ? {
          ...feeStructure,
          amount: Number(feeStructure.amount),
        }
      : null;
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateFeeStructureInput,
    db?: DbContext,
  ): Promise<FeeStructureDomain> {
    const client = this.getClient(db);

    const feeStructure = await client.feeStructure.update({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
      data: {
        ...(data.feeTypeId !== undefined ? { feeTypeId: data.feeTypeId } : {}),
        ...(data.scope !== undefined ? { scope: data.scope } : {}),
        ...(data.academicYearId !== undefined
          ? { academicyearId: data.academicYearId }
          : {}),
        ...(data.gradeId !== undefined ? { gradeId: data.gradeId } : {}),
        ...(data.amount !== undefined
          ? { amount: new Prisma.Decimal(data.amount) }
          : {}),
      },
    });

    return {
      ...feeStructure,
      amount: Number(feeStructure.amount),
    };
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<FeeStructureDomain | null> {
    const feeStructure = await this.prisma.feeStructure.findFirst({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
    });

    if (!feeStructure) return null;

    return {
      ...feeStructure,
      amount: Number(feeStructure.amount),
    };
  }

  async findMany(
    params: FindManyFeeStructuresParams,
    schoolId: string,
  ): Promise<FeeStructureDomain[]> {
    const feeStructure = await this.prisma.feeStructure.findMany({
      where: {
        schoolId,
        deletedAt: null,
        ...(params.feeTypeId ? { feeTypeId: params.feeTypeId } : {}),
        ...(params.academicYearId
          ? { academicyearId: params.academicYearId }
          : {}),
        ...(params.gradeId ? { gradeId: params.gradeId } : {}),
        ...(params.scope ? { scope: params.scope } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return feeStructure.map((item) => ({
      ...item,
      amount: Number(item.amount),
    }));
  }

  async delete(id: string, schoolId: string, db?: DbContext): Promise<void> {
    const client = this.getClient(db);

    await client.feeStructure.update({
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
