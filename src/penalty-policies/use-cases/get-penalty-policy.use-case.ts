import { Injectable } from '@nestjs/common';
import { PenaltyPolicyRepository } from '../repositories/penalty-policy.repository';
import { PenaltyPolicyNotFoundError } from '../errors/penalty-policy-not-found.error';

interface GetPenaltyPolicyUseCaseRequest {
  id: string;
}

@Injectable()
export class GetPenaltyPolicyUseCase {
  constructor(
    private readonly penaltyPolicyRepository: PenaltyPolicyRepository,
  ) {}

  async execute({ id }: GetPenaltyPolicyUseCaseRequest, schoolId: string) {
    const penaltyPolicy = await this.penaltyPolicyRepository.findById(
      id,
      schoolId,
    );

    if (!penaltyPolicy) {
      throw new PenaltyPolicyNotFoundError();
    }

    return penaltyPolicy;
  }
}
