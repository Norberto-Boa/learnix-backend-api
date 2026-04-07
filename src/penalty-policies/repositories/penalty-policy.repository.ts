import type { DbContext } from '@/prisma/shared/db-context';
import type { CreatePenaltyPolicyDTO } from '../dto/create-penalty-policy.dto';
import type { PenaltyPolicyDomain } from '../domain/penalty-policy';
import type { UpdatePenaltyPolicyDTO } from '../dto/update-penalty-policy.dto';
import type { GetPenaltyPoliciesQueryDTO } from '../dto/get-penalty-policy.dto';
import type { PENALTY_MODE } from '@/generated/prisma/enums';

export interface CreatePenaltyPolicyInput {
  name: string;
  triggerFeeTypeId: string;
  penaltyFeeTypeId: string;
  academicYearId: string;
  gradeId?: string | null;
  mode: PENALTY_MODE;
  value: string;
  graceDay: number;
  intervalDays?: number | null;
  isActive?: boolean;
}

export abstract class PenaltyPolicyRepository {
  abstract save(
    data: CreatePenaltyPolicyInput,
    schoolId: string,
    db?: DbContext,
  ): Promise<PenaltyPolicyDomain>;
  abstract update(
    id: string,
    schoolId: string,
    data: UpdatePenaltyPolicyDTO,
    db?: DbContext,
  ): Promise<PenaltyPolicyDomain>;
  abstract delete(id: string, schoolId: string, db?: DbContext): Promise<void>;
  abstract findById(
    id: string,
    schoolId: string,
  ): Promise<PenaltyPolicyDomain | null>;
  abstract findDuplicate(
    schoolId: string,
    academicYearId: string,
    triggerFeeTypeId: string,
    gradeId?: string | null,
    excludeId?: string,
  ): Promise<PenaltyPolicyDomain | null>;
  abstract findMany(
    schoolId: string,
    params: GetPenaltyPoliciesQueryDTO,
  ): Promise<PenaltyPolicyDomain[]>;
  abstract countMany(
    schoolId: string,
    params: Omit<GetPenaltyPoliciesQueryDTO, 'page' | 'limit'>,
  ): Promise<number>;
}
