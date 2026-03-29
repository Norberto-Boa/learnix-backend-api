import { Injectable } from '@nestjs/common';
import { FeeStructuresRepository } from '../repositories/fee-structures.repository';
import { FeeStructureNotFoundError } from '../errors/fee-structure-not-found.error';

@Injectable()
export class GetFeeStructureByIdUseCase {
  constructor(
    private readonly feeStructuresRepository: FeeStructuresRepository,
  ) {}

  async execute(id: string, schoolId: string) {
    const feeStructure = await this.feeStructuresRepository.findById(
      id,
      schoolId,
    );

    if (!feeStructure) {
      throw new FeeStructureNotFoundError();
    }

    return feeStructure;
  }
}
