import { feeTypeFactory } from '@test/factories/feeType.factory';
import { InMemoryFeeTypesRepository } from '../repositories/in-memory/in-memory-fee-types.repository';
import { DeleteFeeTypeUseCase } from '../use-cases/delete-fee-type.use-case';
import { FeeTypeNotFoundError } from '../errors/fee-type-not-found.error';

let inMemoryFeeTypesRepository: InMemoryFeeTypesRepository;
let sut: DeleteFeeTypeUseCase;

describe('Delete Fee Type Use Case', () => {
  beforeEach(() => {
    inMemoryFeeTypesRepository = new InMemoryFeeTypesRepository();
    sut = new DeleteFeeTypeUseCase(inMemoryFeeTypesRepository);
  });

  it('Should be able to soft delete a fee type', async () => {
    const createdFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory(),
      'school-1',
    );

    await sut.execute(createdFeeType.id, 'school-1');

    const feeType = inMemoryFeeTypesRepository.items.find(
      (item) => item.id === createdFeeType.id,
    );

    expect(feeType).toBeTruthy();
    expect(feeType?.deletedAt).toEqual(expect.any(Date));
  });

  it('Should not be able to soft delete a fee type that does not exist', async () => {
    await expect(() =>
      sut.execute('non-existing-id', 'school-1'),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });

  it('Should not be able to soft delete a fee type from another school', async () => {
    const createdFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory(),
      'school-1',
    );

    await expect(() =>
      sut.execute(createdFeeType.id, 'school-2'),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });

  it('Should not be able to soft delete a fee type from soft deleted', async () => {
    const createdFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory(),
      'school-1',
    );

    await inMemoryFeeTypesRepository.delete(createdFeeType.id, 'school-1');

    await expect(() =>
      sut.execute(createdFeeType.id, 'school-1'),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });
});
