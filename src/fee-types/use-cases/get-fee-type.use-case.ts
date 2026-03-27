import { Injectable } from "@nestjs/common";
import type { FeeTypeDomain } from "../domain/fee-type";
import { FeeTypesRepository } from "../repositories/fee-types.repository";
import { FeeTypeNotFoundError } from "../errors/fee-type-not-found.error";

interface GetFeeTypeUseCaseResponse {
  feeType: FeeTypeDomain;
}

@Injectable()
export class GetFeeTypeUseCase {
  constructor(private readonly feeTypesRepository: FeeTypesRepository) { }

  async execute(id: string, schoolId: string): Promise<GetFeeTypeUseCaseResponse> {
    const feeType = await this.feeTypesRepository.findById(id, schoolId);

    if (!feeType) {
      throw new FeeTypeNotFoundError()
    }

    return {
      feeType
    }
  }
}