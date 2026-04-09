import { Injectable } from '@nestjs/common';
import type { PenaltyPolicyDomain } from '../domain/penalty-policy';
import { PenaltyPolicyRepository } from '../repositories/penalty-policy.repository';

interface FetchPenaltyPoliciesUseCaseRequest {
  page: number;
  limit: number;
  search?: string;
  academicYearId?: string;
  gradeId?: string;
  triggerFeeTypeId?: string;
  penaltyFeeTypeId?: string;
  isActive?: boolean;
}

interface FetchPenaltyPoliciesUseCaseResponse {
  items: PenaltyPolicyDomain[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class FetchPenaltyPoliciesUseCase {
  constructor(
    private readonly penaltyPolicyRepository: PenaltyPolicyRepository,
  ) {}

  async execute(
    {
      page,
      limit,
      academicYearId,
      gradeId,
      isActive,
      penaltyFeeTypeId,
      search,
      triggerFeeTypeId,
    }: FetchPenaltyPoliciesUseCaseRequest,
    schoolId: string,
  ): Promise<FetchPenaltyPoliciesUseCaseResponse> {
    const [items, total] = await Promise.all([
      this.penaltyPolicyRepository.findMany(schoolId, {
        isActive,
        limit,
        page,
        academicYearId,
        gradeId,
        penaltyFeeTypeId,
        search,
        triggerFeeTypeId,
      }),

      this.penaltyPolicyRepository.countMany(schoolId, {
        isActive,
        academicYearId,
        gradeId,
        penaltyFeeTypeId,
        search,
        triggerFeeTypeId,
      }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
