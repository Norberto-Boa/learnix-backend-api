import { Injectable } from "@nestjs/common";
import { FeeTypesRepository } from "../repositories/fee-types.repository";
import type { DbContext } from "@/prisma/shared/db-context";
import { FeeTypeNotFoundError } from "../errors/fee-type-not-found.error";

@Injectable()
export class DeleteFeeTypeUseCase {
  constructor(private readonly feeTypesRepository: FeeTypesRepository) { }

  async execute(id: string, schoolId: string, db?: DbContext) {
    const feeType = await this.feeTypesRepository.findById(id, schoolId);

    if (!feeType) {
      throw new FeeTypeNotFoundError();
    }

    await this.feeTypesRepository.delete(id, schoolId, db);
  }
}