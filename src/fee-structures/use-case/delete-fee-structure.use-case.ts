import { Injectable } from '@nestjs/common';
import { FeeStructuresRepository } from '../repositories/fee-structures.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { FeeStructureNotFoundError } from '../errors/fee-structure-not-found.error';

@Injectable()
export class DeleteFeeStructureUseCase {
  constructor(
    private readonly feeStructuresRepository: FeeStructuresRepository,
  ) {}

  async execute(id: string, schoolId: string, db?: DbContext): Promise<void> {
    const feeStructure = await this.feeStructuresRepository.findById(
      id,
      schoolId,
    );

    if (!feeStructure) {
      throw new FeeStructureNotFoundError();
    }

    await this.feeStructuresRepository.delete(id, schoolId, db);
  }
}
