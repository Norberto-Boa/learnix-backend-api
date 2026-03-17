import type { FEE_TYPE_CATEGORY } from "@/generated/prisma/enums";
import { Injectable } from "@nestjs/common";
import { FeeTypesRepository } from '../repositories/fee-types.repository';
import type { DbContext } from "@/prisma/shared/db-context";
import { FeeTypeCodeAlreadyExistsError } from "../errors/fee-type-code-already-exists.error";

interface CreateFeeTypeUseCaseRequest {
  name: string;
  code: string;
  category?: FEE_TYPE_CATEGORY;
  isRecurring?: boolean;
}

@Injectable()
export class CreateFeeTypeUseCase {
  constructor(private readonly feeTypesRepository: FeeTypesRepository) { }

  async execute({ name, code, category, isRecurring }: CreateFeeTypeUseCaseRequest, schoolId, db?: DbContext) {
    const existingFeeType = await this.feeTypesRepository.findByCode(code, schoolId);

    if (existingFeeType) {
      throw new FeeTypeCodeAlreadyExistsError();
    }

    const feeType = await this.feeTypesRepository.save({ name, code, category, isRecurring }, schoolId, db);

    return feeType;
  }
}