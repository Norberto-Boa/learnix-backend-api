import { penaltyPolicyFactory } from '@test/factories/penaltyPolicy.factory';
import { InMemoryPenaltyPolicyRepository } from '../repositories/in-memory/in-memory-penalty-policy.repository';
import { GetPenaltyPolicyUseCase } from '../use-cases/get-penalty-policy.use-case';
import { PenaltyPolicyNotFoundError } from '../errors/penalty-policy-not-found.error';

let penaltyPolicyRepository: InMemoryPenaltyPolicyRepository;
let sut: GetPenaltyPolicyUseCase;

describe(' Get Penalty Policy Use Case', () => {
  beforeEach(() => {
    penaltyPolicyRepository = new InMemoryPenaltyPolicyRepository();
    sut = new GetPenaltyPolicyUseCase(penaltyPolicyRepository);
  });

  it('Should return a penalty policy by id', async () => {
    const created = await penaltyPolicyRepository.save(
      penaltyPolicyFactory(),
      'school-id',
    );

    const { penaltyPolicy } = await sut.execute(
      { id: created.id },
      'school-id',
    );

    expect(penaltyPolicy).toEqual(created);
  });

  it('Should not return a penalty policy by id when school id is different', async () => {
    const created = await penaltyPolicyRepository.save(
      penaltyPolicyFactory(),
      'school-id',
    );

    await expect(
      sut.execute({ id: created.id }, 'school-1'),
    ).rejects.toBeInstanceOf(PenaltyPolicyNotFoundError);
  });
});
