import type { FEE_TYPE_CATEGORY } from '@/generated/prisma/enums';
import type { FeeTypeDomain } from '../domain/fee-type';
import { Injectable } from '@nestjs/common';
import { FeeTypesRepository } from '../repositories/fee-types.repository';

interface FetchFeeTypesUseCaseRequest {
  search?: string;
  category?: FEE_TYPE_CATEGORY;
  isRecurring?: boolean;
}

interface FetchFeeTypesUseCaseResponse {
  feeTypes: FeeTypeDomain[];
}

@Injectable()
export class FetchFeeTypesUseCase {
  constructor(private readonly feeTypesRepository: FeeTypesRepository) { }

  async execute(
    schoolId: string,
    { search, category, isRecurring }: FetchFeeTypesUseCaseRequest,
  ): Promise<FetchFeeTypesUseCaseResponse> {
    const feeTypes = await this.feeTypesRepository.findMany(schoolId, {
      search,
      category,
      isRecurring,
    });

    return {
      feeTypes,
    };
  }
}
