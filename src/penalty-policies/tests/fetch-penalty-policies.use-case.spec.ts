import { penaltyPolicyFactory } from '@test/factories/penaltyPolicy.factory';
import { InMemoryPenaltyPolicyRepository } from '../repositories/in-memory/in-memory-penalty-policy.repository';
import { FetchPenaltyPoliciesUseCase } from '../use-cases/fetch-penalty-policies.use-case';

let penaltyPolicyRepository: InMemoryPenaltyPolicyRepository;
let sut: FetchPenaltyPoliciesUseCase;

describe('Fetch Penalty Policies Use Case', () => {
  beforeEach(() => {
    penaltyPolicyRepository = new InMemoryPenaltyPolicyRepository();
    sut = new FetchPenaltyPoliciesUseCase(penaltyPolicyRepository);
  });

  it('should fetch penalty policies with pagination', async () => {
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-1');
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-1');
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-1');

    const result = await sut.execute({ page: 1, limit: 10 }, 'school-1');

    expect(result.items).toHaveLength(3);
  });

  it('should filter penalty policies by search', async () => {
    await penaltyPolicyRepository.save(
      penaltyPolicyFactory({ name: 'Late monthly' }),
      'school-1',
    );
    await penaltyPolicyRepository.save(
      penaltyPolicyFactory({ name: 'Late weekly' }),
      'school-1',
    );
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-1');

    const result = await sut.execute(
      { page: 1, limit: 10, search: 'late' },
      'school-1',
    );

    expect(result.items).toHaveLength(2);
  });

  it('should filter penalty policies by isActive', async () => {
    await penaltyPolicyRepository.save(
      penaltyPolicyFactory({ isActive: false }),
      'school-1',
    );
    await penaltyPolicyRepository.save(
      penaltyPolicyFactory({ isActive: false }),
      'school-1',
    );
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-1');

    const result = await sut.execute(
      { page: 1, limit: 10, isActive: false },
      'school-1',
    );

    expect(result.items).toHaveLength(2);
  });

  it('should filter penalty policies by academicYearId', async () => {
    await penaltyPolicyRepository.save(
      penaltyPolicyFactory({ academicYearId: '2001' }),
      'school-1',
    );
    await penaltyPolicyRepository.save(
      penaltyPolicyFactory({ academicYearId: '2001' }),
      'school-1',
    );
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-1');

    const result = await sut.execute(
      { page: 1, limit: 10, academicYearId: '2001' },
      'school-1',
    );

    expect(result.items).toHaveLength(2);
  });

  it('should filter penalty policies from the requested school', async () => {
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-1');
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-2');
    await penaltyPolicyRepository.save(penaltyPolicyFactory(), 'school-1');

    const result = await sut.execute({ page: 1, limit: 10 }, 'school-1');

    expect(result.items).toHaveLength(2);
  });
});
