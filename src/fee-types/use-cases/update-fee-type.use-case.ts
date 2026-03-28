import type { FEE_TYPE_CATEGORY, FeeType } from '@/generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { FeeTypesRepository } from '../repositories/fee-types.repository';
import { FeeTypeNotFoundError } from '../errors/fee-type-not-found.error';
import { FeeTypeCodeAlreadyExistsError } from '../errors/fee-type-code-already-exists.error';
import type { DbContext } from '@/prisma/shared/db-context';

interface UpdateFeeTypeUseCaseRequest {
  name?: string;
  code?: string;
  category?: FEE_TYPE_CATEGORY;
  isRecurring?: boolean;
}

interface UpdateFeeTypeUseCaseResponse {
  feeType: FeeType;
}

@Injectable()
export class UpdateFeeTypeUseCase {
  constructor(private readonly feeTypesRepository: FeeTypesRepository) { }

  async execute(
    id: string,
    schoolId: string,
    { name, category, code, isRecurring }: UpdateFeeTypeUseCaseRequest,
    db?: DbContext,
  ) {
    const feeType = await this.feeTypesRepository.findById(id, schoolId);

    if (!feeType) {
      throw new FeeTypeNotFoundError();
    }

    if (code && code !== feeType.code) {
      const feeTypeWithSameCode = await this.feeTypesRepository.findByCode(
        code,
        schoolId,
      );

      if (feeTypeWithSameCode && feeTypeWithSameCode.id !== id) {
        throw new FeeTypeCodeAlreadyExistsError();
      }
    }

    const updatedFeeType = await this.feeTypesRepository.update(
      id,
      schoolId,
      { name, category, code, isRecurring },
      db,
    );

    return {
      feeType: updatedFeeType,
      oldFeeType: feeType
    };
  }
}
