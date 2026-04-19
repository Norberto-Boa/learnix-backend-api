import { InMemoryPenaltyPolicyRepository } from '../repositories/in-memory/in-memory-penalty-policy.repository';
import { DeletePenaltyPolicyUseCase } from '../use-cases/delete-penalty-policy.use-case';
import { penaltyPolicyFactory } from '../../../test/factories/penaltyPolicy.factory';
import { PenaltyPolicyNotFoundError } from '../errors/penalty-policy-not-found.error';

let penaltyPolicyRepository: InMemoryPenaltyPolicyRepository;
let sut: DeletePenaltyPolicyUseCase;

describe('DeletePenaltyPolicyUseCase', () => {
  beforeEach(async () => {
    penaltyPolicyRepository = new InMemoryPenaltyPolicyRepository();
    sut = new DeletePenaltyPolicyUseCase(penaltyPolicyRepository);
  });

  it('Should soft delete a penalty policy', async () => {
    const created = await penaltyPolicyRepository.save(
      penaltyPolicyFactory(),
      'schoolId',
    );

    await sut.execute(created.id, 'schoolId');

    const penaltyPolicy = await penaltyPolicyRepository.findById(
      created.id,
      'schoolId',
    );

    expect(penaltyPolicy).toBeNull();
  });

  it('Should throw  when penalty policy is not found', async () => {
    await expect(
      sut.execute('non-existing-id', 'schoolId'),
    ).rejects.toBeInstanceOf(PenaltyPolicyNotFoundError);
  });
});
