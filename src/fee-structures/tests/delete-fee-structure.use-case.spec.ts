import { feeStructureFactory } from '@test/factories/feeStructure.factory';
import { InMemoryFeeStructuresRepository } from '../repositories/prisma/in-memory/in-memory-fee-structures.repository';
import { DeleteFeeStructureUseCase } from '../use-case/delete-fee-structure.use-case';
import { FeeStructureNotFoundError } from '../errors/fee-structure-not-found.error';

let feeStructuresRepository: InMemoryFeeStructuresRepository;
let sut: DeleteFeeStructureUseCase;

describe('DeleteFeeStructureUseCase', () => {
  beforeEach(() => {
    feeStructuresRepository = new InMemoryFeeStructuresRepository();
    sut = new DeleteFeeStructureUseCase(feeStructuresRepository);
  });

  it('should be able to delete a fee structure', async () => {
    const feeStructure = await feeStructuresRepository.save(
      feeStructureFactory(),
      'school-1',
    );

    await sut.execute(feeStructure.id, 'school-1');

    const deleted = feeStructuresRepository.items.find(
      (item) => item.id === feeStructure.id,
    );

    expect(deleted).toBeDefined();
    expect(deleted?.deletedAt).toEqual(expect.any(Date));
  });

  it('should not be able to delete a non-existing fee structure', async () => {
    await expect(() =>
      sut.execute('non-existing-id', 'school-1'),
    ).rejects.toBeInstanceOf(FeeStructureNotFoundError);
  });
});
