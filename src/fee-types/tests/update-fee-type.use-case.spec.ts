import { feeTypeFactory } from '@test/factories/feeType.factory';
import { InMemoryFeeTypesRepository } from '../repositories/in-memory/in-memory-fee-types.repository';
import { UpdateFeeTypeUseCase } from '../use-cases/update-fee-type.use-case';
import { FeeTypeNotFoundError } from '../errors/fee-type-not-found.error';
import { FeeTypeCodeAlreadyExistsError } from '../errors/fee-type-code-already-exists.error';

let inMemoryFeeTypesRepository: InMemoryFeeTypesRepository;
let sut: UpdateFeeTypeUseCase;

describe('Update Fee Type Use Case', () => {
  beforeEach(() => {
    inMemoryFeeTypesRepository = new InMemoryFeeTypesRepository();
    sut = new UpdateFeeTypeUseCase(inMemoryFeeTypesRepository);
  });

  it('Should be able to update a fee type', async () => {
    const createdFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory(),
      'school-1',
    );

    const result = await sut.execute(createdFeeType.id, 'school-1', {
      name: 'Updated Fee Type',
      isRecurring: true,
    });

    expect(result.feeType.name).toBe('Updated Fee Type');
    expect(result.feeType.isRecurring).toBe(true);
  });

  it('Should not be able to update a fee type that does not exist', async () => {
    await expect(() =>
      sut.execute('non-existing-id', 'school-1', { name: 'Updated Fee Type' }),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });

  it('Should not be able to update a fee type from another school', async () => {
    const createdFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory(),
      'school-1',
    );

    await expect(() =>
      sut.execute(createdFeeType.id, 'school-2', { name: 'Updated Fee Type' }),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });

  it('Should not allow changing code to one that already exists in the same school', async () => {
    await inMemoryFeeTypesRepository.save(
      feeTypeFactory({ code: 'CODE1' }),
      'school-1',
    );
    const secondFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory({ code: 'CODE2' }),
      'school-1',
    );

    await expect(() =>
      sut.execute(secondFeeType.id, 'school-1', { code: 'CODE1' }),
    ).rejects.toBeInstanceOf(FeeTypeCodeAlreadyExistsError);
  });

  it('Should not allow changing code to one that already exists in the same school', async () => {
    const firstFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory({ code: 'CODE1' }),
      'school-1',
    );
    const secondFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory({ code: 'CODE2' }),
      'school-2',
    );

    const result = await sut.execute(secondFeeType.id, 'school-2', {
      code: 'CODE1',
    });

    expect(result.feeType.code).toBe('CODE1');
    expect(firstFeeType.code).toBe('CODE1');
  });

  it('Should not update a soft deleted fee type', async () => {
    const createdFeeType = await inMemoryFeeTypesRepository.save(
      feeTypeFactory(),
      'school-1',
    );

    await inMemoryFeeTypesRepository.delete(createdFeeType.id, 'school-1');

    await expect(() =>
      sut.execute(createdFeeType.id, 'school-1', { name: 'Updated Fee Type' }),
    ).rejects.toBeInstanceOf(FeeTypeNotFoundError);
  });
});
