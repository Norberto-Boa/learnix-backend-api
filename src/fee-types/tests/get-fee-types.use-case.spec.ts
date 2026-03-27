import { feeTypeFactory } from "@test/factories/feeType.factory";
import { InMemoryFeeTypesRepository } from "../repositories/in-memory/in-memory-fee-types.repository";
import { GetFeeTypesUseCase } from "../use-cases/get-fee-types.use-case";

let inMemoryFeeTypesRepository: InMemoryFeeTypesRepository;
let sut: GetFeeTypesUseCase;

describe('Get Fee Types Use Case', () => {
  beforeEach(() => {
    inMemoryFeeTypesRepository = new InMemoryFeeTypesRepository();
    sut = new GetFeeTypesUseCase(inMemoryFeeTypesRepository);
  })

  it('should be able to list fee types', async () => {
    await inMemoryFeeTypesRepository.save(feeTypeFactory(), 'school-1');
    await inMemoryFeeTypesRepository.save(feeTypeFactory(), 'school-1');

    const result = await sut.execute('school-1', {});

    expect(result.feeTypes).toHaveLength(2);
  })

  it('should be able filter types by category', async () => {
    await inMemoryFeeTypesRepository.save(feeTypeFactory({
      category: 'NORMAL'
    }), 'school-1');
    await inMemoryFeeTypesRepository.save(feeTypeFactory({
      category: 'PENALTY'
    }), 'school-1');

    const result = await sut.execute('school-1', { category: 'NORMAL' });

    expect(result.feeTypes).toHaveLength(1);
    expect(result.feeTypes[0].category).toBe('NORMAL');
  })

  it('should be able filter types by recurrence', async () => {
    await inMemoryFeeTypesRepository.save(feeTypeFactory({
      isRecurring: true
    }), 'school-1');
    await inMemoryFeeTypesRepository.save(feeTypeFactory({
      isRecurring: false
    }), 'school-1');

    const result = await sut.execute('school-1', { isRecurring: false });

    expect(result.feeTypes).toHaveLength(1);
    expect(result.feeTypes[0].isRecurring).toBe(false);
  })

  it('should be able filter types by search', async () => {
    await inMemoryFeeTypesRepository.save(feeTypeFactory({
      code: 'TUITTION'
    }), 'school-1');
    await inMemoryFeeTypesRepository.save(feeTypeFactory({
      code: 'UNIFORM'
    }), 'school-1');

    const result = await sut.execute('school-1', { search: 'tuit' });

    expect(result.feeTypes).toHaveLength(1);
    expect(result.feeTypes[0].code).toBe('TUITTION');
  })

  it('should not list soft deleted fee types', async () => {
    const feeType = await inMemoryFeeTypesRepository.save(feeTypeFactory({
      code: 'TUITTION'
    }), 'school-1');
    await inMemoryFeeTypesRepository.delete(feeType.id, 'school-1');

    const result = await sut.execute('school-1', {});

    expect(result.feeTypes).toHaveLength(0);
  })
})
