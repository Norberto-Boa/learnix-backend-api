import type { FEE_TYPE_CATEGORY } from '@/generated/prisma/enums';
import type { FeeTypeDomain } from '../domain/fee-type';
import { Injectable } from '@nestjs/common';
import type { FeeTypesRepository } from '../repositories/fee-types.repository';

interface GetFeeTypeUseCaseRequest {
  search?: string;
  category?: FEE_TYPE_CATEGORY;
  isRecurring?: boolean;
}

interface GetFeeTypeUseCaseResponse {
  feeTypes: FeeTypeDomain[];
}

@Injectable()
export class GetFeeTypeUseCase {
  constructor(private readonly feeTypesRepository: FeeTypesRepository) { }

  async execute(
    schoolId: string,
    { search, category, isRecurring }: GetFeeTypeUseCaseRequest,
  ): Promise<GetFeeTypeUseCaseResponse> {
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
