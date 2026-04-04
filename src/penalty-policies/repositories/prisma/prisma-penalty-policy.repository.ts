import { Injectable } from '@nestjs/common';
import type { PenaltyPolicyRepository } from '../penalty-policy.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import type { PenaltyPolicyDomain } from '@/penalty-policies/domain/penalty-policy';
import type { CreatePenaltyPolicyDTO } from '@/penalty-policies/dto/create-penalty-policy.dto';
import type { DbContext } from '@/prisma/shared/db-context';
import type { UpdatePenaltyPolicyDTO } from '@/penalty-policies/dto/update-penalty-policy.dto';
import type { GetPenaltyPoliciesQueryDTO } from '@/penalty-policies/dto/get-penalty-policy.dto';

@Injectable()
export class PrismaPenaltyPolicyRepository implements PenaltyPolicyRepository {
  constructor(private readonly prisma: PrismaService) {}

  getClient(db?: DbContext) {
    return db ?? this.prisma;
  }

  async save(
    data: CreatePenaltyPolicyDTO,
    schoolId: string,
    db?: DbContext,
  ): Promise<PenaltyPolicyDomain> {
    const client = this.getClient(db);

    const penaltyPolicy = await client.penaltyPolicy.create({
      data: {
        name: data.name,
        mode: data.mode,
        graceDay: data.graceDay,
        value: data.value,
        triggerFeeTypeId: data.triggerFeeTypeId,
        penaltyFeeTypeId: data.penaltyFeeTypeId,
        academicYearId: data.academicYearId,
        gradeId: data.gradeId,
        isActive: data.isActive,
        schoolId,
      },
    });

    return { ...penaltyPolicy, value: Number(penaltyPolicy.value) };
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdatePenaltyPolicyDTO,
    db?: DbContext,
  ): Promise<PenaltyPolicyDomain> {
    const client = this.getClient(db);

    const penaltyPolicy = await client.penaltyPolicy.update({
      where: {
        id,
        schoolId,
      },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.triggerFeeTypeId !== undefined && {
          triggerFeeTypeId: data.triggerFeeTypeId,
        }),
        ...(data.penaltyFeeTypeId !== undefined && {
          penaltyFeeTypeId: data.penaltyFeeTypeId,
        }),
        ...(data.academicYearId !== undefined && {
          academicYearId: data.academicYearId,
        }),
        ...(data.gradeId !== undefined && {
          gradeId: data.gradeId,
        }),
        ...(data.mode !== undefined && { mode: data.mode }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.graceDay !== undefined && { graceDay: data.graceDay }),
        ...(data.intervalDays !== undefined && {
          intervalDays: data.intervalDays,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return {
      ...penaltyPolicy,
      value: Number(penaltyPolicy.value),
    };
  }

  async delete(id: string, schoolId: string, db?: DbContext): Promise<void> {
    const client = this.getClient(db);

    await client.penaltyPolicy.update({
      where: {
        id,
        schoolId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<PenaltyPolicyDomain | null> {
    const penaltyPolicy = await this.prisma.penaltyPolicy.findFirst({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
    });

    if (!penaltyPolicy) {
      return null;
    }

    return {
      ...penaltyPolicy,
      value: Number(penaltyPolicy.value),
    };
  }

  async findDuplicate(
    schoolId: string,
    academicYearId: string,
    triggerFeeTypeId: string,
    gradeId?: string | null,
    excludeId?: string,
  ): Promise<PenaltyPolicyDomain | null> {
    const penaltyPolicy = await this.prisma.penaltyPolicy.findFirst({
      where: {
        schoolId,
        academicYearId,
        triggerFeeTypeId,
        gradeId: gradeId ?? null,
        deletedAt: null,
        ...(excludeId && {
          id: {
            not: excludeId,
          },
        }),
      },
    });

    if (!penaltyPolicy) {
      return null;
    }

    return {
      ...penaltyPolicy,
      value: Number(penaltyPolicy.value),
    };
  }

  async findMany(
    schoolId: string,
    params: GetPenaltyPoliciesQueryDTO,
  ): Promise<PenaltyPolicyDomain[]> {
    const penaltyPolicies = await this.prisma.penaltyPolicy.findMany({
      where: {
        schoolId,
        deletedAt: null,
        ...(params.search && {
          name: {
            contains: params.search,
            mode: 'insensitive',
          },
        }),
        ...(params.academicYearId && {
          academicYearId: params.academicYearId,
        }),
        ...(params.gradeId && {
          gradeId: params.gradeId,
        }),
        ...(params.triggerFeeTypeId && {
          triggerFeeTypeId: params.triggerFeeTypeId,
        }),
        ...(params.penaltyFeeTypeId && {
          penaltyFeeTypeId: params.penaltyFeeTypeId,
        }),
        ...(params.isActive !== undefined && {
          isActive: params.isActive,
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    });

    return penaltyPolicies.map((penaltyPolicy) => ({
      ...penaltyPolicy,
      value: Number(penaltyPolicy.value),
    }));
  }

  async countMany(
    schoolId: string,
    params: Omit<GetPenaltyPoliciesQueryDTO, 'page' | 'limit'>,
  ): Promise<number> {
    return this.prisma.penaltyPolicy.count({
      where: {
        schoolId,
        deletedAt: null,
        ...(params.search && {
          name: {
            contains: params.search,
            mode: 'insensitive',
          },
        }),
        ...(params.academicYearId && {
          academicYearId: params.academicYearId,
        }),
        ...(params.gradeId && {
          gradeId: params.gradeId,
        }),
        ...(params.triggerFeeTypeId && {
          triggerFeeTypeId: params.triggerFeeTypeId,
        }),
        ...(params.penaltyFeeTypeId && {
          penaltyFeeTypeId: params.penaltyFeeTypeId,
        }),
        ...(params.isActive !== undefined && {
          isActive: params.isActive,
        }),
      },
    });
  }
}
