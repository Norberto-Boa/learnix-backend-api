import { Injectable } from '@nestjs/common';
import type { PenaltyPolicyRepository } from '../repositories/penalty-policy.repository';
import { PenaltyPolicyNotFoundError } from '../errors/penalty-policy-not-found.error';

@Injectable()
export class DeletePenaltyPolicyUseCase {
  constructor(
    private readonly penaltyPolicyRepository: PenaltyPolicyRepository,
  ) {}

  async execute(id: string, schoolId: string): Promise<void> {
    const penaltyPolicy = await this.penaltyPolicyRepository.findById(
      id,
      schoolId,
    );

    if (!penaltyPolicy) {
      throw new PenaltyPolicyNotFoundError();
    }

    await this.penaltyPolicyRepository.delete(id, schoolId);
  }
}
