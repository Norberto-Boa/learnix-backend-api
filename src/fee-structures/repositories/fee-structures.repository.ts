import type { FEE_SCOPE } from '@/generated/prisma/enums';
import type { FeeStructureDomain } from '../domain/fee-structure';
import type { DbContext } from '@/prisma/shared/db-context';

export interface CreateFeeStructureInput {
  feeTypeId: string;
  scope: FEE_SCOPE;
  academicYearId: string;
  gradeId: string | null;
  amount: number;
}

export interface UpdateFeeStructureInput {
  feeTypeId?: string;
  scope?: FEE_SCOPE;
  academicYearId?: string;
  gradeId?: string;
  amount?: number;
  schoolId?: string;
}

export interface FindManyFeeStructuresParams {
  feeTypeId?: string;
  academicYearId: string;
  gradeId?: string;
  scope?: FEE_SCOPE;
}

export abstract class FeeStructuresRepository {
  abstract save(
    data: CreateFeeStructureInput,
    schoolId: string,
    db?: DbContext,
  ): Promise<FeeStructureDomain>;
  abstract update(
    id: string,
    schoolId: string,
    data: UpdateFeeStructureInput,
    db?: DbContext,
  ): Promise<FeeStructureDomain>;
  abstract findById(
    id: string,
    schoolId: string,
  ): Promise<FeeStructureDomain | null>;
  abstract findByUniqueCombination(
    schoolId: string,
    feeTypeId: string,
    academicYearId: string,
    gradeId: string | null,
  ): Promise<FeeStructureDomain | null>;
  abstract findMany(
    params: FindManyFeeStructuresParams,
    schoolId: string,
  ): Promise<FeeStructureDomain[]>;
  abstract delete(id: string, schoolId: string, db?: DbContext): Promise<void>;
}
