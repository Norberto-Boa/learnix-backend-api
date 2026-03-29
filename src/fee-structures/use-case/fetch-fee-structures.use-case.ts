import { Injectable } from '@nestjs/common';
import type { FeeStructuresRepository } from '../repositories/fee-structures.repository';
import { FindManyFeeStructuresParams } from '../repositories/fee-structures.repository';

interface FetchFeeStructuresParams extends FindManyFeeStructuresParams {}

@Injectable()
export class FetchFeeStructuresUseCase {
  constructor(
    private readonly feeStructuresRepository: FeeStructuresRepository,
  ) {}

  async execute(
    { gradeId, academicYearId, feeTypeId, scope }: FetchFeeStructuresParams,
    schoolId: string,
  ) {
    return this.feeStructuresRepository.findMany(schoolId, {
      gradeId,
      academicYearId,
      feeTypeId,
      scope,
    });
  }
}
