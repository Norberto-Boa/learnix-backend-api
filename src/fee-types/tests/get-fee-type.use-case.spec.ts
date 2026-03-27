import { feeTypeFactory } from '@test/factories/feeType.factory';
import { InMemoryFeeTypesRepository } from '../repositories/in-memory/in-memory-fee-types.repository';
import { GetFeeTypeUseCase } from '../use-cases/get-fee-type.use-case';
import { FeeTypeNotFoundError } from '../errors/fee-type-not-found.error';

let inMemoryFeeTypesRepository: InMemoryFeeTypesRepository;
let sut: GetFeeTypeUseCase;

describe('Get Fee Type Use Case', () => {
  beforeEach(() => {
    inMemoryFeeTypesRepository = new InMemoryFeeTypesRepository();
    sut = new GetFeeTypeUseCase(inMemoryFeeTypesRepository);
  });

  it('should be able to get a fee type by id', async () => {
    const createdFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory(),
      'school-1',
    );

    const result = await sut.execute(createdFeeType.id, 'school-1');

    expect(result.feeType.id).toBe(createdFeeType.id);
  });

  it('should be able to get a fee type from another school', async () => {
    const createdFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory(),
      'school-1',
    );

    await expect(() =>
      sut.execute(createdFeeType.id, 'school-2'),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });

  it('should not get a soft deleted fee type', async () => {
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
